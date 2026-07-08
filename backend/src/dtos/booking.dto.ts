import { z } from "zod";

export const CreateBookingDto = z.object({
  serviceId: z.string(),
  bookingDate: z.string(),
  bookingTime: z.string(),
  location: z.string(),
});

export type CreateBookingDtoType = z.infer<typeof CreateBookingDto>;

export const UpdateBookingStatusDto = z.object({
  status: z.enum(["pending", "paid", "completed", "cancelled"]),
});

export type UpdateBookingStatusDtoType = z.infer<typeof UpdateBookingStatusDto>;
