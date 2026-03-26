# Builders-Events Repository

## Repository Information

### Local Path
```
~/Developer/Builders-Events
```

### GitHub Repository
```
https://github.com/Builders-International/Builders-Events
```

### Repository Access
- **Organization**: Builders-International
- **Visibility**: Private
- **Primary Branch**: main

## Project Structure

### Monorepo Workspaces
The repository uses **pnpm workspaces** with three main applications:

```
apps/
├── api/          # NestJS backend API
├── admin/        # Next.js admin dashboard
└── mobile/       # React Native Expo app
```

## Contributors

### Development Team
Based on git history and recent commits:
- Active development team with consistent contributions
- Recent contributors focused on:
  - Feature development (giving, analytics, user management)
  - Bug fixes (type errors, mutation fixes)
  - Apple App Store compliance (account deletion)
  - UI improvements (product management, error handling)

## Recent Activity

### Latest Commits (as of March 2026)
```
7c70a05 - added post/DELETE endpoint for clerk account deletion - as requested by apple
6340241 - Added client-side error logging
b26be7a - added dropdown product selection
eb98c28 - fix useUpdateProduct type to match API DTO
1c08fc9 - fix product update mutation field names
f1ac11e - add error handling to edit product dialog
eb9720d - fix goalCents type error in event form
da2ea10 - fix product update mutation field names
1ab044d - add per-event analytics and giving goal tracking
860bb31 - fix product update mutation field names
```

### Development Focus Areas (Q1 2026)
1. **Compliance & Account Management**
   - Apple App Store compliance with account deletion endpoint
   - Support page with contact information
   - Delete account functionality

2. **Product & Shop Management**
   - Enhanced product editing with dropdown selection
   - Delete functionality for products
   - Fixed mutation field name mismatches

3. **Analytics & Metrics**
   - Per-event analytics tracking
   - Giving goal monitoring and progress tracking
   - User behavior logging

4. **User Management**
   - Photo upload support for user profiles
   - User flag system (SPA, GOLF, SHEBUILDS, FISH)
   - Relationship management (spouse, child, parent)
   - Enhanced message filtering

5. **Error Handling & Debugging**
   - Client-side error logging
   - Detailed photo upload logging
   - Better relationship creation error handling

### Development Timeline
- **December 2024 - January 2025**: Core feature development
- **January 2025**: User flags, relationships, photo uploads
- **February 2025**: Message filtering, error handling improvements
- **March 2025**: Analytics, product management, Apple compliance

## Repository Configuration

