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
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 w-full gap-4">
      <div className="shrink-0 w-28 h-28 rounded-lg overflow-hidden">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between gap-1">
        <h2 className="text-lg font-semibold">{serviceName}</h2>
        <p className="text-gray-600 font-medium">Rs. {price}</p>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <User size={16} />
          <span>{user}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar size={16} />
          <span>{bookingDate}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock size={16} />
          <span>{bookingTime}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-3">
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
