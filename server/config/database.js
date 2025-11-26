import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DATABASE_NAME;

    await mongoose.connect(mongoUri, {
      dbName: dbName,
      retryWrites: true,
      w: 'majority',
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${dbName}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
};

export { connectDB, disconnectDB };
