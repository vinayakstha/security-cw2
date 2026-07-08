import { API } from "../endpoints";
import axios from "../axios";

export const getAllBookings = async () => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GETALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to fetch bookings",
    );
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GETONE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to fetch booking",
    );
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string,
) => {
  try {
    const response = await axios.put(API.ADMIN.BOOKING.UPDATE(bookingId), {
      status,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to update booking",
    );
  }
};
