"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { Loader2 } from "lucide-react";

/**
 * Decode the payload (middle part) of a JWT without verifying the signature.
 * The payload is base64url-encoded JSON. This is safe for reading public claims
 * (like role) on the client side — no secret is needed to decode.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        return;
      }

      if (!token) {
        setError("No authentication token received");
        return;
      }

      try {
        // Clean sensitive data from the URL immediately
        window.history.replaceState({}, document.title, window.location.pathname);

        // Decode user info from the JWT payload (no secret needed to decode)
        const payload = decodeJwtPayload(token);
        const userData = {
          _id: payload?.id || "",
          firstName: payload?.firstName || "",
          lastName: payload?.lastName || "",
          email: payload?.email || "",
          username: payload?.username || "",
          role: payload?.role || "user",
        };

        await setAuthToken(token);
        await setUserData(userData);

        // Redirect based on user role
        if (userData.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/user/services");
        }
      } catch (err) {
        setError("Failed to process authentication");
        console.error("Google callback error:", err);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="w-full bg-[#006BAA] text-white py-3 rounded-lg hover:bg-[#01508d] transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-md w-full text-center">
        <Loader2
          size={48}
          className="animate-spin text-[#006BAA] mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Completing Sign In
        </h1>
        <p className="text-gray-500">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
}
