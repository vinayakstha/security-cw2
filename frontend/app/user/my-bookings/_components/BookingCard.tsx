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
    <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 w-full gap-4">
      {/* Left: Image */}
      <div className="shrink-0 w-28 h-28 rounded-lg overflow-hidden">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Middle: Booking Details */}
      <div className="flex-1 flex flex-col justify-between gap-1">
        <h2 className="text-lg font-semibold">{serviceName}</h2>
        <p className="text-gray-600 font-medium">Rs. {price.toFixed(2)}</p>

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

      <div className="shrink-0 flex items-center gap-1">
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
