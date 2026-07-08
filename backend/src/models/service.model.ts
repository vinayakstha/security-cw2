import mongoose, { Schema, Document } from "mongoose";
import { ServiceType } from "../types/service.type";

export interface IServiceModel
  extends Omit<ServiceType, "categoryId">, Document {
  _id: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceModel>(
  {
    serviceName: { type: String, required: true },
    serviceDescription: { type: String, required: true },
    serviceImage: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId, // keep Schema.Types.ObjectId in schema
      ref: "Category",
      required: true,
    },
    price: { type: String, required: true },
  },
  { timestamps: true },
);

export const ServiceModel = mongoose.model<IServiceModel>(
  "Service",
  ServiceSchema,
);
