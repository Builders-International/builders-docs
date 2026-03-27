# Vireo Repository

## Repository Access

### Local Path
```
~/Developer/Vireo
```

**Full Path**: `/Users/elliottgodwin/Developer/Vireo`

### GitHub Repository
- **URL**: https://github.com/Builders-International/Vireo.git
- **Organization**: Builders-International
- **Repository**: Vireo
- **Visibility**: Private

### Remote Configuration
```bash
origin  https://github.com/Builders-International/Vireo.git (fetch)
origin  https://github.com/Builders-International/Vireo.git (push)
```

## Repository Structure

### Main Branch
- **Primary Branch**: `master` (not `main`)
- **Protection**: Direct commits allowed, but production deploys require review

### Repository Organization

```
Vireo/
├── src/                      # Backend NestJS application (24 modules)
│   ├── modules/             # Business logic modules
│   │   ├── agents/          # AI agent system
│   │   ├── auth/            # Authentication & permissions
│   │   ├── crm/             # Contact & organization management
│   │   ├── finance/         # Financial management
│   │   ├── forms/           # Form builder
│   │   ├── events/          # Event management
│   │   ├── tasks/           # Task management
│   │   ├── workflows/       # Workflow automation
│   │   ├── integrations/    # External services
│   │   └── ...              # 15 more modules
│   ├── constants/           # BSI codes and constants
│   ├── types/               # TypeScript type definitions
│   └── main.ts              # Application entry point
├── frontend/                 # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router (89 pages)
│   │   │   ├── (auth)/      # Authentication routes
│   │   │   ├── admin/       # Admin module
│   │   │   ├── crm/         # CRM module
│   │   │   ├── finance/     # Finance module
│   │   │   ├── events/      # Events module
│   │   │   ├── forms/       # Forms module
│   │   │   ├── tasks/       # Tasks module
│   │   │   ├── workflows/   # Workflows module
│   │   │   ├── sku/         # BSI management
│   │   │   └── dashboard/   # Dashboards
│   │   ├── components/      # React component library
│   │   ├── lib/             # Utilities and hooks
│   │   └── styles/          # Design tokens and CSS
│   ├── public/              # Static assets
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # 1,578-line database schema (60+ models)
│   └── migrations/          # Migration history
├── docs/                     # Comprehensive documentation (36 files)
│   ├── README.md            # Documentation index
│   ├── roadmap.md           # Single source of truth roadmap
│   ├── status/              # Current scope and status
│   ├── architecture/        # Architecture decisions
│   │   ├── mvp.md
│   │   ├── permissions.md
│   │   └── integrations.md
│   ├── frontend/            # Frontend documentation (21 files)
│   │   ├── FRONTEND_DEVELOPMENT_GUIDE.md
│   │   ├── style_guide.md
│   │   ├── marketing_refresh_plan.md
│   │   ├── admin_users_plan.md
│   │   ├── ui_revamp_plan.md
│   │   ├── crm_form_builder_phase3.md
│   │   ├── elt_dashboard.md
│   │   ├── finance_approvals.md
│   │   └── ...
│   ├── finance/             # Financial documentation
│   ├── crm/                 # CRM documentation
│   ├── api/                 # API documentation
│   ├── deployment/          # Deployment guides
│   ├── ops/                 # Operations runbooks
│   ├── requirements/        # Requirements documentation
│   ├── notes/               # Meeting notes
│   ├── BSI_DOCUMENTATION.md # Complete BSI specification
│   ├── SYSTEM_ARCHITECTURE_COMPLETE.md
│   ├── INTEGRATION_COMPLETE.md
│   ├── PRODUCTION_READINESS_PLAN.md
│   ├── phase1_deploy_checklist.md
│   └── phase1_deploy_runbook.md
├── scripts/                  # Utility scripts
├── tests/                    # Test suites (30 test files)
├── config/                   # Configuration files
├── .github/                  # GitHub workflows
├── vireo-docs-mirror/        # Documentation mirror
├── vireo-docs-site/          # Documentation website
├── CLAUDE.md                 # 45KB project context (living document)
├── CODEX.md                  # 27KB technical brief
├── NEXT_STEPS.md             # Current priorities
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript config
├── jest.config.js            # Jest test config
├── Dockerfile                # Backend Docker config
├── cloudbuild.yaml           # Backend Cloud Build
├── Makefile                  # Development commands
├── migrate.sh                # Database migration script
└── .env.example              # Environment template
```

