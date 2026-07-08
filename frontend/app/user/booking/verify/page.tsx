"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { handleVerifyPayment } from "@/lib/actions/payment-action";
import { toast } from "react-toastify";
import { handleDeleteBooking } from "@/lib/actions/booking-action";

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );

  useEffect(() => {
    const pidx = searchParams.get("pidx");
    const bookingId = searchParams.get("purchase_order_id"); // Khalti sends this back

    if (!pidx) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      const result = await handleVerifyPayment(pidx);
      if (result.success) {
        setStatus("success");
        toast.success("Payment successful!");
        setTimeout(() => router.push("/user/my-bookings"), 2000);
      } else {
        if (bookingId) {
          await handleDeleteBooking(bookingId);
        }
        setStatus("failed");
        toast.error("Payment cancelled or failed. Booking has been removed.");
        setTimeout(() => router.push("/user/my-bookings"), 2000);
      }
    };

    verify();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "verifying" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006BAA] mx-auto mb-4" />
          <p className="text-lg font-medium">Verifying your payment...</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center text-green-600">
          <p className="text-2xl font-bold">✓ Payment Successful!</p>
          <p className="text-gray-500 mt-2">Redirecting to your bookings...</p>
        </div>
      )}
      {status === "failed" && (
        <div className="text-center text-red-500">
          <p className="text-2xl font-bold">✗ Payment Failed</p>
          <p className="text-gray-500 mt-2">Redirecting to your bookings...</p>
        </div>
      )}
    </div>
  );
}
