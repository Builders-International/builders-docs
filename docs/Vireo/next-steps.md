# Vireo Next Steps

## Current Status (March 2026)

### Phase Completion
- **Phase 1**: ✅ Complete (Code complete, deployment verification pending)
- **Phase 2**: 🔄 In Deployment (Code complete, operational steps remain)
- **Phase 3**: 📋 Planned (Profile Builder & Wealth Screener)
- **Phase 4**: 🔮 Future (Mobile app, production hardening)

### Last Major Update
- **Date**: March 2, 2026
- **Scope**:
  - Auth degraded-mode policy hardening
  - AI confirm-first + correlation IDs
  - Durable export job storage with XLSX support
  - Workflow webhook authentication/signature tightening

## Immediate Priorities (Next 30 Days)

### 1. Deployment Verification & Production Readiness
**Priority**: CRITICAL
**Owner**: DevOps + Engineering Lead

#### Tasks
- [ ] Apply pending database migrations (including BSI backfill)
- [ ] Set all required environment variables in Cloud Run
  - [ ] Slack webhook URLs
  - [ ] Google Sheets service account credentials
  - [ ] File ingest configurations
  - [ ] Workflow secrets and alert endpoints
  - [ ] Stripe production keys
  - [ ] WhatsApp provider configuration (Twilio/Meta)
  - [ ] `WORKFLOW_FINANCE_WRITE` flag
  - [ ] Report template configurations
- [ ] Deploy latest backend (vireo-api) to Cloud Run
- [ ] Deploy latest frontend (vireo-frontend) to Cloud Run
- [ ] Run smoke tests per `docs/phase1_deploy_checklist.md`
- [ ] Verify all 25 API endpoints respond correctly
- [ ] Test authentication flow end-to-end
- [ ] Validate BSI financial rollups
- [ ] Confirm workflow triggers (webhooks + cron)
- [ ] Test email sending via notification service
- [ ] Verify WhatsApp action and logging

**Acceptance Criteria**:
- All services running on Cloud Run with green health checks
- Database migrations applied successfully
- Smoke tests passing 100%
- No errors in Cloud Logging
- Authentication working for all user types
- BSI rollups returning accurate financial data

**Blockers**:
- WhatsApp provider selection (Twilio vs Meta)
- Production Stripe webhook configuration
- Report template definitions and storage

**Reference Documents**:
- `/docs/phase1_deploy_checklist.md`
- `/docs/phase1_deploy_runbook.md`

---

### 2. IVI Identity System Completion
**Priority**: HIGH
**Owner**: CRM Team

#### Background
IVI (Identity Value Identifier) preserves legacy DonorSnap IPK (Internal Primary Key) identities to maintain historical reference integrity.

#### Tasks
- [x] Add `ivi` field to Contact model (DONE)
- [x] Create unique index on `ivi` field (DONE)
- [x] Backfill IVI from legacy DonorSnap IPK for all imported contacts (DONE)
- [x] Display IVI on contact detail pages (DONE)
- [x] Include IVI in contact list views (DONE)
- [ ] Add IVI to contact search filters
- [ ] Support IVI in contact export/import
- [ ] Document IVI usage in CRM user guide
- [ ] Train staff on IVI lookup and usage

**Acceptance Criteria**:
- All migrated contacts have IVI populated
- IVI displayed prominently in UI
- Search by IVI functional
- Export includes IVI column
- Documentation updated with IVI explanation

**Known Issues**:
- Some contacts may have conflicting legacy IPK values (manual resolution needed)

---

### 3. Contact Outreach & Interaction Logging
**Priority**: HIGH
**Owner**: CRM + Communications Team

#### Email-to-Interaction Logging
**Status**: ✅ Code complete, testing needed

##### Features Implemented
- "Email/Contact" button on contact detail page
- Opens compose prefilled with contact email
- Option for mailto: link or in-app composer
- Sends via notification service
- Auto-logs interaction with:
  - Sender identity
  - Timestamp
  - Email subject and body
  - Delivery status

