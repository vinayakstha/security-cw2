import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services/category.service";

let categoryService = new CategoryService();

export class CategoryController {
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.id;
      const category = await categoryService.getCategoryById(categoryId);
      return res.status(200).json({
        success: true,
        message: "category retrived",
        data: category,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      return res.status(200).json({
        success: true,
        message: "all categories fetched",
        data: categories,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
}
