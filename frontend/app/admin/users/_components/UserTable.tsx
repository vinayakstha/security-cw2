"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import DeleteModal from "@/app/_components/DeleteModal";
import { Search } from "lucide-react";

const UserTable = ({
  users,
  pagination,
  search,
}: {
  users: any[];
  pagination: any;
  search?: string;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (search) setSearchTerm(search);
  }, [search]);

  const handleSearchChange = () => {
    router.push(
      `/admin/users?page=1&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""),
    );
  };

  const makePagination = (): React.ReactElement[] => {
    const pages: React.ReactElement[] = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    const delta = 2;

    // Previous
    pages.push(
      <Link
        key="prev"
        href={
          currentPage === 1
            ? "#"
            : `/admin/users?page=${currentPage - 1}&size=${pagination.size}`
        }
        className={`px-3 py-1 border rounded-md ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 pointer-events-none"
            : "bg-white text-[#006BAA] hover:bg-blue-100"
        }`}
      >
        Previous
      </Link>,
    );

    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={`/admin/users?page=1&size=${pagination.size}`}
          className="px-3 py-1 border rounded-md bg-white text-[#006BAA] hover:bg-blue-100"
        >
          1
        </Link>,
      );
      if (startPage > 2) pages.push(<span key="e1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={`/admin/users?page=${i}&size=${pagination.size}`}
          className={`px-3 py-1 border rounded-md ${
            i === currentPage
              ? "bg-[#006BAA] text-white"
              : "bg-white text-[#006BAA] hover:bg-blue-100"
          }`}
        >
          {i}
        </Link>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(<span key="e2">...</span>);
      pages.push(
        <Link
          key={totalPages}
          href={`/admin/users?page=${totalPages}&size=${pagination.size}`}
          className="px-3 py-1 border rounded-md bg-white text-[#006BAA] hover:bg-blue-100"
        >
          {totalPages}
        </Link>,
      );
    }

    // Next
    pages.push(
      <Link
        key="next"
        href={
          currentPage === totalPages
            ? "#"
            : `/admin/users?page=${currentPage + 1}&size=${pagination.size}`
        }
        className={`px-3 py-1 border rounded-md ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 pointer-events-none"
            : "bg-white text-[#006BAA] hover:bg-blue-100"
        }`}
      >
        Next
      </Link>,
    );

    return pages;
  };

  const onDelete = async () => {
    try {
      await handleDeleteUser(deleteId!);
      toast.success("User deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />

      {/* Search */}
      {/* <div className="p-4 bg-gray-50 border-b border-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchChange()}
          placeholder="Search users..."
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchChange}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Search size={15} />
          Search
        </button>
      </div> */}

      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchChange()}
          placeholder="Search users..."
          className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchChange}
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#006BAA] text-white rounded-md hover:bg-[#01508d]"
        >
          <Search size={15} />
          Search
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {[
              "ID",
              "Image",
              "Name",
              "Username",
              "Email",
              "Role",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{user._id}</td>

              <td className="px-4 py-2">
                {user.profilePicture ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profilePicture}`}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <img
                    src="/images/avatar.png"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                )}
              </td>

              <td className="px-4 py-2 text-sm text-gray-700">
                {[user.firstName, user.lastName].filter(Boolean).join(" ")}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {user.username}
              </td>

              <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>

              <td className="px-4 py-2 text-sm text-gray-700 capitalize">
                {user.role}
              </td>

              <td className="px-4 py-2 text-sm space-x-3">
                <Link
                  href={`/admin/users/${user._id}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg
                             bg-green-50 text-green-600 hover:bg-green-100
                             transition"
                >
                  View
                </Link>
                <Link
                  href={`/admin/users/${user._id}/edit`}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg
                             bg-yellow-50 text-yellow-600 hover:bg-yellow-100
                             transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteId(user._id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg
                             bg-red-50 text-red-600 hover:bg-red-100
                             transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <div className="space-x-2">{makePagination()}</div>
      </div>
    </div>
  );
};

export default UserTable;
