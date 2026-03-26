# Builders Events Mobile App - Architecture

## System Architecture Overview

The Builders Events Mobile App is built using a modern React Native architecture with Expo as the development platform. The app follows a modular, component-based architecture with clear separation of concerns between UI, business logic, and data management layers.

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (React Native Components)                         │
│  ├─ Screens (app/)                                          │
│  ├─ Components (components/)                                │
│  └─ Providers (providers/)                                  │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                        │
│  ├─ React Query Hooks (lib/queries/)                       │
│  ├─ API Client (lib/api-client.ts)                         │
│  ├─ Authentication (Clerk + lib/auth-utils.ts)             │
│  └─ Utilities (lib/utils/)                                  │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├─ React Query Cache (with AsyncStorage persistence)      │
│  ├─ Secure Storage (Expo SecureStore)                      │
│  └─ Local State (React Context)                             │
├─────────────────────────────────────────────────────────────┤
│  Platform Layer (Expo Modules)                              │
│  ├─ Native Modules (iOS/Android)                           │
│  ├─ Notifications                                           │
│  ├─ Location Services                                       │
│  ├─ Biometric Authentication                                │
│  └─ Secure Storage                                          │
└─────────────────────────────────────────────────────────────┘
                            ↕
            ┌───────────────────────────┐
            │   External Services       │
            ├───────────────────────────┤
            │  Backend API (Railway)    │
            │  Clerk Authentication     │
            │  Stripe Payments          │
            │  Expo Push Notifications  │
            │  Google/Apple Maps        │
            └───────────────────────────┘
```

## Technology Stack Details

### Core Framework

**Expo SDK 52.0.48**
- Managed React Native workflow with simplified native module access
- Over-the-air updates support
- EAS Build for cloud-based compilation
- Expo Router for file-based routing
- Pre-configured native modules (notifications, location, auth, etc.)

**React Native 0.76.9**
- Cross-platform mobile framework (iOS/Android)
- Native performance with JavaScript logic
- Hot reloading for rapid development
- Bridge architecture for native module communication

**React 18.3.1**
- Concurrent rendering for improved performance
- Automatic batching of state updates
- Suspense for data fetching
- Server Components support (future consideration)

**TypeScript 5.3.0**
- Full type safety across codebase
- Strict mode enabled
- Type inference for reduced boilerplate
- Interface-driven development

### Navigation Architecture

**Expo Router 4.0.22** (File-Based Routing)

The app uses Expo Router, which provides a file-system-based routing solution similar to Next.js. Routes are automatically generated based on file structure in the `app/` directory.

**Route Structure:**
```
app/
├── _layout.tsx                 # Root layout (providers, global setup)
├── index.tsx                   # Entry point (auth redirect logic)
│
├── (auth)/                     # Authentication stack (no tabs)
│   ├── _layout.tsx            # Auth stack layout
│   ├── sign-in.tsx            # Sign in screen
│   ├── sign-up.tsx            # Sign up with email verification
│   └── email-link.tsx         # Email verification handler
│
├── (tabs)/                     # Main app (bottom tabs)
│   ├── _layout.tsx            # Tab navigator layout
│   ├── index.tsx              # Home/Events tab
│   └── more.tsx               # More/Settings tab
│
└── event/                      # Event details (modal stack)
    └── [id]/                  # Dynamic event ID route
        ├── index.tsx          # Event overview
        ├── schedule.tsx       # Event schedule
        ├── people.tsx         # Event attendees
        ├── messages.tsx       # Event messages
        ├── shop.tsx           # Event shop
        ├── donations.tsx      # Event donations
        ├── maps.tsx           # Event maps
        └── surveys.tsx        # Event surveys
