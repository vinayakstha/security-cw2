import z from "zod";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto";
import { AdminCategoryService } from "../../services/admin/category.service";
import { NextFunction, Request, Response } from "express";

let categoryService = new AdminCategoryService();

export class AdminCategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate only the text fields
      const parsedData = CreateCategoryDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      // Handle file separately
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "categoryImage is required",
        });
      }

      const categoryData = {
        ...parsedData.data,
        categoryImage: `/uploads/${req.file.filename}`, // use file path
      };

      const newCategory = await categoryService.createCategory(categoryData);

      return res.status(201).json({
        success: true,
        message: "category created",
        data: newCategory,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.id;
      const parsedData = UpdateCategoryDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      if (req.file) {
        parsedData.data.categoryImage = `/uploads/${req.file.filename}`;
      }
      const updatedData: UpdateCategoryDTO = parsedData.data;
      const updatedCategory = await categoryService.updateCategory(
        categoryId,
        updatedData,
      );
      return res.status(200).json({
        success: true,
        message: "category updated",
        data: updatedCategory,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.id;
      const deleted = await categoryService.deleteCategory(categoryId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "category deleted",
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

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
