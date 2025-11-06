# PHASE 3: Cross-Platform Implementation
## Complete Spec-Kit Workflow (Week 3-4)

---

## /speckit.constitution

You are implementing authentication across web and mobile platforms. Your work in Phase 3 connects the Phase 2 backend to consumer applications while maintaining type safety and consistency.

### Core Principles for Phase 3

**1. Platform Abstraction**
- Share authentication logic, not implementation
- Each platform uses native auth patterns
- Web: Browser storage, cookies, redirects
- Mobile: Secure storage, deep links, biometrics
- Common: State management via hooks and context

**2. Developer Experience Consistency**
- Same API across platforms where possible
- Different implementation where necessary
- Errors consistent and actionable
- Loading states predictable
- Optimistic updates everywhere

**3. Type-Safe Integration**
- Convex-generated types in components
- Form validation before submission
- Session state properly typed
- No type coercion needed
- Compilation guarantees correctness

**4. Real-Time Synchronization**
- Convex subscriptions drive UI updates
- Multi-device state consistency
- Offline queue for actions
- Conflict-free merging when reconnecting
- User sees single source of truth

**5. Security Without Friction**
- Invisible token refresh
- Automatic session recovery
- Secure credential storage
- Clear permission boundaries
- User trust maintained through transparency

---

## /speckit.specify

### Requirement 1: Next.js Web App Integration

**Route Structure**:
```
app/
├── (auth)/
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   ├── verify-email/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── callback/[provider]/page.tsx (OAuth)
├── (dashboard)/
│   ├── layout.tsx (auth gate)
│   ├── page.tsx (home)
│   ├── settings/page.tsx
│   └── organizations/page.tsx
└── layout.tsx (providers, auth wrapper)
```

**Key Components**:
- ConvexProvider: Real-time data sync
- ConvexBetterAuthProvider: Auth state
- useAuth hook: Current user, session
- Protected routes: Middleware redirection
- Loading states: Skeletons, spinners

**Authentication Flow**:
1. User submits form
2. Client-side validation with Zod
3. API route calls Convex function
4. Better Auth handles session
5. Redirect to dashboard or error

### Requirement 2: Expo Mobile App Integration

**Navigation Structure**:
```
app/
├── (auth)/
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── verify-email.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── (app)/
│   ├── home.tsx
│   ├── settings.tsx
│   └── organizations.tsx
└── _layout.tsx (root navigator)
```

**Mobile-Specific**:
- Deep link handling for email verification
- Secure token storage via expo-secure-store
- Biometric unlock (Face ID, Touch ID)
- Offline state management
- OTP auto-fill on iOS/Android

**Authentication Flow**:
1. Check if authenticated at app start
2. If not, show auth stack
3. On successful auth, navigate to app
4. Persist token securely
5. Sync state via Convex subscriptions

### Requirement 3: Shared State Management

**useAuth Hook**:
```typescript
{
  user: User | null
  session: Session | null
  isLoading: boolean
  error: Error | null
  signIn: (email, password) => Promise<void>
  signUp: (email, password, name) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}
```

**useSession Hook**:
```typescript
{
  session: Session | null
  refreshToken: () => Promise<void>
  revokeSession: (sessionId) => Promise<void>
  listSessions: () => Promise<Session[]>
  isValid: boolean
}
```

**useOrganization Hook**:
```typescript
{
  organization: Organization | null
  setOrganization: (orgId) => void
  organizations: Organization[]
  createOrganization: (name) => Promise<Organization>
}
```

---

## /speckit.plan

### Week 3: Days 1-2 - Next.js Integration

**Step 1: Set Up Next.js Auth Routes** (1.5 hours)
- [ ] Create (auth) route group
- [ ] Create sign-in page with form
- [ ] Create sign-up page with form
- [ ] Create verify-email page
- [ ] Add API routes for form submission

**Step 2: Create Auth Hooks** (2 hours)
- [ ] Implement useAuth hook
- [ ] Implement useSession hook
- [ ] Add real-time subscriptions
- [ ] Test hook in component

**Step 3: Build Protected Routes** (1.5 hours)
- [ ] Create middleware for auth
- [ ] Implement route protection
- [ ] Add automatic redirects
- [ ] Handle session refresh

### Week 4: Days 3-4 - Expo Mobile Integration

**Step 4: Set Up Expo Navigation** (1.5 hours)
- [ ] Configure Expo Router
- [ ] Create auth stack
- [ ] Create app stack
- [ ] Implement stack switching

**Step 5: Implement Mobile Auth** (2 hours)
- [ ] Create sign-in screen
- [ ] Create sign-up screen
- [ ] Add token storage
- [ ] Deep link handling

**Step 6: Test Cross-Platform** (1.5 hours)
- [ ] Test web authentication
- [ ] Test mobile authentication
- [ ] Verify state sync
- [ ] Test session persistence

---

## /speckit.tasks

### Task Group 1: Next.js Authentication (Est. 8 hours)

**Task 1.1: Create Auth Routes**
- [ ] Create app/(auth)/layout.tsx
- [ ] Create app/(auth)/sign-in/page.tsx with form
- [ ] Create app/(auth)/sign-up/page.tsx with form
- [ ] Create app/(auth)/verify-email/page.tsx
- [ ] Create app/(auth)/forgot-password/page.tsx
- [ ] Create app/(auth)/reset-password/page.tsx
- [ ] Create app/(auth)/callback/[provider]/page.tsx
- Time: 2 hours
- Validation: All routes render without errors

