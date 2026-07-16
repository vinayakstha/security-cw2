"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleGetCategories } from "@/lib/actions/admin/category-action";
import { handleCreateService } from "@/lib/actions/admin/service-action";

interface Category {
  _id: string;
  categoryName: string;
}

export default function CreateServiceForm() {
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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await handleGetCategories();
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!serviceName.trim()) return toast.error("Service name is required");
    if (!price) return toast.error("Price is required");
    if (!categoryId) return toast.error("Category is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!imageFile) return toast.error("Image is required");

    const formData = new FormData();
    formData.append("serviceName", serviceName);
    formData.append("price", price.toString());
    formData.append("categoryId", categoryId);
    formData.append("serviceDescription", description);
    formData.append("serviceImage", imageFile);

    try {
      const result = await handleCreateService(formData);
      if (result.success) {
        toast.success(result.message);
        // Clear form
        setServiceName("");
        setPrice("");
        setCategoryId("");
        setDescription("");
        setImageFile(null);
        setPreview(null);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create service");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-lg font-semibold text-gray-700">Create Service</h2>

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

        {/* RIGHT SIDE - Form Fields */}
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
                placeholder="Enter service name"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            {loading ? (
              <p>Loading categories...</p>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            )}
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
              placeholder="Enter service description"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-[#07ac1d] hover:bg-[#06c720] text-white rounded-lg transition"
            >
              <Plus size={20} />
              Create Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