##### Remaining Tasks
- [ ] Test email sending via SMTP
- [ ] Verify interaction logging persistence
- [ ] Add email template support
- [ ] Implement CC/BCC functionality
- [ ] Add attachment support
- [ ] Create email analytics dashboard

#### WhatsApp Integration
**Status**: ⚠️ Configuration required

##### Features Implemented
- WhatsApp action button on contact detail
- Sends message from contact detail page
- Logs interaction with delivery status
- Supports templated messages

##### Remaining Tasks
- [ ] **Choose provider** (Twilio vs Meta Business API)
- [ ] Set up verified phone number
- [ ] Configure message templates
- [ ] Implement consent management
- [ ] Add delivery receipt handling
- [ ] Test end-to-end message flow
- [ ] Document WhatsApp usage policies

**Acceptance Criteria**:
- Email button functional and logging correctly
- WhatsApp configured with verified number
- Interactions logged with full metadata
- Delivery status tracked and displayed
- Staff trained on usage

**Dependencies**:
- SMTP credentials configured
- WhatsApp provider account setup
- Message template approval (Meta)

---

### 4. Workflow Automation Hardening
**Priority**: HIGH
**Owner**: Backend Team

#### Webhook Authentication
**Status**: ✅ Code complete

##### Implemented
- Webhook signature verification
- HMAC-SHA256 signature validation
- Request timestamp validation (5-minute window)
- Replay attack prevention

##### Remaining Tasks
- [ ] Configure webhook secrets in Secret Manager
- [ ] Update external systems to sign requests
- [ ] Test webhook delivery with various payloads
- [ ] Document webhook signature format
- [ ] Create webhook debugging guide

#### Cron Trigger Configuration
**Status**: ⚠️ Scheduler setup needed

##### Features Implemented
- Cron expression parsing
- Scheduled workflow execution
- Job queue integration with BullMQ

##### Remaining Tasks
- [ ] Set up Cloud Scheduler jobs
- [ ] Configure IAM for Scheduler → Cloud Run
- [ ] Test scheduled executions
- [ ] Add cron job monitoring
- [ ] Create alerting for failed jobs

#### Failure Handling & Notifications
**Status**: ✅ Implemented

##### Features
- Exponential backoff on failures
- Retry limits (3 attempts default)
- Failure notifications via email/Slack
- Durable run logs stored in database

##### Remaining Tasks
- [ ] Configure Slack webhook for alerts
- [ ] Set alert email address
- [ ] Test failure scenarios
- [ ] Create runbook for workflow failures

**Acceptance Criteria**:
- Webhooks validated with HMAC signatures
- Cron jobs running on schedule
- Failures logged and alerted
- Run history queryable via API

**Reference Documents**:
- `/docs/frontend/ui_revamp_plan.md` (mentions workflow UI)

---

### 5. Report Builder & Templates
**Priority**: MEDIUM
**Owner**: Reporting Team

#### Report Builder UI
**Status**: ✅ Code complete

##### Features Implemented
- CSV export for contacts/organizations
- Advanced filtering across 20+ fields
- Audit logging for all exports
- Scheduled report execution

##### Remaining Tasks
- [ ] Create report template definitions
- [ ] Store templates in database or config
- [ ] Add PDF export support (besides CSV/Excel)
- [ ] Implement email delivery for scheduled reports
- [ ] Build report sharing functionality
- [ ] Add report history and versioning

#### Report Templates
**Status**: ⚠️ Configuration needed

##### Template Types Needed
1. **Donor Summary Report**
   - Total giving by donor
   - Giving frequency
   - Last donation date
   - Contact information

2. **Project Giving Report**
   - Rollup by BSI project code
   - Donor count
   - Average gift size
   - Year-over-year comparison

3. **Event Registration Report**
   - Attendee list with contact info
   - Payment status
   - Meal preferences
   - Check-in status

4. **Financial Summary Report**
   - Revenue by account
   - Expense by department
   - Budget vs. actual variance
   - Monthly trend analysis

5. **Contact Segmentation Report**
   - Segment membership
   - Tag analysis
   - Engagement metrics
   - Actionable insights

