"use client";

import { Mail, Lock, Eye, EyeOff, X, Shield } from "lucide-react";
import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import {
  handleLogin,
  handleTotpLoginVerify,
} from "@/lib/actions/auth-action";
import Link from "next/link";

/* ---------------- ZOD SCHEMA ---------------- */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const totpSchema = z.object({
  totpCode: z
    .string()
    .length(6, "TOTP code must be 6 digits")
    .regex(/^\d{6}$/, "TOTP code must be 6 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type TotpFormValues = z.infer<typeof totpSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setTransition] = useTransition();
  const router = useRouter();

  // TOTP state
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [totpError, setTotpError] = useState<string | null>(null);

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // TOTP form
  const {
    register: registerTotp,
    handleSubmit: handleSubmitTotp,
    formState: { errors: totpErrors, isSubmitting: isTotpSubmitting },
    setValue: setTotpValue,
    watch: watchTotp,
    reset: resetTotpForm,
  } = useForm<TotpFormValues>({
    resolver: zodResolver(totpSchema),
  });

  const [error, setError] = useState<string | null>(null);

  // reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Auto-submit when 6 digits are entered
  const totpCode = watchTotp("totpCode");
  const prevTotpCodeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      totpCode &&
      totpCode.length === 6 &&
      /^\d{6}$/.test(totpCode) &&
      totpCode !== prevTotpCodeRef.current
    ) {
      prevTotpCodeRef.current = totpCode;
      handleTotpSubmit({ totpCode });
    }
  }, [totpCode]);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    // Get CAPTCHA token
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setTransition(async () => {
      try {
        const response = await handleLogin(values, captchaToken);
        if (!response.success) {
          throw new Error(response.message);
        }
        // If TOTP is required, show TOTP input
        if ((response as any).requiresTotp) {
          setTempToken((response as any).tempToken);
          setRequiresTotp(true);
          return;
        }
        if (response.data?.role == "admin") {
          toast.success("Login successful");
          return router.replace("/admin/dashboard");
        }
        if (response.data?.role === "user") {
          toast.success("Login successful");
          return router.replace("/user/services");
        }
        return router.replace("/");
      } catch (err: Error | any) {
        toast.error("Login failed");
        setError(err.message || "Login failed");
      } finally {
        // Reset CAPTCHA after each attempt
        recaptchaRef.current?.reset();
      }
    });
  };

  const handleTotpSubmit = async (values: TotpFormValues) => {
    if (!tempToken) return;
    setTotpError(null);
    setTransition(async () => {
      try {
        const response = await handleTotpLoginVerify(
          tempToken,
          values.totpCode,
        );
        if (!response.success) {
          setTotpError(response.message || "Invalid code");
          setTotpValue("totpCode", "");
          prevTotpCodeRef.current = undefined;
          return;
        }
        toast.success("Login successful");
        if (response.data?.role == "admin") {
          return router.replace("/admin/dashboard");
        }
        if (response.data?.role === "user") {
          return router.replace("/user/services");
        }
        return router.replace("/");
      } catch (err: Error | any) {
        setTotpError(err.message || "TOTP verification failed");
        setTotpValue("totpCode", "");
        prevTotpCodeRef.current = undefined;
      }
    });
  };

  const handleBackToLogin = () => {
    setRequiresTotp(false);
    setTempToken(null);
    setTotpError(null);
    resetTotpForm();
    prevTotpCodeRef.current = undefined;
  };

  // If TOTP is required, show TOTP input form
  if (requiresTotp) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
        {/* CLOSE BUTTON */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => router.replace("/")}
          >
            <X className="text-black" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#006BAA]/10 rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-[#006BAA]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form
          onSubmit={handleSubmitTotp(handleTotpSubmit)}
          className="mt-8 space-y-4"
        >
          {/* TOTP CODE */}
          <div>
            <div className="relative">
              <Shield
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                {...registerTotp("totpCode")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-center text-2xl tracking-[0.5em] text-black placeholder-gray-300 focus:outline-none focus:ring-1 ${
                  totpError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
                autoFocus
              />
            </div>
            {totpErrors.totpCode && (
              <p className="text-sm text-red-500 mt-2">
                {totpErrors.totpCode.message}
              </p>
            )}
            {totpError && (
              <p className="text-sm text-red-500 mt-2">{totpError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isTotpSubmitting}
            className="w-full bg-[#006BAA] text-white py-3 rounded-lg hover:bg-[#01508d] transition disabled:opacity-60"
          >
            {isTotpSubmitting ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 md:p-10">
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => router.replace("/")}
        >
          <X className="text-black" />
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
      <p className="text-gray-500 mt-2">
        Get your household tasks done quickly and easily
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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

        {/* PASSWORD */}
        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg
                text-black placeholder-gray-500
                focus:outline-none focus:ring-1
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfjdEstAAAAAOvRwOrQe6FdBQfWT9p89ec1tXaR"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="accent-[#006BAA]" />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-[#006BAA] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#006BAA] text-white py-3 rounded-lg
                       hover:bg-[#01508d] transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6 text-center">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-[#006BAA] font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
