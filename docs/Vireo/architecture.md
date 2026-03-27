# Vireo Architecture

## System Overview

Vireo is built as a **modular monolith** with clear boundaries between business domains, designed to support future microservice extraction while maintaining development velocity. The system follows domain-driven design principles with event-driven communication patterns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Dashboard │ Mobile PWA │ Swagger API Documentation    │
│  React 18.2        │ (Planned)  │ REST Endpoints               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                          ┌─────────┴─────────┐
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│   NestJS REST API │ Firebase Auth Guard │ Permission Guards    │
│   25+ Controllers │ Request Context     │ Audit Interceptors   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                          ┌─────────┴─────────┐
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│ CRM │ Finance │ Events │ Forms │ Tasks │ Workflows │ Reporting  │
│ Auth │ SKU │ Agents │ Automation │ Integrations │ Webhooks     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                          ┌─────────┴─────────┐
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL DB │ Prisma ORM │ Redis Cache │ Cloud Storage      │
│  1,578 line    │ Connection │ BullMQ      │ File Uploads       │
│  Schema        │ Pooling    │ Queues      │                    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                          ┌─────────┴─────────┐
┌─────────────────────────────────────────────────────────────────┐
│                      INTEGRATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│ Google OAuth │ Stripe Payments │ Gmail │ Drive │ Sheets        │
│ GoMethod │ Otter.ai │ Twilio │ Plaid │ Sage 50 │ AgentField    │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Backend Stack

#### Core Framework
- **NestJS 11.0** - Enterprise-grade TypeScript framework
  - Dependency injection container
  - Module system with clear boundaries
  - Decorator-based architecture
  - Built-in testing utilities
  - OpenAPI/Swagger integration

#### Language & Runtime
- **TypeScript 5.4** - Type-safe development
- **Node.js 18+** - LTS runtime with modern features
- **ts-node-dev** - Development hot-reload
- **ts-node** - Production execution

#### Database & ORM
- **PostgreSQL** - Primary relational database
  - JSONB support for flexible metadata
  - Full-text search capabilities
  - Advanced indexing strategies
  - Row-level security (future)

- **Prisma 6.18** - Next-generation ORM
  - Type-safe database client
  - Automatic migrations
  - Connection pooling
  - Query optimization
  - 1,578-line schema with 60+ models

#### Authentication & Security
- **Firebase Admin SDK 13.5** - User authentication
  - Google OAuth 2.0 integration
  - Domain-restricted access
  - Token verification
  - Custom claims for permissions

- **Passport 0.7** - Authentication middleware
  - Google OAuth strategy
  - Custom Firebase strategy
  - Session management

#### Queue System
- **BullMQ 5.65** - Distributed job queue
  - Redis-backed persistence
  - Job scheduling and retries
  - Progress tracking
  - Event notifications

- **IORedis 5.8** - Redis client
  - Connection pooling
  - Cluster support
  - Lua script execution

#### External Services
- **Stripe 18.5** - Payment processing
  - Webhooks for events
  - Payment intents
  - Customer management
  - Invoice generation

- **Plaid 39.1** - Bank connections
  - Account linking
  - Transaction sync
  - Balance checking

- **Google APIs 169.0** - Workspace integration
  - Gmail API
  - Google Drive API
  - Google Sheets API
  - Calendar API

- **Nodemailer 7.0** - Email sending
  - SMTP transport
  - HTML templates
  - Attachment support

#### Validation & Transformation
- **class-validator 0.14** - DTO validation
- **class-transformer 0.5** - Object mapping
- **zod** (frontend) - Schema validation

#### Development Tools
- **Jest 29.7** - Testing framework
- **ESLint 8.56** - Code linting
- **Prettier 3.2** - Code formatting
- **TypeScript ESLint 7.0** - TypeScript linting

### Frontend Stack

#### Core Framework
- **Next.js 14.2** - React framework
  - App Router (not Pages Router)
  - Server Components
  - API Routes
  - Image Optimization
  - Automatic code splitting

- **React 18.2** - UI library
  - Concurrent rendering
  - Server Components
  - Suspense boundaries
  - Error boundaries

#### Styling System
- **Tailwind CSS 3.4** - Utility-first CSS
  - Custom design tokens
  - Dark/light theme support
  - Responsive design
  - JIT compilation

- **Custom Design System** - Vireo UI Kit
  - Typography tokens (Space Grotesk, Inter)
  - Color primitives (60+ tokens)
  - Spacing scale (4-64px)
  - Border radius system
  - Shadow definitions
  - Motion/animation presets
  - Data visualization colors

#### State Management
- **TanStack Query (React Query)** - Server state
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Mutation management
  - Infinite queries

- **React Context** - Client state
  - Auth context
  - Theme context
  - User preferences

#### Form Management
- **React Hook Form** - Form state
  - Uncontrolled inputs
  - Validation integration
  - Performance optimization

- **Zod** - Schema validation
  - Type inference
  - Error messages
  - Composition

#### UI Components
- **Custom Component Library** - Built in-house
  - Button, Input, Select variants
  - Modal, Drawer, Popover
  - Table with pagination
  - Card, Badge, Tag
  - Alert, Toast, Snackbar
  - Skeleton loaders
  - Empty states

- **Lucide React** - Icon system (1000+ icons)
- **@dnd-kit** - Drag and drop (Kanban, form builder)
- **Recharts 2.10** - Chart library
- **@visx** - Advanced visualizations
- **React Dropzone 14.3** - File uploads
- **React Plaid Link 3.6** - Bank connection UI

#### Data Display
- **TanStack Table** - Advanced tables
  - Server pagination
  - Column sorting
  - Filtering
  - Row selection
  - Column resizing
  - Virtual scrolling (future)

#### Build Tools
- **PostCSS 8.4** - CSS processing
- **Autoprefixer 10.4** - Browser prefixes
- **TypeScript 5.4** - Type checking
- **ESLint** - Code quality
- **Prettier** - Code formatting

### Infrastructure Stack

#### Cloud Platform (Google Cloud Platform)
- **Cloud Run** - Serverless containers
  - Auto-scaling (0-1000 instances)
  - Pay-per-request pricing
  - No infrastructure management
  - Automatic HTTPS
  - Multi-region deployment

- **Cloud SQL** - Managed PostgreSQL
  - Automated backups
  - Point-in-time recovery
  - High availability
  - Private IP networking
  - Connection pooling via Prisma

- **Cloud Storage** - Object storage
  - File uploads (receipts, forms)
  - Static asset hosting
  - CDN integration
  - Lifecycle policies

- **Secret Manager** - Secret storage
  - Encrypted at rest
  - Versioned secrets
  - IAM-controlled access
  - Automatic rotation support

