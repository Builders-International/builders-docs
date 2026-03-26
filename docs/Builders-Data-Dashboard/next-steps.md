# Builders Data Dashboard - Next Steps

## Phase 2 Planning

Phase 1 focused on backend infrastructure, database schema, and data ingestion. Phase 2 will complete the user-facing application with authentication, interactive dashboards, and automation.

### Phase 2 Priorities

#### 1. Complete Authentication Implementation

**Current Status:** Database tables and NextAuth configuration exist, but not enforced in UI.

**Tasks:**
- [ ] Implement sign-in page UI
- [ ] Add authentication checks to page components
- [ ] Configure Google OAuth app in Google Cloud Console
- [ ] Test user registration and session management
- [ ] Implement role-based access control in UI
- [ ] Add user management page for admin role
- [ ] Test middleware protection on `/map`, `/projects`, `/admin` routes

**Estimated Effort:** 2-3 days

#### 2. Build Interactive Map Page

**Current Status:** Scaffold exists in `app/map/page.tsx` but not functional.

**Tasks:**
- [ ] Initialize MapLibre GL JS with base map tiles
- [ ] Fetch projects with coordinates from database
- [ ] Convert projects to GeoJSON format
- [ ] Add project markers to map
- [ ] Implement color coding by status or funding state
- [ ] Build detail drawer component
- [ ] Add click handler to open drawer with project details
- [ ] Implement map filters (region, country, status, etc.)
- [ ] Add search functionality
- [ ] Optimize performance for 150+ markers

**Estimated Effort:** 5-7 days

**Design Considerations:**
- Use clustering for dense marker areas
- Lazy load project details on drawer open
- Cache map state in session storage
- Consider vector tiles for better performance

#### 3. Complete Projects List & Detail Pages

**Current Status:** Routes exist but components need data binding.

**Tasks:**
- [ ] Build projects list table with pagination
- [ ] Implement search and filter UI
- [ ] Add sorting by key fields (name, status, funding, etc.)
- [ ] Fetch and display project detail data
- [ ] Build finance cards showing budget, raised, disbursed, etc.
- [ ] Display formula validation results
- [ ] Show sync metadata and freshness indicators
- [ ] Add disbursement history timeline
- [ ] Link to source Google Sheets
- [ ] Implement export to CSV/Excel

**Estimated Effort:** 4-5 days

#### 4. Build Admin Sync Dashboard

**Current Status:** Basic scaffold exists in `app/admin/sync/`.

**Tasks:**
- [ ] Display sync_runs table with status and timestamps
- [ ] Show row counts and error summaries
- [ ] Implement manual sync triggers for each source
- [ ] Display import_errors with filtering
- [ ] Show formula_mismatches with resolution workflow
- [ ] Add staleness warnings (data older than X days)
- [ ] Build sync history timeline visualization
- [ ] Add ability to view raw error details
- [ ] Implement admin-only access control

**Estimated Effort:** 3-4 days

#### 5. Implement Scheduled Syncs

**Current Status:** Vercel cron config exists but endpoints need completion.

**Tasks:**
- [ ] Complete `/api/cron/check-staleness` implementation
- [ ] Add hourly Project Dashboard sync cron
- [ ] Add daily FPD workbooks batch sync cron
- [ ] Implement staleness detection logic (7-day threshold)
- [ ] Test cron authentication with `CRON_SECRET` header
- [ ] Configure email alerts for staleness warnings
- [ ] Add Vercel cron monitoring to admin dashboard
- [ ] Document cron schedule in README

**Estimated Effort:** 2 days

**Cron Schedule Recommendations:**
- Project Dashboard: Every 6 hours
- FPD Controller: Daily at 1 AM
- FPD Workbooks: Daily at 2 AM (staggered from controller)
- Staleness Check: Hourly

#### 6. Complete Email Alerting System

**Current Status:** Resend integration exists but not tested in production.

**Tasks:**
- [ ] Test email delivery in production
- [ ] Design email templates (sync failures, staleness warnings)
- [ ] Add configurable recipient list (not just single `ALERT_EMAIL`)
- [ ] Implement email digest for daily summaries
- [ ] Add unsubscribe functionality for non-critical alerts
- [ ] Test HTML rendering across email clients
- [ ] Add email logging to database

