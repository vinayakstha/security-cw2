"use server";

import {
  createBooking,
  deleteBooking,
  getBookingsByUser,
} from "@/lib/api/booking";
import { revalidatePath } from "next/cache";

export async function handleCreateBooking(bookingData: any) {
  try {
    const result = await createBooking(bookingData);

    if (result.success) {
      revalidatePath("/booking");

      return {
        success: true,
        message: "Booking created successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create booking",
    };
  }
}

export async function handleGetBookingsByUser() {
  try {
    const result = await getBookingsByUser();

    if (result.success) {
      return {
        success: true,
        message: "Bookings fetched successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch bookings",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch bookings",
    };
  }
}

export async function handleDeleteBooking(bookingId: string) {
  try {
    const result = await deleteBooking(bookingId);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
