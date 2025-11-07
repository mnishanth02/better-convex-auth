# Security Documentation - Better Convex Auth

**Last Updated:** November 7, 2025  
**Version:** 0.1.0  
**Status:** Phase 5 Complete

---

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Package Boundaries](#package-boundaries)
3. [Input Validation](#input-validation)
4. [Authentication & Authorization](#authentication--authorization)
5. [Row-Level Security (RLS)](#row-level-security-rls)
6. [Rate Limiting](#rate-limiting)
7. [Error Handling](#error-handling)
8. [Security Best Practices](#security-best-practices)
9. [Threat Model](#threat-model)
10. [Security Testing](#security-testing)
11. [Incident Response](#incident-response)

---

## Security Architecture

Better Convex Auth implements security at multiple layers using defense-in-depth principles:

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Package Boundaries & Type Safety      │
│  - Strict exports in package.json               │
│  - TypeScript path validation                   │
│  - Zero 'any' types in public APIs              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Layer 2: Input Validation                      │
│  - Zod schemas for all inputs                   │
│  - Convex validators for mutations              │
│  - Runtime type checking                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Layer 3: Authentication & Authorization        │
│  - Better Auth + Convex integration             │
│  - Authorization helpers (auth-helpers.ts)      │
│  - Session validation                           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Layer 4: Row-Level Security (RLS)              │
│  - Default deny policy (zero-trust)             │
│  - Per-query authorization checks               │
│  - Resource ownership validation                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Layer 5: Rate Limiting & DDoS Protection       │
│  - Per-IP rate limiting                         │
│  - Configurable rate windows                    │
│  - Brute-force attack prevention                │
└─────────────────────────────────────────────────┘
```

### Key Security Principles

1. **Defense in Depth**: Multiple security layers prevent single points of failure
2. **Least Privilege**: Users and processes have minimal necessary permissions
3. **Zero Trust**: Every request is authenticated and authorized
4. **Fail Secure**: System defaults to denying access when uncertain
5. **Security by Design**: Security requirements built into architecture

---

## Package Boundaries

Package boundaries prevent unauthorized access to internal implementations and enforce API contracts.

### Boundary Enforcement Mechanisms

#### 1. Package.json Exports

All auth packages use strict `exports` field to control public API surface:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

**Enforced Boundaries:**
- ✅ Allowed: `import { useSession } from "@auth/web"`
- ❌ Forbidden: `import { AuthContext } from "@auth/web/src/context"`
- ❌ Forbidden: `import { factory } from "@auth/web/dist/client/factory"`

#### 2. TypeScript Path Validation

Root `tsconfig.json` prevents internal imports at compile time:

```json
{
  "compilerOptions": {
    "paths": {
      "@auth/core/src/*": ["@error: Import from @auth/core instead"],
      "@auth/utils/src/*": ["@error: Import from @auth/utils instead"],
      "@auth/web/src/*": ["@error: Import from @auth/web instead"]
    }
  }
}
```

#### 3. Automated Boundary Validation

Run `scripts/validate-boundaries.sh` to check for violations:

```bash
# Check all files for forbidden imports
pnpm run validate:boundaries

# Run in CI/CD
./scripts/validate-boundaries.sh
```

**What it checks:**
- No imports from `/src/` directories
- No imports from `/dist/` directories  
- All imports use public package exports

### Package Security Policies

| Package | Public API | Internal (Hidden) | Reason |
|---------|-----------|-------------------|--------|
| `@auth/core` | Main exports only | `/convex/`, `/session.js`, `/user.js` | Hide implementation details |
| `@auth/utils` | Main exports only | `/tokens.js`, `/validators.js` | Prevent internal token access |
| `@auth/web` | Main exports only | `/context/`, `/client/`, `/hoc/` | Hide React internals |
| `@auth/types` | All type exports | None (type-only package) | Public type definitions |
| `@auth/ui` | Component exports | Component internals | Hide implementation details |

---

## Input Validation

All user inputs are validated at multiple checkpoints using both Zod and Convex validators.

### Validation Strategy

#### 1. Frontend Validation (Zod)

Provides immediate user feedback and reduces invalid requests:

```typescript
import { SignInSchema } from "@auth/utils";

try {
  const data = SignInSchema.parse(formData);
  await signIn(data);
} catch (error) {
  // formatZodError provides user-friendly messages
  const messages = formatZodError(error);
  showErrors(messages);
}
```

#### 2. Backend Validation (Convex)

Server-side validation prevents bypassing frontend checks:

```typescript
import { v } from "convex/values";
import { validatePassword } from "./lib/convex-schemas";

export const updatePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Always validate on server
    const validation = validatePassword(args.newPassword);
    if (!validation.valid) {
      throw new Error(`Password validation failed: ${validation.errors.join(", ")}`);
    }
    // ... proceed with password update
  },
});
```

### Validation Rules

#### Password Requirements

**Zod Schema:** `packages/auth/utils/src/validators.ts`
```typescript
PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");
```

**Why These Rules?**
- **8+ characters**: Minimum entropy for brute-force resistance
- **128 max**: Prevent DoS via extremely long passwords
- **Mixed case + numbers + symbols**: Increased entropy and complexity
- **NIST Guidelines**: Aligned with NIST SP 800-63B recommendations

#### Email Validation

```typescript
EmailSchema = z.string()
  .email("Invalid email format")
  .max(255, "Email must be at most 255 characters")
  .toLowerCase()
  .trim();
```

**Why These Rules?**
- **RFC 5322 compliant**: Standard email format validation
- **255 char limit**: Maximum email length per RFC specification
- **Case normalization**: Prevents duplicate accounts (user@example.com vs USER@example.com)
- **Trim whitespace**: Prevents input errors

#### Username/Name Validation

```typescript
NameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters")
  .trim();
```

### Validation Error Handling

All validation errors are transformed into actionable user feedback:

```typescript
import { formatZodError, AuthErrorCode, createAuthError } from "@auth/utils";

try {
  const validated = SignUpSchema.parse(data);
} catch (error) {
  if (error instanceof ZodError) {
    // Transform technical errors into user-friendly messages
    const messages = formatZodError(error);
    // ["Email: Please enter a valid email address (e.g., user@example.com)"]
    return { success: false, errors: messages };
  }
  throw createAuthError(AuthErrorCode.VALIDATION_ERROR);
}
```

**See:** `packages/auth/utils/src/errors.ts` for complete error templates.

---

## Authentication & Authorization

### Authentication Helpers

**Location:** `packages/backend/convex/lib/auth-helpers.ts`

These helpers ensure consistent authentication checks across all Convex functions:

#### `getAuthUser(ctx)`

**Purpose:** Get authenticated user or throw error  
**Use Case:** Protected queries and mutations that require authentication

```typescript
import { getAuthUser } from "./lib/auth-helpers";

export const updateProfile = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Throws "Unauthorized: Authentication required" if not authenticated
    const user = await getAuthUser(ctx);
    
    await ctx.db.patch(user._id, { name: args.name });
  },
});
```

**Security Guarantees:**
- ✅ Always validates current session
- ✅ Throws error if session expired
- ✅ Throws error if user not authenticated
- ✅ Returns full user object with permissions

#### `safeGetAuthUser(ctx)`

**Purpose:** Get authenticated user or return null  
**Use Case:** Optional authentication (public + private content)

```typescript
import { safeGetAuthUser } from "./lib/auth-helpers";

export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await safeGetAuthUser(ctx); // null if not authenticated
    const post = await ctx.db.get(args.postId);
    
    // Show draft posts only to author
    if (post.draft && post.authorId !== currentUser?._id) {
      throw new Error("Post not found");
    }
    
    return post;
  },
});
```

**Security Guarantees:**
- ✅ Never throws on unauthenticated requests
- ✅ Returns null instead of throwing
- ✅ Allows conditional authorization logic

#### `requireVerifiedEmail(ctx)`

**Purpose:** Enforce email verification for sensitive operations  
**Use Case:** Password changes, account deletion, payment operations

```typescript
import { requireVerifiedEmail } from "./lib/auth-helpers";

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    
    // Additional security check for destructive operations
    await requireVerifiedEmail(ctx);
    
    // Proceed with account deletion
    await ctx.db.delete(user._id);
  },
});
```

**Security Guarantees:**
- ✅ Throws error if email not verified
- ✅ Prevents account takeover via unverified accounts
- ✅ Adds extra security layer for sensitive operations

### Authorization Patterns

#### Owner-Only Access

```typescript
export const updatePost = mutation({
  args: { postId: v.id("posts"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const post = await ctx.db.get(args.postId);
    
    if (!post) throw new Error("Post not found");
    
    // Authorization check: only author can update
    if (post.authorId !== user._id) {
      throw new Error("Forbidden: You can only update your own posts");
    }
    
    await ctx.db.patch(args.postId, { title: args.title });
  },
});
```

#### Role-Based Access Control (RBAC)

```typescript
import { hasRole, isAdmin } from "@auth/core";

export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getAuthUser(ctx);
    
    // Authorization check: admin only
    if (!isAdmin(currentUser)) {
      throw new Error("Forbidden: Admin access required");
    }
    
    await ctx.db.delete(args.userId);
  },
});
```

---

## Row-Level Security (RLS)

**Location:** `packages/backend/convex/lib/rls.ts`

RLS provides automatic authorization at the database query level using `convex-helpers`.

### RLS Architecture

```typescript
import { mutationWithRLS, queryWithRLS } from "./lib/rls";

