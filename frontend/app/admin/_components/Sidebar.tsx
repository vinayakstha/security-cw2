"use client";

import {
  Users,
  Grid,
  Briefcase,
  User,
  LayoutDashboard,
  CalendarPlus,
  PanelLeftClose,
  X,
} from "lucide-react";
import { useState } from "react";
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop collapsible sidebar */}
      <aside
        className={`
          h-full bg-[#006BAA] text-white border-r border-gray-200
          transition-all duration-300 relative
          hidden md:flex flex-col
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-4 ${
            isCollapsed ? "right-1/2 translate-x-1/2" : "right-4"
          } p-2 rounded-full hover:bg-[#01508d] transition z-10`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose size={20} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
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
                } ${isCollapsed ? "justify-center mx-1" : "pl-6 justify-start"}`}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Mobile overlay sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#006BAA] text-white
          z-50 transform transition-transform duration-300 ease-in-out
          md:hidden flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <span className="text-lg font-bold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#01508d] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col mt-2 px-2 gap-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#01508d] border-l-4 border-white"
                    : "hover:bg-[#01508d]"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
