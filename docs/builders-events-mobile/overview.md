# Builders Events Mobile App - Overview

## Purpose

The Builders Events Mobile App is the primary mobile application for Builders International events, providing attendees with a comprehensive platform to engage with event content, connect with other participants, and access event resources on-the-go. Built with React Native and Expo, the app delivers a native mobile experience on both iOS and Android platforms.

## Key Features

### For Event Attendees

**Event Discovery & Management**
- Browse upcoming and past Builders International events
- View detailed event information including dates, locations, and descriptions
- Access event-specific content and resources
- Track event participation history

**Schedule Management**
- View personalized event schedules
- Browse session listings with times and locations
- Set reminders for important sessions
- Filter and search schedule items

**People Directory**
- Search and browse event attendees
- View participant profiles with roles and interests
- Connect with other builders and industry professionals
- Network with event participants

**Messaging System**
- Send and receive messages with other attendees
- Real-time message notifications
- Thread-based conversations
- Message history and search

**Shop Integration**
- Browse event merchandise and products
- View product details with images and descriptions
- Purchase items with integrated payment processing
- Order history and tracking

**Donation Platform**
- Support Builders International projects
- Make secure donations through the app
- View donation history
- Receive donation receipts

**Interactive Maps**
- View event venue maps with Google Maps/Apple Maps
- Find session locations within venues
- Get directions to event locations
- View nearby points of interest

**Surveys & Feedback**
- Participate in event surveys
- Provide session feedback
- Rate speakers and content
- Contribute to event improvement

**Push Notifications**
- Receive real-time event updates
- Get notified about schedule changes
- Receive message notifications
- Stay informed about important announcements

### For Event Organizers

**User Engagement Tracking**
- Monitor app usage and feature adoption
- Track event participation rates
- Analyze user engagement patterns

**Communication Channel**
- Direct communication with all attendees
- Targeted notifications for specific groups
- Emergency announcements and updates

## Technology Stack

### Core Framework
- **Expo SDK 52** - React Native development platform with managed workflow
- **React Native 0.76.9** - Cross-platform mobile framework
- **React 18.3.1** - UI component library
- **TypeScript 5.3** - Type-safe development

### Navigation & Routing
- **Expo Router 4.0** - File-based routing with type safety
- **React Native Screens 4.4** - Native screen optimization
- **React Native Safe Area Context 4.12** - Safe area handling

### Authentication & Security
- **Clerk Expo 2.19** - Modern authentication platform
- **Clerk Expo Passkeys 0.4** - Biometric authentication support
- **Expo Local Authentication 15.0** - Face ID/Touch ID integration
- **Expo Secure Store 14.0** - Encrypted credential storage

### Data Management
- **TanStack React Query 5.17** - Server state management and caching
- **Async Storage Persister** - Persistent query cache
- **Axios 1.6** - HTTP client for API communication

### Payment Processing
- **Stripe React Native 0.38** - Integrated payment processing
- **Stripe SDK** - Secure payment forms and checkout

### Maps & Location
- **React Native Maps 1.18** - Native map components
- **Expo Location 18.0** - Location services integration
- Google Maps API (Android) and Apple Maps (iOS)

### Notifications
- **Expo Notifications 0.29** - Push notification handling
- **Expo Device 7.0** - Device information for notification targeting

### UI & Animation
- **React Native Reanimated 3.16** - High-performance animations
- **Expo Blur 14.0** - Native blur effects for Liquid Glass design
- **Expo Vector Icons 14.0** - Icon library (Ionicons, FontAwesome, etc.)

### Development & Testing
- **Jest 29.7** - Unit testing framework
- **ts-jest 29.1** - TypeScript support for Jest
- **Testing Library React 14.0** - React component testing
- **ESLint 8.0** - Code quality and linting
- **TypeScript ESLint 6.0** - TypeScript-specific linting rules

### Build & Deployment
- **EAS Build** - Expo Application Services for cloud builds
- **EAS Submit** - Automated app store submission
- **pnpm** - Fast, disk-efficient package manager

## Platform Support

### iOS
- **Minimum Version**: iOS 13.4
- **Target Version**: Latest iOS
- **Bundle Identifier**: com.buildersinternational.buildersevents
- **Build Number**: 6 (as of v1.0.2)
- **App Store**: Available for download

**iOS-Specific Features:**
- Face ID authentication
- Apple Maps integration
- Associated domains for deep linking
- Push notification support via APNs

### Android
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 35 (Android 15)
- **Package Name**: com.buildersinternational.buildersevents
- **Version Code**: 9 (as of v1.0.2)
- **Google Play**: Available for download

**Android-Specific Features:**
- Fingerprint authentication
- Google Maps integration
- Deep linking with App Links
- Push notification support via FCM
- Adaptive icon support

### Web (Preview)
- Metro bundler support for web preview
- Limited feature set (no native modules)
- Development and testing purposes only

## Target Users

### Primary Users
- **Event Attendees** - Builders, contractors, and construction industry professionals attending Builders International events
- **Conference Participants** - Speakers, vendors, and exhibitors at events
- **Organization Members** - Builders International members and volunteers

### Secondary Users
- **Event Staff** - Event organizers and coordinators who monitor app usage
- **Support Team** - Customer support staff assisting with app-related issues

## Current Status

**Version**: 1.0.2
**Status**: Production Release
**Last Updated**: March 2026

### Production Status
- ✅ Live on Apple App Store
- ✅ Live on Google Play Store
- ✅ Full feature parity across iOS and Android
- ✅ Production API integration
- ✅ Push notifications configured
- ✅ Payment processing active
- ✅ Comprehensive test coverage (29 passing tests)

