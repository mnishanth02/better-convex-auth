# PHASE 5: Developer Experience & Documentation
## Complete Spec-Kit Workflow (Week 5-6)

---

## /speckit.constitution

You are creating comprehensive documentation and developer-friendly tooling. Your work in Phase 5 enables other developers to adopt and contribute to the authentication system.

### Core Principles

**1. Documentation as Code**
- Examples are real, tested code
- API docs auto-generated from types
- Guides include complete working examples
- Keep docs and code in sync

**2. Developer Ergonomics**
- One-command setup
- Clear error messages guide users
- Type definitions enable IDE autocomplete
- Sensible defaults work immediately

**3. Knowledge Transfer**
- Every decision documented (ADRs)
- Common patterns explained
- Troubleshooting guides included
- Video walkthroughs for complex flows

---

## /speckit.specify

### Requirement 1: Configuration System

**Declarative Configuration** (`auth.config.ts` in each app):
```typescript
export const authConfig = {
  // Authentication methods
  methods: {
    emailPassword: {
      enabled: true,
      passwordMinLength: 12,
      requireEmailVerification: true,
    },
    oauth: {
      providers: ['google', 'github'],
    },
    magicLinks: { enabled: false },
    totp: { enabled: true },
    passkeys: { enabled: false },
  },
  
  // Session settings
  session: {
    expirationDays: 30,
    autoRefresh: true,
  },
  
  // Security options
  security: {
    rateLimits: { signin: '10/15m' },
    passwordRequirements: { complexity: 'strict' },
  },
  
  // Email provider
  email: {
    provider: 'resend',
    fromAddress: 'noreply@example.com',
  },
};
```

### Requirement 2: Error Handling

**Error Codes** (standardized):
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Email already registered
- `AUTH_003`: Email not verified
- `AUTH_004`: Rate limited
- `AUTH_005`: Session expired
- `AUTH_006`: Invalid token
- `AUTH_007`: TOTP required

**Error Messages** (user-friendly):
- What went wrong (clear statement)
- Why it happened (context)
- What to do next (action)

### Requirement 3: Documentation Structure

**Getting Started Guide**:
- 5-minute quick start
- Single command installation
- First auth flow working
- Common customizations

**API Reference**:
- All exported functions
- Type signatures
- Parameter descriptions
- Return value documentation
- Usage examples

**Integration Guides**:
- Next.js setup guide
- Expo setup guide
- Backend setup guide
- Database setup guide

**Advanced Topics**:
- Custom password requirements
- Adding OAuth providers
- Email template customization
- Permission system customization
- Database migration guide

**Troubleshooting**:
- Common issues and solutions
- Debug mode activation
- Log inspection guide
- Performance optimization

---

## /speckit.plan

### Week 5: Days 1-3 - Documentation

**Step 1: Create Getting Started Guide** (2 hours)
- [ ] Write 5-minute quickstart
- [ ] Include commands and expected output
- [ ] Add first customization example
- [ ] Test with new developer

**Step 2: Write API Reference** (2 hours)
- [ ] Document all package exports
- [ ] Add JSDoc to all functions
- [ ] Include parameter descriptions
- [ ] Add return type documentation
- [ ] Generate HTML docs

**Step 3: Create Integration Guides** (2 hours)
- [ ] Write Next.js guide
- [ ] Write Expo guide
- [ ] Include code examples
- [ ] Test each guide

### Week 6: Days 4-5 - Tooling & Examples

**Step 4: Set Up Config System** (1.5 hours)
- [ ] Create auth.config.ts validator
- [ ] Add validation errors
- [ ] Document all options
- [ ] Create example configs

**Step 5: Create Example Projects** (2 hours)
- [ ] Create example-web project
- [ ] Create example-mobile project
- [ ] Document how to run examples
- [ ] Include common patterns

**Step 6: Build Documentation Site** (2 hours)
- [ ] Set up VitePress or Docusaurus
- [ ] Deploy documentation
- [ ] Add search functionality
- [ ] Create video tutorials

---

## /speckit.tasks

### Task Group 1: Documentation (Est. 8 hours)

**Task 1.1: Getting Started Guide**
- [ ] Write title and introduction
- [ ] Installation instructions (3 commands)
- [ ] Basic usage example
- [ ] First authentication flow
- [ ] Customization pointer
- [ ] Link to detailed guides
- Time: 1.5 hours

