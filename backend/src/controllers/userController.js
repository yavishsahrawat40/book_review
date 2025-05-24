import User from '../models/User.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        message: "User profile fetched successfully.",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          profilePic: user.profilePic,
          bio: user.bio,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found.');
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePic = req.body.profilePic || user.profilePic;
    user.bio = req.body.bio || user.bio;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long.');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User profile updated successfully.",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        profilePic: updatedUser.profilePic,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }
    });

  } catch (error) {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        error.message = `The ${field} '${error.keyValue[field]}' is already taken.`;
        res.status(400);
    }
    console.error('Error in updateUserProfile:', error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email -isAdmin');
    if (user) {
      res.json({
        message: "User public profile fetched successfully.",
        user: {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            createdAt: user.createdAt,
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error(`Error in getUserById for ID ${req.params.id}:`, error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ message: "Users fetched successfully.", users });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully.' });
    } catch (error) {
        next(error);
    }
};

export const updateUserByAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

        const updatedUser = await user.save();
        res.json({ message: "User updated by admin.", user: updatedUser });
    } catch (error) {
        next(error);
    }
};