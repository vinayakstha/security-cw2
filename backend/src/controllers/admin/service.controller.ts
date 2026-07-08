import z from "zod";
import { CreateServiceDTO, UpdateServiceDTO } from "../../dtos/service.dto";
import { AdminServiceService } from "../../services/admin/service.service";
import { NextFunction, Request, Response } from "express";

let serviceService = new AdminServiceService();

export class AdminServiceController {
  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateServiceDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "serviceImage is required",
        });
      }

      const serviceData = {
        ...parsedData.data,
        serviceImage: `/uploads/${req.file.filename}`,
      };

      const newService = await serviceService.createService(serviceData);

      return res.status(201).json({
        success: true,
        message: "service created",
        data: newService,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.id;

      const parsedData = UpdateServiceDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      if (req.file) {
        parsedData.data.serviceImage = `/uploads/${req.file.filename}`;
      }

      const updatedData: UpdateServiceDTO = parsedData.data;

      const updatedService = await serviceService.updateService(
        serviceId,
        updatedData,
      );

      return res.status(200).json({
        success: true,
        message: "service updated",
        data: updatedService,
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.id;

      const deleted = await serviceService.deleteService(serviceId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "service not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "service deleted",
      });
    } catch (error: Error | any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

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
