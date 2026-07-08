import { FavouriteRepository } from "../../../repositories/favourite.repository";
import { FavouriteModel } from "../../../models/favourite.model";
import { CategoryModel } from "../../../models/category.model";
import { ServiceModel } from "../../../models/service.model";
import mongoose from "mongoose";

describe("Favourite Repository Unit Tests", () => {
  const favouriteRepository = new FavouriteRepository();

  let createdCategoryId: string;
  let createdServiceId: string;
  let createdUserId: string;
  let createdFavouriteId: string;

  beforeAll(async () => {
    const category = await CategoryModel.create({
      categoryName: "Plumbing Test",
      categoryImage: "plumbing.png",
    });
    createdCategoryId = category._id.toString();

    const service = await ServiceModel.create({
      serviceName: "Pipe Fixing",
      serviceImage: "pipe-fixing.png",
      serviceDescription: "Fix leaking pipes",
      price: "100",
      categoryId: new mongoose.Types.ObjectId(createdCategoryId),
    });
    createdServiceId = service._id.toString();

    createdUserId = new mongoose.Types.ObjectId().toString();

    await FavouriteModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
  });

  afterAll(async () => {
    await FavouriteModel.deleteMany({
      userId: new mongoose.Types.ObjectId(createdUserId),
    });
    await ServiceModel.findByIdAndDelete(createdServiceId);
    await CategoryModel.findByIdAndDelete(createdCategoryId);
  });

  test("should create a new favourite", async () => {
    const favourite = await favouriteRepository.createFavourite({
      userId: new mongoose.Types.ObjectId(createdUserId),
      serviceId: new mongoose.Types.ObjectId(createdServiceId),
    });

    expect(favourite).toBeDefined();
    expect(favourite._id).toBeDefined();
    expect(favourite.userId.toString()).toBe(createdUserId);
    expect(favourite.serviceId.toString()).toBe(createdServiceId);

    createdFavouriteId = favourite._id.toString();
  });

  test("should get all favourites by user", async () => {
    const favourites =
      await favouriteRepository.getFavouritesByUser(createdUserId);

    expect(Array.isArray(favourites)).toBe(true);
    expect(favourites.length).toBeGreaterThan(0);
    expect(favourites[0].userId.toString()).toBe(createdUserId);
  });

  test("should delete a favourite", async () => {
    const result =
      await favouriteRepository.deleteFavourite(createdFavouriteId);

    expect(result).toBe(true);

    const remaining =
      await favouriteRepository.getFavouritesByUser(createdUserId);
    expect(remaining.length).toBe(0);
  });
});
