import z from "zod";

export const BookingSchema = z.object({
  userId: z.string(),
  serviceId: z.string(),
  bookingDate: z.string(),
  bookingTime: z.string(),
  price: z.string(),
  location: z.string(),
  status: z
    .enum(["pending", "paid", "completed", "cancelled"])
    .default("pending"),
});

export type BookingType = z.infer<typeof BookingSchema>;
