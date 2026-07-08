import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repository";
import { ServiceRepository } from "../repositories/service.repository";
import mongoose from "mongoose";
import { sendBookingConfirmationEmail } from "../utils/sendBookingConfirmationEmail";

const bookingRepository = new BookingRepository();
const serviceRepository = new ServiceRepository();

export class UserBookingService {
  async createBooking(
    userId: string,
    serviceId: string,
    bookingDate: string,
    bookingTime: string,
    location: string,
  ) {
    const service = await serviceRepository.getServiceById(serviceId);

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    const existing = await bookingRepository.getBookingsByService(serviceId);

    const conflict = existing.find(
      (b) =>
        b.bookingDate === bookingDate &&
        b.bookingTime === bookingTime &&
        b.status !== "cancelled",
    );

    if (conflict) {
      throw new HttpError(400, "This time slot is already booked");
    }

    const booking = await bookingRepository.createBooking({
      userId: new mongoose.Types.ObjectId(userId),
      serviceId: new mongoose.Types.ObjectId(serviceId),
      bookingDate,
      bookingTime,
      price: service.price,
      location,
      status: "pending",
    });

    // return booking;
    const populatedBooking = await bookingRepository.getBookingById(
      booking._id.toString(),
    );
    const user = populatedBooking?.userId as any;
    const servicePop = populatedBooking?.serviceId as any;

    if (user?.email) {
      await sendBookingConfirmationEmail({
        toEmail: user.email,
        userName: user.name ?? "Customer",
        bookingDate,
        bookingTime,
        location,
        serviceTitle: servicePop?.serviceName ?? "Service",
      });
    }

    return populatedBooking!;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    // if (booking.userId.toString() !== userId) {
    //   throw new HttpError(403, "Not authorized to cancel this booking");
    // }
    const bookingUserId = (booking.userId as any)._id
      ? (booking.userId as any)._id.toString()
      : booking.userId.toString();

    if (bookingUserId !== userId) {
      throw new HttpError(403, "Not authorized to cancel this booking");
    }

    if (booking.status === "cancelled") {
      throw new HttpError(400, "Booking already cancelled");
    }

    return await bookingRepository.updateBookingStatus(bookingId, "cancelled");
  }

  async getBookingsByUser(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpError(400, "Invalid user ID");
    }

    const bookings = await bookingRepository.getBookingsByUser(userId);

    if (!bookings.length) {
      throw new HttpError(404, "No bookings found for this user");
    }
    return bookings;
  }

  async deleteBooking(bookingId: string, userId: string) {
    const booking = await bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const bookingUserId = (booking.userId as any)._id
      ? (booking.userId as any)._id.toString()
      : booking.userId.toString();

    if (bookingUserId !== userId) {
      throw new HttpError(403, "Not authorized to delete this booking");
    }

    const deleted = await bookingRepository.deleteBooking(bookingId);

    if (!deleted) {
      throw new HttpError(500, "Failed to delete booking");
    }

    return { message: "Booking deleted successfully" };
  }
}