### Recent Updates (v1.0.2)
- Added account deletion mechanism in UI
- Added phone number verification in More tab
- Implemented forced email update on sign-up
- Enhanced Clerk field requirement error surfacing
- Improved error logging and debugging
- Added optional phone verification after account creation
- Updated minimum SDK version to 24 (Android)
- Fixed Metro bundler configuration for browser bundle

### Known Issues
- Pre-existing TypeScript errors in some app screens (non-critical)
- Occasional Clerk authentication edge cases being addressed

## App Store Information

### iOS App Store
- **Name**: Builders Events
- **Category**: Productivity / Events
- **Age Rating**: 4+ (suitable for all ages)
- **Size**: ~50-60 MB (varies by device)
- **Languages**: English

### Google Play Store
- **Name**: Builders Events
- **Category**: Events
- **Content Rating**: Everyone
- **Size**: ~40-50 MB (varies by device)
- **Languages**: English

## Key Integrations

### Backend API
- **Production URL**: https://builders-eventsapi-production.up.railway.app
- **Hosted on**: Railway
- RESTful API with JSON responses
- JWT-based authentication via Clerk
- Real-time updates support

### Authentication Provider
- **Clerk**: clerk.buildersevents.org
- OAuth-style authentication flow
- Email/password and passkey support
- JWT token management
- Associated domain verification

### Payment Processing
- **Stripe**: Integrated payment gateway
- Secure card processing
- PCI-compliant
- Support for donations and shop purchases

### Push Notifications
- **Expo Push Notification Service**
- **Project ID**: e7e931c3-ce24-4f8a-a6a1-96114f753ab8
- **Owner**: builders-international
- iOS: APNs integration
- Android: FCM integration

### Maps Integration
- **iOS**: Apple Maps SDK
- **Android**: Google Maps SDK
- Google Services configured via google-services.json

## Development Approach

### Design Philosophy
- **Mobile-First**: Native mobile experience optimized for touch
- **Liquid Glass Design**: Light-first design with frosted glass surfaces and subtle shadows
- **Accessibility**: WCAG 2.1 AA compliance with high contrast and clear typography
- **Performance**: 60fps animations, optimistic updates, aggressive caching
- **Offline-First**: Query persistence for offline access to cached data

### Testing Strategy
- **Node-Only Unit Tests**: Fast, CI/CD-friendly tests without React Native runtime
- **29 Passing Tests**: Comprehensive coverage of API, providers, and queries
- **Mock-Based**: Expo and React Native modules mocked for speed
- **Coverage Thresholds**: 50% minimum across branches, functions, lines, statements

### Deployment Strategy
- **EAS Build**: Cloud-based builds for iOS and Android
- **Automated Versioning**: Auto-increment build numbers on production builds
- **Environment-Based**: Separate development, preview, and production builds
- **Continuous Deployment**: Automated builds on git push

## User Experience Highlights

### Onboarding Flow
1. Download app from App Store or Google Play
2. Launch app and view splash screen
3. Sign up with email and password
4. Verify email address
5. Optional: Enable biometric authentication
6. Optional: Verify phone number
7. Grant notification permissions
8. Grant location permissions (for maps)
9. Explore app features via bottom tab navigation

### Navigation Structure
- **Bottom Tab Navigation**: 2 primary tabs (Home, More)
- **Stack Navigation**: Deep navigation within each tab
- **Modal Navigation**: Full-screen modals for focused tasks
- **Deep Linking**: Direct navigation via URLs (builders-events://)

### Color Scheme
**Light Theme (Default):**
- Primary: #004d72 (Deep Blue)
- Primary Light: #5f9baf (Sky Blue)
- Accent: #e2783e (Warm Orange)
- Background: #ffffff (White)
- Secondary Surface: #f4f8fb (Soft Blue-Gray)
- Text: #0b1d28 (Dark Blue-Black)
- Success: #2f8f6e (Forest Green)
- Error: #c44242 (Ruby Red)

**Dark Theme (Available):**
- Theme-aware colors adapt for dark mode
- Automatic switching based on system preferences

## Privacy & Security

### Data Protection
- All authentication tokens stored in Expo SecureStore (encrypted)
- No sensitive data stored in plain text
- HTTPS-only API communication
- JWT tokens with short expiration times

### Permissions
- **Required**: Internet access for API communication
- **Optional**: Location (for maps), Camera (for QR codes), Notifications (for updates), Biometric (for quick sign-in)
- **User Control**: All permissions can be denied/revoked at any time

### Compliance
- **GDPR**: User data deletion support via account settings
- **CCPA**: California privacy compliance
- **App Store Guidelines**: Full compliance with Apple and Google policies

## Support & Resources

### User Support
- In-app help and FAQs
- Email support: support@buildersinternational.com
- Account deletion available in More tab

### Documentation
- README.md - General project information
- SETUP.md - Development setup instructions
- TESTING.md - Testing infrastructure guide
- PROJECT_STRUCTURE.md - Detailed architecture overview
- IMPLEMENTATION_SUMMARY.md - Recent implementation details
- NEXT_STEPS.md - Planned improvements

### Community
- GitHub Repository: https://github.com/Builders-International/builders-events-mobile
- Issue Tracking: GitHub Issues
- Feature Requests: GitHub Discussions

## Future Vision

The Builders Events Mobile App is continuously evolving to better serve the Builders International community. Upcoming features and improvements are tracked in the repository's issue tracker and NEXT_STEPS.md file.

**Core Goals:**
1. Enhance attendee engagement and networking capabilities
2. Provide seamless access to event information and resources
3. Facilitate meaningful connections within the Builders community
4. Support event organizers with real-time communication tools
5. Maintain high performance and reliability standards

---

**Documentation Version**: 1.0
**Last Updated**: March 26, 2026
**Maintained By**: Builders International Development Team
