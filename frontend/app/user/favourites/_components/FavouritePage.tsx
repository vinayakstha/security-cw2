"use client";

import { useState, useEffect } from "react";
import ServiceCard from "../../services/_components/ServiceCard";
import {
  handleGetFavouritesByUser,
  handleAddFavourite,
  handleRemoveFavourite,
} from "@/lib/actions/favourite-action";
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  serviceName: string;
  price: string;
  serviceImage: string;
}

interface Favourite {
  _id: string;
  serviceId: Service;
}

export default function FavouritePage() {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5050";

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);

        const result = await handleGetFavouritesByUser();
        if (result.success && result.data) {
          // Ensure service images have full URL
          const favouritesWithFullImage = result.data.map((fav: Favourite) => ({
            ...fav,
            serviceId: {
              ...fav.serviceId,
              serviceImage: fav.serviceId.serviceImage
                ? `${IMAGE_BASE_URL}${fav.serviceId.serviceImage}`
                : "/images/service-placeholder.png",
            },
          }));
          setFavourites(favouritesWithFullImage);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleToggleFavourite = async (serviceId: string) => {
    const existingFavourite = favourites.find(
      (fav) => fav.serviceId._id === serviceId,
    );

    if (existingFavourite) {
      // Optimistic update
      setFavourites((prev) =>
        prev.filter((fav) => fav._id !== existingFavourite._id),
      );
      await handleRemoveFavourite(existingFavourite._id);
    } else {
      const result = await handleAddFavourite(serviceId);
      if (result.success) {
        setFavourites((prev) => [...prev, result.data]);
      }
    }
  };

  return (
    <div className="w-full p-4 md:p-6 min-h-screen">
      <h1 className="text-lg font-semibold text-gray-700 mb-6">
        My Favourites
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-12">{error}</p>
      ) : favourites.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          You have no favourite services yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((fav) => (
            <ServiceCard
              key={fav._id}
              serviceName={fav.serviceId.serviceName}
              servicePrice={` ${fav.serviceId.price}`}
              serviceImage={fav.serviceId.serviceImage}
              isFavourited={true}
              onFavouriteClick={() => handleToggleFavourite(fav.serviceId._id)}
              onBookNow={() =>
                router.push(`/user/services/${fav.serviceId._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
