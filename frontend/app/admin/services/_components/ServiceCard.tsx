"use client";

import { Pencil, Trash2 } from "lucide-react";

interface ServiceCardProps {
  title: string;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ServiceCard({
  title,
  image,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl  duration-300">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Gradient Overlay from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition duration-300 group-hover:from-black/70" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <h2 className="text-xl font-semibold text-white drop-shadow-lg mb-2">
          {title}
        </h2>

        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded bg-[#006BAA] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#01508d] transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
