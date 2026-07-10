import z from "zod";
import { UpdateUserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

let userService = new UserService();

export class UserController {
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User Id not found" });
      }
      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }
      if (req.file) {
        parsedData.data.profilePicture = `/uploads/${req.file.filename}`;
      }
      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User profile updated successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const targetUserId = req.params.id;
      if (!targetUserId) {
        return res
          .status(400)
          .json({ success: false, message: "User Id not found" });
      }

      // IDOR protection: users can only view their own profile,
      // unless they are an admin.
      const requestingUserId = req.user?._id?.toString();
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && requestingUserId !== targetUserId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: you can only view your own profile",
        });
      }

      const user = await userService.getUserById(targetUserId);
      const userObj = (user as any).toObject
        ? (user as any).toObject()
        : { ...user };
      if (userObj.password) delete userObj.password;

      return res.status(200).json({ success: true, data: userObj });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user = await userService.getCurrentUser(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
