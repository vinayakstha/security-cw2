import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentModel extends Document {
  bookingId: mongoose.Types.ObjectId;
  pidx: string;
  transactionId?: string;
  totalPrice: number;
  fullName: string;
  email: string;
  paymentMethod?: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  khaltiStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentModel>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    pidx: { type: String, required: true },
    transactionId: { type: String },
    totalPrice: { type: Number, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "online"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    khaltiStatus: {
      type: String,
      enum: [
        "Completed",
        "Pending",
        "Initiated",
        "Refunded",
        "Expired",
        "User canceled",
      ],
    },
  },
  { timestamps: true },
);

export const PaymentModel = mongoose.model<IPaymentModel>(
  "Payment",
  PaymentSchema,
);
