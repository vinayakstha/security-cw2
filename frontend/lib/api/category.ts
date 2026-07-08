import axios from "./axios";
import { API } from "./endpoints";

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API.USER.CATEGORY.GETALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Fetch categories failed",
    );
  }
};
