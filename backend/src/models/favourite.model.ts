import mongoose, { Schema, Document } from "mongoose";
import { FavouriteType } from "../types/favourite.type";

export interface IFavouriteModel extends Document {
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavouriteSchema = new Schema<IFavouriteModel>(
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
  },
  { timestamps: true },
);

FavouriteSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

export const FavouriteModel = mongoose.model<IFavouriteModel>(
  "Favourite",
  FavouriteSchema,
);