```

**Navigation Features:**
- **Type-Safe Routes**: TypeScript types auto-generated for all routes
- **Deep Linking**: Universal links (https://) and custom scheme (builders-events://)
- **Stack Navigation**: Hierarchical navigation with back buttons
- **Tab Navigation**: Bottom tab bar with 2 primary tabs
- **Modal Navigation**: Full-screen modals for focused tasks
- **Typed Routes**: Experiments enabled for typed route navigation

**Deep Linking Configuration:**
```typescript
// app.config.ts
scheme: 'builders-events',
associatedDomains: [
  'webcredentials:clerk.buildersevents.org',
  'webcredentials:buildersinternational.com',
]
```

### State Management Architecture

The app uses a multi-layered state management approach:

**1. Server State (React Query)**

**TanStack React Query 5.17.0** - Primary state management solution
- Automatic caching with stale-while-revalidate pattern
- Background refetching for fresh data
- Optimistic updates for instant UI feedback
- Query invalidation for manual updates
- Persistent cache with AsyncStorage

**Configuration:**
```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      cacheTime: 10 * 60 * 1000,       // 10 minutes
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// Persist cache to AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: QUERY_CACHE_KEY,
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});
```

**Query Hooks:**
```typescript
// lib/queries/use-events.ts
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api.getEvents(),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });
}
```

**Available Query Hooks:**
- `use-events.ts` - Events listing and details
- `use-schedule.ts` - Event schedules
- `use-people.ts` - Attendee directory
- `use-messages.ts` - Message threads
- `use-products.ts` - Shop products
- `use-projects.ts` - Donation projects
- `use-surveys.ts` - Survey listings
- `use-locations.ts` - Map locations
- `use-meetings.ts` - Meeting scheduling

**2. Global State (React Context)**

**Context Providers:**
```typescript
// Root Layout Provider Stack
<ClerkProvider>
  <QueryClientProvider>
    <StripeProvider>
      <SafeAreaProvider>
        <EventProvider>
          <BrandingProvider>
            <ShopProvider>
              <RootErrorBoundary>
                {/* App Routes */}
              </RootErrorBoundary>
            </ShopProvider>
          </BrandingProvider>
        </EventProvider>
      </SafeAreaProvider>
    </StripeProvider>
  </QueryClientProvider>
</ClerkProvider>
```

**EventProvider** (`providers/EventProvider.tsx`)
- Manages current event context
- Stores event registration keys in SecureStore
- Provides event switching functionality
- Tracks user's registered events

**BrandingProvider** (`providers/BrandingProvider.tsx`)
- Theme management (light/dark mode)
- Dynamic color scheme
- Brand asset loading
- Liquid Glass design system utilities

**ShopProvider** (`providers/ShopProvider.tsx`)
- Shopping cart state
- Product selection
- Checkout flow management
- Order history

**3. Local State (React Hooks)**
- `useState` for component-level state
- `useReducer` for complex form state
- `useRef` for mutable references (scroll positions, timers)
- `useMemo` / `useCallback` for performance optimization

**4. Secure Storage (Expo SecureStore)**
- Authentication tokens (Clerk JWT)
- Event registration keys
- User preferences
- Sensitive configuration

### Authentication & Authorization

**Clerk Expo 2.19.21** - Modern Authentication Platform

**Architecture:**
```typescript
// Root Layout (_layout.tsx)
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

// Clerk token cache using SecureStore
const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

<ClerkProvider
  publishableKey={CLERK_PUBLISHABLE_KEY}
  tokenCache={tokenCache}
>
  <App />
</ClerkProvider>
```

**Authentication Flow:**

1. **Sign Up** (`app/(auth)/sign-up.tsx`)
   - Email and password collection
   - Client-side validation
   - Clerk user creation
   - Email verification sent
   - Optional: Phone number verification

2. **Email Verification** (`app/(auth)/email-link.tsx`)
   - Magic link handler
   - Token exchange
   - Session establishment
   - Redirect to app

3. **Sign In** (`app/(auth)/sign-in.tsx`)
   - Email/password authentication
   - Optional: Passkey authentication (biometrics)
   - Remember me functionality
   - Session token storage

4. **Biometric Authentication** (`hooks/useBiometricAuth.ts`)
   - Face ID / Touch ID support
   - Fallback to password
   - Secure key storage
   - Re-authentication on app resume

**Authorization:**
- JWT tokens issued by Clerk
- Custom JWT template for API authorization
- Token refresh handled automatically
- API client injects token in Authorization header

**Token Flow:**
```typescript
// lib/api-client.ts
let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getToken: () => Promise<string | null>) {
  getTokenFn = getToken;
}

// Axios interceptor
apiClient.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Root layout setup
import { useAuth } from '@clerk/clerk-expo';
import { setAuthTokenGetter } from '@/lib/api-client';

