import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["photography", "video", "drone", "product", "other"],
      default: "photography",
    },
    ratePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    ratePerUnit: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);
