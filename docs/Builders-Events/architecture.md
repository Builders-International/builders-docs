# Builders-Events Architecture

## System Architecture

Builders-Events follows a **three-tier monorepo architecture** with separate applications for mobile, web admin, and backend API, all sharing a common PostgreSQL database.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
├─────────────────────────┬───────────────────────────────────────┤
│   Mobile App (Expo)     │   Admin Dashboard (Next.js)           │
│   - React Native 0.73   │   - Next.js 14 App Router             │
│   - Expo Router         │   - React 18                          │
│   - TanStack Query      │   - TanStack Query                    │
│   - Clerk Auth          │   - Clerk Auth                        │
│   - Native UI           │   - Radix UI + Tailwind               │
└─────────────────────────┴───────────────────────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │   API Gateway    │
                    │   (NestJS)       │
                    │   Port: 3001     │
                    └──────────────────┘
                              ▼
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
│   Database   │    │  External APIs   │   │  File Storage│
│  PostgreSQL  │    │  - Stripe        │   │   AWS S3     │
│  (Supabase)  │    │  - Clerk         │   │              │
│              │    │  - Twilio        │   │              │
│              │    │  - Expo Push     │   │              │
│              │    │  - Google Cal    │   │              │
│              │    │  - PostHog       │   │              │
│              │    │  - Sentry        │   │              │
└──────────────┘    └──────────────────┘   └──────────────┘
```

### Architecture Principles

1. **Monorepo Organization** - pnpm workspaces for code sharing and dependency management
2. **API-First Design** - All business logic centralized in NestJS API
3. **Stateless API** - Authentication via Clerk tokens, no session management
4. **Role-Based Access** - Four-tier permission system (ATTENDEE, STAFF, EXECUTIVE, ADMIN)
5. **Event Isolation** - Multi-tenant event data with proper scoping
6. **Type Safety** - End-to-end TypeScript with Prisma, Zod, and class-validator
7. **Progressive Enhancement** - Mobile-first with admin dashboard for power users

## Tech Stack Details

### Mobile Application (apps/mobile)

**Core Framework**
- **Expo SDK**: 50.0.21 - Managed React Native workflow
- **React Native**: 0.73.6 - Cross-platform native framework
- **TypeScript**: 5.3.3 - Type-safe development

**Routing & Navigation**
- **Expo Router**: 3.4.0 - File-based routing with deep linking
- **React Native Screens**: 3.29.0 - Native screen optimization
- **React Native Safe Area Context**: 4.8.2 - Safe area handling

**State Management & Data Fetching**
- **TanStack Query**: 5.17.0 - Server state management with caching
- **Axios**: 1.6.0 - HTTP client
- **Expo Secure Store**: 12.8.0 - Encrypted credential storage

**Authentication**
- **Clerk Expo**: 1.0.0 - Authentication with JWT tokens
- **Expo Linking**: 6.2.0 - Deep link handling for auth flows

**UI & Styling**
- **NativeWind**: 2.0.11 - Tailwind CSS for React Native
- **Tailwind CSS**: 3.3.0 - Utility-first CSS framework
- **Expo Vector Icons**: 14.0.0 - Icon library

**Platform Features**
- **React Native Maps**: 1.10.0 - Native map components
- **Expo Notifications**: 0.27.0 - Push notification handling
- **Expo Location**: 16.5.0 - GPS and location services
- **React Native Reanimated**: 3.6.2 - Smooth animations

**Build & Distribution**
- **EAS Build** - Cloud-based native builds
- **EAS Submit** - Automated app store submission
- **Node**: 20.11.0 (build environment)

### Admin Dashboard (apps/admin)

**Core Framework**
- **Next.js**: 14.2.35 - React framework with App Router
- **React**: 18.3.1 - UI library
- **TypeScript**: 5.5.4 - Type safety

**Authentication**
- **Clerk Next.js**: 5.3.0 - Server and client authentication
- **Middleware-based protection** - Route guards

**UI Components**
- **Radix UI**: Dialog, Dropdown, Select, Tabs, Checkbox, Label, Popover, Slot, Alert Dialog, Progress
- **Lucide React**: 0.428.0 - Icon library
- **React Day Picker**: 8.10.1 - Date picker component

**Forms & Validation**
- **React Hook Form**: 7.52.2 - Form state management
- **Zod**: 3.23.8 - Schema validation
- **Hookform Resolvers**: 3.9.0 - Zod integration

**Data Tables**
- **TanStack Table**: 8.20.1 - Headless table library
- **TanStack Query**: 5.51.23 - Server state

**Styling**
- **Tailwind CSS**: 3.4.9 - Utility-first CSS
- **Tailwindcss Animate**: 1.0.7 - Animation utilities
- **Class Variance Authority**: 0.7.0 - Component variants
- **clsx**: 2.1.1 + **tailwind-merge**: 2.5.2 - Class name utilities

**Utilities**
- **date-fns**: 3.6.0 - Date manipulation
- **Axios**: 1.7.4 - HTTP client

### API Backend (apps/api)

**Core Framework**
- **NestJS Core**: 10.3.0 - Progressive Node.js framework
- **NestJS Platform Express**: 10.3.0 - Express adapter
- **NestJS Config**: 3.1.1 - Configuration management
- **TypeScript**: 5.3.3 - Type safety
- **RxJS**: 7.8.1 - Reactive programming

**Database & ORM**
- **Prisma Client**: 5.8.1 - Type-safe database client
- **Prisma CLI**: 5.8.1 - Migration and introspection tools
- **PostgreSQL** - Relational database via Supabase
- **Connection Pooling** - PgBouncer for production scalability

**Authentication & Authorization**
- **Clerk SDK Node**: 4.13.14 - User authentication and JWT verification
- **Custom Guards** - Role-based access control (RBAC)

**Validation & Transformation**
- **class-validator**: 0.14.1 - Decorator-based validation
- **class-transformer**: 0.5.1 - Object transformation
- **Zod**: 3.22.4 - Runtime schema validation
- **humps**: 2.0.1 - Case conversion (camelCase ↔ snake_case)

**External Integrations**
- **Stripe**: 14.13.0 - Payment processing
- **Twilio**: 4.20.0 - SMS messaging
- **AWS S3 SDK**: 3.470.0 - File storage
- **S3 Request Presigner**: 3.470.0 - Presigned upload URLs
- **Expo Server SDK**: 3.7.0 - Push notifications
- **Google APIs**: 131.0.0 - Calendar integration
- **PostHog Node**: 3.6.0 - Analytics tracking
- **Sentry Node**: 7.99.0 - Error monitoring
- **Axios**: 1.6.5 - HTTP client

**API Documentation**
- **NestJS Swagger**: 7.1.17 - OpenAPI/Swagger generation
- **Automatic endpoint documentation** - Decorator-based

**Development & Testing**
- **Jest**: 29.7.0 - Testing framework
- **ts-jest**: 29.1.1 - TypeScript Jest preset
- **Supertest**: 6.3.4 - HTTP assertions
- **NestJS Testing**: 10.3.0 - Testing utilities
- **tsx**: 4.7.0 - TypeScript execution for seeding

**Build Tools**
- **NestJS CLI**: 10.3.0 - Project tooling
- **ts-loader**: 9.5.1 - TypeScript compilation
- **ts-node**: 10.9.2 - TypeScript execution
- **tsconfig-paths**: 4.2.0 - Path mapping

## Database Schema (Prisma)

### Core Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Entity Relationship Overview

**Users & Authentication**
- `users` - Core user accounts with Clerk integration
- `user_flags` - Feature flags per user (SPA, GOLF, SHEBUILDS, FISH)
- `device_tokens` - Push notification registration (iOS/Android)
- `audit_logs` - Administrative action tracking

**Events**
- `events` - Event definitions with branding and configuration
- `event_registrations` - User registration per event
- `event_user_state` - Per-event user status (ACTIVE/ARCHIVED)
- `event_user_relationships` - Family connections (SPOUSE, CHILD, PARENT)
- `event_projects` - Many-to-many event ↔ project associations

**Scheduling**
- `schedule_items` - Sessions, meals, workshops, excursions
- `locations` - Venue locations with GPS coordinates
- **10 schedule types**: SESSION, GOLF, GALA, EXCURSION, WORKSHOP, BREAKFAST, RECEPTION, DINNER, LUNCH, CUSTOM
- **RSVP types**: NONE, YESNO, CAPACITY

**E-Commerce**
- `products` - Shop inventory with Shopify integration
- `orders` - Order records with Stripe payment intents
- `order_items` - Line items per order
- **Fulfillment types**: PICKUP, SHIP
- **Order status**: OPEN, PAID, CANCELLED

**Giving/Donations**
- `projects` - Fundraising projects with goals
- `donations` - Donation records with Stripe integration
- **Donation status**: PENDING, COMPLETED, FAILED, REFUNDED
- **Project status**: ACTIVE, COMPLETED, ARCHIVED

**Communication**
- `message_threads` - Conversation containers
- `message_participants` - Thread membership
- `messages` - Individual messages
- `announcements` - Broadcast notifications with segmentation

**Meetings**
- `exec_availabilities` - Executive calendar slots
- `meeting_requests` - Attendee meeting requests
- **Meeting status**: PENDING, ACCEPTED, DECLINED, CANCELLED

**Surveys**
- `surveys` - Survey definitions with JSON schema
- `survey_responses` - User submissions with JSON answers

**Assets**
- `file_assets` - S3-stored files (PDF, IMAGE, MAP, OTHER)

**Configuration**
- `feature_flags` - Runtime feature toggles

### Key Database Features

**Indexes**
- Composite indexes on frequently queried fields (event_id + created_at)
- User lookup indexes (email, role, auth_provider_id)
- Event-scoped queries optimized with event_id indexes

**Cascade Deletes**
- Event deletion cascades to all related data
- User deletion cascades to tokens, flags, registrations

**Enums**
- Type-safe enumerations for status fields
- Platform-specific enums (DevicePlatform: ios/android)

**Relationships**
- Self-referential relationships (event_user_state → hosts)
- Many-to-many with explicit join tables (event_projects)
- Multi-field foreign keys (meeting_requests → users)

## API Architecture

### Module Organization

NestJS modules follow **feature-based organization**:

```
src/
├── account/              # User account deletion (Apple requirement)
├── admin/                # Administrative operations
│   ├── admin.controller  # Event/user management
│   ├── assets.controller # File upload handling
│   └── admin.service     # Business logic
├── analytics/            # PostHog event tracking
├── auth/                 # Clerk authentication
│   └── clerk.service     # JWT verification, user sync
├── database/             # Prisma service
│   └── prisma.service    # Database connection singleton
├── donations/            # Giving system
├── event-user-state/     # User status management
├── events/               # Event CRUD
├── health/               # Health check endpoint
├── maps/                 # Location services
├── meetings/             # Executive scheduling
├── messaging/            # Direct messaging
├── notifications/        # Push notification dispatch
├── people/               # User directory
├── projects/             # Giving projects
├── schedule/             # Event schedules
├── shop/                 # E-commerce
├── surveys/              # Survey management
└── webhooks/             # External service webhooks
```

### Request Flow

```
Client Request (with Clerk token)
    ↓
