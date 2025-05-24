import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

export const getReviewsForBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const page = parseInt(req.query.page) || 1;

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      res.status(404);
      throw new Error('Book not found, cannot fetch reviews.');
    }

    const queryConditions = { book: bookId };

    const count = await Review.countDocuments(queryConditions);
    const reviews = await Review.find(queryConditions)
      .populate('user', 'username profilePic')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      message: 'Reviews fetched successfully.',
      reviews,
      page,
      pages: Math.ceil(count / pageSize),
      totalReviews: count,
    });
  } catch (error) {
    console.error(`Error in getReviewsForBook for book ID ${req.params.bookId}:`, error);
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found. Cannot create review.');
    }

    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this book.');
    }

    if (!rating || !comment) {
        res.status(400);
        throw new Error('Rating and comment are required.');
    }
    if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5.');
    }

    const review = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    const createdReview = await review.save();

    const populatedReview = await Review.findById(createdReview._id)
                                        .populate('user', 'username profilePic');

    res.status(201).json({ message: 'Review created successfully.', review: populatedReview });
  } catch (error) {
    console.error(`Error in createReview for book ID ${bookId}:`, error);
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found.');
    }

    if (review.user.toString() !== userId.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this review.');
    }

    if (rating) {
        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5.');
        }
        review.rating = rating;
    }
    if (comment) {
        review.comment = comment;
    }
    
    const updatedReview = await review.save();

    const populatedReview = await Review.findById(updatedReview._id)
                                        .populate('user', 'username profilePic');

    res.json({ message: 'Review updated successfully.', review: populatedReview });
  } catch (error) {
    console.error(`Error in updateReview for review ID ${reviewId}:`, error);
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404);
      throw new Error('Review not found.');
    }

    if (review.user.toString() !== userId.toString() && !isAdmin) {
      res.status(403);
      throw new Error('User not authorized to delete this review.');
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
        res.status(404);
        throw new Error('Review not found for deletion.');
    }

    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error(`Error in deleteReview for review ID ${reviewId}:`, error);
    next(error);
  }
};

export const getReviewsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const page = parseInt(req.query.page) || 1;

    const userExists = await User.findById(userId);
    if (!userExists) {
      res.status(404);
      throw new Error('User not found, cannot fetch their reviews.');
    }

    const queryConditions = { user: userId };

    const count = await Review.countDocuments(queryConditions);
    const reviews = await Review.find(queryConditions)
      .populate('book', 'title coverImage author _id')
      .populate('user', 'username profilePic')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      message: `Reviews by user ${userExists.username} fetched successfully.`,
      reviews,
      page,
      pages: Math.ceil(count / pageSize),
      totalReviews: count,
    });
  } catch (error) {
    console.error(`Error in getReviewsByUser for user ID ${req.params.userId}:`, error);
    next(error);
  }
};