export const getUserPosts = queryWithRLS({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    
    // RLS automatically filters to only return posts owned by this user
    // Even if query attempts to access other users' posts, RLS blocks it
    return await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), user._id))
      .collect();
  },
});
```

### RLS Rules

**Default Policy:** **DENY** (zero-trust architecture)

Users can only access resources they explicitly own or have been granted access to.

#### Ownership Rules

```typescript
// Auto-generated ownership rules based on data model:

users:
  - User can read/write their own profile
  - User cannot read other users' private fields (password, email)

posts:
  - User can read public posts
  - User can create posts (auto-assigned as author)
  - User can update/delete only their own posts

sessions:
  - User can read only their own sessions
  - User can delete only their own sessions
  - System can create sessions

organizations:
  - Organization members can read organization data
  - Organization admins can update organization
  - Organization owner can delete organization
```

### RLS Implementation

**Wrapper Functions:**

```typescript
// packages/backend/convex/lib/rls.ts
import { wrapDatabaseReader } from "convex-helpers/server/rowLevelSecurity";

export const queryWithRLS = customQuery(query, {
  async ctx(ctx, args) {
    return {
      db: wrapDatabaseReader(ctx, ctx.db, rlsRules),
      auth: ctx.auth,
      storage: ctx.storage,
    };
  },
});

