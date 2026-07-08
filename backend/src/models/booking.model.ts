import mongoose, { Schema, Document } from "mongoose";
import { BookingType } from "../types/booking.type";

export interface IBookingModel
  extends Omit<BookingType, "userId" | "serviceId">, Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String },
    status: {
      type: String,
      enum: ["pending", "paid", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const BookingModel = mongoose.model<IBookingModel>(
  "Booking",
  BookingSchema,
);