##### Remaining Tasks
- [ ] Define JSON schema for templates
- [ ] Create initial template library (5+ templates)
- [ ] Build template management UI
- [ ] Test template execution engine
- [ ] Document template creation process

**Acceptance Criteria**:
- 5+ report templates available
- Templates executable via API and UI
- Export formats: CSV, Excel, PDF
- Scheduled reports delivering on time
- Templates shareable across users

**Dependencies**:
- Report template storage location decision
- PDF generation library integration

---

## Known Issues & Technical Debt

### Critical Issues

#### 1. Database Connection Pool Exhaustion
**Severity**: HIGH
**Description**: Under heavy load, Prisma connection pool can exhaust available connections
**Impact**: API requests fail with "Can't reach database" errors
**Workaround**: Increase `connection_limit` in DATABASE_URL
**Proper Fix**: Implement connection retry logic with exponential backoff
**Tracking**: GitHub Issue #TBD

#### 2. Chunk Loading Errors on Production Builds
**Severity**: MEDIUM
**Description**: Next.js chunk loading occasionally fails causing white screen
**Impact**: Users see blank page and must refresh
**Workaround**: `ChunkErrorHandler` component auto-reloads on failure
**Proper Fix**: Investigate webpack splitChunks configuration
**Status**: Mitigated with error handler, root cause investigation needed
**Tracking**: Resolved in commit `d6c1fa3`

#### 3. Stripe Webhook Replay Attacks
**Severity**: MEDIUM
**Description**: No timestamp validation on webhook signatures
**Impact**: Potential for replay attacks
**Workaround**: None currently
**Proper Fix**: Add timestamp validation (5-minute window)
**Status**: Planned for next sprint

### Medium Priority Issues

#### 4. Contact Deduplication False Positives
**Severity**: MEDIUM
**Description**: Fuzzy matching occasionally suggests unrelated contacts
**Impact**: Staff confusion, potential incorrect merges
**Workaround**: Manual review before merge
**Proper Fix**: Tune fuzzy matching threshold and algorithm
**Status**: Ongoing refinement

#### 5. Budget Variance Calculation Timezone Issues
**Severity**: MEDIUM
**Description**: Budget periods calculated in UTC causing date boundary issues
**Impact**: Incorrect variance reports for end-of-month
**Workaround**: Document timezone handling in user guide
**Proper Fix**: Store fiscal year definitions with timezone
**Status**: Documented, fix planned for Phase 3

#### 6. Large CSV Import Memory Usage
**Severity**: MEDIUM
**Description**: Importing 10,000+ row CSVs causes memory spikes
**Impact**: Cloud Run instance OOM kills
**Workaround**: Batch imports in smaller files
**Proper Fix**: Stream-based CSV parsing with batched inserts
**Status**: Tracked in technical debt backlog

#### 7. Interaction Log Pagination Performance
**Severity**: MEDIUM
**Description**: Contacts with 1,000+ interactions slow to load
**Impact**: UI lag on high-volume contact pages
**Workaround**: Limit initial load to 50 interactions
**Proper Fix**: Virtual scrolling + indexed query optimization
**Status**: Planned for Phase 4 performance sprint

### Low Priority Issues

#### 8. Dark Mode Inconsistencies
**Severity**: LOW
**Description**: Some components don't respect theme toggle
**Impact**: Minor visual inconsistencies
**Workaround**: None needed
**Proper Fix**: Audit all components for theme token usage
**Status**: Ongoing as components are updated

#### 9. Mobile Responsive Issues on iPad
**Severity**: LOW
**Description**: Some admin pages break layout on iPad portrait
**Impact**: Horizontal scrolling required
**Workaround**: Use landscape orientation
**Proper Fix**: Responsive breakpoint adjustments
**Status**: Tracked for frontend polish sprint

#### 10. Form Builder Preview Lag
**Severity**: LOW
**Description**: Complex forms (20+ fields) lag during preview
**Impact**: Slower form building experience
**Workaround**: Save draft frequently
**Proper Fix**: Debounce preview updates, optimize render
**Status**: Nice-to-have optimization

---

## Technical Debt

### Code Quality

