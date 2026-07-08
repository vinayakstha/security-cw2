import z from "zod";

export const InitiatePaymentDto = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

export const VerifyPaymentDto = z.object({
  pidx: z.string().min(1, "pidx is required"),
});

export type InitiatePaymentDtoType = z.infer<typeof InitiatePaymentDto>;
export type VerifyPaymentDtoType = z.infer<typeof VerifyPaymentDto>;
