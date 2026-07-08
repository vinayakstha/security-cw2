import { Request, Response, NextFunction } from "express";
import { UserFavouriteService } from "../services/favourite.service";
import { z } from "zod";

// Optional: DTO to validate adding a favourite
const CreateFavouriteDto = z.object({
  serviceId: z.string(),
});

const favouriteService = new UserFavouriteService();

export class UserFavouriteController {
  // Add a favourite
  async addFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateFavouriteDto.parse(req.body);
      const userId = (req as any).user.id; // from auth middleware

      const favourite = await favouriteService.addFavourite(
        userId,
        parsedData.serviceId,
      );

      return res.status(201).json({
        success: true,
        message: "Service added to favourites",
        data: favourite,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }

  // Remove a favourite
  async removeFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const favouriteId = req.params.id;
      const userId = (req as any).user.id;

      const deleted = await favouriteService.removeFavourite(
        favouriteId,
        userId,
      );

      return res.status(200).json({
        success: true,
        message: "Favourite removed successfully",
        data: deleted,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }

  // Get all favourites of the current user
  async getFavouritesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

      const favourites = await favouriteService.getFavouritesByUser(userId);

      return res.status(200).json({
        success: true,
        message: "Favourites fetched successfully",
        data: favourites,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }
}
