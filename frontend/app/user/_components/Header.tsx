"use client";

import { useState, useEffect } from "react";
import { LogOut, User, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import LogoutModal from "@/app/_components/LogoutModal";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // Get email from cookie
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="));

    if (cookie) {
      const value = cookie.split("=")[1];
      try {
        const parsed = JSON.parse(decodeURIComponent(value));
        setEmail(parsed?.email || null);
      } catch (err) {
        console.error("Invalid user_data cookie");
      }
    }
  }, []);

  // CONFIRM LOGOUT
  const handleConfirmLogout = () => {
    logout();
    setIsLogoutOpen(false);
    toast.success("Logout successful");
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 bg-white shadow">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain rounded-full"
          />
          <h1 className="text-lg font-semibold text-gray-800">Gharsewa</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {email && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <User size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">{email}</span>
            </div>
          )}

          <button
            onClick={() => setIsLogoutOpen(true)}
            className="p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        description="Are you sure you want to log out of your account?"
      />
    </>
  );
}