**Task 1.2: Implement API Routes**
- [ ] Create app/api/auth/sign-in.ts
- [ ] Create app/api/auth/sign-up.ts
- [ ] Create app/api/auth/verify-email.ts
- [ ] Create app/api/auth/reset-password.ts
- [ ] Create app/api/auth/sign-out.ts
- Time: 1.5 hours
- Validation: API routes callable and return correct responses

**Task 1.3: Create useAuth Hook**
- [ ] Update @auth/hooks/src/useAuth.ts with full implementation
- [ ] Add Convex subscription
- [ ] Add state management
- [ ] Add error handling
- [ ] Add loading states
- Time: 2 hours
- Validation: Hook works in web app

**Task 1.4: Create Protected Route Middleware**
- [ ] Create middleware.ts at root
- [ ] Implement auth checks
- [ ] Implement redirects
- [ ] Add session validation
- Time: 1.5 hours
- Validation: Unauthorized users redirected

**Task 1.5: Build Dashboard Layout**
- [ ] Create app/(dashboard)/layout.tsx
- [ ] Add auth gate component
- [ ] Create navigation bar
- [ ] Add user menu
- Time: 1 hour
- Validation: Dashboard renders with authenticated user

---

### Task Group 2: Expo Mobile Implementation (Est. 8 hours)

**Task 2.1: Set Up Expo Router**
- [ ] Configure app.json with Expo Router
- [ ] Create app/_layout.tsx with root stack
- [ ] Create app/(auth)/_layout.tsx for auth stack
- [ ] Create app/(app)/_layout.tsx for app stack
- Time: 1.5 hours
- Validation: Navigation stacks load correctly

**Task 2.2: Create Mobile Auth Screens**
- [ ] Create app/(auth)/sign-in.tsx
- [ ] Create app/(auth)/sign-up.tsx
- [ ] Create app/(auth)/verify-email.tsx
- [ ] Create app/(auth)/forgot-password.tsx
- [ ] Implement form components
- Time: 2.5 hours
- Validation: All screens render and accept input

**Task 2.3: Implement Mobile Token Storage**
- [ ] Install expo-secure-store
- [ ] Create secure storage utility
- [ ] Implement token persistence
- [ ] Implement token retrieval
- [ ] Add token refresh on app startup
- Time: 1.5 hours
- Validation: Tokens persist across app restarts

**Task 2.4: Add Deep Link Handling**
- [ ] Configure deep link scheme in app.json
- [ ] Implement universal links (iOS)
- [ ] Implement app links (Android)
- [ ] Handle email verification deep link
- [ ] Handle password reset deep link
- Time: 2 hours
- Validation: Deep links open app and navigate correctly

**Task 2.5: Implement Biometric Authentication**
- [ ] Install expo-local-authentication
- [ ] Create biometric gate component
- [ ] Add Face ID/Touch ID unlock
- [ ] Implement fallback to password
- [ ] Add biometric preference setting
- Time: 1 hour
- Validation: Biometric auth works on device

---

### Task Group 3: Shared State Management (Est. 5 hours)

**Task 3.1: Create Cross-Platform useAuth Hook**
- [ ] Update @auth/hooks/src/useAuth.ts
- [ ] Implement real-time subscription
- [ ] Add Convex query support
- [ ] Implement optimistic updates
- [ ] Add error recovery
- Time: 2 hours
- Validation: Hook works on both platforms

**Task 3.2: Implement useOrganization Hook**
- [ ] Create @auth/hooks/src/useOrganization.ts
- [ ] Add organization switching
- [ ] Add create organization
- [ ] Add list organizations
- Time: 1.5 hours
- Validation: Organization switching works

**Task 3.3: Create Auth Context Provider**
- [ ] Create AuthContext in @auth/hooks
- [ ] Create AuthProvider component
- [ ] Implement state persistence
- [ ] Add multi-device sync
- Time: 1.5 hours
- Validation: Provider wraps apps, state persists

---

### Task Group 4: Integration Testing (Est. 4 hours)

**Task 4.1: Test Web Authentication Flow**
- [ ] Test signup redirect to verify email
- [ ] Test email verification link
- [ ] Test signin with valid credentials
- [ ] Test signin with invalid credentials
- [ ] Test password reset flow
- Time: 1.5 hours

**Task 4.2: Test Mobile Authentication Flow**
- [ ] Test signup on mobile
- [ ] Test deep link email verification
- [ ] Test signin on mobile
- [ ] Test token persistence across restarts
- Time: 1.5 hours

**Task 4.3: Test Cross-Platform State Sync**
- [ ] Sign in on web
- [ ] Verify session appears on mobile
- [ ] Sign out on mobile
- [ ] Verify signed out on web
- Time: 1 hour

---

## /speckit.implement

```bash
# Web App
cd apps/web
# Create auth routes as specified
npm run dev

# Mobile App
cd apps/mobile
# Create auth screens as specified
npm start

# Shared Hooks
cd packages/@auth/hooks
pnpm build
pnpm dev
```

---

## /speckit.checklist

**Next.js Web**
- [ ] All auth routes created
- [ ] Authentication flows working
- [ ] Protected routes enforced
- [ ] Session persistence working
- [ ] OAuth callback working

**Expo Mobile**
- [ ] Navigation stacks configured
- [ ] Auth screens created
- [ ] Token storage working
- [ ] Deep links functional
- [ ] Biometric authentication optional

**Shared**
- [ ] useAuth hook works on both
- [ ] State sync real-time
- [ ] Optimistic updates working
- [ ] Error handling consistent
- [ ] Type safety maintained

**Cross-Platform Tests Pass**: ✓
