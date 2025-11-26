import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dhekaneakanksha68_db_user:AS5VMg97LlA2ljXD@photography-local.rh1jrxj.mongodb.net/?appName=photography-local";

export const connectDB = async () => {
  try {
    // Optional debug logging controlled by env
    if (process.env.MONGO_DEBUG === "true") {
      mongoose.set("debug", true);
    }

    // Wire up connection event listeners to make connection state visible in logs
    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected to database", mongoose.connection.name || process.env.DATABASE_NAME || "(unknown)");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err && err.message ? err.message : err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔁 Mongoose reconnected");
    });

    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DATABASE_NAME || "photography-local",
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

export const getDbStatus = () => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState;
};