- **Cloud Build** - CI/CD pipeline
  - GitHub integration
  - Docker image builds
  - Multi-stage deployments
  - Automated testing

- **Cloud Logging** - Centralized logs
  - Structured JSON logs
  - Log-based metrics
  - Real-time monitoring

- **Cloud Trace** - Distributed tracing
  - Request latency tracking
  - Service dependencies
  - Performance bottlenecks

#### Container & Deployment
- **Docker** - Containerization
  - Multi-stage builds
  - Layer caching
  - Security scanning

- **GitHub Actions** (potential) - Workflow automation
- **Makefile** - Development scripts

#### Monitoring & Observability
- **Structured Logging** - JSON format
  - Request/response logging
  - Error tracking
  - Performance metrics
  - Audit trails

- **Health Checks** - System status
  - `/health` endpoint
  - Database connectivity
  - Redis connectivity
  - External service status

## Database Architecture

### Prisma Schema Overview

The database schema is defined in a comprehensive 1,578-line Prisma schema file containing 60+ models.

### Core Database Models

#### Identity & Access
```prisma
model User {
  id: String (Primary Key)
  email: String (Unique)
  displayName: String?
  photoURL: String?
  provider: String
  providerId: String
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  permissions: UserPermission[]
  auditLogs: AuditLog[]
  interactions: Interaction[]
}

model UserPermission {
  id: String (Primary Key)
  userId: String (Foreign Key)
  scope: String
  department: String?
  canRead: Boolean
  canWrite: Boolean
  canDelete: Boolean
  canApprove: Boolean
  createdAt: DateTime

  user: User
}

model AuditLog {
  id: String (Primary Key)
  tableName: String (Indexed)
  recordId: String (Indexed)
  action: AuditAction (CREATE, UPDATE, DELETE)
  oldValues: JSON?
  newValues: JSON?
  changedFields: String[]
  userId: String? (Foreign Key)
  sessionId: String?
  ipAddress: String?
  userAgent: String?
  skuId: String?
  reason: String?
  source: String?
  createdAt: DateTime (Indexed)

  user: User?
}
```

#### CRM Models
```prisma
model Contact {
  id: String (Primary Key)
  firstName: String?
  lastName: String?
  fullName: String (Indexed)
  email: String? (Indexed)
  phone: String?
  mobilePhone: String?
  workPhone: String?
  organizationId: String? (Foreign Key)
  assignedTo: String? (Indexed)
  status: ContactStatus
  type: String?
  source: String?
  tags: String[] (Indexed with GIN)
  customFields: JSON
  address: JSON
  socialMedia: JSON
  preferences: JSON
  ivi: String? (Unique) // Legacy DonorSnap IPK
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  organization: Organization?
  interactions: Interaction[]
  donations: Donation[]
  registrations: EventRegistration[]
  tasks: TaskAssignment[]
  segments: SegmentMember[]
  mergedFrom: ContactMerge[]
  mergedInto: ContactMerge[]
}

model Organization {
  id: String (Primary Key)
  name: String (Indexed)
  type: OrganizationType
  parentId: String? (Foreign Key)
  level: Int (1-3 hierarchy)
  description: String?
  website: String?
  address: JSON
  metadata: JSON
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  parent: Organization?
  children: Organization[]
  contacts: Contact[]
  primaryContact: ContactOrgRole?
  roles: ContactOrgRole[]
}

model ContactOrgRole {
  id: String (Primary Key)
  contactId: String (Foreign Key)
  organizationId: String (Foreign Key)
  role: String?
  title: String?
  department: String?
  isPrimary: Boolean
  isActive: Boolean
  startDate: DateTime?
  endDate: DateTime?
  createdAt: DateTime
  updatedAt: DateTime

  contact: Contact
  organization: Organization
}

model Interaction {
  id: String (Primary Key)
  contactId: String (Foreign Key, Indexed)
  type: InteractionType (EMAIL, CALL, MEETING, NOTE, WHATSAPP)
  subject: String
  description: String?
  outcome: String?
  nextAction: String?
  nextActionDate: DateTime?
  userId: String (Foreign Key)
  metadata: JSON
  attachments: JSON?
  createdAt: DateTime

  contact: Contact
  user: User
}

model Segment {
  id: String (Primary Key)
  name: String
  description: String?
  criteria: JSON (Filter rules)
  isAutoRefresh: Boolean
  refreshCron: String?
  lastRefreshed: DateTime?
  memberCount: Int
  createdAt: DateTime
  updatedAt: DateTime

  members: SegmentMember[]
}
```

#### BSI (Builders Service Identifier) Models
```prisma
model Sku {
  id: String (Primary Key)
  code: String (Unique, Indexed)
  // Format: REGION-COUNTRY-PROJECT-TEAM-EVENT-SUFFIX

  region: String (2 chars)
  country: String (3 chars, ISO 3166-1 alpha-3)
  projectId: String?
  teamId: String?
  eventId: String?
  suffix: String?

  description: String?
  status: SkuStatus
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  project: Project?
  team: Team?
  event: Event?
  budgets: Budget[]
  donations: Donation[]
  expenses: Expense[]
}

model Project {
  id: String (Primary Key)
  name: String
  description: String?
  status: ProjectStatus
  startDate: DateTime?
  endDate: DateTime?
  budget: Decimal?
  skuId: String? (Foreign Key)
  managerId: String?
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime

  sku: Sku?
  teams: Team[]
  budgets: Budget[]
  accounts: ProjectAccount[]
}

model Team {
  id: String (Primary Key)
  name: String
  description: String?
  projectId: String? (Foreign Key)
  skuId: String? (Foreign Key)
  leaderId: String?
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime

  project: Project?
  sku: Sku?
  members: TeamMember[]
  events: Event[]
}
```