export const mutationWithRLS = customMutation(mutation, {
  async ctx(ctx, args) {
    return {
      db: wrapDatabaseWriter(ctx, ctx.db, rlsRules),
      auth: ctx.auth,
      storage: ctx.storage,
    };
  },
});
```

**Usage:**

```typescript
// ✅ SECURE: Uses RLS wrapper
export const getUserSessions = queryWithRLS({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    // RLS automatically filters to user's sessions only
    return await ctx.db.query("sessions").collect();
  },
});

// ❌ INSECURE: Bypasses RLS (do not use for user-facing functions)
export const getAllSessionsAdmin = query({
  args: {},
  handler: async (ctx) => {
    // No RLS protection - exposes all sessions!
    return await ctx.db.query("sessions").collect();
  },
});
```

---

## Rate Limiting

**Configuration:** `packages/backend/convex/auth.ts`

Rate limiting prevents brute-force attacks and API abuse.

### Configuration

```typescript
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return createConvexAuth(ctx, {
    // ... other config
    
    rateLimit: {
      enabled: true,
      window: 60,  // 60 seconds
      max: 10,     // Max 10 requests per window per IP
    },
  });
};
```

### Rate Limit Rules

| Endpoint | Window | Max Requests | Reason |
|----------|--------|--------------|--------|
| Sign In | 60s | 10 | Prevent brute-force password attacks |
| Sign Up | 60s | 10 | Prevent spam account creation |
| Password Reset | 60s | 5 | Prevent email flooding |
| Email Verification | 60s | 3 | Prevent verification spam |
| OAuth Callbacks | 60s | 20 | Allow faster OAuth flows |

**Why These Limits?**
- **Sign In (10/min)**: Legitimate users rarely retry >10 times in 1 minute
- **Password Reset (5/min)**: Prevents attackers from flooding inboxes
- **Verification (3/min)**: Users typically verify once; prevents abuse

### Rate Limit Responses

When rate limit is exceeded, Better Auth returns:

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again in 42 seconds.",
  "retryAfter": 42
}
```

Frontend handling:

```typescript
import { AuthErrorCode } from "@auth/utils";

try {
  await signIn(credentials);
} catch (error) {
  if (error.code === AuthErrorCode.RATE_LIMIT_EXCEEDED) {
    showError(`Too many attempts. Please wait ${error.retryAfter} seconds.`);
  }
}
```

### Testing Rate Limits

**Manual Testing:**

