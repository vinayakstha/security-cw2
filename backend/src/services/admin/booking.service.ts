import { HttpError } from "../../errors/http-error";
import { BookingRepository } from "../../repositories/booking.repository";

const bookingRepository = new BookingRepository();

export class AdminBookingService {
  async getAllBookings() {
    const bookings = await bookingRepository.getAllBookings();

    if (!bookings || bookings.length === 0) {
      throw new HttpError(404, "No bookings found");
    }

    return bookings;
  }

  async getBookingById(bookingId: string) {
    const booking = await bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const booking = await bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const allowedStatuses = ["pending", "paid", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      throw new HttpError(400, "Invalid booking status");
    }

    const updatedBooking = await bookingRepository.updateBookingStatus(
      bookingId,
      status,
    );

    if (!updatedBooking) {
      throw new HttpError(500, "Failed to update booking status");
    }

    return updatedBooking;
  }
}
