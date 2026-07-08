"use client";

import { Heart } from "lucide-react";

interface ServiceCardProps {
  serviceName: string;
  servicePrice: string;
  serviceImage: string;
  onBookNow?: () => void;
  onFavouriteClick?: () => void;
  isFavourited?: boolean;
}

export default function ServiceCard({
  serviceName,
  servicePrice,
  serviceImage,
  onBookNow,
  onFavouriteClick,
  isFavourited = false,
}: ServiceCardProps) {
  return (
    <div
      className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      style={{
        backgroundImage: `url(${serviceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        }}
      >
        {/* Title + Favourite side by side */}
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">{serviceName}</h3>

          <button
            onClick={onFavouriteClick}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <Heart
              size={20}
              className={`transition-all ${
                isFavourited ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>
        </div>

        <p className="text-white text-sm mb-3">Rs.{servicePrice}</p>

        {/* Book Now Button */}
        <button
          onClick={onBookNow}
          className="bg-[#006BAA] text-white font-semibold px-4 py-2 rounded hover:bg-[#01508d] transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
