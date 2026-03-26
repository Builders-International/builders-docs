# PostHog

## Overview

PostHog is our standardized product analytics platform, providing insights into user behavior, feature usage, and product performance across all Builders International applications.

## What is PostHog?

PostHog is an open-source product analytics platform that provides:
- **Event Tracking:** Capture user actions and behaviors
- **Session Recording:** Watch real user sessions
- **Feature Flags:** Progressive feature rollouts
- **A/B Testing:** Experiment with different variants
- **Funnels:** Analyze conversion paths
- **Retention:** Track user retention over time
- **User Properties:** Segment users by attributes

## Dashboard Access

**PostHog Instance:** `https://app.posthog.com`

Organization: Builders International

Contact the platform team for access and project API keys.

## Setup for Web Applications

### 1. Install PostHog

**NPM (React, Next.js, etc.):**
```bash
npm install posthog-js
```

**CDN (vanilla JavaScript):**
```html
<script>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('YOUR_PROJECT_API_KEY', {api_host: 'https://app.posthog.com'})
</script>
```

### 2. Initialize PostHog

**React/Next.js:**
```typescript
// lib/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
    capture_pageview: false, // We'll capture manually
    capture_pageleave: true,
  })
}

export default posthog
```

**App initialization:**
```typescript
// app/layout.tsx or _app.tsx
import posthog from '@/lib/posthog'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return <Component {...pageProps} />
}
```

## Event Tracking

### Capture Events

**Basic event:**
```typescript
import posthog from '@/lib/posthog'

// Track button click
posthog.capture('button_clicked', {
  button_name: 'Sign Up',
  location: 'header',
})

// Track form submission
posthog.capture('form_submitted', {
  form_name: 'contact',
  fields: ['name', 'email', 'message'],
})

// Track API call
posthog.capture('api_request', {
  endpoint: '/api/users',
  method: 'POST',
  status: 200,
})
```

### Identify Users

```typescript
// After user logs in
posthog.identify(
  user.id, // Unique user ID
  {
    email: user.email,
    name: user.name,
    plan: user.subscriptionPlan,
    created_at: user.createdAt,
  }
)

// After user logs out
posthog.reset()
```

### Group Analytics

Track organizations or teams:

```typescript
posthog.group('company', 'company_id_123', {
  name: 'Acme Corp',
  plan: 'enterprise',
  employees: 50,
})
```

## Setup for Mobile Applications

### React Native

```bash
npm install posthog-react-native
```

```typescript
// App.tsx
import PostHog from 'posthog-react-native'

const posthog = new PostHog(
  'YOUR_PROJECT_API_KEY',
  { host: 'https://app.posthog.com' }
)

// Track screen views
posthog.screen('Home Screen', {
  user_type: 'free',
})

// Track events
posthog.capture('button_pressed', {
  button_id: 'checkout',
})
```

## Setup for Backend/API

### Node.js

```bash
npm install posthog-node
```

```typescript
// lib/posthog-server.ts
import { PostHog } from 'posthog-node'

const posthog = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: 'https://app.posthog.com' }
)

export default posthog
```

**Track server-side events:**
```typescript
import posthog from '@/lib/posthog-server'

// Track API events
posthog.capture({
  distinctId: userId,
  event: 'api_request',
  properties: {
    endpoint: '/api/data',
    method: 'GET',
    responseTime: 150,
  },
})

// Flush events on shutdown
process.on('SIGINT', async () => {
  await posthog.shutdown()
})
```

## Feature Flags

### Enable Feature Flags

```typescript
// Check if feature is enabled
const isNewDashboardEnabled = posthog.isFeatureEnabled('new-dashboard')

if (isNewDashboardEnabled) {
  // Show new dashboard
} else {
  // Show old dashboard
}

// With fallback
const showBetaFeatures = posthog.isFeatureEnabled('beta-features', false)
```

### Create Feature Flags in Dashboard

1. Go to Feature Flags
2. Click "New feature flag"
3. Configure:

```yaml
Key: new-dashboard
Name: New Dashboard Redesign
Description: Rollout of redesigned dashboard
Rollout: 10% of users
Filters:
  - User property "plan" equals "pro"
  - User property "beta_tester" equals true
```

### Multivariate Flags

```typescript
const variant = posthog.getFeatureFlag('checkout-flow')

switch (variant) {
  case 'control':
    // Original checkout
    break
  case 'variant-a':
    // Simplified checkout
    break
  case 'variant-b':
    // Express checkout
    break
}
```

## Session Recording

### Enable Session Recording

