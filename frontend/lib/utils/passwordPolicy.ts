import { z } from "zod";

/**
 * Password Policy — client-side mirror of backend/src/utils/passwordPolicy.ts
 *
 * Used for real-time strength feedback without a server round-trip.
 * The backend always performs the authoritative validation.
 *
 * Re-exports a ready-to-use Zod `passwordSchema` so every form can share
 * the exact same validation rules without duplication.
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_RULES = [
  {
    key: "minLength" as const,
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (pw: string) => pw.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: "uppercase" as const,
    label: "At least 1 uppercase letter (A-Z)",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    key: "lowercase" as const,
    label: "At least 1 lowercase letter (a-z)",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    key: "digit" as const,
    label: "At least 1 digit (0-9)",
    test: (pw: string) => /\d/.test(pw),
  },
  {
    key: "specialChar" as const,
    label: "At least 1 special character (!@#$%^&* etc.)",
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>_\-`~\[\]\\\/';+=]/.test(pw),
  },
] as const;

export type PasswordRuleKey = (typeof PASSWORD_RULES)[number]["key"];

export interface PasswordStrength {
  /** 0–100 score */
  score: number;
  /** Human-readable strength label */
  label: "Weak" | "Fair" | "Strong" | "Very Strong";
  /** Keys of rules that passed */
  passed: PasswordRuleKey[];
  /** Keys of rules that failed */
  failed: PasswordRuleKey[];
}

/**
 * Evaluate a password and return detailed strength metrics.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).map(
    (r) => r.key,
  );
  const failed = PASSWORD_RULES.filter((r) => !r.test(password)).map(
    (r) => r.key,
  );

  const passedCount = passed.length;
  let score: number;
  let label: PasswordStrength["label"];

  if (passedCount <= 2) {
    score = 25;
    label = "Weak";
  } else if (passedCount === 3) {
    score = 50;
    label = "Fair";
  } else if (passedCount === 4) {
    score = 75;
    label = "Strong";
  } else {
    score = 100;
    label = "Very Strong";
  }

  return { score, label, passed, failed };
}

/**
 * Reusable Zod schema matching the backend policy.
 * Use in any form schema: `password: passwordSchema,`
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter (A-Z)",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter (a-z)",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one digit (0-9)",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>_\-`~\[\]\\\/';+=]/.test(val), {
    message: "Password must contain at least one special character (!@#$%^&* etc.)",
  });
