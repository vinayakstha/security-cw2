"use server";

import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60, // 30 days (matches JWT expiry)
  path: "/",
};

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({ name: "auth_token", value: token, ...COOKIE_OPTIONS });
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token || null;
};

export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();
  cookieStore.set({ name: "user_data", value: JSON.stringify(userData), ...COOKIE_OPTIONS });
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const userData = cookieStore.get("user_data")?.value;
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
};
