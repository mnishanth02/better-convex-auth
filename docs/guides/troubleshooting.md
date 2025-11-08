# Troubleshooting Guide

Common issues and solutions for Better Convex Auth.

## Table of Contents

- [Session Issues](#session-issues)
- [OAuth Problems](#oauth-problems)
- [Email Verification](#email-verification)
- [Build & Type Errors](#build--type-errors)
- [Performance Issues](#performance-issues)
- [General Debugging](#general-debugging)

---

## Session Issues

### Session Not Persisting After Refresh

**Symptoms**: User gets logged out on page refresh

**Causes**:
1. Missing `AuthClientProvider` wrapper
2. Cookie domain mismatch
3. Session expired

**Solutions**:

```tsx
// ✅ Correct: Wrap app with provider
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthClientProvider client={authClient}>
        {children}
      </AuthClientProvider>
    </ConvexProvider>
  );
}

// ❌ Wrong: Missing provider
export default function RootLayout({ children }) {
  return <html>{children}</html>;
}
```

**Check Cookie Settings**:
```typescript
// In auth.config.ts
export const auth = createConvexAuth(authComponent, {
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
});
```

### Session Shows Stale Data

**Symptoms**: User data doesn't update after profile changes

**Solution**: Manually refetch session

```tsx
function ProfileEditor() {
  const { refetch } = useSession();
  
  const handleUpdate = async (data) => {
    await updateProfile(data);
    await refetch(); // ✅ Refresh session
  };
}
```

### "Session expired" Error

**Symptoms**: Frequent session expiration warnings

**Solution**: Increase session duration

```typescript
// auth.config.ts
session: {
  expiresIn: 60 * 60 * 24 * 30,  // 30 days (from 7)
  updateAge: 60 * 60 * 24,       // 1 day
}
```

---

## OAuth Problems

### OAuth Redirect Not Working

**Symptoms**: After OAuth, redirect goes to 404 or wrong page

**Causes**:
1. Missing auth routes in HTTP router
2. Incorrect redirect URI in provider settings
3. CORS issues

**Solutions**:

**1. Verify HTTP Routes**:
```typescript
// convex/http.ts
http.route({
  path: "/api/auth",
  method: "GET",
  handler: auth.handler,
});

http.route({
  path: "/api/auth",
  method: "POST",
  handler: auth.handler,
});
```

**2. Check Provider Redirect URI**:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

**3. Enable CORS** (if needed):
```typescript
// auth.config.ts
export const auth = createConvexAuth(authComponent, {
  baseURL: process.env.SITE_URL!,
  trustedOrigins: [
    process.env.SITE_URL!,
    "http://localhost:3000",
  ],
});
```

### "Invalid OAuth State" Error

**Symptoms**: OAuth flow fails with state mismatch

**Solution**: Clear browser cookies and try again

```bash
# Development: Clear cookies for localhost:3000
# Production: Clear cookies for your domain
```

### Social Sign-In Button Does Nothing

**Symptoms**: Clicking social button has no effect

**Causes**:
1. Missing environment variables
2. Provider not configured

**Solutions**:

```bash
# .env.local
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

```typescript
// auth.config.ts
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
}
```

---

## Email Verification

### Verification Emails Not Sending

**Symptoms**: No verification email received

**Causes**:
1. Email service not configured
2. Rate limiting active
3. Email in spam folder

**Solutions**:

**1. Configure Email Provider** (e.g., Resend):
```bash
# .env.local
RESEND_API_KEY=your-resend-api-key
```

```typescript
// auth.config.ts
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    await resend.emails.send({
      from: "auth@yourdomain.com",
      to: user.email,
      subject: "Verify your email",
      html: `Click to verify: <a href="${url}">${url}</a>`,
    });
  },
  sendOnSignUp: true,
}
```

**2. Check Logs**:
```typescript
// Add logging
emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    console.log("Sending email to:", user.email);
    console.log("Verification URL:", url);
    // ... send email
  },
}
```

### Verification Link Expired

**Symptoms**: "Token expired" error when clicking verification link

**Solution**: Increase token expiration

```typescript
// auth.config.ts
emailVerification: {
  expiresIn: 86400 * 3, // 3 days (from 24 hours)
}
```

### Can't Sign In Without Verification

**Symptoms**: "Email not verified" error on sign-in

**Solution**: Disable verification requirement (dev only)

```typescript
// auth.config.ts - DEVELOPMENT ONLY
emailPassword: {
  enabled: true,
  requireEmailVerification: false, // ⚠️ Only for development
}
```

---

## Build & Type Errors

### "Cannot find module '@auth/core'" Error

**Symptoms**: Import errors during build

**Solution**: Rebuild workspace dependencies

```bash
pnpm install
pnpm build
```

### TypeScript Errors in Auth Hooks

**Symptoms**: Type errors when using `useSession` or `useAuth`

**Solution**: Ensure proper types are imported

```tsx
import type { Session, User } from "@auth/types";
import { useSession } from "@auth/web";

function Component() {
  const { data: session } = useSession();
  
  // ✅ Type-safe access
  if (session?.user) {
    const user: User = session.user;
  }
}
```

### "Module not found" in Monorepo

**Symptoms**: Packages can't find each other

**Solution**: Check workspace configuration

```json
// pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/**"
```

```json
// package.json
{
  "dependencies": {
    "@auth/core": "workspace:*",
    "@auth/web": "workspace:*"
  }
}
```

---

## Performance Issues

### Slow Build Times

**Symptoms**: Build takes >5 minutes

**Solutions**:

```bash
# Use Turborepo cache
pnpm build

# Rebuild specific package
pnpm --filter @auth/core build

# Clear cache and rebuild
rm -rf .turbo node_modules/.cache
pnpm build
```

### High Memory Usage

**Symptoms**: Dev server crashes with "JavaScript heap out of memory"

**Solution**: Increase Node.js memory

```bash
# In package.json scripts
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```

### Slow Authentication Responses

**Symptoms**: Sign-in/sign-up takes >2 seconds

**Causes**:
1. Database indexes missing
2. Rate limiting too aggressive
3. Network latency

**Solutions**:

```typescript
// Ensure indexes in schema
export default defineSchema({
  users: defineTable({
    email: v.string(),
    // ...
  })
    .index("by_email", ["email"]), // ✅ Index for fast lookups
  
  sessions: defineTable({
    token: v.string(),
    // ...
  })
    .index("by_token", ["token"]) // ✅ Index for session queries
});
```

---

## General Debugging

### Enable Debug Logging

```typescript
// auth.config.ts
export const auth = createConvexAuth(authComponent, {
  // ... config
  isDevelopment: true, // Enables verbose logging
});
```

### Check Convex Dashboard

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. View logs for errors
4. Check database tables for data

### Inspect Network Requests

1. Open browser DevTools → Network tab
2. Filter by "auth"
3. Check request/response payloads
4. Look for 4xx/5xx errors

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401  | Unauthorized | Session expired, re-authenticate |
| 403  | Forbidden | User lacks permissions |
| 429  | Rate Limited | Wait before retrying |
| 500  | Server Error | Check Convex logs |

### Clear All State (Nuclear Option)

```bash
# Clear browser data
# DevTools → Application → Clear storage

# Clear Convex dev deployment
pnpm convex deploy --reset

# Clear local cache
rm -rf .turbo .next node_modules/.cache
pnpm install
pnpm dev
```

---

## Still Having Issues?

1. **Check the logs**: Convex Dashboard → Logs
2. **Review the docs**: Check [Migration Guide](./migration-from-better-auth.md) and [Recipes](./recipes.md)
3. **Search GitHub Issues**: Someone may have had the same problem
4. **Open a new issue**: Provide error messages, code snippets, and steps to reproduce

## Useful Commands

```bash
# Check package versions
pnpm list @auth/core @auth/web @convex-dev/better-auth

# Verify TypeScript config
pnpm typecheck

# Run linter
pnpm check

# Test authentication flow
pnpm test:e2e

# View Convex logs
pnpm convex logs
```
