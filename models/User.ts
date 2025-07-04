import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userType: {
    type: String,
    enum: ['user', 'sponsor', 'admin', 'college'],
    required: [true, 'User type is required'],
  },
  location: {
    type: String,
    default: '',
  },
  contactPerson: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  bio: String,
  avatar: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
