"use server";

import {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from "@/lib/api/admin/booking";
import { revalidatePath } from "next/cache";

// Fetch all bookings (Admin)
export async function handleGetAllBookings() {
  try {
    const result = await getAllBookings();

    if (result.success || result.data) {
      return {
        success: true,
        message: "All bookings fetched successfully",
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

// Fetch a single booking by ID (Admin)
export async function handleGetBookingById(bookingId: string) {
  try {
    const result = await getBookingById(bookingId);

    if (result.success || result.data) {
      return {
        success: true,
        message: "Booking fetched successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch booking",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch booking",
    };
  }
}

// Update booking status (Admin)
export async function handleUpdateBookingStatus(
  bookingId: string,
  status: string,
) {
  try {
    const result = await updateBookingStatus(bookingId, status);

    if (result.success || result.data) {
      revalidatePath("/admin/bookings"); // Revalidate admin bookings page
      return {
        success: true,
        message: "Booking status updated successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update booking status",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update booking status",
    };
  }
}
