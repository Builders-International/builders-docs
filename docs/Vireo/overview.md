# Vireo Overview

## What is Vireo?

Vireo is a comprehensive enterprise resource planning (ERP) system built specifically for Builders International. It serves as a unified platform that replaces multiple legacy systems (DonorSnap, Sage 50, and JotForm) with an integrated, modern solution for managing all aspects of the organization's operations.

**Project Name**: Vireo
**Description**: Enterprise CRM and financial management platform
**Status**: Phase 1 complete, Phase 2 in deployment
**Primary Users**: 42+ staff members across departments
**Environment**: Production + Staging on Google Cloud Platform

## Problem Statement

Before Vireo, Builders International operated with three disconnected systems:

- **DonorSnap** - Legacy CRM with 11,000+ contacts but limited customization
- **Sage 50** - Desktop-based accounting software with poor integration capabilities
- **JotForm** - Form builder with no connection to CRM or financial systems

This fragmentation led to:
- Data silos preventing comprehensive reporting
- Manual data entry and reconciliation between systems
- Limited automation capabilities
- Poor visibility into donor relationships and financial performance
- Difficulty tracking projects, teams, and events holistically
- No mobile access or modern user experience

## Solution: Vireo Platform

Vireo unifies all business operations into a single, cloud-native platform with:

### Integrated Modules
- **CRM** - Complete contact and organization management
- **Finance** - Double-entry accounting, budgets, invoices
- **Events** - Registration, payments, communications
- **Forms** - Built-in form builder with workflows
- **Tasks** - Project management and collaboration
- **Reporting** - Custom reports and dashboards
- **Workflows** - Automation across all modules
- **AI Insights** - Intelligent recommendations and analytics

### Core Innovation: BSI System

The **Builders Service Identifier (BSI)** is Vireo's central innovation - a universal identifier that connects everything:

```
Format: REGION-COUNTRY-PROJECT-TEAM-EVENT-SUFFIX
Example: NA-USA-12345-67890-11111-1
```

The BSI enables:
- Unified tracking across all modules
- Comprehensive financial rollups by region/country/project
- Event-specific donor attribution
- Team-based giving analysis
- Hierarchical reporting structures

## Key Features

### CRM Capabilities
- **Contact Management** - 6,806+ migrated contacts with complete history
- **Organization Hierarchy** - 3-level organizational structures
- **Advanced Search** - 20+ filter fields with intelligent matching
- **Deduplication** - Fuzzy matching with merge workflows
- **Interaction Logging** - Email, calls, meetings, WhatsApp tracking
- **Contact Segmentation** - Dynamic segments with auto-refresh
- **IVI Identity** - Unique identity preservation from legacy systems

### Financial Management
- **General Ledger** - Double-entry accounting with complete audit trails
- **Chart of Accounts** - Hierarchical account structure from Sage 50
- **Journal Entries** - Manual and automated entry creation
- **Accounts Receivable** - Invoice generation and payment tracking
- **Accounts Payable** - Bill management with approval workflows
- **Budget Management** - Line-item budgets with variance analysis
- **BSI Financial Rollups** - Project/team/event giving aggregations

### Event Management
- **Event Registration** - Online registration with pricing tiers
- **Payment Processing** - Stripe integration for donations and fees
- **Communications** - Email campaigns and notifications
- **Form Builder** - Drag-and-drop custom form creation
- **Attendee Management** - Check-in, badges, meal tracking
- **Pledge Tracking** - Event-specific pledge capture and fulfillment

### Workflow Automation
- **Visual Builder** - Node-based workflow designer
- **Triggers** - Time-based, webhook, and event-driven triggers
- **Actions** - Email, SMS, data updates, API calls
- **Connectors** - Google Sheets, Slack, file storage integrations
- **Conditional Logic** - Complex branching and decision trees
- **Failure Handling** - Exponential backoff with notifications

### Task Management
- **Kanban Boards** - Visual project management
- **Time Tracking** - Billable hours with approval flows
- **Team Collaboration** - Comments, mentions, attachments
- **Task Assignment** - Multi-assignee with status tracking
- **Subtasks** - Hierarchical task breakdown
- **Due Dates** - Deadline tracking with notifications

### Reporting & Analytics
- **Report Builder** - Custom queries across all modules
- **Dashboard Widgets** - Real-time KPI tracking
- **Export Formats** - CSV, Excel, PDF generation
- **Scheduled Reports** - Automated delivery to stakeholders
- **ELT Dashboard** - Executive leadership tracking
- **Financial Reports** - P&L, balance sheet, budget variance

## Technology Stack

### Backend
- **Language**: TypeScript
- **Framework**: NestJS 11.0
- **Database**: PostgreSQL via Prisma ORM 6.18
- **Authentication**: Firebase + Google OAuth 2.0
- **API Style**: RESTful with 25+ controllers
- **Queue System**: BullMQ with Redis
- **File Storage**: Google Cloud Storage
- **Email**: Nodemailer with SMTP

