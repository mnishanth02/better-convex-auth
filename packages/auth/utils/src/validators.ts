/**
 * Authentication Validators
 *
 * Zod schemas for validating authentication-related data.
 * These validators ensure data integrity and security.
 */

import { z } from "zod";

/**
 * Email validator
 * - Must be a valid email format
 * - Trimmed and lowercase
 */
export const EmailSchema = z
  .string()
  .email("Invalid email address")
  .trim()
  .toLowerCase()
  .describe("User email address");

/**
 * Password validator
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - Must contain:
 *   - At least one uppercase letter
 *   - At least one lowercase letter
 *   - At least one number
 *   - At least one special character
 */
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
  .describe("User password with strength requirements");

/**
 * Simplified password validator (for less strict requirements)
 * - Minimum 8 characters
 * - Maximum 128 characters
 */
export const SimplePasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .describe("User password with basic requirements");

/**
 * Username validator
 * - 3-20 characters
 * - Only letters, numbers, and underscores
 * - Cannot start or end with underscore
 */
export const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
  .regex(/^[a-zA-Z0-9]/, "Username cannot start with an underscore")
  .regex(/[a-zA-Z0-9]$/, "Username cannot end with an underscore")
  .toLowerCase()
  .describe("Unique username");

/**
 * Display name validator
 * - 2-50 characters
 * - Trimmed whitespace
 */
export const DisplayNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .trim()
  .describe("User display name");

/**
 * Phone number validator (international format)
 * - E.164 format: +[country code][number]
 * - Examples: +1234567890, +441234567890
 */
export const PhoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Use international format (e.g., +1234567890)")
  .describe("Phone number in E.164 format");

/**
 * Organization slug validator
 * - 3-50 characters
 * - Only lowercase letters, numbers, and hyphens
 * - Cannot start or end with hyphen
 */
export const OrganizationSlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must be at most 50 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
  .regex(/^[a-z0-9]/, "Slug cannot start with a hyphen")
  .regex(/[a-z0-9]$/, "Slug cannot end with a hyphen")
  .describe("URL-friendly organization identifier");

/**
 * Sign up form validator
 * - Email, password, confirm password, name
 * - Passwords must match
 */
export const SignUpSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
    name: DisplayNameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Sign in form validator
 * - Email and password
 */
export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Password reset request validator
 */
export const PasswordResetRequestSchema = z.object({
  email: EmailSchema,
});

/**
 * Password reset confirmation validator
 */
export const PasswordResetSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Change password validator
 */
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: PasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

/**
 * Update profile validator
 */
export const UpdateProfileSchema = z.object({
  name: DisplayNameSchema.optional(),
  image: z.string().url("Invalid image URL").optional(),
});

/**
 * Organization creation validator
 */
export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100),
  slug: OrganizationSlugSchema,
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

/**
 * Organization update validator
 */
export const UpdateOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100).optional(),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

/**
 * Invite member validator
 */
export const InviteMemberSchema = z.object({
  email: EmailSchema,
  role: z.enum(["owner", "admin", "member"]),
  message: z.string().max(500, "Message must be at most 500 characters").optional(),
});

/**
 * OTP (One-Time Password) validator
 * - 6 digits
 */
export const OTPSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only digits")
  .describe("6-digit one-time password");

/**
 * Backup code validator
 * - 10 alphanumeric characters
 */
export const BackupCodeSchema = z
  .string()
  .length(10, "Backup code must be exactly 10 characters")
  .regex(/^[A-Z0-9]{10}$/, "Invalid backup code format")
  .describe("10-character backup code");

/**
 * URL validator
 */
export const URLSchema = z.string().url("Invalid URL format");

/**
 * Redirect URL validator (for OAuth callbacks)
 * - Must be a valid URL
 * - Must be HTTP or HTTPS
 */
export const RedirectURLSchema = z
  .string()
  .url("Invalid redirect URL")
  .regex(/^https?:\/\//, "Redirect URL must use HTTP or HTTPS protocol");

// Type exports for TypeScript
export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignInData = z.infer<typeof SignInSchema>;
export type PasswordResetRequestData = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetData = z.infer<typeof PasswordResetSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
export type CreateOrganizationData = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof UpdateOrganizationSchema>;
export type InviteMemberData = z.infer<typeof InviteMemberSchema>;
