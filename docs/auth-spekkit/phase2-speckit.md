# PHASE 2: Better Auth & Convex Integration
## Complete Spec-Kit Workflow (Week 2-3)

---

## /speckit.constitution

You are implementing core authentication functionality by integrating Better Auth with Convex backend. Your work in Phase 2 transforms the Phase 1 foundation into a functioning authentication system.

### Core Principles for Phase 2

**1. Security-First Integration**
- Every Convex function must validate authentication before processing
- Better Auth configuration should enforce secure defaults
- Database schema must support audit logging of security events
- Token management should be centralized and immutable
- Apply defense in depth: multiple validation layers

**2. Backend-Frontend Separation**
- All security logic resides in Convex (backend)
- Better Auth SDK handles client-side state
- No sensitive data (tokens, secrets) exposed to client unnecessarily
- API contracts are strictly typed with shared @auth/types
- Client trusts but always verifies on backend

**3. Convex as Source of Truth**
- Database schema is the contract between frontend and backend
- Queries define what data frontend can access
- Mutations enforce business logic and validation
- Actions handle external integrations (email, SMS)
- HTTP routes proxy Better Auth handler

**4. Type-Safety Through Boundaries**
- Convex-generated types must be imported and used in frontend
- Better Auth config types match Convex expectations
- Session validation types consistent across layers
- Compilation fails if types don't align (schema changes)
- Database queries must specify return types

**5. Real-Time Data Sync**
- Convex subscriptions keep frontend in sync with backend
- Authentication state changes propagate immediately
- Multi-device logout works in real-time
- Session invalidation is instant across all devices
- Use optimistic updates for perceived instant responsiveness

---

## /speckit.specify

### Requirement 1: Convex Database Schema

**Users Table**:
```
- id: string (primary key, from Better Auth)
- email: string (indexed, unique)
- emailVerified: boolean (default: false)
- name: string | null
- image: string | null
- password: string | null (only if email/password auth used)
- createdAt: number (milliseconds)
- updatedAt: number (milliseconds)
- deletedAt: number | null (soft delete timestamp)
- metadata: JSON (extensible data)
```

**Sessions Table**:
```
- id: string (primary key)
- userId: string (indexed, foreign key)
- token: string (indexed)
- expiresAt: number (indexed for cleanup)
- createdAt: number
- userAgent: string (device tracking)
- ipAddress: string (location tracking)
- lastActivity: number (for auto-logout)
```

**Accounts Table** (OAuth):
```
- id: string (primary key)
- userId: string (indexed, foreign key)
- provider: string (enum: "google" | "github" | "discord" | "apple")
- providerAccountId: string (unique per provider)
- providerData: JSON (metadata from provider)
- createdAt: number
```

**Verification Tokens Table**:
```
- id: string (primary key)
- userId: string (indexed, foreign key)
- email: string (for verification tracking)
- token: string (hashed, indexed)
- tokenType: string ("email_verification" | "password_reset")
- expiresAt: number (indexed)
- usedAt: number | null (single-use validation)
- createdAt: number
```

**Organizations Table**:
```
- id: string (primary key)
- name: string
- slug: string (unique, indexed)
- ownerId: string (foreign key to users)
- image: string | null
- metadata: JSON
- createdAt: number
- updatedAt: number
```

**Organization Members Table**:
```
- id: string (primary key)
- organizationId: string (indexed, foreign key)
- userId: string (indexed, foreign key)
- role: string ("owner" | "admin" | "member" | "guest")
- invitedBy: string | null (foreign key to users)
- joinedAt: number
- updatedAt: number
- composite index: (organizationId, userId)
```

### Requirement 2: Convex Functions Organization

**Auth Functions** (/convex/functions/auth):
- `signUp.ts`: Register new user with email/password
- `signIn.ts`: Authenticate existing user
- `verifyEmail.ts`: Confirm email ownership
- `passwordResetRequest.ts`: Initiate password reset
- `resetPassword.ts`: Complete password reset
- `signOut.ts`: Invalidate session
- `oauthCallback.ts`: Handle OAuth provider callback

**Session Functions** (/convex/functions/sessions):
- `createSession.ts`: Create session after auth
- `validateSession.ts`: Verify session validity
- `getSession.ts`: Retrieve session details
- `listActiveSessions.ts`: Get all user sessions
- `revokeSession.ts`: End single session
- `revokeAllSessions.ts`: Force logout everywhere

