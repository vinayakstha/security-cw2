"use server";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  verifyTotpLogin,
} from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const handleRegister = async (formData: any, captchaToken?: string) => {
  try {
    const result = await registerUser(formData, captchaToken);
    if (result.success) {
      return {
        success: true,
        message: "registration successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Registration failed",
    };
  }
};

export const handleLogin = async (formData: any, captchaToken?: string) => {
  try {
    const result = await loginUser(formData, captchaToken);
    if (result.success) {
      // If TOTP is required, return the temp token to the form
      if (result.requiresTotp) {
        return {
          success: true,
          requiresTotp: true,
          tempToken: result.tempToken,
          message: "TOTP verification required",
        };
      }

      await setAuthToken(result.token);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "Login failed",
    };
  }
};

export const handleTotpLoginVerify = async (
  tempToken: string,
  token: string,
) => {
  try {
    const result = await verifyTotpLogin(tempToken, token);
    if (result.success) {
      await setAuthToken(result.token);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login successful",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "TOTP verification failed",
    };
  } catch (err: Error | any) {
    return {
      success: false,
      message: err.message || "TOTP verification failed",
    };
  }
};

export async function handleGetCurrentUser() {
  try {
    const result = await getCurrentUser();
    if (result.success) {
      return {
        success: true,
        message: "User data fetched successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch user data",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}

export async function handleUpdateProfile(profileData: FormData) {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      await setUserData(result.data); // update cookie
      revalidatePath("/user/profile"); // revalidate profile page/ refresh new data
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}

export const handleRequestPasswordReset = async (
  email: string,
  captchaToken?: string,
) => {
  try {
    const response = await requestPasswordReset(email, captchaToken);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Request password reset action failed",
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
  captchaToken?: string,
) => {
  try {
    const response = await resetPassword(token, newPassword, captchaToken);
    if (response.success) {
      return {
        success: true,
        message: "Password has been reset successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Reset password failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Reset password action failed",
    };
  }
};
