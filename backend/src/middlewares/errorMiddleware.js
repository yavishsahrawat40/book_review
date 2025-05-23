// backend/src/middlewares/errorMiddleware.js

// Handle 404 Not Found errors (for routes that don't exist)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the global error handler
};

// Global Error Handler
// This middleware should be the last piece of middleware added to app.js
export const errorHandler = (err, req, res, next) => {
  // Determine the status code: use the status code from the error if it exists,
  // otherwise default to 500 (Internal Server Error) if status code is 200 (OK).
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404; // Not Found
    message = "Resource not found (Invalid ID format).";
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400; // Bad Request
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for ${field}. Please use another value.`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    // Consolidate validation messages
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data: ${errors.join(". ")}`;
  }

  // JWT Errors (already partially handled in protect, but good to have a fallback)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401; // Unauthorized
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401; // Unauthorized
    message = "Your session has expired. Please log in again.";
  }

  res.status(statusCode).json({
    message: message,
    // Include stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
