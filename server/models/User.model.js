const mongoose = require('mongoose'), bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['admin', 'manager', 'agent'], default: 'agent' },
  isActive:  { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resetPasswordToken:   { type: String, default: null },
  resetPasswordExpire:  { type: Date,   default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (pw) {
  return await bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);