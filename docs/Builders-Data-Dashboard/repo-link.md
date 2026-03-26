# Builders Data Dashboard - Repository Information

## Repository Location

### Local Development

**Path:** `~/Developer/Builders-Data-Dashboard`

**Full Path:** `/Users/elliottgodwin/Developer/Builders-Data-Dashboard`

### Remote Repository

**GitHub URL:** https://github.com/Builders-International/Builders-Data-Dashboard

**Organization:** Builders-International

**Repository Name:** Builders-Data-Dashboard

**Visibility:** Private (internal use only)

## Branch Information

### Main Branch

**Name:** `main`

**Protection Rules:**
- Direct commits allowed (no branch protection configured)
- Auto-deploy to Vercel on push

### Active Branches

Currently only `main` branch exists.

**Recommended Branching Strategy:**
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring
- `docs/*` - Documentation updates

## Key Contributors

### Primary Developer

**EGOD21** - All commits to date

### Team

- Finance Team (stakeholders)
- Operations Team (stakeholders)
- IT Team (support)

## Recent Activity

### Latest Commits

```
070b500 - cleaned up turbo caching issues
8ba3ee1 - fix: resolve NextAuth session creation issue
fa113e0 - feat: add NextAuth adapter tables to schema
0c809f2 - fix: force dynamic rendering for database pages
ed6b2e4 - fix: add postinstall script for Prisma generate on Vercel
bde9a1e - fix: convert Decimal coordinates to strings for rendering
2caca15 - initial commit
801d9d8 - docs: add browser automation scaffolds for v2
a30aebc - feat: add file upload system for Sage and DonorSnap
ef74179 - feat: add file upload parsers for Sage and DonorSnap
```

### Commit Message Conventions

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or tooling changes

## Development Setup

### Clone Repository

```bash
git clone https://github.com/Builders-International/Builders-Data-Dashboard.git
cd Builders-Data-Dashboard
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

See [overview.md](./overview.md) for complete setup instructions.

## Deployment

### Production Deployment

**Platform:** Vercel

**URL:** https://builders-data-dashboard.vercel.app (or custom domain)

**Auto-Deploy:** Enabled on push to `main` branch

### Environment Variables

Configure in Vercel dashboard:
- Database credentials
- Google API credentials
- NextAuth configuration
- Email service API keys

See [architecture.md](./architecture.md) for complete environment variable documentation.

## Related Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/_)
- [Vercel Dashboard](https://vercel.com/builders-international)
- [Google Cloud Console](https://console.cloud.google.com) (service account management)
