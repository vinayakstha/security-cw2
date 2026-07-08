import { handleGetOneUser } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import {
  User,
  Mail,
  UserCircle,
  Phone,
  Shield,
  Calendar,
  ArrowLeft,
} from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await handleGetOneUser(id);

  if (!response.success) {
    throw new Error(response.message || "Failed to load user");
  }

  const user = response.data;

  return (
    <div className="min-h-screen">
      {/* HEADER: top-left corner */}
      <div className="flex items-center gap-3 p-4">
        <Link
          href="/admin/users"
          className="flex items-center text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-700">User Details</h1>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl bg-white shadow-sm rounded-xl border border-gray-200 p-6 space-y-4 m-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">First Name:</span>
            <span>{user.firstName || "-"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Last Name:</span>
            <span>{user.lastName || "-"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Email:</span>
            <span>{user.email || "-"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Username:</span>
            <span>{user.username || "-"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Phone className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Phone:</span>
            <span>{user.phoneNumber || "-"}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Role:</span>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                user.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role || "-"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700 text-sm">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-semibold w-28">Joined:</span>
            <span>{new Date(user.createdAt).toLocaleDateString() || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
