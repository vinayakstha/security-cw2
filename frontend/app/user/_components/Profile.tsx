"use client";

import { useEffect, useState } from "react";
import {
  User,
  AtSign,
  Mail,
  Phone,
  BadgeCheck,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/api/auth";
import Image from "next/image";
import EditProfileModal from "./EditProfileModel";
import TotpSetup from "./TotpSetup";

export default function Profile() {
  const { user, setUser, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTotpModalOpen, setIsTotpModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setProfileLoading(true);
        const data = await getCurrentUser();
        setUser(data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!user || !user.firstName) fetchUser();
  }, [user, setUser]);

  if (loading) return <p>Loading profile...</p>;

  const profilePicUrl = user?.profilePicture
    ? user.profilePicture.startsWith("http")
      ? user.profilePicture
      : `http://localhost:5050${user.profilePicture}`
    : "/images/avatar.png";

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-lg font-semibold text-gray-700">My Profile</h1>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
          <Image
            src={profilePicUrl}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-500 shrink-0" />
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {user?.firstName} {user?.lastName}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BadgeCheck size={16} />
            <span>{user?.role}</span>
          </div>
        </div>
        <button
          onClick={() => setIsTotpModalOpen(true)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition shrink-0 ${
            user?.totpEnabled
              ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Shield size={14} />
          {user?.totpEnabled ? "2FA On" : "2FA Off"}
        </button>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-700">Personal Information</h3>
          <button
            className="flex items-center gap-1 text-sm bg-[#006BAA] text-white px-3 py-1.5 rounded-md hover:bg-[#01508d]"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 px-4 md:px-6 py-6">
          <InfoItem
            label="First Name"
            value={user?.firstName || "-"}
            icon={User}
          />
          <InfoItem
            label="Last Name"
            value={user?.lastName || "-"}
            icon={User}
          />
          <InfoItem
            label="Username"
            value={user?.username || "-"}
            icon={AtSign}
          />
          <InfoItem
            label="Email Address"
            value={user?.email || "-"}
            icon={Mail}
          />
          <InfoItem
            label="Phone Number"
            value={user?.phoneNumber || "-"}
            icon={Phone}
          />
          <InfoItem label="Role" value={user?.role || "-"} icon={BadgeCheck} />
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* TOTP SETUP MODAL */}
      {isTotpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTotpModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-base font-semibold text-gray-800">
                Two-Factor Authentication
              </h2>
              <button
                onClick={() => setIsTotpModalOpen(false)}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TotpSetup
                modal
                onSuccess={() => {
                  setIsTotpModalOpen(false);
                  getCurrentUser().then((data) => {
                    if (data.success) setUser(data.data);
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
