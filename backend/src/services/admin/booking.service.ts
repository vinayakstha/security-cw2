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

  // Valid booking state transitions: pending → paid → completed
  private readonly validTransitions: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  async updateBookingStatus(bookingId: string, status: string) {
    const booking = await bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const allowedStatuses = Object.keys(this.validTransitions);
    if (!allowedStatuses.includes(status)) {
      throw new HttpError(400, "Invalid booking status");
    }

    const allowedNext = this.validTransitions[booking.status];
    if (!allowedNext || !allowedNext.includes(status)) {
      throw new HttpError(
        400,
        `Cannot transition booking from '${booking.status}' to '${status}'. ` +
        `Allowed transitions from '${booking.status}': ${allowedNext?.join(", ") || "none"}`,
      );
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
