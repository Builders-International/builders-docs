# Builders Events Mobile - Repository Information

## Repository Location

### Local Development
**Path**: `~/Developer/builders-events-mobile`

**Full Path**: `/Users/elliottgodwin/Developer/builders-events-mobile`

### Remote Repository
**GitHub**: https://github.com/Builders-International/builders-events-mobile

**Clone URL**:
```bash
git clone https://github.com/Builders-International/builders-events-mobile.git
```

## Repository Details

### Organization
**Owner**: Builders-International

**Repository Name**: builders-events-mobile

**Visibility**: Private

### Branch Information
**Default Branch**: `master` (or `main`)

**Branch Strategy**:
- Feature branches for new development
- Direct commits to master for hotfixes
- No formal branching strategy (small team)

### Recent Activity

**Recent Commits** (as of March 2026):
```
fe43c15 - added account deletion mechanism in the UI
e5d2f40 - numped min.version.sdk down to 34
b0cfb5d - added bound deps for metro
d07f54e - forced Metro to use the browser bundle
4d9772c - added phone number verification in more tab
65c7242 - Added ensureEmailOnSignUp() to force‑update the email (and names if present)
160e115 - added clerk field requirement errors to surface in the UI
41e4328 - added more robust error logging
08cb3a3 - cleaned up optional phone auth route
325f656 - added optional phone verification after account creation
```

**Commit Patterns**:
- Active development with frequent commits
- Focus on authentication improvements (Clerk integration)
- Recent work on account management features
- Error handling and logging enhancements
- Android SDK updates

### Contributors

**Primary Contributors**:
- Builders International development team
- Regular commits throughout 2025-2026
- Active maintenance and feature development

### Repository Statistics

**Project Type**: React Native Mobile Application

**Package Manager**: pnpm

**Lines of Code**: ~15,000+ (estimated, including tests)

**Files**:
- Source files: ~100+
- Test files: ~10+
- Configuration files: ~15+

**Dependencies**:
- Production: 40+ packages
- Development: 20+ packages

## App Store & Distribution

### iOS App Store
**Bundle Identifier**: `com.buildersinternational.buildersevents`

**App Store URL**: Available on Apple App Store (search "Builders Events")

**TestFlight**: Internal testing available via TestFlight

**Version**: 1.0.2 (Build 6)

### Google Play Store
**Package Name**: `com.buildersinternational.buildersevents`

**Play Store URL**: Available on Google Play (search "Builders Events")

**Internal Testing**: Available via Google Play Internal Testing

**Version**: 1.0.2 (Version Code 9)

### Expo Application Services
**Project ID**: `e7e931c3-ce24-4f8a-a6a1-96114f753ab8`

**Owner**: `builders-international`

**EAS Project URL**: https://expo.dev/accounts/builders-international/projects/builders-events

**Build History**: Accessible via EAS dashboard

## Development Setup

### Prerequisites
- Node.js 18+ (project uses 20.11.0)
- pnpm package manager
- Expo CLI
- iOS: Xcode 15+ (Mac only)
- Android: Android Studio with SDK 24-35
- Git

### Quick Start
```bash
# Clone repository
git clone https://github.com/Builders-International/builders-events-mobile.git
cd builders-events-mobile

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

### Environment Variables Required
```bash
# .env
EXPO_PUBLIC_API_URL=https://builders-eventsapi-production.up.railway.app
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CLERK_JWT_TEMPLATE=api-token
```

## CI/CD Configuration

### EAS Build
**Configuration File**: `eas.json`

**Build Profiles**:
- `development` - Development builds with dev client
- `preview` - Internal testing builds
- `production` - App Store/Play Store releases

**Automated Builds**: Configured for production auto-increment

### Build Commands
```bash
# Development build
eas build --profile development --platform all

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

### Pre-Build Hooks
- iOS: CocoaPods cache cleaning and repo update
- Android: Google Services file validation
- Both: patch-package for dependency fixes

## Documentation Files

### In-Repository Documentation
- **README.md** - Project overview and quick start
- **SETUP.md** - Detailed setup instructions
- **TESTING.md** - Testing guide and best practices
- **PROJECT_STRUCTURE.md** - Architecture and file organization
- **IMPLEMENTATION_SUMMARY.md** - Recent production hardening summary
- **NEXT_STEPS.md** - Planned improvements and features
- **DEBUGGING_WHITE_SCREEN.md** - Troubleshooting common issues

### External Documentation
- **Docusaurus Site**: /docs/builders-events-mobile/ (this documentation)
- **Standards**: /docs/standards/ (coding standards, CI/CD, testing)

## Related Repositories

### Backend API
**Repository**: builders-events-api (assumed, not confirmed)

**Production URL**: https://builders-eventsapi-production.up.railway.app

**Hosted on**: Railway

**Integration**: RESTful API with JWT authentication via Clerk

### Web Application
**Repository**: builders-events (Next.js web app)

**Production URL**: https://buildersinternational.com (assumed)

**Shared Services**:
- Same backend API
- Same Clerk authentication instance
- Shared database

### Design System
**Shared Design Language**: "Liquid Glass" design system