CORS Middleware
    ↓
Clerk Auth Guard (validates JWT)
    ↓
Role Guard (checks UserRole)
    ↓
Validation Pipe (class-validator DTOs)
    ↓
Controller (route handler)
    ↓
Service (business logic)
    ↓
Prisma Service (database queries)
    ↓
Transform Response (camelCase conversion)
    ↓
Client Response
```

### Authentication Flow

1. **User signs in via Clerk** (mobile or admin)
2. **Clerk returns JWT token** with user_id
3. **Client includes token** in Authorization header: `Bearer <token>`
4. **API validates token** via Clerk SDK
5. **API fetches user from database** using auth_provider_id (Clerk user_id)
6. **API checks user role** against required permissions
7. **API processes request** with authenticated user context

### Key Endpoints

**Events**
- `GET /events` - List all events
- `GET /events/:slug` - Get event by slug
- `POST /events` - Create new event (ADMIN)
- `PATCH /events/:id` - Update event (ADMIN)
- `DELETE /events/:id` - Delete event (ADMIN)

**Schedule**
- `GET /schedule/:eventId` - Get event schedule
- `POST /schedule` - Create schedule item (ADMIN)
- `PATCH /schedule/:id` - Update schedule item (ADMIN)
- `DELETE /schedule/:id` - Delete schedule item (ADMIN)

**People**
- `GET /people/:eventId` - Get event attendees
- `GET /people/:eventId/users/:userId` - Get user details
- `PATCH /people/:eventId/users/:userId` - Update user (STAFF+)

**Products**
- `GET /shop/:eventId/products` - List products
- `POST /shop/:eventId/products` - Create product (ADMIN)
- `PATCH /shop/products/:id` - Update product (ADMIN)
- `DELETE /shop/products/:id` - Delete product (ADMIN)

**Orders**
- `GET /shop/orders` - Get user orders
- `POST /shop/orders` - Create order
- `PATCH /shop/orders/:id/payment` - Confirm payment

**Projects**
- `GET /projects` - List projects (with status filter)
- `GET /projects/:id` - Get project details with donations
- `GET /projects/:id/total-raised` - Get fundraising total
- `POST /projects` - Create project (ADMIN)
- `PATCH /projects/:id` - Update project (ADMIN)

**Donations**
- `GET /donations` - Get user donations
- `POST /donations` - Record donation (after Stripe charge)

**Messaging**
- `GET /messaging/:eventId/threads` - Get user threads
- `POST /messaging/:eventId/threads` - Create thread
- `POST /messaging/threads/:threadId/messages` - Send message

**Notifications**
- `POST /notifications/announcements` - Send announcement (ADMIN)
- `POST /notifications/register` - Register push token

**Meetings**
- `GET /meetings/:eventId/availabilities` - Get exec availability
- `POST /meetings/:eventId/requests` - Request meeting
- `PATCH /meetings/requests/:id` - Update request status (EXEC+)

**Admin**
- `POST /admin/:eventId/registrations` - Register attendee
- `POST /admin/assets/upload-url` - Get S3 presigned URL
- `DELETE /account` - Delete user account (Apple requirement)

### Error Handling

**Standard NestJS Exception Filters**
- `BadRequestException` - 400 (validation errors)
- `UnauthorizedException` - 401 (missing/invalid token)
- `ForbiddenException` - 403 (insufficient permissions)
- `NotFoundException` - 404 (resource not found)
- `ConflictException` - 409 (duplicate resources)

**Sentry Integration**
- Automatic error reporting to Sentry
- Contextual data (user, request, event)

## File Structure

### Monorepo Layout

```
Builders-Events/
├── apps/
│   ├── api/                          # NestJS backend
│   │   ├── dist/                     # Compiled output
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema
│   │   │   ├── migrations/           # Migration history
│   │   │   └── seed.ts               # Seed script
│   │   ├── src/
│   │   │   ├── account/
│   │   │   │   └── account.controller.ts
│   │   │   ├── admin/
│   │   │   │   ├── admin.module.ts
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── assets.controller.ts
│   │   │   │   └── assets.service.ts
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.module.ts
│   │   │   │   └── analytics.service.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── clerk.service.ts
│   │   │   │   ├── clerk.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── common/
│   │   │   │   └── decorators/
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── donations/
│   │   │   │   ├── donations.module.ts
│   │   │   │   ├── donations.controller.ts
│   │   │   │   ├── donations.service.ts
│   │   │   │   └── dto/
│   │   │   ├── event-user-state/
│   │   │   │   ├── event-user-state.module.ts
│   │   │   │   ├── event-user-state.controller.ts
│   │   │   │   └── event-user-state.service.ts
│   │   │   ├── events/
│   │   │   │   ├── events.module.ts
│   │   │   │   ├── events.controller.ts
│   │   │   │   ├── events.service.ts
│   │   │   │   └── dto/
│   │   │   ├── health/
│   │   │   │   └── health.controller.ts
│   │   │   ├── maps/
│   │   │   │   ├── maps.module.ts
│   │   │   │   ├── maps.controller.ts
│   │   │   │   └── maps.service.ts
│   │   │   ├── meetings/
│   │   │   │   ├── meetings.module.ts
│   │   │   │   ├── meetings.controller.ts
│   │   │   │   └── meetings.service.ts
│   │   │   ├── messaging/
│   │   │   │   ├── messaging.module.ts
│   │   │   │   ├── messaging.controller.ts
│   │   │   │   ├── messaging.service.ts
│   │   │   │   └── dto/
│   │   │   ├── notifications/
│   │   │   │   ├── notifications.module.ts
│   │   │   │   ├── notifications.controller.ts
│   │   │   │   └── notifications.service.ts
│   │   │   ├── people/
│   │   │   │   ├── people.module.ts
│   │   │   │   ├── people.controller.ts
│   │   │   │   └── people.service.ts
│   │   │   ├── projects/
│   │   │   │   ├── projects.module.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   └── dto/
│   │   │   ├── schedule/
│   │   │   │   ├── schedule.module.ts
│   │   │   │   ├── schedule.controller.ts
│   │   │   │   ├── schedule.service.ts
│   │   │   │   └── dto/
│   │   │   ├── shop/
│   │   │   │   ├── shop.module.ts
│   │   │   │   ├── shop.controller.ts
│   │   │   │   ├── shop.service.ts
│   │   │   │   └── dto/
│   │   │   ├── surveys/
│   │   │   │   ├── surveys.module.ts
│   │   │   │   ├── surveys.controller.ts
│   │   │   │   └── surveys.service.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── webhooks.module.ts
│   │   │   │   └── webhooks.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── admin/                         # Next.js admin dashboard
│   │   ├── .next/                     # Build output
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── events/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── people/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── schedule/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── shop/page.tsx
│   │   │   │   └── surveys/page.tsx
│   │   │   ├── (public)/
│   │   │   │   ├── privacy/page.tsx
│   │   │   │   ├── terms/page.tsx
│   │   │   │   ├── support/page.tsx
│   │   │   │   └── delete-account/page.tsx
│   │   │   ├── health/route.ts
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn/Radix components
│   │   │   └── ...                    # Feature components
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── queries/
│   │   ├── public/
│   │   ├── types/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── mobile/                        # React Native app
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── _layout.tsx
│       │   │   ├── sign-in.tsx
│       │   │   └── sign-up.tsx
│       │   ├── (tabs)/
│       │   │   ├── _layout.tsx
│       │   │   ├── index.tsx          # Event hub
│       │   │   ├── donations.tsx
│       │   │   ├── event/[id].tsx
│       │   │   ├── maps.tsx
│       │   │   ├── messages.tsx
│       │   │   ├── messages/[threadId].tsx
│       │   │   ├── more.tsx
│       │   │   ├── people.tsx
│       │   │   ├── schedule.tsx
│       │   │   ├── shop.tsx
│       │   │   └── surveys.tsx
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── assets/
│       │   ├── fonts/
│       │   └── images/
│       ├── components/
│       │   └── ...
│       ├── constants/
│       ├── lib/
│       │   ├── api-client.ts
│       │   └── queries/
│       ├── types/
│       ├── app.json
│       ├── package.json
│       ├── tailwind.config.js
│       └── tsconfig.json
├── docs/
│   ├── MOBILE_GIVING_INTEGRATION.md
│   └── railway-deployment.md
├── supabase/
│   ├── .temp/
│   ├── migrations/
│   ├── config.toml
│   └── .gitignore
├── AppIcon Exports/                   # App icons and branding
├── .easignore
├── .env.production
├── .gitignore
├── .npmrc
├── app.json                           # Expo configuration
├── builders-events-app_accessKeys.csv # AWS credentials
├── eas.json                           # EAS build config
├── NEXT_STEPS.md                      # Development notes
├── package.json                       # Root workspace config
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── railway.toml                       # Railway deployment config
```

## Design Patterns

### Singleton Pattern (Prisma)
```typescript
// database/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```
Ensures single database connection pool across entire application.

