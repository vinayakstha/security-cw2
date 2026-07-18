"use client";import { Mail, Lock, Eye, EyeOff, X, User, Phone, BadgeCheck, Chrome } from "lucide-react";
import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { handleRegister } from "@/lib/actions/auth-action";
import { passwordSchema } from "@/lib/utils/passwordPolicy";
import PasswordStrengthBar from "@/app/_components/PasswordStrengthBar";

/* ---------------- ZOD SCHEMA ---------------- */

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Enter a valid phone number"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = watch("password");

  const [error, setError] = useState("");
  const [pending, setTransition] = useTransition();

  // reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");

    // Get CAPTCHA token
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    try {
      const res = await handleRegister(data, captchaToken);
      if (!res.success) {
        toast.error("Registration failed");
        throw new Error(res.message || "Registration failed");
      }
      setTransition(() => {
        toast.success("registration successful");
        router.push("/login");
      });
    } catch (err: Error | any) {
      toast.error(err.message || "Registration failed");
      setError(err.message || "Registration failed");
    } finally {
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 md:p-10">
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="cursor-pointer"
          aria-label="Close"
        >
          <X className="text-black" />
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
      <p className="text-gray-500 mt-2">
        Join us to manage your household tasks easily
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* FIRST & LAST NAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* USERNAME */}
        <div>
          <div className="relative">
            <BadgeCheck
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#006BAA]"
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* EMAIL & PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Phone Number"
                {...register("phoneNumber")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#006BAA]"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#006BAA]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Password strength indicator */}
          <PasswordStrengthBar password={watchedPassword || ""} />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 placeholder-gray-500 text-black ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#006BAA]"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#006BAA] text-white py-3 rounded-lg hover:bg-[#01508d] transition disabled:opacity-60 font-semibold"
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or sign up with</span>
          </div>
        </div>

        {/* Google OAuth */}
        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg
                       hover:bg-gray-50 transition text-gray-700 font-medium"
        >
          <Chrome size={20} />
          Sign up with Google
        </a>
      </form>

      <p className="text-sm text-gray-600 mt-6 text-center">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#006BAA] font-medium hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
