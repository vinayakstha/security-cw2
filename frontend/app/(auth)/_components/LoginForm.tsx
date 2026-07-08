"use client";

import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleLogin } from "@/lib/actions/auth-action";
import Link from "next/link";

/* ---------------- ZOD SCHEMA ---------------- */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (!response.success) {
          throw new Error(response.message);
        }
        if (response.success) {
          if (response.data?.role == "admin") {
            toast.success("Login successful");
            return router.replace("/admin/dashboard");
          }
          if (response.data?.role === "user") {
            toast.success("Login successful");
            return router.replace("/user/services");
          }
          return router.replace("/");
        } else {
          toast.error("Login failed");
          setError("Login failed");
        }
      } catch (err: Error | any) {
        toast.error("Login failed");
        setError(err.message || "Login failed");
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
