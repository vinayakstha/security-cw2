import { API } from "./endpoints";
import axios from "./axios";

export const createBooking = async (bookingData: any) => {
  try {
    const response = await axios.post(API.USER.BOOKING.CREATE, bookingData);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || error.message || "Create booking failed",
    );
  }
};

export const getBookingsByUser = async () => {
  try {
    const response = await axios.get(API.USER.BOOKING.GETALLBYUSER);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to fetch bookings",
    );
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await axios.delete(API.USER.BOOKING.DELETE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to delete booking",
    );
  }
};
