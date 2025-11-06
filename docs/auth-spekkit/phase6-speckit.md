# PHASE 6: CI/CD & Deployment
## Complete Spec-Kit Workflow (Week 6-7)

---

## /speckit.constitution

You are building automated deployment pipelines and production infrastructure. Your work in Phase 6 enables reliable, continuous delivery of the authentication system.

### Core Principles

**1. Automation Everywhere**
- Every manual step is a failure waiting to happen
- Tests run automatically before deployment
- Deployments trigger on every commit
- Rollbacks automated on failures

**2. Fail Fast, Fail Safe**
- Quick feedback on breaking changes
- Multiple validation gates before production
- Automatic rollback on errors
- Clear incident communication

**3. Production Excellence**
- Infrastructure as code
- Environment parity (dev ≈ prod)
- Zero-downtime deployments
- Comprehensive monitoring

---

## /speckit.specify

### Requirement 1: CI/CD Pipeline

**GitHub Actions Workflow** (.github/workflows/ci.yml):
- Trigger: On every push to main, every PR
- Jobs:
  1. Lint & Type Check (2 min)
  2. Unit Tests (5 min)
  3. Build (3 min)
  4. Integration Tests (5 min)
  5. Security Scan (2 min)
  6. Deploy to staging (5 min, if main branch)

**Quality Gates**:
- Zero TypeScript errors
- All tests passing (100% critical paths)
- No security vulnerabilities
- Code coverage > 80%
- Bundle size < 100KB per package

### Requirement 2: Deployment Strategy

**Next.js Web Deployment**:
- Platform: Vercel (recommended)
- Trigger: Auto-deploy on main push
- Environment: Production, Staging, Preview
- Preview deployments for every PR
- Automatic rollback on build failure
- Environment variables per deployment

**Convex Backend Deployment**:
- Trigger: `pnpm convex deploy`
- Environments: Production, Staging, Dev
- Schema migrations: Automatic
- Rollback: One-click from dashboard
- Backups: Daily automated snapshots

**Expo Mobile Deployment**:
- Platform: EAS (Expo Application Services)
- Build: Cloud-based native builds
- Distribution: Internal testing, App Store, Google Play
- Over-the-air updates: Via EAS Update
- Versioning: Automated semantic versioning

### Requirement 3: Monitoring & Observability

**Error Tracking** (Sentry):
- Capture all errors in production
- Alert on new error types
- Group similar errors
- Track error resolution

**Performance Monitoring**:
- Response time tracking
- Database query monitoring
- API endpoint metrics
- User experience metrics (Core Web Vitals)

**Security Monitoring**:
- Failed auth attempts
- Rate limit violations
- Geographic anomalies
- Suspicious patterns

---

## /speckit.plan

### Week 6: Days 1-3 - CI/CD Pipeline

**Step 1: Configure GitHub Actions** (2 hours)
- [ ] Create .github/workflows/ci.yml
- [ ] Add lint job
- [ ] Add build job
- [ ] Add test job
- [ ] Configure caching

**Step 2: Set Up Quality Gates** (1.5 hours)
- [ ] Configure code coverage threshold
- [ ] Add security scanning
- [ ] Set up branch protection
- [ ] Add PR checks

**Step 3: Test CI Pipeline** (1 hour)
- [ ] Create test PR
- [ ] Verify all checks pass
- [ ] Verify checks fail on errors
- [ ] Document troubleshooting

### Week 7: Days 4-5 - Deployment Setup

**Step 4: Configure Vercel Deployment** (1.5 hours)
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Configure preview deployments
- [ ] Test auto-deployment

**Step 5: Configure Convex Deployment** (1 hour)
- [ ] Set up Convex environments
- [ ] Configure staging database
- [ ] Configure production database
- [ ] Set up automatic backups

**Step 6: Configure Monitoring** (1.5 hours)
- [ ] Set up Sentry
- [ ] Configure error alerts
- [ ] Set up performance tracking
- [ ] Create incident response playbook

---

## /speckit.tasks

### Task Group 1: GitHub Actions (Est. 5 hours)

**Task 1.1: Create CI Workflow**
- [ ] Create .github/workflows/ci.yml
- [ ] Add workflow trigger configuration
- [ ] Set up Node.js environment
- [ ] Configure dependency caching
- [ ] Add pnpm setup
- Time: 1 hour

**Task 1.2: Add Quality Checks**
- [ ] Add lint job (ESLint)
- [ ] Add type check job (TypeScript)
- [ ] Add build job (turbo build)
- [ ] Add test job (Vitest)
- [ ] Add security scan job (npm audit)
- Time: 1.5 hours

