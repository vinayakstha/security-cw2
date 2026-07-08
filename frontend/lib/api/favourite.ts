import { API } from "./endpoints";
import axios from "./axios";

// Add to favourites
export const addFavourite = async (serviceId: string) => {
  try {
    const response = await axios.post(API.USER.FAVOURITE.CREATE, {
      serviceId,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to add favourite",
    );
  }
};

// Get all favourites of logged-in user
export const getFavouritesByUser = async () => {
  try {
    const response = await axios.get(API.USER.FAVOURITE.GETALLBYUSER);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to fetch favourites",
    );
  }
};

// Remove favourite
export const removeFavourite = async (favouriteId: string) => {
  try {
    const response = await axios.delete(API.USER.FAVOURITE.DELETE(favouriteId));

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message ||
        error.message ||
        "Failed to remove favourite",
    );
  }
};
