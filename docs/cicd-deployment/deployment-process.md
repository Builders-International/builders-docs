# Deployment Process

Step-by-step procedures for deploying services to staging and production environments.

## Overview

All deployments follow a consistent process to ensure reliability, traceability, and the ability to rollback if needed.

## Pre-Deployment Checklist

Before any deployment:

- [ ] All tests passing in CI
- [ ] Code review approved and merged
- [ ] No known critical bugs in the release
- [ ] Staging environment tested and validated
- [ ] Release notes prepared
- [ ] Database migrations tested (if applicable)
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented

## Deployment to Staging

Staging deployments happen automatically on merge to `main`.

### Process

1. **Merge PR to main**
   ```bash
   # Via GitHub UI or:
   git checkout main
   git pull origin main
   # Changes are now in main
   ```

2. **CI/CD automatically triggers**
   - Tests run
   - Build created
   - Deploy to staging environment
   - Smoke tests execute

3. **Verify deployment**
   ```bash
   # Check deployment status in GitHub Actions
   # Visit staging URL
   curl https://staging.example.com/health

   # Check logs
   # Verify key functionality
   ```

4. **Monitor for issues**
   - Check [Uptime Kuma](../infrastructure/uptime-kuma.md) dashboard
   - Review error logs
   - Test critical user paths
   - Verify integrations (APIs, databases, etc.)

### Staging Validation

Before promoting to production, validate:

- [ ] Application loads successfully
- [ ] Authentication works
- [ ] Key user flows function correctly
- [ ] API endpoints respond as expected
- [ ] Database migrations applied successfully
- [ ] External integrations working
- [ ] No console errors or warnings
- [ ] Performance acceptable (load times, API response times)

## Deployment to Production

Production deployments require manual approval and careful coordination.

### Timing Considerations

**Best times to deploy:**
- Weekdays during business hours (when team is available)
- Low-traffic periods (if applicable)
- After QA sign-off
- When team can monitor post-deployment

**Avoid deploying:**
- Fridays or before weekends (limited support availability)
- During high-traffic events
- Before holidays
- When key team members unavailable

### Process

#### 1. Prepare Release

```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Review changes since last release
git log --oneline v1.2.0..HEAD

# Create release notes
# Document breaking changes, new features, bug fixes
```

#### 2. Create Release Tag

```bash
# Tag the release
git tag -a v1.2.1 -m "Release v1.2.1: Feature X and Bug Y fix"
git push origin v1.2.1
```

Or use GitHub's release UI:
1. Go to repository → Releases
2. Click "Draft a new release"
3. Choose or create tag (e.g., `v1.2.1`)
4. Add release title and notes
5. Publish release

#### 3. Trigger Production Deployment

**Via GitHub Actions UI:**
1. Go to Actions tab
2. Select "Release to Production" workflow
3. Click "Run workflow"
4. Enter version (e.g., `v1.2.1`)
5. Click "Run workflow"

**Via CLI:**
```bash
gh workflow run release.yml -f version=v1.2.1
```

#### 4. Approve Deployment

Production deployments require manual approval:

1. Workflow pauses at approval gate
2. Designated approvers receive notification
3. Review deployment details
4. Approve or reject deployment

**Approvers check:**
- Staging validation completed
- Release notes reviewed
- No critical issues reported
- Team ready to monitor

#### 5. Monitor Deployment

Watch the deployment progress:

```bash
# Monitor workflow
gh run watch

# Check application health
curl https://example.com/health

# Watch logs (if using Digital Ocean)
ssh user@production-server
docker logs -f app --tail=100

# Monitor metrics
# - Uptime Kuma: https://status.buildersintl.org
# - PostHog: https://app.posthog.com
# - Error tracking dashboard
```

#### 6. Validate Production

After deployment completes:

- [ ] Health check endpoint returns success
- [ ] Application loads in browser
- [ ] Authentication works
- [ ] Critical user flows tested
- [ ] API endpoints responding correctly
- [ ] No spike in error rates
- [ ] Performance metrics normal
- [ ] Uptime Kuma shows service UP
- [ ] No alerts triggered

#### 7. Communicate Status

Update team on deployment status:

```
✅ v1.2.1 deployed to production successfully

Changes:
- Added feature X
- Fixed bug Y
- Updated dependency Z

Validation:
- Health checks passing
- Smoke tests passed
- No errors in logs
- Response times normal

Monitoring:
- Uptime Kuma: ✅
- Error rate: Normal
- Performance: ✅
```

Post in:
- Slack #deployments channel
- Update status page if needed

## Rollback Procedures

If issues are discovered post-deployment, rollback immediately.

### When to Rollback

Rollback if:
- Critical functionality broken
- Significant increase in error rates
- Performance degradation impacting users
- Security vulnerability introduced
- Data integrity issues

### Rollback Process

#### Vercel Deployments

Instant rollback via dashboard:

1. Go to Vercel project dashboard
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Confirm promotion

