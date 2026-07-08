import { Request, Response, NextFunction } from "express";
import { AdminBookingService } from "../../services/admin/booking.service";

const adminBookingService = new AdminBookingService();

export class AdminBookingController {
  async getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await adminBookingService.getAllBookings();

      return res.status(200).json({
        success: true,
        message: "All bookings fetched successfully",
        data: bookings,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.id;

      const booking = await adminBookingService.getBookingById(bookingId);

      return res.status(200).json({
        success: true,
        message: "Booking fetched successfully",
        data: booking,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }

  async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.id;
      const { status } = req.body;

      const updatedBooking = await adminBookingService.updateBookingStatus(
        bookingId,
        status,
      );

      return res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        data: updatedBooking,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal server error",
      });
    }
  }
}
