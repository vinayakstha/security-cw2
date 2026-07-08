"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, User, Heart, Calendar, PanelLeftClose } from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Services", icon: Briefcase, path: "/user/services" },
  { name: "My Bookings", icon: Calendar, path: "/user/my-bookings" },
  { name: "Favourites", icon: Heart, path: "/user/favourites" },
  { name: "Profile", icon: User, path: "/user/profile" },
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
      {/* Toggle button */}
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
