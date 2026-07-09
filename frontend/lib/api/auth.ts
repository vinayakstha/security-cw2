import axios from "./axios";
import { API } from "./endpoints";

export const registerUser = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registerData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Registration failed",
    );
  }
};

export const loginUser = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Login failed",
    );
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(API.AUTH.GETCURRENTUSER);
    return response.data;
  } catch (error: Error | any) {
    throw (
      new Error(error.response?.data?.message) ||
      error.message ||
      "getcurrentuser failed"
    );
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, profileData, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update profile failed",
    );
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Request password reset failed",
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD(token), {
      newPassword: newPassword,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed",
    );
  }
};

// TOTP / 2FA
export const setupTotp = async () => {
  try {
    const response = await axios.post(API.AUTH.TOTP.SETUP);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "TOTP setup failed",
    );
  }
};

export const verifyAndEnableTotp = async (token: string, secret: string) => {
  try {
    const response = await axios.post(API.AUTH.TOTP.VERIFY_ENABLE, {
      token,
      secret,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "TOTP verification failed",
    );
  }
};

export const disableTotp = async (password: string) => {
  try {
    const response = await axios.post(API.AUTH.TOTP.DISABLE, { password });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "TOTP disable failed",
    );
  }
};

export const verifyTotpLogin = async (tempToken: string, token: string) => {
  try {
    const response = await axios.post(API.AUTH.TOTP.LOGIN_VERIFY, {
      tempToken,
      token,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "TOTP verification failed",
    );
  }
};
