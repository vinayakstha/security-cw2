import mongoose from "mongoose";
import { UserFavouriteService } from "../../../services/favourite.service";
import { FavouriteRepository } from "../../../repositories/favourite.repository";
import { ServiceRepository } from "../../../repositories/service.repository";
import { HttpError } from "../../../errors/http-error";

// ── Mock repositories ────────────────────────────────────────────────────────
jest.mock("../../../repositories/favourite.repository");
jest.mock("../../../repositories/service.repository");

// ── Helpers ──────────────────────────────────────────────────────────────────
const makeId = () => new mongoose.Types.ObjectId().toString();

const makeFavourite = (overrides: Record<string, unknown> = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  userId: new mongoose.Types.ObjectId(),
  serviceId: new mongoose.Types.ObjectId(),
  ...overrides,
});

// ── Setup ────────────────────────────────────────────────────────────────────
describe("UserFavouriteService", () => {
  let service: UserFavouriteService;
  let favouriteRepo: jest.Mocked<FavouriteRepository>;
  let serviceRepo: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Build manual mocks for each method
    favouriteRepo = {
      createFavourite: jest.fn(),
      deleteFavourite: jest.fn(),
      getFavouritesByUser: jest.fn(),
    } as unknown as jest.Mocked<FavouriteRepository>;

    serviceRepo = {
      getServiceById: jest.fn(),
      getAllServices: jest.fn(),
      createService: jest.fn(),
      updateService: jest.fn(),
      deleteService: jest.fn(),
      getServicesByCategory: jest.fn(),
    } as unknown as jest.Mocked<ServiceRepository>;

    // Spy on prototypes so the service's internally-created instances
    // use our mock implementations
    jest
      .spyOn(FavouriteRepository.prototype, "createFavourite")
      .mockImplementation(favouriteRepo.createFavourite);
    jest
      .spyOn(FavouriteRepository.prototype, "deleteFavourite")
      .mockImplementation(favouriteRepo.deleteFavourite);
    jest
      .spyOn(FavouriteRepository.prototype, "getFavouritesByUser")
      .mockImplementation(favouriteRepo.getFavouritesByUser);
    jest
      .spyOn(ServiceRepository.prototype, "getServiceById")
      .mockImplementation(serviceRepo.getServiceById);

    service = new UserFavouriteService();
  });

  // ── addFavourite ────────────────────────────────────────────────────────────
  describe("addFavourite", () => {
    it("should add a favourite successfully", async () => {
      const userId = makeId();
      const serviceId = makeId();
      const favourite = makeFavourite({
        userId: new mongoose.Types.ObjectId(userId),
        serviceId: new mongoose.Types.ObjectId(serviceId),
      });

      serviceRepo.getServiceById.mockResolvedValue({ _id: serviceId } as any);
      favouriteRepo.getFavouritesByUser.mockResolvedValue([]);
      favouriteRepo.createFavourite.mockResolvedValue(favourite as any);

      const result = await service.addFavourite(userId, serviceId);

      expect(serviceRepo.getServiceById).toHaveBeenCalledWith(serviceId);
      expect(favouriteRepo.getFavouritesByUser).toHaveBeenCalledWith(userId);
      expect(favouriteRepo.createFavourite).toHaveBeenCalledWith({
        userId: expect.any(mongoose.Types.ObjectId),
        serviceId: expect.any(mongoose.Types.ObjectId),
      });
      expect(result).toEqual(favourite);
    });

    it("should throw 404 when service does not exist", async () => {
      const userId = makeId();
      const serviceId = makeId();

      serviceRepo.getServiceById.mockResolvedValue(null);

      await expect(service.addFavourite(userId, serviceId)).rejects.toThrow(
        new HttpError(404, "Service not found"),
      );

      expect(favouriteRepo.getFavouritesByUser).not.toHaveBeenCalled();
      expect(favouriteRepo.createFavourite).not.toHaveBeenCalled();
    });

    it("should throw 400 when service is already in favourites", async () => {
      const userId = makeId();
      const serviceId = makeId();
      const existingFavourite = makeFavourite({
        serviceId: new mongoose.Types.ObjectId(serviceId),
      });

      serviceRepo.getServiceById.mockResolvedValue({ _id: serviceId } as any);
      favouriteRepo.getFavouritesByUser.mockResolvedValue([
        existingFavourite as any,
      ]);

      await expect(service.addFavourite(userId, serviceId)).rejects.toThrow(
        new HttpError(400, "Service is already in favourites"),
      );

      expect(favouriteRepo.createFavourite).not.toHaveBeenCalled();
    });
  });

  // ── removeFavourite ─────────────────────────────────────────────────────────
  describe("removeFavourite", () => {
    it("should remove a favourite successfully", async () => {
      const userId = makeId();
      const favouriteId = new mongoose.Types.ObjectId();
      const favourite = makeFavourite({ _id: favouriteId });

      favouriteRepo.getFavouritesByUser.mockResolvedValue([favourite as any]);
      favouriteRepo.deleteFavourite.mockResolvedValue(true);

      const result = await service.removeFavourite(
        favouriteId.toString(),
        userId,
      );

      expect(favouriteRepo.getFavouritesByUser).toHaveBeenCalledWith(userId);
      expect(favouriteRepo.deleteFavourite).toHaveBeenCalledWith(
        favouriteId.toString(),
      );
      expect(result).toBe(true);
    });

    it("should throw 404 when favourite does not belong to user", async () => {
      const userId = makeId();
      const favouriteId = makeId();

      favouriteRepo.getFavouritesByUser.mockResolvedValue([
        makeFavourite() as any,
      ]);

      await expect(
        service.removeFavourite(favouriteId, userId),
      ).rejects.toThrow(
        new HttpError(404, "Favourite not found for this user"),
      );

      expect(favouriteRepo.deleteFavourite).not.toHaveBeenCalled();
    });

    it("should throw 404 when user has no favourites", async () => {
      const userId = makeId();
      const favouriteId = makeId();

      favouriteRepo.getFavouritesByUser.mockResolvedValue([]);

      await expect(
        service.removeFavourite(favouriteId, userId),
      ).rejects.toThrow(
        new HttpError(404, "Favourite not found for this user"),
      );

      expect(favouriteRepo.deleteFavourite).not.toHaveBeenCalled();
    });

    it("should throw 500 when deletion fails", async () => {
      const userId = makeId();
      const favouriteId = new mongoose.Types.ObjectId();
      const favourite = makeFavourite({ _id: favouriteId });

      favouriteRepo.getFavouritesByUser.mockResolvedValue([favourite as any]);
      favouriteRepo.deleteFavourite.mockResolvedValue(false);

      await expect(
        service.removeFavourite(favouriteId.toString(), userId),
      ).rejects.toThrow(new HttpError(500, "Failed to remove favourite"));
    });
  });

  // ── getFavouritesByUser ─────────────────────────────────────────────────────
  describe("getFavouritesByUser", () => {
    it("should return a list of favourites for a valid user", async () => {
      const userId = makeId();
      const favourites = [makeFavourite(), makeFavourite()];

      favouriteRepo.getFavouritesByUser.mockResolvedValue(favourites as any);

      const result = await service.getFavouritesByUser(userId);

      expect(favouriteRepo.getFavouritesByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(favourites);
    });

    it("should return an empty array when user has no favourites", async () => {
      const userId = makeId();

      favouriteRepo.getFavouritesByUser.mockResolvedValue([]);

      const result = await service.getFavouritesByUser(userId);

      expect(result).toEqual([]);
    });

    it("should throw 400 for an invalid user ID", async () => {
      await expect(service.getFavouritesByUser("invalid-id")).rejects.toThrow(
        new HttpError(400, "Invalid user ID"),
      );

      expect(favouriteRepo.getFavouritesByUser).not.toHaveBeenCalled();
    });
  });
});
