"use client";

import { useEffect, useState } from "react";
import { Pencil, User, AtSign, Mail, Phone, BadgeCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/api/auth";
import Image from "next/image";
import EditProfileModal from "@/app/user/_components/EditProfileModel";

export default function Profile() {
  const { user, setUser, loading, checkAuth } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    <div className="w-full p-4 md:p-6 space-y-6 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-lg font-semibold text-gray-700">My Profile</h1>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={profilePicUrl}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <User size={18} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BadgeCheck size={16} />
            <span>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-700">Personal Information</h3>
          <button
            className="flex items-center gap-1 text-sm bg-[#006BAA] text-white px-3 py-1.5 rounded-md hover:bg-[#01508d]"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil size={14} />
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