#### TypeScript `any` Types
**Location**: Multiple controllers and services
**Impact**: Loss of type safety, potential runtime errors
**Effort**: 2-3 days to audit and replace with proper types
**Priority**: MEDIUM

#### Duplicate Code in CRM Controllers
**Location**: `src/modules/crm/` - contact, organization, interaction controllers
**Impact**: Maintenance burden, inconsistent behavior
**Effort**: 1 day to extract shared logic to base classes
**Priority**: MEDIUM

#### Missing Unit Tests
**Coverage**: ~40% (target: 80%)
**Locations**:
- Workflow execution engine
- Financial calculation services
- BSI validation logic
**Effort**: 5-7 days to reach 80% coverage
**Priority**: HIGH (before Phase 3)

#### Frontend Component Prop Types
**Location**: Various components using `any` for props
**Impact**: Loss of IntelliSense, potential bugs
**Effort**: 3-4 days to define proper interfaces
**Priority**: LOW

### Architecture

#### Monolithic API Routes
**Description**: All API routes in single NestJS application
**Impact**: Difficult to scale specific modules independently
**Refactor**: Extract high-traffic modules to separate services
**Candidates**:
- Reporting service (heavy queries)
- Notification service (async jobs)
- Integration service (external APIs)
**Effort**: 2-3 weeks per service extraction
**Priority**: LOW (sufficient for current scale)

#### Global Exception Filter
**Description**: All errors caught by single handler
**Impact**: Generic error messages, difficult debugging
**Refactor**: Module-specific exception filters with context
**Effort**: 1 week
**Priority**: MEDIUM

#### Prisma Schema Organization
**Description**: Single 1,578-line schema file
**Impact**: Difficult to navigate, merge conflicts
**Refactor**: Split into domain-specific schema files (if Prisma supports)
**Effort**: 1 day (research + implementation)
**Priority**: LOW

#### Frontend Route Organization
**Description**: Some routes deeply nested (4+ levels)
**Impact**: Complex breadcrumbs, confusing navigation
**Refactor**: Flatten route hierarchy where possible
**Effort**: 2-3 days
**Priority**: LOW

### Infrastructure

#### No Automated Rollback
**Description**: Deployment failures require manual rollback
**Impact**: Downtime during failed deployments
**Solution**: Implement Cloud Run traffic splitting + health checks
**Effort**: 1 day
**Priority**: MEDIUM

#### Missing Staging Environment Parity
**Description**: Staging uses smaller database, fewer resources
**Impact**: Production issues not caught in staging
**Solution**: Increase staging resources to match production
**Effort**: Configuration change + cost approval
**Priority**: HIGH

#### No Database Replication
**Description**: Single Cloud SQL instance
**Impact**: No read scaling, potential data loss
**Solution**: Set up read replicas + automated failover
**Effort**: 1 day configuration
**Priority**: LOW (Cloud SQL has automated backups)

#### Secret Rotation Strategy
**Description**: No automated secret rotation
**Impact**: Manual rotation required, potential outages
**Solution**: Implement Secret Manager versioning + rotation schedule
**Effort**: 2 days
**Priority**: LOW

### Documentation

#### Missing API Request/Response Examples
**Description**: OpenAPI spec lacks comprehensive examples
**Impact**: Integration difficulty for external developers
**Solution**: Add examples to all endpoint decorators
**Effort**: 2 days
**Priority**: MEDIUM (before external integrations)

#### Outdated Architecture Diagrams
**Description**: Some diagrams in `/docs/architecture/` are pre-Phase 1
**Impact**: New developers confused by old designs
**Solution**: Update diagrams to reflect current state
**Effort**: 1 day
**Priority**: LOW

#### No Runbook for Common Issues
**Description**: Troubleshooting knowledge in CLAUDE.md only
**Impact**: Slow incident response
**Solution**: Create structured runbooks in `/docs/ops/`
**Effort**: 3-4 days (document known issues)
**Priority**: MEDIUM

---

## Planned Features (Phase 3 & Beyond)

### Phase 3: Profile Builder & Wealth Screener (Q2 2026)

#### Profile Builder (PB) System
**Purpose**: AI-powered donor profile enrichment

