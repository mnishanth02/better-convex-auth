/**
 * Authentication Error Templates
 *
 * Standard error codes and user-friendly error messages with remediation steps.
 * This module provides consistent error handling across all auth packages.
 *
 * @packageDocumentation
 */

import type { ZodError } from "zod";

/**
 * Standard authentication error codes
 */
export enum AuthErrorCode {
  // Authentication errors
  UNAUTHORIZED = "AUTH_UNAUTHORIZED",
  INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  SESSION_EXPIRED = "AUTH_SESSION_EXPIRED",
  EMAIL_NOT_VERIFIED = "AUTH_EMAIL_NOT_VERIFIED",

  // Validation errors
  VALIDATION_ERROR = "AUTH_VALIDATION_ERROR",
  INVALID_EMAIL = "AUTH_INVALID_EMAIL",
  INVALID_PASSWORD = "AUTH_INVALID_PASSWORD",
  PASSWORD_TOO_WEAK = "AUTH_PASSWORD_TOO_WEAK",
  PASSWORDS_DO_NOT_MATCH = "AUTH_PASSWORDS_DO_NOT_MATCH",

  // Account errors
  ACCOUNT_NOT_FOUND = "AUTH_ACCOUNT_NOT_FOUND",
  ACCOUNT_ALREADY_EXISTS = "AUTH_ACCOUNT_ALREADY_EXISTS",
  ACCOUNT_DISABLED = "AUTH_ACCOUNT_DISABLED",

  // Token errors
  TOKEN_INVALID = "AUTH_TOKEN_INVALID",
  TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",

  // Rate limiting
  RATE_LIMIT_EXCEEDED = "AUTH_RATE_LIMIT_EXCEEDED",

  // Generic errors
  INTERNAL_ERROR = "AUTH_INTERNAL_ERROR",
  NETWORK_ERROR = "AUTH_NETWORK_ERROR",
}

/**
 * Error message with remediation steps
 */
export interface AuthErrorMessage {
  /** Error code */
  code: AuthErrorCode;
  /** User-friendly error message */
  message: string;
  /** Actionable remediation steps */
  remediation: string[];
  /** HTTP status code */
  statusCode: number;
}

/**
 * Error message templates
 */