### Repository Pattern
Services encapsulate Prisma queries and business logic:
```typescript
@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.events.findUnique({ where: { slug } });
  }
}
```

### DTO Pattern
Data Transfer Objects with validation:
```typescript
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  slug: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;
}
```

### Guard Pattern
Authentication and authorization via NestJS guards:
```typescript
@UseGuards(ClerkAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
@Post()
async createEvent(@Body() dto: CreateEventDto) {
  // Only ADMIN users can access
}
```

### Query Hook Pattern (TanStack Query)
Reusable data fetching hooks:
```typescript
export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['events', slug],
    queryFn: () => apiClient.get(`/events/${slug}`).then(r => r.data),
    enabled: !!slug,
  });
}
```

## External Integrations

### Clerk Authentication
- **Web**: Next.js middleware for route protection
- **Mobile**: ClerkProvider with token auto-refresh
- **API**: JWT validation via Clerk SDK
- **User Sync**: Clerk user_id stored as auth_provider_id in database

### Stripe Payment Processing
- **Payment Intents**: Create intent → Client confirms → Webhook callback
- **Metadata**: projectId/eventId stored in Stripe metadata
- **Receipt URLs**: Returned from Stripe and stored in database
- **Webhooks**: Handle payment success/failure events

### AWS S3 File Storage
- **Presigned URLs**: Generate from API, upload from client
- **Bucket Structure**: Organized by event_id and asset type
- **Asset Types**: PDF, IMAGE, MAP, OTHER
- **Public Access**: CloudFront or S3 public URLs for retrieval

