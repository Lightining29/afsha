import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { sendOtp } from '../services/email.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'glowora-dev-secret',
    { expiresIn: '7d' }
  );
}

function userResponse(user, token) {
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoContentType ? `/api/images/user/${user._id}` : null,
    },
  };
}

// Helper to generate and send OTP
async function generateAndSendOtp(user) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(12);
  user.otpHash = await bcrypt.hash(code, salt);
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.otpCooldownUntil = new Date(Date.now() + 60 * 1000); // 1 minute
  await user.save();
  await sendOtp(user.email, code);
}

router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const adminEmails = ['admin@glowora.com', 'brayw433@gmail.com'];
    const isAdminEmail = adminEmails.includes(email.toLowerCase());

    let user;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      if (exists.isVerified || isAdminEmail) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      // Update unverified user's credentials and profile photo
      exists.name = name;
      exists.password = password;
      if (req.file) {
        exists.photoData = req.file.buffer;
        exists.photoContentType = req.file.mimetype;
      }
      user = exists;
    } else {
      const userData = { 
        name, 
        email: email.toLowerCase(), 
        password, 
        isVerified: isAdminEmail ? true : false,
        role: isAdminEmail ? 'admin' : 'user'
      };
      if (req.file) {
        userData.photoData = req.file.buffer;
        userData.photoContentType = req.file.mimetype;
      }
      user = new User(userData);
    }

    if (isAdminEmail) {
      await user.save();
      const token = signToken(user);
      return res.status(201).json(userResponse(user, token));
    }

    await generateAndSendOtp(user);
    res.status(200).json({
      requireVerification: true,
      email: user.email,
      message: 'Verification OTP sent to your email address.',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +otpCooldownUntil');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const adminEmails = ['admin@glowora.com', 'brayw433@gmail.com'];
    const isAdminEmail = adminEmails.includes(user.email.toLowerCase()) || user.role === 'admin';

    if (!user.isVerified && !isAdminEmail) {
      // Trigger OTP resend if not in cooldown
      if (!user.otpCooldownUntil || user.otpCooldownUntil < Date.now()) {
        await generateAndSendOtp(user);
      }
      return res.status(403).json({
        requireVerification: true,
        email: user.email,
        message: 'Your email is not verified. A verification code has been sent to your email.',
      });
    }

    const token = signToken(user);
    res.json(userResponse(user, token));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otpHash +otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(code, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    user.otpCooldownUntil = undefined;
    await user.save();

    const token = signToken(user);
    res.json(userResponse(user, token));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otpCooldownUntil');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otpCooldownUntil && user.otpCooldownUntil > Date.now()) {
      const waitSec = Math.ceil((user.otpCooldownUntil - Date.now()) / 1000);
      return res.status(400).json({ message: `Please wait ${waitSec}s before requesting a new OTP.` });
    }

    await generateAndSendOtp(user);
    res.json({ message: 'Verification OTP resent to your email address.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      photoUrl: user.photoContentType ? `/api/images/user/${user._id}` : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
