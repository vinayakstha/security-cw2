"use server";

import { initiatePayment, verifyPayment } from "@/lib/api/payment";
import { revalidatePath } from "next/cache";

export async function handleInitiatePayment(bookingId: string) {
  try {
    const result = await initiatePayment(bookingId);

    if (result.success) {
      return {
        success: true,
        message: "Payment initiated successfully",
        data: result,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to initiate payment",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to initiate payment",
    };
  }
}

export async function handleVerifyPayment(pidx: string) {
  try {
    const result = await verifyPayment(pidx);

    if (result.success) {
      revalidatePath("/user/booking");

      return {
        success: true,
        message: "Payment verified successfully",
        data: result,
      };
    }

    return {
      success: false,
      message: result.message || "Payment verification failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify payment",
    };
  }
}
