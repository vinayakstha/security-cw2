import z from "zod";
import { passwordSchema } from "@/lib/utils/passwordPolicy";

export const forgetPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email" }),
});
export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
