"use client";

import { Lock, Eye, EyeOff, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { resetPasswordSchema, ResetPasswordData } from "../schema";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
  });

  const onSubmit = (values: ResetPasswordData) => {
    setError(null);

    setTransition(async () => {
      try {
        const result = await handleResetPassword(token, values.newPassword);

        if (result.success) {
          toast.success("Password has been reset successfully.");
          return router.push("/login");
        }

        throw new Error(result.message || "Failed to reset password");
      } catch (err: any) {
        toast.error(err.message || "Failed to reset password");
        setError(err.message || "Failed to reset password");
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

      <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
      <p className="text-gray-500 mt-2">
        Enter a new password for your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {/* ERROR */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* NEW PASSWORD */}
        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              autoComplete="new-password"
              {...register("newPassword")}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg
                text-black placeholder-gray-500
                focus:outline-none focus:ring-1
                ${
                  errors.newPassword
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
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-2">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg
                text-black placeholder-gray-500
                focus:outline-none focus:ring-1
                ${
                  errors.confirmNewPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-sm text-red-500 mt-2">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#006BAA] text-white py-3 rounded-lg
                     hover:bg-[#01508d] transition disabled:opacity-60"
        >
          {isSubmitting || pending ? "Resetting password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