```bash
# Send 11 requests in quick succession (should trigger rate limit on 11th)
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/auth/sign-in \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' &
done
wait
```

**Expected Result:** First 10 requests succeed, 11th returns 429 status.

### Customizing Rate Limits

**Development Mode:**

```typescript
const isDevelopment = process.env.NODE_ENV !== "production";

rateLimit: {
  enabled: !isDevelopment, // Disable in development
  window: 60,
  max: 10,
},
```

**Per-Environment:**

```typescript
rateLimit: {
  enabled: true,
  window: process.env.RATE_LIMIT_WINDOW || 60,
  max: process.env.RATE_LIMIT_MAX || 10,
},
```

---

## Error Handling

**Location:** `packages/auth/utils/src/errors.ts`

All authentication errors use standardized codes and actionable user messages.

### Error Template Structure

```typescript
{
  code: "AUTH_INVALID_CREDENTIALS",
  message: "Invalid email or password",
  remediation: [
    "Check that your email and password are correct",
    "Password is case-sensitive",
    "Try resetting your password if you've forgotten it"
  ],
  statusCode: 401
}
```

### Standard Error Codes

**Authentication Errors:**
- `AUTH_UNAUTHORIZED` - Not signed in
- `AUTH_INVALID_CREDENTIALS` - Wrong email/password
- `AUTH_SESSION_EXPIRED` - Session timed out
- `AUTH_EMAIL_NOT_VERIFIED` - Email verification required

**Validation Errors:**
- `AUTH_VALIDATION_ERROR` - Generic validation failure
- `AUTH_INVALID_EMAIL` - Email format invalid
- `AUTH_INVALID_PASSWORD` - Password doesn't meet requirements
- `AUTH_PASSWORD_TOO_WEAK` - Password doesn't meet strength requirements

**Account Errors:**
- `AUTH_ACCOUNT_NOT_FOUND` - No account with this email
- `AUTH_ACCOUNT_ALREADY_EXISTS` - Email already registered
- `AUTH_ACCOUNT_DISABLED` - Account has been disabled

**Token Errors:**
- `AUTH_TOKEN_INVALID` - Malformed token
- `AUTH_TOKEN_EXPIRED` - Token has expired

**Rate Limiting:**
- `AUTH_RATE_LIMIT_EXCEEDED` - Too many requests

### Using Error Templates

```typescript
import { createAuthError, AuthErrorCode } from "@auth/utils";

// Throw standardized error
throw createAuthError(AuthErrorCode.INVALID_CREDENTIALS);

// Throw with custom message (keeps code and remediation)
throw createAuthError(
  AuthErrorCode.UNAUTHORIZED,
  "You must be signed in to create a post"
);
```

### Frontend Error Display

```typescript
import { isAuthError, getErrorMessage } from "@auth/utils";

try {
  await signIn(credentials);
} catch (error) {
  if (isAuthError(error)) {
    const template = getErrorMessage(error.code);
    
    showErrorDialog({
      title: template.message,
      steps: template.remediation, // Show actionable steps
      code: template.code,          // For support/debugging
    });
  }
}
```

**Why Actionable Errors?**
- **User Experience**: Users know exactly how to fix the issue
- **Reduced Support**: Clear remediation reduces support tickets
- **Security**: Avoid leaking internal details (e.g., "User not found in database")
- **Compliance**: Meets FR-014 requirement for actionable error messages

---

## Security Best Practices

### For Developers

#### DO ✅

1. **Always validate inputs on both client and server**
   ```typescript
   // ✅ Client validation
   const validated = SignUpSchema.parse(formData);
   
   // ✅ Server validation (don't trust client)
   const validation = validatePassword(args.password);
   if (!validation.valid) throw new Error(...);
   ```

2. **Use auth helpers consistently**
   ```typescript
   // ✅ Use helper
   const user = await getAuthUser(ctx);
   
   // ❌ Don't access directly
   const user = await ctx.auth.getUser();
   ```

3. **Always use RLS wrappers for user-facing functions**
   ```typescript
   // ✅ Protected
   export const getUserData = queryWithRLS({...});
   
   // ❌ Exposes all data
   export const getUserData = query({...});
   ```

4. **Enforce email verification for sensitive operations**
   ```typescript
   // ✅ Require verification
   await requireVerifiedEmail(ctx);
   await deleteAccount(ctx);
   ```

