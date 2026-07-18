import z from "zod";

/**
 * Password Policy Configuration
 *
 * Requirements enforced across registration, password reset, and admin user creation:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special character
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_PATTERNS = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-`~\[\]\\\/';+=]/,
} as const;

export const PASSWORD_RULES = [
  {
    key: "minLength" as const,
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (pw: string) => pw.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: "uppercase" as const,
    label: "At least 1 uppercase letter (A-Z)",
    test: (pw: string) => PASSWORD_PATTERNS.hasUppercase.test(pw),
  },
  {
    key: "lowercase" as const,
    label: "At least 1 lowercase letter (a-z)",
    test: (pw: string) => PASSWORD_PATTERNS.hasLowercase.test(pw),
  },
  {
    key: "digit" as const,
    label: "At least 1 digit (0-9)",
    test: (pw: string) => PASSWORD_PATTERNS.hasDigit.test(pw),
  },
  {
    key: "specialChar" as const,
    label: "At least 1 special character (!@#$%^&* etc.)",
    test: (pw: string) => PASSWORD_PATTERNS.hasSpecialChar.test(pw),
  },
];

export interface PasswordStrength {
  /** 0–100 score */
  score: number;
  label: "Weak" | "Fair" | "Strong" | "Very Strong";
  /** List of rules that are met (passed) */
  passed: string[];
  /** List of rules that are NOT met */
  failed: string[];
}

/**
 * Evaluate a password and return strength metrics + detailed feedback.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).map(
    (r) => r.label,
  );
  const failed = PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
    (r) => r.label,
  );

  const passedCount = passed.length;
  const totalRules = PASSWORD_RULES.length;

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
 * Simple validation function – returns a boolean + array of error strings.
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors = PASSWORD_RULES.filter((r) => !r.test(password)).map(
    (r) => r.label,
  );
  return { valid: errors.length === 0, errors };
}

/**
 * Reusable Zod schema that can be composed into any DTO / form schema.
 *
 * Usage:
 *   password: passwordSchema,
 *   confirmPassword: z.string(),
 *
 *   Or in a refine:
 *   password: passwordSchema,
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .max(PASSWORD_MAX_LENGTH, {
    message: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(PASSWORD_PATTERNS.hasUppercase, {
    message: "Password must contain at least one uppercase letter (A-Z)",
  })
  .regex(PASSWORD_PATTERNS.hasLowercase, {
    message: "Password must contain at least one lowercase letter (a-z)",
  })
  .regex(PASSWORD_PATTERNS.hasDigit, {
    message: "Password must contain at least one digit (0-9)",
  })
  .regex(PASSWORD_PATTERNS.hasSpecialChar, {
    message: "Password must contain at least one special character (!@#$%^&* etc.)",
  });
