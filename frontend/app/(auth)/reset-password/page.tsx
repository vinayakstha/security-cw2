"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  // Clean the token from the URL immediately to prevent leakage
  // via browser history, referrer headers, or shared screenshots.
  useEffect(() => {
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-500">
            This password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-4
        bg-[url('/images/login-bg.jpg')]
        bg-cover bg-center bg-no-repeat
      "
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* FORM CONTAINER */}
      <div className="relative z-10 w-full flex justify-center">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