#### Finance Models
```prisma
model ChartOfAccount {
  id: String (Primary Key)
  code: String (Unique)
  accountCode: String?
  name: String
  accountName: String?
  description: String?
  section: String?
  major: Int?
  minor: Int?
  accountType: AccountType (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
  normalBalance: String?
  parentId: String? (Foreign Key, hierarchical)
  isActive: Boolean
  isSystem: Boolean
  tenantId: String? (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime

  // Relations
  parent: ChartOfAccount?
  children: ChartOfAccount[]
  journalLines: JournalLine[]
  transactionLines: TransactionLine[]
  invoiceLines: InvoiceLine[]
  budgets: Budget[]
  projectAccounts: ProjectAccount[]
}

model JournalEntry {
  id: String (Primary Key)
  entryNumber: String (Unique)
  date: DateTime (Indexed)
  description: String
  reference: String?
  totalDebit: Decimal
  totalCredit: Decimal
  isBalanced: Boolean
  status: JournalStatus (DRAFT, POSTED, REVERSED)
  userId: String
  createdAt: DateTime
  updatedAt: DateTime

  lines: JournalLine[]
}

model JournalLine {
  id: String (Primary Key)
  journalEntryId: String (Foreign Key)
  debitAccountId: String? (Foreign Key)
  creditAccountId: String? (Foreign Key)
  description: String?
  debit: Decimal
  credit: Decimal
  lineNumber: Int
  skuId: String?
  metadata: JSON?
  createdAt: DateTime

  journalEntry: JournalEntry
  debitAccount: ChartOfAccount?
  creditAccount: ChartOfAccount?
}

model Budget {
  id: String (Primary Key)
  name: String
  description: String?
  budgetType: BudgetType (ANNUAL, PROJECT, DEPARTMENT)
  accountId: String (Foreign Key)
  skuId: String? (Foreign Key)
  fiscalYear: Int
  budgetYear: Int?
  startDate: DateTime
  endDate: DateTime
  originalAmount: Decimal
  revisedAmount: Decimal?
  currentAmount: Decimal
  status: BudgetStatus (DRAFT, ACTIVE, CLOSED)
  projectId: String? (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: String

  chartOfAccount: ChartOfAccount
  sku: Sku?
  project: Project?
  budgetLines: BudgetLine[]
}

model Invoice {
  id: String (Primary Key)
  invoiceNumber: String (Unique)
  customerId: String (Foreign Key - Contact or Org)
  customerType: String (CONTACT, ORGANIZATION)
  issueDate: DateTime
  dueDate: DateTime
  status: InvoiceStatus (DRAFT, SENT, PAID, OVERDUE, VOID)
  subtotal: Decimal
  taxAmount: Decimal?
  discountAmount: Decimal?
  totalAmount: Decimal
  paidAmount: Decimal
  balanceRemaining: Decimal
  notes: String?
  terms: String?
  skuId: String?
  createdAt: DateTime
  updatedAt: DateTime

  lines: InvoiceLine[]
  payments: Payment[]
}
```

#### Events & Forms Models
```prisma
model Event {
  id: String (Primary Key)
  name: String
  description: String?
  eventType: EventType
  startDate: DateTime
  endDate: DateTime?
  location: String?
  capacity: Int?
  registrationDeadline: DateTime?
  status: EventStatus (DRAFT, PUBLISHED, ACTIVE, COMPLETED, CANCELLED)
  skuId: String? (Foreign Key)
  teamId: String? (Foreign Key)
  formId: String? (Foreign Key)
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime

  sku: Sku?
  team: Team?
  form: Form?
  registrations: EventRegistration[]
  communications: Communication[]
  pledges: Pledge[]
}

model EventRegistration {
  id: String (Primary Key)
  eventId: String (Foreign Key)
  contactId: String? (Foreign Key)
  email: String
  firstName: String
  lastName: String
  phone: String?
  status: RegistrationStatus
  registrationDate: DateTime
  paymentStatus: PaymentStatus
  amountPaid: Decimal?
  metadata: JSON
  formSubmissionId: String?
  createdAt: DateTime
  updatedAt: DateTime

  event: Event
  contact: Contact?
  payments: Payment[]
}

model Form {
  id: String (Primary Key)
  name: String
  description: String?
  formType: FormType (REGISTRATION, SURVEY, DONATION, CUSTOM)
  schema: JSON (Form field definitions)
  validation: JSON?
  styling: JSON?
  status: FormStatus (DRAFT, PUBLISHED, ARCHIVED)
  isPublic: Boolean
  tenantId: String? (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: String

  submissions: FormSubmission[]
  events: Event[]
}

model FormSubmission {
  id: String (Primary Key)
  formId: String (Foreign Key)
  data: JSON (Submitted values)
  contactId: String? (Foreign Key)
  ipAddress: String?
  userAgent: String?
  status: SubmissionStatus
  createdAt: DateTime
  updatedAt: DateTime

  form: Form
  contact: Contact?
}
```

#### Task Management Models
```prisma
model Task {
  id: String (Primary Key)
  title: String
  description: String?
  status: TaskStatus (TODO, IN_PROGRESS, REVIEW, DONE)
  priority: TaskPriority (LOW, MEDIUM, HIGH, URGENT)
  dueDate: DateTime?
  projectId: String? (Foreign Key)
  parentTaskId: String? (Foreign Key)
  estimatedHours: Decimal?
  actualHours: Decimal?
  tags: String[]
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: String

  project: Project?
  parentTask: Task?
  subtasks: Task[]
  assignments: TaskAssignment[]
  timeEntries: TimeEntry[]
  comments: TaskComment[]
}

model TaskAssignment {
  id: String (Primary Key)
  taskId: String (Foreign Key)
  userId: String? (Foreign Key)
  contactId: String? (Foreign Key)
  role: String?
  createdAt: DateTime

  task: Task
  user: User?
  contact: Contact?
}

model TimeEntry {
  id: String (Primary Key)
  taskId: String (Foreign Key)
  userId: String (Foreign Key)
  hours: Decimal
  date: DateTime
  description: String?
  isBillable: Boolean
  hourlyRate: Decimal?
  status: TimeEntryStatus (DRAFT, SUBMITTED, APPROVED, REJECTED)
  createdAt: DateTime
  updatedAt: DateTime

  task: Task
  user: User
}
```

#### Workflow Models
```prisma
model Workflow {
  id: String (Primary Key)
  name: String
  description: String?
  trigger: JSON (Trigger configuration)
  nodes: JSON (Node definitions)
  edges: JSON (Connection definitions)
  status: WorkflowStatus (DRAFT, ACTIVE, PAUSED, ARCHIVED)
  createdAt: DateTime
  updatedAt: DateTime
  createdBy: String

  runs: WorkflowRun[]
}

model WorkflowRun {
  id: String (Primary Key)
  workflowId: String (Foreign Key)
  status: RunStatus (RUNNING, COMPLETED, FAILED, CANCELLED)
  startedAt: DateTime
  completedAt: DateTime?
  input: JSON?
  output: JSON?
  logs: JSON[]
  errorMessage: String?
  metadata: JSON

  workflow: Workflow
}
```

### Database Indexes

Key indexes for performance:

```sql
-- Contact indexes
CREATE INDEX idx_contact_fullname ON "Contact"(full_name);
CREATE INDEX idx_contact_email ON "Contact"(email);
CREATE INDEX idx_contact_assigned ON "Contact"(assigned_to);
CREATE INDEX idx_contact_tags ON "Contact" USING GIN(tags);

-- Interaction indexes
CREATE INDEX idx_interaction_contact ON "Interaction"(contact_id);
CREATE INDEX idx_interaction_created ON "Interaction"(created_at DESC);

-- Journal Entry indexes
CREATE INDEX idx_journal_entry_date ON "JournalEntry"(date DESC);
CREATE INDEX idx_journal_entry_status ON "JournalEntry"(status);

-- Audit Log indexes
CREATE INDEX idx_audit_log_table_record ON "AuditLog"(table_name, record_id);
CREATE INDEX idx_audit_log_user ON "AuditLog"(user_id);
CREATE INDEX idx_audit_log_created ON "AuditLog"(created_at DESC);

-- SKU indexes
CREATE INDEX idx_sku_code ON "Sku"(code);
CREATE INDEX idx_sku_project ON "Sku"(project_id);
```

