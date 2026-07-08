import axios from "../axios";
import { API } from "../endpoints";

// Create a new category
export const createCategory = async (categoryData: any) => {
  try {
    const response = await axios.post(API.ADMIN.CATEGORY.CREATE, categoryData, {
      headers: {
        "Content-Type": "multipart/form-data", // for images/files
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Create category failed",
    );
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API.ADMIN.CATEGORY.GETALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Fetch categories failed",
    );
  }
};

// Get a single category by ID
export const getCategory = async (categoryId: string) => {
  try {
    const response = await axios.get(
      `${API.ADMIN.CATEGORY.GETONE}/${categoryId}`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Fetch category failed",
    );
  }
};

// Update a category
export const updateCategory = async (categoryId: string, categoryData: any) => {
  try {
    const response = await axios.put(
      API.ADMIN.CATEGORY.UPDATE(categoryId),
      categoryData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // for images/files
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Update category failed",
    );
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await axios.delete(API.ADMIN.CATEGORY.DELETE(categoryId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Delete category failed",
    );
  }
};
