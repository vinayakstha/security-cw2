import axios from "../axios";
import { API } from "../endpoints";

export const createService = async (serviceData: any) => {
  try {
    const response = await axios.post(API.ADMIN.SERVICE.CREATE, serviceData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || error.message || "Create service failed",
    );
  }
};

export const getServices = async () => {
  try {
    const response = await axios.get(API.ADMIN.SERVICE.GETALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch service failed",
    );
  }
};

export const getService = async (serviceId: string) => {
  try {
    const response = await axios.get(API.ADMIN.SERVICE.GETONE(serviceId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch service failed",
    );
  }
};

export const updateService = async (serviceId: string, serviceData: any) => {
  try {
    const response = await axios.put(
      API.ADMIN.SERVICE.UPDATE(serviceId),
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.message?.data?.message || error.message || "update service failed",
    );
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    const response = await axios.delete(API.ADMIN.SERVICE.DELETE(serviceId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Delete category failed",
    );
  }
};

export const getServicesByCategory = async (categoryId: string) => {
  try {
    const response = await axios.get(
      API.ADMIN.SERVICE.GET_SERVICE_BY_CATEGORY(categoryId),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch services failed",
    );
  }
};
