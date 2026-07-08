import z from "zod";

export const FavouriteSchema = z.object({
  userId: z.string(),
  serviceId: z.string(),
});

export type FavouriteType = z.infer<typeof FavouriteSchema>;
