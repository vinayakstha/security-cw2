"use client";

import React, { JSX } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Hourglass,
  Eye,
  User,
  CreditCard,
} from "lucide-react";

interface ManageBookingCardProps {
  serviceImage: string;
  serviceName: string;
  price: string;
  user: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  status: "pending" | "cancelled" | "completed" | "paid";
  onView?: () => void;
}

export default function ManageBookingCard({
  serviceImage,
  serviceName,
  price,
  user,
  bookingDate,
  bookingTime,
  location,
  status,
  onView,
}: ManageBookingCardProps) {
  const statusInfo: Record<
    "pending" | "cancelled" | "completed" | "paid",
    { bg: string; text: string; icon: JSX.Element }
  > = {
    pending: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <Hourglass size={16} />,
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-600",
      icon: <XCircle size={16} />,
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-600",
      icon: <CheckCircle size={16} />,
    },
    paid: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      icon: <CreditCard size={16} />,
    },
  };

  const currentStatus = statusInfo[status] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
    icon: null,
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl shadow-md p-3 sm:p-4 w-full gap-3 sm:gap-4">
      <div className="w-full sm:w-28 h-40 sm:h-28 rounded-lg overflow-hidden shrink-0">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 w-full sm:w-auto flex flex-col justify-between gap-1.5 sm:gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{serviceName}</h2>
          {/* Mobile status badge */}
          <span
            className={`sm:hidden shrink-0 px-2 py-0.5 rounded-full font-semibold text-xs flex items-center gap-1 ${currentStatus.bg} ${currentStatus.text}`}
          >
            {currentStatus.icon}
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600 font-semibold sm:font-medium text-sm sm:text-base">Rs. {price}</p>

        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
          <User size={14} className="sm:size-[16px]" />
          <span className="truncate">{user}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-1 mt-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
            <Calendar size={14} className="sm:size-[16px]" />
            <span className="truncate">{bookingDate}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
            <Clock size={14} className="sm:size-[16px]" />
            <span className="truncate">{bookingTime}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm sm:col-span-2">
            <MapPin size={14} className="sm:size-[16px]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Mobile View Details button */}
        <button
          onClick={onView}
          className="sm:hidden flex items-center justify-center gap-1.5 mt-1 w-full py-2 rounded-lg text-sm font-medium text-white bg-[#006BAA] hover:bg-[#01508d] transition"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>

      <div className="hidden sm:flex shrink-0 flex-col items-end gap-3 self-center">
        <span
          className={`px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1 ${currentStatus.bg} ${currentStatus.text}`}
        >
          {currentStatus.icon}
          {status.toUpperCase()}
        </span>

        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm font-medium text-[#006BAA] hover:underline"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  );
}
