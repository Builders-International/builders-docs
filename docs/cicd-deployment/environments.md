# Environment Configuration

## Overview

Builders International uses multiple environments to ensure code quality and safe deployments. Each environment has specific purposes, access controls, and configurations.

## Environment Hierarchy

```
Development (Local) → Staging → Production
```

## Development Environment

### Purpose
Local development and testing on developer machines.

### Characteristics
- **Access:** All developers
- **Data:** Local/mock data only
- **Stability:** Unstable, frequent changes
- **Deployment:** Manual, on-demand

### Setup

```bash
# Clone repository
git clone https://github.com/Builders-International/project-name.git
cd project-name

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure local environment
# Edit .env.local with local settings

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env.local
NODE_ENV=development
API_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/myapp_dev
LOG_LEVEL=debug
ENABLE_DEBUG_TOOLS=true

# External services (use test/sandbox APIs)
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=SG.test...
```

### Database

Local PostgreSQL or SQLite:

```bash
# Using Docker
docker run -d \
  --name postgres-dev \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=myapp_dev \
  postgres:15

# Run migrations
npm run migrate:dev

# Seed with test data
npm run db:seed
```

### Testing

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# E2E tests (against local server)
npm run test:e2e
```

## Staging Environment

### Purpose
Pre-production testing and validation before deploying to production.

### Characteristics
- **Access:** Team + stakeholders
- **Data:** Sanitized production-like data
- **Stability:** Stable, updated on merge to main
- **Deployment:** Automatic via CI/CD

### URL Structure

```
Web: https://staging-project.vercel.app
API: https://staging-api.buildersintl.org
Admin: https://staging-admin.buildersintl.org
```

### Environment Variables

Configured in deployment platform (Vercel, DO, etc.):

```bash
NODE_ENV=staging
API_URL=https://staging-api.buildersintl.org
DATABASE_URL=postgresql://staging-db.buildersintl.org:5432/myapp_staging
LOG_LEVEL=info

# External services (test/sandbox)
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=SG.staging...

# Feature flags
ENABLE_BETA_FEATURES=true
ENABLE_DEBUG_PANEL=true

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_API_KEY=phc_staging...
```

### Database

Hosted database with sanitized data:

- **Provider:** Digital Ocean Managed PostgreSQL
- **Backups:** Daily automated backups
- **Data:** Sanitized copy of production (PII removed)
- **Size:** Smaller than production (representative sample)

### Data Sanitization

Production data is sanitized before copying to staging:

```sql
-- Example sanitization script
UPDATE users
SET
  email = CONCAT('user', id, '@example.com'),
  phone = CONCAT('+1555000', LPAD(id::text, 4, '0')),
  name = CONCAT('Test User ', id);

UPDATE orders
SET
  shipping_address = 'Sanitized Address';
```

### Access Control

- **VPN:** Not required (staging is publicly accessible)
- **Authentication:** Separate auth system (staging accounts)
- **Admin Access:** Limited to team members

### Deployment Process

Automatic on merge to `main`:

1. CI tests pass
2. Build created
3. Deploy to staging
4. Smoke tests run
5. Team notified in Slack

### Testing on Staging

```bash
# Run E2E tests against staging
npm run test:e2e -- --baseUrl=https://staging-project.vercel.app

# Manual testing checklist
# - Authentication flows
# - Key user journeys
# - Payment processing (test mode)
# - Email notifications (test inbox)
# - Error handling
# - Performance (load times)
```

### Monitoring

- **Uptime Kuma:** Monitors service availability
- **Sentry:** Tracks errors and exceptions
- **PostHog:** Analytics (separate staging project)
- **Logs:** Centralized logging system

## Production Environment

### Purpose
Live, user-facing services serving real users.

### Characteristics
- **Access:** End users + limited team access
- **Data:** Real user data (PII, financial, etc.)
- **Stability:** Highly stable, manual deployment
- **Deployment:** Manual approval required

### URL Structure

```
Web: https://buildersintl.org
API: https://api.buildersintl.org
Admin: https://admin.buildersintl.org
```

### Environment Variables

Configured securely in deployment platform:

```bash
NODE_ENV=production
API_URL=https://api.buildersintl.org
DATABASE_URL=postgresql://prod-db.buildersintl.org:5432/myapp_production
LOG_LEVEL=warn

# External services (production)
STRIPE_KEY=sk_live_...
SENDGRID_API_KEY=SG.prod...

# Feature flags
ENABLE_BETA_FEATURES=false
ENABLE_DEBUG_PANEL=false

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_API_KEY=phc_prod...

