import { HttpError } from "../errors/http-error";
import { CategoryRepository } from "../repositories/category.repository";

let categoryRepository = new CategoryRepository();

export class CategoryService {
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
}