### Twilio SMS
- **Direct Messaging**: Send SMS via Twilio API
- **Provider Message ID**: Track sent messages
- **Multi-channel**: SMS + in-app messaging

### Expo Push Notifications
- **Token Registration**: Device tokens stored per user/platform
- **Expo SDK**: Server-side push via expo-server-sdk
- **Segmentation**: Target by user flags, roles, or event

### Google Calendar API
- **Executive Availability**: Sync calendar events to database
- **OAuth**: Service account or user OAuth flow
- **Event Creation**: Create GCal events for confirmed meetings

### PostHog Analytics
- **Event Tracking**: User actions, feature usage
- **User Properties**: Enrich with role, event participation
- **Backend Tracking**: Server-side event capture

### Sentry Error Monitoring
- **Automatic Capture**: Unhandled exceptions
- **Manual Reporting**: Contextual error logging
- **User Context**: Include user_id, event_id in reports

## Deployment Architecture

### Railway (API)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "cd apps/api && pnpm install && pnpm run build"

[deploy]
startCommand = "cd apps/api && pnpm run start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**Environment Variables**:
- `DATABASE_URL` - Supabase connection string
- `CLERK_SECRET_KEY` - API authentication
- `STRIPE_SECRET_KEY` - Payment processing
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- `SENTRY_DSN`, `POSTHOG_API_KEY`