### Database Migrations

Prisma migrations are stored in `prisma/migrations/` with timestamps and descriptive names:

```
prisma/migrations/
├── 20250901_init/
├── 20250915_add_ivi_field/
├── 20251120_bsi_backfill/
├── 20251201_workflow_tables/
└── 20260302_contact_tags/
```

Migration workflow:
```bash
# Development
npx prisma migrate dev --name description

# Production
npx prisma migrate deploy
```

## API Architecture

### Module Organization

The backend is organized into 24 modules following NestJS conventions:

```
src/modules/
├── agents/           # AI agent system
├── app.module.ts     # Root application module
├── audit/            # Audit logging service
├── auth/             # Authentication & permissions
├── automation/       # Automation rules engine
├── configuration/    # System configuration
├── crm/              # Contact & organization management
├── dashboard/        # Dashboard widgets and KPIs
├── data-import/      # Data import services
├── database/         # Prisma service and health
├── finance/          # Financial management
├── forms/            # Form builder and submissions
├── health/           # Health check endpoints
├── integrations/     # External service integrations
├── journal-entries/  # Journal entry management
├── nextjs/           # Next.js integration (future)
├── notifications/    # Email and notification service
├── payments/         # Stripe payment processing
├── reporting/        # Report generation
├── shared/           # Shared utilities and DTOs
├── sku/              # BSI management
├── tasks/            # Task management
├── webhooks/         # Webhook receivers
└── workflows/        # Workflow automation engine
```

### REST API Endpoints

25 controllers expose comprehensive REST APIs:

#### Authentication (`/auth`)
```
POST   /auth/verify              - Verify Firebase token
POST   /auth/google              - Google OAuth callback
GET    /auth/me                  - Current user profile
GET    /auth/users               - List all users
GET    /auth/users/:id           - Get user details
PUT    /auth/users/:id           - Update user
POST   /auth/users/invite        - Invite new user
```

#### Permissions (`/permissions`)
```
GET    /permissions/all          - List all permissions
GET    /permissions/user/:id     - User permissions
PUT    /permissions/user/:id     - Update user permissions
POST   /permissions/delegate     - Delegate access
```

#### CRM - Contacts (`/crm/contacts`)
```
GET    /crm/contacts             - List contacts (paginated)
POST   /crm/contacts             - Create contact
GET    /crm/contacts/:id         - Get contact details
PUT    /crm/contacts/:id         - Update contact
DELETE /crm/contacts/:id         - Delete contact
POST   /crm/contacts/search      - Advanced search
POST   /crm/contacts/dedupe      - Find duplicates
POST   /crm/contacts/merge       - Merge contacts
GET    /crm/contacts/:id/interactions - Interaction history
POST   /crm/contacts/:id/interactions - Log interaction
GET    /crm/contacts/:id/donations    - Donation history
```

#### CRM - Organizations (`/crm/organizations`)
```
GET    /crm/organizations        - List organizations
POST   /crm/organizations        - Create organization
GET    /crm/organizations/:id    - Get organization
PUT    /crm/organizations/:id    - Update organization
DELETE /crm/organizations/:id    - Delete organization
GET    /crm/organizations/:id/contacts - Linked contacts
POST   /crm/organizations/:id/contacts - Link contact
```

#### CRM - Segments (`/crm/segments`)
```
GET    /crm/segments             - List segments
POST   /crm/segments             - Create segment
GET    /crm/segments/:id         - Get segment
PUT    /crm/segments/:id         - Update segment
DELETE /crm/segments/:id         - Delete segment
POST   /crm/segments/:id/refresh - Refresh members
GET    /crm/segments/:id/export  - Export segment
```

#### Finance - Chart of Accounts (`/finance/chart-of-accounts`)
```
GET    /finance/chart-of-accounts - List accounts (tree)
POST   /finance/chart-of-accounts - Create account
GET    /finance/chart-of-accounts/:id - Get account
PUT    /finance/chart-of-accounts/:id - Update account
DELETE /finance/chart-of-accounts/:id - Delete account
GET    /finance/chart-of-accounts/:id/balance - Account balance
```

#### Finance - Journal Entries (`/journal-entries`)
```
GET    /journal-entries          - List entries
POST   /journal-entries          - Create entry
GET    /journal-entries/:id      - Get entry
PUT    /journal-entries/:id      - Update entry
DELETE /journal-entries/:id      - Delete entry
POST   /journal-entries/:id/post - Post entry
POST   /journal-entries/:id/reverse - Reverse entry
```

#### Finance - Budgets (`/finance/budgets`)
```
GET    /finance/budgets          - List budgets
POST   /finance/budgets          - Create budget
GET    /finance/budgets/:id      - Get budget
PUT    /finance/budgets/:id      - Update budget
DELETE /finance/budgets/:id      - Delete budget
GET    /finance/budgets/:id/variance - Variance report
```

#### Finance - Invoices (`/finance/invoices`)
```
GET    /finance/invoices         - List invoices
POST   /finance/invoices         - Create invoice
GET    /finance/invoices/:id     - Get invoice
PUT    /finance/invoices/:id     - Update invoice
DELETE /finance/invoices/:id     - Delete invoice
POST   /finance/invoices/:id/send - Send invoice
POST   /finance/invoices/:id/void - Void invoice
GET    /finance/invoices/:id/pdf  - Generate PDF
```

#### Events (`/events`)
```
GET    /events                   - List events
POST   /events                   - Create event
GET    /events/:id               - Get event
PUT    /events/:id               - Update event
DELETE /events/:id               - Delete event
GET    /events/:id/registrations - List registrations
POST   /events/:id/register      - Register attendee
GET    /events/:id/export        - Export attendee list
```

#### Forms (`/forms`)
```
GET    /forms                    - List forms
POST   /forms                    - Create form
GET    /forms/:id                - Get form
PUT    /forms/:id                - Update form
DELETE /forms/:id                - Delete form
POST   /forms/:id/publish        - Publish form
GET    /forms/:id/submissions    - List submissions
POST   /forms/:id/submit         - Submit form (public)
```

