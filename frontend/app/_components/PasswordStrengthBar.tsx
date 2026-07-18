"use client";

import { PASSWORD_RULES, getPasswordStrength } from "@/lib/utils/passwordPolicy";
import { Check, X } from "lucide-react";

interface PasswordStrengthBarProps {
  password: string;
}

const BAR_COLORS: Record<string, string> = {
  Weak: "bg-red-500",
  Fair: "bg-orange-400",
  Strong: "bg-yellow-500",
  "Very Strong": "bg-green-500",
};

const TEXT_COLORS: Record<string, string> = {
  Weak: "text-red-600",
  Fair: "text-orange-500",
  Strong: "text-yellow-600",
  "Very Strong": "text-green-600",
};

export default function PasswordStrengthBar({
  password,
}: PasswordStrengthBarProps) {
  // Derived state — no useState/useEffect needed for pure computations
  const strength = getPasswordStrength(password);

  // Don't show anything until the user has started typing
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${BAR_COLORS[strength.label]}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {/* Label */}
      <p className={`text-xs font-semibold ${TEXT_COLORS[strength.label]}`}>
        {strength.label}
      </p>

      {/* Checklist */}
      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = strength.passed.includes(rule.key);
          return (
            <li
              key={rule.key}
              className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                passed ? "text-green-600" : "text-gray-400"
              }`}
            >
              {passed ? (
                <Check size={14} className="shrink-0 text-green-500" />
              ) : (
                <X size={14} className="shrink-0 text-gray-300" />
              )}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
