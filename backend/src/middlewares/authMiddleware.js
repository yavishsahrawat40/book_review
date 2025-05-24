import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided after Bearer.');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found.');
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        return next(new Error('Not authorized, token failed (invalid signature).'));
      }
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        return next(new Error('Not authorized, token expired.'));
      }
      res.status(res.statusCode === 200 ? 401 : res.statusCode);
      return next(new Error(error.message || 'Not authorized, token processing failed.'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token.'));
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin.'));
  }
};