**Features**:
- Wealth screening integration (GoMethod)
- Capacity rating (1-5 scale)
- Inclination scoring based on interactions
- Giving history analysis
- Predictive lifetime value
- Portfolio recommendations

**Technical Approach**:
- Integrate GoMethod API for wealth data
- Machine learning model for inclination scoring
- Batch processing for bulk screening
- Real-time enrichment on demand

**UI Components**:
- Profile Builder dashboard
- Capacity/inclination matrix visualization
- Donor portfolio assignment interface
- Screening request management

**Timeline**: 8-10 weeks
**Dependencies**: GoMethod API access, training data

#### Touch Management Model (TMM) Alignment
**Purpose**: Systematize donor engagement cadence

**Features**:
- TMM tag system (High Touch, Medium Touch, Low Touch)
- Auto-assignment based on capacity + inclination
- Touch frequency recommendations
- Engagement tracking against plan
- Deviation alerts

**Technical Approach**:
- Rule engine for TMM assignment
- Scheduled jobs for touch frequency checks
- Dashboard widgets for compliance
- Integration with interaction logging

**UI Components**:
- TMM strategy configuration
- Touch plan calendar view
- Compliance dashboard
- Reassignment workflow

**Timeline**: 4-6 weeks
**Dependencies**: Profile Builder completion

#### Custom Communication Plan (CCP) Automation
**Purpose**: Automate personalized donor journeys

**Features**:
- CCP tag system (Event Attendee, Project Donor, General Supporter, etc.)
- Automated communication sequences
- Trigger-based email campaigns
- SMS/WhatsApp message automation
- Journey analytics

**Technical Approach**:
- Workflow automation for CCP sequences
- Integration with notification service
- Trigger rules based on contact actions
- A/B testing framework for messages

**UI Components**:
- CCP journey builder (visual workflow)
- Communication template library
- Campaign performance dashboard
- Subscriber management

**Timeline**: 6-8 weeks
**Dependencies**: Workflow engine enhancements

#### AI-Powered Decision Assistance
**Purpose**: Intelligent recommendations for staff

**Features**:
- Next-best-action recommendations
- Donor churn prediction
- Optimal ask amount suggestions
- Best contact time predictions
- Automated insights on contact detail pages

**Technical Approach**:
- AgentField AI integration
- Machine learning models for predictions
- Real-time inference via API
- Correlation IDs for tracking

**UI Components**:
- AI insights rail (right sidebar)
- Recommendation cards
- Confidence scores
- Feedback mechanism for training

**Timeline**: 8-10 weeks
**Dependencies**: AgentField integration, training data

**Reference Documents**:
- `/docs/roadmap.md` (Phase 3 section)

---

### Phase 4: Mobile & Production Hardening (Q3-Q4 2026)

#### Mobile App (iOS & Android)
**Purpose**: Field access to CRM and light financial data

**Features**:
- Read-first CRM access
- Contact search and detail views
- Interaction logging (calls, meetings, notes)
- Event check-in with QR codes
- Offline data sync
- Push notifications for tasks

**Technical Stack**:
- React Native (shared codebase)
- TypeScript
- TanStack Query for state
- AsyncStorage for offline
- Firebase Cloud Messaging for push

**Timeline**: 12-16 weeks
**Dependencies**: API stabilization, design system finalization

#### Sage 50 Full Bidirectional Sync
**Purpose**: Real-time financial data sync with desktop accounting

**Features**:
- Live sync of journal entries
- Chart of Accounts synchronization
- Invoice and bill sync
- Payment reconciliation
- Conflict resolution UI

**Technical Approach**:
- Sage 50 SDK/API integration
- Change detection with timestamps
- Queue-based sync jobs
- Retry logic for failures

**Timeline**: 6-8 weeks
**Dependencies**: Sage 50 API access, test environment

#### Performance Optimization Sprint
**Focus Areas**:
- Database query optimization (N+1 elimination)
- API response time reduction (target: under 200ms p95)
- Frontend bundle size reduction
- Image optimization and CDN
- Server-side caching strategy
- Virtual scrolling for large lists

