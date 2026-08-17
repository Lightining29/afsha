import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowora';

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[Database] MongoDB connection error:', err.message);
    console.log('[Database] Server continuing. Please verify your MONGODB_URI in .env');
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB connection lost. Attempting reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Database] MongoDB reconnected successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[Database] MongoDB runtime error:', err.message);
  });
}
