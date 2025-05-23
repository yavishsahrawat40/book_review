// backend/src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // To fetch user details from DB

// Middleware to protect routes - requires user to be logged in
export const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1Ni...")
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token provided after Bearer.');
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach it to the request object
      // Exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found.');
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Authentication error:', error.message);
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        return next(new Error('Not authorized, token failed (invalid signature).'));
      }
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        return next(new Error('Not authorized, token expired.'));
      }
      // For other errors caught by the try-catch or errors thrown above
      res.status(res.statusCode === 200 ? 401 : res.statusCode); // Keep existing error status or default to 401
      return next(new Error(error.message || 'Not authorized, token processing failed.'));
    }
  }

  if (!token) {
    res.status(401);
    // Use next(error) so it can be handled by a global error handler if you have one.
    // Otherwise, you might send a response directly like: res.status(401).json({ message: 'Not authorized, no token' });
    next(new Error('Not authorized, no token.'));
  }
};

// Middleware to check for admin privileges - should be used AFTER 'protect'
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(403); // Forbidden
    next(new Error('Not authorized as an admin.'));
  }
};
