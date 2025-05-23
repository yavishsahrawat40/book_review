import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register (sign up) a new user
// @access  Public
router.post('/signup', signupUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token (login)
// @access  Public
router.post('/login', loginUser);

// You can add other auth-related routes here later, e.g.:
// router.post('/forgot-password', forgotPasswordController);
// router.put('/reset-password/:token', resetPasswordController);
// router.get('/me', protect, getMyProfileController); // 'protect' would be auth middleware

export default router;
