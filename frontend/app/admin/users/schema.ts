import z from "zod";
import { passwordSchema } from "@/lib/utils/passwordPolicy";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const UserSchema = z
  .object({
    email: z.email({ message: "Enter a valid email" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    profilePicture: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 5MB",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg and .png formats are supported",
      }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserData = z.infer<typeof UserSchema>;

export const UserEditSchema = UserSchema.partial();
export type UserEditData = z.infer<typeof UserEditSchema>;
