"use client";

import LoginForm from "../_components/LoginForm";

export default function Page() {
  return (
    <div
      className="
    min-h-screen flex items-center justify-center p-4
    bg-[url('/images/login-bg.jpg')]
    bg-cover bg-center bg-no-repeat
  "
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
