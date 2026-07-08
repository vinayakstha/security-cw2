import mongoose from "mongoose";
import { BookingModel, IBookingModel } from "../models/booking.model";

export interface IBookingRepository {
  createBooking(bookingData: Partial<IBookingModel>): Promise<IBookingModel>;

  updateBookingStatus(
    id: string,
    status: string,
  ): Promise<IBookingModel | null>;

  deleteBooking(id: string): Promise<boolean>;

  getAllBookings(): Promise<IBookingModel[]>;

  getBookingById(id: string): Promise<IBookingModel | null>;

  getBookingsByUser(userId: string): Promise<IBookingModel[]>;

  getBookingsByService(serviceId: string): Promise<IBookingModel[]>;
}

export class BookingRepository implements IBookingRepository {
  async createBooking(
    bookingData: Partial<IBookingModel>,
  ): Promise<IBookingModel> {
    const booking = new BookingModel(bookingData);
    return await booking.save();
  }

  async getBookingById(id: string): Promise<IBookingModel | null> {
    return await BookingModel.findById(id)
      .populate("userId")
      .populate("serviceId");
  }

  async getAllBookings(): Promise<IBookingModel[]> {
    return await BookingModel.find()
      .populate("userId")
      .populate("serviceId")
      .sort({ createdAt: -1 }); // latest bookings first
  }

  // async getBookingsByUser(userId: string): Promise<IBookingModel[]> {
  //   const objectId = new mongoose.Types.ObjectId(userId);
  //   return await BookingModel.find({ userId: objectId }).populate("serviceId");
  // }

  async getBookingsByUser(userId: string): Promise<IBookingModel[]> {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Fetch bookings with service populated, latest first
    return await BookingModel.find({ userId: objectId })
      .populate("serviceId")
      .sort({ createdAt: -1 }); // newest bookings first
  }

  async getBookingsByService(serviceId: string): Promise<IBookingModel[]> {
    const objectId = new mongoose.Types.ObjectId(serviceId);
    return await BookingModel.find({ serviceId: objectId }).populate("userId");
  }

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<IBookingModel | null> {
    return await BookingModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId")
      .populate("serviceId");
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await BookingModel.findByIdAndDelete(id);
    return !!result;
  }
}
