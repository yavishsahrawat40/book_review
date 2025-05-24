import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getUsers,
  deleteUser,
  updateUserByAdmin,
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/:id', getUserById);

router.get(
  '/',
  protect,
  admin,
  getUsers
);

router.delete(
  '/:id',
  protect,
  admin,
  deleteUser
);

router.put(
  '/:id',
  protect,
  admin,
  updateUserByAdmin
);

export default router;