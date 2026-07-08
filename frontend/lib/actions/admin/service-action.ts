"use server";

import {
  createService,
  deleteService,
  getService,
  getServices,
  getServicesByCategory,
  updateService,
} from "@/lib/api/admin/service";
import { revalidatePath } from "next/cache";

export async function handleCreateService(formData: FormData) {
  try {
    const result = await createService(formData);
    if (result.success) {
      revalidatePath("/admin/services");
      return {
        success: true,
        message: "Service created successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to create service",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create service",
    };
  }
}

export async function handleGetServices() {
  try {
    const result = await getServices();
    if (result.success) {
      return {
        success: true,
        message: "Services fetched successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch services",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch services",
    };
  }
}

export async function handleGetService(id: string) {
  try {
    const result = await getService(id);
    if (result.success) {
      return {
        success: true,
        message: "service fetched",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "failed to fetch service",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "failed to get service",
    };
  }
}

export async function handleUpdateService(id: string, formData: FormData) {
  try {
    const result = await updateService(id, formData);
    if (result.success) {
      revalidatePath("/admin/services");
      return {
        success: true,
        message: "Service updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to update service",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "failed to update service",
    };
  }
}

export async function handleDeleteService(id: string) {
  try {
    const result = await deleteService(id);
    if (result.success) {
      revalidatePath("/admin/services");
      return {
        success: true,
        message: "service deleted successfully",
      };
    }
    return {
      success: false,
      message: result.message || "failed to delete service",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "failed to delete service",
    };
  }
}

export async function handleGetServiceByCategory(id: string) {
  try {
    const result = await getServicesByCategory(id);
    if (result.success) {
      revalidatePath("/admin/services");
      return {
        success: true,
        message: result.message || "service fetch successfully",
      };
    }
    return {
      success: false,
      message: result.message || "failed to fetch service",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "failed to fetch service",
    };
  }
}
