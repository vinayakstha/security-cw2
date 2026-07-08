import mongoose from "mongoose";
import { FavouriteModel, IFavouriteModel } from "../models/favourite.model";

export interface IFavouriteRepository {
  createFavourite(
    favouriteData: Partial<IFavouriteModel>,
  ): Promise<IFavouriteModel>;
  deleteFavourite(favouriteId: string): Promise<boolean>;
  getFavouritesByUser(userId: string): Promise<IFavouriteModel[]>;
}

export class FavouriteRepository implements IFavouriteRepository {
  // Create a new favourite
  async createFavourite(
    favouriteData: Partial<IFavouriteModel>,
  ): Promise<IFavouriteModel> {
    const favourite = new FavouriteModel(favouriteData);
    return await favourite.save();
  }

  // Delete a favourite by its ID
  async deleteFavourite(favouriteId: string): Promise<boolean> {
    const result = await FavouriteModel.findByIdAndDelete(favouriteId);
    return !!result;
  }

  // Get all favourites for a user
  async getFavouritesByUser(userId: string): Promise<IFavouriteModel[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    return await FavouriteModel.find({ userId: objectId }).populate(
      "serviceId",
    );
  }
}