**User Functions** (/convex/functions/users):
- `getUser.ts`: Get current user profile
- `getUserByEmail.ts`: Lookup user by email
- `updateProfile.ts`: Update user information
- `updatePassword.ts`: Change password
- `deleteAccount.ts`: Soft delete account

**Organization Functions** (/convex/functions/organizations):
- `createOrganization.ts`: Create new team
- `getOrganization.ts`: Retrieve org details
- `listUserOrganizations.ts`: All user's orgs
- `addMember.ts`: Invite user to organization
- `removeMember.ts`: Remove user from org
- `updateMemberRole.ts`: Change user role

### Requirement 3: Better Auth Configuration

**Email/Password Authentication**:
- Password: 12+ characters, complexity requirements
- Email verification: Mandatory before signup complete
- Password reset: 1-hour expiration token
- Session: 30-day default lifetime

**OAuth Providers**:
- Google, GitHub, Discord, Apple
- PKCE flow for security
- State validation for CSRF prevention
- Account linking support

**Session Management**:
- HttpOnly secure cookies
- JWT-based stateless sessions
- Auto-refresh before expiration
- Multi-device session tracking

**Rate Limiting**:
- /signin: 10 attempts per 15 minutes
- /signup: 5 attempts per 15 minutes
- /password-reset: 3 attempts per hour
- /verify-email: 5 sends per hour

---

## /speckit.plan

### Week 2: Days 1-3 - Database Schema & Foundation

**Step 1: Define Convex Schema** (2 hours)
- [ ] Create convex/schema.ts
- [ ] Define all 6 tables with indexes
- [ ] Add validation rules
- [ ] Generate TypeScript types

**Step 2: Create Auth Functions** (3 hours)
- [ ] Implement signUp function
- [ ] Implement signIn function
- [ ] Implement verifyEmail function
- [ ] Add password hashing (scrypt)

**Step 3: Create Session Functions** (2 hours)
- [ ] Implement createSession
- [ ] Implement validateSession
- [ ] Implement revokeSession
- [ ] Add session cleanup cron job

**Total Week 2: ~7 hours**

### Week 3: Days 4-6 - Integration & Testing

**Step 4: Configure Better Auth** (2 hours)
- [ ] Set up Better Auth in @auth/core
- [ ] Configure email/password provider
- [ ] Configure OAuth providers
- [ ] Integrate with Convex adapter

**Step 5: Implement Email Service** (2 hours)
- [ ] Set up Resend API integration
- [ ] Create email templates
- [ ] Implement email sending
- [ ] Add email retry logic

**Step 6: Add Rate Limiting** (2 hours)
- [ ] Implement rate limiter
- [ ] Apply to sensitive endpoints
- [ ] Add monitoring
- [ ] Test limit breaches

**Step 7: Write Integration Tests** (3 hours)
- [ ] Test signup flow end-to-end
- [ ] Test signin with valid/invalid credentials
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test OAuth flow (mocked)

**Total Week 3: ~9 hours**

---

## /speckit.tasks

### Task Group 1: Database Schema Design (Est. 4 hours)

**Task 1.1: Create Convex Schema File**
- [ ] Create convex/schema.ts
- [ ] Import defineSchema and defineTable
- [ ] Define Users table with all fields
- [ ] Define Sessions table with indexes
- [ ] Define Accounts table for OAuth
- [ ] Define VerificationTokens table
- [ ] Define Organizations table
- [ ] Define OrganizationMembers table
- Validation: Schema compiles, types generate correctly

**Task 1.2: Add Database Indexes**
- [ ] Index users.email (unique)
- [ ] Index users.emailVerified
- [ ] Index sessions.userId
- [ ] Index sessions.token
- [ ] Index sessions.expiresAt
- [ ] Index accounts.userId
- [ ] Index accounts.provider
- [ ] Index verificationTokens.userId
- [ ] Index verificationTokens.token
- [ ] Index organizations.slug
- Validation: All queries use indexed fields

**Task 1.3: Document Schema Relationships**
- [ ] Create convex/schema-diagram.md
- [ ] Document foreign key relationships
- [ ] Explain query patterns for each table
- [ ] List access control rules per table
- Validation: Diagram matches schema code

