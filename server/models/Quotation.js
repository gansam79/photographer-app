import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    eventType: {
      type: String,
      enum: ["Wedding", "Pre-wedding", "Other"],
      required: true,
    },
    quotationDate: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    validityDate: {
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
    paymentTerms: {
      type: String,
      default: "50% advance, 50% on event date",
    },
    notes: {
      type: String,
      trim: true,
    },
    thankYouMessage: {
      type: String,
      default:
        "Thank you for choosing The Patil Photography & Film's. We look forward to capturing your special moments!",
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected"],
      default: "Draft",
    },
    convertedToInvoice: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Quotation", quotationSchema);