**Deployment Flow**:
1. Push to `main` branch
2. Railway detects changes
3. Runs `pnpm install && prisma generate && nest build`
4. Starts with `node dist/main`
5. Health check at `/health`

### Vercel/Netlify (Admin)
**Environment Variables**:
- `NEXT_PUBLIC_API_URL` - Railway API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Build Command**: `next build`
**Start Command**: `next start`

### EAS (Mobile)
```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "cwd": "apps/mobile",
      "node": "20.11.0",
      "env": {
        "EXPO_POD_INSTALL_ARGS": "--repo-update --clean-install"
      }
    }
  }
}
```

**Build Process**:
1. `eas build --platform ios --profile production`
2. Cloud builds with EAS servers
3. Generates IPA/APK
4. Submit via `eas submit`

**Environment Variables** (via `eas secret:create`):
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Database (Supabase)
- **Connection Pooling**: PgBouncer for high concurrency
- **Direct URL**: For migrations and administrative tasks
- **Backups**: Automated daily backups
- **SSL**: Enforced for all connections

## Performance Considerations

### Database Optimization
- **Indexes**: Strategic indexes on high-traffic queries (event_id, user_id, timestamps)
- **Cascade Deletes**: Automatic cleanup of related data
- **Connection Pooling**: PgBouncer for efficient connection management
- **Query Optimization**: Select only needed fields, use Prisma relations wisely

