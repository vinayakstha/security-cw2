import mongoose from "mongoose";
import { ServiceModel, IServiceModel } from "../models/service.model";

export interface IServiceRepository {
  createService(serviceData: Partial<IServiceModel>): Promise<IServiceModel>;
  updateService(
    id: string,
    updateData: Partial<IServiceModel>,
  ): Promise<IServiceModel | null>;
  deleteService(id: string): Promise<boolean>;
  getAllServices(): Promise<IServiceModel[]>;
  getServiceById(id: string): Promise<IServiceModel | null>;
  getServicesByCategory(categoryId: string): Promise<IServiceModel[]>;
}

export class ServiceRepository implements IServiceRepository {
  async getServiceById(id: string): Promise<IServiceModel | null> {
    return await ServiceModel.findById(id).populate("categoryId");
  }

  async getAllServices(): Promise<IServiceModel[]> {
    return await ServiceModel.find().populate("categoryId");
  }

  //convert string to ObjectId
  // async getServicesByCategory(categoryId: string): Promise<IServiceModel[]> {
  //   const objectId = new mongoose.Types.ObjectId(categoryId);
  //   return await ServiceModel.find({ categoryId: objectId }).populate(
  //     "categoryId",
  //   );
  // }
  async getServicesByCategory(categoryId: string): Promise<IServiceModel[]> {
    const objectId = new mongoose.Types.ObjectId(categoryId);
    return await ServiceModel.find({ categoryId: objectId });
  }
  async createService(
    serviceData: Partial<IServiceModel>,
  ): Promise<IServiceModel> {
    const service = new ServiceModel(serviceData);
    return await service.save();
  }

  async updateService(
    id: string,
    updateData: Partial<IServiceModel>,
  ): Promise<IServiceModel | null> {
    return await ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("categoryId");
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await ServiceModel.findByIdAndDelete(id);
    return !!result;
  }
}
