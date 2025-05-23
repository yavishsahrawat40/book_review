import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (Sign Up)
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (req, res, next) => {
  const { username, email, password, profilePic, bio } = req.body;

  try {
    // Check if user already exists (by email or username)
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      res.status(400); // Bad Request
      throw new Error('User with this email already exists.');
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      res.status(400);
      throw new Error('Username is already taken.');
    }

    // Create new user - password will be hashed by the pre-save hook in User model
    const user = await User.create({
      username,
      email,
      password, // Plain text password, will be hashed by Mongoose pre-save hook
      profilePic, // Optional
      bio,        // Optional
    });

    if (user) {
      // Don't send password back, even the hashed one, unless explicitly needed by frontend (rare)
      const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
        bio: user.bio,
        createdAt: user.createdAt,
      };

      res.status(201).json({
        message: 'User registered successfully. Please log in.',
        user: userResponse,
        // Optionally, you could automatically log in the user by generating a token here,
        // but typically signup and login are separate steps.
        // token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data. Registration failed.');
    }
  } catch (error) {
    // Pass the error to the global error handler (if you have one)
    // or handle it directly. For now, we send it.
    // If res.status was set before throwing, it will be used.
    if (!res.headersSent) { // Check if headers already sent to avoid ERR_HTTP_HEADERS_SENT
        res.status(res.statusCode !== 200 ? res.statusCode : 500); // Use existing status or default to 500
    }
    // Send a JSON error response
    res.json({
        message: error.message,
        // Optionally include stack in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password.');
    }

    // Find user by email - explicitly select password as it's normally excluded
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Password matches, generate token
      const token = generateToken(user._id, user.isAdmin);

      // Send user data (excluding password) and token
      res.status(200).json({
        message: 'Login successful.',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          profilePic: user.profilePic,
          bio: user.bio,
          createdAt: user.createdAt,
        },
        token: token,
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    if (!res.headersSent) {
        res.status(res.statusCode !== 200 ? res.statusCode : 500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