### API Caching
- **TanStack Query**: Client-side caching with staleTime and cacheTime
- **Immutable Data**: Events, schedules cached aggressively
- **Real-time Updates**: Invalidate queries on mutations

### Mobile Performance
- **React Native Screens**: Native screen optimization
- **Reanimated**: GPU-accelerated animations
- **Image Optimization**: Lazy loading, cached images
- **List Virtualization**: FlatList for long lists

### API Response Time
- **Validation**: Early validation with class-validator
- **Minimal Queries**: Avoid N+1 queries with Prisma includes
- **Async Operations**: Background jobs for notifications, analytics

## Security Measures

### Authentication
- **JWT Tokens**: Short-lived tokens with automatic refresh
- **Clerk Integration**: Industry-standard authentication provider
- **Role-Based Access**: Four-tier permission system

### Data Protection
- **Environment Variables**: Secrets stored in Railway/Vercel/EAS
- **Encrypted Storage**: Expo SecureStore for mobile credentials
- **HTTPS**: Enforced for all API communication
- **Database SSL**: Required for Supabase connections

### Input Validation
- **class-validator**: DTO validation on all endpoints
- **Zod Schemas**: Runtime validation for complex data
- **Whitelist**: Only allowed properties accepted
- **Transform**: Automatic type coercion

