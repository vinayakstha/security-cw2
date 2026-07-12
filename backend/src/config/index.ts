import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;
export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Ghar-Care";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("FATAL: JWT_SECRET environment variable is not set.");
  console.error("Set a strong JWT_SECRET in your .env file before starting the server.");
  process.exit(1);
}

export const JWT_SECRET: string = jwtSecret;

export const RECAPTCHA_SECRET: string = process.env.RECAPTCHA_SECRET || "";

if (!RECAPTCHA_SECRET) {
  console.warn(
    "WARNING: RECAPTCHA_SECRET is not set. CAPTCHA verification will fail.",
  );
}

export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET: string =
  process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL: string =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:5050/api/auth/google/callback";

export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn(
    "WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set. Google OAuth will not work.",
  );
}