**Task 1.2: API Reference**
- [ ] Document @auth/core exports
- [ ] Document @auth/ui components
- [ ] Document @auth/hooks hooks
- [ ] Document @auth/types types
- [ ] Document @auth/utils utilities
- [ ] Add usage examples to each
- Time: 2.5 hours

**Task 1.3: Integration Guides**
- [ ] Create guides/next-js.md
- [ ] Create guides/expo.md
- [ ] Create guides/backend-setup.md
- [ ] Create guides/email-setup.md
- [ ] Include full working examples
- Time: 2 hours

**Task 1.4: Troubleshooting Guide**
- [ ] Document common issues
- [ ] Add solutions for each
- [ ] Include debug procedures
- [ ] Add performance tips
- Time: 1 hour

**Task 1.5: Architecture Documentation**
- [ ] Create guides/architecture.md
- [ ] Include system diagrams
- [ ] Explain design decisions
- [ ] Link to relevant ADRs
- Time: 1 hour

---

### Task Group 2: Configuration System (Est. 4 hours)

**Task 2.1: Create Configuration Validator**
- [ ] Create auth.config.ts schema (Zod)
- [ ] Validate all required fields
- [ ] Provide helpful error messages
- [ ] Support environment overrides
- Time: 1.5 hours

**Task 2.2: Create Example Configurations**
- [ ] Create configs/basic.ts (simplest)
- [ ] Create configs/standard.ts (recommended)
- [ ] Create configs/enterprise.ts (full features)
- [ ] Document each configuration
- Time: 1 hour

**Task 2.3: Add Configuration Docs**
- [ ] Document all config options
- [ ] Explain each setting's purpose
- [ ] Show before/after examples
- [ ] Link to feature documentation
- Time: 1 hour

**Task 2.4: Create Config Validator CLI**
- [ ] Create CLI to validate configs
- [ ] Show detailed error messages
- [ ] Suggest fixes
- [ ] Add to package scripts
- Time: 0.5 hours

---

### Task Group 3: Developer Tools (Est. 5 hours)

**Task 3.1: Create Example Projects**
- [ ] Create examples/web directory
  - Working Next.js app with all features
  - All auth flows implemented
  - Common patterns shown
- [ ] Create examples/mobile directory
  - Working Expo app
  - All auth flows implemented
  - Mobile-specific patterns
- Time: 2 hours

**Task 3.2: Create Demo Environment Setup**
- [ ] Create docker-compose.yml for local dev
- [ ] Include Convex local backend
- [ ] Include Resend email simulator
- [ ] Add startup script
- Time: 1 hour

**Task 3.3: Create VS Code Workspace**
- [ ] Create .vscode/settings.json
- [ ] Add recommended extensions
- [ ] Create debug configurations
- [ ] Add launch.json for debugging
- Time: 1 hour

**Task 3.4: Create Changelog & Release Notes**
- [ ] Create CHANGELOG.md
- [ ] Document all releases
- [ ] Include migration guides
- [ ] Note breaking changes
- Time: 0.5 hours

---

### Task Group 4: Documentation Site (Est. 4 hours)

**Task 4.1: Set Up Documentation Site**
- [ ] Initialize VitePress or Docusaurus
- [ ] Create site structure
- [ ] Set up deployment
- [ ] Configure search
- Time: 1.5 hours

**Task 4.2: Migrate Docs to Site**
- [ ] Move guides to docs site
- [ ] Add to navigation
- [ ] Fix formatting and links
- [ ] Add code syntax highlighting
- Time: 1.5 hours

**Task 4.3: Create Video Tutorials**
- [ ] Record setup tutorial
- [ ] Record first auth flow
- [ ] Record advanced features
- [ ] Upload and link from docs
- Time: 1 hour

---

## /speckit.implement

```bash
# Create documentation structure
mkdir -p docs/{guides,api,examples}

# Generate API docs
pnpm run generate:docs

# Build documentation site
cd docs
npm run build

# Deploy to Vercel
vercel deploy
```

---

## /speckit.checklist

**Documentation**
- [ ] Getting Started guide complete
- [ ] API reference complete
- [ ] All integration guides written
- [ ] Troubleshooting guide complete
- [ ] Examples working

**Configuration System**
- [ ] Configuration schema defined
- [ ] Validator working
- [ ] Error messages helpful
- [ ] Documentation complete

**Tooling**
- [ ] Example projects created
- [ ] Debug tools available
- [ ] CLI utilities working
- [ ] Documentation site live

**DX Score**: > 9/10 ✓
