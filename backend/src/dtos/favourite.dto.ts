import { z } from "zod";

export const CreateFavouriteDto = z.object({
  serviceId: z.string(),
});

export type CreateFavouriteDtoType = z.infer<typeof CreateFavouriteDto>;