function RootLayout() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken({ template: 'api-token' }));
  }, [getToken]);
}
```

**Passkeys Integration:**
```typescript
// app.config.ts - iOS
infoPlist: {
  NSFaceIDUsageDescription: 'Allow Builders Events to use Face ID for quick and secure sign in.',
}

// app.config.ts - Android
permissions: ['USE_BIOMETRIC', 'USE_FINGERPRINT']

// Passkey creation
import { passkeys } from '@clerk/clerk-expo/passkeys';

async function createPasskey() {
  await passkeys.create();
}
```

### API Integration

**Axios 1.6.0** - HTTP Client

**Client Configuration:**
```typescript
// lib/api-client.ts
export const apiClient = axios.create({
  baseURL: API_URL, // https://builders-eventsapi-production.up.railway.app
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});
```

**Request Interceptor:**
```typescript
apiClient.interceptors.request.use(
  async (config) => {
    // Inject authentication token
    const token = await getTokenFn();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details (development)
    if (__DEV__) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Response Interceptor:**
```typescript
apiClient.interceptors.response.use(
  (response) => {
    // Log response (development)
    if (__DEV__) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired - trigger re-authentication
      await refreshAuthToken();
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);
```

**API Methods:**
```typescript
export const api = {
  // Events
  getEvents: () => apiClient.get('/events'),
  getEvent: (id: string) => apiClient.get(`/events/${id}`),

  // Schedule
  getSchedule: (eventId: string) => apiClient.get(`/events/${eventId}/schedule`),

  // People
  getPeople: (eventId: string) => apiClient.get(`/events/${eventId}/people`),

  // Messages
  getMessages: () => apiClient.get('/messages'),
  sendMessage: (data: MessageData) => apiClient.post('/messages', data),

  // Products
  getProducts: (eventId: string) => apiClient.get(`/events/${eventId}/products`),

  // Donations
  getProjects: () => apiClient.get('/projects'),

  // Surveys
  getSurveys: (eventId: string) => apiClient.get(`/events/${eventId}/surveys`),
  submitSurvey: (data: SurveyData) => apiClient.post('/surveys', data),

  // Locations
  getLocations: (eventId: string) => apiClient.get(`/events/${eventId}/locations`),
};
```

**Error Handling:**
```typescript
// Custom error types
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
  }
}

// Error transformation
function handleAPIError(error: AxiosError): never {
  if (error.response) {
    throw new APIError(
      error.response.status,
      error.response.data?.message || error.message,
      error.response.data
    );
  }
  throw new APIError(0, 'Network error', error.message);
}
```

### Push Notifications

**Expo Notifications 0.29.14**

**Architecture:**
```typescript
// Root layout notification setup
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions and get token
async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'e7e931c3-ce24-4f8a-a6a1-96114f753ab8',
  });

  return token.data;
}

// Send token to backend
async function registerPushToken(token: string) {
  await api.registerPushToken({ token });
}
```

**Notification Channels (Android):**
```typescript
// Create notification channels for Android
if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#004d72',
  });

  await Notifications.setNotificationChannelAsync('messages', {
    name: 'Messages',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#e2783e',
  });
}
```

**Notification Handling:**
```typescript
// Listen for foreground notifications
Notifications.addNotificationReceivedListener((notification) => {
  console.log('Notification received:', notification);
  // Update UI, refetch data, etc.
});

// Listen for notification taps
Notifications.addNotificationResponseReceivedListener((response) => {
  console.log('Notification tapped:', response);
  const data = response.notification.request.content.data;

  // Navigate based on notification data
  if (data.type === 'message') {
    router.push(`/messages/${data.messageId}`);
  } else if (data.type === 'event') {
    router.push(`/event/${data.eventId}`);
  }
});
```

**Configuration:**
```typescript
// app.config.ts
plugins: [
  [
    'expo-notifications',
    {
      icon: './assets/notification-icon.png',
      color: '#004d72',
    },
  ],
]
```

### Maps Integration

**React Native Maps 1.18.0**

**Platform-Specific Configuration:**

**iOS** - Apple Maps
```typescript
// app.config.ts
ios: {
  infoPlist: {
    NSLocationWhenInUseUsageDescription: 'This app uses your location to show nearby events and venues.',
    NSLocationAlwaysAndWhenInUseUsageDescription: 'This app uses your location to show nearby events and venues.',
  },
}
```

**Android** - Google Maps
```typescript
// app.config.ts
android: {
  permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  googleServicesFile: './google-services.json',
}
```

**Map Component Usage:**
```typescript
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

function EventMapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      initialRegion={{
        latitude: location?.coords.latitude ?? 37.7749,
        longitude: location?.coords.longitude ?? -122.4194,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
}
```

### Payment Processing

**Stripe React Native 0.38.6**

**Configuration:**
```typescript
// app.config.ts
plugins: [
  [
    '@stripe/stripe-react-native',
    {
      enableGooglePay: false, // Future: enable for Android
    },
  ],
]

// Root layout
import { StripeProvider } from '@stripe/stripe-react-native';

<StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
  {/* App */}
</StripeProvider>
```

**Payment Flow:**
```typescript
import { useStripe } from '@stripe/stripe-react-native';

function CheckoutScreen() {
  const { confirmPayment } = useStripe();

  async function handlePayment(amount: number) {
    // 1. Create payment intent on backend
    const { clientSecret } = await api.createPaymentIntent({ amount });

    // 2. Confirm payment with Stripe
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      Alert.alert('Payment failed', error.message);
    } else if (paymentIntent) {
      Alert.alert('Payment successful!');
      // Navigate to success screen
    }
  }

  return (
    <CardField
      postalCodeEnabled={true}
      placeholder={{
        number: '4242 4242 4242 4242',
      }}
      cardStyle={{
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
      }}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 30,
      }}
      onCardChange={(cardDetails) => {
        console.log('Card details:', cardDetails);
      }}
    />
  );
}
```

### File Structure

```
builders-events-mobile/
│
├── app/                              # Expo Router pages (file-based routing)
│   ├── _layout.tsx                   # Root layout with providers
│   ├── index.tsx                     # Entry point with auth redirect
│   ├── (auth)/                       # Authentication stack
│   │   ├── _layout.tsx              # Auth stack layout
│   │   ├── sign-in.tsx              # Sign in screen
│   │   ├── sign-up.tsx              # Sign up screen
│   │   └── email-link.tsx           # Email verification handler
│   ├── (tabs)/                       # Main app tabs
│   │   ├── _layout.tsx              # Tab navigator
│   │   ├── index.tsx                # Home/Events tab
│   │   └── more.tsx                 # More/Settings tab
│   └── event/                        # Event details
│       └── [id]/                    # Dynamic event route
│           ├── index.tsx            # Event overview
│           ├── schedule.tsx         # Event schedule
│           ├── people.tsx           # Event attendees
│           ├── messages.tsx         # Event messages
│           ├── shop.tsx             # Event shop
│           ├── donations.tsx        # Event donations
│           ├── maps.tsx             # Event maps
│           └── surveys.tsx          # Event surveys
│
├── components/                       # Reusable UI components
│   ├── EventCard.tsx                # Event card component
│   ├── ScheduleItem.tsx             # Schedule item component
│   ├── PersonCard.tsx               # Person card component
│   ├── MessageBubble.tsx            # Message bubble component
│   ├── ProductCard.tsx              # Product card component
│   ├── ExpandableProductCard.tsx    # Expandable product card
│   ├── LoadingSpinner.tsx           # Loading indicator
│   ├── EmptyState.tsx               # Empty state component
│   ├── BuiltByFooter.tsx            # Footer component
│   └── RootErrorBoundary.tsx        # Global error boundary
│
├── lib/                             # Business logic and utilities
│   ├── api-client.ts                # Axios API client
│   ├── api-client.unit.test.ts     # API client tests
│   ├── auth-utils.ts                # Authentication utilities
│   ├── biometric-auth.ts            # Biometric auth logic
│   ├── query-client.ts              # React Query configuration
│   ├── realtime-client.ts           # WebSocket/realtime client
│   ├── queries/                     # React Query hooks
│   │   ├── use-events.ts            # Event queries
│   │   ├── use-events.unit.test.ts  # Event query tests
│   │   ├── use-schedule.ts          # Schedule queries
│   │   ├── use-people.ts            # People queries
│   │   ├── use-messages.ts          # Message queries
│   │   ├── use-products.ts          # Product queries
│   │   ├── use-projects.ts          # Project/donation queries
│   │   ├── use-surveys.ts           # Survey queries
│   │   ├── use-locations.ts         # Location queries
│   │   └── use-meetings.ts          # Meeting queries
│   ├── utils/                       # Utility functions
│   │   ├── base64.ts                # Base64 encoding/decoding
│   │   └── liquid-glass.ts          # Liquid Glass design utilities
│   └── mocks/                       # Test mocks
│
├── providers/                        # React Context providers
│   ├── EventProvider.tsx            # Event context
│   ├── EventProvider.unit.test.tsx  # Event provider tests
│   ├── BrandingProvider.tsx         # Theme/branding context
│   ├── ShopProvider.tsx             # Shopping cart context
│   ├── RealtimeProvider.tsx         # WebSocket context
│   └── RealtimeProvider.unit.test.tsx
│
├── hooks/                           # Custom React hooks
│   └── useBiometricAuth.ts         # Biometric authentication hook
│
├── types/                           # TypeScript type definitions
│   ├── index.ts                     # Main type exports
│   └── router.d.ts                  # Expo Router types
│
├── constants/                       # App constants
│   ├── Colors.ts                    # Color scheme
│   └── Layout.ts                    # Layout constants
│
├── assets/                          # Static assets
│   ├── icon.png                     # App icon
│   ├── splash.png                   # Splash screen
│   ├── splash.mp4                   # Animated splash (optional)
│   ├── adaptive-icon.png            # Android adaptive icon
│   ├── notification-icon.png        # Notification icon
│   ├── favicon.png                  # Web favicon
│   ├── BlueLogo.png                 # Brand logo (blue)
│   └── WhiteLogo.png                # Brand logo (white)
│
├── ios/                             # iOS native code
│   ├── BuildersEvents/              # iOS app target
│   ├── BuildersEvents.xcodeproj/    # Xcode project
│   ├── BuildersEvents.xcworkspace/  # Xcode workspace
│   ├── Podfile                      # CocoaPods dependencies
│   └── Pods/                        # CocoaPods modules
│
├── patches/                         # Package patches (patch-package)
│
├── Refactor/                        # Architecture refactoring notes
│   ├── CURRENT_STATE.md            # Current architecture state
│   ├── FUTURE_STATE_NOTES.md       # Planned architecture changes
│   └── CHANGE_IMPACT.md            # Impact analysis
│
├── .expo/                           # Expo local cache
├── .github/                         # GitHub configuration
│
├── app.config.ts                    # Expo app configuration (TypeScript)
├── app.json                         # Expo app configuration (JSON)
├── eas.json                         # EAS Build configuration
├── package.json                     # Dependencies and scripts
├── pnpm-lock.yaml                   # pnpm lock file
├── pnpm-workspace.yaml              # pnpm workspace config
├── tsconfig.json                    # TypeScript configuration
├── babel.config.js                  # Babel configuration
├── babel.jest-unit.cjs              # Jest Babel config
├── metro.config.js                  # Metro bundler configuration
├── jest.unit.config.cjs             # Jest configuration
├── jest.setup.unit.ts               # Jest setup and mocks
├── .eslintrc.cjs                    # ESLint configuration
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── entry.js                         # Custom entry point
├── expo-env.d.ts                    # Expo TypeScript types
├── google-services.json             # Google Services config (Android)
├── .xcode.env                       # Xcode environment variables
│
├── README.md                        # Project overview
├── SETUP.md                         # Setup instructions
├── TESTING.md                       # Testing guide
├── PROJECT_STRUCTURE.md             # Detailed structure documentation
├── IMPLEMENTATION_SUMMARY.md        # Recent implementation summary
├── NEXT_STEPS.md                    # Planned improvements
└── DEBUGGING_WHITE_SCREEN.md        # Troubleshooting guide
```

## Design Patterns

### Component Patterns

**1. Screen Components** - Full-screen pages with data fetching
```typescript
// app/(tabs)/index.tsx
export default function HomeScreen() {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (!events || events.length === 0) return <EmptyState />;

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => <EventCard event={item} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}
```

**2. Container/Presenter Pattern** - Separation of logic and UI
```typescript
// Container (logic)
function EventDetailsContainer({ eventId }: { eventId: string }) {
  const { data: event, isLoading } = useEvent(eventId);
  const navigation = useNavigation();

  const handleRSVP = async () => {
    await api.rsvpToEvent(eventId);
    queryClient.invalidateQueries(['event', eventId]);
  };

  return (
    <EventDetailsPresenter
      event={event}
      isLoading={isLoading}
      onRSVP={handleRSVP}
      onBack={() => navigation.goBack()}
    />
  );
}

// Presenter (UI)
function EventDetailsPresenter({ event, isLoading, onRSVP, onBack }) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      <Text>{event.title}</Text>
      <Button onPress={onRSVP}>RSVP</Button>
    </View>
  );
}
```

**3. Compound Components** - Related components grouped together
```typescript
// EventCard as a compound component
function EventCard({ event }: { event: Event }) {
  return (
    <EventCard.Container>
      <EventCard.Image source={{ uri: event.imageUrl }} />
      <EventCard.Content>
        <EventCard.Title>{event.title}</EventCard.Title>
        <EventCard.Date>{formatDate(event.startDate)}</EventCard.Date>
        <EventCard.Location>{event.location}</EventCard.Location>
      </EventCard.Content>
      <EventCard.Actions>
        <EventCard.Button onPress={() => {}}>View Details</EventCard.Button>
      </EventCard.Actions>
    </EventCard.Container>
  );
}
```

### Data Fetching Patterns

**1. Query Hooks** - Declarative data fetching
```typescript
function EventScreen({ eventId }: { eventId: string }) {
  const { data, isLoading, error, refetch } = useEvent(eventId);

  // Data automatically cached and revalidated
  // Pull-to-refresh with refetch()
  // Loading and error states handled declaratively
}
```

**2. Optimistic Updates** - Instant UI feedback
```typescript
function useRSVPMutation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.rsvpToEvent(eventId, userId),
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['event', eventId]);

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['event', eventId]);

      // Optimistically update cache
      queryClient.setQueryData(['event', eventId], (old: Event) => ({
        ...old,
        attendees: [...old.attendees, userId],
      }));

      return { previousEvent };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      queryClient.setQueryData(['event', eventId], context.previousEvent);
    },
    onSettled: () => {
      // Refetch to ensure cache is correct
      queryClient.invalidateQueries(['event', eventId]);
    },
  });
}
```

**3. Infinite Queries** - Pagination and infinite scroll
```typescript
function useInfiniteMessages() {
  return useInfiniteQuery({
    queryKey: ['messages'],
    queryFn: ({ pageParam = 1 }) => api.getMessages({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

function MessagesScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages();

  return (
    <FlatList
      data={data?.pages.flatMap((page) => page.messages)}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isFetchingNextPage ? <LoadingSpinner /> : null
      }
    />
  );
}
```

## Build Configuration

### EAS Build

**Configuration** (`eas.json`):
```json
{
  "cli": {
    "version": ">= 16.22.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "node": "20.11.0",
      "env": {
        "EXPO_POD_INSTALL_ARGS": "--repo-update --clean-install",
        "EXPO_PUBLIC_API_URL": "https://builders-eventsapi-production.up.railway.app"
      }
    },
    "preview": {
      "distribution": "internal",
      "node": "20.11.0",
      "env": {
        "EXPO_POD_INSTALL_ARGS": "--repo-update --clean-install",
        "EXPO_PUBLIC_API_URL": "https://builders-eventsapi-production.up.railway.app"
      }
    },
    "production": {
      "autoIncrement": true,
      "node": "20.11.0",
      "ios": {
        "image": "latest"
      },
      "android": {
        "image": "latest"
      },
      "env": {
        "EXPO_POD_INSTALL_ARGS": "--repo-update --clean-install",
        "EXPO_PUBLIC_API_URL": "https://builders-eventsapi-production.up.railway.app"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Build Commands:**
```bash
# Development build (with dev client)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (internal testing)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production build
eas build --profile production --platform ios
eas build --profile production --platform android

# Build both platforms
eas build --profile production --platform all
```

**Pre/Post Install Hooks:**
```json
// package.json
"scripts": {
  "eas-build-pre-install": "bash -lc 'if [ \"$EAS_BUILD_PLATFORM\" = \"ios\" ]; then pod repo remove trunk || true; pod setup; pod repo update; pod cache clean boost --all || true; rm -rf ~/Library/Caches/CocoaPods || true; fi'",
  "eas-build-post-install": "bash -lc 'if [ \"$EAS_BUILD_PLATFORM\" = \"ios\" ]; then FILE=node_modules/react-native/third-party-podspecs/boost.podspec; if [ -f \"$FILE\" ]; then sed -i'' -e \"s|s.source = { :http => .* }|s.source = { :git => \\\"https://github.com/boostorg/boost.git\\\", :tag => \\\"boost-1.83.0\\\" }|\" \"$FILE\"; fi; fi'",
  "postinstall": "patch-package"
}
```

### App Store Deployment

**iOS:**
```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios --latest
```

**Android:**
```bash
# Build for Google Play
eas build --profile production --platform android

# Submit to Google Play
eas submit --platform android --latest
```

## Testing Architecture

### Unit Testing

**Jest 29.7.0** with Node-only test environment

**Configuration** (`jest.unit.config.cjs`):
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.unit.test.ts', '**/*.unit.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.unit.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@providers/(.*)$': '<rootDir>/providers/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'providers/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/*.test.*',
    '!**/mocks/**',
  ],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

**Test Setup** (`jest.setup.unit.ts`):
```typescript
// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://localhost:3000/api',
    },
  },
}));

