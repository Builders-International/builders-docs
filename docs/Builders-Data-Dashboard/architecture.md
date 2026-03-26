# Builders Data Dashboard - Architecture

## System Architecture Overview

Project Life Central is a Next.js 16 application deployed on Vercel with a Supabase PostgreSQL database. The architecture follows a service-oriented pattern with clear separation between API routes, business logic, data access, and presentation layers.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        External Sources                         │
│  Google Sheets (145+ workbooks) | Sage | DonorSnap              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js App Router (Server)                 │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  API Routes (/api/sync/*, /api/upload/*)          │  │  │
│  │  │    - Project Dashboard Sync                        │  │  │
│  │  │    - FPD Controller Sync                           │  │  │
│  │  │    - FPD Workbooks Batch Sync                      │  │  │
│  │  │    - Sage Field Costs Upload                       │  │  │
│  │  │    - Sage Disbursements Upload                     │  │  │
│  │  │    - DonorSnap Pledges Upload                      │  │  │
│  │  │    - Staleness Check Cron                          │  │  │
│  │  └─────────────────┬──────────────────────────────────┘  │  │
│  │                    ▼                                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Service Layer (lib/services/)                     │  │  │
│  │  │    - syncProjectDashboard()                        │  │  │
│  │  │    - syncFpdController()                           │  │  │
│  │  │    - syncFpdWorkbook()                             │  │  │
│  │  │  Orchestrates: parsing, validation, DB ops         │  │  │
│  │  └─────────────────┬──────────────────────────────────┘  │  │
│  │                    ▼                                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Data Parsers (lib/parsers/)                       │  │  │
│  │  │    - parseProjectDashboard()                       │  │  │
│  │  │    - parseFpdController()                          │  │  │
│  │  │    - parseFpdSnapshot()                            │  │  │
│  │  │    - parseSageFieldCosts()                         │  │  │
│  │  │    - parseSageDisbursements()                      │  │  │
│  │  │    - parseDonorSnapPledges()                       │  │  │
│  │  └──────────────┬───────────────────┬─────────────────┘  │  │
│  │                 ▼                   ▼                     │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐  │  │
│  │  │ Validators           │  │ Google Sheets API        │  │  │
│  │  │ lib/validators/      │  │ lib/google/              │  │  │
│  │  │  - GPS Coordinates   │  │  - Service Account Auth  │  │  │
│  │  │  - Finance Formulas  │  │  - Sheet Reading         │  │  │
│  │  └──────────────────────┘  └──────────────────────────┘  │  │
│  │                    │                                      │  │
│  │                    ▼                                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Prisma ORM (lib/db/prisma.ts)                     │  │  │
│  │  │    - Singleton pattern                             │  │  │
│  │  │    - Type-safe queries                             │  │  │
│  │  │    - Connection pooling                            │  │  │
│  │  └─────────────────┬──────────────────────────────────┘  │  │
│  └────────────────────┼──────────────────────────────────────┘  │
└─────────────────────┬─┼──────────────────────────────────────────┘
                      │ │
                      ▼ ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                          │
│  10 Tables: projects, project_finance_snapshots, fpd_registry,  │
│  sync_runs, users, accounts, sessions, verification_tokens,     │
│  source_files, import_errors, formula_mismatches                │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Core Framework

- **Next.js**: 16.2.1
  - App Router (not Pages Router)
  - React Server Components
  - API Routes
  - Middleware for authentication
  - Vercel deployment optimizations

- **React**: 19.2.4
  - Server Components
  - Client Components with 'use client' directive
  - React Hooks

- **TypeScript**: 5.9.3
  - Strict mode enabled
  - Type-safe database queries via Prisma
  - Comprehensive type definitions in lib/parsers/types.ts and lib/google/types.ts

### Database & ORM

- **Supabase PostgreSQL**
  - Hosted Postgres database
  - Connection pooling via pgBouncer
  - Two connection strings:
    - `DATABASE_URL` - pooled connection for app queries
    - `DIRECT_URL` - direct connection for migrations and seeding

- **Prisma ORM**: 5.22.0
  - Type-safe database client
  - Schema-first development
  - Automatic migration generation
  - Singleton pattern to prevent connection leaks in Next.js dev mode
  - SQL query logging in development

### Authentication

- **NextAuth.js**: 4.24.13
  - Google OAuth provider
  - Database session strategy (not JWT)
  - Prisma adapter for user/session/account storage
  - Custom middleware for protected routes
  - Role-based access control (viewer, editor, admin)

### External Integrations

- **Google APIs**: googleapis 171.4.0
  - Service account authentication (no OAuth for automation)
  - Sheets API v4
  - Read-only access to 145+ spreadsheets
  - Rate limiting handled automatically

- **Resend**: 6.9.4
  - Transactional email service
  - Sync failure alerts
  - Staleness warnings
  - Template-based emails (lib/email/templates.ts)

### Frontend Libraries

- **Tailwind CSS**: 4.2.2
  - Utility-first styling
  - Dark mode (preferred)
  - Custom color palette
  - PostCSS processing

- **MapLibre GL JS**: 5.21.0
  - Open-source map rendering
  - WebGL-based performance
  - GeoJSON marker support
  - Interactive project markers

### File Parsing

- **xlsx**: 0.18.5
  - Excel file parsing
  - Sage export processing

- **csv-parse**: 6.2.1
  - CSV file parsing
  - DonorSnap export processing

### Testing

- **Jest**: 30.3.0
  - Unit testing framework
  - ts-jest for TypeScript support

- **@testing-library/react**: 16.3.2
  - Component testing utilities
  - DOM interaction testing

- **@testing-library/jest-dom**: 6.9.1
  - Custom Jest matchers for DOM

### Development Tools

- **Autoprefixer**: 10.4.27
  - CSS vendor prefixing

- **PostCSS**: 8.5.8
  - CSS transformation pipeline

- **ts-node**: 10.9.2
  - TypeScript execution for seed scripts

## Database Schema

### Projects Table

Core project registry from Project Life Dashboard sheet.

```prisma
model Project {
  id                    String   @id @default(uuid()) @db.Uuid
  jobCode               String   @unique @map("job_code")          // Primary identifier (e.g., "52-202-30030")
  projectNumber         String?  @map("project_number")            // Numeric portion
  projectName           String?  @map("project_name")
  initiative            String?                                    // Building Program, Water System, etc.
  plaSignedDate         String?  @map("pla_signed_date")           // Date string
  region                String?                                    // Asia Pacific, Southeast Asia, etc.
  city                  String?
  country               String?
  projectTag            String?  @map("project_tag")               // Phase 1, Phase 2, etc.
  rpm                   String?                                    // Regional Project Manager
  liaison               String?                                    // Field liaison
  missionary            String?
  email                 String?
  shovelReady           String?  @map("shovel_ready")              // "Yes" or "No"
  teamReady             String?  @map("team_ready")                // "Yes" or "No"
  status                String?                                    // Active, Planning, Design, etc.
  description           String?
  missionaryDistrict    String?  @map("missionary_district")
  totalRaised           Decimal? @map("total_raised") @db.Decimal
  balanceToComplete     Decimal? @map("balance_to_complete") @db.Decimal
  fieldCost             Decimal? @map("field_cost") @db.Decimal
  disbursed             Decimal? @map("disbursed") @db.Decimal
  fieldCostBalance      Decimal? @map("field_cost_balance") @db.Decimal
  gpsCoordinates        String?  @map("gps_coordinates")           // Raw string (e.g., "24.87, 121.02")
  latitude              Decimal? @db.Decimal                       // Parsed latitude
  longitude             Decimal? @db.Decimal                       // Parsed longitude
  updates               String?
  createdAt             DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt             DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  financeSnapshots ProjectFinanceSnapshot[]
  fpdRegistry      FpdRegistry?

  @@map("projects")
}
```

### ProjectFinanceSnapshot Table

Detailed finance data from individual FPD workbook "System Snapshot" tabs.

```prisma
model ProjectFinanceSnapshot {
  id                      String   @id @default(uuid()) @db.Uuid
  jobCode                 String   @unique @map("job_code")
  projectNumber           String?  @map("project_number")
  projectName             String?  @map("project_name")
  budgetOriginal          Decimal? @map("budget_original") @db.Decimal
  budgetCurrent           Decimal? @map("budget_current") @db.Decimal
  eventCost1              Decimal? @map("event_cost_1") @db.Decimal    // 5 event cost fields
  eventCost2              Decimal? @map("event_cost_2") @db.Decimal
  eventCost3              Decimal? @map("event_cost_3") @db.Decimal
  eventCost4              Decimal? @map("event_cost_4") @db.Decimal
  eventCost5              Decimal? @map("event_cost_5") @db.Decimal
  grossBudget             Decimal? @map("gross_budget") @db.Decimal
  received                Decimal? @db.Decimal                          // Updated by Google Apps Script
  outstandingFaithPromises Decimal? @map("outstanding_faith_promises") @db.Decimal
  faithPromise75          Decimal? @map("faith_promise_75") @db.Decimal // Should equal outstandingFaithPromises * 0.75
  balanceToRaiseSubtotal  Decimal? @map("balance_to_raise_subtotal") @db.Decimal
  missionaryRaised        Decimal? @map("missionary_raised") @db.Decimal
  balanceToRaiseTotal     Decimal? @map("balance_to_raise_total") @db.Decimal
  fieldCostOriginal       Decimal? @map("field_cost_original") @db.Decimal
  fieldCostCurrent        Decimal? @map("field_cost_current") @db.Decimal
  totalDisbursed          Decimal? @map("total_disbursed") @db.Decimal
  fieldCostBalance        Decimal? @map("field_cost_balance") @db.Decimal
  totalRaised             Decimal? @map("total_raised") @db.Decimal
  lastManualUpdate        String?  @map("last_manual_update")
  notes                   String?
  createdAt               DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt               DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  project Project @relation(fields: [jobCode], references: [jobCode], onDelete: Cascade)

  @@index([jobCode])
  @@map("project_finance_snapshots")
}
```

### FpdRegistry Table

Registry of all FPD workbooks with their Google Sheet IDs and sync status.

```prisma
model FpdRegistry {
  id            String    @id @default(uuid()) @db.Uuid
  jobCode       String    @unique @map("job_code")
  fpdSheetId    String    @map("fpd_sheet_id")             // Google Sheet ID
  jobName       String?   @map("job_name")
  isActive      Boolean   @default(true) @map("is_active") // Inactive sheets skipped in batch sync
  lastSyncedAt  DateTime? @map("last_synced_at") @db.Timestamptz
  syncStatus    String?   @map("sync_status")              // "success", "failed", "pending"
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  project Project @relation(fields: [jobCode], references: [jobCode], onDelete: Cascade)

  @@index([jobCode])
  @@index([fpdSheetId])
  @@index([isActive])
  @@map("fpd_registry")
}
```

### SyncRun Table

Audit log of all sync operations with status tracking.

```prisma
model SyncRun {
  id             String    @id @default(uuid()) @db.Uuid
  source         String                                    // "project_dashboard", "fpd_controller", "fpd_workbook", etc.
  status         String                                    // "in_progress", "success", "partial", "failed"
  rowsProcessed  Int       @default(0) @map("rows_processed")
  message        String?                                   // Summary message or error
  startedAt      DateTime  @default(now()) @map("started_at") @db.Timestamptz
  completedAt    DateTime? @map("completed_at") @db.Timestamptz

  sourceFiles  SourceFile[]
  importErrors ImportError[]

  @@index([source])
  @@index([startedAt])
  @@map("sync_runs")
}
```

### SourceFile Table

Tracks which specific files/sheets were processed in each sync run.

```prisma
model SourceFile {
  id             String   @id @default(uuid()) @db.Uuid
  syncRunId      String?  @map("sync_run_id") @db.Uuid
  sourceType     String   @map("source_type")      // "google_sheet", "sage_excel", "donorsnap_csv"
  fileIdentifier String   @map("file_identifier")  // Sheet ID or filename
  rowsImported   Int      @default(0) @map("rows_imported")
  createdAt      DateTime @default(now()) @map("created_at") @db.Timestamptz

  syncRun SyncRun? @relation(fields: [syncRunId], references: [id], onDelete: Cascade)

  @@index([syncRunId])
  @@index([sourceType])
  @@map("source_files")
}
```

### ImportError Table

Row-level errors encountered during parsing/validation.

```prisma
model ImportError {
  id            String   @id @default(uuid()) @db.Uuid
  syncRunId     String?  @map("sync_run_id") @db.Uuid
  sourceType    String   @map("source_type")
  rowIdentifier String?  @map("row_identifier")     // Job code or row number
  fieldName     String?  @map("field_name")         // Which field failed
  errorMessage  String   @map("error_message")      // Human-readable error
  rawValue      String?  @map("raw_value")          // Original malformed value
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz

  syncRun SyncRun? @relation(fields: [syncRunId], references: [id], onDelete: Cascade)

  @@index([syncRunId])
  @@index([rowIdentifier])
  @@map("import_errors")
}
```

### FormulaMismatch Table

Finance formula discrepancies between imported and calculated values.

```prisma
model FormulaMismatch {
  id                 String    @id @default(uuid()) @db.Uuid
  jobCode            String    @map("job_code")
  fieldName          String    @map("field_name")         // "faithPromise75", "grossBudget", etc.
  importedValue      Decimal?  @map("imported_value") @db.Decimal
  calculatedValue    Decimal?  @map("calculated_value") @db.Decimal
  difference         Decimal?  @db.Decimal                // Absolute difference
  thresholdExceeded  Boolean   @default(false) @map("threshold_exceeded")  // > $0.01
  detectedAt         DateTime  @default(now()) @map("detected_at") @db.Timestamptz
  resolvedAt         DateTime? @map("resolved_at") @db.Timestamptz

  @@index([jobCode])
  @@index([resolvedAt])
  @@map("formula_mismatches")
}
```

### NextAuth Tables

Authentication and session management (NextAuth.js Prisma adapter).

```prisma
model User {
  id            String    @id @default(uuid()) @db.Uuid
  email         String    @unique
  emailVerified DateTime? @map("email_verified") @db.Timestamptz
  name          String?
  image         String?
  role          String    @default("viewer")      // "viewer", "editor", "admin"
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  accounts Account[]
  sessions Session[]

  @@index([email])
  @@map("users")
}

model Account {
  id                String  @id @default(uuid()) @db.Uuid
  userId            String  @map("user_id") @db.Uuid
  type              String                          // "oauth"
  provider          String                          // "google"
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid()) @db.Uuid
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id") @db.Uuid
  expires      DateTime @db.Timestamptz
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime @db.Timestamptz

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

## API Routes & Endpoints

### Sync Endpoints

#### POST /api/sync/project-dashboard

Syncs master project registry from Project Life Dashboard Google Sheet.

**Environment Variables Required:**
- `PROJECT_DASHBOARD_SHEET_ID`

**Response:**
```json
{
  "syncRunId": "uuid",
  "rowsProcessed": 150,
  "errors": 0,
  "status": "success"
}
```

**Implementation:** `app/api/sync/project-dashboard/route.ts`

#### POST /api/sync/fpd-controller

Syncs FPD registry from FPD Controller sheet (list of all FPD workbook IDs).

**Environment Variables Required:**
- `FPD_CONTROLLER_SHEET_ID`

**Response:**
```json
{
  "syncRunId": "uuid",
  "rowsProcessed": 145,
  "errors": 0,
  "status": "success"
}
```

**Implementation:** `app/api/sync/fpd-controller/route.ts`

#### POST /api/sync/fpd-workbooks

Batch syncs all active FPD workbooks. Iterates through `fpd_registry` table.

**Response:**
```json
{
  "total": 145,
  "success": 143,
  "failed": 2,
  "failures": [
    {
      "jobCode": "52-202-30031",
      "error": "Sheet not found"
    }
  ]
}
```

**Implementation:** `app/api/sync/fpd-workbooks/route.ts`

### Upload Endpoints

#### POST /api/upload/sage-field-costs

Accepts Excel/CSV upload of Sage field cost export.

**Parser:** `lib/parsers/sage-field-costs.ts`

#### POST /api/upload/sage-disbursements

Accepts Excel/CSV upload of Sage disbursement export.

**Parser:** `lib/parsers/sage-disbursements.ts`

#### POST /api/upload/donorsnap-pledges

Accepts CSV upload of DonorSnap faith promise export.

**Parser:** `lib/parsers/donorsnap-pledges.ts`

### Cron Endpoints

#### GET /api/cron/check-staleness

Vercel cron job that checks for stale data and sends email alerts.

**Runs:** Hourly (configured in vercel.json)

**Authentication:** Requires `CRON_SECRET` header

**Implementation:** `app/api/cron/check-staleness/route.ts`

### Authentication Endpoints

#### GET/POST /api/auth/[...nextauth]

NextAuth.js dynamic route handler.

**Providers:** Google OAuth

**Implementation:** `app/api/auth/[...nextauth]/route.ts`

## Service Layer

### syncProjectDashboard(sheetId: string)

**Location:** `lib/services/sync-project-dashboard.ts`

**Responsibilities:**
1. Create `sync_run` record with status "in_progress"
2. Read sheet data via Google Sheets API
3. Parse rows using `parseProjectDashboard()`
4. Upsert each project to `projects` table
5. Log parse errors to `import_errors` table
6. Create `source_file` record
7. Update `sync_run` with final status and row count
8. Send email alert on failure

**Error Handling:** Catches all errors, updates sync_run status to "failed", sends email

### syncFpdController(sheetId: string)

**Location:** `lib/services/sync-fpd-controller.ts`

**Responsibilities:**
1. Create `sync_run` record
2. Read FPD Controller sheet
3. Parse registry entries using `parseFpdController()`
4. Upsert to `fpd_registry` table
5. Log errors and update sync_run

### syncFpdWorkbook(jobCode: string, fpdSheetId: string)

**Location:** `lib/services/sync-fpd-workbook.ts`

**Responsibilities:**
1. Read "System Snapshot" tab from FPD workbook
2. Parse finance data using `parseFpdSnapshot()`
3. Validate formulas using `validateFinanceSnapshot()`
4. Upsert to `project_finance_snapshots` table
5. Log formula mismatches to `formula_mismatches` table
6. Update `fpd_registry` with last synced timestamp and status

**Formula Validation:** Recalculates 5 finance formulas and flags discrepancies > $0.01

## Data Parsers

### parseProjectDashboard(rows: SheetRow[])

**Location:** `lib/parsers/project-dashboard.ts`

**Input:** Array of row objects from Google Sheets API

**Output:**
```typescript
{
  data: ParsedProject[],
  errors: ParserError[]
}
```

**Logic:**
- Filters rows by valid job code pattern: `/^\d{2}-\d{3}-\d{4,6}$/`
- Parses GPS coordinates via `parseGpsCoordinates()`
- Converts numeric strings to Decimal (handles "$" and "," characters)
- Collects errors without stopping parse
- Handles column name variations (e.g., "Liaison" vs "Liason")

### parseFpdController(rows: SheetRow[])

**Location:** `lib/parsers/fpd-controller.ts`

**Extracts:**
- Job code
- FPD Sheet ID
- Job name
- Active status

### parseFpdSnapshot(rows: SheetRow[])

**Location:** `lib/parsers/fpd-snapshot.ts`

**Extracts:** 21 finance fields from "System Snapshot" tab

**Special Handling:**
- Expects single data row (flat snapshot format)
- Parses all Decimal fields
- Extracts notes and last manual update timestamp

### parseSageFieldCosts(file: Buffer)

**Location:** `lib/parsers/sage-field-costs.ts`

**Status:** Implemented but unused (Phase 2)

**Parses:** Excel export from Sage with field cost data

### parseSageDisbursements(file: Buffer)

**Location:** `lib/parsers/sage-disbursements.ts`

**Status:** Implemented but unused (Phase 2)

**Parses:** Excel export from Sage with disbursement transactions

### parseDonorSnapPledges(file: Buffer)

**Location:** `lib/parsers/donorsnap-pledges.ts`

**Status:** Implemented but unused (Phase 2)

**Parses:** CSV export from DonorSnap with faith promise data

## Validators

### parseGpsCoordinates(coordString: string)

**Location:** `lib/validators/coordinates.ts`

**Input:** String like "24.87, 121.02" or "-12.05, -77.04"

**Output:**
```typescript
{
  latitude: number,
  longitude: number
} | null
```

**Logic:**
- Splits on comma
- Parses two floats
- Returns null on any parse failure
- Handles negative coordinates (southern hemisphere, western hemisphere)

**Test Coverage:** `__tests__/lib/validators/coordinates.test.ts`

### validateFinanceSnapshot(snapshot: FinanceSnapshotData)

**Location:** `lib/validators/formulas.ts`

**Validates 5 Finance Formulas:**

1. **faithPromise75** = outstandingFaithPromises * 0.75
2. **grossBudget** = budgetCurrent + eventCost1 + eventCost2 + eventCost3 + eventCost4 + eventCost5
3. **balanceToRaiseSubtotal** = budgetCurrent - received - faithPromise75
4. **balanceToRaiseTotal** = balanceToRaiseSubtotal - missionaryRaised
5. **fieldCostBalance** = fieldCostCurrent - totalDisbursed

**Threshold:** $0.01 absolute difference

**Output:**
```typescript
FormulaMismatch[] // Empty array if all formulas match
```

**Test Coverage:** `__tests__/lib/validators/formulas.test.ts`

## Google Sheets Integration

### Authentication

**Method:** Service Account (not OAuth)

**Environment Variables:**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Private key in PEM format (with `\n` newlines)

**Implementation:** `lib/google/auth.ts`

```typescript
export function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth;
}
```

### Sheet Reading

**Implementation:** `lib/google/sheets.ts`

**Main Functions:**

```typescript
// Read sheet with optional skip rows
readSheet(options: ReadSheetOptions): Promise<SheetData>

// Read specific tab by name
readSheetTab(sheetId: string, tabName: string): Promise<SheetData>
```

**Output Format:**
```typescript
{
  headers: string[],        // Column headers (row 1 after skip)
  rows: SheetRow[]          // Array of objects with header keys
}
```

**Type Definitions:** `lib/google/types.ts`

## Design Patterns

### Singleton Pattern (Prisma Client)

**Location:** `lib/db/prisma.ts`

**Problem:** Next.js hot reloading creates new Prisma clients on each reload, exhausting database connections.

**Solution:** Store Prisma client on global object in development.

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**References:** [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

### Service Layer Pattern

**Purpose:** Decouple business logic from API routes.

**Benefits:**
- Testable without HTTP layer
- Reusable across multiple routes
- Clear separation of concerns

**Example:**

```
API Route (app/api/sync/project-dashboard/route.ts)
    ↓ calls
Service (lib/services/sync-project-dashboard.ts)
    ↓ orchestrates
Parser (lib/parsers/project-dashboard.ts)
Validator (lib/validators/coordinates.ts)
Database (lib/db/prisma.ts)
```

### Parser Pattern

**Purpose:** Separate data extraction from business logic.

**Common Interface:**
```typescript
export interface ParseResult<T> {
  data: T[];
  errors: ParserError[];
}

export interface ParserError {
  rowIdentifier: string | null;
  fieldName: string | null;
  errorMessage: string;
  rawValue: string | null;
}
```

**Benefits:**
- Errors collected without stopping parse
- Consistent error logging across all parsers
- Easy to add new data sources

### Repository Pattern (via Prisma)

**Purpose:** Abstract database access.

**Implementation:** Prisma Client acts as repository.

**Benefits:**
- Type-safe queries
- Automatic SQL generation
- Migration management

## File Structure

```
/
├── app/                                  # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts   # NextAuth.js handler
│   │   ├── sync/
│   │   │   ├── project-dashboard/route.ts
│   │   │   ├── fpd-controller/route.ts
│   │   │   └── fpd-workbooks/route.ts
│   │   ├── upload/
│   │   │   ├── sage-field-costs/route.ts
│   │   │   ├── sage-disbursements/route.ts
│   │   │   └── donorsnap-pledges/route.ts
│   │   └── cron/
│   │       └── check-staleness/route.ts
│   ├── admin/
│   │   └── sync/                        # Admin dashboard (Phase 2)
│   ├── map/
│   │   └── page.tsx                     # Map page (Phase 2)
│   ├── projects/
│   │   ├── page.tsx                     # Projects list (Phase 2)
│   │   └── [jobCode]/page.tsx           # Project detail (Phase 2)
│   ├── auth/
│   │   └── signin/page.tsx              # Sign-in page
│   ├── globals.css                      # Tailwind base styles
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing page
│   └── providers.tsx                    # Client-side providers
│
├── lib/                                  # Shared utilities
│   ├── db/
│   │   └── prisma.ts                    # Prisma client singleton
│   ├── google/
│   │   ├── auth.ts                      # Service account auth
│   │   ├── sheets.ts                    # Sheets API utilities
│   │   └── types.ts                     # TypeScript interfaces
│   ├── parsers/
│   │   ├── project-dashboard.ts
│   │   ├── fpd-controller.ts
│   │   ├── fpd-snapshot.ts
│   │   ├── sage-field-costs.ts
│   │   ├── sage-disbursements.ts
│   │   ├── donorsnap-pledges.ts
│   │   └── types.ts                     # Shared parser types
│   ├── validators/
│   │   ├── coordinates.ts               # GPS parsing
│   │   └── formulas.ts                  # Finance validation
│   ├── services/
│   │   ├── sync-project-dashboard.ts
│   │   ├── sync-fpd-controller.ts
│   │   └── sync-fpd-workbook.ts
│   ├── email/
│   │   ├── client.ts                    # Resend integration
│   │   └── templates.ts                 # Email templates
│   ├── auth/
│   │   └── options.ts                   # NextAuth configuration
│   └── automation/                      # Browser automation (Phase 2)
│       ├── sage-field-costs.ts
│       ├── sage-disbursements.ts
│       └── donorsnap-pledges.ts
│
├── components/                           # React components
│   ├── ui/                              # Reusable UI components
│   ├── map/                             # Map components
│   ├── projects/                        # Project components
│   └── admin/                           # Admin components
│
├── prisma/
│   ├── schema.prisma                    # Database schema
│   ├── seed.ts                          # Test data seeder
│   └── migrations/                      # Migration history
│       ├── init/
│       │   └── migration.sql
│       └── add_unique_jobcode_constraint/
│           └── migration.sql
│
├── __tests__/                           # Jest tests
│   └── lib/
│       ├── parsers/
│       └── validators/
│           ├── coordinates.test.ts
│           └── formulas.test.ts
│
├── types/
│   └── next-auth.d.ts                   # NextAuth type extensions
│
├── .env                                 # Environment variables (git-ignored)
├── .env.example                         # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── jest.config.js
├── jest.setup.js
├── next.config.js
├── middleware.ts                        # NextAuth middleware
├── vercel.json                          # Vercel cron configuration
└── README.md
```

## Environment Variables

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Pooled Postgres connection | `postgresql://user:pass@host/db?pgbouncer=true` |
| `DIRECT_URL` | Direct Postgres connection (migrations) | `postgresql://user:pass@host/db` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account email | `sa@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Service account private key | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |
| `PROJECT_DASHBOARD_SHEET_ID` | Google Sheet ID for projects | `1ABC...XYZ` |
| `FPD_CONTROLLER_SHEET_ID` | Google Sheet ID for FPD registry | `2ABC...XYZ` |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | Random 32+ character string |
| `NEXTAUTH_URL` | App URL for auth callbacks | `http://localhost:3000` or `https://app.buildersintl.org` |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | None (required for auth) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | None (required for auth) |
| `RESEND_API_KEY` | Resend email API key | None (email disabled) |
| `ALERT_EMAIL` | Email for sync failure alerts | `tech@buildersintl.org` |
| `CRON_SECRET` | Vercel cron authentication | Random string |
| `NODE_ENV` | Environment mode | `development` |

**Security Notes:**
- Never commit `.env` to version control
- Store production secrets in Vercel environment variables
- Rotate `NEXTAUTH_SECRET` if exposed
- Use environment-specific service accounts (dev vs production)

## Deployment

### Vercel Configuration

**Platform:** Vercel (auto-deploy on git push)

**Build Command:** `next build`

**Install Command:** `npm install`

**Output Directory:** `.next`

**Environment Variables:** Configure in Vercel dashboard

**Cron Jobs:** Configured in `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/check-staleness",
      "schedule": "0 * * * *"  // Hourly
    }
  ]
}
```

### Database Migrations

**Initial Setup:**
```bash
npx prisma migrate deploy
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Seed Database (Optional):**
```bash
npx prisma db seed
```

### Build Process

1. Install dependencies: `npm install`
2. Run Prisma generate: `npx prisma generate` (via postinstall script)
3. Build Next.js: `next build`
4. Deploy to Vercel edge network

**Note:** Prisma Client must be generated before build. The `postinstall` script in package.json handles this automatically.

## Performance Considerations

### Database Connection Pooling

- **pgBouncer** used for connection pooling
- `DATABASE_URL` uses pooled connection
- `DIRECT_URL` bypasses pool for migrations/seeds

### Query Optimization

- Indexed fields: `jobCode`, `syncRunId`, `source`, `startedAt`, `email`, `fpdSheetId`, `isActive`
- Cascade deletes prevent orphaned records
- Batch upserts in sync services

### Rate Limiting

- Google Sheets API: 100 requests/100 seconds/user (handled by googleapis library)
- Vercel Serverless Functions: 10-second timeout (can request increase)

## Security

### Authentication

- NextAuth.js with Google OAuth
- Database session strategy (more secure than JWT for server-side apps)
- Middleware protects `/map`, `/projects`, `/admin` routes
- Role-based access control (viewer, editor, admin)

### Authorization

**Role Permissions:**
- **Viewer** - Read-only access to map and projects
- **Editor** - Can trigger syncs and uploads
- **Admin** - Full access including user management

**Implementation:** Role checked in page components (middleware only checks for authenticated session)

### Data Access

- Google service account read-only access to sheets
- No write access to external systems
- Database credentials stored in Vercel environment variables
- API routes accessible only to authenticated users (except `/api/cron/*` with secret header)

### Secrets Management

- `.env` file git-ignored
- Production secrets in Vercel environment variables
- Private key stored with escaped newlines (`\n`)
- `CRON_SECRET` required header for cron endpoints

## Monitoring & Observability

### Sync Logging

- Every sync operation creates `sync_run` record
- Start time, end time, status, row count tracked
- Parse errors logged to `import_errors` table
- Formula mismatches logged to `formula_mismatches` table

### Error Alerts

- Email sent via Resend on sync failures
- Template includes: source, error message, sync run ID
- Recipient configured via `ALERT_EMAIL` environment variable

### Prisma Logging

**Development:**
```typescript
log: ['query', 'error', 'warn']
```

**Production:**
```typescript
log: ['error']
```

### Vercel Logging

- Serverless function logs viewable in Vercel dashboard
- Real-time log streaming available
- Error tracking integrated

## Testing Strategy

### Unit Tests

**Framework:** Jest 30.3.0 with ts-jest

**Coverage:**
- GPS coordinate parser (`__tests__/lib/validators/coordinates.test.ts`)
- Finance formula validators (`__tests__/lib/validators/formulas.test.ts`)

**Run Tests:**
```bash
npm test
```

**Watch Mode:**
```bash
npm run test:watch
```

### Manual Testing

**Test Data:** Seed script creates 3 projects, 3 FPD entries, 2 snapshots

```bash
npx prisma db seed
```

**Test Endpoints:**
```bash
curl -X POST http://localhost:3000/api/sync/project-dashboard
curl -X POST http://localhost:3000/api/sync/fpd-controller
curl -X POST http://localhost:3000/api/sync/fpd-workbooks
```

### Integration Testing

**Phase 2 Priority** - Not yet implemented

**Planned:**
- API route integration tests
- End-to-end sync flow tests
- Google Sheets mock integration

## External Integrations

### Google Sheets API

**Version:** v4

**Authentication:** Service account (OAuth 2.0)

**Scopes:** `https://www.googleapis.com/auth/spreadsheets.readonly`

**Rate Limits:** 100 requests/100 seconds/user

**Error Handling:** Retry with exponential backoff (handled by googleapis library)

### Supabase

**Database:** PostgreSQL 15+

**Connection Pooling:** pgBouncer (transaction mode)

**Features Used:**
- UUID primary keys
- Timestamptz columns
- Decimal precision for currency
- Cascade deletes
- Unique constraints
- Multi-column indexes

### Resend

**Purpose:** Transactional email

**Features Used:**
- HTML/text email templates
- Sync failure alerts
- Configurable recipients

**API Key:** `RESEND_API_KEY` environment variable

### Vercel

**Features:**
- Serverless function hosting
- Edge network CDN
- Environment variable management
- Cron job scheduling
- Automatic HTTPS
- Git-based deployments

## Standards Alignment

### Code Quality

Aligns with [Code Quality Standards](../Infrastructure/code-quality.md):

- TypeScript strict mode enabled
- ESLint configuration (Next.js recommended)
- Type-safe database queries via Prisma
- Error handling in all async functions
- Consistent naming conventions (camelCase for variables, PascalCase for types)

### CI/CD

Potential alignment with [CI/CD Standards](../Infrastructure/ci-cd-workflows.md):

- Automated deployments via Vercel
- Environment-based configurations
- Database migration automation
- (Missing: automated testing in CI, pre-commit hooks)

### Deployment

- Production environment isolated from development
- Environment variables per environment
- Zero-downtime deployments via Vercel
- Rollback capability via Vercel dashboard

## Future Architecture Considerations

### Scalability

**Current Limitations:**
- Batch FPD sync processes 145+ sheets sequentially (slow)
- No caching layer
- No background job queue

**Recommendations:**
- Implement job queue (Bull, BullMQ, or Vercel Queue)
- Add Redis caching for frequently accessed projects
- Parallelize FPD workbook syncs with concurrency limits

### Real-Time Updates

**Phase 2+ Feature:**
- Webhook endpoints for external system updates
- WebSocket connections for live dashboard updates
- Optimistic UI updates with rollback on failure

### Data Warehouse

**Long-Term Consideration:**
- Export to data warehouse for historical analysis
- Separate OLTP (Supabase) from OLAP (BigQuery, Snowflake)
- BI tool integration (Looker, Metabase)

### Microservices

**Not Recommended:**
- Current monolith appropriate for team size and complexity
- Service-oriented architecture within monolith provides sufficient separation
- Microservices would add operational overhead without clear benefits
