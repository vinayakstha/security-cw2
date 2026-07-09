"use client";

import { Mail, X } from "lucide-react";
import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

import { forgetPasswordSchema, ForgetPasswordData } from "../schema";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setTransition] = useTransition();

  // reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = (values: ForgetPasswordData) => {
    setError(null);

    // Get CAPTCHA token
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setTransition(async () => {
      try {
        const result = await handleRequestPasswordReset(
          values.email,
          captchaToken,
        );

        if (result.success) {
          toast.success(
            "If the email is registered, a reset link has been sent.",
          );
          return router.push("/login");
        }

        throw new Error(result.message || "Failed to send reset link");
      } catch (err: any) {
        toast.error(err.message || "Failed to send reset link");
        setError(err.message || "Failed to send reset link");
      } finally {
        recaptchaRef.current?.reset();
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <X className="text-black" />
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
      <p className="text-gray-500 mt-2">
        Enter your email and we’ll send you a reset link
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {/* ERROR */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* EMAIL */}
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg
                text-black placeholder-gray-500
                focus:outline-none focus:ring-1
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
            />
          </div>

          {errors.email && (
            <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfjdEstAAAAAOvRwOrQe6FdBQfWT9p89ec1tXaR"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#006BAA] text-white py-3 rounded-lg
                     hover:bg-[#01508d] transition disabled:opacity-60"
        >
          {isSubmitting || pending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
