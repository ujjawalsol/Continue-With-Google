const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  profilePic: { type: String, required: true }
}, { timestamps: true }
  // Add other fields as needed
);

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
