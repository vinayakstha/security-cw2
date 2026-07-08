import z from "zod";

export const CategorySchema = z.object({
  categoryName: z.string(),
  categoryImage: z.string(),
});

export type CategoryType = z.infer<typeof CategorySchema>;