---

### Task Group 2: Better Auth Configuration (Est. 6 hours)

**Task 2.1: Install Better Auth Dependencies**
- [ ] Add better-auth to @auth/core
- [ ] Add @convex/auth
- [ ] Add password hashing (bcrypt or scrypt)
- [ ] Add email service adapter
- [ ] Add OAuth provider packages (optional)
- Time: 30 minutes
- Validation: Dependencies install correctly, no conflicts

**Task 2.2: Create Auth Configuration**
- [ ] Update @auth/core/src/better-auth-config.ts
- [ ] Implement createAuthConfig function
- [ ] Configure email/password provider
- [ ] Configure session settings
- [ ] Set password requirements
- [ ] Add database adapter
- Time: 1 hour
- Validation: Config object created without errors

**Task 2.3: Implement Convex Adapter**
- [ ] Update @auth/core/src/convex-adapter.ts
- [ ] Implement database interface
- [ ] Implement session management
- [ ] Implement token validation
- [ ] Add error handling
- Time: 1.5 hours
- Validation: Adapter methods callable and return correct types

**Task 2.4: Configure OAuth Providers**
- [ ] Set up Google OAuth credentials
- [ ] Set up GitHub OAuth credentials
- [ ] Add provider configurations to Better Auth
- [ ] Configure redirect URIs for environments
- [ ] Test provider flows (mocked)
- Time: 1 hour
- Validation: Provider configurations load without errors

**Task 2.5: Add Rate Limiting Middleware**
- [ ] Create rate limiter utility
- [ ] Implement sliding window algorithm
- [ ] Add to @auth/utils
- [ ] Configure limits per endpoint
- [ ] Add IP address + user tracking
- Time: 1 hour
- Validation: Rate limiter blocks after threshold

---

### Task Group 3: Convex Functions Implementation (Est. 8 hours)

**Task 3.1: Implement Authentication Functions**
- [ ] Create convex/functions/auth/signUp.ts
  - Validate email format
  - Hash password
  - Create user record
  - Send verification email
  - Return success response
- [ ] Create convex/functions/auth/signIn.ts
  - Find user by email
  - Validate password
  - Create session
  - Return session token
- [ ] Create convex/functions/auth/verifyEmail.ts
  - Validate token
  - Mark email verified
  - Delete token
- Time: 2 hours
- Validation: All functions execute without errors

**Task 3.2: Implement Password Reset Functions**
- [ ] Create convex/functions/auth/passwordResetRequest.ts
  - Validate email exists
  - Generate reset token
  - Set expiration (1 hour)
  - Send email with link
- [ ] Create convex/functions/auth/resetPassword.ts
  - Validate token
  - Hash new password
  - Update user password
  - Invalidate all sessions
- Time: 1 hour
- Validation: Reset flow works end-to-end

**Task 3.3: Implement Session Functions**
- [ ] Create convex/functions/sessions/createSession.ts
  - Generate session ID
  - Create database record
  - Set expiration
  - Return session token
- [ ] Create convex/functions/sessions/validateSession.ts
  - Look up session by token
  - Check expiration
  - Validate user still exists
  - Return session data
- [ ] Create convex/functions/sessions/revokeSession.ts
  - Mark session as revoked
  - Clean up token
- Time: 1.5 hours
- Validation: Sessions create, validate, and revoke correctly

**Task 3.4: Implement User Functions**
- [ ] Create convex/functions/users/getUser.ts
  - Require authentication
  - Return user profile
- [ ] Create convex/functions/users/updateProfile.ts
  - Validate updates
  - Update user record
  - Return updated profile
- [ ] Create convex/functions/users/updatePassword.ts
  - Require old password validation
  - Hash new password
  - Invalidate sessions
- Time: 1.5 hours
- Validation: User functions return correct data

**Task 3.5: Add Permission & Authorization Helpers**
- [ ] Create convex/lib/auth-helpers.ts
  - Implement getCurrentUser()
  - Implement requireAuth()
  - Implement requireRole()
  - Implement checkPermission()
- [ ] Create convex/lib/validators.ts
  - Email validator
  - Password validator
  - Organization role validator
  - Input sanitizer
- Time: 1.5 hours
- Validation: Helpers export correctly, types are correct

