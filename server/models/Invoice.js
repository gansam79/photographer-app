import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      default: null,
    },
    eventType: {
      type: String,
      enum: ["Wedding", "Pre-wedding", "Other"],
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        serviceName: String,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        days: {
          type: Number,
          default: 1,
          min: 1,
        },
        ratePerDay: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Partially Paid", "Unpaid"],
      default: "Unpaid",
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    thankYouMessage: {
      type: String,
      default: "Thank you for your business. We appreciate your support!",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", invoiceSchema);