**Color Palette**:
- Primary: #004d72 (Deep Blue)
- Accent: #e2783e (Warm Orange)
- Success: #2f8f6e (Forest Green)
- Error: #c44242 (Ruby Red)

## Issue Tracking

### GitHub Issues
**URL**: https://github.com/Builders-International/builders-events-mobile/issues

**Issue Labels**:
- `bug` - Bug reports and fixes
- `enhancement` - Feature requests
- `documentation` - Documentation improvements
- `dependencies` - Dependency updates
- `platform:ios` - iOS-specific issues
- `platform:android` - Android-specific issues

### Known Issues
See NEXT_STEPS.md and GitHub Issues for current known issues and planned improvements.

## Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Code Review Process
- Pull requests reviewed by team members
- CI checks must pass (linting, type checking, tests)
- At least one approval required
- Squash and merge to keep history clean

### Release Process
1. Update version in `app.config.ts` and `app.json`
2. Update build numbers (auto-incremented for production)
3. Create git tag: `git tag v1.0.2`
4. Push tag: `git push origin v1.0.2`
5. Build with EAS: `eas build --profile production --platform all`
6. Submit to stores: `eas submit --platform all --latest`
7. Monitor rollout in App Store Connect / Google Play Console

## Support & Contact

### Team Communication
- **GitHub Discussions**: For feature requests and general questions
- **GitHub Issues**: For bug reports and technical issues
- **Email**: support@buildersinternational.com (for users)

### Development Team
**Organization**: Builders International

**Team Size**: Small team (2-5 developers, estimated)

**Active Development**: Ongoing with regular commits and updates

## Security & Access

### Repository Access
- Private repository
- Access restricted to Builders International organization members
- Read access for contractors/contributors as needed

### Secrets Management
- Environment variables stored in `.env` (gitignored)
- Expo secrets managed via EAS Secrets
- App Store / Play Store credentials managed via EAS Submit
- Clerk publishable keys safe to include in builds
- Stripe publishable keys safe to include in builds

### API Keys & Credentials
**Stored in EAS Secrets**:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_API_URL`
- App Store Connect API Key
- Google Play Service Account Key

**Stored in SecureStore (runtime)**:
- User authentication tokens
- Event registration keys
- User preferences

## Monitoring & Analytics

### Expo Dashboard
**URL**: https://expo.dev/accounts/builders-international/projects/builders-events

**Metrics Available**:
- Build history and status
- Update deployments (OTA updates)
- Crash reports (if configured)
- User analytics (if configured)

### App Store Connect
**iOS Metrics**:
- Download statistics
- Crash reports
- User reviews and ratings
- TestFlight usage

### Google Play Console
**Android Metrics**:
- Download statistics
- Crash reports (Google Play Console)
- User reviews and ratings
- Pre-launch reports

## Migration History

### Version History
**v1.0.2** (Current - March 2026)
- Account deletion mechanism
- Phone number verification
- Enhanced error logging
- Clerk authentication improvements

**v1.0.1** (February 2026)
- Initial production release
- Core features implemented
- App Store and Play Store launch

**v1.0.0** (January 2026)
- Beta release
- Testing and bug fixes
- Performance optimizations

### Technology Migrations
**Expo SDK Upgrades**:
- Expo SDK 50 → 52 (Current)
- React Native 0.73 → 0.76.9

**Authentication Migration**:
- Custom auth → Clerk (completed)
- Added passkey support

**Build System Migration**:
- expo build → EAS Build (completed)

## Backup & Recovery

### Code Backup
- Primary: GitHub repository (automatic)
- Local: Developer machines
- EAS Build: Source code snapshots with each build

### Build Artifacts
- EAS Build dashboard: 90-day retention
- Local builds: Stored in `~/Library/Developer/Xcode/Archives/` (iOS)

### Data Recovery
- User data: Backed up on backend (not in mobile app)
- Local cache: Can be cleared/rebuilt from server
- Secure store: Device-specific, lost if device is reset

## Compliance & Legal

### Open Source Licenses
**License File**: See repository for LICENSE file

**Dependencies**: All dependencies reviewed for license compatibility

**Third-Party Notices**: Generated during build process

### App Store Compliance
- ✅ Apple App Store Guidelines compliance
- ✅ Google Play Store policies compliance
- ✅ Privacy policy required and provided
- ✅ Terms of service required and provided

### Privacy Compliance
- GDPR: Account deletion available
- CCPA: California privacy rights supported
- Data collection disclosed in privacy policy
- User consent collected for optional permissions

## Additional Resources

### Expo Documentation
- **Expo Docs**: https://docs.expo.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/

### React Native Documentation
- **React Native**: https://reactnative.dev/
- **React**: https://react.dev/

### Third-Party Services
- **Clerk Auth**: https://clerk.com/docs
- **Stripe Payments**: https://stripe.com/docs/mobile
- **React Query**: https://tanstack.com/query/latest

### Related Standards Documentation
- **Coding Standards**: /docs/standards/coding
- **Testing Standards**: /docs/standards/testing
- **CI/CD Workflows**: /docs/standards/infrastructure

---

**Documentation Version**: 1.0
**Last Updated**: March 26, 2026
**Maintained By**: Builders International Development Team