### Package Manager
```json
{
  "packageManager": "pnpm@10.18.3",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### Workspace Configuration (pnpm-workspace.yaml)
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Scripts
```json
{
  "dev": "pnpm --parallel -r dev",
  "build": "cd apps/api && pnpm run build",
  "start": "cd apps/api && pnpm run start",
  "lint": "pnpm -r lint",
  "clean": "pnpm -r clean && rm -rf node_modules"
}
```

## Branch Information

### Main Branch
- **Name**: `main`
- **Protection**: Likely protected for production deployments
- **Deploy Target**: Railway (API), Vercel/Netlify (Admin), EAS (Mobile)

### Development Workflow
Based on recent commits, the project follows:
1. Feature branches → main (or direct commits to main)
2. Railway auto-deploys on main push (API)
3. EAS builds triggered manually or via CI/CD

## External Project References

### Expo Application Services
- **EAS Project ID**: e7e931c3-ce24-4f8a-a6a1-96114f753ab8
- **Organization**: builders-international
- **Platforms**: iOS and Android

### App Store Information
- **iOS Bundle ID**: com.buildersinternational.buildersevents
- **Android Package**: com.buildersinternational.buildersevents
- **Apple Compliance**: Account deletion endpoint implemented

## Documentation

### In-Repository Documentation
```
docs/
├── MOBILE_GIVING_INTEGRATION.md    # Giving/projects integration guide
└── railway-deployment.md           # Deployment instructions
```

### Additional Documentation Files
- **NEXT_STEPS.md** - Development action items and resume codes
- **app.json** - Expo configuration
- **eas.json** - EAS Build configuration
- **railway.toml** - Railway deployment configuration

## Development Notes

### Next Steps (from NEXT_STEPS.md)
Recent action items include:
- Run Prisma migration for `event_registrations` table
- Redeploy API to Railway after migrations
- Deploy admin to Vercel/Netlify with proper environment variables
- Seed data for events, schedule, people, products, locations, surveys

### Codex Resume Codes
The project includes several Codex resume codes for development sessions:
- `b80834a9-c28b-4ab0-9455-7b9272a0c8ed`
- `6e4d6a0d-5925-42c7-9f26-0a1c571e6586`
- `019b9a5c-4bd9-7651-bb01-a5084346bf44`
- `019bec54-7133-7de2-a742-4887850b29bd`
- `019bfbeb-5673-7ce3-b58e-21f296dc1797`

## Repository Assets

### Branding Materials
```
AppIcon Exports/    # App icons for iOS/Android from Icon Composer
```
Includes splash screens, app icons, and general Builders International branding assets.

### AWS Credentials
```
builders-events-app_accessKeys.csv    # AWS access keys for S3 integration
```
**Security Note**: Credentials stored in repository (ensure .gitignore excludes from version control if needed)

## Git Ignore Configuration

### Ignored Directories/Files
```
node_modules/
.next/
dist/
build/
.env
.env.local
*.log
coverage/
.DS_Store
```

### Additional Ignores
```
.easignore     # EAS build exclusions
.npmrc         # npm/pnpm configuration
```

## Related Repositories

### Organization Repositories
- **builders-docs** - Documentation site (this repository)
- **Builders-Data-Dashboard** - FPD data management system
- **builders-events-mobile** - Possible separate mobile repository (check)
- **builders-radio** - Builders Radio project
- **buildersintl-website** - Main website
- **Vireo** - Vireo project

## Repository Statistics

### Commit Activity
- **Active development**: December 2024 - March 2026
- **Commit frequency**: High (multiple commits per day during active periods)
- **Recent commits**: 30+ commits since December 2024

### Code Size
- **Languages**: TypeScript (primary), JavaScript, CSS, JSON
- **Monorepo**: 3 applications with shared dependencies
- **Database**: 26+ Prisma models with extensive relationships

## Access & Permissions

### Required Access
- **GitHub**: Builders-International organization membership
- **Railway**: API deployment access
- **Vercel/Netlify**: Admin dashboard deployment access
- **EAS**: Expo organization membership
- **Clerk**: Authentication management access
- **Supabase**: Database access
- **Stripe**: Payment processing configuration
- **AWS**: S3 bucket access
- **Twilio**: SMS service access

### Environment Variables
Required across all environments (see architecture.md for details):
- Clerk authentication keys
- Database connection URLs
- Third-party API keys (Stripe, Twilio, AWS, etc.)

## Repository Health

### Build Status
- **API**: Production deployment on Railway (stable)
- **Admin**: Web deployment (stable)
- **Mobile**: EAS builds for iOS/Android (stable)

### Dependencies
- **Security**: No critical vulnerabilities noted
- **Updates**: Regular dependency updates in commits
- **Package Manager**: pnpm 10.18.3 (modern, performant)

### Testing
- **API**: Jest test framework configured
- **Admin**: Next.js testing setup
- **Mobile**: React Native testing (configuration present)

## Quick Start

### Clone Repository
```bash
git clone https://github.com/Builders-International/Builders-Events.git
cd Builders-Events
```

### Install Dependencies
```bash
pnpm install
```

### Setup Environment
```bash
# Create .env files for each app
apps/api/.env
apps/admin/.env.local
apps/mobile/.env
```

### Run Development Servers
```bash
pnpm dev  # Runs all apps in parallel
```

### Access Applications
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs (Swagger)
- **Admin**: http://localhost:3001 (Next.js)
- **Mobile**: Expo DevClient (expo start)

## Support

### Internal Documentation
- Architecture details: See `architecture.md`
- Feature overview: See `overview.md`
- Development roadmap: See `next-steps.md`

### External Resources
- **NestJS**: https://docs.nestjs.com
- **Next.js**: https://nextjs.org/docs
- **Expo**: https://docs.expo.dev
- **Prisma**: https://www.prisma.io/docs
- **Clerk**: https://clerk.dev/docs
