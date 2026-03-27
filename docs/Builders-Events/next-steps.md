# Builders-Events Next Steps

## Known Issues

### Code TODOs

#### Analytics Service (Low Priority)
**Location**: `apps/api/src/analytics/analytics.service.ts`
```typescript
// TODO: Implement analytics tracking logic
```
**Issue**: Analytics service created but core tracking logic not yet implemented
**Impact**: PostHog integration partially configured but not actively tracking events
**Recommended Fix**: Implement event tracking methods for key user actions (donations, registrations, schedule views)

### Type Safety Issues (Recently Addressed)
Recent commits show several type-related issues that were fixed:
- Product update mutation field name mismatches (resolved)
- `useUpdateProduct` type alignment with API DTO (resolved)
- `goalCents` type error in event form (resolved)

### Infrastructure Issues

#### Database Migrations Pending
**From NEXT_STEPS.md**:
```
Action items (Dec 2025):
- Run Prisma migration for new table `event_registrations` (after schema update):
  cd apps/api && pnpm exec prisma migrate dev --name add_event_registrations
```
**Status**: Migration may already be applied; verify with `prisma migrate status`
**Action**: Confirm migration status and deploy to production if needed

#### Deployment Synchronization
**Required Actions**:
1. Redeploy API to Railway after migration
2. Deploy admin dashboard to Vercel/Netlify
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (Railway API URL)
   - Clerk keys (`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)

#### Test Data Seeding
**From NEXT_STEPS.md**:
```
- Seed data for events/schedule/people/products/locations/surveys so mobile screens have content.
```
**Action**: Run `cd apps/api && pnpm db:seed` to populate development/staging environments

### Mobile App Issues

#### Offline Support
**Current State**: Basic query caching via TanStack Query
**Limitation**: No comprehensive offline mode
**User Impact**: App requires internet connection for most features
**Recommended**: Implement offline data persistence with local SQLite or AsyncStorage

#### Multi-Language Support
**Current State**: English only
**Limitation**: International events require manual content translation
**Recommended**: Implement i18n framework (react-i18next or expo-localization)

### Admin Dashboard Issues

#### Email Notifications
**Current State**: Not implemented
**Limitation**: All notifications are push-only (Expo) or SMS (Twilio)
**User Impact**: No email receipts, confirmations, or reminders
**Recommended**: Integrate SendGrid, AWS SES, or similar email service

#### Shopify Synchronization
**Current State**: Shopify IDs stored but no active sync
**Limitation**: Manual product/variant management
**Recommended**: Implement Shopify webhook listeners for product updates

### Security & Compliance

#### Apple App Store Compliance (Completed)
Recent work completed account deletion endpoint:
- `POST /account` - Delete user account endpoint
- Support page with contact info and deletion instructions
- **Status**: ✅ Implemented

#### GDPR Compliance
**Current State**: Account deletion implemented
**Gaps**:
- Data export functionality not implemented
- Privacy policy links present but content may need review
- Cookie consent not implemented (if web admin is public)

## Planned Features

### Phase 1: Core Enhancements

#### 1. Email Integration
**Priority**: High
**Description**: Add email notifications for key events
**Implementation**:
- Choose email provider (SendGrid, AWS SES, Mailgun)
- Create email templates (donation receipt, registration confirmation, meeting reminders)
- Implement email service in API
- Add email preferences to user profile
**Estimated Effort**: 2-3 days

#### 2. Analytics Implementation
**Priority**: Medium
**Description**: Complete PostHog analytics tracking
**Implementation**:
- Implement analytics service methods
- Add tracking to key user flows:
  - Event registration
  - Donation completion
  - Schedule item views and RSVPs
  - Product purchases
  - Meeting requests
- Create custom dashboards in PostHog
**Estimated Effort**: 2-3 days

#### 3. Enhanced Offline Support
**Priority**: Medium
**Description**: Improve mobile app offline capabilities
**Implementation**:
- Cache essential data (schedules, locations, people)
- Implement optimistic updates with retry logic
- Queue offline actions for sync when online
- Add offline indicator UI
**Estimated Effort**: 3-5 days

### Phase 2: User Experience Improvements

#### 4. Multi-Language Support
**Priority**: Medium
**Description**: Internationalize mobile app and admin dashboard
**Implementation**:
- Choose i18n library (react-i18next recommended)
- Extract all user-facing strings
- Create translation files (English, Spanish to start)
- Add language selector to user settings
- Support RTL languages (Arabic, Hebrew)
**Estimated Effort**: 5-7 days

#### 5. Enhanced Search & Filtering
**Priority**: Low-Medium
**Description**: Improve search across people, schedule, products
**Implementation**:
- Add full-text search to PostgreSQL (ts_vector)
- Implement search endpoints in API
- Create search UI in mobile app
- Add advanced filtering (by role, tags, schedule type)
**Estimated Effort**: 3-4 days

#### 6. Calendar Integration
**Priority**: Low-Medium
**Description**: Allow users to export schedules to personal calendars
**Implementation**:
- Generate iCal (.ics) files for schedule items
- Add "Add to Calendar" buttons
- Support Google Calendar, Apple Calendar, Outlook
**Estimated Effort**: 2-3 days

### Phase 3: Advanced Features

#### 7. Real-Time Messaging
**Priority**: Medium
**Description**: Add real-time chat with WebSockets or similar
**Implementation**:
- Choose real-time solution (Socket.IO, Pusher, Supabase Realtime)
- Implement WebSocket server in NestJS
- Update mobile app with real-time message updates
- Add typing indicators, read receipts
**Estimated Effort**: 5-7 days

#### 8. Video Integration
**Priority**: Low
**Description**: Embed video streams or recordings in schedule items
**Implementation**:
- Choose video platform (Vimeo, YouTube, Mux)
- Add video URL field to schedule_items
- Implement video player in mobile app
- Support livestreaming for remote attendees
**Estimated Effort**: 3-5 days

#### 9. Waitlist & Capacity Management
**Priority**: Low-Medium
**Description**: Advanced RSVP management for capacity-limited events
**Implementation**:
- Add waitlist table to database
- Implement automatic promotion when spots open
- Send notifications to waitlist members
- Admin dashboard for manual waitlist management
**Estimated Effort**: 4-5 days

#### 10. Automated Matching
**Priority**: Low
**Description**: Match attendees based on interests, industries, goals
**Implementation**:
- Add profile questions/preferences
- Implement matching algorithm (collaborative filtering or manual tagging)
- Suggest connections in mobile app
- Facilitate introductions via messaging
**Estimated Effort**: 7-10 days

### Phase 4: Data & Reporting

#### 11. Advanced Analytics Dashboard
**Priority**: Medium
**Description**: Admin analytics for event success metrics
**Implementation**:
- Track KPIs (attendance, giving totals, engagement)
- Create admin dashboard charts (Chart.js or Recharts)
- Export reports as PDF or CSV
- Compare events over time
**Estimated Effort**: 5-7 days

#### 12. Custom Reports
**Priority**: Low
**Description**: Generate custom reports for stakeholders
**Implementation**:
- Report builder UI in admin dashboard
- Flexible query builder for database
- Schedule automated report emails
- Visualizations and data exports
**Estimated Effort**: 7-10 days

### Phase 5: Third-Party Integrations

#### 13. Shopify Full Integration
**Priority**: Low-Medium
**Description**: Two-way sync with Shopify products and orders
**Implementation**:
- Implement Shopify webhook listeners
- Sync product variants, pricing, inventory
- Push orders to Shopify for fulfillment
- Handle Shopify order status updates
**Estimated Effort**: 5-7 days

#### 14. CRM Integration
**Priority**: Low
**Description**: Sync attendee data with CRM (Salesforce, HubSpot)
**Implementation**:
- Choose CRM platform
- Implement bidirectional sync
- Map user fields to CRM contacts
- Track event participation in CRM
**Estimated Effort**: 7-10 days

#### 15. Accounting Integration
**Priority**: Low
**Description**: Export donations and orders to accounting software (QuickBooks, Xero)
**Implementation**:
- Choose accounting platform
- Implement export API
- Map transactions to GL codes
- Schedule automated syncs
**Estimated Effort**: 5-7 days

## Technical Debt

### 1. Test Coverage
**Current State**: Jest configured but minimal tests
**Issue**: No comprehensive test suite
**Impact**: Increased risk of regressions
**Recommended**:
- Add unit tests for services (80% coverage target)
- Add E2E tests for critical flows (registration, donations, orders)
- Setup CI/CD pipeline for automated testing
**Effort**: Ongoing (2-3 days initial setup, then continuous)

### 2. API Documentation
**Current State**: Swagger auto-generated from decorators
**Issue**: Incomplete endpoint documentation, missing examples
**Recommended**:
- Add detailed descriptions to all DTOs
- Provide request/response examples
- Document error responses
- Add authentication requirements to docs
**Effort**: 2-3 days

### 3. Error Handling Standardization
**Current State**: Inconsistent error responses
**Issue**: Some endpoints throw generic errors, others use custom formats
**Recommended**:
- Create global exception filter
- Standardize error response format
- Add error codes for client handling
- Improve error messages for debugging
**Effort**: 2-3 days

### 4. Database Query Optimization
**Current State**: Some N+1 query issues
**Issue**: Performance degradation with large datasets
**Recommended**:
- Audit Prisma queries for N+1 problems
- Add strategic includes/selects
- Implement pagination for large lists
- Add database query logging in development
**Effort**: 3-4 days

### 5. Dependency Updates
**Current State**: Some dependencies outdated
**Issue**: Security vulnerabilities, missing features
**Recommended**:
- Audit with `pnpm audit` or Dependabot
- Update critical dependencies (especially security patches)
- Test thoroughly after major updates
- Setup automated dependency update PRs
**Effort**: 1-2 days quarterly

### 6. Code Duplication
**Current State**: Some shared logic duplicated across mobile/admin
**Issue**: Maintenance burden, inconsistency
**Recommended**:
- Extract shared utilities to `packages/shared`
- Create shared TypeScript types for API responses
- Consider mono-repo package for shared validation schemas
**Effort**: 3-5 days

### 7. Environment Configuration
**Current State**: Environment variables scattered, no validation
**Issue**: Runtime errors from missing/invalid env vars
**Recommended**:
- Create schema validation for env vars (Zod or class-validator)
- Fail fast on startup if required vars missing
- Document all env vars in README or .env.example
**Effort**: 1 day

### 8. Mobile Build Pipeline
**Current State**: Manual EAS builds
**Issue**: No automated builds on commit
**Recommended**:
- Setup GitHub Actions for EAS builds
- Automate preview builds on PR
- Auto-submit production builds on release tag
**Effort**: 2-3 days

## Dependencies Requiring Updates

### Critical Security Updates
Run `pnpm audit` to identify critical vulnerabilities. As of last check:
- Review Prisma, NestJS, Next.js for latest security patches
- Update Expo SDK to latest stable (currently on 50.0.21, check for 51+)
- Update React Native to 0.74+ when stable

### Major Version Updates to Consider

#### Expo SDK 51+
**Current**: 50.0.21
**Latest Stable**: Check Expo blog
**Breaking Changes**: Review Expo SDK 51 upgrade guide
**Benefits**: New features, performance improvements, security fixes
**Effort**: 1-2 days for testing

#### Next.js 15
**Current**: 14.2.35
**Latest Stable**: 15.x
**Breaking Changes**: Review Next.js 15 migration guide
**Benefits**: Improved App Router, better performance
**Effort**: 1-2 days

#### TanStack Query v6
**Current**: v5
**Latest Stable**: v5 (v6 may be in beta)
**Breaking Changes**: Review migration guide if upgrading
**Benefits**: Better TypeScript support, new features
**Effort**: 1 day

### Recommended Version Pins
Review `package.json` for version ranges. Consider:
- Pinning major versions to avoid breaking changes
- Using `~` for patch updates, `^` for minor updates on stable packages
- Exact versions for critical dependencies (database, authentication)

## Future Architectural Considerations

### 1. Microservices Migration
**Current**: Monolithic NestJS API
**Future Consideration**: Split into microservices if scaling requires
**Services**:
- Auth service (Clerk wrapper)
- Events service
- Messaging service
- Payments service (Stripe, donations, orders)
- Notifications service (push, SMS, email)
**Trigger**: API response times degrade, team grows, deployment bottlenecks

### 2. GraphQL API
**Current**: REST API
**Future Consideration**: Add GraphQL layer for flexible querying
**Benefits**: Reduced over-fetching, better mobile performance
**Tools**: NestJS GraphQL module, Apollo Server
**Effort**: 7-10 days for initial setup

### 3. Event Sourcing
**Current**: CRUD operations with audit logs
**Future Consideration**: Event sourcing for critical domains (donations, orders)
**Benefits**: Complete audit trail, event replay, temporal queries
**Complexity**: High - requires significant architectural changes
**Trigger**: Compliance requirements, advanced analytics needs

### 4. Read Replicas
**Current**: Single PostgreSQL instance
**Future Consideration**: Read replicas for analytics and reporting
**Benefits**: Improved read performance, reduced load on primary
**Trigger**: Database CPU utilization consistently >70%

### 5. CDN for Static Assets
**Current**: S3 public URLs
**Future Consideration**: CloudFront CDN for global asset delivery
**Benefits**: Faster image loads, reduced S3 costs
**Effort**: 1 day for setup

### 6. Background Job Processing
**Current**: Synchronous request handling
**Future Consideration**: Job queue for heavy operations (BullMQ, Agenda)
**Use Cases**:
- Bulk email sending
- Report generation
- Data exports
- Image processing
**Effort**: 3-5 days for setup

## Immediate Action Items

### High Priority (This Week)
1. ✅ **Verify Migrations**: Run `prisma migrate status` and apply pending migrations
2. ✅ **Deploy API**: Redeploy to Railway with latest database schema
3. ⬜ **Security Audit**: Run `pnpm audit` and address critical vulnerabilities
4. ⬜ **Complete Analytics**: Implement TODO in analytics service
5. ⬜ **Documentation**: Update API docs with missing endpoints

### Medium Priority (This Month)
1. ⬜ **Email Integration**: Choose provider and implement basic email sending
2. ⬜ **Test Coverage**: Add unit tests for core services (events, donations, orders)
3. ⬜ **Error Handling**: Standardize error responses across API
4. ⬜ **Dependency Updates**: Update critical dependencies with security patches
5. ⬜ **Offline Support**: Improve mobile app caching strategy

### Low Priority (This Quarter)
1. ⬜ **Multi-Language**: Implement i18n framework
2. ⬜ **Enhanced Search**: Add full-text search capabilities
3. ⬜ **Real-Time Messaging**: Evaluate and implement WebSocket solution
4. ⬜ **Advanced Analytics**: Build admin analytics dashboard
5. ⬜ **Code Quality**: Reduce code duplication, extract shared packages

## Development Environment Setup Improvements

### 1. Docker Compose
**Current**: Manual setup of PostgreSQL
**Recommended**: Docker Compose for local development
**Benefits**: Consistent development environment, easier onboarding
**Effort**: 1 day

### 2. Seed Script Enhancement
**Current**: Basic seed script exists
**Recommended**: Comprehensive seed data for all features
**Benefits**: Easier development and testing
**Effort**: 2-3 days

### 3. Development Documentation
**Current**: Minimal setup instructions
**Recommended**: Comprehensive developer guide
**Include**:
- Local setup steps
- Environment variable documentation
- Common development tasks
- Debugging tips
- Testing instructions
**Effort**: 2 days

## Monitoring & Alerting Improvements

### 1. Uptime Monitoring
**Recommended**: UptimeRobot, Pingdom, or Railway built-in monitoring
**Alerts**: Slack/email on downtime
**Effort**: 1 hour

### 2. Performance Monitoring
**Recommended**: Enable Railway metrics or integrate New Relic/Datadog
**Track**: Response times, error rates, database query performance
**Effort**: 1-2 days

### 3. Log Aggregation
**Current**: Railway logs, Sentry errors
**Recommended**: Centralized logging (LogDNA, Papertrail)
**Benefits**: Easier debugging, searchable logs
**Effort**: 1 day

### 4. Database Monitoring
**Current**: Supabase built-in metrics
**Recommended**: Setup alerts for connection pool saturation, slow queries
**Effort**: 1 hour

## Compliance & Legal

### 1. Terms of Service
**Current**: Admin dashboard has terms page
**Action**: Ensure legal review and user acceptance flow
**Effort**: 1 day (technical implementation)

### 2. Privacy Policy
**Current**: Privacy page exists
**Action**: Review GDPR compliance, update for all data collection
**Effort**: 1 day (technical implementation)

### 3. Data Retention Policy
**Current**: No automatic deletion
**Recommended**: Implement data retention rules (delete old events, anonymize users)
**Effort**: 2-3 days

### 4. Security Audit
**Current**: No formal audit
**Recommended**: Third-party security audit before scaling
**Effort**: External vendor (budget required)

## Cross-Reference Documentation

- **Infrastructure Standards**: See [Infrastructure Documentation](/docs/infrastructure/overview.md)
- **CI/CD Practices**: See [CI/CD Documentation](/docs/cicd-deployment/overview.md)
- **Code Quality**: See [Code Quality Documentation](/docs/code-quality/overview.md)
- **Related Projects**: See [Builders-Data-Dashboard](/docs/Builders-Data-Dashboard/next-steps.md)