### Frontend
- **Framework**: Next.js 14.2 (React 18.2)
- **Styling**: Tailwind CSS 3.4 + Custom Design Tokens
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom library with Lucide icons
- **Drag & Drop**: @dnd-kit for kanban and builders
- **Charts**: Recharts + @visx for visualizations
- **Tables**: TanStack Table with server pagination

### Infrastructure
- **Cloud**: Google Cloud Platform (GCP)
- **Container Runtime**: Cloud Run (serverless containers)
- **Database**: Cloud SQL (PostgreSQL)
- **Storage**: Cloud Storage buckets
- **Secrets**: Secret Manager
- **CI/CD**: Cloud Build with GitHub integration
- **Monitoring**: Cloud Logging + Cloud Trace

### Integrations
- **Stripe** - Payment processing and webhooks
- **Google Workspace** - OAuth, Gmail, Drive, Sheets
- **Plaid** - Bank account connections (planned)
- **GoMethod** - Donor wealth screening
- **Otter.ai** - Meeting transcription
- **Sage 50** - CSV import/export
- **WhatsApp** - Messaging via Twilio/Meta

## Target Users

### Primary User Roles

1. **Executive Leadership Team (ELT)**
   - Strategic KPI tracking
   - Financial oversight
   - Organization-wide reporting
   - Dashboard customization

2. **Finance Department**
   - General ledger management
   - Invoice and bill processing
   - Budget creation and tracking
   - Financial reporting
   - Reconciliation

3. **Development Department**
   - Donor relationship management
   - Gift processing and tracking
   - Campaign management
   - Interaction logging
   - Major donor portfolios

4. **Events Department**
   - Event planning and registration
   - Communications management
   - Attendee tracking
   - Pledge collection
   - Post-event reporting

5. **Projects & Teams**
   - Project management
   - Team coordination
   - Task tracking
   - Time logging
   - Resource allocation

6. **Content Managers**
   - Form creation and publishing
   - Content updates
   - Media management
   - Communication templates

7. **Contributors (Limited Access)**
   - Task completion
   - Time entry
   - Contact updates
   - Report viewing

### Permission Model

Vireo uses Google Workspace groups for role-based access control (RBAC):

- **Super Admins** - Full system access and configuration
- **Content Managers** - Module configuration and content
- **Finance Users** - Financial data and reporting
- **CRM Users** - Contact and organization management
- **Event Coordinators** - Event and registration management
- **Contributors** - Limited read and task access

Permissions are enforced at:
- Module level (CRM, Finance, Events, etc.)
- Feature level (create, edit, delete, approve)
- Field level (sensitive data like salary, wealth)
- Record level (assigned contacts, department filters)

## Current Status

### Phase 1 - Complete (2025-09-17)
- Core modules implemented (CRM, Finance, Events, Forms, Tasks)
- Data migration from legacy systems (6,806 contacts, CoA)
- Authentication and permission system with Google OAuth
- Dashboard re-rendering and chunk loading fixes
- Firebase authentication "missing initial state" resolved
- Marketing refresh and UI polish

### Phase 2 - In Deployment (2025-12 to 2026-03)
- BSI-linked project giving rollups
- CRM Projects UI (list/detail with BSI integration)
- Workflow nodes for contact/org selection
- Report templates and run_report endpoint
- AI insights foundations
- Contact outreach logging (email, WhatsApp)
- IVI identity migration (legacy DonorSnap IPK)
- Tag overlays (CCP, TMM, PB, contact types)
- Retained donor tracking
- Report Builder with CSV export

**Current Sprint Focus** (March 2026):
- Workflow webhook authentication
- Contact email-to-interaction logging
- WhatsApp action with delivery status
- Report template configurations
- BSI backfill migration
- Deployment verification and smoke tests

### Phase 3 - Planned
- Profile Builder & Wealth Screener with PB ratings
- TMM (Touch Management Model) alignment
- CCP (Custom Communication Plan) automation
- AI-powered decision assistance
- Enhanced donor analytics

### Phase 4 - Future
- Mobile app (iOS/Android) with read-first CRM/Finance
- Sage 50 full bidirectional sync
- Performance optimization and security hardening
- RBAC regression testing suite
- Production runbooks and monitoring

## Data Migration Accomplishments

### Contact Migration
- **6,806 contacts** successfully imported from DonorSnap
- Complete interaction history preserved
- Custom fields mapped to JSON structure
- IVI (legacy IPK) identities preserved
- Address normalization and geocoding
- Tag migration (CCP, TMM, missionary status)

### Financial Data
- Full Chart of Accounts from Sage 50
- Historical journal entries
- Budget baselines
- Vendor and customer records
- Payment history

### Forms & Events
- JotForm template conversions
- Historical registration data
- Payment records linked to Stripe
- Event attendance records

## Architecture Highlights

For detailed technical architecture, see [architecture.md](./architecture.md).

### Modular Monolith Design
- Clean module boundaries for future microservices
- Shared database with logical separation
- Domain-driven design principles
- Event-driven communication patterns

