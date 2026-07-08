import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";
import { Plus, Search } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const size = (params.size as string) || "10";
  const search = (params.search as string) || "";

  const response = await handleGetAllUsers(page, size, search as string);

  if (!response.success) {
    throw new Error(response.message || "Failed to load users");
  }

  return (
    <div className="bg-white">
      <div className="flex justify-end">
        <Link
          href="/admin/users/create"
          className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#07ac1d] hover:bg-[#06c720] text-white rounded transition"
        >
          <Plus size={16} />
          Create User
        </Link>
      </div>

      <UserTable
        users={response.data}
        pagination={response.pagination}
        search={search}
      />
    </div>
  );
}
