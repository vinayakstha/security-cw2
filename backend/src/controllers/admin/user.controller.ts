import z from "zod";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { AdminUserService } from "../../services/admin/user.service";
import { Request, Response, NextFunction } from "express";

const GetAllUsersQuerySchema = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  search: z.string().optional(),
});

let adminUserService = new AdminUserService();

export class AdminUserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }
      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }
      const userData: CreateUserDTO = parsedData.data;
      const newUser = await adminUserService.createUser(userData);
      return res.status(201).json({
        success: true,
        message: "user created",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "internal server error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = GetAllUsersQuerySchema.safeParse(req.query);
      if (!parsedQuery.success) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid query parameters" });
      }
      const { page, size, search } = parsedQuery.data;
      const { users, pagination } = await adminUserService.getAllUsers(
        page,
        size,
        search,
      );
      return res.status(200).json({
        success: true,
        data: users,
        pagination: pagination,
        message: "All Users Retrieved",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }
      const updateData: UpdateUserDTO = parsedData.data;
      const updatedUser = await adminUserService.updateUser(userId, updateData);
      return res.status(200).json({
        success: true,
        message: "user updated",
        data: updatedUser,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        succcess: false,
        message: "internal server error",
      });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const deleted = await adminUserService.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User deleted",
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message || "internal server error",
      });
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getUserById(userId);
      return res.status(200).json({
        success: true,
        message: "user retrived",
        data: user,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "internal server error",
      });
    }
  }
}
