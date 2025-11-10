# Troubleshooting Guide

Comprehensive troubleshooting guide for Better Convex Auth. This guide covers common issues, debugging techniques, and solutions.

## Table of Contents

- [Getting Help](#getting-help)
- [Common Issues](#common-issues)
  - [Authentication Issues](#authentication-issues)
  - [Build & Deployment Issues](#build--deployment-issues)
  - [Convex Issues](#convex-issues)
  - [Environment Issues](#environment-issues)
  - [Accessibility Issues](#accessibility-issues)
- [Debugging Tools](#debugging-tools)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [Reporting Issues](#reporting-issues)

## Getting Help

### Before You Start

1. **Check the FAQ** - Common questions are answered below
2. **Review Documentation** - Ensure you've followed setup steps correctly
3. **Check Console Errors** - Browser console often provides helpful error messages
4. **Test in Isolation** - Try to reproduce the issue in a minimal setup

### Support Channels

- 📚 **Documentation**: [API Reference](./API_REFERENCE.md)
- 🐛 **GitHub Issues**: [Report bugs](https://github.com/your-org/better-convex-auth/issues)
- 💬 **Discord**: [Community support](https://discord.gg/your-server)
- 📧 **Email**: support@your-domain.com

## Common Issues

### Authentication Issues

#### Issue: "Authentication failed" or sign-in not working

**Symptoms:**
- Sign-in button doesn't work
- OAuth redirects fail
- Credentials are rejected

**Solutions:**

1. **Check Environment Variables**
   ```bash
   # Verify all required variables are set
   echo $BETTER_AUTH_SECRET
   echo $BETTER_AUTH_URL
   echo $NEXT_PUBLIC_CONVEX_URL
   ```

2. **Verify OAuth Configuration**
   ```typescript
   // Check OAuth provider settings in convex/auth.ts
   socialProviders: {
     google: {
       clientId: process.env.GOOGLE_CLIENT_ID!,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
     }
   }
   ```

3. **Check Redirect URIs**
   - Google Console: `http://localhost:3000/api/auth/callback/google`
   - GitHub Settings: `http://localhost:3000/api/auth/callback/github`

4. **Debug Mode**
   ```bash
   DEBUG=better-auth:* pnpm dev
   ```

#### Issue: "Session not found" or user data missing

**Symptoms:**
- `useAuth()` returns null user
- Session expires immediately
- User data not persisting

**Solutions:**

1. **Check Session Configuration**
   ```typescript
   // Ensure session is properly configured
   export const { auth, signIn, signOut, useAuth } = createAuth({
     baseURL: "/api/auth",
     // Add session configuration if needed
   });
   ```

2. **Verify AuthProvider Setup**
   ```typescript
   // Make sure AuthProvider wraps your app
   export default function RootLayout({ children }) {
     return (
       <ConvexProvider client={convex}>
         <AuthProvider>
           {children}
         </AuthProvider>
       </ConvexProvider>
     );
   }
   ```

3. **Check Convex Connection**
   ```bash
   # Test Convex connection
   npx convex dev --once
   ```

#### Issue: OAuth providers not working

**Symptoms:**
- OAuth popup closes immediately
- "Application not approved" error
- Redirect URI mismatch

**Solutions:**

1. **Google OAuth Issues**
   ```typescript
   // Check Google Console settings
   Authorized JavaScript origins: http://localhost:3000
   Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
   ```

2. **GitHub OAuth Issues**
   ```typescript
   // GitHub App settings
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

3. **Environment Variables**
   ```bash
   # Ensure variables are correctly set
   GOOGLE_CLIENT_ID="your-actual-client-id"
   GOOGLE_CLIENT_SECRET="your-actual-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-secret"
   ```

### Build & Deployment Issues

#### Issue: Build fails with TypeScript errors

**Symptoms:**
- `pnpm build` fails
- Type errors in production
- Missing type definitions

**Solutions:**

1. **Update TypeScript Configuration**
   ```json
   // tsconfig.json
   {
     "extends": "@workspace/typescript-config/nextjs.json",
     "compilerOptions": {
       "strict": true,
       "skipLibCheck": true
     }
   }
   ```

2. **Install Missing Types**
   ```bash
   pnpm add -D @types/node @types/react @types/react-dom
   ```

3. **Clear Cache and Rebuild**
   ```bash
   rm -rf .next node_modules/.cache
   pnpm install
   pnpm build
   ```

#### Issue: "Module not found" errors

**Symptoms:**
- Import errors during build
- Cannot resolve package paths
- Missing dependencies

**Solutions:**

1. **Check Package Installation**
   ```bash
   pnpm ls @workspace/z-auth
   ```

2. **Verify Import Paths**
   ```typescript
   // Correct imports
   import { createAuth } from "@workspace/z-auth/nextjs";
   import { AccessibleButton } from "@workspace/z-auth/components";
   ```

3. **Clear Package Cache**
   ```bash
   pnpm store prune
   pnpm install --frozen-lockfile
   ```

### Convex Issues

#### Issue: Convex deployment fails

**Symptoms:**
- `npx convex deploy` fails
- Database schema errors
- Function deployment errors

**Solutions:**

1. **Check Convex Configuration**
   ```typescript
   // convex.config.ts
   import { defineConfig } from "convex/server";

   export default defineConfig({
     schemaValidation: true,
   });
   ```

2. **Verify Schema Syntax**
   ```typescript
   // convex/schema.ts
   import { defineSchema, defineTable } from "convex/server";
   import { v } from "convex/values";

   export default defineSchema({
     users: defineTable({
       email: v.string(),
       emailVerified: v.boolean(),
       name: v.optional(v.string()),
     }).index("by_email", ["email"]),
   });
   ```

3. **Reset Convex Deployment**
   ```bash
   npx convex dev --reset
   ```

#### Issue: Convex functions not working

**Symptoms:**
- HTTP routes return 404
- Auth endpoints not responding
- Database queries fail

**Solutions:**

1. **Check HTTP Routes**
   ```typescript
   // convex/http.ts
   import { httpRouter } from "convex/server";
   import { httpAction } from "./_generated/server";
   import { createAuth } from "./auth";

   const http = httpRouter();
   
   http.route({
     pathPrefix: "/auth/",
     handler: httpAction(async (ctx, req) => {
       return await createAuth(ctx).handler(req);
     }),
   });

   export default http;
   ```

2. **Verify Function Exports**
   ```typescript
   // Check that all functions are properly exported
   export const myFunction = query({
     args: {},
     handler: async (ctx) => {
       // function logic
     },
   });
   ```

### Environment Issues

#### Issue: Environment variables not loading

**Symptoms:**
- `process.env.VARIABLE` is undefined
- OAuth providers not configured
- Convex URL missing

**Solutions:**

1. **Check File Location**
   ```bash
   # Ensure .env.local is in project root
   ls -la .env.local
   ```

2. **Verify Variable Names**
   ```bash
   # Must start with NEXT_PUBLIC_ for client-side
   NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud
   
   # Server-side variables don't need prefix
   BETTER_AUTH_SECRET=your-secret
   ```

3. **Restart Development Server**
   ```bash
   # Stop and restart dev server
   pnpm dev
   ```

#### Issue: CORS errors in browser

**Symptoms:**
- Cross-origin request blocked
- API calls fail from browser
- Network errors in console

**Solutions:**

1. **Check Convex URL Configuration**
   ```typescript
   // Ensure Convex URL is correct
   const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
   ```

2. **Verify Environment Variables**
   ```bash
   # Check that CORS origin matches
   echo $BETTER_AUTH_URL
   echo $NEXT_PUBLIC_SITE_URL
   ```

### Accessibility Issues

#### Issue: Screen readers not working properly

**Symptoms:**
- ARIA attributes not announced
- Focus management broken
- Keyboard navigation failing

**Solutions:**

1. **Test with Screen Reader**
   ```bash
   # Enable VoiceOver on macOS
   sudo spctl --master-enable
   ```

2. **Check ARIA Implementation**
   ```typescript
   // Ensure proper ARIA attributes
   <AccessibleInput
     name="email"
     label="Email Address"
     aria-describedby="email-help"
     aria-required="true"
   />
   ```

3. **Verify Focus Management**
   ```typescript
   // Check focus trap is working
   const { trapFocus } = useFocusManagement();
   useEffect(() => {
     if (modalOpen) {
       const cleanup = trapFocus(modalRef.current);
       return cleanup;
     }
   }, [modalOpen]);
   ```

## Debugging Tools

### Browser DevTools

1. **Console Debugging**
   ```javascript
   // Add debug logging
   console.log("Auth state:", useAuth());
   console.log("Session:", useSession());
   ```

2. **Network Tab**
   - Check API requests to `/api/auth/*`
   - Verify response status codes
   - Check request/response headers

3. **Application Tab**
   - Check localStorage/sessionStorage
   - Verify cookies are set
   - Check service worker status

### React DevTools

1. **Install Extension**
   - Chrome: React Developer Tools
   - Firefox: React Developer Tools

2. **Debug Context**
   ```jsx
   // Check AuthProvider context
   <AuthProvider.Consumer>
     {value => console.log("Auth context:", value)}
   </AuthProvider.Consumer>
   ```

### Convex Dashboard

1. **Access Dashboard**
   ```bash
   # Open Convex dashboard
   npx convex dashboard
   ```

2. **Check Function Logs**
   - View real-time function execution
   - Check error messages
   - Monitor database queries

3. **Database Inspector**
   - Check user records
   - Verify session data
   - Monitor data changes

### Debug Mode

1. **Enable Auth Debug Logging**
   ```bash
   DEBUG=better-auth:* pnpm dev
   ```

2. **Convex Debug Mode**
   ```bash
   npx convex dev --debug
   ```

3. **Next.js Debug Mode**
   ```bash
   NODE_OPTIONS='--inspect' pnpm dev
   ```

## Performance Issues

### Slow Authentication

**Symptoms:**
- Sign-in takes too long
- API responses are slow
- Page loads slowly after authentication

**Solutions:**

1. **Check Convex Region**
   ```typescript
   // Use closest region to your users
   const convex = new ConvexReactClient(
     process.env.NEXT_PUBLIC_CONVEX_URL!,
     { region: "us-west-2" }
   );
   ```

2. **Optimize Database Queries**
   ```typescript
   // Add database indexes
   export default defineSchema({
     users: defineTable({
       email: v.string(),
     }).index("by_email", ["email"]), // Add this index
   });
   ```

3. **Enable React Concurrent Features**
   ```typescript
   // Use React 18+ concurrent features
   import { Suspense } from "react";
   
   <Suspense fallback={<Loading />}>
     <AuthenticatedApp />
   </Suspense>
   ```

### Large Bundle Size

**Solutions:**

1. **Code Splitting**
   ```typescript
   // Lazy load auth components
   const AuthForm = lazy(() => import("@/components/auth-form"));
   ```

2. **Tree Shaking**
   ```typescript
   // Import specific functions only
   import { signIn } from "@workspace/z-auth/nextjs";
   // Instead of
   import * from "@workspace/z-auth";
   ```

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Common Browser Issues

1. **Safari Private Mode**
   - localStorage may not work
   - Cookies might be blocked

2. **Firefox Strict Privacy**
   - Third-party cookies blocked
   - May affect OAuth flows

3. **Chrome Extensions**
   - Ad blockers might interfere
   - Privacy extensions may block cookies

## Reporting Issues

### Information to Include

1. **Environment Details**
   ```bash
   node --version
   pnpm --version
   npx next --version
   ```

2. **Package Versions**
   ```bash
   pnpm ls @workspace/z-auth
   pnpm ls convex
   pnpm ls next
   ```

3. **Error Messages**
   - Full error stack trace
   - Browser console errors
   - Network request details

4. **Reproduction Steps**
   - Minimal code example
   - Steps to reproduce
   - Expected vs actual behavior

### Issue Template

```markdown
## Bug Report

### Environment
- OS: [macOS/Windows/Linux]
- Node.js: [version]
- Browser: [Chrome/Firefox/Safari + version]
- Package versions:
  - @workspace/z-auth: [version]
  - convex: [version]
  - next: [version]

### Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Error Messages
```
[Error stack trace or console output]
```

### Additional Context
[Any other relevant information]
```

## Quick Fixes Checklist

When something isn't working, try these quick fixes:

- [ ] Restart development server (`pnpm dev`)
- [ ] Clear Next.js cache (`rm -rf .next`)
- [ ] Clear node_modules (`rm -rf node_modules && pnpm install`)
- [ ] Check environment variables are set
- [ ] Verify Convex deployment is running
- [ ] Check browser console for errors
- [ ] Test in incognito/private mode
- [ ] Try a different browser
- [ ] Check internet connection
- [ ] Verify API endpoints are accessible

## Getting Additional Help

If this guide doesn't solve your issue:

1. **Search existing issues** on GitHub
2. **Check the documentation** for recent updates
3. **Ask on Discord** with specific details
4. **Create a new issue** with full reproduction steps

Remember to include:
- Your exact setup and configuration
- Error messages and stack traces  
- Steps to reproduce the issue
- What you've already tried