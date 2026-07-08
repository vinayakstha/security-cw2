import mongoose, { Document, Schema } from "mongoose";
import { CategoryType } from "../types/category.type";

const CategorySchema: Schema = new Schema<CategoryType>({
  categoryName: { type: String, required: true },
  categoryImage: { type: String, required: true },
});

export interface ICategory extends CategoryType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CategoryModel = mongoose.model<ICategory>(
  "Category",
  CategorySchema,
);