#### Tasks (`/tasks`)
```
GET    /tasks                    - List tasks
POST   /tasks                    - Create task
GET    /tasks/:id                - Get task
PUT    /tasks/:id                - Update task
DELETE /tasks/:id                - Delete task
POST   /tasks/:id/assign         - Assign task
POST   /tasks/:id/comment        - Add comment
GET    /tasks/:id/time-entries   - Time entries
POST   /tasks/:id/time-entries   - Log time
```

#### Workflows (`/workflows`)
```
GET    /workflows                - List workflows
POST   /workflows                - Create workflow
GET    /workflows/:id            - Get workflow
PUT    /workflows/:id            - Update workflow
DELETE /workflows/:id            - Delete workflow
POST   /workflows/:id/activate   - Activate workflow
POST   /workflows/:id/run        - Manual run
GET    /workflows/:id/runs       - Run history
GET    /workflows/:id/runs/:runId - Run details
```

#### Projects (`/projects`)
```
GET    /projects                 - List projects
POST   /projects                 - Create project
GET    /projects/:id             - Get project
PUT    /projects/:id             - Update project
DELETE /projects/:id             - Delete project
GET    /projects/:id/giving      - Giving rollup
GET    /projects/:id/budget      - Budget summary
```

#### SKU (BSI) (`/sku`)
```
GET    /sku                      - List SKUs
POST   /sku                      - Create SKU
GET    /sku/:code                - Get SKU by code
PUT    /sku/:code                - Update SKU
DELETE /sku/:code                - Delete SKU
GET    /sku/:code/financials     - Financial rollup
```

#### Reporting (`/reporting`)
```
GET    /reporting/templates      - List report templates
POST   /reporting/templates      - Create template
GET    /reporting/templates/:id  - Get template
POST   /reporting/run            - Run report
GET    /reporting/exports/:id    - Download export
POST   /reporting/schedule       - Schedule report
```

#### Data Import (`/data-import`)
```
POST   /data-import/contacts     - Import contacts CSV
POST   /data-import/donations    - Import donations CSV
POST   /data-import/sage50       - Import Sage 50 data
GET    /data-import/jobs         - List import jobs
GET    /data-import/jobs/:id     - Job status
```

#### Payments (`/payments`)
```
POST   /payments/stripe/webhook  - Stripe webhook receiver
GET    /payments/stripe/:id      - Payment details
POST   /payments/stripe/refund   - Process refund
```

#### Health (`/health`)
```
GET    /health                   - System health status
GET    /health/db                - Database connectivity
GET    /health/redis             - Redis connectivity
```

### Request/Response Patterns