**Task 1.3: Configure Deployment Jobs**
- [ ] Add deploy to staging job
- [ ] Add deploy to production job (main branch only)
- [ ] Configure environment variables
- [ ] Add deployment status checks
- Time: 1.5 hours

**Task 1.4: Set Up Branch Protection**
- [ ] Require CI checks to pass
- [ ] Require at least 1 review
- [ ] Dismiss stale reviews
- [ ] Enable auto-merge (if approved)
- Time: 0.5 hours

**Task 1.5: Test Workflow**
- [ ] Create test branch
- [ ] Push test commit
- [ ] Verify workflow runs
- [ ] Verify all checks pass
- [ ] Create test failure
- [ ] Verify checks fail appropriately
- Time: 1 hour

---

### Task Group 2: Deployment Configuration (Est. 6 hours)

**Task 2.1: Set Up Vercel Deployment**
- [ ] Connect GitHub repository to Vercel
- [ ] Configure production environment
- [ ] Configure staging environment
- [ ] Set environment variables (BETTER_AUTH_SECRET, etc)
- [ ] Test auto-deployment on push
- Time: 1.5 hours

**Task 2.2: Configure Convex Deployment**
- [ ] Create Convex team/project
- [ ] Set up production environment
- [ ] Set up staging environment
- [ ] Configure environment variables
- [ ] Deploy schema to staging
- [ ] Deploy schema to production
- Time: 1.5 hours

**Task 2.3: Set Up EAS for Mobile**
- [ ] Create EAS account
- [ ] Configure iOS build settings
- [ ] Configure Android build settings
- [ ] Set up internal testing builds
- [ ] Test build process
- Time: 1.5 hours

**Task 2.4: Configure Automatic Backups**
- [ ] Set up Convex backups (if not automatic)
- [ ] Configure backup schedule
- [ ] Test backup restoration
- [ ] Document recovery procedures
- Time: 0.5 hours

**Task 2.5: Set Up Secret Management**
- [ ] Migrate secrets to Vercel
- [ ] Migrate secrets to Convex
- [ ] Set up secret rotation schedule
- [ ] Document secret management procedures
- Time: 0.5 hours

**Task 2.6: Create Deployment Documentation**
- [ ] Document deployment process
- [ ] Create rollback procedures
- [ ] Document emergency procedures
- [ ] Create incident response playbook
- Time: 0.5 hours

---

### Task Group 3: Monitoring & Observability (Est. 4 hours)

**Task 3.1: Set Up Error Tracking**
- [ ] Create Sentry project
- [ ] Install Sentry in Next.js app
- [ ] Install Sentry in Expo app
- [ ] Configure error sampling
- [ ] Test error capture
- Time: 1.5 hours

**Task 3.2: Configure Performance Monitoring**
- [ ] Set up Web Vitals tracking
- [ ] Add database query monitoring
- [ ] Add API endpoint metrics
- [ ] Create performance dashboards
- Time: 1 hour

**Task 3.3: Set Up Security Monitoring**
- [ ] Create security event logging
- [ ] Add suspicious activity detection
- [ ] Create security alerts
- [ ] Document security incident response
- Time: 1 hour

**Task 3.4: Create Incident Response Plan**
- [ ] Document escalation procedures
- [ ] Create incident templates
- [ ] Set up on-call rotation (if applicable)
- [ ] Create post-incident review process
- Time: 0.5 hours

---

## /speckit.implement

```bash
# GitHub Actions
mkdir -p .github/workflows
touch .github/workflows/ci.yml
# Configure workflow as specified

# Deploy to Vercel
# 1. Connect GitHub repo in Vercel dashboard
# 2. Configure environment variables
# 3. Push to main to trigger deployment

# Deploy to Convex
convex deploy

# Set up monitoring
# 1. Create Sentry project
# 2. Configure in applications
# 3. Test error capture
```

---

## /speckit.checklist

**CI/CD Pipeline**
- [ ] All GitHub Actions jobs pass
- [ ] Code coverage threshold met
- [ ] Security scans passing
- [ ] Branch protection rules enforced
- [ ] PR checks comprehensive

**Web Deployment**
- [ ] Vercel connected
- [ ] Auto-deployment working
- [ ] Preview deployments working
- [ ] Environment variables configured
- [ ] Production deployment successful

**Backend Deployment**
- [ ] Convex schema deployed
- [ ] Both environments created
- [ ] Backups configured
- [ ] Rollback tested

**Mobile Deployment**
- [ ] EAS builds configured
- [ ] Internal testing builds working
- [ ] App Store ready for submission
- [ ] Google Play ready for submission

**Monitoring**
- [ ] Error tracking working
- [ ] Performance metrics collected
- [ ] Security alerts configured
- [ ] Incident response plan documented

**Production Ready**: ✓
