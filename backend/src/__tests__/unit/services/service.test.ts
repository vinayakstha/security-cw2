import mongoose from "mongoose";
import { UserServiceService } from "../../../services/service.service";
import { ServiceRepository } from "../../../repositories/service.repository";
import { HttpError } from "../../../errors/http-error";

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock("../../../repositories/service.repository");

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeId = () => new mongoose.Types.ObjectId().toString();

const makeService = (overrides: Record<string, unknown> = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  name: "Test Service",
  categoryId: new mongoose.Types.ObjectId(),
  ...overrides,
});

// ── Setup ─────────────────────────────────────────────────────────────────────
describe("UserServiceService", () => {
  let service: UserServiceService;
  let serviceRepo: jest.Mocked<ServiceRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    serviceRepo = {
      getAllServices: jest.fn(),
      getServiceById: jest.fn(),
      getServicesByCategory: jest.fn(),
      createService: jest.fn(),
      updateService: jest.fn(),
      deleteService: jest.fn(),
    } as unknown as jest.Mocked<ServiceRepository>;

    jest
      .spyOn(ServiceRepository.prototype, "getAllServices")
      .mockImplementation(serviceRepo.getAllServices);
    jest
      .spyOn(ServiceRepository.prototype, "getServiceById")
      .mockImplementation(serviceRepo.getServiceById);
    jest
      .spyOn(ServiceRepository.prototype, "getServicesByCategory")
      .mockImplementation(serviceRepo.getServicesByCategory);

    service = new UserServiceService();
  });

  // ── getAllServices ─────────────────────────────────────────────────────────
  describe("getAllServices", () => {
    it("should return all services", async () => {
      const services = [makeService(), makeService()];

      serviceRepo.getAllServices.mockResolvedValue(services as any);

      const result = await service.getAllServices();

      expect(serviceRepo.getAllServices).toHaveBeenCalledTimes(1);
      expect(result).toEqual(services);
      expect(result).toHaveLength(2);
    });

    it("should return an empty array when no services exist", async () => {
      serviceRepo.getAllServices.mockResolvedValue([]);

      const result = await service.getAllServices();

      expect(result).toEqual([]);
    });
  });

  // ── getServicesByCategory ──────────────────────────────────────────────────
  describe("getServicesByCategory", () => {
    it("should return services for a given category", async () => {
      const categoryId = makeId();
      const services = [
        makeService({ categoryId: new mongoose.Types.ObjectId(categoryId) }),
        makeService({ categoryId: new mongoose.Types.ObjectId(categoryId) }),
      ];

      serviceRepo.getServicesByCategory.mockResolvedValue(services as any);

      const result = await service.getServicesByCategory(categoryId);

      expect(serviceRepo.getServicesByCategory).toHaveBeenCalledWith(
        categoryId,
      );
      expect(result).toEqual(services);
    });

    it("should return an empty array when no services exist for the category", async () => {
      const categoryId = makeId();

      serviceRepo.getServicesByCategory.mockResolvedValue([]);

      const result = await service.getServicesByCategory(categoryId);

      expect(serviceRepo.getServicesByCategory).toHaveBeenCalledWith(
        categoryId,
      );
      expect(result).toEqual([]);
    });
  });

  // ── getServiceById ─────────────────────────────────────────────────────────
  describe("getServiceById", () => {
    it("should return a service for a valid ID", async () => {
      const serviceId = makeId();
      const fakeService = makeService({ _id: serviceId });

      serviceRepo.getServiceById.mockResolvedValue(fakeService as any);

      const result = await service.getServiceById(serviceId);

      expect(serviceRepo.getServiceById).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(fakeService);
    });

    it("should throw 404 when service does not exist", async () => {
      const serviceId = makeId();

      serviceRepo.getServiceById.mockResolvedValue(null);

      await expect(service.getServiceById(serviceId)).rejects.toThrow(
        new HttpError(404, "Service not found"),
      );

      expect(serviceRepo.getServiceById).toHaveBeenCalledWith(serviceId);
    });
  });
});