jest.mock('expo-secure-store');
jest.mock('expo-router');
jest.mock('@tanstack/react-query');
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: jest.fn() },
  StyleSheet: { create: jest.fn() },
  // ... other mocks
}));
```

**Test Examples:**
```typescript
// lib/api-client.unit.test.ts
describe('API Client', () => {
  it('should set auth token getter', () => {
    const getToken = jest.fn();
    setAuthTokenGetter(getToken);
    expect(getToken).toBeDefined();
  });

  it('should have API methods', () => {
    expect(typeof api.getEvents).toBe('function');
    expect(typeof api.getEvent).toBe('function');
  });
});
```

**Test Coverage:**
- ✅ 29 passing tests
- ✅ 3 test suites
- ✅ ~2 second execution time
- ✅ 50% minimum coverage

## Performance Optimizations

### React Native Performance

**1. Memoization**
```typescript
const MemoizedEventCard = React.memo(EventCard, (prev, next) => {
  return prev.event.id === next.event.id;
});
```

**2. FlatList Optimization**
```typescript
<FlatList
  data={events}
  renderItem={renderEventCard}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**3. Image Optimization**
```typescript
<Image
  source={{ uri: event.imageUrl }}
  style={{ width: 300, height: 200 }}
  resizeMode="cover"
  progressiveRenderingEnabled={true}
  cache="force-cache"
/>
```

