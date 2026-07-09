import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;
export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Ghar-Care";

export const JWT_SECRET: string = process.env.JWT_SECRET || "defult";

export const RECAPTCHA_SECRET: string = process.env.RECAPTCHA_SECRET || "";

if (!RECAPTCHA_SECRET) {
  console.warn(
    "WARNING: RECAPTCHA_SECRET is not set. CAPTCHA verification will fail.",
  );
}
