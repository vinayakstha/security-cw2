"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Layers, Wrench, CalendarCheck } from "lucide-react";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetCategories } from "@/lib/actions/admin/category-action";
import { handleGetServices } from "@/lib/actions/admin/service-action";
import { handleGetAllBookings } from "@/lib/actions/admin/booking-action";

// Types
type ChartItem = {
  name: string;
  value: number;
};

type Metrics = {
  users: number;
  categories: number;
  services: number;
  bookings: number;
};

// Booking status colors
const STATUS_COLORS: Record<string, string> = {
  pending: "#006BAA",
  completed: "#22C55E",
  cancelled: "#FF4D4F",
  unknown: "#8884d8",
};

// Bar color
const BAR_COLOR = "#006BAA";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    users: 0,
    categories: 0,
    services: 0,
    bookings: 0,
  });

  const [serviceByCategory, setServiceByCategory] = useState<ChartItem[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const [userResult, categoryResult, serviceResult, bookingResult] =
          await Promise.all([
            handleGetAllUsers("1", "1"),
            handleGetCategories(),
            handleGetServices(),
            handleGetAllBookings(),
          ]);

        // Set metrics
        setMetrics({
          users:
            userResult.success && userResult.pagination
              ? userResult.pagination.totalItems
              : 0,
          categories:
            categoryResult.success && categoryResult.data
              ? categoryResult.data.length
              : 0,
          services:
            serviceResult.success && serviceResult.data
              ? serviceResult.data.length
              : 0,
          bookings:
            bookingResult.success && bookingResult.data
              ? bookingResult.data.length
              : 0,
        });

        // Services by Category Bar Chart
        if (
          categoryResult.success &&
          categoryResult.data &&
          serviceResult.success &&
          serviceResult.data
        ) {
          const categories = categoryResult.data;
          const services = serviceResult.data;

          const chartData: ChartItem[] = categories.map((cat: any) => {
            const count = services.filter(
              (s: any) => s.categoryId?._id === cat._id,
            ).length;
            return { name: cat.categoryName || "Unknown", value: count };
          });

          setServiceByCategory(chartData);
        }

        // Bookings by Status Pie Chart
        if (bookingResult.success && bookingResult.data) {
          const statusCount: Record<string, number> = {};
          bookingResult.data.forEach((b: any) => {
            const status = b.status?.toLowerCase() || "unknown";
            statusCount[status] = (statusCount[status] || 0) + 1;
          });

          const pieData: ChartItem[] = Object.keys(statusCount).map(
            (status) => ({
              name: status,
              value: statusCount[status],
            }),
          );

          setBookingStatusData(pieData);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h2 className="text-3xl text-gray-800 mt-1">
              {loading ? "..." : metrics.users}
            </h2>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="text-blue-600" size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Categories</p>
            <h2 className="text-3xl text-gray-800 mt-1">
              {loading ? "..." : metrics.categories}
            </h2>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Layers className="text-green-600" size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Services</p>
            <h2 className="text-3xl text-gray-800 mt-1">
              {loading ? "..." : metrics.services}
            </h2>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Wrench className="text-purple-600" size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="text-3xl text-gray-800 mt-1">
              {loading ? "..." : metrics.bookings}
            </h2>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <CalendarCheck className="text-yellow-600" size={22} />
          </div>
        </div>
      </div>

      {/* Charts Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bookings by Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex-1 h-[400px]">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Bookings by Status
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Services by Category Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow flex-1 h-[400px]">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Services by Category
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={serviceByCategory}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 9 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={BAR_COLOR} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