#### Standard Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
  };
}
```

#### Pagination
```typescript
interface PaginatedRequest {
  page?: number;        // Default: 1
  limit?: number;       // Default: 20, max: 100
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
```

#### Error Responses
```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
```

### Authentication & Authorization

#### Firebase Auth Flow
```
1. User signs in with Google OAuth (frontend)
2. Firebase returns ID token
3. Frontend sends token to /auth/verify
4. Backend verifies token with Firebase Admin SDK
5. Backend looks up user permissions in database
6. Backend returns user profile + permissions
7. Frontend stores in auth context
8. Subsequent requests include Authorization: Bearer <token>
```

#### Permission Guard
```typescript
@UseGuards(FirebaseAuthGuard, PermissionGuard)
@RequirePermission('crm', 'write')
@Post('/crm/contacts')
async createContact(@Body() dto: CreateContactDto) {
  // Only accessible if user has 'crm:write' permission
}
```

#### Request Context
```typescript
interface RequestContext {
  user: {
    id: string;
    email: string;
    displayName: string;
    permissions: string[];
    department?: string;
  };
  session: {
    id: string;
    ipAddress: string;
    userAgent: string;
  };
  tenant?: {
    id: string;
    slug: string;
  };
}
```

### Audit Logging

All mutations are automatically logged via NestJS interceptor:

```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body } = request;

    return next.handle().pipe(
      tap(response => {
        this.auditService.log({
          userId: user?.id,
          action: method,
          resource: url,
          oldValues: request.originalData,
          newValues: response,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }
}
```

## Frontend Architecture

### Next.js App Router Structure

```
frontend/src/app/
├── (auth)/                    # Auth route group
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── layout.tsx            # Auth layout (no app shell)
├── admin/                     # Admin module
│   ├── permissions/
│   │   └── page.tsx
│   ├── users/
│   │   ├── page.tsx          # User list
│   │   └── [id]/
│   │       └── page.tsx      # User detail
│   └── layout.tsx
├── crm/                       # CRM module
│   ├── contacts/
│   │   ├── page.tsx          # Contact list
│   │   ├── [id]/
│   │   │   └── page.tsx      # Contact detail
│   │   └── new/
│   │       └── page.tsx      # Create contact
│   ├── organizations/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── segments/
│   │   └── page.tsx
│   └── layout.tsx
├── finance/                   # Finance module
│   ├── chart-of-accounts/
│   │   └── page.tsx
│   ├── journal-entries/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── budgets/
│   │   └── page.tsx
│   ├── invoices/
│   │   └── page.tsx
│   └── layout.tsx
├── events/                    # Events module
│   ├── page.tsx              # Event list
│   ├── [id]/
│   │   ├── page.tsx          # Event detail
│   │   └── registrations/
│   │       └── page.tsx
│   └── layout.tsx
├── forms/                     # Forms module
│   ├── page.tsx              # Form list
│   ├── builder/
│   │   └── [id]/
│   │       └── page.tsx      # Form builder
│   └── layout.tsx
├── tasks/                     # Tasks module
│   ├── page.tsx              # Kanban board
│   └── [id]/
│       └── page.tsx          # Task detail
├── workflows/                 # Workflows module
│   ├── page.tsx              # Workflow list
│   ├── builder/
│   │   └── [id]/
│   │       └── page.tsx      # Workflow builder
│   └── runs/
│       └── [id]/
│           └── page.tsx      # Run details
├── sku/                       # BSI management
│   ├── page.tsx
│   └── [code]/
│       └── page.tsx
├── elt-dashboard/             # ELT dashboard
│   └── page.tsx
├── dashboard/                 # User dashboard
│   └── page.tsx
├── page.tsx                   # Home/landing
├── layout.tsx                 # Root layout
└── error.tsx                  # Error boundary
```

### Component Library Structure

```
frontend/src/components/
├── auth/
│   ├── AuthProvider.tsx          # Auth context provider
│   ├── AuthErrorBoundary.tsx     # Auth error handling
│   └── ProtectedRoute.tsx        # Route guard
├── layout/
│   ├── AppLayout.tsx             # Main app shell
│   ├── AppHeader.tsx             # Top navigation
│   ├── AppSidebar.tsx            # Left rail navigation
│   ├── ModuleHero.tsx            # Page header component
│   └── Breadcrumbs.tsx           # Breadcrumb navigation
├── ui/
│   ├── Button.tsx                # Button variants
│   ├── Input.tsx                 # Text input
│   ├── Select.tsx                # Dropdown select
│   ├── Modal.tsx                 # Modal dialog
│   ├── Drawer.tsx                # Side drawer
│   ├── Popover.tsx               # Popover component
│   ├── Table.tsx                 # Data table
│   ├── Card.tsx                  # Card container
│   ├── Badge.tsx                 # Status badge
│   ├── Tag.tsx                   # Tag chip
│   ├── Alert.tsx                 # Alert banner
│   ├── Toast.tsx                 # Toast notification
│   ├── Skeleton.tsx              # Loading skeleton
│   ├── EmptyState.tsx            # Empty placeholder
│   ├── Spinner.tsx               # Loading spinner
│   ├── Tabs.tsx                  # Tab navigation
│   ├── Accordion.tsx             # Accordion panel
│   └── Progress.tsx              # Progress bar
├── forms/
│   ├── FormBuilder.tsx           # Drag-drop form builder
│   ├── FormField.tsx             # Form field wrapper
│   ├── FormPreview.tsx           # Form preview
│   └── FormSubmit.tsx            # Public form view
├── crm/
│   ├── ContactCard.tsx           # Contact summary card
│   ├── ContactTable.tsx          # Contact data table
│   ├── ContactSearch.tsx         # Advanced search
│   ├── ContactMerge.tsx          # Merge interface
│   ├── InteractionLog.tsx        # Interaction history
│   └── SegmentBuilder.tsx        # Segment criteria
├── finance/
│   ├── CoATree.tsx               # Account hierarchy tree
│   ├── JournalEntryForm.tsx      # Entry creation
│   ├── BudgetVariance.tsx        # Variance chart
│   └── InvoicePreview.tsx        # Invoice PDF preview
├── workflows/
│   ├── WorkflowBuilder.tsx       # Node-based editor
│   ├── WorkflowNode.tsx          # Node component
│   ├── WorkflowInspector.tsx     # Node properties
│   └── WorkflowRunLog.tsx        # Run history
├── tasks/
│   ├── KanbanBoard.tsx           # Kanban view
│   ├── TaskCard.tsx              # Task card
│   ├── TaskDetail.tsx            # Task detail panel
│   └── TimeEntryForm.tsx         # Time logging
├── charts/
│   ├── LineChart.tsx             # Line chart
│   ├── BarChart.tsx              # Bar chart
│   ├── PieChart.tsx              # Pie chart
│   ├── TreeMap.tsx               # Tree map (visx)
│   └── Sunburst.tsx              # Sunburst chart
├── providers/
│   ├── Providers.tsx             # All providers wrapper
│   ├── ThemeProvider.tsx         # Theme context
│   └── QueryProvider.tsx         # React Query config
└── utils/
    ├── ChunkErrorHandler.tsx     # Chunk loading recovery
    └── ErrorBoundary.tsx         # React error boundary
```

### State Management Patterns

#### Server State (TanStack Query)
```typescript
// Query hook
function useContacts(filters: ContactFilters) {
  return useQuery({
    queryKey: ['crm', 'contacts', 'list', filters],
    queryFn: () => apiClient.get('/crm/contacts', { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutation hook
function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDto) =>
      apiClient.post('/crm/contacts', data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['crm', 'contacts', 'list']);
      toast.success('Contact created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

#### Client State (React Context)
```typescript
// Auth context
interface AuthContextValue {
  user: User | null;
  permissions: string[];
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (scope: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}
```

### Design System (Vireo UI Kit)

#### Typography Tokens
```css
:root {
  /* Font families */
  --font-sans: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", "Menlo", monospace;

  /* Type scale (rem) */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.75rem;   /* 28px */
  --text-4xl: 2rem;      /* 32px */
  --text-5xl: 2.5rem;    /* 40px */
  --text-6xl: 3rem;      /* 48px */

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### Color Tokens
```css
:root {
  /* Base surfaces (dark theme) */
  --surface-0: #05060a;   /* Darkest background */
  --surface-1: #0c1018;   /* App background */
  --surface-2: #111827;   /* Card background */
  --surface-3: #1c2535;   /* Elevated element */
  --surface-4: #263144;   /* Hover state */

  /* Text colors */
  --text-strong: #f8fbff;   /* Primary text */
  --text-muted: #b7c4d6;    /* Secondary text */
  --text-subtle: #8090a8;   /* Tertiary text */
  --text-inverse: #0b1020;  /* On light background */

  /* Accent colors */
  --accent-primary: #5b8dff;    /* Primary brand blue */
  --accent-secondary: #7ae8c3;  /* Secondary teal */
  --accent-warn: #f0b429;       /* Warning yellow */
  --accent-error: #ff6b6b;      /* Error red */
  --accent-success: #4ade80;    /* Success green */

  /* Borders */
  --border-strong: #2f3b52;
  --border-muted: #1f2937;

  /* Data visualization */
  --viz-1: #7dd3fc;  /* Sky blue */
  --viz-2: #a78bfa;  /* Purple */
  --viz-3: #34d399;  /* Emerald */
  --viz-4: #f472b6;  /* Pink */
  --viz-5: #fbbf24;  /* Amber */
}
```

#### Spacing Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

#### Border Radius
```css
:root {
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-full: 9999px;
}
```

#### Shadows
```css
:root {
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 12px 30px rgba(0, 0, 0, 0.24);
  --shadow-lg: 0 24px 48px rgba(0, 0, 0, 0.30);
}
```

#### Motion
```css
:root {
  --ease-standard: cubic-bezier(0.33, 0.11, 0.15, 1);
  --dur-fast: 120ms;
  --dur-med: 220ms;
  --dur-slow: 340ms;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Deployment Architecture

### Google Cloud Platform Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                      CLOUD LOAD BALANCER                    │
│              HTTPS (managed SSL certificates)               │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼──────────┐                 ┌─────────▼────────┐
│   CLOUD RUN      │                 │   CLOUD RUN      │
│   vireo-api      │                 │   vireo-frontend │
│                  │                 │                  │
│  Autoscaling:    │                 │  Autoscaling:    │
│  Min: 0          │                 │  Min: 0          │
│  Max: 100        │                 │  Max: 50         │
│                  │                 │                  │
│  Memory: 512MB   │                 │  Memory: 256MB   │
│  CPU: 1          │                 │  CPU: 1          │
│  Timeout: 300s   │                 │  Timeout: 60s    │
└───────┬──────────┘                 └─────────┬────────┘
        │                                      │
        │         ┌────────────────────────────┘
        │         │
        └────┬────┘
             │
    ┌────────▼────────┐
    │   CLOUD SQL     │
    │   PostgreSQL    │
    │                 │
    │  Private IP     │
    │  Auto backups   │
    │  HA config      │
    │  10GB storage   │
    └────────┬────────┘
             │
    ┌────────▼─────────────────────────────┐
    │                                      │
┌───▼───────────┐  ┌─────────────┐  ┌────▼─────────┐
│ CLOUD STORAGE │  │   REDIS     │  │    SECRET    │
│    Buckets    │  │  (MemStore) │  │   MANAGER    │
│               │  │             │  │              │
│ - Uploads     │  │ - Caching   │  │ - API Keys   │
│ - Receipts    │  │ - BullMQ    │  │ - DB Creds   │
│ - Exports     │  │ - Sessions  │  │ - Stripe     │
└───────────────┘  └─────────────┘  └──────────────┘
```

### Cloud Run Configuration

#### vireo-api Service
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: vireo-api
  annotations:
    run.googleapis.com/launch-stage: BETA
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: '0'
        autoscaling.knative.dev/maxScale: '100'
        run.googleapis.com/cpu-throttling: 'false'
        run.googleapis.com/cloudsql-instances: vireo-dev:us-central1:vireo-db
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/vireo-dev/vireo-api:latest
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: '1'
            memory: 512Mi
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-url
              key: latest
        - name: NODE_ENV
          value: production
```

#### vireo-frontend Service
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: vireo-frontend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: '0'
        autoscaling.knative.dev/maxScale: '50'
    spec:
      containerConcurrency: 80
      timeoutSeconds: 60
      containers:
      - image: gcr.io/vireo-dev/vireo-frontend:latest
        ports:
        - containerPort: 3001
        resources:
          limits:
            cpu: '1'
            memory: 256Mi
        env:
        - name: NEXT_PUBLIC_API_URL
          value: https://api.vireo.buildersintl.com
```

### CI/CD Pipeline (Cloud Build)

#### Backend Build (cloudbuild.yaml)
```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']

  # Run tests
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'test:ci']

  # Build TypeScript
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']

  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/vireo-api:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/vireo-api:latest'
      - '.'

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/vireo-api:latest'

  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'vireo-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/vireo-api:latest'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

  # Run database migrations
  - name: 'node:18'
    entrypoint: npx
    args: ['prisma', 'migrate', 'deploy']
    env:
      - 'DATABASE_URL=${_DATABASE_URL}'

timeout: 1200s
```

#### Frontend Build (cloudbuild-frontend.yaml)
```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    dir: 'frontend'
    args: ['ci']

  # Type check
  - name: 'node:18'
    entrypoint: npm
    dir: 'frontend'
    args: ['run', 'type-check']

  # Build Next.js
  - name: 'node:18'
    entrypoint: npm
    dir: 'frontend'
    args: ['run', 'build']

  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    dir: 'frontend'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/vireo-frontend:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/vireo-frontend:latest'
      - '.'

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/vireo-frontend:latest'

  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'vireo-frontend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/vireo-frontend:latest'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

timeout: 1200s
```

### Environment Configuration

#### Environment Variables (.env.example)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vireo

# Redis
REDIS_URL=redis://localhost:6379

# Firebase
FIREBASE_PROJECT_ID=vireo-dev
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@vireo-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@buildersintl.com
SMTP_PASS=app-specific-password
SMTP_FROM="Vireo <notifications@buildersintl.com>"

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=sheets-service@vireo-dev.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Workflows
WORKFLOW_ALERT_EMAIL=alerts@buildersintl.com
WORKFLOW_FINANCE_WRITE=true

# AI/AgentField
AGENTFIELD_API_URL=https://agentfield.api.example.com
AGENTFIELD_API_KEY=af_xxx
AGENTFIELD_TIMEOUT_MS=12000
AGENTFIELD_INSIGHTS_SKILL=donor_insights

# Feature Flags
ALLOW_DASHBOARD_FALLBACK=false
FORMS_INLINE_FILE_STORAGE=false

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vireo-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vireo-dev
```

### Deployment Process

1. **Code Commit** - Developer pushes to `main` branch
2. **Build Trigger** - Cloud Build automatically triggers
3. **Test Execution** - Unit tests and type checking
4. **Docker Build** - Multi-stage Docker image creation
5. **Image Push** - Push to Google Container Registry
6. **Cloud Run Deploy** - Zero-downtime deployment
7. **Migration Run** - Prisma migrations applied
8. **Health Check** - Automatic rollback if unhealthy
9. **Traffic Shift** - Gradual rollout to new version

### Monitoring & Logging

#### Structured Logging
```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('ContactService');

logger.log('Contact created', {
  contactId: contact.id,
  userId: user.id,
  timestamp: new Date().toISOString(),
  metadata: {
    source: 'api',
    ipAddress: request.ip,
  },
});

logger.error('Failed to create contact', {
  error: error.message,
  stack: error.stack,
  userId: user.id,
  input: dto,
});
```

#### Health Check Endpoint
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        firebase: await this.checkFirebase(),
      },
    };
  }
}
```

## Integration Architecture

### External Service Integrations

#### Stripe Payment Processing
```typescript
// Webhook handler
@Post('/payments/stripe/webhook')
async handleStripeWebhook(@Body() body, @Headers('stripe-signature') sig) {
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  switch (event.type) {
    case 'payment_intent.succeeded':
      await this.processPayment(event.data.object);
      break;
    case 'invoice.paid':
      await this.markInvoicePaid(event.data.object);
      break;
    case 'customer.subscription.created':
      await this.createSubscription(event.data.object);
      break;
  }
}
```

#### Google Workspace APIs
```typescript
// Gmail integration
async sendEmail(to: string, subject: string, body: string) {
  const gmail = google.gmail({ version: 'v1', auth: this.auth });

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body,
  ].join('\n');

  const encoded = Buffer.from(message).toString('base64url');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded },
  });
}

