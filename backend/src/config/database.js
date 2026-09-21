import mongoose from 'mongoose';
import dns from 'dns';

export let lastDbError = null;

// Set Google & Cloudflare DNS to bypass Hostinger/ISP DNS SRV query failures
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore in restricted environments
}

export async function connectDB() {
  const directShardUri = 'mongodb://brayw433:Manish333@cluster0-shard-00-00.gmw98.mongodb.net:27017,cluster0-shard-00-01.gmw98.mongodb.net:27017,cluster0-shard-00-02.gmw98.mongodb.net:27017/ecommerce?ssl=true&authSource=admin';
  const srvUri = 'mongodb+srv://brayw433:Manish333@cluster0.gmw98.mongodb.net/ecommerce?retryWrites=true&w=majority';

  const envUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  // Try direct shard first if on shared hosting, or envUri
  const candidates = envUri ? [envUri, directShardUri, srvUri] : [directShardUri, srvUri];

  for (const uri of candidates) {
    try {
      const isSrv = uri.startsWith('mongodb+srv:');
      console.log(`[Database] Attempting connection via ${isSrv ? 'SRV' : 'Direct Shard'}...`);
      const conn = await mongoose.connect(uri, {
        maxPoolSize: 20,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 8_000,
        socketTimeoutMS: 45_000,
      });
      lastDbError = null;
      console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      lastDbError = err.message;
      console.error(`[Database] Candidate connection failed (${err.message}). Trying fallback...`);
    }
  }

  console.error('[Database] All MongoDB connection attempts failed. Last error:', lastDbError);
}

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  lastDbError = null;
  console.log('[Database] MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  lastDbError = err.message;
  console.error('[Database] MongoDB runtime error:', err.message);
});
