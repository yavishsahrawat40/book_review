import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const signupUser = async (req, res, next) => {
  const { username, email, password, profilePic, bio } = req.body;

  try {
    // Check if user already exists (by email or username)
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      res.status(400);
      throw new Error('User with this email already exists.');
    }

    const userExistsByUsername = await User.findOne({ username });
    if (userExistsByUsername) {
      res.status(400);
      throw new Error('Username is already taken.');
    }

    // Create new user 
    const user = await User.create({
      username,
      email,
      password, 
      profilePic, // Optional
      bio,        // Optional
    });

    if (user) {
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
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data. Registration failed.');
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

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id, user.isAdmin);

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
      res.status(401); 
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
