import mongoose from "mongoose";
import { CreateServiceDTO, UpdateServiceDTO } from "../../dtos/service.dto";
import { HttpError } from "../../errors/http-error";
import { ServiceRepository } from "../../repositories/service.repository";

let serviceRepository = new ServiceRepository();

export class AdminServiceService {
  async createService(data: CreateServiceDTO) {
    const newService = await serviceRepository.createService({
      ...data,
      categoryId: new mongoose.Types.ObjectId(data.categoryId),
    });

    return newService;
  }

  async updateService(serviceId: string, data: UpdateServiceDTO) {
    const service = await serviceRepository.getServiceById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    const updatedData: any = {};

    if (data.serviceName) updatedData.serviceName = data.serviceName;
    if (data.serviceDescription)
      updatedData.serviceDescription = data.serviceDescription;
    if (data.serviceImage) updatedData.serviceImage = data.serviceImage;
    if (data.categoryId) updatedData.categoryId = data.categoryId;
    if (data.price) updatedData.price = data.price;

    const updatedService = await serviceRepository.updateService(
      serviceId,
      updatedData,
    );

    return updatedService;
  }

  async getServiceById(serviceId: string) {
    const service = await serviceRepository.getServiceById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    return service;
  }

  async getAllServices() {
    const services = await serviceRepository.getAllServices();
    return services;
  }

  async getServicesByCategory(categoryId: string) {
    const services = await serviceRepository.getServicesByCategory(categoryId);

    return services;
  }

  async deleteService(serviceId: string) {
    const deleted = await serviceRepository.deleteService(serviceId);

    if (!deleted) {
      throw new HttpError(404, "Service not found");
    }

    return deleted;
  }
}
