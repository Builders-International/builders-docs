# Builders-Events Overview

## Project Purpose

Builders-Events is a comprehensive event management platform designed for Builders International to coordinate, manage, and enhance multi-day conferences and gatherings. The platform consists of three integrated applications:

1. **Mobile App** - Attendee-facing React Native app for event participation
2. **Admin Dashboard** - Web-based management console for event organizers
3. **API Backend** - NestJS REST API providing centralized data and business logic

The system supports complex event workflows including registration, scheduling, donations/giving, e-commerce, messaging, meeting coordination, surveys, and real-time notifications.

## Key Features

### Event Management
- Multi-event support with unique slugs and branding themes
- Event lifecycle management (PLANNED → ACTIVE → ARCHIVED)
- Custom event templates with configurable features
- Per-event branding with theme customization
- Interactive map configurations for venue navigation
- Event-specific user state tracking

### Attendee Experience (Mobile App)
- **Authentication** - Clerk-based sign-in/sign-up with secure token management
- **Event Hub** - Centralized dashboard for accessing all event features
- **Schedule** - Browse sessions, workshops, meals, and excursions with RSVP
- **Maps** - Interactive venue maps with location categories (venue, shuttle, meeting, spa)
- **People Directory** - Browse attendees, staff, and executives
- **Messaging** - Direct messaging between participants
- **Giving/Projects** - Donate to fundraising projects with Stripe integration
- **Shop** - Purchase event merchandise and services (pickup/ship fulfillment)
- **Surveys** - Complete event surveys with flexible schema
- **Notifications** - Push notifications for announcements and updates
- **Executive Meetings** - Request one-on-one meetings with leadership
- **User Profiles** - Photo uploads, relationship management, and flag tagging

### Administrative Features (Admin Dashboard)
- **Event Creation** - Configure new events with branding, dates, and settings
- **Schedule Management** - Create and edit schedule items with location assignment
- **People Management** - View attendees, assign roles, track relationships
- **Product Management** - Manage shop inventory, pricing, and fulfillment
- **Project Management** - Create giving projects with goals and tracking
- **Survey Builder** - Design custom surveys with dynamic schemas
- **Analytics** - Track giving goals, donations, and event metrics
- **Announcements** - Send targeted notifications with user segment filtering
- **Registration Tracking** - Monitor event registrations and attendee info
- **Audit Logging** - Track all administrative actions and changes

### Core Platform Capabilities
- **User Roles** - ATTENDEE, STAFF, EXECUTIVE, ADMIN with role-based access
- **Payment Processing** - Stripe integration for donations and e-commerce
- **File Management** - S3-based asset storage for PDFs, images, and maps
- **SMS Integration** - Twilio messaging for multi-channel communication
- **Analytics Tracking** - PostHog integration for user behavior analysis
- **Error Monitoring** - Sentry integration for error tracking and debugging
- **Google Calendar Sync** - Executive availability management with GCal integration
- **Feature Flags** - Dynamic feature toggling via database configuration
- **User Flags** - Tag users with attributes (SPA, GOLF, SHEBUILDS, FISH) for targeted features

## Tech Stack

### Mobile Application
- **Framework**: Expo SDK 50 (React Native 0.73.6)
- **Routing**: Expo Router 3.4
- **State Management**: TanStack Query v5 (React Query)
- **Authentication**: Clerk Expo SDK
- **Styling**: NativeWind (Tailwind for React Native)
- **Maps**: React Native Maps
- **Notifications**: Expo Notifications with push token management
- **Location**: Expo Location services
- **Platform**: iOS and Android via EAS Build

### Admin Dashboard
- **Framework**: Next.js 14.2 (App Router)
- **Authentication**: Clerk Next.js SDK
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Forms**: React Hook Form with Zod validation
- **Data Tables**: TanStack Table v8
- **State Management**: TanStack Query v5
- **Date Handling**: date-fns with React Day Picker
- **HTTP Client**: Axios

### API Backend
- **Framework**: NestJS 10.3 (TypeScript/Node.js)
- **Runtime**: Node.js 20.11.0+
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 5.8
- **Authentication**: Clerk SDK for Node
- **Validation**: class-validator + class-transformer + Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with ts-jest
- **File Storage**: AWS S3 SDK
- **Payments**: Stripe SDK
- **SMS**: Twilio SDK
- **Push Notifications**: Expo Server SDK
- **Analytics**: PostHog Node SDK
- **Error Tracking**: Sentry Node SDK
- **API Integration**: Google APIs (Calendar)

