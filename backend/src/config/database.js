import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowora', {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10_000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Server running without database — run npm run seed after starting MongoDB');
  }
}
