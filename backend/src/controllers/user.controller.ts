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
      const userId = req.params.id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User Id not found" });
      }

      const user = await userService.getUserById(userId);
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