**Estimated Effort:** 2 days

#### 7. Implement File Upload UI

**Current Status:** Upload API routes and parsers exist but no UI.

**Tasks:**
- [ ] Build file upload component (drag-and-drop)
- [ ] Add upload pages for Sage Field Costs, Sage Disbursements, DonorSnap Pledges
- [ ] Implement client-side file validation (format, size)
- [ ] Show upload progress indicator
- [ ] Display parse results and error summary
- [ ] Add upload history log
- [ ] Restrict upload access to editor/admin roles

**Estimated Effort:** 3 days

#### 8. Complete Browser Automation (Playwright)

**Current Status:** Scaffolds exist in `lib/automation/` with TODO comments.

**Tasks:**
- [ ] Implement Sage field cost export automation
- [ ] Implement Sage disbursement export automation
- [ ] Implement DonorSnap pledge export automation
- [ ] Add credential management (encrypted storage)
- [ ] Configure headless browser execution on Vercel
- [ ] Add retry logic and error handling
- [ ] Schedule automated exports via cron
- [ ] Add automation logs to admin dashboard

**Estimated Effort:** 5-7 days

**Security Considerations:**
- Store credentials encrypted in database (not environment variables)
- Use Vercel Secrets for encryption keys
- Implement IP allowlisting for automation access
- Add audit log for all automation runs

## Known Issues

### Critical

1. **NextAuth Session Creation** - Recently fixed (`8ba3ee1`) but needs production testing
2. **Decimal Coordinate Rendering** - Recently fixed (`bde9a1e`) but needs verification in map component
3. **Turbo Caching** - Recently cleaned up (`070b500`) but may need monitoring

### Minor

1. **Formula Mismatch Thresholds** - Hardcoded to $0.01, should be configurable
2. **Batch Sync Performance** - Sequential processing of 145+ workbooks is slow (10-15 minutes)
3. **Error Logging Verbosity** - Some errors logged to console but not database
4. **GPS Coordinate Validation** - No bounds checking (latitude -90 to 90, longitude -180 to 180)

### Technical Debt

1. **No End-to-End Tests** - Only unit tests for validators exist
2. **No API Documentation** - Endpoints documented in README but no OpenAPI spec
3. **No Request Validation** - API routes don't validate request bodies
4. **No Rate Limiting** - API routes have no rate limiting (Vercel provides some)
5. **No Logging Service** - Console logs only, no structured logging (e.g., Datadog, Sentry)

## Feature Requests

### High Priority

1. **Dashboard Homepage** - Executive summary with KPIs (total projects, total raised, active projects, etc.)
2. **Export Functionality** - Export filtered project lists to CSV/Excel
3. **Project Search** - Global search across all project fields
4. **Notification Preferences** - Users can configure which alerts they receive
5. **Data Refresh Indicator** - Show last sync time on all pages

### Medium Priority

1. **Project Comparison** - Side-by-side comparison of multiple projects
2. **Budget vs Actual Reports** - Finance variance analysis
3. **Regional Dashboards** - Regional project manager views with regional KPIs
4. **Mobile Responsive Design** - Optimize UI for tablet/mobile
5. **Keyboard Shortcuts** - Power user keyboard navigation

### Low Priority

1. **Project Timeline** - Gantt chart of project milestones
2. **Photo Gallery** - Integration with Google Photos or Drive for project photos
3. **Document Management** - Attach PDFs, contracts, reports to projects
4. **Comments/Notes** - Internal team notes on projects
5. **Change History** - Audit log of all project data changes

## Dependencies Needing Updates

Run `npm outdated` to check for outdated packages.

### Current Major Versions

All dependencies are relatively recent (as of March 2026). No critical updates needed immediately.

**Recommended Update Schedule:**
- **Monthly**: Patch updates (`npm update`)
- **Quarterly**: Minor updates (review release notes)
- **Yearly**: Major updates (test thoroughly)

**Watch for:**
- Next.js 17 (expected Q3 2026)
- React 20 (expected 2027)
- Prisma 6 (expected Q4 2026)

## Performance Improvements

### Database Optimization