**Timeline**: 3-4 weeks

#### Security Hardening
**Focus Areas**:
- Penetration testing
- SQL injection prevention audit
- XSS protection verification
- CSRF token implementation
- Rate limiting on public endpoints
- IP whitelisting for admin routes

**Timeline**: 2-3 weeks

#### RBAC Regression Testing Suite
**Purpose**: Ensure permissions work correctly across all features

**Features**:
- Automated tests for all permission combinations
- UI component permission gating tests
- API endpoint authorization tests
- Department-based data isolation tests

**Timeline**: 3-4 weeks

#### Production Runbooks
**Deliverables**:
- Incident response playbook
- Database backup/restore procedures
- Deployment rollback procedures
- Common error resolution guides
- Monitoring and alerting setup
- On-call rotation guidelines

**Timeline**: 2-3 weeks

**Reference Documents**:
- `/docs/roadmap.md` (Phase 4 section)
- `/docs/PRODUCTION_READINESS_PLAN.md`

---

## Dependencies & External Factors

### Third-Party Services

#### WhatsApp Provider Decision
**Status**: ⚠️ Blocked
**Options**:
1. **Twilio** - $0.005-0.015/message, verified sender required
2. **Meta Business API** - Free tier available, template approval required

**Decision Factors**:
- Cost at scale (expected 10,000+ messages/month)
- Template approval process
- Delivery rate and reliability
- Developer experience
- Support quality

**Timeline**: Decision needed by April 15, 2026
**Owner**: Communications Director + CTO

#### GoMethod Wealth Screening Integration
**Status**: 📋 Planned for Phase 3
**Requirements**:
- API access agreement
- Pricing negotiation (per-screen fees)
- Test environment access
- Training data for capacity scoring

**Timeline**: Contract by May 1, 2026
**Owner**: Development Director + Finance

#### Plaid Bank Connections
**Status**: ⚠️ Code ready, not activated
**Requirements**:
- Production API keys
- Plaid Link customization
- Webhook endpoint configuration
- Bank account verification flow

**Timeline**: Activate in Q2 2026
**Owner**: Finance Manager

### Internal Dependencies

#### Report Template Definitions
**Status**: ⚠️ Blocked (awaiting stakeholder input)
**Owner**: ELT + Department Heads
**Timeline**: Workshops scheduled for April 2026

**Templates Needed**:
- 5 financial reports
- 3 CRM reports
- 2 event reports
- 2 administrative reports

**Process**:
1. Stakeholder interviews (1 week)
2. Template design (2 weeks)
3. Review and approval (1 week)
4. Implementation (1 week)

#### Staff Training & Onboarding
**Status**: 📋 Planned
**Owner**: System Administrator + Department Heads

**Training Modules**:
1. **Basic Navigation** (1 hour)
   - Login and profile
   - Dashboard customization
   - Module overview

2. **CRM Usage** (2 hours)
   - Contact management
   - Interaction logging
   - Segmentation
   - Email/WhatsApp outreach

3. **Finance Workflows** (2 hours)
   - Invoice creation
   - Expense entry
   - Budget management
   - Reporting

4. **Event Management** (1.5 hours)
   - Event creation
   - Registration handling
   - Communications
   - Check-in procedures

5. **Forms & Workflows** (1 hour)
   - Form builder basics
   - Workflow automation
   - Trigger setup

**Timeline**: Training sessions starting May 2026
**Format**: Video recordings + live sessions + documentation

#### Data Migration Validation
**Status**: ⚠️ Ongoing
**Owner**: Data Team

**Remaining Validations**:
- [ ] Verify all 6,806 contacts migrated correctly
- [ ] Validate interaction history completeness
- [ ] Confirm financial data accuracy (Chart of Accounts)
- [ ] Check event registration data
- [ ] Verify form submission history
- [ ] Audit tag migrations (CCP, TMM, PB)

**Timeline**: Complete by April 30, 2026

---

## Monitoring & Metrics

### Key Performance Indicators (KPIs)

