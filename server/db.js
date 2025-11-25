import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dhekaneakanksha68_db_user:AS5VMg97LlA2ljXD@photography-local.rh1jrxj.mongodb.net/?appName=photography-local";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "photography-local",
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error);
  }
};
