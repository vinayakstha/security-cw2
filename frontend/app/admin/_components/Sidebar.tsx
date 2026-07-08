"use client";

import { useState } from "react";
import {
  Menu,
  Users,
  Grid,
  Briefcase,
  User,
  LayoutDashboard,
  CalendarPlus,
  PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Categories", icon: Grid, path: "/admin/categories" },
  { name: "Services", icon: Briefcase, path: "/admin/services" },
  {
    name: "Manage Bookings",
    icon: CalendarPlus,
    path: "/admin/manage-booking",
  },
  { name: "Profile", icon: User, path: "/admin/profile" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`h-screen bg-[#006BAA] text-white border-r border-gray-200 relative transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle button - absolute so it doesn’t affect layout */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-4 ${
          isOpen ? "right-4" : "right-1/2 transform translate-x-1/2"
        } p-2 rounded-full hover:bg-[#01508d] transition`}
      >
        <PanelLeftClose size={20} />
      </button>

      {/* Menu Items */}
      <div className="flex flex-col mt-20 transition-all duration-300">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 py-3 rounded transition-colors px-2 ${
                isActive
                  ? "bg-[#01508d] border-l-4 border-white"
                  : "hover:bg-[#01508d]"
              } ${isOpen ? "pl-6 justify-start" : "justify-center"}`}
            >
              <Icon size={20} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