### CORS Configuration
```typescript
app.enableCors({
  origin: process.env.NODE_ENV === 'production'
    ? true // Allow all origins in production
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true,
});
```

### Audit Logging
All administrative actions logged to `audit_logs` table:
- User who performed action
- Action type (CREATE, UPDATE, DELETE)
- Entity type and ID
- Changes (JSON diff)
- Timestamp

## Monitoring & Observability

### Health Checks
- **Endpoint**: `/health`
- **Railway**: Automatic health monitoring
- **Database**: Connection test included

### Error Tracking
- **Sentry**: Automatic exception capture
- **Context**: User, request, event data included
- **Source Maps**: TypeScript stack traces

### Analytics
- **PostHog**: User behavior tracking
- **Backend Events**: Server-side event capture
- **Mobile Events**: Client-side tracking

### Logging
- **NestJS Logger**: Structured logging
- **Request/Response Logging**: Middleware-based
- **Error Logging**: Sentry integration

## Cross-Reference Standards

This project implements standards documented in:
- [Infrastructure Documentation](/docs/standards/infrastructure.md) - Railway deployment, Supabase database
- [CI/CD Documentation](/docs/standards/cicd.md) - EAS builds, Railway auto-deploy
- [Code Quality Documentation](/docs/standards/code-quality.md) - TypeScript, ESLint, testing practices
