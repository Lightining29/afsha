import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 6, select: false },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // User Profile Details
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    // Email verification (OTP)
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpCooldownUntil: { type: Date, select: false },
    // Profile photo (binary, like product/category images)
    photoData: { type: Buffer, select: false },
    photoContentType: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
