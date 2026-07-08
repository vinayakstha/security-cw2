"use server";

import {
  addFavourite,
  getFavouritesByUser,
  removeFavourite,
} from "@/lib/api/favourite";
import { revalidatePath } from "next/cache";

// Add favourite
export async function handleAddFavourite(serviceId: string) {
  try {
    const result = await addFavourite(serviceId);

    if (result.success) {
      revalidatePath("/favourites");

      return {
        success: true,
        message: "Favourite added successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to add favourite",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add favourite",
    };
  }
}

// Remove favourite
export async function handleRemoveFavourite(favouriteId: string) {
  try {
    const result = await removeFavourite(favouriteId);

    if (result.success) {
      revalidatePath("/favourites");

      return {
        success: true,
        message: "Favourite removed successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to remove favourite",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to remove favourite",
    };
  }
}

// Get favourites by user
export async function handleGetFavouritesByUser() {
  try {
    const result = await getFavouritesByUser();

    if (result.success) {
      return {
        success: true,
        message: "Favourites fetched successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch favourites",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch favourites",
    };
  }
}
