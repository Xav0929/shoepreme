import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface CustomerDocument extends Document {
  shopifyCustomerId: string;
  displayName: string;
  email?: string;
  phone?: string;
  numberOfOrders?: number;
  disabled: boolean;
  disableReason?: string;
  appeal?: {
    reason: string;
    message: string;
    contactPreference?: string;
    submittedAt: Date;
    status: "pending" | "resolved";
  };
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<CustomerDocument>(
  {
    shopifyCustomerId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    numberOfOrders: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    disableReason: { type: String },
    appeal: {
      reason: { type: String },
      message: { type: String },
      contactPreference: { type: String },
      submittedAt: { type: Date },
      status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    },
  },
  { timestamps: true },
);

export const Customer: Model<CustomerDocument> =
  mongoose.models.Customer ||
  mongoose.model<CustomerDocument>("Customer", CustomerSchema);