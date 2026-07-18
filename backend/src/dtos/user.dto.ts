import z from "zod";
import { UserSchema } from "../types/user.type";

export const CreateUserDTO = UserSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  phoneNumber: true,
  password: true,
  profilePicture: true,
})
  .extend({
    confirmPassword: z.string().min(6),
    profilePicture: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

/**
 * Strip HTML tags from a string to prevent XSS.
 */
const stripHtml = (val: string): string => val.replace(/<[^>]*>/g, "");

export const UpdateUserDTO = z.object({
  firstName: z.string().transform(stripHtml).optional(),
  lastName: z.string().transform(stripHtml).optional(),
  username: z.string().transform(stripHtml).optional(),
  phoneNumber: z.string().optional(),
  profilePicture: z.string().optional(),
});

// export const UpdateUserDTO = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