// Sheets integration
async readSheet(spreadsheetId: string, range: string) {
  const sheets = google.sheets({ version: 'v4', auth: this.auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
}
```

#### Plaid Bank Connections
```typescript
async linkBankAccount(publicToken: string) {
  const response = await this.plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const accessToken = response.access_token;
  const itemId = response.item_id;

  // Store access token securely
  await this.savePlaidToken(itemId, accessToken);

  return { itemId };
}

async syncTransactions(itemId: string) {
  const accessToken = await this.getPlaidToken(itemId);

  const response = await this.plaidClient.transactionsSync({
    access_token: accessToken,
  });

  for (const transaction of response.added) {
    await this.createTransaction(transaction);
  }
}
```

#### Sage 50 CSV Import
```typescript
async importSage50Data(file: Express.Multer.File) {
  const records = await this.parseCsv(file.buffer);

  const job = await this.createImportJob({
    type: 'sage50',
    totalRecords: records.length,
    status: 'processing',
  });

  for (const record of records) {
    try {
      await this.processFinancialRecord(record);
      job.successCount++;
    } catch (error) {
      job.errors.push({ record, error: error.message });
      job.errorCount++;
    }
  }

  await this.updateImportJob(job.id, {
    status: 'completed',
    completedAt: new Date(),
  });

  return job;
}
```

## Security Architecture

### Authentication Flow
1. User clicks "Sign in with Google"
2. Firebase redirects to Google OAuth consent
3. User grants permission
4. Google returns to Firebase with authorization code
5. Firebase exchanges code for ID token
6. Frontend sends ID token to `/auth/verify`
7. Backend verifies token signature with Firebase Admin SDK
8. Backend checks user exists and is active
9. Backend looks up permissions from database
10. Backend returns user profile + JWT (optional)
11. Frontend stores auth state in context
12. All API requests include `Authorization: Bearer <token>`

### Permission System

#### Permission Scopes
```typescript
enum PermissionScope {
  // Admin
  MANAGE_USERS = 'admin:manage_users',
  MANAGE_PERMISSIONS = 'admin:manage_permissions',
  SYSTEM_CONFIG = 'admin:system_config',

  // CRM
  CRM_READ = 'crm:read',
  CRM_WRITE = 'crm:write',
  CRM_DELETE = 'crm:delete',
  CRM_MERGE = 'crm:merge',
  CRM_EXPORT = 'crm:export',

  // Finance
  FINANCE_READ = 'finance:read',
  FINANCE_WRITE = 'finance:write',
  FINANCE_APPROVE = 'finance:approve',
  FINANCE_CLOSE = 'finance:close',

  // Events
  EVENTS_READ = 'events:read',
  EVENTS_WRITE = 'events:write',
  EVENTS_PUBLISH = 'events:publish',

  // Forms
  FORMS_READ = 'forms:read',
  FORMS_BUILD = 'forms:build',
  FORMS_PUBLISH = 'forms:publish',

  // Reports
  REPORTS_READ = 'reports:read',
  REPORTS_CREATE = 'reports:create',
  REPORTS_SCHEDULE = 'reports:schedule',

  // Workflows
  WORKFLOWS_READ = 'workflows:read',
  WORKFLOWS_BUILD = 'workflows:build',
  WORKFLOWS_ACTIVATE = 'workflows:activate',
}
```

#### Role Definitions
```typescript
const ROLES = {
  SUPER_ADMIN: [
    'admin:*',
    'crm:*',
    'finance:*',
    'events:*',
    'forms:*',
    'reports:*',
    'workflows:*',
  ],

  ELT: [
    'crm:read',
    'finance:read',
    'finance:approve',
    'events:read',
    'reports:*',
    'workflows:read',
  ],

  FINANCE_MANAGER: [
    'finance:*',
    'crm:read',
    'reports:read',
    'reports:create',
  ],

  DEVELOPMENT_COORDINATOR: [
    'crm:*',
    'events:read',
    'reports:read',
    'reports:create',
  ],

  EVENTS_COORDINATOR: [
    'events:*',
    'forms:*',
    'crm:read',
    'crm:write',
    'reports:read',
  ],

  CONTENT_MANAGER: [
    'forms:*',
    'events:read',
    'events:write',
    'crm:read',
  ],

  CONTRIBUTOR: [
    'crm:read',
    'events:read',
    'reports:read',
  ],
};
```

### Audit Trail

Every mutation is logged with:
- User ID and email
- Timestamp
- Table and record ID
- Action (CREATE, UPDATE, DELETE)
- Old values (before)
- New values (after)
- Changed fields list
- IP address and user agent
- Session ID
- BSI code (if applicable)
- Reason (for sensitive changes)

```sql
SELECT
  al.created_at,
  u.email as user_email,
  al.table_name,
  al.action,
  al.changed_fields,
  al.old_values,
  al.new_values,
  al.ip_address
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.table_name = 'Contact'
  AND al.record_id = 'contact_123'
ORDER BY al.created_at DESC;
```

### Data Encryption

- **In Transit**: All connections use TLS 1.3
- **At Rest**: Cloud SQL encryption, Secret Manager encryption
- **Secrets**: Stored in Google Secret Manager, never in code
- **PII**: Sensitive fields (SSN, salary) field-level encrypted (future)

## Performance Optimization

### Database Query Optimization
- Prisma query optimization with `select` and `include`
- Proper indexes on frequently queried columns
- Connection pooling (Prisma default: 10 connections)
- Query result caching in Redis for expensive queries
- Pagination on all list endpoints (default 20, max 100)

### Frontend Performance
- Next.js automatic code splitting by route
- React Server Components for faster initial loads
- TanStack Query caching (5min stale, 10min cache)
- Optimistic updates for instant UI feedback
- Virtual scrolling for large lists (future)
- Image optimization with Next.js Image component
- Lazy loading for below-the-fold content

### Caching Strategy
- **Redis**: Hot data (user permissions, session data)
- **Browser**: Static assets with long cache headers
- **CDN**: Cloud Storage serves media files
- **API**: TanStack Query client-side caching
- **Database**: Prisma query result cache

### Monitoring Metrics
- API response time (p50, p95, p99)
- Database query time
- Error rate by endpoint
- Request throughput
- Cloud Run instance count
- Memory and CPU usage
- Active user count

## Future Architecture Considerations

### Multi-Tenancy
- Add `tenant_id` to all tables
- Row-level security in PostgreSQL
- Tenant-aware Prisma middleware
- Domain-based routing
- Isolated data per tenant

### Microservices Extraction
Potential services to extract:
1. **Auth Service** - Identity and permissions
2. **Notification Service** - Email, SMS, push
3. **Reporting Service** - Report generation and scheduling
4. **Integration Service** - External API orchestration
5. **Workflow Service** - Automation engine

### Mobile App Architecture
- React Native app with shared component library
- Offline-first with local SQLite
- Background sync when online
- Push notifications via Firebase Cloud Messaging
- Biometric authentication

### Advanced Analytics
- Data warehouse (BigQuery) for historical analysis
- ETL pipelines from operational DB
- Business intelligence tools (Looker, Metabase)
- Machine learning models for predictions

## Summary

Vireo's architecture is built for:
- **Scalability** - Cloud Run auto-scaling, stateless design
- **Maintainability** - Modular monolith with clear boundaries
- **Security** - OAuth, RBAC, audit logging, encryption
- **Performance** - Caching, query optimization, CDN
- **Reliability** - Automated testing, health checks, monitoring
- **Future Growth** - Multi-tenancy ready, microservice-extractable

With 1,578 lines of Prisma schema, 24 NestJS modules, 25 API controllers, 89 Next.js page components, and comprehensive documentation, Vireo represents a production-ready enterprise system built with modern best practices.
