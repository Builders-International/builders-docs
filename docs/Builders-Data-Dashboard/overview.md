# Builders Data Dashboard - Overview

## Project Name

**Project Life Central** (formerly Builders Data Dashboard)

## Purpose

Project Life Central is an internal operations web application for Builders International that centralizes and automates project registry and finance data management. The application consolidates data from multiple disparate sources into a single, authoritative database with real-time synchronization capabilities.

## Problem Statement

Before Project Life Central, Builders International's project and financial data was fragmented across multiple systems:

1. **Project Life Dashboard** - A Google Sheet containing project registry information
2. **Individual FPD Workbooks** - Per-project Google Sheets with detailed finance tracking (145+ separate workbooks)
3. **Sage Accounting** - Field cost and disbursement reports
4. **DonorSnap** - Faith promise and pledge data

This fragmentation led to several critical challenges:

- **Data Inconsistency** - Manual updates across multiple systems created data drift
- **Limited Visibility** - No single source of truth for project status and finances
- **Manual Reconciliation** - Finance teams manually compared values between systems
- **Staleness** - No automated alerts when data became outdated
- **Access Barriers** - Data locked in spreadsheets with no API access
- **Formula Mismatches** - Spreadsheet formulas occasionally produced incorrect calculations
- **Poor User Experience** - No visual dashboard or map interface for project exploration

## Solution

Project Life Central solves these problems by:

1. **Automated Sync** - API endpoints pull data from Google Sheets on-demand or via scheduled cron jobs
2. **Centralized Database** - Supabase PostgreSQL database serves as the single source of truth
3. **Formula Validation** - Backend recalculates finance formulas and flags mismatches exceeding 1 cent threshold
4. **Audit Trail** - Complete sync history with error logging and row-level tracking
5. **Interactive Map** - MapLibre GL JS map shows all projects with GPS coordinates
6. **Role-Based Access** - NextAuth.js provides Google OAuth with viewer/admin/editor roles
7. **Email Alerts** - Automated notifications for sync failures and stale data warnings
8. **Modern UI** - Dark mode dashboard with Tailwind CSS for efficient data exploration

## Key Features

### Phase 1 (Completed)

- **Database Schema** - 10 normalized PostgreSQL tables with Prisma ORM
- **Google Sheets Integration** - Service account authentication and data extraction
- **Three Primary Sync Endpoints**:
  - Project Dashboard sync (master project registry)
  - FPD Controller sync (registry of 145+ finance workbooks)
  - FPD Workbooks batch sync (iterates through all active workbooks)
- **Data Parsers** - Robust parsing with error collection for malformed data
- **GPS Coordinate Parsing** - Handles decimal format and negative values
- **Formula Validation** - Five finance formulas with mismatch detection:
  - Faith Promise 75% calculation
  - Gross Budget calculation
  - Balance to Raise Subtotal calculation
  - Balance to Raise Total calculation
  - Field Cost Balance calculation
- **Error Logging** - Row-level import errors tracked with raw values
- **Source File Tracking** - Every sync operation logged with metadata
- **Seed Script** - Test data generator for development (3 projects, 3 FPD entries, 2 snapshots)
- **Unit Tests** - Jest tests for GPS parser and formula validators

### Phase 2 (Planned)

- **Authentication System** - NextAuth.js with Google OAuth (tables added, implementation pending)
- **Map Page** - Interactive project map with filtering and detail drawer
- **Projects List** - Searchable/filterable project directory
- **Project Detail Pages** - Individual project views with finance cards
- **Admin Dashboard** - Sync monitoring with staleness warnings
- **File Upload System** - Manual upload for Sage and DonorSnap exports (parsers ready)
- **Webhook Endpoints** - Real-time updates from external systems
- **Scheduled Syncs** - Vercel cron jobs for hourly/daily data refresh
- **Email Alerting** - Resend integration for sync failure notifications
- **Browser Automation** - Playwright scripts for automated Sage/DonorSnap exports (scaffolds in place)

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5.9.3
- **Database**: Supabase PostgreSQL with Prisma ORM 5.22.0
- **Authentication**: NextAuth.js 4.24.13 with @next-auth/prisma-adapter
- **Map Library**: MapLibre GL JS 5.21.0
- **Styling**: Tailwind CSS 4.2.2 with Autoprefixer
- **Google APIs**: googleapis 171.4.0 (Sheets API)
- **Email**: Resend 6.9.4
- **Testing**: Jest 30.3.0 with React Testing Library
- **File Parsing**: xlsx 0.18.5, csv-parse 6.2.1
- **Automation**: Playwright (for Phase 2+ browser automation)
- **Deployment**: Vercel