# Security
RATE_LIMIT_ENABLED=true
CORS_ORIGINS=https://buildersintl.org
```

### Database

Production-grade database:

- **Provider:** Digital Ocean Managed PostgreSQL
- **Backups:** Continuous + daily snapshots (30-day retention)
- **High Availability:** Primary + standby replicas
- **Encryption:** At rest and in transit
- **Monitoring:** Query performance, slow query log

### Access Control

- **VPN:** Required for infrastructure access
- **2FA:** Required for all admin access
- **Principle of Least Privilege:** Minimal access granted
- **Audit Logging:** All access logged and monitored

### Deployment Process

Manual with approval gates:

1. Create release tag
2. Trigger release workflow
3. Platform team approval required
4. Deploy with health checks
5. Smoke tests + monitoring
6. Team notification

See [Deployment Process](./deployment-process.md) for details.

### Monitoring & Alerting

- **Uptime Kuma:** Service availability (1-minute checks)
- **Sentry:** Error tracking with alerting
- **PostHog:** User analytics and session recording
- **CrowdSec:** Security monitoring
- **Custom Dashboards:** Key business metrics

**Alert Channels:**
- Slack: #alerts channel
- PagerDuty: For critical incidents
- Email: For non-urgent notifications

### Backup & Disaster Recovery

**Database Backups:**
- Point-in-time recovery available
- Daily full backups retained for 30 days
- Tested restore procedures quarterly

**Application Backups:**
- Code in Git (version controlled)
- Configuration in deployment platform
- Secrets in secure secrets management

**Disaster Recovery Plan:**
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 5 minutes
- Documented runbooks for common scenarios

## Secrets Management

### Storage

**GitHub Secrets:**
Used for CI/CD workflows:

```
Settings → Secrets and variables → Actions
```

**Vercel Environment Variables:**
```
Project Settings → Environment Variables
```

**Digital Ocean:**
- Secrets stored in `/opt/app/.env.production` on droplet
- Access controlled via SSH keys
- Encrypted at rest

### Rotation Policy

- **API Keys:** Rotate every 90 days
- **Database Passwords:** Rotate every 180 days
- **SSH Keys:** Rotate annually
- **Service Account Tokens:** Rotate every 90 days

### Required Secrets per Environment

**Development:**
- Local database credentials
- Test API keys (Stripe, etc.)
- Development OAuth credentials

**Staging:**
- Staging database URL
- Test API keys
- Staging Sentry DSN
- Staging PostHog key
- Deployment credentials

**Production:**
- Production database URL
- Live API keys (Stripe, SendGrid, etc.)
- Production monitoring keys
- Domain certificates (auto-managed by Cloudflare)
- Deployment credentials

## Environment-Specific Configuration

### Feature Flags

Control features per environment:

```typescript
// config/features.ts
const features = {
  development: {
    betaFeatures: true,
    debugPanel: true,
    analytics: false,
  },
  staging: {
    betaFeatures: true,
    debugPanel: true,
    analytics: true,
  },
  production: {
    betaFeatures: false,
    debugPanel: false,
    analytics: true,
  },
}

export const isFeatureEnabled = (feature: keyof typeof features.development) => {
  return features[process.env.NODE_ENV][feature]
}
```

### Rate Limiting

```typescript
const rateLimits = {
  development: {
    enabled: false,
    requests: Infinity,
  },
  staging: {
    enabled: true,
    requests: 1000, // per hour
  },
  production: {
    enabled: true,
    requests: 100, // per hour
  },
}
```

### Logging

```typescript
const logging = {
  development: {
    level: 'debug',
    pretty: true,
  },
  staging: {
    level: 'info',
    pretty: false,
  },
  production: {
    level: 'warn',
    pretty: false,
  },
}
```

## Adding a New Environment Variable

1. **Add to documentation**
   - Document purpose and format
   - Specify which environments need it

2. **Add to example files**
   ```bash
   # .env.example
   NEW_VARIABLE=example_value
   ```

3. **Configure in deployment platforms**
   - Vercel: Project settings
   - Digital Ocean: Update .env file on droplet

4. **Update CI/CD workflows**
   - Add secret to GitHub if needed
   - Update workflow files

5. **Test in staging first**
   - Verify variable is accessible
   - Ensure feature works correctly

6. **Deploy to production**
   - Add variable to production environment
   - Verify configuration

## Troubleshooting

### Environment Variable Not Loading

```bash
# Check environment
echo $NODE_ENV

# Verify .env file loaded
node -e "require('dotenv').config(); console.log(process.env)"

# Check deployment platform configuration
# Vercel: vercel env ls
# Digital Ocean: SSH and check .env file
```

### Database Connection Issues

```bash
# Test database connectivity
psql $DATABASE_URL

# Check connection pool
# Monitor active connections
# Verify credentials are correct
```

### Staging/Production Drift

If environments diverge:

1. Document differences
2. Create plan to reconcile
3. Update infrastructure as code
4. Apply changes consistently

## Best Practices

1. **Environment Parity:** Keep staging as close to production as possible
2. **Secrets Hygiene:** Never commit secrets, rotate regularly
3. **Configuration as Code:** Define environment config in version control
4. **Least Privilege:** Grant minimum necessary access
5. **Monitor Everything:** Track metrics and logs in all environments
6. **Test on Staging First:** Always validate changes on staging before production
7. **Document Changes:** Keep environment documentation up to date
8. **Automate Provisioning:** Use infrastructure as code when possible
9. **Backup Regularly:** Ensure all environments have backup strategies
10. **Review Access:** Audit environment access quarterly

## Resources

- [Infrastructure Overview](../infrastructure/overview.md)
- [Deployment Process](./deployment-process.md)
- [CI/CD Workflows](./workflows.md)
- [Secrets Management](#) (TODO: Detailed secrets guide)
