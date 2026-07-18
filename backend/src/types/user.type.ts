import z from "zod";
import { passwordSchema } from "../utils/passwordPolicy";

export const UserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(2),
  email: z.email(),
  phoneNumber: z.string().min(10).optional(),
  password: passwordSchema.optional(),
  profilePicture: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
  totpSecret: z.string().optional(),
  totpEnabled: z.boolean().default(false),
  googleId: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
