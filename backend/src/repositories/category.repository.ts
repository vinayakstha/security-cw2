import { CategoryModel, ICategory } from "../models/category.model";
import { UserModel } from "../models/user.model";

export interface ICategoryRepository {
  createCategory(categoryData: Partial<ICategory>): Promise<ICategory>;
  updateCategory(
    id: string,
    updateData: Partial<ICategory>,
  ): Promise<ICategory | null>;
  deleteCategory(id: string): Promise<boolean>;
  getAllCategories(): Promise<ICategory[]>;
  getCategoryById(id: string): Promise<ICategory | null>;
  getCategoryByName(categoryName: string): Promise<ICategory | null>;
}

export class CategoryRepository implements ICategoryRepository {
  async getCategoryByName(categoryName: string): Promise<ICategory | null> {
    const category = await CategoryModel.findOne({
      categoryName: categoryName,
    });
    return category;
  }
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const category = new CategoryModel(categoryData);
    return await category.save();
  }
  async updateCategory(
    id: string,
    updateData: Partial<ICategory>,
  ): Promise<ICategory | null> {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    return updatedCategory;
  }
  async deleteCategory(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return result ? true : false;
  }
  async getAllCategories(): Promise<ICategory[]> {
    const categories = await CategoryModel.find();
    return categories;
  }
  async getCategoryById(id: string): Promise<ICategory | null> {
    const category = await CategoryModel.findById(id);
    return category;
  }
}
