import z from "zod";
import { CreateServiceDTO, UpdateServiceDTO } from "../dtos/service.dto";
import { UserServiceService } from "../services/service.service";
import { NextFunction, Request, Response } from "express";

let serviceService = new UserServiceService();

export class UserServiceController {
  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.id;

      const service = await serviceService.getServiceById(serviceId);

      return res.status(200).json({
        success: true,
        message: "service retrieved",
        data: service,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await serviceService.getAllServices();

      return res.status(200).json({
        success: true,
        message: "all services fetched",
        data: services,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async getServicesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.categoryId;

      const services = await serviceService.getServicesByCategory(categoryId);

      return res.status(200).json({
        success: true,
        message: "services by category fetched",
        data: services,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
}
