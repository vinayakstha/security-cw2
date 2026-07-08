"use server";

import { getCategories } from "../api/category";

export async function handleGetCategories() {
  try {
    const result = await getCategories();

    if (result.success) {
      return {
        success: true,
        message: "Categories fetched successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch categories",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
    };
  }
}