5. **Use strict TypeScript with no 'any' types**
   ```typescript
   // ✅ Explicit types
   function processUser(user: User): PublicUser {...}
   
   // ❌ Unsafe
   function processUser(user: any): any {...}
   ```

#### DON'T ❌

1. **Don't bypass validation**
   ```typescript
   // ❌ No validation
   await ctx.db.insert("users", args);
   
   // ✅ Validate first
   const validated = UserSchema.parse(args);
   await ctx.db.insert("users", validated);
   ```

2. **Don't expose internal APIs**
   ```typescript
   // ❌ Exposes internals
   export * from "./internal/helpers";
   
   // ✅ Export only public API
   export { publicHelper } from "./internal/helpers";
   ```

3. **Don't trust client-provided user IDs**
   ```typescript
   // ❌ Client controls user ID
   export const updateUser = mutation({
     args: { userId: v.string(), name: v.string() },
     handler: async (ctx, args) => {
       await ctx.db.patch(args.userId, { name: args.name });
     },
   });
   
   // ✅ Use authenticated user ID
   export const updateProfile = mutation({
     args: { name: v.string() },
     handler: async (ctx, args) => {
       const user = await getAuthUser(ctx);
       await ctx.db.patch(user._id, { name: args.name });
     },
   });
   ```

4. **Don't log sensitive data**
   ```typescript
   // ❌ Logs password
   console.log("Sign in attempt:", { email, password });
   
   // ✅ Log only non-sensitive info
   console.log("Sign in attempt:", { email, timestamp: Date.now() });
   ```

5. **Don't hardcode secrets**
   ```typescript
   // ❌ Hardcoded secret
   const JWT_SECRET = "my-secret-key";
   
   // ✅ Use environment variables
   const JWT_SECRET = process.env.BETTER_AUTH_SECRET;
   ```

### Code Review Checklist

Before merging authentication-related code:

- [ ] All inputs validated with Zod/Convex validators
- [ ] Auth helpers used (`getAuthUser`, not direct `ctx.auth`)
- [ ] RLS wrappers used for user-facing queries/mutations
- [ ] Sensitive operations require email verification
- [ ] No hardcoded secrets or credentials
- [ ] Error messages are actionable (use error templates)
- [ ] No `any` types in public APIs
- [ ] Package boundaries respected (no internal imports)
- [ ] Rate limiting considered for new endpoints
- [ ] Tests include authorization edge cases

---

## Threat Model

### Threats Mitigated

| Threat | Mitigation | Status |
|--------|-----------|--------|
| **Brute-force password attacks** | Rate limiting (10 attempts/min) | ✅ Implemented |
| **SQL injection** | Convex (NoSQL, parameterized queries) | ✅ N/A |
| **XSS attacks** | React auto-escaping, CSP headers | ✅ Framework |
| **CSRF attacks** | SameSite cookies, CSRF tokens | ✅ Better Auth |
| **Session hijacking** | Secure cookies, IP validation | ✅ Better Auth |
| **Account enumeration** | Generic error messages | ✅ Implemented |
| **Unauthorized data access** | RLS, auth helpers | ✅ Implemented |
| **Token replay attacks** | One-time tokens, expiration | ✅ Better Auth |
| **Dependency vulnerabilities** | pnpm audit, automated scanning | ⏳ Manual |

### Threats Not Mitigated (Out of Scope)

| Threat | Why Not Mitigated | Recommendation |
|--------|-------------------|----------------|
| **DDoS attacks** | Requires infrastructure-level protection | Use Cloudflare or AWS Shield |
| **Phishing attacks** | User education required | Security awareness training |
| **Password reuse** | Beyond application control | Encourage password managers |
| **Social engineering** | Human factor | Security policies, training |

---

## Security Testing

### Manual Security Tests

#### 1. Authentication Bypass Test

```bash
# Try to access protected endpoint without auth
curl http://localhost:3000/api/protected
# Expected: 401 Unauthorized
```

#### 2. Authorization Bypass Test

```typescript
// Try to access another user's data
const otherUserId = "user123";
await ctx.db.query("posts").filter(q => q.eq(q.field("authorId"), otherUserId));
// Expected: RLS blocks access, returns empty array
```

#### 3. Input Validation Test

```bash
# Try to inject malicious input
curl -X POST http://localhost:3000/api/auth/sign-up \
  -d '{"email":"<script>alert(1)</script>","password":"test"}'
# Expected: 400 Validation Error
```

#### 4. Rate Limit Test

