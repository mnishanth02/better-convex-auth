# Deployment Guide

Complete guide for deploying Better Convex Auth applications to production environments.

## Table of Contents

- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [AWS](#aws)
  - [Google Cloud Platform](#google-cloud-platform)
  - [Docker](#docker)
- [Convex Production Setup](#convex-production-setup)
- [Domain Configuration](#domain-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Post-deployment Verification](#post-deployment-verification)

## Pre-deployment Checklist

### Code Quality
- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript builds without errors (`pnpm build`)
- [ ] ESLint/Biome checks pass (`pnpm check`)
- [ ] No console.log statements in production code
- [ ] Error boundaries implemented
- [ ] Loading states implemented

### Security
- [ ] Environment variables secured
- [ ] OAuth redirect URIs configured for production domain
- [ ] HTTPS enabled for production
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Database indexes created
- [ ] Caching strategies implemented
- [ ] CDN configured (if needed)

### Accessibility
- [ ] Screen reader testing completed
- [ ] Keyboard navigation verified
- [ ] Color contrast compliance checked
- [ ] ARIA labels validated

## Environment Configuration

### Required Environment Variables

```bash
# .env.production
# Base configuration
NODE_ENV=production
BETTER_AUTH_SECRET=your-production-secret-key
BETTER_AUTH_URL=https://your-domain.com

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud
CONVEX_DEPLOY_KEY=your-production-deploy-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Environment Variable Security

1. **Generate Secure Secrets**
   ```bash
   # Generate a secure auth secret
   openssl rand -base64 32
   ```

2. **Use Different Secrets Per Environment**
   ```bash
   # Development
   BETTER_AUTH_SECRET=dev-secret-key
   
   # Staging  
   BETTER_AUTH_SECRET=staging-secret-key
   
   # Production
   BETTER_AUTH_SECRET=production-secret-key
   ```

3. **OAuth Configuration per Environment**
   ```bash
   # Development OAuth URIs
   http://localhost:3000/api/auth/callback/google
   
   # Production OAuth URIs
   https://your-domain.com/api/auth/callback/google
   ```

## Deployment Platforms

### Vercel

Vercel provides seamless Next.js deployment with built-in optimization.

#### 1. Install Vercel CLI
```bash
pnpm add -g vercel
```

#### 2. Configure Project
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 3. Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add BETTER_AUTH_SECRET
vercel env add NEXT_PUBLIC_CONVEX_URL
```

#### 4. Domain Configuration
```bash
# Add custom domain
vercel domains add your-domain.com
vercel alias your-app.vercel.app your-domain.com
```

### Netlify

Netlify offers excellent static site hosting with serverless functions.

#### 1. Configure Build
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "9.0.0"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### 2. Deploy
```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### 3. Environment Variables
```bash
# Set via CLI
netlify env:set BETTER_AUTH_SECRET "your-secret"
netlify env:set NEXT_PUBLIC_CONVEX_URL "https://your-app.convex.cloud"
```

### AWS

Deploy to AWS using Amplify or EC2.

#### AWS Amplify

1. **Connect Repository**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - pnpm install --frozen-lockfile
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: out
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Environment Variables**
   - Set in Amplify Console
   - Use AWS Systems Manager Parameter Store for sensitive data

#### AWS EC2

1. **Server Setup**
   ```bash
   # Install Node.js and pnpm
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm pm2
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone your-repo.git
   cd your-app
   
   # Install dependencies
   pnpm install --frozen-lockfile
   
   # Build application
   pnpm build
   
   # Start with PM2
   pm2 start npm --name "auth-app" -- start
   pm2 save
   pm2 startup
   ```

### Google Cloud Platform

Deploy using Cloud Run or App Engine.

#### Cloud Run

1. **Dockerfile**
   ```dockerfile
   # Dockerfile
   FROM node:20-alpine AS base
   
   WORKDIR /app
   COPY package.json pnpm-lock.yaml ./
   RUN corepack enable pnpm
   
   FROM base AS deps
   RUN pnpm install --frozen-lockfile --prod
   
   FROM base AS builder
   RUN pnpm install --frozen-lockfile
   COPY . .
   RUN pnpm build
   
   FROM node:20-alpine AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   COPY --from=deps /app/node_modules ./node_modules
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/package.json ./package.json
   
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["npm", "start"]
   ```

2. **Deploy**
   ```bash
   # Build and deploy to Cloud Run
   gcloud run deploy auth-app \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NODE_ENV=production,BETTER_AUTH_SECRET=$SECRET"
   ```

### Docker

Containerize your application for any deployment platform.

#### Production Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod

# Build application
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV production
RUN pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for the .next folder
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  auth-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - NEXT_PUBLIC_CONVEX_URL=${NEXT_PUBLIC_CONVEX_URL}
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - auth-app
```

## Convex Production Setup

### 1. Deploy Convex Backend
```bash
# Deploy to production
npx convex deploy --prod

# Set production environment variables
npx convex env set --prod BETTER_AUTH_SECRET your-secret
npx convex env set --prod RESEND_API_KEY your-resend-key
npx convex env set --prod GOOGLE_CLIENT_SECRET your-google-secret
```

### 2. Database Migration
```bash
# Run any necessary migrations
npx convex run migration:migrateUsers --prod
```

### 3. Monitor Deployment
```bash
# Check deployment status
npx convex dashboard --prod
```

## Domain Configuration

### DNS Setup
```bash
# A Record for apex domain
@ IN A 76.76.19.21

# CNAME for www
www IN CNAME your-app.vercel.app

# CNAME for API subdomain (if using)
api IN CNAME your-app.vercel.app
```

### SSL/TLS Configuration
Most platforms handle SSL automatically, but verify:
- Certificate is valid and not expired
- HTTPS redirect is enabled
- HSTS headers are set

### OAuth Redirect URIs
Update OAuth applications with production URLs:

```bash
# Google OAuth Console
Authorized JavaScript origins:
- https://your-domain.com

Authorized redirect URIs:
- https://your-domain.com/api/auth/callback/google

# GitHub OAuth App
Authorization callback URL:
- https://your-domain.com/api/auth/callback/github
```

## Monitoring and Logging

### Application Monitoring

1. **Error Tracking**
   ```bash
   # Install Sentry
   pnpm add @sentry/nextjs
   ```

   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. **Analytics**
   ```typescript
   // lib/analytics.ts
   import { GoogleAnalytics } from "nextjs-google-analytics";

   export function Analytics() {
     return <GoogleAnalytics trackPageViews gaMeasurementId="GA_MEASUREMENT_ID" />;
   }
   ```

### Health Checks
```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Convex connection
    // Check database connectivity
    // Check external services
    
    return NextResponse.json({ 
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "unhealthy",
      error: error.message 
    }, { status: 500 });
  }
}
```

### Logging Strategy
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
    } else {
      console.log(message, meta);
    }
  },
  
  error: (message: string, error?: Error) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    } else {
      console.error(message, error);
    }
  }
};
```

## Post-deployment Verification

### Functional Testing
- [ ] Authentication flows work end-to-end
- [ ] OAuth providers function correctly
- [ ] Email verification works
- [ ] Password reset works
- [ ] Session persistence works
- [ ] API endpoints respond correctly

### Performance Testing
```bash
# Test page load speed
npm install -g lighthouse
lighthouse https://your-domain.com

# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/api/auth/session
```

### Security Testing
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] OAuth flows are secure
- [ ] No sensitive data in client-side code
- [ ] Rate limiting is working

### Accessibility Testing
```bash
# Install axe CLI
npm install -g @axe-core/cli

# Run accessibility audit
axe https://your-domain.com
```

### Monitoring Setup
```bash
# Set up uptime monitoring
curl -X POST https://api.uptimerobot.com/v2/newMonitor \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=your-api-key&format=json&type=1&url=https://your-domain.com&friendly_name=Auth App"
```

## Rollback Strategy

### Automated Rollback
```bash
# Vercel rollback
vercel rollback your-deployment-url

# Netlify rollback
netlify rollback

# Convex rollback
npx convex run rollback:toVersion --version=previous --prod
```

### Manual Rollback Process
1. Identify the last working deployment
2. Revert code changes if necessary
3. Redeploy previous version
4. Verify functionality
5. Update DNS if needed

## Best Practices

### Security
- Use environment-specific secrets
- Enable security headers
- Implement rate limiting
- Monitor for suspicious activity
- Regular security audits

### Performance
- Optimize bundle size
- Use CDN for static assets
- Implement caching strategies
- Monitor Core Web Vitals
- Set up performance budgets

### Reliability
- Implement health checks
- Set up monitoring and alerting
- Plan for database backups
- Test disaster recovery
- Document incident response

### Maintenance
- Regular dependency updates
- Monitor for security advisories
- Schedule maintenance windows
- Keep deployment documentation updated
- Plan capacity scaling