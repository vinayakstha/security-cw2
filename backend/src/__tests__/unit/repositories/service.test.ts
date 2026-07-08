import { ServiceRepository } from "../../../repositories/service.repository";
import { ServiceModel } from "../../../models/service.model";
import { CategoryModel } from "../../../models/category.model";
import mongoose from "mongoose";

describe("Service Repository Unit Tests", () => {
  const serviceRepository = new ServiceRepository();

  let createdCategoryId: string;
  let createdServiceId: string;

  const testService = {
    serviceName: "Pipe Fixing",
    serviceImage: "pipe-fixing.png",
    serviceDescription: "Fix leaking pipes",
    price: "100",
  };

  beforeAll(async () => {
    const category = await CategoryModel.create({
      categoryName: "Plumbing Test",
      categoryImage: "plumbing.png",
    });
    createdCategoryId = category._id.toString();

    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
  });

  afterAll(async () => {
    await ServiceModel.deleteMany({ serviceName: testService.serviceName });
    await CategoryModel.findByIdAndDelete(createdCategoryId);
  });

  test("should create a new service", async () => {
    const service = await serviceRepository.createService({
      ...testService,
      categoryId: new mongoose.Types.ObjectId(createdCategoryId),
    });

    expect(service).toBeDefined();
    expect(service._id).toBeDefined();
    expect(service.serviceName).toBe(testService.serviceName);
    expect(service.serviceImage).toBe(testService.serviceImage);
    expect(service.serviceDescription).toBe(testService.serviceDescription);
    expect(service.price).toBe(testService.price);

    createdServiceId = service._id.toString();
  });

  test("should get service by id", async () => {
    const service = await serviceRepository.getServiceById(createdServiceId);

    expect(service).not.toBeNull();
    expect(service?.serviceName).toBe(testService.serviceName);
    expect(service?.price).toBe(testService.price);
  });

  test("should get all services", async () => {
    const services = await serviceRepository.getAllServices();

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
  });

  test("should get services by category", async () => {
    const services =
      await serviceRepository.getServicesByCategory(createdCategoryId);

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    expect(services[0].categoryId.toString()).toBe(createdCategoryId);
  });

  test("should update a service", async () => {
    const updatedService = await serviceRepository.updateService(
      createdServiceId,
      { serviceImage: "updated-pipe-fixing.png", price: "150" },
    );

    expect(updatedService).not.toBeNull();
    expect(updatedService?.serviceImage).toBe("updated-pipe-fixing.png");
    expect(updatedService?.price).toBe("150");
  });

  test("should delete a service", async () => {
    const result = await serviceRepository.deleteService(createdServiceId);

    expect(result).toBe(true);

    const deletedService =
      await serviceRepository.getServiceById(createdServiceId);
    expect(deletedService).toBeNull();
  });
});
