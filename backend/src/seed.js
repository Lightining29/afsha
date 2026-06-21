import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';

dotenv.config();

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const DEFAULT_CATEGORIES = [
  'Skincare',
  'Wellness & Massage',
  'Hair Care',
  'Body',
  'Fragrance',
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowora');
    console.log('Connected to MongoDB');

    // Clear old admin/demo users
    await User.deleteMany({ email: { $in: ['admin@glowora.com', 'demo@glowora.com'] } });

    // Create admin and demo user only
    await User.create({
      name: 'Admin',
      email: 'admin@glowora.com',
      password: 'admin123',
      role: 'admin',
    });
    await User.create({
      name: 'Demo User',
      email: 'demo@glowora.com',
      password: 'demo123',
      role: 'user',
    });

    console.log('✓ Admin users created');
    console.log('Admin: admin@glowora.com / admin123');
    console.log('Demo user: demo@glowora.com / demo123');

    // Seed default categories (upsert by slug so re-running is safe)
    for (const name of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { slug: slugify(name) },
        { $setOnInsert: { name, slug: slugify(name) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✓ ${DEFAULT_CATEGORIES.length} categories ensured`);

    console.log('Add product images/counts via /admin — category names are seeded');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
