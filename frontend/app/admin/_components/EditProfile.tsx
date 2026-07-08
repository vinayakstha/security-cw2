"use client";

import Image from "next/image";
import { User, AtSign, Phone, Pencil, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/avatar.jpg");
  const [loading, setLoading] = useState(false);

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
      setPhone(user.phoneNumber || "");
      // setPreview(`http://localhost:5050${user.profilePicture}` || "");

      if (user.profilePicture) {
        // if already absolute URL
        if (user.profilePicture.startsWith("http")) {
          setPreview(user.profilePicture);
        } else {
          setPreview(`http://localhost:5050${user.profilePicture}`);
        }
      } else {
        setPreview("/images/avatar.png"); // fallback
      }
    }
  }, [user]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("phone", phone);
    if (profileImage) {
      formData.append("profilePicture", profileImage);
    }

    const result = await handleUpdateProfile(formData);

    if (result.success) {
      toast.success("Profile updated");
      setUser(result.data); // update context
      router.push("/admin/profile"); // go back to profile page
    } else {
      toast.error("Failed to updated profile");
    }

    setLoading(false);
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6  min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/profile")}
          className="p-2 rounded-md hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-700">Edit Profile</h1>
      </div>

      {/* CARD */}
      <div className="max-w-2xl bg-white rounded-xl shadow-sm p-6 md:p-8 mx-auto">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24">
              {" "}
              {/* set fixed width & height */}
              <Image
                src={preview}
                alt="Profile"
                fill
                style={{ objectFit: "cover", borderRadius: "50%" }} // make it perfectly round
              />
              <label className="absolute bottom-1 right-1 bg-[#006BAA] text-white p-2 rounded-full shadow hover:bg-[#01508d] cursor-pointer">
                <Pencil size={10} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-600">Select Image</p>
          </div>

          {/* FORM */}
          {/* FIRST NAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              First Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 "
              />
            </div>
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Last Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 "
              />
            </div>
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <div className="relative">
              <AtSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200"
              />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                placeholder="+977 98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 "
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1 text-sm bg-[#006BAA] text-white px-3 py-1.5 rounded-md hover:bg-[#01508d]"
            >
              <Save size={14} />
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
