# Zod Validation Schema Contracts

**Version**: 1.0.0  
**Last Updated**: 2025-11-06

This document defines the Zod validation schemas that enforce TypeScript contracts at runtime.

## Package: `@repo/auth-utils/schemas`

### Common Schemas

```typescript
import { z } from "zod";

/**
 * Email validation schema
 * - RFC 5322 compliant
 * - Max 255 characters
 * - Custom error messages
 */
export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email("Please enter a valid email address")
  .min(1, "Email cannot be empty")
  .max(255, "Email is too long");

/**
 * Password validation schema
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - Must contain uppercase, lowercase, and number
 */
export const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid("Invalid ID format");

/**
 * Timestamp validation schema (milliseconds since epoch)
 */
export const timestampSchema = z.number().int().positive();

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL format");
```

### User Schemas

```typescript
/**
 * User entity validation schema
 * 
 * @example
 * ```typescript
 * const user = UserSchema.parse(apiResponse);
 * // Type-safe user with validation guaranteed
 * ```
 */
export const UserSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  name: z.string().max(100).nullable(),
  emailVerified: z.boolean(),
  image: urlSchema.nullable().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

/**
 * Inferred TypeScript type from UserSchema
 */
export type User = z.infer<typeof UserSchema>;

/**
 * User profile validation schema (extends User)
 */
export const UserProfileSchema = UserSchema.extend({
  bio: z.string().max(500, "Bio is too long (max 500 characters)").optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (use E.164)")
    .optional(),
});

/**
 * Inferred TypeScript type from UserProfileSchema
 */
export type UserProfile = z.infer<typeof UserProfileSchema>;
```

### Session Schemas

```typescript
/**
 * Session validation schema
 * 
 * @example
 * ```typescript
 * const session = SessionSchema.safeParse(data);
 * if (!session.success) {
 *   throw new AuthError("Invalid session", AuthErrorCode.VALIDATION_ERROR, session.error);
 * }
 * ```
 */
export const SessionSchema = z.object({
  id: z.string().min(32, "Session ID is too short"),
  userId: uuidSchema,
  token: z.string().min(32, "Session token is too short"),
  expiresAt: timestampSchema,
  ipAddress: z.string().ip("Invalid IP address format").optional(),
  userAgent: z.string().max(500).optional(),
});

/**
 * Inferred TypeScript type from SessionSchema
 */
export type Session = z.infer<typeof SessionSchema>;

/**
 * Session context validation schema
 */
export const SessionContextSchema = z.object({
  user: UserSchema,
  session: SessionSchema,
  isAuthenticated: z.boolean(),
});

/**
 * Inferred TypeScript type from SessionContextSchema
 */
export type SessionContext = z.infer<typeof SessionContextSchema>;
```

### Authentication Input Schemas

```typescript
/**
 * Sign up input validation schema
 * 
 * @example
 * ```typescript
 * // In form submission handler
 * const result = SignUpSchema.safeParse(formData);
 * if (!result.success) {
 *   const errors = formatZodError(result.error);
 *   setFieldErrors(errors);
 *   return;
 * }
 * await authClient.signUp(result.data);
 * ```
 */
export const SignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name cannot be empty").max(100, "Name is too long").optional(),
});

/**
 * Inferred TypeScript type from SignUpSchema
 */
export type SignUpInput = z.infer<typeof SignUpSchema>;

/**
 * Sign in input validation schema
 */
export const SignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Inferred TypeScript type from SignInSchema
 */
export type SignInInput = z.infer<typeof SignInSchema>;

/**
 * Password reset request validation schema
 */
export const PasswordResetSchema = z.object({
  email: emailSchema,
});

/**
 * Inferred TypeScript type from PasswordResetSchema
 */
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

/**
 * Password change validation schema with confirmation
 * 
 * @example
 * ```typescript
 * const PasswordChangeSchema = z.object({
 *   currentPassword: z.string().min(1),
 *   newPassword: passwordSchema,
 *   confirmPassword: z.string(),
 * }).superRefine(({ newPassword, confirmPassword }, ctx) => {
 *   if (confirmPassword !== newPassword) {
 *     ctx.addIssue({
 *       code: "custom",
 *       message: "Passwords do not match",
 *       path: ["confirmPassword"],
 *     });
 *   }
 * });
 * ```
 */
export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

/**
 * Inferred TypeScript type from PasswordChangeSchema
 */
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
```

### Configuration Schemas

```typescript
/**
 * Authentication configuration validation schema
 */
export const AuthConfigSchema = z.object({
  baseURL: urlSchema,
  sessionDuration: z
    .number()
    .int()
    .positive()
    .default(7 * 24 * 60 * 60 * 1000), // 7 days in ms
  enablePasswordReset: z.boolean().default(true),
  enableEmailVerification: z.boolean().default(false),
});

/**
 * Inferred TypeScript type from AuthConfigSchema
 */
export type AuthConfig = z.infer<typeof AuthConfigSchema>;
```

### Account Schemas (OAuth)

```typescript
/**
 * OAuth account validation schema
 */
export const AccountSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  provider: z.enum(["github", "google", "apple", "discord"]),
  providerAccountId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  tokenExpiresAt: timestampSchema.nullable(),
  scope: z.string().nullable(),
  createdAt: timestampSchema,
});

/**
 * Inferred TypeScript type from AccountSchema
 */
export type Account = z.infer<typeof AccountSchema>;
```

### Verification Token Schemas

