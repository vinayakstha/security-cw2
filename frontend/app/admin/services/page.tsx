"use client";

import { useEffect, useState } from "react";
import ServiceCard from "./_components/ServiceCard";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  handleGetServices,
  handleDeleteService,
} from "@/lib/actions/admin/service-action";
import DeleteModal from "../../_components/DeleteModal";

interface Service {
  _id: string;
  serviceName: string;
  serviceImage: string;
}

export default function Page() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const result = await handleGetServices();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedServiceId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedServiceId) return;
    try {
      const result = await handleDeleteService(selectedServiceId);
      if (result.success) {
        toast.success(result.message);
        // Refresh services after deletion
        fetchServices();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete service");
    } finally {
      setDeleteModalOpen(false);
      setSelectedServiceId(null);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="pr-3 pl-3">
      {/* Create Service Link */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/services/create"
          className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#07ac1d] hover:bg-[#06c720] text-white rounded transition"
        >
          <Plus size={20} />
          Create Service
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              title={service.serviceName}
              image={`http://localhost:5050${service.serviceImage}`}
              onEdit={() =>
                router.push(`/admin/services/edit-service/${service._id}`)
              }
              onDelete={() => handleDeleteClick(service._id)}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
}
