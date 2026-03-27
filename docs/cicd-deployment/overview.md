# CI/CD & Deployment Overview

## Philosophy

Builders International follows a GitOps-based continuous integration and deployment philosophy. All changes go through automated testing, review, and deployment pipelines to ensure quality and reliability.

## Principles

1. **Everything as Code:** Infrastructure, configuration, and deployment defined in Git
2. **Automated Testing:** Every change runs through automated tests
3. **Trunk-Based Development:** Short-lived feature branches, frequent integration
4. **Progressive Delivery:** Gradual rollouts with feature flags
5. **Immutable Deployments:** No manual changes to production
6. **Observability:** Every deployment is monitored and traceable

## Workflow Overview

```
Developer → Feature Branch → PR → CI Tests → Code Review → Merge → CD Pipeline → Deploy
```

### Development Flow

1. **Create feature branch** from `main`
2. **Develop locally** with frequent commits
3. **Push branch** to trigger CI checks
4. **Open Pull Request** when ready for review
5. **CI runs tests** automatically on PR
6. **Code review** by team members
7. **Merge to main** after approval
8. **CD pipeline** deploys to staging automatically
9. **Manual approval** for production deployment

## Environments

### Development
- **Purpose:** Local development and testing
- **Access:** All developers
- **Data:** Synthetic/test data only
- **Deployment:** Manual or on-demand

### Staging
- **Purpose:** Pre-production testing
- **Access:** Team + stakeholders
- **Data:** Sanitized production-like data
- **Deployment:** Automatic on merge to `main`

### Production
- **Purpose:** Live user-facing services
- **Access:** Limited (platform team)
- **Data:** Real user data
- **Deployment:** Manual approval required

## CI/CD Tools

- **GitHub Actions:** Primary CI/CD platform
- **Docker:** Containerization for consistent deployments
- **Vercel:** Hosting for web applications (primary)
- **Digital Ocean:** Droplets for backend services
- **Cloudflare:** CDN and DNS (see [Infrastructure docs](../infrastructure/cloudflare.md))

## Key Workflows

### CI Workflows

1. **PR Checks** - Run on every pull request
   - Lint code
   - Run tests
   - Build artifacts
   - Check types
   - Security scans

2. **Main Branch** - Run on merge to main
   - All PR checks
   - Build production images
   - Deploy to staging
   - Integration tests

### CD Workflows

1. **Staging Deployment** - Automatic
   - Triggered on merge to main
   - Deploy to staging environment
   - Run smoke tests
   - Notify team

2. **Production Deployment** - Manual approval
   - Triggered by release tag or manual workflow
   - Require approval from platform team
   - Blue-green deployment pattern
   - Health checks
   - Rollback capability

## Deployment Strategies

### Web Applications (Vercel)

- Zero-downtime deployments
- Automatic preview deployments for PRs
- Instant rollbacks
- Edge network distribution

### Backend Services (Digital Ocean)

- Docker-based deployments
- Blue-green deployment pattern
- Health check validation
- Gradual traffic shifting

## Security

### Secrets Management

- **Never commit secrets** to Git
- Store in GitHub Secrets
- Rotate regularly
- Use environment-specific secrets

### Access Control

- **Principle of least privilege**
- Separate read/write permissions
- Audit deployment access
- Require 2FA for production access

## Monitoring & Observability

Every deployment includes:
- **Health checks** to verify service is running
- **Uptime monitoring** via [Uptime Kuma](../infrastructure/uptime-kuma.md)
- **Error tracking** for issues
- **Analytics** via [PostHog](../infrastructure/posthog.md)
- **Logs** for debugging

## Best Practices

1. **Keep builds fast** (under 5 minutes for CI)
2. **Test locally first** before pushing
3. **Small, frequent commits** easier to review and revert
4. **Meaningful commit messages** describe why, not just what
5. **Review your own PR** before requesting review
6. **Fix broken builds immediately** don't block others
7. **Monitor after deployment** watch for errors
8. **Document deployment steps** in runbooks
9. **Practice rollbacks** know how to revert quickly
10. **Automate everything** reduce human error

## Getting Help

- **CI/CD issues:** Check workflow logs in GitHub Actions
- **Deployment failures:** Review deployment logs and health checks
- **Access requests:** Contact platform team
- **Questions:** Ask in #engineering Slack channel

## Related Documentation

- [Workflows](./workflows.md) - Detailed workflow configurations
- [Deployment Process](./deployment-process.md) - Step-by-step deployment procedures
- [Environments](./environments.md) - Environment-specific configuration
- [Infrastructure](../infrastructure/overview.md) - Infrastructure tooling