```typescript
/**
 * Verification token validation schema
 */
export const VerificationTokenSchema = z.object({
  identifier: z
    .string()
    .email()
    .or(z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")),
  token: z.string().min(32),
  expiresAt: timestampSchema,
  type: z.enum(["email_verification", "password_reset"]),
  createdAt: timestampSchema,
});

/**
 * Inferred TypeScript type from VerificationTokenSchema
 */
export type VerificationToken = z.infer<typeof VerificationTokenSchema>;
```

---

## Validation Utility Functions

```typescript
/**
 * Format Zod validation errors into field-level error object
 * 
 * @param error - Zod validation error
 * @returns Object with field names as keys and error messages as values
 * 
 * @example
 * ```typescript
 * const result = SignUpSchema.safeParse(formData);
 * if (!result.success) {
 *   const fieldErrors = formatZodError(result.error);
 *   // { email: "Invalid email", password: "Password too short" }
 *   setErrors(fieldErrors);
 * }
 * ```
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });
  
  return formatted;
}

/**
 * Get first validation error message
 * 
 * @param error - Zod validation error
 * @returns First error message
 * 
 * @example
 * ```typescript
 * const result = SignInSchema.safeParse(data);
 * if (!result.success) {
 *   toast.error(getFirstError(result.error));
 * }
 * ```
 */
export function getFirstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Validation failed";
}

/**
 * Validate and parse data with schema
 * 
 * @param schema - Zod schema to use
 * @param data - Data to validate
 * @returns Validated data
 * @throws AuthError with formatted validation errors
 * 
 * @example
 * ```typescript
 * const user = validateAndParse(UserSchema, apiResponse);
 * // Throws AuthError if invalid, returns typed User if valid
 * ```
 */
export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new AuthError(
      "Validation failed",
      AuthErrorCode.VALIDATION_ERROR,
      formatZodError(result.error)
    );
  }
  
  return result.data;
}
```

---

## Custom Error Map (Optional)

```typescript
/**
 * Custom Zod error map for user-friendly messages
 * 
 * @example
 * ```typescript
 * // Set globally
 * z.setErrorMap(customAuthErrorMap);
 * 
 * // Or use per-schema
 * const schema = z.string().email({ message: "Custom error" });
 * ```
 */
export const customAuthErrorMap: z.ZodErrorMap = (issue, ctx) => {
  // String type errors
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === "string") {
      return { message: "This field must be text" };
    }
  }
  
  // Too short errors
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.minimum === 8 && issue.type === "string") {
      return {
        message: "Password is too short. Use at least 8 characters.",
      };
    }
  }
  
  // Email errors
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return {
        message:
          "Please check your email address - it doesn't look quite right",
      };
    }
  }
  
  // Default to standard error
  return { message: ctx.defaultError };
};
```

---

## Validation at Package Boundaries

### Example: AuthClient Sign In

```typescript
// packages/auth-core/src/client.ts
import { SignInSchema, SessionSchema, type SignInInput, type Session } from "@repo/auth-utils/schemas";

export class AuthClient {
  async signIn(input: SignInInput): Promise<Session> {
    // 1. Validate input at boundary
    const validatedInput = validateAndParse(SignInSchema, input);
    
    // 2. Make API request
    const response = await fetch(`${this.baseURL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedInput),
    });
    
    if (!response.ok) {
      throw new AuthError(
        "Sign in failed",
        AuthErrorCode.INVALID_CREDENTIALS
      );
    }
    
    const data = await response.json();
    
    // 3. Validate response at boundary
    const session = validateAndParse(SessionSchema, data);
    
    return session;
  }
}
```

### Example: React Hook Form Validation

```typescript
// packages/auth-web/src/hooks/use-sign-in.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInSchema, type SignInInput } from "@repo/auth-utils/schemas";

export function useSignInForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema), // Automatic validation
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  return form;
}
```

### Example: Convex Mutation Validation

```typescript
// packages/backend/convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PasswordChangeSchema } from "@repo/auth-utils/schemas";

export const changePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
    confirmPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate with Zod for business logic (Convex validates types)
    const result = PasswordChangeSchema.safeParse(args);
    
    if (!result.success) {
      const firstError = getFirstError(result.error);
      throw new Error(firstError);
    }
    
    // Proceed with validated data
    const { auth } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.changePassword({
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
    });
  },
});
```

---

## Schema Testing

All schemas MUST have corresponding tests:

```typescript
// packages/auth-utils/__tests__/schemas.test.ts
import { describe, it, expect } from "vitest";
import { SignUpSchema, UserSchema } from "../src/schemas";

describe("SignUpSchema", () => {
  it("validates correct signup data", () => {
    const validData = {
      email: "user@example.com",
      password: "SecurePass123",
      name: "John Doe",
    };
    
    const result = SignUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const invalidData = {
      email: "not-an-email",
      password: "SecurePass123",
    };
    
    const result = SignUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].path).toEqual(["email"]);
      expect(result.error.errors[0].message).toContain("valid email");
    }
  });
});
```

---

## Contract Guarantees

1. **Type Inference**: All TypeScript types are inferred from Zod schemas (single source of truth)
2. **Runtime Safety**: All external inputs validated before processing
3. **Error Messages**: All validation errors include actionable messages
4. **Consistency**: Same validation logic on web, mobile, and backend
5. **Performance**: Schemas cached and reused (not recreated per validation)

## Version Compatibility

- **Zod**: `^3.23.0`
- **TypeScript**: `^5.9.0`
- All schemas compatible with React Hook Form, Formik, and native HTML forms
