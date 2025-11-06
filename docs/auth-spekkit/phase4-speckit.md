# PHASE 4: Advanced Features & Security
## Complete Spec-Kit Workflow (Week 4-5)

---

## /speckit.constitution

You are implementing advanced authentication features and hardening security. Your work in Phase 4 adds enterprise-grade capabilities while maintaining code quality and performance.

### Core Principles

**1. Feature Completeness with Simplicity**
- Add features without complicating core flows
- Each feature independently optional
- Graceful degradation when features unavailable
- Clear configuration for adoption

**2. Security Layers, Not Single Points**
- Multiple authentication methods
- Recovery mechanisms for all paths
- Rate limiting per endpoint
- Audit logging for compliance
- Defense in depth at every layer

**3. Enterprise Readiness**
- Multi-tenant organization support
- Role-based access control (RBAC)
- Audit logging and compliance
- Session management dashboards
- Admin controls and oversight

---

## /speckit.specify

### Requirement 1: Multi-Factor Authentication

**TOTP Implementation**:
- Authenticator app support (Google Authenticator, Authy)
- QR code generation for easy setup
- Backup codes (10 single-use codes)
- Recovery procedures documented
- Optional SMS fallback

**Implementation Structure**:
```
- Setup: User enables TOTP
- QR Code: User scans in authenticator
- Verification: User enters code from app
- Backup Codes: User saves recovery codes
- Signin: After password, prompt for TOTP
```

### Requirement 2: Passkeys & WebAuthn

**Passkey Registration**:
- Challenge generation server-side
- Public key credential creation client-side
- Support multiple passkeys per user
- Device-bound credentials
- Biometric verification optional

**Passkey Authentication**:
- Challenge-response protocol
- Phishing-resistant authentication
- Fallback to password if needed
- Device management UI

### Requirement 3: Organization & RBAC

**Organization Management**:
- Create organizations (teams)
- Invite members via email
- Role hierarchy (owner, admin, member, custom)
- Permissions model
- Data isolation per organization

**Permission System**:
- Granular permissions (read, write, delete, admin)
- Role-permission mapping
- Custom roles support
- Permission inheritance
- Dynamic permission checks

### Requirement 4: Rate Limiting & Security

**Endpoint Protection**:
- /signin: 10 attempts per 15 minutes
- /signup: 5 attempts per 15 minutes
- /password-reset: 3 attempts per hour
- /2fa-verify: 5 attempts per minute

**Security Monitoring**:
- Failed auth attempt logging
- Geographic anomaly detection
- Suspicious activity alerts
- Brute force prevention

---

## /speckit.plan

### Week 4: Days 1-3 - MFA Implementation (6 hours)

**Step 1: Implement TOTP**
- [ ] Add TOTP library (speakeasy, otpauth)
- [ ] Create TOTP setup endpoint
- [ ] Generate QR codes
- [ ] Implement verification

**Step 2: Add Backup Codes**
- [ ] Generate backup codes
- [ ] Store securely (hashed)
- [ ] Implement single-use validation
- [ ] Add recovery endpoint

**Step 3: Test MFA Flows**
- [ ] Test setup flow
- [ ] Test verification
- [ ] Test backup code usage

### Week 5: Days 4-5 - Advanced Features (6 hours)

**Step 4: Implement Passkeys**
- [ ] Set up WebAuthn library
- [ ] Create registration flow
- [ ] Create authentication flow
- [ ] Add device management

**Step 5: Implement Organizations**
- [ ] Create organization schema
- [ ] Implement member management
- [ ] Add role-based access
- [ ] Create invitation system

**Step 6: Security Hardening**
- [ ] Implement advanced rate limiting
- [ ] Add audit logging
- [ ] Create security dashboards
- [ ] Test all security features

---

## /speckit.tasks

### Task Group 1: MFA (Est. 6 hours)

**Task 1.1: Implement TOTP Setup**
- [ ] Add speakeasy dependency
- [ ] Create Convex function: setupTOTP
- [ ] Generate QR code
- [ ] Create frontend UI
- Time: 2 hours

**Task 1.2: Implement TOTP Verification**
- [ ] Create Convex function: verifyTOTP
- [ ] Validate code timing
- [ ] Store secret securely
- [ ] Create UI for entry
- Time: 1.5 hours

**Task 1.3: Generate Backup Codes**
- [ ] Create backup code generator
- [ ] Hash codes for storage
- [ ] Create verification function
- [ ] Add UI for displaying/printing
- Time: 1.5 hours

**Task 1.4: Test MFA Flows**
- [ ] Test setup with authenticator
- [ ] Test valid/invalid codes
- [ ] Test backup code usage
- [ ] Test recovery procedures
- Time: 1 hour

---

### Task Group 2: Advanced Features (Est. 5 hours)

**Task 2.1: Implement Organization CRUD**
- [ ] Create organization Convex functions
- [ ] Implement member invitation
- [ ] Add role management
- [ ] Create organization UI
- Time: 2 hours

**Task 2.2: Implement RBAC**
- [ ] Define permission model
- [ ] Create permission checks
- [ ] Implement role assignment
- [ ] Add admin controls
- Time: 1.5 hours

**Task 2.3: Create Session Management**
- [ ] Build session dashboard
- [ ] Show all active sessions
- [ ] Implement remote logout
- [ ] Add device management
- Time: 1 hour

**Task 2.4: Add Audit Logging**
- [ ] Create audit log schema
- [ ] Log security events
- [ ] Create audit log viewer
- [ ] Add export functionality
- Time: 0.5 hours

---

## /speckit.implement

```bash
# Implement MFA
cd packages/@auth/core
# Add TOTP setup and verification

# Implement Organizations
cd convex
# Add organization functions

# Test everything
pnpm test
```

---

## /speckit.checklist

**MFA Features**
- [ ] TOTP setup working
- [ ] TOTP verification working
- [ ] Backup codes generated
- [ ] Backup code verification working
- [ ] Recovery procedures documented

**Advanced Features**
- [ ] Organization creation
- [ ] Member invitation
- [ ] Role assignment
- [ ] Permission checks
- [ ] Session dashboard

**Security**
- [ ] Rate limiting working
- [ ] Audit logging
- [ ] Suspicious activity alerts
- [ ] No security vulnerabilities

**Ready for Phase 5**: ✓
