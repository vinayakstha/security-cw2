import React, { JSX } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Hourglass,
  CreditCard,
} from "lucide-react";

interface BookingCardProps {
  serviceImage: string;
  serviceName: string;
  price: number;
  bookingDate: string;
  bookingTime: string;
  location: string;
  status: "pending" | "cancelled" | "completed" | "paid"; // add paid
}

export default function BookingCard({
  serviceImage,
  serviceName,
  price,
  bookingDate,
  bookingTime,
  location,
  status,
}: BookingCardProps) {
  const statusInfo: Record<
    string,
    { bg: string; text: string; icon: JSX.Element }
  > = {
    pending: {
      bg: "bg-blue-100",
      text: "text-[#006BAA]",
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

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl shadow-md p-3 sm:p-4 w-full gap-3 sm:gap-4">
      {/* Left: Image - full width on mobile, fixed on desktop */}
      <div className="w-full sm:w-28 h-40 sm:h-28 rounded-lg overflow-hidden shrink-0">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Middle: Booking Details */}
      <div className="flex-1 w-full sm:w-auto flex flex-col justify-between gap-1.5 sm:gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-lg font-semibold leading-tight">{serviceName}</h2>
          {/* Mobile status badge */}
          <span
            className={`sm:hidden shrink-0 px-2 py-0.5 rounded-full font-semibold text-xs flex items-center gap-1 ${statusInfo[status]?.bg ?? "bg-gray-100"} ${statusInfo[status]?.text ?? "text-gray-600"}`}
          >
            {statusInfo[status]?.icon}
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600 font-semibold sm:font-medium text-sm sm:text-base">Rs. {price.toFixed(2)}</p>

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
      </div>

      {/* Desktop status badge */}
      <div className="hidden sm:flex shrink-0 items-center gap-1 self-center">
        <span
          className={`px-2 py-1 rounded-full font-semibold text-sm flex items-center gap-1 ${statusInfo[status]?.bg ?? "bg-gray-100"} ${statusInfo[status]?.text ?? "text-gray-600"}`}
        >
          {statusInfo[status]?.icon}
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
