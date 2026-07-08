import { API } from "./endpoints";
import axios from "./axios";

export const initiatePayment = async (bookingId: string) => {
  try {
    const response = await axios.post(API.USER.PAYMENT.INITIATE, { bookingId });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to initiate payment",
    );
  }
};

export const verifyPayment = async (pidx: string) => {
  try {
    const response = await axios.post(API.USER.PAYMENT.VERIFY, { pidx });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to verify payment",
    );
  }
};
