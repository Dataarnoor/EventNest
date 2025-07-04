import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 30000; // 30 seconds

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectDB(retryCount = 0) {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return mongoose.connection;
    }

    const conn = await mongoose.connect(MONGODB_URI!, {
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
    });

    // Add a ping to check connection health
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB ping successful');
      } else {
        console.warn('mongoose.connection.db is undefined, skipping ping.');
      }
    } catch (pingErr) {
      console.error('MongoDB ping failed:', pingErr);
    }

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', async () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      await connectDB();
    });

    return mongoose.connection;
  } catch (error) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds...`);
      await delay(RETRY_DELAY);
      return connectDB(retryCount + 1);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${error.message}`);
    } else {
      throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${String(error)}`);
    }
  }
}

export default connectDB;
