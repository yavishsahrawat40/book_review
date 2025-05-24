import express from 'express';
import {
  getReviewsForBook,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByUser,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/book/:bookId', getReviewsForBook);
router.get('/user/:userId', getReviewsByUser);
router.post('/book/:bookId', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;