### Query Cache Optimization

**1. Stale-While-Revalidate**
```typescript
staleTime: 5 * 60 * 1000,  // Data fresh for 5 minutes
cacheTime: 10 * 60 * 1000, // Cache kept for 10 minutes
```

**2. Selective Refetching**
```typescript
refetchOnWindowFocus: true,  // Refetch when app returns to foreground
refetchOnReconnect: true,    // Refetch when network reconnects
refetchOnMount: false,       // Don't refetch if cache is fresh
```

**3. Query Prefetching**
```typescript
// Prefetch event details when hovering event card
function EventCard({ event }) {
  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    queryClient.prefetchQuery(['event', event.id], () =>
      api.getEvent(event.id)
    );
  };

  return <Pressable onPressIn={handlePrefetch}>...</Pressable>;
}
```

## Security Considerations

### Data Security
- All authentication tokens stored in Expo SecureStore (hardware-backed encryption)
- HTTPS-only API communication
- Certificate pinning (future consideration)
- No sensitive data in AsyncStorage

### Code Security
- Environment variables not committed to git
- API keys injected at build time
- Source maps disabled in production
- ProGuard/R8 obfuscation (Android)

### User Privacy
- Location permissions requested only when needed
- Camera permissions requested only for QR scanning
- Biometric data stored on-device only (never sent to server)
- GDPR-compliant data deletion

## Monitoring & Debugging

### Development Debugging
- React Native Debugger integration
- Expo Dev Tools
- Console logging with structured breadcrumbs
- Network request/response logging

### Production Monitoring
- Crash reporting (future: Sentry integration)
- Analytics (future: Segment/Amplitude integration)
- Performance monitoring (future: Firebase Performance)
- Error tracking with detailed stack traces

---

**Documentation Version**: 1.0
**Last Updated**: March 26, 2026
**Maintained By**: Builders International Development Team