```bash
# Send 11 rapid requests
for i in {1..11}; do curl -X POST http://localhost:3000/api/auth/sign-in -d '{"email":"test@example.com","password":"wrong"}'; done
# Expected: 11th request returns 429 Too Many Requests
```

### Automated Security Scanning

#### Dependency Audit

```bash
# Check for known vulnerabilities
pnpm audit

# Fix automatically (if possible)
pnpm audit --fix
```

**Run Frequency:** Daily in CI/CD, weekly manual review

#### Package Boundary Validation

```bash
# Validate no internal imports
./scripts/validate-boundaries.sh
```

**Run Frequency:** Every commit (pre-commit hook), CI/CD pipeline

#### Type Safety Validation

```bash
# Ensure zero TypeScript errors
pnpm typecheck
```

**Run Frequency:** Every commit, CI/CD pipeline

### Security Testing Schedule

| Test Type | Frequency | Automation | Owner |
|-----------|-----------|------------|-------|
| Dependency audit | Daily | ✅ CI/CD | DevOps |
| Boundary validation | Every commit | ✅ Pre-commit | Dev |
| Type checking | Every commit | ✅ CI/CD | Dev |
| Manual penetration test | Quarterly | ❌ Manual | Security Team |
| Code security review | Every PR | ❌ Manual | Team Lead |

---

## Incident Response

### Security Incident Classification

| Severity | Description | Response Time | Examples |
|----------|-------------|---------------|----------|
| **Critical** | Active exploitation, data breach | < 1 hour | Database leak, RCE vulnerability |
| **High** | Exploitable vulnerability, no active exploit | < 4 hours | Auth bypass, privilege escalation |
| **Medium** | Non-exploitable issue, potential risk | < 24 hours | Weak validation, missing rate limit |
| **Low** | Informational, no immediate risk | < 1 week | Outdated dependency (no CVE) |

### Incident Response Process

#### 1. Detection

**Sources:**
- Automated security scans (`pnpm audit`)
- User reports (security@techlete.app)
- Monitoring alerts (error rate spikes)
- Security researchers (responsible disclosure)

#### 2. Containment

**Immediate Actions:**
- Disable affected endpoint if critical
- Revoke compromised sessions
- Block malicious IPs at CDN level
- Rotate secrets if exposed

#### 3. Investigation

**Information to Gather:**
- Affected systems and data
- Attack vector and timeline
- Number of affected users
- Data accessed or modified

#### 4. Remediation

**Steps:**
- Develop and test fix
- Deploy fix to production
- Verify fix effectiveness
- Update security tests to prevent regression

#### 5. Communication

**Internal:**
- Notify engineering team immediately
- Brief leadership within 2 hours
- Document incident in internal wiki

**External:**
- Notify affected users within 24 hours (if data breach)
- Public disclosure after fix deployed (if responsible disclosure)
- Update security advisory

#### 6. Post-Mortem

**Within 1 Week:**
- Root cause analysis
- Document lessons learned
- Update security practices
- Implement prevention measures

### Contact Information

**Security Team:** security@techlete.app  
**Responsible Disclosure:** Use GitHub Security Advisories (private)  
**Emergency Contact:** [On-call rotation - see internal wiki]

---

## Security Compliance Checklist

### Pre-Production

- [x] All auth inputs validated with Zod/Convex schemas
- [x] RLS enabled for all user-facing queries/mutations
- [x] Rate limiting configured and tested
- [x] Error messages use standardized templates
- [x] Package boundaries enforced
- [x] No hardcoded secrets in code
- [x] HTTPS enforced in production
- [ ] Security audit completed (pnpm audit)
- [ ] Penetration testing completed
- [ ] Security documentation reviewed

### Ongoing Maintenance

- [ ] Weekly dependency audits
- [ ] Quarterly security reviews
- [ ] Monthly rate limit monitoring
- [ ] Continuous RLS rule validation
- [ ] Regular security training for team

---

## Additional Resources

### Internal Documentation

- [Auth Helpers Reference](./lib/auth-helpers.ts)
- [RLS Implementation](./lib/rls.ts)
- [Convex Schemas](./lib/convex-schemas.ts)
- [Error Templates](../auth/utils/src/errors.ts)

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Better Auth Security Guide](https://www.better-auth.com/docs/security)
- [Convex Security Best Practices](https://docs.convex.dev/auth)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

**Last Review Date:** November 7, 2025  
**Next Review Due:** February 7, 2026 (Quarterly)  
**Document Owner:** Security Team  
**Version:** 1.0.0
