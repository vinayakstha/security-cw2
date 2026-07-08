import { HttpError } from "../errors/http-error";
import { FavouriteRepository } from "../repositories/favourite.repository";
import { ServiceRepository } from "../repositories/service.repository";
import mongoose from "mongoose";

const favouriteRepository = new FavouriteRepository();
const serviceRepository = new ServiceRepository();

export class UserFavouriteService {
  // Add a service to favourites
  async addFavourite(userId: string, serviceId: string) {
    // Check if service exists
    const service = await serviceRepository.getServiceById(serviceId);
    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    // Check if already favourited
    const existingFavourites =
      await favouriteRepository.getFavouritesByUser(userId);
    const alreadyFavourite = existingFavourites.find(
      (f) => f.serviceId.toString() === serviceId,
    );

    if (alreadyFavourite) {
      throw new HttpError(400, "Service is already in favourites");
    }

    // Create favourite
    const favourite = await favouriteRepository.createFavourite({
      userId: new mongoose.Types.ObjectId(userId),
      serviceId: new mongoose.Types.ObjectId(serviceId),
    });

    return favourite;
  }

  // Remove a service from favourites
  async removeFavourite(favouriteId: string, userId: string) {
    const favourite = await favouriteRepository.getFavouritesByUser(userId);
    const target = favourite.find((f) => f._id.toString() === favouriteId);

    if (!target) {
      throw new HttpError(404, "Favourite not found for this user");
    }

    const deleted = await favouriteRepository.deleteFavourite(favouriteId);

    if (!deleted) {
      throw new HttpError(500, "Failed to remove favourite");
    }

    return deleted;
  }

  // Get all favourites of a user
  async getFavouritesByUser(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpError(400, "Invalid user ID");
    }

    const favourites = await favouriteRepository.getFavouritesByUser(userId);

    return favourites;
  }
}
