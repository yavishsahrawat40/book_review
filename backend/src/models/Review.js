import mongoose from 'mongoose';
// We need to import the Book model to update its average rating
// We'll use a try-catch for the import in the static method to avoid circular dependency issues
// if Review model is imported before Book model in some other file.
// A better way is to ensure Book is always defined before Review is used this way,
// or pass the Book model as an argument to the static method if needed.

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
      ref: 'Book', // Reference to the Book model
      required: [true, 'Review must belong to a book.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Review must belong to a user.'],
    },
    // username: { // Optional: denormalize username for easier display, but can lead to data inconsistency
    //   type: String,
    //   required: true
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// --- Indexes ---
// Indexing book and user fields can speed up queries for reviews of a specific book or by a specific user.
reviewSchema.index({ book: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ book: 1, user: 1 }, { unique: true }); // Optional: ensure a user can only review a book once.

// --- Static Method to Calculate Average Rating on Book ---
reviewSchema.statics.calculateAverageRating = async function (bookId) {
  // 'this' refers to the Review model itself
  const Book = mongoose.model('Book'); // Get the Book model

  const stats = await this.aggregate([
    {
      $match: { book: bookId }, // Filter reviews for the given bookId
    },
    {
      $group: {
        _id: '$book', // Group by book
        ratingsCount: { $sum: 1 }, // Count the number of reviews
        avgRating: { $avg: '$rating' }, // Calculate the average of the 'rating' field
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
      // If no reviews are left, reset the book's rating fields
      await Book.findByIdAndUpdate(bookId, {
        ratingsCount: 0,
        avgRating: 0,
      });
    }
  } catch (error) {
    console.error('Error updating average rating on book:', error);
    // Decide how to handle this error. Maybe re-throw or log.
  }
};

// --- Middleware Hooks ---

// Call calculateAverageRating after a review is saved
reviewSchema.post('save', function () {
  // 'this' refers to the current review document
  // 'this.constructor' refers to the model (Review)
  this.constructor.calculateAverageRating(this.book);
});

// Call calculateAverageRating before/after a review is removed
// For findByIdAndRemove or findOneAndRemove, 'this' is the query, not the document.
// So, we use a pre-hook to get the document, and a post-hook to act after removal.
reviewSchema.pre('findOneAndDelete', async function(next) {
  // 'this.getQuery()' gives the query conditions. We need to find the doc to get its bookId.
  // Mongoose 8+ findOneAndDelete returns the document by default.
  // For older versions, you might need: this._conditions
  try {
    // this.model.findOne(this.getQuery()) should give the document being deleted
    // Store it on the query object to access in the post hook
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

// If you use .remove() on a document instance, the 'remove' hook is simpler:
// reviewSchema.post('remove', function() {
//   this.constructor.calculateAverageRating(this.book);
// });


const Review = mongoose.model('Review', reviewSchema);

export default Review;