1. **Add Indexes**
   - [ ] `projects.status` - frequently filtered
   - [ ] `projects.region` - frequently filtered
   - [ ] `projects.country` - frequently filtered
   - [ ] `sync_runs.completedAt` - for chronological queries

2. **Materialized Views**
   - [ ] Create view for project list with finance summary (joins expensive)
   - [ ] Refresh on sync completion

3. **Connection Pooling Tuning**
   - [ ] Monitor connection usage in Supabase dashboard
   - [ ] Adjust pool size if needed

### Application Performance

1. **Implement Caching**
   - [ ] Add Redis for frequently accessed projects
   - [ ] Cache map GeoJSON data (refresh on sync)
   - [ ] Cache project list filters

2. **Optimize Batch Sync**
   - [ ] Parallelize FPD workbook syncs (5-10 concurrent)
   - [ ] Add progress indicator in admin dashboard
   - [ ] Consider background job queue (Vercel Queue, BullMQ)

3. **Frontend Optimization**
   - [ ] Implement virtual scrolling for large project lists
   - [ ] Lazy load map markers (viewport-based)
   - [ ] Add service worker for offline support

## Security Enhancements

### Authentication & Authorization

1. **Multi-Factor Authentication** - Add MFA option for admin users
2. **Audit Logging** - Log all user actions (view, edit, delete)
3. **Session Timeout** - Implement configurable session timeout
4. **IP Allowlisting** - Restrict admin access to office IPs

### Data Protection

1. **Field-Level Encryption** - Encrypt sensitive fields (email, missionary names)
2. **Data Retention Policy** - Auto-delete old sync_runs and import_errors (> 90 days)
3. **Backup Strategy** - Automated daily backups with point-in-time recovery
4. **Access Logs** - Log all database queries for compliance

### API Security

1. **Request Validation** - Add Zod or Yup validation for API routes
2. **Rate Limiting** - Implement per-user rate limits
3. **CORS Configuration** - Restrict API access to known domains
4. **API Keys** - Add API key auth for external integrations

## Documentation Improvements

### Code Documentation

1. **JSDoc Comments** - Add JSDoc to all public functions
2. **Architecture Decision Records** - Document key architectural decisions
3. **API Documentation** - Generate OpenAPI spec from code
4. **Database Schema Diagram** - Visual ERD of all tables and relationships

### User Documentation

1. **User Guide** - Step-by-step guide for end users
2. **Admin Guide** - Admin dashboard usage and troubleshooting
3. **Video Tutorials** - Screen recordings of common tasks
4. **FAQ** - Common questions and answers

### Developer Documentation

1. **Contributing Guide** - How to contribute to the project
2. **Local Development Guide** - Detailed setup instructions
3. **Deployment Guide** - Production deployment checklist
4. **Troubleshooting Guide** - Common errors and solutions

## Testing Strategy

### Unit Tests

**Current Coverage:** Only validators tested.

**Expand Coverage:**
- [ ] Parser functions (all 6 parsers)
- [ ] Service layer orchestration
- [ ] Formula calculation functions
- [ ] GPS coordinate parsing edge cases
- [ ] Numeric parsing with various formats

**Target:** 80% code coverage

### Integration Tests

**Priority:** High (Phase 2)

**Test Scenarios:**
- [ ] Full sync flow (Google Sheets → Database)
- [ ] API route error handling
- [ ] Database transaction rollbacks
- [ ] NextAuth authentication flow
- [ ] Email alert delivery

**Tools:** Jest + Supertest for API testing

### End-to-End Tests

**Priority:** Medium (Phase 3)

**Test Scenarios:**
- [ ] User login and navigation
- [ ] Map interaction and filtering
- [ ] Project search and detail view
- [ ] Admin sync trigger and monitoring
- [ ] File upload and parsing

**Tools:** Playwright or Cypress

### Load Testing

**Priority:** Low (Phase 3+)

**Scenarios:**
- [ ] Concurrent sync operations
- [ ] 100+ simultaneous users on map
- [ ] Database query performance under load
- [ ] API endpoint throughput

**Tools:** k6 or Artillery

## Monitoring & Observability

### Application Monitoring

