import axios from "axios";
import { RECAPTCHA_SECRET } from "../config";
import { HttpError } from "../errors/http-error";

export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) {
    throw new HttpError(400, "CAPTCHA token is required");
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: token,
        },
      },
    );

    const data = response.data as { success: boolean; score?: number };

    if (!data.success) {
      throw new HttpError(400, "CAPTCHA verification failed. Please try again.");
    }

    return true;
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "CAPTCHA verification service unavailable");
  }
}
