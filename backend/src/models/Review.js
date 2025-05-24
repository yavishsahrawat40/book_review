import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, 'Review comment cannot be empty.'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters.'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating must be at most 5.'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for rating.'
      }
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    }
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ book: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (bookId) {
  const Book = mongoose.model('Book');

  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        ratingsCount: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await Book.findByIdAndUpdate(bookId, {
        ratingsCount: stats[0].ratingsCount,
        avgRating: stats[0].avgRating,
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        ratingsCount: 0,
        avgRating: 0,
      });
    }
  } catch (error) {
    console.error('Error updating average rating on book:', error);
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.book);
});

reviewSchema.pre('findOneAndDelete', async function(next) {
  try {
    this.docToDelete = await this.model.findOne(this.getQuery());
    next();
  } catch (error) {
    next(error);
  }
});

reviewSchema.post('findOneAndDelete', async function() {
  if (this.docToDelete) {
    await this.docToDelete.constructor.calculateAverageRating(this.docToDelete.book);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;