import axios from "./axios";
import { API } from "./endpoints";

export const getServices = async () => {
  try {
    const response = await axios.get(API.USER.SERVICE.GETALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch service failed",
    );
  }
};

export const getService = async (serviceId: string) => {
  try {
    const response = await axios.get(API.USER.SERVICE.GETONE(serviceId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch service failed",
    );
  }
};

export const getServicesByCategory = async (categoryId: string) => {
  try {
    const response = await axios.get(
      API.USER.SERVICE.GETALLBYCATEGORY(categoryId),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Fetch services by category failed",
    );
  }
};
