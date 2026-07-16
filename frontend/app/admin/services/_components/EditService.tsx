"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Plus, Pencil } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

import { handleGetCategories } from "@/lib/actions/admin/category-action";
import {
  handleGetService,
  handleUpdateService,
} from "@/lib/actions/admin/service-action";

interface Category {
  _id: string;
  categoryName: string;
}

export default function EditServiceForm() {
  const { id } = useParams();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM STATE
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ===============================
  // Fetch Service + Categories
  // ===============================
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryRes, serviceRes] = await Promise.all([
          handleGetCategories(),
          handleGetService(id as string),
        ]);
        console.log("Service Response:", serviceRes);

        if (categoryRes.success && categoryRes.data) {
          setCategories(categoryRes.data);
        }

        if (serviceRes.success && serviceRes.data) {
          const service = serviceRes.data;

          setServiceName(service.serviceName);
          setPrice(service.price);
          setCategoryId(service.categoryId._id);
          setDescription(service.serviceDescription);

          // Existing image preview
          setPreview(`http://localhost:5050${service.serviceImage}`);
        } else {
          toast.error(serviceRes.message);
        }
      } catch (error) {
        toast.error("Failed to fetch service data");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // ===============================
  // Image Handlers
  // ===============================
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async () => {
    if (!serviceName.trim()) return toast.error("Service name is required");
    if (!price) return toast.error("Price is required");
    if (!categoryId) return toast.error("Category is required");
    if (!description.trim()) return toast.error("Description is required");

    const formData = new FormData();
    formData.append("serviceName", serviceName);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId);
    formData.append("serviceDescription", description);

    // Only append image if user selected new one
    if (imageFile) {
      formData.append("serviceImage", imageFile);
    }

    try {
      const result = await handleUpdateService(id as string, formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/services");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update service");
    }
  };

  if (loading) return <p className="p-8">Loading service...</p>;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-lg font-semibold text-gray-700">Edit Service</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - Image */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium mb-2">
            Service Image
          </label>

          <div
            onClick={handleImageClick}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition bg-white overflow-hidden"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Click to upload image</p>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept=".jpg,.jpeg,.png"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Service Name
              </label>
              <input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-[#006BAA] hover:bg-[#01508d] text-white rounded-lg transition"
            >
              <Pencil size={20} />
              Update Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
