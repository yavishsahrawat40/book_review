import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required.'],
      trim: true,
      maxlength: [200, 'Book title cannot exceed 200 characters.'],
    },
    author: {
      type: String,
      required: [true, 'Book author is required.'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters.'],
    },
    genre: {
      type: String,
      required: [true, 'Book genre is required.'],
      trim: true,
      maxlength: [50, 'Genre cannot exceed 50 characters.'],
    },
    description: {
      type: String,
      required: [true, 'Book description is required.'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: 'https://placehold.co/300x450/E2E8F0/475569?text=No+Cover',
    },
    isbn: {
      type: String,
      trim: true,
      maxlength: [20, 'ISBN cannot exceed 20 characters.']
    },
    publishedDate: {
      type: Date,
    },
    pageCount: {
      type: Number,
      min: [1, 'Page count must be at least 1.'],
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for page count.'
      }
    },
    avgRating: {
      type: Number,
      default: 0,
      min: [0, 'Average rating cannot be less than 0.'],
      max: [5, 'Average rating cannot be more than 5.'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, 'Ratings count cannot be less than 0.']
    }
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ avgRating: -1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;