## Repository Stats

### Size & Activity
- **Commits (2025)**: 258 commits (through March 27, 2026)
- **Contributors**: Multiple developers
- **Primary Language**: TypeScript
- **Lines of Code**: 50,000+ (estimated)
- **Documentation Files**: 36 markdown files in docs/

### Recent Activity (Last 15 Commits)
```
5946e3b updated missing docusaurus paths for documentation website
3f169f6 Moved vireo project documentation to visible and tracked path
0ea4ab4 added documentation website and test suite
fcd788a updated ai insights rail
7c62dfa various tap fixes and added ai insights tab bar
ae1fac6 lotso fixes, primarily from gapped roadmap
6bf6632 Cleaned up UI bugs from Codex
e4dc316 cleaned up small UI components
e827a01 type errors in BSI sections
4d8a3fc keep on fixing type errors
48070c9 keep working through TS errors
d41151e fixing vireo-api type errors
c1dff56 Began implementing agentfield for backend services
ed61c59 added GTM code
d8aff0d Add VireoGlassLogo.png file to repository
```

## Key Documentation Files

### Essential Reading

#### CLAUDE.md (45KB)
- **Purpose**: Living project context and history
- **Updated**: Continuously throughout development
- **Contents**:
  - Project scope and workflow
  - Development phases
  - Technical decisions and rationale
  - Authentication fixes (Firebase issues)
  - Dashboard re-rendering solutions
  - 401 ping-pong render loop fixes
  - Degraded mode implementation
  - BSI implementation notes

**Location**: `/Vireo/CLAUDE.md`

#### roadmap.md
- **Purpose**: Single source of truth for project roadmap
- **Last Updated**: December 2025
- **Contents**:
  - Status snapshot (Phase 1 complete, Phase 2 in deployment)
  - Near-term priority track
  - Phase breakdown
  - Work in flight
  - Dependencies and notes

**Location**: `/Vireo/docs/roadmap.md`

#### BSI_DOCUMENTATION.md
- **Purpose**: Complete Builders Service Identifier specification
- **Version**: 2.0
- **Last Updated**: December 26, 2024
- **Contents**:
  - BSI structure and format (REGION-COUNTRY-PROJECT-TEAM-EVENT-SUFFIX)
  - Component definitions
  - Relationships and use cases
  - Technical implementation details
  - Examples and patterns

**Location**: `/Vireo/docs/BSI_DOCUMENTATION.md`

#### SYSTEM_ARCHITECTURE_COMPLETE.md
- **Purpose**: Comprehensive system architecture documentation
- **Contents**:
  - Executive summary
  - High-level architecture diagrams
  - Module architecture (24 modules)
  - Data architecture (60+ models)
  - Database schema documentation
  - API endpoints
  - Supporting services

**Location**: `/Vireo/docs/SYSTEM_ARCHITECTURE_COMPLETE.md`

#### Frontend Documentation (docs/frontend/)

**FRONTEND_DEVELOPMENT_GUIDE.md**
- Component patterns and best practices
- State management guidelines
- API integration patterns
- Design system usage

**style_guide.md**
- Design tokens and color system
- Typography scale
- Spacing and layout
- Component styling

**marketing_refresh_plan.md** (Nov 5, 2025)
- Goals: Align with Gotham visual system
- Action items: Audit pages, design updates, content refresh
- Owners and timeline

**admin_users_plan.md** (Phase 3)
- Admin user directory implementation
- `/admin/users` and `/admin/users/[id]` routes
- Invitation flow
- API contracts and state management
- Testing and verification steps

**ui_revamp_plan.md** (Nov 24, 2025)
- Design token system
- Layout shell (app chrome)
- Typography, colors, spacing, radius, shadows, motion
- Accessibility and resilience
- Implementation steps

