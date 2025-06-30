const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
userName: String, 
userEmail: String,
role: String,
password: String, 
});

const User = mongoose.model("User", userSchema); 

module.exports = User;


/* Plan B for authentication step 
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['support', 'ops_manager', 'admin'],
    default: 'support'
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// Pre-save middleware to hash passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method to validate password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
*/ 