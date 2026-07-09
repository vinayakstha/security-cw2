import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for login endpoint.
 * Allows 5 requests per 15 minutes per IP to prevent brute-force attacks.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Moderate rate limiter for registration endpoint.
 * Allows 3 requests per 15 minutes per IP to prevent account creation spam.
 */
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for password reset requests.
 * Allows 3 requests per 15 minutes per IP.
 */
export const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for password reset submission (with token).
 * Allows 5 requests per 15 minutes per IP.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many password reset attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for TOTP verification during login.
 * Allows 5 requests per 15 minutes per IP to prevent brute-force attacks on TOTP codes.
 */
export const totpLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message:
      "Too many TOTP verification attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