Or via CLI:
```bash
vercel rollback https://previous-deployment-url.vercel.app --prod
```

#### Digital Ocean Deployments

Rollback to previous Docker image:

```bash
# SSH to server
ssh user@production-server

# Stop current container
docker stop app
docker rm app

# Run previous version
docker run -d \
  --name app \
  -p 3000:3000 \
  --env-file /opt/app/.env.production \
  registry.digitalocean.com/myregistry/app:PREVIOUS_SHA

# Verify health
curl http://localhost:3000/health
```

#### Database Rollback

If migrations were applied:

```bash
# Run down migration
npm run migrate:down

# Or restore from backup (if needed)
# Contact database administrator
```

### Post-Rollback

After rollback:

1. **Verify rollback successful**
   - Application working correctly
   - Error rates normal
   - Users can access service

2. **Investigate issue**
   - Review logs
   - Identify root cause
   - Document findings

3. **Create hotfix or revert**
   ```bash
   # Revert the problematic commit
   git revert <commit-sha>
   git push origin main

   # Or create hotfix branch
   git checkout -b hotfix/fix-critical-issue
   # Make fixes
   git commit -m "fix: resolve production issue"
   # Create PR and fast-track review
   ```

4. **Communicate to team**
   ```
   ⚠️ Production rollback executed

   Reason: Critical bug in feature X
   Rolled back to: v1.2.0
   Status: Service restored, investigating issue

   Next steps:
   - Root cause analysis
   - Hotfix in progress
   - ETA for fix: 2 hours
   ```

## Database Migrations

When deployments include database changes:

### Before Deployment

1. **Test migrations**
   ```bash
   # Test on staging database
   npm run migrate:up

   # Verify data integrity
   npm run migrate:verify

   # Test rollback
   npm run migrate:down
   npm run migrate:up
   ```

2. **Backup production database**
   ```bash
   # Automatic backups should be configured
   # Verify recent backup exists
   # Document backup ID for quick restore if needed
   ```

### During Deployment

1. **Apply migrations before code deployment**
   - Ensures database ready for new code
   - Use backward-compatible migrations when possible

2. **Zero-downtime migrations**
   - Add new columns (don't remove old ones immediately)
   - Deploy code that uses both old and new schema
   - Remove old columns in subsequent deployment

### After Deployment

1. **Verify migrations**
   ```bash
   # Check migration status
   npm run migrate:status

   # Verify data integrity
   npm run test:data-integrity
   ```

2. **Monitor query performance**
   - Watch for slow queries
   - Check index usage
   - Verify no lock contention

## Emergency Procedures

### Complete Service Outage

1. **Immediate Actions**
   - Trigger incident response
   - Page on-call engineer
   - Update status page
   - Rollback if deployment-related

2. **Communication**
   ```
   🚨 INCIDENT: Service outage detected

   Status: Investigating
   Impact: All users unable to access service
   Started: 2024-03-26 14:32 UTC
   Team: Investigating

   Updates: Will provide update in 15 minutes
   ```

3. **Resolution**
   - Identify root cause
   - Implement fix or rollback
   - Verify service restored
   - Post-mortem within 24 hours

### Partial Degradation

1. **Assess Impact**
   - Identify affected functionality
   - Determine user impact
   - Evaluate severity

2. **Decide on Action**
   - If minor: Monitor and fix in next deployment
   - If moderate: Accelerate hotfix
   - If major: Rollback

3. **Communicate**
   - Update team
   - Update status page if user-facing
   - Set expectations for fix timeline

## Deployment Checklist

Use this checklist for every production deployment:

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Staging validated
- [ ] Release notes written
- [ ] Database migrations tested
- [ ] Team notified of deployment
- [ ] Monitoring configured
- [ ] Rollback plan ready

### Deployment
- [ ] Tag created
- [ ] Workflow triggered
- [ ] Approval obtained
- [ ] Deployment completed
- [ ] Health checks passing

### Post-Deployment
- [ ] Application validated
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Uptime monitors green
- [ ] Team notified of success
- [ ] Deployment documented

### If Issues
- [ ] Issue documented
- [ ] Rollback executed (if needed)
- [ ] Root cause identified
- [ ] Hotfix planned
- [ ] Post-mortem scheduled

## Deployment Metrics

Track these metrics for each deployment:

- **Deployment frequency:** How often we deploy
- **Lead time:** Time from commit to production
- **Change failure rate:** % of deployments causing issues
- **Mean time to recovery (MTTR):** Time to recover from failures

**Goals:**
- Deploy at least daily to staging
- Deploy to production multiple times per week
- Change failure rate <5%
- MTTR <30 minutes

## Resources

- [CI/CD Workflows](./workflows.md)
- [Environment Configuration](./environments.md)
- [Infrastructure Monitoring](../infrastructure/uptime-kuma.md)
- [Incident Response Playbook](#) (TODO: Create this document)