```typescript
posthog.init('YOUR_PROJECT_API_KEY', {
  api_host: 'https://app.posthog.com',
  session_recording: {
    recordCrossOriginIframes: true,
    maskAllInputs: false, // Set true for PII protection
    maskTextSelector: '[data-private]', // Mask specific elements
  },
})
```

### Mask Sensitive Data

```html
<!-- Mask specific elements -->
<input type="text" data-private placeholder="Credit Card Number" />

<!-- Or use class -->
<div class="ph-no-capture">
  Sensitive information here
</div>
```

### Programmatic Control

```typescript
// Stop recording
posthog.stopSessionRecording()

// Resume recording
posthog.startSessionRecording()
```

## Analytics Patterns

### Track Page Views

```typescript
useEffect(() => {
  posthog.capture('$pageview')
}, [])
```

### Track Time on Page

```typescript
useEffect(() => {
  const startTime = Date.now()

  return () => {
    const duration = Date.now() - startTime
    posthog.capture('page_duration', {
      page: window.location.pathname,
      duration_ms: duration,
    })
  }
}, [])
```

### Track Errors

```typescript
window.addEventListener('error', (event) => {
  posthog.capture('error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  })
})
```

### Track Performance

```typescript
window.addEventListener('load', () => {
  const perfData = window.performance.timing
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart

  posthog.capture('performance', {
    load_time: pageLoadTime,
    dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp_time: perfData.connectEnd - perfData.connectStart,
    ttfb: perfData.responseStart - perfData.navigationStart,
  })
})
```

## Privacy & Compliance

### Respect User Privacy

```typescript
// Check for Do Not Track
if (navigator.doNotTrack === '1') {
  posthog.opt_out_capturing()
}

// Provide opt-out
<button onClick={() => posthog.opt_out_capturing()}>
  Opt out of analytics
</button>

// Provide opt-in
<button onClick={() => posthog.opt_in_capturing()}>
  Opt in to analytics
</button>
```

### GDPR Compliance

```typescript
// Delete user data (when user requests)
posthog.reset()

// Stop tracking
posthog.opt_out_capturing()
```

### Cookie Consent

```typescript
// Wait for consent before initializing
if (userHasConsented) {
  posthog.init(API_KEY, { ... })
}
```

## Best Practices

1. **Use descriptive event names:** `button_clicked` not `bc`
2. **Include context in properties:** Location, user type, etc.
3. **Identify users after authentication**
4. **Reset on logout** to prevent cross-user tracking
5. **Mask sensitive data** in session recordings
6. **Use feature flags** for gradual rollouts
7. **Track both client and server events** for complete picture
8. **Set up funnels** to understand conversion
9. **Monitor retention** to track engagement
10. **Respect user privacy** and provide opt-out

## Dashboards & Insights

### Creating Insights

1. Go to Insights
2. Select insight type:
   - Trends
   - Funnels
   - Retention
   - Paths
   - Lifecycle

3. Configure filters and breakdowns

### Example Funnel

```
Sign Up Funnel:
1. Viewed landing page
2. Clicked "Sign Up"
3. Completed form
4. Verified email
5. First login

Conversion: 45% overall
Drop-off: 30% at email verification
```

### Example Retention

```
7-Day Retention:
Day 0: 100%
Day 1: 65%
Day 3: 45%
Day 7: 30%

Cohort: Users who signed up in March 2026
```

## Integration with Other Tools

### Slack Notifications

Set up alerts:
1. Go to Project Settings → Integrations
2. Add Slack webhook
3. Create alert conditions

### API Access

```bash
# Export events
curl -X GET 'https://app.posthog.com/api/event/?limit=100' \
  -H "Authorization: Bearer YOUR_PERSONAL_API_KEY"
```

## Troubleshooting

### Events Not Appearing

1. Check API key is correct
2. Verify PostHog is initialized
3. Check browser console for errors
4. Ensure ad blockers aren't blocking PostHog
5. Check project ingestion status in dashboard

### Session Recordings Not Working

1. Verify session recording is enabled in project settings
2. Check browser console for errors
3. Ensure recording isn't being blocked by CSP
4. Verify user hasn't opted out

### Feature Flags Not Updating

1. Call `posthog.reloadFeatureFlags()` to force refresh
2. Check user properties match flag conditions
3. Verify rollout percentage in dashboard

## Resources

- [PostHog Dashboard](https://app.posthog.com)
- [Documentation](https://posthog.com/docs)
- [API Reference](https://posthog.com/docs/api)
- [Community Slack](https://posthog.com/slack)
- [GitHub](https://github.com/PostHog/posthog)
