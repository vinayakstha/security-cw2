import { HttpError } from "../errors/http-error";
import { ServiceRepository } from "../repositories/service.repository";

let serviceRepository = new ServiceRepository();

export class UserServiceService {
  async getAllServices() {
    const services = await serviceRepository.getAllServices();
    return services;
  }

  async getServicesByCategory(categoryId: string) {
    const services = await serviceRepository.getServicesByCategory(categoryId);

    return services;
  }

  async getServiceById(serviceId: string) {
    const service = await serviceRepository.getServiceById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    return service;
  }
}