**Current:** Console logs only

**Recommendations:**
1. **Error Tracking** - Integrate Sentry or Rollbar
2. **Performance Monitoring** - Integrate Vercel Analytics or Datadog APM
3. **User Analytics** - Integrate PostHog or Mixpanel
4. **Uptime Monitoring** - Integrate UptimeRobot or Pingdom

### Database Monitoring

**Current:** Supabase dashboard only

**Enhancements:**
1. **Query Performance** - Enable slow query logging
2. **Connection Pooling** - Monitor pool utilization
3. **Disk Usage** - Alert on 80% disk usage
4. **Backup Verification** - Automated backup restore testing

### Alerting

**Priority:** High

**Alert Types:**
1. **Sync Failures** - Email + Slack webhook
2. **Staleness Warnings** - Daily email digest
3. **Error Rate Spike** - Slack webhook
4. **Database Connection Failures** - PagerDuty alert
5. **Cron Job Failures** - Email alert

## Compliance & Governance

### Data Privacy

1. **GDPR Compliance** - Add data export and deletion for user data
2. **Data Classification** - Classify fields as public, internal, confidential
3. **Privacy Policy** - Document data usage and retention
4. **User Consent** - Obtain consent for data processing

### Accessibility

1. **WCAG 2.1 Level AA** - Ensure map and dashboards are accessible
2. **Screen Reader Support** - Test with NVDA and JAWS
3. **Keyboard Navigation** - All features accessible without mouse
4. **Color Contrast** - Ensure sufficient contrast ratios

### Compliance

1. **SOC 2** - Document security controls (if required)
2. **Change Management** - Formal change approval process
3. **Disaster Recovery** - Documented DR plan and testing schedule

## Long-Term Vision (Phase 3+)

### Advanced Analytics

1. **Predictive Modeling** - Predict project completion dates based on funding velocity
2. **Trend Analysis** - Historical funding trends and seasonality
3. **Risk Scoring** - Identify at-risk projects based on multiple factors
4. **Budget Forecasting** - AI-powered budget predictions

### External Integrations

1. **Accounting System API** - Direct integration with Sage API (replace file uploads)
2. **CRM Integration** - Bi-directional sync with DonorSnap API
3. **Communication Tools** - Slack notifications, Teams integration
4. **Project Management** - Asana or Monday.com integration

### Data Warehouse

1. **ETL Pipeline** - Export to BigQuery or Snowflake for advanced analytics
2. **BI Tool Integration** - Connect Looker, Tableau, or Power BI
3. **Historical Data** - Preserve snapshots for year-over-year comparisons

### Mobile Applications

1. **React Native App** - Native iOS/Android app for field teams
2. **Offline Support** - Sync data when connectivity available
3. **Push Notifications** - Real-time project updates

## Immediate Next Actions

### Week 1

1. Complete authentication implementation
2. Test email alerting in production
3. Fix any critical bugs from production deployment

### Week 2-3

4. Build interactive map page
5. Complete projects list and detail pages

### Week 4

6. Build admin sync dashboard
7. Implement scheduled syncs
8. Add end-to-end tests

### Month 2

9. Complete file upload UI
10. Begin browser automation implementation
11. Add performance monitoring

## Success Metrics

### Phase 2 Completion Criteria

- [ ] All users can authenticate via Google OAuth
- [ ] Map displays all projects with valid coordinates
- [ ] Projects list is searchable and filterable
- [ ] Project detail pages show complete finance data
- [ ] Admin dashboard shows sync history and errors
- [ ] Scheduled syncs run daily without failures
- [ ] Email alerts sent on sync failures
- [ ] File uploads processed successfully
- [ ] Test coverage > 60%
- [ ] Production uptime > 99%

### User Adoption Goals

- 20+ active users within first month
- 80% of finance team using weekly
- All RPMs using for project monitoring
- Zero security incidents

### Performance Goals

- Map loads < 3 seconds
- Project list search < 1 second
- Sync operations complete < 15 minutes
- API response times < 500ms p95

## Contact & Support

For questions or issues:

- **Developer:** EGOD21
- **Stakeholders:** Builders International Finance & Operations Teams
- **Support:** tech@buildersintl.org
