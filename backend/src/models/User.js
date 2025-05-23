import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long.'],
      maxlength: [30, 'Username cannot exceed 30 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false, // Password field will not be returned by default in queries
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      trim: true,
      default: 'https://placehold.co/150x150/E2E8F0/475569?text=User', // Default placeholder
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [250, 'Bio cannot exceed 250 characters.'],
      default: '',
    },
    // We can link reviews directly or use virtuals.
    // For simplicity, we might not store reviews directly on the user if the number can be very large.
    // Instead, we'd query reviews by userId.
    // reviews: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Review'
    // }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// --- Mongoose Middleware ---

// Pre-save hook to hash password before saving a new user or when password is modified
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended
    // Hash the password using the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware/error handler
  }
});

// --- Mongoose Instance Methods ---

// Method to compare candidate password with the user's hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // 'this.password' refers to the hashed password in the database for this user instance.
    // Since 'select: false' is on the password field, we need to ensure it's selected
    // if we are calling this on a document that didn't explicitly select it.
    // However, when creating/saving, 'this.password' will be available.
    // For login, you'd fetch the user WITH the password: User.findOne({ email }).select('+password')
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error; // Or handle error appropriately
  }
};

const User = mongoose.model('User', userSchema);

export default User;