---

### Task Group 4: Email Service Integration (Est. 3 hours)

**Task 4.1: Set Up Resend Integration**
- [ ] Create convex/functions/email/sendEmail.ts
  - Accept email type parameter
  - Call Resend API
  - Handle errors gracefully
  - Log email send
- [ ] Create email templates:
  - verification-email.tsx
  - password-reset-email.tsx
  - welcome-email.tsx
- Time: 1.5 hours
- Validation: Emails can be sent via Resend API

**Task 4.2: Implement Email Retry Logic**
- [ ] Create convex/functions/email/retryFailedEmails.ts
  - Query failed email records
  - Retry with exponential backoff
  - Update status
  - Log results
- Time: 1 hour
- Validation: Retry logic executes without errors

**Task 4.3: Test Email Service**
- [ ] Create test email addresses
- [ ] Send test verification email
- [ ] Send test password reset email
- [ ] Verify email arrives
- [ ] Check template rendering
- Time: 30 minutes
- Validation: Emails received and formatted correctly

---

### Task Group 5: Testing & Validation (Est. 5 hours)

**Task 5.1: Write Unit Tests**
- [ ] Test email validation
- [ ] Test password hashing
- [ ] Test token generation
- [ ] Test rate limiter
- Time: 1.5 hours
- Coverage: 80%+

**Task 5.2: Write Integration Tests**
- [ ] Test signup flow end-to-end
- [ ] Test signin with valid/invalid credentials
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test session creation/validation
- Time: 2 hours
- Coverage: All critical paths

**Task 5.3: Security Testing**
- [ ] Test SQL injection prevention
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test token expiration
- [ ] Test unauthorized access
- Time: 1 hour
- Coverage: Security vulnerabilities tested

**Task 5.4: Performance Testing**
- [ ] Test signup time (target: < 1 second)
- [ ] Test signin time (target: < 500ms)
- [ ] Test session validation (target: < 50ms)
- [ ] Test with 1000+ concurrent users
- Time: 30 minutes

---

## /speckit.implement

### Implementation Checklist

```bash
# Step 1: Set up database schema
cd convex
touch schema.ts
# Define all tables as specified in requirements

# Step 2: Generate Convex types
npx convex codegen

# Step 3: Implement Better Auth config
cd ../packages/@auth/core
# Update better-auth-config.ts with full implementation

# Step 4: Implement Convex functions
cd ../../convex
mkdir -p functions/{auth,sessions,users,organizations}
# Create all function files

# Step 5: Set up email service
# Add Resend API key to .env
# Create email template files

# Step 6: Run tests
cd ../
pnpm test

# Step 7: Verify integration
pnpm build
```

---

## /speckit.analyze

### Consistency Checks

- [ ] All Convex functions have proper authentication checks
- [ ] All functions validate inputs with Zod schemas
- [ ] All error messages are user-friendly
- [ ] Email templates have consistent branding
- [ ] Rate limiting applied to all sensitive endpoints
- [ ] Session management is consistent across functions
- [ ] Types generated from schema match @auth/types

### Security Audit

- [ ] Passwords hashed with scrypt/argon2
- [ ] Tokens generated with crypto.randomBytes
- [ ] No sensitive data in logs
- [ ] SQL injection prevention verified
- [ ] CSRF protection enabled
- [ ] Session tokens are unguessable
- [ ] Email verification tokens single-use

---

## /speckit.checklist

### Phase 2 Sign-Off Checklist

**Backend Implementation**
- [ ] Convex schema deployed and verified
- [ ] All 7 tables created with correct indexes
- [ ] All auth functions working correctly
- [ ] Email service sending successfully
- [ ] Rate limiting preventing abuse
- [ ] Test coverage > 90%

**Security**
- [ ] No critical vulnerabilities found
- [ ] Passwords properly hashed
- [ ] Sessions properly secured
- [ ] Email verification working
- [ ] Password reset secure

**Performance**
- [ ] Signup < 1 second
- [ ] Signin < 500ms
- [ ] Session validation < 50ms
- [ ] Email sends < 5 seconds

**Documentation**
- [ ] Schema documented
- [ ] Function signatures documented
- [ ] Security decisions documented
- [ ] Configuration documented

**Ready for Phase 3**: All checkboxes complete ✓
