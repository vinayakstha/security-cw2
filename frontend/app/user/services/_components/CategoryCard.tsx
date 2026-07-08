"use client";

interface CategoryCardProps {
  name: string;
  image: string;
  onClick?: () => void;
}

export default function CategoryCard({
  name,
  image,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="w-32 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer bg-white overflow-hidden"
    >
      <img src={image} alt={name} className="w-full h-20 object-contain" />

      <div className="p-1.5 text-center">
        <h3 className="text-xs font-medium text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
