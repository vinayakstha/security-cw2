"use client";
import RegisterForm from "../_components/ResisterForm";

export default function Page() {
  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-4
        bg-[url('/images/login-bg.jpg')]
        bg-cover bg-center bg-no-repeat
        relative
      "
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-lg flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