### Infrastructure
- **Package Manager**: pnpm 10.18+ (monorepo workspaces)
- **Database Hosting**: Supabase (PostgreSQL with connection pooling)
- **API Deployment**: Railway with nixpacks builder
- **Admin Deployment**: Vercel/Netlify (static Next.js)
- **Mobile Distribution**: EAS (Expo Application Services)
- **Version Control**: GitHub (Builders-International/Builders-Events)

## Target Users

### Primary Users
1. **Event Attendees** - Conference participants using mobile app for schedules, networking, giving
2. **Event Staff** - On-site coordinators managing logistics and attendee support
3. **Executives** - Leadership scheduling meetings and tracking engagement
4. **Event Administrators** - Event planners configuring and managing all aspects of events

### User Roles & Permissions
- **ATTENDEE** - Basic access to event information, schedules, and participation features
- **STAFF** - Enhanced access to attendee management and operational tools
- **EXECUTIVE** - Leadership features including meeting availability and analytics
- **ADMIN** - Full administrative access to all events, configuration, and data

## Current Status

### Production Deployment
- **API**: Live on Railway (https://builders-events-api.railway.app)
- **Admin Dashboard**: Deployed to web hosting (Clerk-authenticated)
- **Mobile App**: Distributed via EAS (iOS App Store, Google Play Store)
- **Database**: Hosted on Supabase with production connection pooling

### Recent Development (Q1 2026)
- Added Clerk account deletion endpoint for Apple App Store compliance
- Implemented client-side error logging for debugging
- Added per-event analytics and giving goal tracking
- Enhanced product management with edit/delete functionality
- Implemented user flag system for targeted notifications
- Added photo upload support for user profiles
- Enhanced relationship management (spouse, child, parent)
- Improved message filtering and targeted announcements
- Added support page with contact info and account deletion

### Active Features
- Event registration and user state management
- Full schedule management with RSVP capabilities
- Location-based mapping with multiple categories
- Direct messaging between participants
- Giving platform with project-based donations and Stripe integration
- E-commerce shop with inventory and fulfillment tracking
- Survey system with flexible JSON schemas
- Push notifications with Expo SDK
- Executive meeting request system with availability management
- File asset management with S3 integration
- Analytics tracking with PostHog
- Audit logging for administrative actions

### Known Limitations
- Single currency support (USD only)
- Basic offline support (query caching only)
- Manual analytics tracking implementation pending
- Limited multi-language support
- Email notifications not yet implemented

## Database Overview

The platform uses a comprehensive PostgreSQL schema with 26+ tables including:

### Core Entities
- **events** - Event definitions with branding and configuration
- **users** - User accounts with role-based access
- **event_registrations** - Event-specific attendee registrations
- **event_user_state** - Per-event user status and archiving

### Feature Modules
- **schedule_items** - Event schedule with sessions, meals, activities
- **locations** - Venue locations with GPS coordinates and categories
- **products** - Shop inventory with pricing and Shopify integration
- **orders** + **order_items** - E-commerce order management
- **projects** - Giving projects with fundraising goals
- **donations** - Donation tracking with Stripe payment records
- **surveys** + **survey_responses** - Flexible survey system
- **announcements** - Targeted notification system
- **message_threads** + **messages** - Direct messaging
- **exec_availabilities** + **meeting_requests** - Executive scheduling
- **file_assets** - S3-stored documents and media
- **device_tokens** - Push notification registration
- **feature_flags** - Runtime feature toggling
- **user_flags** - User attribute tagging
- **event_user_relationships** - Family/group connections
- **audit_logs** - Administrative action tracking

## Integration Points

### External Services
- **Clerk** - Authentication and user management
- **Stripe** - Payment processing for donations and shop
- **AWS S3** - File storage for assets and uploads
- **Twilio** - SMS messaging capabilities
- **Expo Push API** - Mobile push notifications
- **Google Calendar API** - Executive availability sync
- **PostHog** - Analytics and event tracking
- **Sentry** - Error monitoring and debugging
- **Shopify** (Optional) - Product variant synchronization

### Inter-Application Communication
- Mobile app → API: REST calls with Clerk Bearer tokens
- Admin dashboard → API: REST calls with Clerk authentication
- API → Database: Prisma ORM with connection pooling
- API → S3: Direct file uploads with presigned URLs
- API → Stripe: Webhook handling for payment events

## Project Structure

```
Builders-Events/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── account/     # User account management
│   │   │   ├── admin/       # Admin operations
│   │   │   ├── analytics/   # PostHog analytics
│   │   │   ├── auth/        # Clerk authentication
│   │   │   ├── database/    # Prisma service
│   │   │   ├── donations/   # Giving system
│   │   │   ├── events/      # Event management
│   │   │   ├── event-user-state/  # User status tracking
│   │   │   ├── health/      # Health checks
│   │   │   ├── maps/        # Location services
│   │   │   ├── meetings/    # Executive scheduling
│   │   │   ├── messaging/   # Direct messaging
│   │   │   ├── notifications/  # Push notifications
│   │   │   ├── people/      # User directory
│   │   │   ├── projects/    # Giving projects
│   │   │   ├── schedule/    # Event schedules
│   │   │   ├── shop/        # E-commerce
│   │   │   ├── surveys/     # Survey system
│   │   │   └── webhooks/    # External integrations
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       ├── migrations/
│   │       └── seed.ts
│   ├── admin/               # Next.js admin dashboard
│   │   ├── app/
│   │   │   ├── (auth)/      # Sign-in/sign-up
│   │   │   ├── (dashboard)/ # Protected admin pages
│   │   │   │   ├── events/  # Event management
│   │   │   │   ├── schedule/  # Schedule editor
│   │   │   │   ├── people/  # Attendee management
│   │   │   │   ├── shop/    # Product management
│   │   │   │   ├── projects/  # Giving management
│   │   │   │   └── surveys/  # Survey builder
│   │   │   └── (public)/    # Public pages
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # API client, hooks
│   └── mobile/              # React Native app
│       ├── app/
│       │   ├── (auth)/      # Authentication screens
│       │   ├── (tabs)/      # Main tab navigation
│       │   │   ├── index.tsx      # Event hub
│       │   │   ├── schedule.tsx   # Schedule view
│       │   │   ├── maps.tsx       # Venue maps
│       │   │   ├── people.tsx     # Directory
│       │   │   ├── messages.tsx   # Messaging
│       │   │   ├── donations.tsx  # Giving
│       │   │   ├── shop.tsx       # Merchandise
│       │   │   ├── surveys.tsx    # Surveys
│       │   │   └── more.tsx       # Settings
│       │   └── _layout.tsx
│       ├── components/      # Reusable components
│       ├── lib/             # API client, queries
│       └── assets/          # Images, fonts
├── docs/                    # Project documentation
├── supabase/               # Database configuration
│   ├── config.toml
│   └── migrations/
├── AppIcon Exports/        # Branding assets
├── package.json            # Monorepo config
├── pnpm-workspace.yaml     # pnpm workspace
├── eas.json               # Expo build config
└── railway.toml           # Deployment config
```

## Development Workflow

### Local Development Setup
1. Install pnpm 8.0+
2. Clone repository and install dependencies: `pnpm install`
3. Set up environment variables for each app
4. Run database migrations: `cd apps/api && pnpm db:migrate`
5. Start development servers: `pnpm dev` (runs all apps in parallel)
   - API: http://localhost:3001
   - Admin: http://localhost:3001 (Next.js dev)
   - Mobile: Expo DevClient

### Database Management
- **Migrations**: `pnpm db:migrate` - Apply schema changes
- **Studio**: `pnpm db:studio` - Open Prisma Studio GUI
- **Seed**: `pnpm db:seed` - Populate test data
- **Generate**: `pnpm db:generate` - Regenerate Prisma Client

### Deployment Process
1. **API**: Push to main → Railway auto-deploys with build command
2. **Admin**: Deploy via Vercel/Netlify with environment variables
3. **Mobile**: `eas build` → Submit to app stores via EAS Submit

## Documentation References

- API Documentation: http://localhost:3001/docs (Swagger UI in development)
- Mobile Giving Integration: `/docs/MOBILE_GIVING_INTEGRATION.md`
- Railway Deployment: `/docs/railway-deployment.md`
- Standards: See [Infrastructure](/docs/standards/infrastructure.md), [CI/CD](/docs/standards/cicd.md)

## Support & Contact

- Repository: https://github.com/Builders-International/Builders-Events
- EAS Project: e7e931c3-ce24-4f8a-a6a1-96114f753ab8
- Database: Supabase PostgreSQL (connection pooling enabled)
- Primary Package: com.buildersinternational.buildersevents
