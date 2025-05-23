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
      type: String, // URL to the cover image
      trim: true,
      default: 'https://placehold.co/300x450/E2E8F0/475569?text=No+Cover', // Default placeholder
    },
    isbn: {
      type: String,
      trim: true,
      // ISBNs should ideally be unique if you want to prevent duplicate book entries based on ISBN.
      // unique: true, // Uncomment if you want ISBNs to be unique. Consider implications for different editions.
      // match: [/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, 'Please fill a valid ISBN.'], // Basic ISBN-10/13 format check
      maxlength: [20, 'ISBN cannot exceed 20 characters.']
    },
    publishedDate: {
      type: Date,
      // No specific validation here, but can be added if needed
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
      // This will typically be calculated and updated when reviews are added/modified/deleted.
      // Using set to round the value to one decimal place.
      set: val => Math.round(val * 10) / 10
    },
    ratingsCount: { // To help calculate avgRating
      type: Number,
      default: 0,
      min: [0, 'Ratings count cannot be less than 0.']
    },
    // We could store an array of user IDs who added this book if needed for admin/tracking purposes
    // addedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   // required: true // If all books must be added by a user
    // }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// --- Indexes ---
// Indexing fields that are frequently queried can improve performance.
bookSchema.index({ title: 'text', author: 'text', genre: 'text' }); // For text search capabilities
bookSchema.index({ genre: 1 });
bookSchema.index({ avgRating: -1 }); // For sorting by rating

// --- Virtuals (Example - if you want to calculate something that's not stored directly) ---
// bookSchema.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id', // Find reviews where Review.book (foreignField) matches this book's _id
//   foreignField: 'book'
// });

// Ensure virtuals are included when converting to JSON or Object
// bookSchema.set('toObject', { virtuals: true });
// bookSchema.set('toJSON', { virtuals: true });


const Book = mongoose.model('Book', bookSchema);

export default Book;