**Other Frontend Docs**:
- crm_form_builder_phase3.md - CRM form builder development
- crm_interactions.md - Interaction logging
- crm_tags.md - Tag system
- crm_typing.md - TypeScript patterns for CRM
- dashboard_typing.md - Dashboard type definitions
- elt_dashboard.md - ELT dashboard implementation
- finance_approvals.md - Approval workflow
- finance_typing.md - Finance TypeScript patterns
- forms_sku_typing.md - Form and SKU types
- plaid_bank_connections.md - Plaid integration
- module_theming.md - Module-specific theming

**Location**: `/Vireo/docs/frontend/`

### Deployment Documentation

**phase1_deploy_checklist.md**
- Pre-deployment verification
- Migration steps
- Environment variables
- Smoke tests
- Rollback procedures

**phase1_deploy_runbook.md**
- Exact deployment commands
- Sequencing requirements
- Verification steps
- Monitoring and alerting

**Location**: `/Vireo/docs/`

### Technical Documentation

**docs/architecture/**
- `mvp.md` - MVP architecture decisions and rationale
- `permissions.md` - RBAC roles, scopes, delegation
- `integrations.md` - External service integrations

**docs/api/**
- API endpoint documentation
- Request/response formats
- Authentication patterns

**docs/finance/**
- Chart of Accounts summary
- Normalized CoA JSON
- Financial data structures

**docs/requirements/**
- Meeting notes synthesis
- Clarifying questions (Round 1 & 2)
- Consolidated responses
- SKU specification

**Location**: `/Vireo/docs/`

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for queues)
- Google Cloud SDK (for deployment)

### Getting Started

```bash
# Clone repository
git clone https://github.com/Builders-International/Vireo.git
cd Vireo

# Backend setup
npm ci
npx prisma generate
npx prisma migrate dev
npm run dev  # Runs on port 3000

# Frontend setup (separate terminal)
cd frontend
npm ci
npm run dev  # Runs on port 3001
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure database URL
3. Add Firebase credentials
4. Set Stripe keys (test mode)
5. Configure SMTP for emails

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name description

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

### Running Tests
```bash
# Backend tests
npm run test

# Backend tests with coverage
npm run test:ci

# Frontend type check
cd frontend && npm run type-check

# Frontend build test
cd frontend && npm run build
```

## Deployment

### Google Cloud Platform

**Backend Service**: `vireo-api`
- Cloud Run service
- Region: us-central1
- Auto-scaling: 0-100 instances
- Memory: 512MB
- CPU: 1

**Frontend Service**: `vireo-frontend`
- Cloud Run service
- Region: us-central1
- Auto-scaling: 0-50 instances
- Memory: 256MB
- CPU: 1

**Database**: Cloud SQL PostgreSQL
- Instance: `vireo-db`
- Private IP networking
- Automated backups
- High availability

**Storage**: Cloud Storage
- Receipts bucket
- Uploads bucket
- Exports bucket

### CI/CD Pipeline

**Trigger**: Push to `master` branch

**Backend Pipeline** (cloudbuild.yaml):
1. Install dependencies
2. Run tests (`npm run test:ci`)
3. Build TypeScript (`npm run build`)
4. Build Docker image
5. Push to Container Registry
6. Deploy to Cloud Run
7. Run database migrations

**Frontend Pipeline** (frontend/cloudbuild-frontend.yaml):
1. Install dependencies
2. Type check (`npm run type-check`)
3. Build Next.js (`npm run build`)
4. Build Docker image
5. Push to Container Registry
6. Deploy to Cloud Run

### Manual Deployment

```bash
# Backend
make build
make deploy

# Frontend
cd frontend
npm run build
gcloud run deploy vireo-frontend \
  --image gcr.io/vireo-dev/vireo-frontend:latest \
  --region us-central1 \
  --platform managed
```

## Project Management

### Documentation Location Strategy

**Internal Documentation** (within repository):
- `/docs/` - All living documentation
- `CLAUDE.md` - Project context and history
- `NEXT_STEPS.md` - Current priorities
- `README.md` - (Note: No README in root, see docs/README.md)

**External Documentation Sites**:
- `vireo-docs-mirror/` - Documentation mirror repository
- `vireo-docs-site/` - Docusaurus documentation website

**Frontend Plan Documents**:
- All stored in `/docs/frontend/`
- 21 markdown files covering development guides, plans, and specifications
- Includes marketing refresh, admin users, UI revamp, and module-specific guides

### Issue Tracking
- GitHub Issues (private repository)
- Milestone tracking for phases
- Label system for module organization

### Collaboration
- Google Workspace for organizational access
- GitHub for code reviews
- Cloud Build for automated testing
- Staging environment for QA

## Notable Repository Features

### Comprehensive Documentation
- **36 markdown files** in `/docs/` directory
- **21 frontend-specific guides** in `/docs/frontend/`
- **45KB CLAUDE.md** with complete project history
- **27KB CODEX.md** technical brief
- Architecture, API, finance, CRM, deployment, operations guides

### Multi-Site Architecture
- **Backend API** (NestJS) in root directory
- **Frontend App** (Next.js) in `/frontend/` subdirectory
- **Documentation Site** (Docusaurus) in `/vireo-docs-site/`
- Separate Dockerfiles and build configs for each

### Large-Scale Schema
- **1,578-line Prisma schema** defining entire data model
- **60+ database models** covering all business domains
- Migration history preserved in `/prisma/migrations/`

### Testing Infrastructure
- **30 test files** in `/tests/` directory
- Jest configuration for unit tests
- Integration tests for API endpoints
- Frontend type checking

### Development Tools
- **Makefile** for common development tasks
- **Migration scripts** for database updates
- **Import utilities** for legacy data
- **Seed scripts** for development data

## Access & Permissions

### GitHub Access
- Requires Builders-International organization membership
- Private repository access
- Collaborator permissions for external contributors

### Google Cloud Access
- Project: `vireo-dev` (staging)
- Project: `vireo-prod` (production)
- IAM roles for deployment
- Secret Manager access for credentials

### Firebase Access
- Project: `vireo-dev`
- Google OAuth configuration
- Domain-restricted access (buildersintl.com)

## Support & Resources

### For Developers
1. Start with `/docs/README.md` for documentation index
2. Review `CLAUDE.md` for project context
3. Check `/docs/frontend/FRONTEND_DEVELOPMENT_GUIDE.md` for patterns
4. Reference `/docs/architecture/mvp.md` for architecture decisions
5. Follow `/docs/phase1_deploy_runbook.md` for deployment

### For Administrators
1. Review `/docs/roadmap.md` for current status
2. Check `/docs/PRODUCTION_READINESS_PLAN.md`
3. Reference `/docs/ops/` for operational runbooks
4. Monitor Cloud Run services and Cloud SQL

### For Project Managers
1. Track progress via `/docs/roadmap.md`
2. Review status in `/docs/status/current_scope.md`
3. Reference `/docs/requirements/` for specifications
4. Check `NEXT_STEPS.md` for current priorities

## Related Resources

### Documentation Website
- **Repository**: vireo-docs-site/
- **Framework**: Docusaurus
- **Purpose**: Public-facing documentation and guides
- **Build**: npm run build && npm run serve

### Architecture Documentation
- See [architecture.md](./architecture.md) for technical deep dive
- Database schema, API endpoints, and system design

### Project Overview
- See [overview.md](./overview.md) for high-level introduction
- Features, tech stack, and business context

### Next Steps
- See [next-steps.md](./next-steps.md) for current roadmap
- Known issues, planned features, and technical debt

## Summary

The Vireo repository is a comprehensive, well-documented enterprise application with:

- **Mature Codebase**: 258 commits in 2025, 50,000+ lines of TypeScript
- **Extensive Documentation**: 36 markdown files covering all aspects
- **Production-Ready**: Phase 1 complete, Phase 2 in deployment
- **Modern Stack**: NestJS, Next.js 14, PostgreSQL, Google Cloud
- **Active Development**: Continuous commits and improvements

The repository structure supports both rapid development and long-term maintainability with clear module boundaries, comprehensive testing, and detailed documentation at every level.