#### System Performance
- **API Response Time**: Target under 200ms (p95)
- **Page Load Time**: Target under 2 seconds (First Contentful Paint)
- **Database Query Time**: Target under 50ms (p95)
- **Uptime**: Target 99.5% (excluding maintenance)
- **Error Rate**: Target under 0.5 percent

#### User Adoption
- **Daily Active Users (DAU)**: Track weekly
- **Feature Usage**: Module-specific usage rates
- **Contact Creation Rate**: New contacts per week
- **Interaction Logging Rate**: Interactions logged per user per week
- **Workflow Execution Count**: Automated actions per day

#### Business Impact
- **Donor Retention Rate**: Year-over-year comparison
- **Average Gift Size**: Trend analysis
- **Event Registration Time**: Time from announcement to full capacity
- **Financial Close Time**: Month-end close duration
- **Report Generation Time**: Time to generate key reports

### Monitoring Tools

#### Current Setup
- **Cloud Logging**: Centralized log aggregation
- **Cloud Trace**: Request tracing
- **Cloud Monitoring**: Infrastructure metrics
- **Firebase Analytics**: User engagement (frontend)

#### Planned Enhancements
- [ ] Set up custom dashboards in Cloud Monitoring
- [ ] Configure alerting policies for key metrics
- [ ] Implement Sentry for error tracking
- [ ] Add user session replay (FullStory/LogRocket)
- [ ] Create weekly KPI email digest
- [ ] Build admin analytics dashboard

---

## Budget & Resource Allocation

### Infrastructure Costs (Monthly Estimate)

#### Current (Staging)
- Cloud Run (API): $5-10
- Cloud Run (Frontend): $3-5
- Cloud SQL: $10-15
- Cloud Storage: $1-2
- Redis (MemoryStore): $5-10
- Secret Manager: under $1
- **Total**: ~$25-45/month

#### Projected (Production at scale)
- Cloud Run (API): $50-100 (higher traffic)
- Cloud Run (Frontend): $20-40
- Cloud SQL: $100-150 (HA + read replicas)
- Cloud Storage: $5-10
- Redis (MemoryStore): $20-30
- Secret Manager: under $1
- Cloud Load Balancer: $20-30
- Cloud Trace/Logging: $10-20
- **Total**: ~$225-380/month

#### Additional Costs
- Stripe fees: 2.9% + $0.30 per transaction
- WhatsApp messages: $0.005-0.015 each (if Twilio)
- GoMethod screening: $2-5 per lookup (Phase 3)
- Plaid connections: $0.25-0.50 per user/month (Phase 3)

### Development Resources

#### Phase 2 Completion (April 2026)
- 1 Backend Developer: 2 weeks
- 1 Frontend Developer: 1 week
- 1 DevOps Engineer: 3 days
- 1 QA Tester: 1 week

#### Phase 3 (Q2 2026)
- 2 Backend Developers: 10 weeks
- 2 Frontend Developers: 8 weeks
- 1 AI/ML Engineer: 6 weeks
- 1 Designer: 4 weeks
- 1 QA Tester: 4 weeks

#### Phase 4 (Q3-Q4 2026)
- 2 Mobile Developers: 16 weeks
- 1 Backend Developer: 8 weeks
- 1 Frontend Developer: 4 weeks
- 1 Security Engineer: 3 weeks
- 1 Technical Writer: 3 weeks

---

## Risk Management

### High-Impact Risks

#### 1. Database Migration Failure
**Probability**: LOW
**Impact**: CRITICAL
**Mitigation**:
- Test migrations on staging first
- Take full database backup before production migration
- Have rollback script ready
- Schedule during low-traffic window
- Have DBA on standby

#### 2. Stripe Production Cutover Issues
**Probability**: MEDIUM
**Impact**: HIGH
**Mitigation**:
- Dual-run test/production keys for 1 week
- Verify webhook signature validation
- Test refund and dispute flows
- Monitor transaction success rate closely
- Have Stripe support on standby

#### 3. User Resistance to Change
**Probability**: MEDIUM
**Impact**: MEDIUM
**Mitigation**:
- Comprehensive training program
- Phased rollout by department
- Super-user champions in each team
- Clear communication about benefits
- Quick support response channel

