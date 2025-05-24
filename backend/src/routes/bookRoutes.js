import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);

router.post(
  '/',
  protect,
  admin,
  createBook
);

router.put(
  '/:id',
  protect,
  admin,
  updateBook
);

router.delete(
  '/:id',
  protect,
  admin,
  deleteBook
);

export default router;