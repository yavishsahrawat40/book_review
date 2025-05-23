// backend/src/routes/userRoutes.js
import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js"; // Import the middleware

const router = express.Router();

// @desc    Get current user's profile (example protected route)
// @route   GET /api/users/profile
// @access  Private (requires login)
router.get(
  "/profile",
  protect, // Apply the 'protect' middleware here
  (req, res) => {
    // If protect middleware passes, req.user will be available
    if (req.user) {
      res.json({
        message: "Successfully accessed protected profile route!",
        user: req.user,
      });
    } else {
      // This case should ideally be handled by the protect middleware itself
      res
        .status(401)
        .json({
          message: "Not authorized, user data not found after protection.",
        });
    }
  }
);

// @desc    Example admin-only route
// @route   GET /api/users/admin-dashboard
// @access  Private/Admin
router.get(
  "/admin-dashboard",
  protect, // First, ensure user is logged in
  admin, // Then, ensure user is an admin
  (req, res) => {
    res.json({
      message: "Welcome to the Admin Dashboard!",
      adminUser: req.user,
    });
  }
);

export default router;