#### 4. External API Rate Limiting
**Probability**: MEDIUM (GoMethod, Google APIs)
**Impact**: MEDIUM
**Mitigation**:
- Implement exponential backoff
- Queue-based request processing
- Cache API responses where possible
- Monitor rate limit headers
- Have backup manual workflows

### Medium-Impact Risks

#### 5. Cloud Run Cold Start Latency
**Probability**: HIGH (0 min instances)
**Impact**: LOW
**Mitigation**:
- Set min instances to 1 for production
- Implement warming requests
- Optimize Docker image size
- Use build-time optimizations

#### 6. Chart of Accounts Conflicts with Sage 50
**Probability**: MEDIUM
**Impact**: MEDIUM
**Mitigation**:
- Maintain CoA mapping table
- Version CoA changes
- Require approval for account deletions
- Document reconciliation process

#### 7. Mobile App Store Approval Delays
**Probability**: MEDIUM
**Impact**: LOW
**Mitigation**:
- Submit for review early
- Follow store guidelines strictly
- Have TestFlight/beta program ready
- Budget 2-4 weeks for approval

---

## Success Criteria

### Phase 2 Completion
- [x] All code complete and merged
- [ ] Deployed to production Cloud Run
- [ ] All smoke tests passing
- [ ] Zero critical bugs
- [ ] Documentation updated
- [ ] Staff trained on new features
- [ ] Performance metrics within targets

### Phase 3 Goals
- Profile Builder integrated with GoMethod
- 100% of eligible contacts screened
- TMM tags assigned to all donors
- CCP automations running for 3 campaigns
- AI insights delivering recommendations
- 90%+ user satisfaction score

### Phase 4 Goals
- Mobile app live on iOS and Android
- 50%+ of staff using mobile app weekly
- Sage 50 sync running without manual intervention
- 99.5%+ uptime achieved
- Security audit passed with no criticals
- Full production runbooks in place

---

## Communication Plan

### Stakeholder Updates

#### Weekly Standups
- **Audience**: Development team
- **Format**: 15-minute sync
- **Topics**: Progress, blockers, upcoming work

#### Biweekly Sprint Reviews
- **Audience**: Product owner, key stakeholders
- **Format**: 30-minute demo + Q&A
- **Topics**: Completed features, upcoming priorities

#### Monthly Executive Updates
- **Audience**: ELT, Finance, Department Heads
- **Format**: Written report + optional meeting
- **Topics**: Phase progress, budget, timeline, risks

#### Quarterly All-Hands
- **Audience**: All staff
- **Format**: Presentation + Q&A
- **Topics**: Vision, roadmap, achievements, training

### Documentation Updates

#### Continuous
- CLAUDE.md - Updated with every significant decision
- NEXT_STEPS.md - Updated weekly
- Roadmap - Updated monthly

#### On Completion
- Architecture docs - After major refactors
- API docs - After endpoint changes
- User guides - After feature releases
- Runbooks - After incident resolutions

---

## Conclusion

Vireo is on track for successful Phase 2 deployment and positioned for strong Phase 3 and 4 execution. The primary focus for the next 30 days is deployment verification and operational readiness, followed by Phase 3 planning and resource allocation.

### Critical Path
1. **Week 1-2**: Deploy Phase 2, verify smoke tests, configure production services
2. **Week 3**: Staff training on new features (IVI, outreach, workflows)
3. **Week 4**: Monitor production stability, gather feedback, begin Phase 3 design

### Key Decisions Needed
- WhatsApp provider selection (by April 15)
- GoMethod contract negotiation (by May 1)
- Report template definitions (workshops in April)
- Phase 3 resource allocation (by May 15)

### Support Channels
- **Technical Issues**: GitHub Issues or Cloud Logging alerts
- **User Questions**: Internal Slack channel (#vireo-support)
- **Feature Requests**: Google Form → Product backlog
- **Urgent Issues**: On-call engineer (PagerDuty)

**Last Updated**: March 27, 2026
**Next Review**: April 10, 2026
**Document Owner**: CTO + Product Manager