## Target Users

### Primary Users

- **Regional Project Managers (RPMs)** - Track project status, funding, and disbursements
- **Field Liaisons** - Monitor individual project health and progress
- **Finance Team** - Reconcile budgets, validate formulas, track disbursements
- **Executive Leadership** - High-level visibility into global project portfolio

### Secondary Users

- **IT/DevOps** - Sync monitoring, error resolution, system maintenance
- **Data Analysts** - Export capabilities and reporting

## Current Status

**Phase 1 Complete** as of March 21, 2026.

### Completed Deliverables

1. Database schema with 10 tables (projects, project_finance_snapshots, fpd_registry, sync_runs, users, accounts, sessions, verification_tokens, source_files, import_errors, formula_mismatches)
2. Prisma ORM integration with singleton pattern
3. Google Sheets API integration with service account authentication
4. Three sync services with complete error handling
5. Six data parsers (Project Dashboard, FPD Controller, FPD Snapshot, Sage Field Costs, Sage Disbursements, DonorSnap Pledges)
6. Two validators (GPS coordinates, finance formulas)
7. Eight API routes (3 sync, 3 upload, 1 cron, 1 auth)
8. Database seed script with realistic test data
9. Unit test suite for critical business logic
10. Comprehensive README with setup instructions

### Recent Commits

- `070b500` - Cleaned up turbo caching issues
- `8ba3ee1` - Fixed NextAuth session creation issue
- `fa113e0` - Added NextAuth adapter tables to schema
- `0c809f2` - Forced dynamic rendering for database pages
- `ef74179` - Added file upload parsers for Sage and DonorSnap

### Known Limitations

- Authentication implemented at database level but not enforced in UI
- Map page scaffolded but not fully functional
- Projects list and detail pages exist but lack data binding
- Admin dashboard shows sync history but needs staleness detection
- File upload endpoints exist but lack UI
- Browser automation scaffolds present but not implemented
- No scheduled cron jobs configured (Vercel cron config exists)
- Email alerting configured but not tested in production

## Architecture Highlights

For detailed technical architecture, see [architecture.md](./architecture.md).

### Design Patterns

1. **Singleton Pattern** - Prisma client reused across Next.js hot reloads
2. **Service Layer** - Sync orchestration decoupled from API routes
3. **Parser Pattern** - Separate parsers for each data source with unified error collection
4. **Repository Pattern** - Prisma abstracts database access
5. **Adapter Pattern** - NextAuth Prisma adapter for authentication

### Data Flow

```
External Sources (Google Sheets, Sage, DonorSnap)
    ↓
API Routes (/api/sync/* or /api/upload/*)
    ↓
Sync Services (orchestration + error handling)
    ↓
Data Parsers (extract + validate)
    ↓
Validators (GPS, formulas)
    ↓
Prisma ORM (type-safe database access)
    ↓
Supabase PostgreSQL (single source of truth)
```

### Error Handling Strategy

- **Parse-time errors** - Collected without stopping import, logged to `import_errors` table
- **Formula mismatches** - Calculated vs imported values compared, logged to `formula_mismatches` table
- **Sync failures** - Caught at service layer, logged to `sync_runs` table with status="failed"
- **Email alerts** - Sent via Resend on sync failures (configurable recipient)

## Repository Information

- **Local Path**: `~/Developer/Builders-Data-Dashboard`
- **GitHub**: https://github.com/Builders-International/Builders-Data-Dashboard
- **Main Branch**: `main`
- **Deployment**: Vercel (auto-deploy on push to main)

For repository details and contribution guidelines, see [repo-link.md](./repo-link.md).

## Next Steps

For planned features, technical debt, and future roadmap, see [next-steps.md](./next-steps.md).

### Immediate Priorities

1. Complete Phase 2 frontend implementation (map, projects, admin)
2. Enable NextAuth middleware for protected routes
3. Implement scheduled cron jobs for automated syncs
4. Test email alerting in production
5. Complete Playwright browser automation for Sage/DonorSnap
6. Add role-based access control to admin functions

## Team

- **Primary Developer**: EGOD21
- **Stakeholders**: Builders International Finance & Operations Teams

## License

ISC (Internal use only)