export const ERROR_MESSAGES: Record<AuthErrorCode, AuthErrorMessage> = {
  [AuthErrorCode.UNAUTHORIZED]: {
    code: AuthErrorCode.UNAUTHORIZED,
    message: "Authentication required",
    remediation: ["Please sign in to access this resource", "If you don't have an account, sign up first"],
    statusCode: 401,
  },

  [AuthErrorCode.INVALID_CREDENTIALS]: {
    code: AuthErrorCode.INVALID_CREDENTIALS,
    message: "Invalid email or password",
    remediation: [
      "Check that your email and password are correct",
      "Password is case-sensitive",
      "Try resetting your password if you've forgotten it",
    ],
    statusCode: 401,
  },

  [AuthErrorCode.SESSION_EXPIRED]: {
    code: AuthErrorCode.SESSION_EXPIRED,
    message: "Your session has expired",
    remediation: ["Please sign in again to continue", "Enable 'Remember me' to stay signed in longer"],
    statusCode: 401,
  },

  [AuthErrorCode.EMAIL_NOT_VERIFIED]: {
    code: AuthErrorCode.EMAIL_NOT_VERIFIED,
    message: "Email verification required",
    remediation: [
      "Check your inbox for a verification email",
      "Click the verification link in the email",
      "Request a new verification email if needed",
    ],
    statusCode: 403,
  },

  [AuthErrorCode.VALIDATION_ERROR]: {
    code: AuthErrorCode.VALIDATION_ERROR,
    message: "Validation failed",
    remediation: ["Check the form for errors and try again", "Ensure all required fields are filled"],
    statusCode: 400,
  },

  [AuthErrorCode.INVALID_EMAIL]: {
    code: AuthErrorCode.INVALID_EMAIL,
    message: "Invalid email address",
    remediation: ["Enter a valid email address", "Example: user@example.com"],
    statusCode: 400,
  },

  [AuthErrorCode.INVALID_PASSWORD]: {
    code: AuthErrorCode.INVALID_PASSWORD,
    message: "Invalid password format",
    remediation: [
      "Password must be at least 8 characters",
      "Include at least one uppercase letter",
      "Include at least one lowercase letter",
      "Include at least one number",
      "Include at least one special character",
    ],
    statusCode: 400,
  },

  [AuthErrorCode.PASSWORD_TOO_WEAK]: {
    code: AuthErrorCode.PASSWORD_TOO_WEAK,
    message: "Password is too weak",
    remediation: [
      "Use a longer password (12+ characters recommended)",
      "Mix uppercase and lowercase letters",
      "Add numbers and special characters",
      "Avoid common words and patterns",
    ],
    statusCode: 400,
  },

  [AuthErrorCode.PASSWORDS_DO_NOT_MATCH]: {
    code: AuthErrorCode.PASSWORDS_DO_NOT_MATCH,
    message: "Passwords do not match",
    remediation: ["Ensure both password fields match exactly", "Password is case-sensitive"],
    statusCode: 400,
  },

  [AuthErrorCode.ACCOUNT_NOT_FOUND]: {
    code: AuthErrorCode.ACCOUNT_NOT_FOUND,
    message: "Account not found",
    remediation: ["Check that your email is correct", "Sign up if you don't have an account yet"],
    statusCode: 404,
  },

  [AuthErrorCode.ACCOUNT_ALREADY_EXISTS]: {
    code: AuthErrorCode.ACCOUNT_ALREADY_EXISTS,
    message: "An account with this email already exists",
    remediation: [
      "Sign in instead of signing up",
      "Reset your password if you've forgotten it",
      "Use a different email",
    ],
    statusCode: 409,
  },

  [AuthErrorCode.ACCOUNT_DISABLED]: {
    code: AuthErrorCode.ACCOUNT_DISABLED,
    message: "This account has been disabled",
    remediation: ["Contact support for assistance", "Check your email for information about your account status"],
    statusCode: 403,
  },

  [AuthErrorCode.TOKEN_INVALID]: {
    code: AuthErrorCode.TOKEN_INVALID,
    message: "Invalid or malformed token",
    remediation: ["Request a new verification link", "Ensure the entire link is copied correctly"],
    statusCode: 400,
  },

  [AuthErrorCode.TOKEN_EXPIRED]: {
    code: AuthErrorCode.TOKEN_EXPIRED,
    message: "This verification link has expired",
    remediation: ["Request a new verification email", "Verification links expire after 24 hours"],
    statusCode: 410,
  },

  [AuthErrorCode.RATE_LIMIT_EXCEEDED]: {
    code: AuthErrorCode.RATE_LIMIT_EXCEEDED,
    message: "Too many requests",
    remediation: ["Please wait a few minutes before trying again", "Rate limits help protect your account from abuse"],
    statusCode: 429,
  },

  [AuthErrorCode.INTERNAL_ERROR]: {
    code: AuthErrorCode.INTERNAL_ERROR,
    message: "An internal error occurred",
    remediation: ["Try again in a few moments", "Contact support if the problem persists"],
    statusCode: 500,
  },

  [AuthErrorCode.NETWORK_ERROR]: {
    code: AuthErrorCode.NETWORK_ERROR,
    message: "Network connection error",
    remediation: ["Check your internet connection", "Try again when connection is stable"],
    statusCode: 503,
  },
};

/**
 * Format a Zod validation error into user-friendly messages
 *
 * @param error - Zod validation error
 * @returns Array of error messages with field names
 *
 * @example
 * ```typescript
 * try {
 *   SignInSchema.parse(data);
 * } catch (error) {
 *   const messages = formatZodError(error);
 *   // ["Email: Invalid email format", "Password: Required"]
 * }
 * ```
 */
export function formatZodError(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const field = issue.path.join(".");
    const message = issue.message;

    // Format field name for better readability
    const fieldName = field ? `${field}: ` : "";

    // Return formatted message with field context
    return `${fieldName}${message}`;
  });
}

/**
 * Create a standardized auth error
 *
 * @param code - Error code
 * @param customMessage - Optional custom message to override default
 * @returns Error with code, message, and remediation
 *
 * @example
 * ```typescript
 * throw createAuthError(AuthErrorCode.INVALID_CREDENTIALS);
 * ```
 */
export function createAuthError(code: AuthErrorCode, customMessage?: string): Error & { code: AuthErrorCode } {
  const template = ERROR_MESSAGES[code];
  const error = new Error(customMessage || template.message) as Error & { code: AuthErrorCode };
  error.code = code;
  return error;
}

/**
 * Get error message template by code
 *
 * @param code - Error code
 * @returns Error message template with remediation steps
 *
 * @example
 * ```typescript
 * const template = getErrorMessage(AuthErrorCode.INVALID_PASSWORD);
 * console.log(template.message); // "Invalid password format"
 * console.log(template.remediation); // ["Password must be at least 8 characters", ...]
 * ```
 */
export function getErrorMessage(code: AuthErrorCode): AuthErrorMessage {
  return ERROR_MESSAGES[code];
}

/**
 * Check if an error is an auth error
 *
 * @param error - Error to check
 * @returns True if error is an auth error
 */
export function isAuthError(error: unknown): error is Error & { code: AuthErrorCode } {
  return error instanceof Error && "code" in error && typeof error.code === "string" && error.code.startsWith("AUTH_");
}
