# CI/CD Workflows

This document contains reusable GitHub Actions workflow templates adapted from the egi-ci:cd repository for Builders International projects.

## Workflow Files

All projects should include these workflow files in `.github/workflows/`:

- `ci-pr.yml` - Runs on pull requests
- `ci-main.yml` - Runs on merge to main
- `release.yml` - Handles production releases

## PR CI Workflow (ci-pr.yml)

Runs comprehensive checks on every pull request to ensure code quality before merging.

### Template

```yaml
name: CI - Pull Request

on:
  pull_request:
    branches: [main, master, develop]
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.gitignore'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/
          retention-days: 7

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Adapting for Your Project

**For Python projects:**
```yaml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.11'

- name: Install dependencies
  run: |
    pip install -r requirements.txt
    pip install -r requirements-dev.txt

- name: Run tests
  run: pytest --cov=src tests/
```

**For Go projects:**
```yaml
- name: Set up Go
  uses: actions/setup-go@v4
  with:
    go-version: '1.21'

- name: Run tests
  run: go test -v -race -coverprofile=coverage.out ./...
```

## Main Branch CI Workflow (ci-main.yml)

Runs after merge to main, deploys to staging environment.

### Template

```yaml
name: CI - Main Branch

on:
  push:
    branches: [main, master]
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.gitignore'

jobs:
  test-and-build:
    name: Test & Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: production-build
          path: build/

  deploy-staging:
    name: Deploy to Staging
    needs: test-and-build
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: production-build
          path: build/

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Run smoke tests
        run: |
          npm run test:e2e -- --baseUrl=https://staging.example.com

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment complete'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Digital Ocean Deployment

For backend services hosted on DO droplets:

```yaml
deploy-staging:
  name: Deploy to Staging (DO)
  needs: test-and-build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: |
        docker build -t registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }} .

    - name: Log in to DO Container Registry
      uses: docker/login-action@v2
      with:
        registry: registry.digitalocean.com
        username: ${{ secrets.DO_REGISTRY_TOKEN }}
        password: ${{ secrets.DO_REGISTRY_TOKEN }}

    - name: Push image
      run: |
        docker push registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}

    - name: Deploy to droplet
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USERNAME }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          docker pull registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}
          docker stop app || true
          docker rm app || true
          docker run -d \
            --name app \
            -p 3000:3000 \
            --env-file /opt/app/.env.staging \
            registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}

    - name: Health check
      run: |
        sleep 10
        curl -f https://staging.example.com/health || exit 1
```

## Release Workflow (release.yml)

Handles production deployments with manual approval.

### Template

```yaml
name: Release to Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (e.g., v1.2.3)'
        required: true
        type: string

jobs:
  create-release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Git tag
        run: |
          git tag ${{ inputs.version }}
          git push origin ${{ inputs.version }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ inputs.version }}
          release_name: Release ${{ inputs.version }}
          draft: false
          prerelease: false

  deploy-production:
    name: Deploy to Production
    needs: create-release
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.version }}

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Wait for deployment
        run: sleep 30

      - name: Health check
        run: |
          curl -f https://example.com/health || exit 1

      - name: Smoke tests
        run: npm run test:smoke -- --baseUrl=https://example.com

      - name: Update Uptime Kuma
        run: |
          curl -X POST https://status.buildersintl.org/api/push/${{ secrets.UPTIME_KUMA_PUSH_KEY }}?status=up&msg=Deployed%20${{ inputs.version }}

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment complete: ${{ inputs.version }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Common Actions

### Cache Dependencies

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Conditional Job Execution

```yaml
jobs:
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      # deployment steps
```

### Matrix Testing

```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20, 21]
      os: [ubuntu-latest, macos-latest]
  runs-on: ${{ matrix.os }}
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

## Required Secrets

Configure these secrets in GitHub repository settings:

### Vercel Deployments
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Digital Ocean Deployments
- `DO_REGISTRY` - DO container registry name
- `DO_REGISTRY_TOKEN` - DO registry access token
- `STAGING_HOST` - Staging server hostname
- `STAGING_USERNAME` - SSH username
- `STAGING_SSH_KEY` - SSH private key
- `PRODUCTION_HOST` - Production server hostname
- `PRODUCTION_USERNAME` - SSH username
- `PRODUCTION_SSH_KEY` - SSH private key

### Monitoring & Notifications
- `UPTIME_KUMA_PUSH_KEY` - Uptime Kuma push monitor key
- `SLACK_WEBHOOK` - Slack webhook URL for notifications
- `SNYK_TOKEN` - Snyk security scanning token

### Optional
- `CODECOV_TOKEN` - Codecov upload token

## Workflow Best Practices

1. **Keep workflows DRY** - Use composite actions for repeated steps
2. **Fail fast** - Run quick checks (lint, typecheck) before slow ones (tests, build)
3. **Parallel jobs** - Run independent jobs concurrently
4. **Cache aggressively** - Cache dependencies, build outputs
5. **Meaningful names** - Clear job and step names
6. **Timeouts** - Set reasonable timeouts to prevent hung jobs
7. **Conditional execution** - Skip unnecessary steps with `if` conditions
8. **Secure secrets** - Never log secrets, use GitHub Secrets
9. **Document changes** - Comment complex workflow logic
10. **Test workflows** - Test in feature branches before merging

## Troubleshooting

### Workflow Not Triggering

- Check `on` triggers match your branch name
- Verify `paths-ignore` isn't excluding your changes
- Ensure workflow file is in `.github/workflows/`

### Job Failing

- Check job logs in GitHub Actions tab
- Run steps locally to reproduce
- Verify secrets are set correctly
- Check for rate limiting or quota issues

### Slow Workflows

- Enable caching for dependencies
- Run jobs in parallel
- Use matrix strategy for tests
- Consider self-hosted runners for better performance

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Marketplace Actions](https://github.com/marketplace?type=actions)
- [EGI CI/CD Repo](~/Developer/egi-ci:cd/) - Source templates
