import { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto";
import { HttpError } from "../../errors/http-error";
import { CategoryRepository } from "../../repositories/category.repository";

let categoryRepository = new CategoryRepository();

export class AdminCategoryService {
  async createCategory(data: CreateCategoryDTO) {
    const nameCheck = await categoryRepository.getCategoryByName(
      data.categoryName,
    );
    if (nameCheck) {
      throw new HttpError(403, "Category name already in use");
    }
    const newCategory = await categoryRepository.createCategory(data);
    return newCategory;
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDTO) {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) {
      throw new HttpError(404, "category not found");
    }
    if (category.categoryName !== data.categoryName) {
      const nameExists = await categoryRepository.getCategoryByName(
        data.categoryName!,
      );
      if (nameExists) {
        throw new HttpError(403, "Category name already in use");
      }
    }
    const updatedData: any = {};
    if (data.categoryName) updatedData.categoryName = data.categoryName;
    if (data.categoryImage) updatedData.categoryImage = data.categoryImage;

    const updatedCategory = await categoryRepository.updateCategory(
      categoryId,
      updatedData,
    );
    return updatedCategory;
  }

  async getCategoryById(categoryId: string) {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category) {
      throw new HttpError(404, "category not found");
    }
    return category;
  }

  async getAllCategories() {
    const categories = categoryRepository.getAllCategories();
    return categories;
  }

  async deleteCategory(categoryId: string) {
    const category = await categoryRepository.deleteCategory(categoryId);
    if (!category) {
      throw new HttpError(404, "category not found");
    }
    return category;
  }
}