### Data Architecture
- **1,578-line Prisma schema** defining 60+ models
- Referential integrity with foreign keys
- Optimized indexes for query performance
- JSON fields for flexible metadata
- Audit logging at all levels

### Security Architecture
- Google OAuth 2.0 with domain restriction
- Firebase token verification
- Role-based access control (RBAC)
- Field-level permissions
- Audit trails for all mutations
- Secrets in Google Secret Manager

### Scalability Design
- Stateless API containers (Cloud Run auto-scaling)
- Connection pooling with Prisma
- Redis caching for hot data
- Background job processing with BullMQ
- Database query optimization
- CDN for static assets

## Development Workflow

### Local Development
```bash
# Backend
npm ci
npx prisma generate
npx prisma migrate dev
npm run dev  # Runs on port 3000

# Frontend
cd frontend
npm ci
npm run dev  # Runs on port 3001
```

### Deployment Pipeline
1. Code pushed to GitHub main branch
2. Cloud Build triggers automatically
3. Backend: Dockerfile build → Cloud Run deploy
4. Frontend: Next.js build → Cloud Run deploy
5. Automatic database migrations on deploy
6. Smoke tests verify endpoints

### Testing Strategy
- TypeScript type checking across codebase
- Jest unit tests for services
- API integration tests
- Frontend component tests
- End-to-end smoke tests
- Manual QA on staging environment

## Documentation Resources

The Vireo repository includes extensive documentation:

- **docs/roadmap.md** - Single source of truth for project roadmap
- **docs/README.md** - Documentation index and overview
- **docs/status/current_scope.md** - Feature completion status
- **docs/architecture/mvp.md** - MVP architecture decisions
- **docs/architecture/permissions.md** - Roles and access control
- **docs/BSI_DOCUMENTATION.md** - Complete BSI specification
- **docs/frontend/** - Frontend development guides (21 files)
  - marketing_refresh_plan.md
  - admin_users_plan.md
  - ui_revamp_plan.md
  - crm_form_builder_phase3.md
  - elt_dashboard.md
  - And 16+ more specialized guides
- **docs/phase1_deploy_checklist.md** - Deployment verification
- **docs/phase1_deploy_runbook.md** - Operational procedures

### Frontend Documentation Highlights
- **FRONTEND_DEVELOPMENT_GUIDE.md** - Component patterns and best practices
- **style_guide.md** - Design system and token usage
- **module_theming.md** - Module-specific theming approach
- **finance_typing.md** - TypeScript patterns for finance module
- **crm_typing.md** - CRM type definitions and patterns
- **dashboard_typing.md** - Dashboard widget types

## Success Metrics

### System Performance
- **Uptime**: 99%+ SLA (excluding maintenance)
- **Response Time**: < 500ms for API endpoints
- **Page Load**: < 2s for dashboard pages
- **Database Queries**: < 100ms for common operations

### User Adoption
- **42 active users** across departments
- **6,806 contacts** actively managed
- **258 commits** in 2025 (through March 27)
- **Daily active usage** across all modules

### Business Impact
- **Cost Reduction**: Eliminated 3 legacy system subscriptions
- **Time Savings**: Automated workflows reduce manual tasks
- **Data Quality**: Single source of truth reduces errors
- **Reporting Speed**: Real-time dashboards vs. manual reports
- **Mobile Access**: First-time mobile capabilities

## Future Vision

### Multi-Tenant SaaS
Vireo's architecture is designed for future multi-tenancy:
- Tenant isolation at database level
- Organization-specific branding
- Usage-based pricing tiers
- Self-service onboarding
- Marketplace for integrations

### AI & Automation
- AI-assisted email drafting
- Predictive analytics for donor engagement
- Automated data entry and enrichment
- Intelligent workflow suggestions
- Natural language report queries

### Mobile Experience
- Native iOS and Android apps
- Offline-first data sync
- Mobile optimized CRM views
- Push notifications for tasks
- Mobile expense capture with OCR

### Advanced Analytics
- Machine learning for donor retention
- Wealth screening integration
- Portfolio optimization
- Predictive giving forecasts
- Cohort analysis and segmentation

## Getting Started

To explore Vireo:

1. **Repository**: See [repo-link.md](./repo-link.md) for access details
2. **Architecture**: Review [architecture.md](./architecture.md) for technical depth
3. **Next Steps**: See [next-steps.md](./next-steps.md) for current priorities

## Summary

Vireo represents a complete reimagining of nonprofit operations management. By replacing three legacy systems with a unified, modern platform, it provides:

- **Unified Data Model** - BSI connects everything
- **Modern User Experience** - Cloud-native with mobile access
- **Automation Capabilities** - Workflows reduce manual tasks
- **Scalable Architecture** - Built for growth and multi-tenancy
- **Cost Efficiency** - $10/month infrastructure with auto-scaling

With Phase 1 complete and Phase 2 in deployment, Vireo is actively transforming Builders International's operations and setting the foundation for future SaaS expansion.
