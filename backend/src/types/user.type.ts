import z from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  username: z.string().min(2),
  email: z.email(),
  phoneNumber: z.string().min(10).optional(),
  password: z.string().min(6).optional(),
  profilePicture: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
  totpSecret: z.string().optional(),
  totpEnabled: z.boolean().default(false),
  googleId: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
