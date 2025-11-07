/**
 * PasswordStrengthIndicator Component
 *
 * Visual feedback component for password strength validation.
 *
 * @module
 */

"use client";

import { Progress } from "@workspace/ui/components/progress";
import { CheckCircle2, XCircle } from "lucide-react";
import { useMemo } from "react";

/**
 * Password strength level
 */
type StrengthLevel = "weak" | "fair" | "good" | "strong";

/**
 * Strength configuration
 */
interface StrengthConfig {
  label: string;
  color: string;
  value: number;
}

/**
 * Props for PasswordStrengthIndicator component
 */
export interface PasswordStrengthIndicatorProps {
  /**
   * Password to evaluate
   */
  password: string;

  /**
   * Show requirement checklist
   * @default true
   */
  showRequirements?: boolean;

  /**
   * Minimum password length
   * @default 8
   */
  minLength?: number;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Password requirement check
 */
interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

/**
 * Calculate password strength
 */
function calculatePasswordStrength(password: string): StrengthLevel {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "fair";
  if (strength <= 5) return "good";
  return "strong";
}

/**
 * Strength level configuration map
 */
const strengthConfig: Record<StrengthLevel, StrengthConfig> = {
  weak: {
    label: "Weak",
    color: "bg-destructive",
    value: 25,
  },
  fair: {
    label: "Fair",
    color: "bg-orange-500",
    value: 50,
  },
  good: {
    label: "Good",
    color: "bg-yellow-500",
    value: 75,
  },
  strong: {
    label: "Strong",
    color: "bg-green-500",
    value: 100,
  },
};

/**
 * Password strength indicator component.
 *
 * Features:
 * - Visual strength meter (weak, fair, good, strong)
 * - Requirement checklist
 * - Customizable minimum length
 * - Real-time validation feedback
 * - Color-coded strength levels
 *
 * @example Basic usage
 * ```tsx
 * <PasswordStrengthIndicator password={password} />
 * ```
 *
 * @example Without requirements
 * ```tsx
 * <PasswordStrengthIndicator
 *   password={password}
 *   showRequirements={false}
 * />
 * ```
 *
 * @example Custom minimum length
 * ```tsx
 * <PasswordStrengthIndicator
 *   password={password}
 *   minLength={12}
 * />
 * ```
 *
 * @param props - Component props
 * @returns Password strength indicator component
 * @public
 */
export function PasswordStrengthIndicator({
  password,
  showRequirements = true,
  minLength = 8,
  className,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  const config = strengthConfig[strength];

  const requirements: PasswordRequirement[] = useMemo(
    () => [
      {
        label: `At least ${minLength} characters`,
        test: (pwd) => pwd.length >= minLength,
      },
      {
        label: "One uppercase letter",
        test: (pwd) => /[A-Z]/.test(pwd),
      },
      {
        label: "One lowercase letter",
        test: (pwd) => /[a-z]/.test(pwd),
      },
      {
        label: "One number",
        test: (pwd) => /[0-9]/.test(pwd),
      },
      {
        label: "One special character",
        test: (pwd) => /[^a-zA-Z0-9]/.test(pwd),
      },
    ],
    [minLength],
  );

  if (!password) return null;

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span className="font-medium">{config.label}</span>
        </div>
        <Progress value={config.value} className={config.color} />
      </div>

      {showRequirements && (
        <div className="mt-3 space-y-2">
          {requirements.map((req) => {
            const passed = req.test(password);
            return (
              <div key={req.label} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={passed ? "text-green-500" : "text-muted-foreground"}>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
