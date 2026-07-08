"use server";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
} from "../../api/admin/category";
import { revalidatePath } from "next/cache";

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

export async function handleGetCategory(id: string) {
  try {
    const result = await getCategory(id);
    if (result.success) {
      revalidatePath("admin/category");
      return {
        success: true,
        message: "category fetched",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "failed to get category",
    };
  }
}

export async function handleCreateCategory(formData: FormData) {
  try {
    const result = await createCategory(formData);

    if (result.success) {
      revalidatePath("/admin/category"); // adjust path if needed
      return {
        success: true,
        message: "Category created successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create category",
    };
  }
}

export async function handleUpdateCategory(id: string, formData: FormData) {
  try {
    const result = await updateCategory(id, formData);

    if (result.success) {
      revalidatePath("/admin/category");
      return {
        success: true,
        message: "Category updated successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update category",
    };
  }
}

export async function handleDeleteCategory(id: string) {
  try {
    const result = await deleteCategory(id);

    if (result.success) {
      revalidatePath("/admin/category");
      return {
        success: true,
        message: "Category deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete category",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete category",
    };
  }
}
