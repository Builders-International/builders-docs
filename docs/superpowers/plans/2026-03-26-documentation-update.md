# Documentation Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 new project documentation sections and establish 3 comprehensive development standards sections to the Builders International documentation repository.

**Architecture:** Standards-first approach where Infrastructure, CI/CD & Deployment, and Code Quality sections are created first to establish reference material, then 6 projects are documented with cross-references to standards. All documentation extracted from local repositories.

**Tech Stack:** Docusaurus, Markdown, TypeScript (for sidebar config)

---

## Task 1: Create Infrastructure Documentation Structure

**Files:**
- Create: `docs/infrastructure/overview.md`
- Create: `docs/infrastructure/crowdsec.md`
- Create: `docs/infrastructure/uptime-kuma.md`
- Create: `docs/infrastructure/cloudflare.md`
- Create: `docs/infrastructure/posthog.md`

- [ ] **Step 1: Create infrastructure directory**

```bash
mkdir -p docs/infrastructure
```

- [ ] **Step 2: Create overview.md with infrastructure philosophy**

```bash
cat > docs/infrastructure/overview.md << 'EOF'
# Infrastructure Overview

## Philosophy

Builders International is migrating to a cloud-first infrastructure approach, standardizing on modern, reliable tools for security, monitoring, DNS management, and analytics. This section documents our infrastructure tooling and how projects integrate with each component.

## Cloud-First Approach

We prioritize cloud-native solutions that provide:
- **Scalability:** Services that grow with our needs
- **Reliability:** High availability and uptime guarantees
- **Security:** Enterprise-grade security out of the box
- **Observability:** Clear visibility into system health and performance

## Core Infrastructure Components

### Security
- **CrowdSec:** Cloud-based security and threat prevention
- See [CrowdSec documentation](./crowdsec.md)

### Monitoring
- **Uptime Kuma:** Service uptime monitoring and alerting
- See [Uptime Kuma documentation](./uptime-kuma.md)

### DNS & CDN
- **Cloudflare:** DNS management, CDN, and security features
- See [Cloudflare documentation](../../infrastructure/cloudflare.md)

### Analytics
- **PostHog:** Product analytics and user behavior tracking
- See [PostHog documentation](./posthog.md)

## Integration Guidelines

All projects should integrate with these infrastructure components according to their needs:

1. **Production services** must use Cloudflare for DNS and CDN
2. **Public-facing services** must integrate CrowdSec for security
3. **All services** should be monitored via Uptime Kuma
4. **User-facing applications** should integrate PostHog for analytics

## Migration Status

We are actively migrating existing services to this standardized infrastructure. Each project's documentation indicates its migration status and any pending infrastructure work.

## Support

For infrastructure questions or access requests, contact the platform team.
EOF
```

- [ ] **Step 3: Create crowdsec.md**

```bash
cat > docs/infrastructure/crowdsec.md << 'EOF'
# CrowdSec

## Overview

CrowdSec is our standardized cloud security solution, providing threat prevention, IP reputation, and automated blocking across all public-facing services.

## What is CrowdSec?

CrowdSec is a modern, collaborative security engine that:
- Detects aggressive behavior and threat patterns
- Shares threat intelligence across a community network
- Automatically blocks malicious IPs
- Provides real-time security insights

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Service   │─────▶│  CrowdSec    │─────▶│  CrowdSec   │
│  (App/API)  │      │   Agent      │      │   Cloud     │
└─────────────┘      └──────────────┘      └─────────────┘
                             │
                             ▼
                     ┌──────────────┐
                     │  Bouncers    │
                     │ (Firewall)   │
                     └──────────────┘
```

## Setup for New Projects

### 1. Install CrowdSec Agent

```bash
# Ubuntu/Debian
curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
sudo apt install crowdsec

# Docker
docker run -d \
  --name crowdsec \
  -v /var/log:/var/log:ro \
  -v crowdsec-db:/var/lib/crowdsec/data \
  -v crowdsec-config:/etc/crowdsec \
  crowdsecurity/crowdsec
```

### 2. Configure for Your Service

```yaml
# /etc/crowdsec/acquis.yaml
filenames:
  - /var/log/nginx/access.log
  - /var/log/nginx/error.log
labels:
  type: nginx

---
filenames:
  - /var/log/app/*.log
labels:
  type: custom
  service: your-service-name
```

### 3. Install Bouncers

**For Nginx:**
```bash
sudo apt install crowdsec-nginx-bouncer
```

**For Cloudflare (preferred):**
```bash
sudo cscli bouncers add cloudflare-bouncer
# Use the generated API key to configure Cloudflare bouncer
```

### 4. Connect to CrowdSec Cloud

```bash
# Register with CrowdSec Central
sudo cscli console enroll <enrollment-key>

# Verify enrollment
sudo cscli console status
```

## Dashboard Access

Access the CrowdSec Cloud dashboard at: [https://app.crowdsec.net](https://app.crowdsec.net)

Contact the platform team for enrollment keys and dashboard access.

## Monitoring & Alerts

### View Detected Threats

```bash
# List decisions (blocked IPs)
sudo cscli decisions list

# Show alerts
sudo cscli alerts list

# View metrics
sudo cscli metrics
```

### Alert Configuration

Alerts are configured in CrowdSec Cloud dashboard:
1. Navigate to Organization → Notifications
2. Configure Slack/email integrations
3. Set alert thresholds

## Scenarios & Collections

CrowdSec uses scenarios (detection rules) and collections (scenario bundles):

```bash
# List installed collections
sudo cscli collections list

# Install common collections
sudo cscli collections install crowdsecurity/nginx
sudo cscli collections install crowdsecurity/base-http-scenarios
sudo cscli collections install crowdsecurity/sshd

# Update collections
sudo cscli hub update
sudo cscli hub upgrade
```

## Integration with Cloudflare

For services using Cloudflare (all production services):

1. Install Cloudflare bouncer
2. Configure with Cloudflare API token
3. CrowdSec automatically updates Cloudflare firewall rules
4. Blocked IPs are added to Cloudflare's IP Access Rules

Benefits:
- Protection at edge (before traffic reaches your servers)
- Lower bandwidth costs
- Faster response times

## Troubleshooting

### Agent Not Running

```bash
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -f
```

### Bouncer Not Blocking

```bash
# Check bouncer status
sudo cscli bouncers list

# Verify decisions are active
sudo cscli decisions list

# Test bouncer
sudo cscli decisions add --ip 192.0.2.1 --duration 1h --type ban
```

### False Positives

```bash
# Whitelist an IP
sudo cscli decisions delete --ip <ip-address>

# Permanently whitelist
sudo cscli parsers install crowdsecurity/whitelists
# Add IP to /etc/crowdsec/parsers/s02-enrich/whitelist.yaml
```

## Best Practices

1. **Always use Cloudflare bouncer** for production services
2. **Monitor dashboards regularly** for unusual patterns
3. **Keep scenarios updated** via `cscli hub upgrade`
4. **Test alerting** to ensure notifications work
5. **Document custom scenarios** if you create them
6. **Review blocked IPs** to prevent false positives

## Resources

- [CrowdSec Documentation](https://docs.crowdsec.net/)
- [CrowdSec Hub](https://hub.crowdsec.net/)
- [Community Forum](https://discourse.crowdsec.net/)
EOF
```

- [ ] **Step 4: Create uptime-kuma.md**

```bash
cat > docs/infrastructure/uptime-kuma.md << 'EOF'
# Uptime Kuma

## Overview

Uptime Kuma is our standardized uptime monitoring solution, providing real-time service health monitoring, alerting, and status pages for all Builders International services.

## What is Uptime Kuma?

Uptime Kuma is a self-hosted monitoring tool that:
- Monitors HTTP(S), TCP, Ping, DNS, and more
- Provides a beautiful status page
- Sends notifications to multiple channels
- Tracks uptime percentages and response times
- Offers SSL certificate expiry monitoring

## Dashboard Access

**Production Instance:** `https://status.buildersintl.org`

Contact the platform team for login credentials.

## Adding a New Service

### 1. Create Monitor

1. Log into Uptime Kuma dashboard
2. Click "Add New Monitor"
3. Configure monitor settings:

```yaml
Monitor Type: HTTP(s)
Friendly Name: [Service Name] - [Environment]
URL: https://your-service.com
Heartbeat Interval: 60 seconds
Retries: 3
Heartbeat Retry Interval: 60 seconds
Method: GET
Expected Status Code: 200
```

### 2. Configure Advanced Settings

```yaml
# SSL Certificate Monitoring
Ignore TLS/SSL error: false
Certificate Expiry Notification: 14 days

# Performance Monitoring
Response Time Warning: 3000ms
Response Time Critical: 5000ms

# Headers (if needed)
Request Headers:
  User-Agent: UptimeKuma/1.0
  Authorization: Bearer <token>
```

### 3. Add Tags

Organize monitors with tags:
- `production` / `staging` / `development`
- `api` / `web` / `mobile` / `internal`
- `critical` / `important` / `monitoring`

Example tags for production API:
```
production, api, critical
```

## Notification Channels

### Slack Integration

1. Go to Settings → Notifications
2. Click "Setup Notification"
3. Select "Slack"
4. Configure:

```yaml
Webhook URL: <slack-webhook-url>
Channel: #alerts
Username: Uptime Kuma
Icon Emoji: :rotating_light:
```

### Email Notifications

```yaml
SMTP Host: smtp.gmail.com
SMTP Port: 587
Security: TLS
Username: alerts@buildersintl.org
Password: <app-password>
From Email: alerts@buildersintl.org
To Email: team@buildersintl.org
```

### Other Channels

Uptime Kuma supports:
- Discord
- Telegram
- PagerDuty
- Microsoft Teams
- Webhooks (custom)

## Status Pages

### Creating a Status Page

1. Go to Status Pages
2. Click "Add New Status Page"
3. Configure:

```yaml
Title: Builders International Status
Description: Service status and uptime monitoring
Theme: auto (light/dark)
Slug: builders-status
```

### Adding Services to Status Page

1. Edit status page
2. Add monitors from "Monitors" section
3. Organize into groups:

```
API Services
├── Builders Data Dashboard API
├── Builders Events API
└── Vireo API

Web Services
├── Builders Website
└── Builders Events Web

Mobile Services
└── Builders Events Mobile
```

### Public Status Page

Make status page public:
1. Toggle "Public" switch
2. Status page available at: `https://status.buildersintl.org/status/builders-status`

## Monitor Types

### HTTP(s) Monitor

```yaml
URL: https://api.example.com/health
Method: GET
Expected Status: 200
Follow Redirects: yes
```

### TCP Port Monitor

```yaml
Hostname: database.example.com
Port: 5432
```

### Ping Monitor

```yaml
Hostname: server.example.com
```

### DNS Monitor

```yaml
Hostname: example.com
DNS Resolver: 1.1.1.1
Record Type: A
Expected Value: 192.0.2.1
```

### Docker Container

```yaml
Docker Host: unix:///var/run/docker.sock
Container Name: my-container
```

## Maintenance Windows

Schedule maintenance to prevent false alerts:

1. Go to monitor settings
2. Click "Maintenance"
3. Configure:

```yaml
Strategy: Recurring
Start Time: 2024-03-26 02:00 AM
Duration: 2 hours
Recurring: Weekly
Days: Sunday
```

## Uptime Calculations

Uptime Kuma calculates uptime as:
```
Uptime % = (Successful Checks / Total Checks) × 100
```

View uptime periods:
- 24 hours
- 7 days
- 30 days
- 90 days
- 1 year

## Alerting Best Practices

1. **Set appropriate intervals:** Don't over-monitor (60s is usually sufficient)
2. **Use retries:** Prevent false alerts from temporary network issues
3. **Group by criticality:** Use tags to separate critical from non-critical services
4. **Create escalation:** Use multiple notification channels for critical services
5. **Document maintenance:** Schedule maintenance windows to prevent alert fatigue

## Integration with CI/CD

### Health Check Endpoints

Every service should expose a health check endpoint:

```javascript
// Express.js example
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERSION,
    uptime: process.uptime()
  });
});
```

```python
# FastAPI example
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": os.getenv("VERSION")
    }
```

### Monitoring After Deployment

Add Uptime Kuma checks to deployment pipelines:

```yaml
# .github/workflows/deploy.yml
- name: Wait for health check
  run: |
    for i in {1..30}; do
      if curl -f https://api.example.com/health; then
        echo "Service is healthy"
        exit 0
      fi
      sleep 10
    done
    echo "Health check failed"
    exit 1
```

## Backup & Disaster Recovery

Uptime Kuma data is backed up daily to:
- Database backups: Every 24 hours
- Retention: 30 days
- Location: DO Spaces (encrypted)

## Troubleshooting

### Monitor Showing Down (But Service is Up)

1. Check monitor configuration (URL, headers, expected status)
2. Verify SSL certificate is valid
3. Check firewall rules (allow Uptime Kuma IPs)
4. Review service logs for intermittent issues

### Notifications Not Sending

1. Test notification channel in Settings
2. Verify webhook URLs are correct
3. Check notification channel is selected in monitor
4. Review Uptime Kuma logs: `docker logs uptime-kuma`

### High Response Times

1. Check if server is under load
2. Verify network latency (Uptime Kuma location vs service location)
3. Review application performance metrics
4. Consider adding CDN (see [Cloudflare docs](../../infrastructure/cloudflare.md))

## Resources

- [Uptime Kuma GitHub](https://github.com/louislam/uptime-kuma)
- [Documentation](https://github.com/louislam/uptime-kuma/wiki)
- [Community Forum](https://github.com/louislam/uptime-kuma/discussions)
EOF
```

- [ ] **Step 5: Create cloudflare.md**

```bash
cat > docs/infrastructure/cloudflare.md << 'EOF'
# Cloudflare

## Overview

Cloudflare is our standardized DNS provider, CDN, and security platform for all web services and APIs at Builders International. All production domains and services are migrated or being migrated to Cloudflare.

## What is Cloudflare?

Cloudflare provides:
- **DNS Management:** Fast, reliable DNS with global anycast network
- **CDN:** Global content delivery network
- **DDoS Protection:** Automatic DDoS mitigation
- **SSL/TLS:** Free SSL certificates and encryption
- **Web Application Firewall (WAF):** Protection against common web attacks
- **Analytics:** Traffic and security insights
- **Workers:** Serverless edge computing (when needed)

## Dashboard Access

**Cloudflare Dashboard:** [https://dash.cloudflare.com](https://dash.cloudflare.com)

Account: `team@buildersintl.org`

Contact the platform team for access.

## DNS Management

### Adding a New Domain

1. Log into Cloudflare dashboard
2. Click "Add site"
3. Enter domain name
4. Select plan (Free for most projects)
5. Review DNS records
6. Update nameservers at your registrar:

```
NS1: alexa.ns.cloudflare.com
NS2: isaac.ns.cloudflare.com
```

### Managing DNS Records

#### A Record (IPv4)

```
Type: A
Name: @  (or subdomain)
IPv4 address: 192.0.2.1
Proxy status: Proxied (orange cloud)
TTL: Auto
```

#### CNAME Record (Alias)

```
Type: CNAME
Name: www
Target: example.com
Proxy status: Proxied
TTL: Auto
```

#### TXT Record (Verification)

```
Type: TXT
Name: @
Content: "verification-code-here"
TTL: Auto
```

### Proxy vs DNS Only

**Proxied (Orange Cloud):**
- Traffic goes through Cloudflare
- Enables CDN, WAF, DDoS protection
- Hides origin IP
- SSL/TLS encryption
- **Use for:** Web services, APIs, public-facing applications

**DNS Only (Gray Cloud):**
- Direct connection to origin
- No Cloudflare features
- **Use for:** Mail servers, non-HTTP services, development/testing

## SSL/TLS Configuration

### SSL/TLS Encryption Mode

For all production services:

```
Encryption mode: Full (strict)
```

This ensures:
- End-to-end encryption
- Valid SSL certificate on origin server
- No certificate errors

### SSL Certificate Types

Cloudflare provides:
- **Universal SSL:** Free, automatically provisioned
- **Advanced Certificate Manager:** Custom certificates (if needed)

### Force HTTPS

Always enable HTTPS redirect:

1. Go to SSL/TLS → Edge Certificates
2. Enable "Always Use HTTPS"
3. Enable "Automatic HTTPS Rewrites"

### Minimum TLS Version

Set minimum TLS version to 1.2:

```
SSL/TLS → Edge Certificates → Minimum TLS Version: 1.2
```

## Security Settings

### Firewall Rules

Create rules to block malicious traffic:

```
Rule Name: Block Bad Bots
Expression: (cf.client.bot) and not (cf.verified_bot_category in ["Search Engine Crawler" "Monitoring & Analytics"])
Action: Block
```

```
Rule Name: Rate Limiting
Expression: (http.request.uri.path contains "/api/")
Action: Challenge
Rate: 100 requests per 10 seconds
```

### WAF (Web Application Firewall)

Enable managed rules:

1. Go to Security → WAF
2. Enable "Cloudflare Managed Ruleset"
3. Enable "OWASP Core Ruleset"

For API endpoints, tune rules to prevent false positives.

### DDoS Protection

DDoS protection is automatic, but customize:

1. Go to Security → DDoS
2. Review sensitivity settings
3. Enable "Advanced DDoS Protection" if available

### Bot Protection

```
Security → Bots
- Enable Bot Fight Mode
- Configure challenges for suspected bots
- Allow verified bots (Google, Bing, etc.)
```

## Performance Optimization

### Caching

Configure caching rules:

```
Rule Name: Cache Static Assets
URL Pattern: *.js, *.css, *.jpg, *.png, *.gif, *.ico, *.svg, *.woff, *.woff2
Cache Level: Standard
Edge Cache TTL: 1 month
Browser Cache TTL: 1 day
```

```
Rule Name: Bypass API Cache
URL Pattern: /api/*
Cache Level: Bypass
```

### Page Rules

Create page rules for custom behavior:

```
URL: www.example.com/*
Settings:
  - SSL: Full (strict)
  - Always Use HTTPS: On
  - Auto Minify: JS, CSS, HTML
  - Brotli: On
```

### Auto Minify

Enable for all sites:

```
Speed → Optimization
- JavaScript: On
- CSS: On
- HTML: On
```

### Brotli Compression

Enable Brotli (better than gzip):

```
Speed → Optimization → Brotli: On
```

## CDN Configuration

### Cache Everything

For static sites (like Docusaurus):

```
Page Rule: example.com/*
Cache Level: Cache Everything
Edge Cache TTL: 1 hour
Browser Cache TTL: 4 hours
```

### Purge Cache

When deploying updates:

```bash
# Purge entire cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific files
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://example.com/index.html","https://example.com/style.css"]}'
```

## Analytics & Monitoring

### Traffic Analytics

View in dashboard:
- Requests per second
- Bandwidth usage
- Response status codes
- Top countries
- Top paths

### Security Analytics

Monitor:
- Blocked requests
- Challenged requests
- WAF events
- Bot traffic

### Integrations

Connect to other tools:
- **Uptime Kuma:** Monitor Cloudflare-fronted services
- **PostHog:** Track analytics through Cloudflare
- **CrowdSec:** Integrate with Cloudflare bouncer

## API Access

### Generate API Token

1. Go to My Profile → API Tokens
2. Create Token
3. Use "Edit zone DNS" template
4. Scope to specific zones

Store token securely in secrets management.

### Common API Operations

**List DNS records:**
```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}"
```

**Create DNS record:**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"api","content":"192.0.2.1","proxied":true}'
```

## Migration Checklist

When migrating a service to Cloudflare:

- [ ] Add domain to Cloudflare
- [ ] Import existing DNS records
- [ ] Update nameservers at registrar
- [ ] Verify DNS propagation (24-48 hours)
- [ ] Enable SSL/TLS (Full strict mode)
- [ ] Configure firewall rules
- [ ] Enable WAF managed rules
- [ ] Set up caching rules
- [ ] Enable auto minify and Brotli
- [ ] Configure page rules if needed
- [ ] Add to Uptime Kuma monitoring
- [ ] Test thoroughly before going live
- [ ] Document in project's architecture doc

## Best Practices

1. **Always use Proxied (orange cloud)** for HTTP(S) services
2. **Enable SSL/TLS Full (strict)** for production
3. **Configure firewall rules** based on traffic patterns
4. **Monitor analytics** for unusual patterns
5. **Purge cache** after deployments
6. **Use API for automation** in CI/CD pipelines
7. **Enable bot protection** for public services
8. **Set appropriate cache TTLs** based on content update frequency
9. **Test changes in DNS only mode** before enabling proxy
10. **Keep API tokens secure** and rotate regularly

## Troubleshooting

### 520/521/522 Errors

These indicate issues connecting to origin:

1. Verify origin server is running
2. Check firewall allows Cloudflare IPs
3. Verify SSL certificate on origin
4. Check origin server logs

### Cache Not Working

1. Verify proxy is enabled (orange cloud)
2. Check page rules don't bypass cache
3. Verify origin isn't sending `Cache-Control: no-cache`
4. Test with cache analytics

### SSL Errors

1. Verify SSL mode is correct (Full strict for valid certs)
2. Check origin certificate is valid and not expired
3. Ensure certificate covers all subdomains if needed
4. Review SSL/TLS settings in dashboard

## Resources

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Cloudflare Docs](https://developers.cloudflare.com/)
- [API Documentation](https://developers.cloudflare.com/api/)
- [Community Forum](https://community.cloudflare.com/)
- [Status Page](https://www.cloudflarestatus.com/)
EOF
```

- [ ] **Step 6: Create posthog.md**

```bash
cat > docs/infrastructure/posthog.md << 'EOF'
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
EOF
```

- [ ] **Step 7: Commit infrastructure documentation**

```bash
git add docs/infrastructure/
git commit -m "docs: add infrastructure documentation

Added comprehensive docs for CrowdSec, Uptime Kuma, Cloudflare, and PostHog.
Includes setup, configuration, integration, and best practices for each tool.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Extract and Document CI/CD Workflows from egi-ci:cd

**Files:**
- Read: `~/Developer/egi-ci:cd/templates/app-repo/.github/workflows/*.yml`
- Read: `~/Developer/egi-ci:cd/docs/*.md`
- Create: `docs/cicd-deployment/overview.md`
- Create: `docs/cicd-deployment/workflows.md`
- Create: `docs/cicd-deployment/deployment-process.md`
- Create: `docs/cicd-deployment/environments.md`

- [ ] **Step 1: Create cicd-deployment directory**

```bash
mkdir -p docs/cicd-deployment
```

- [ ] **Step 2: Read egi-ci:cd workflow files**

```bash
# Read CI workflow files
cat ~/Developer/egi-ci:cd/templates/app-repo/.github/workflows/ci-pr.yml > /tmp/ci-pr.yml
cat ~/Developer/egi-ci:cd/templates/app-repo/.github/workflows/ci-main.yml > /tmp/ci-main.yml
cat ~/Developer/egi-ci:cd/templates/app-repo/.github/workflows/release.yml > /tmp/release.yml

# Read documentation
cat ~/Developer/egi-ci:cd/docs/architecture.md > /tmp/egi-architecture.md
cat ~/Developer/egi-ci:cd/docs/repo-structure.md > /tmp/egi-repo-structure.md
```

Expected: Files copied to /tmp for reference

- [ ] **Step 3: Create overview.md**

```bash
cat > docs/cicd-deployment/overview.md << 'EOF'
# CI/CD & Deployment Overview

## Philosophy

Builders International follows a GitOps-based continuous integration and deployment philosophy. All changes go through automated testing, review, and deployment pipelines to ensure quality and reliability.

## Principles

1. **Everything as Code:** Infrastructure, configuration, and deployment defined in Git
2. **Automated Testing:** Every change runs through automated tests
3. **Trunk-Based Development:** Short-lived feature branches, frequent integration
4. **Progressive Delivery:** Gradual rollouts with feature flags
5. **Immutable Deployments:** No manual changes to production
6. **Observability:** Every deployment is monitored and traceable

## Workflow Overview

```
Developer → Feature Branch → PR → CI Tests → Code Review → Merge → CD Pipeline → Deploy
```

### Development Flow

1. **Create feature branch** from `main`
2. **Develop locally** with frequent commits
3. **Push branch** to trigger CI checks
4. **Open Pull Request** when ready for review
5. **CI runs tests** automatically on PR
6. **Code review** by team members
7. **Merge to main** after approval
8. **CD pipeline** deploys to staging automatically
9. **Manual approval** for production deployment

## Environments

### Development
- **Purpose:** Local development and testing
- **Access:** All developers
- **Data:** Synthetic/test data only
- **Deployment:** Manual or on-demand

### Staging
- **Purpose:** Pre-production testing
- **Access:** Team + stakeholders
- **Data:** Sanitized production-like data
- **Deployment:** Automatic on merge to `main`

### Production
- **Purpose:** Live user-facing services
- **Access:** Limited (platform team)
- **Data:** Real user data
- **Deployment:** Manual approval required

## CI/CD Tools

- **GitHub Actions:** Primary CI/CD platform
- **Docker:** Containerization for consistent deployments
- **Vercel:** Hosting for web applications (primary)
- **Digital Ocean:** Droplets for backend services
- **Cloudflare:** CDN and DNS (see [Infrastructure docs](../infrastructure/cloudflare.md))

## Key Workflows

### CI Workflows

1. **PR Checks** - Run on every pull request
   - Lint code
   - Run tests
   - Build artifacts
   - Check types
   - Security scans

2. **Main Branch** - Run on merge to main
   - All PR checks
   - Build production images
   - Deploy to staging
   - Integration tests

### CD Workflows

1. **Staging Deployment** - Automatic
   - Triggered on merge to main
   - Deploy to staging environment
   - Run smoke tests
   - Notify team

2. **Production Deployment** - Manual approval
   - Triggered by release tag or manual workflow
   - Require approval from platform team
   - Blue-green deployment pattern
   - Health checks
   - Rollback capability

## Deployment Strategies

### Web Applications (Vercel)

- Zero-downtime deployments
- Automatic preview deployments for PRs
- Instant rollbacks
- Edge network distribution

### Backend Services (Digital Ocean)

- Docker-based deployments
- Blue-green deployment pattern
- Health check validation
- Gradual traffic shifting

## Security

### Secrets Management

- **Never commit secrets** to Git
- Store in GitHub Secrets
- Rotate regularly
- Use environment-specific secrets

### Access Control

- **Principle of least privilege**
- Separate read/write permissions
- Audit deployment access
- Require 2FA for production access

## Monitoring & Observability

Every deployment includes:
- **Health checks** to verify service is running
- **Uptime monitoring** via [Uptime Kuma](../../infrastructure/uptime-kuma.md)
- **Error tracking** for issues
- **Analytics** via [PostHog](../infrastructure/posthog.md)
- **Logs** for debugging

## Best Practices

1. **Keep builds fast** (under 5 minutes for CI)
2. **Test locally first** before pushing
3. **Small, frequent commits** easier to review and revert
4. **Meaningful commit messages** describe why, not just what
5. **Review your own PR** before requesting review
6. **Fix broken builds immediately** don't block others
7. **Monitor after deployment** watch for errors
8. **Document deployment steps** in runbooks
9. **Practice rollbacks** know how to revert quickly
10. **Automate everything** reduce human error

## Getting Help

- **CI/CD issues:** Check workflow logs in GitHub Actions
- **Deployment failures:** Review deployment logs and health checks
- **Access requests:** Contact platform team
- **Questions:** Ask in #engineering Slack channel

## Related Documentation

- [Workflows](../../cicd-deployment/workflows.md) - Detailed workflow configurations
- [Deployment Process](../../cicd-deployment/deployment-process.md) - Step-by-step deployment procedures
- [Environments](../../cicd-deployment/environments.md) - Environment-specific configuration
- [Infrastructure](../../infrastructure/overview.md) - Infrastructure tooling
EOF
```

- [ ] **Step 4: Create workflows.md with adapted templates**

(This file is very long - I'll create it with actual workflow content from egi-ci:cd)

```bash
cat > docs/cicd-deployment/workflows.md << 'EOF'
# CI/CD Workflows

This document contains reusable GitHub Actions workflow templates adapted from the egi-ci:cd repository for Builders International projects.

## Workflow Files

All projects should include these workflow files in `.github/workflows/`:

- `ci-pr.yml` - Runs on pull requests
- `ci-main.yml` - Runs on merge to main
- `release.yml` - Handles production releases

## PR CI Workflow (ci-pr.yml)

Runs comprehensive checks on every pull request to ensure code quality before merging.

### Template

```yaml
name: CI - Pull Request

on:
  pull_request:
    branches: [main, master, develop]
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.gitignore'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/
          retention-days: 7

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Adapting for Your Project

**For Python projects:**
```yaml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.11'

- name: Install dependencies
  run: |
    pip install -r requirements.txt
    pip install -r requirements-dev.txt

- name: Run tests
  run: pytest --cov=src tests/
```

**For Go projects:**
```yaml
- name: Set up Go
  uses: actions/setup-go@v4
  with:
    go-version: '1.21'

- name: Run tests
  run: go test -v -race -coverprofile=coverage.out ./...
```

## Main Branch CI Workflow (ci-main.yml)

Runs after merge to main, deploys to staging environment.

### Template

```yaml
name: CI - Main Branch

on:
  push:
    branches: [main, master]
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.gitignore'

jobs:
  test-and-build:
    name: Test & Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: production-build
          path: build/

  deploy-staging:
    name: Deploy to Staging
    needs: test-and-build
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: production-build
          path: build/

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Run smoke tests
        run: |
          npm run test:e2e -- --baseUrl=https://staging.example.com

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment complete'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Digital Ocean Deployment

For backend services hosted on DO droplets:

```yaml
deploy-staging:
  name: Deploy to Staging (DO)
  needs: test-and-build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: |
        docker build -t registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }} .

    - name: Log in to DO Container Registry
      uses: docker/login-action@v2
      with:
        registry: registry.digitalocean.com
        username: ${{ secrets.DO_REGISTRY_TOKEN }}
        password: ${{ secrets.DO_REGISTRY_TOKEN }}

    - name: Push image
      run: |
        docker push registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}

    - name: Deploy to droplet
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USERNAME }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          docker pull registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}
          docker stop app || true
          docker rm app || true
          docker run -d \
            --name app \
            -p 3000:3000 \
            --env-file /opt/app/.env.staging \
            registry.digitalocean.com/${{ secrets.DO_REGISTRY }}/app:${{ github.sha }}

    - name: Health check
      run: |
        sleep 10
        curl -f https://staging.example.com/health || exit 1
```

## Release Workflow (release.yml)

Handles production deployments with manual approval.

### Template

```yaml
name: Release to Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (e.g., v1.2.3)'
        required: true
        type: string

jobs:
  create-release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Git tag
        run: |
          git tag ${{ inputs.version }}
          git push origin ${{ inputs.version }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ inputs.version }}
          release_name: Release ${{ inputs.version }}
          draft: false
          prerelease: false

  deploy-production:
    name: Deploy to Production
    needs: create-release
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.version }}

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

      - name: Wait for deployment
        run: sleep 30

      - name: Health check
        run: |
          curl -f https://example.com/health || exit 1

      - name: Smoke tests
        run: npm run test:smoke -- --baseUrl=https://example.com

      - name: Update Uptime Kuma
        run: |
          curl -X POST https://status.buildersintl.org/api/push/${{ secrets.UPTIME_KUMA_PUSH_KEY }}?status=up&msg=Deployed%20${{ inputs.version }}

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment complete: ${{ inputs.version }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Common Actions

### Cache Dependencies

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Conditional Job Execution

```yaml
jobs:
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      # deployment steps
```

### Matrix Testing

```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20, 21]
      os: [ubuntu-latest, macos-latest]
  runs-on: ${{ matrix.os }}
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

## Required Secrets

Configure these secrets in GitHub repository settings:

### Vercel Deployments
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Digital Ocean Deployments
- `DO_REGISTRY` - DO container registry name
- `DO_REGISTRY_TOKEN` - DO registry access token
- `STAGING_HOST` - Staging server hostname
- `STAGING_USERNAME` - SSH username
- `STAGING_SSH_KEY` - SSH private key
- `PRODUCTION_HOST` - Production server hostname
- `PRODUCTION_USERNAME` - SSH username
- `PRODUCTION_SSH_KEY` - SSH private key

### Monitoring & Notifications
- `UPTIME_KUMA_PUSH_KEY` - Uptime Kuma push monitor key
- `SLACK_WEBHOOK` - Slack webhook URL for notifications
- `SNYK_TOKEN` - Snyk security scanning token

### Optional
- `CODECOV_TOKEN` - Codecov upload token

## Workflow Best Practices

1. **Keep workflows DRY** - Use composite actions for repeated steps
2. **Fail fast** - Run quick checks (lint, typecheck) before slow ones (tests, build)
3. **Parallel jobs** - Run independent jobs concurrently
4. **Cache aggressively** - Cache dependencies, build outputs
5. **Meaningful names** - Clear job and step names
6. **Timeouts** - Set reasonable timeouts to prevent hung jobs
7. **Conditional execution** - Skip unnecessary steps with `if` conditions
8. **Secure secrets** - Never log secrets, use GitHub Secrets
9. **Document changes** - Comment complex workflow logic
10. **Test workflows** - Test in feature branches before merging

## Troubleshooting

### Workflow Not Triggering

- Check `on` triggers match your branch name
- Verify `paths-ignore` isn't excluding your changes
- Ensure workflow file is in `.github/workflows/`

### Job Failing

- Check job logs in GitHub Actions tab
- Run steps locally to reproduce
- Verify secrets are set correctly
- Check for rate limiting or quota issues

### Slow Workflows

- Enable caching for dependencies
- Run jobs in parallel
- Use matrix strategy for tests
- Consider self-hosted runners for better performance

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Marketplace Actions](https://github.com/marketplace?type=actions)
- EGI CI/CD Repo - Source templates (available in external repository)
EOF
```

- [ ] **Step 5: Create deployment-process.md**

```bash
cat > docs/cicd-deployment/deployment-process.md << 'EOF'
# Deployment Process

Step-by-step procedures for deploying services to staging and production environments.

## Overview

All deployments follow a consistent process to ensure reliability, traceability, and the ability to rollback if needed.

## Pre-Deployment Checklist

Before any deployment:

- [ ] All tests passing in CI
- [ ] Code review approved and merged
- [ ] No known critical bugs in the release
- [ ] Staging environment tested and validated
- [ ] Release notes prepared
- [ ] Database migrations tested (if applicable)
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented

## Deployment to Staging

Staging deployments happen automatically on merge to `main`.

### Process

1. **Merge PR to main**
   ```bash
   # Via GitHub UI or:
   git checkout main
   git pull origin main
   # Changes are now in main
   ```

2. **CI/CD automatically triggers**
   - Tests run
   - Build created
   - Deploy to staging environment
   - Smoke tests execute

3. **Verify deployment**
   ```bash
   # Check deployment status in GitHub Actions
   # Visit staging URL
   curl https://staging.example.com/health

   # Check logs
   # Verify key functionality
   ```

4. **Monitor for issues**
   - Check [Uptime Kuma](../../infrastructure/uptime-kuma.md) dashboard
   - Review error logs
   - Test critical user paths
   - Verify integrations (APIs, databases, etc.)

### Staging Validation

Before promoting to production, validate:

- [ ] Application loads successfully
- [ ] Authentication works
- [ ] Key user flows function correctly
- [ ] API endpoints respond as expected
- [ ] Database migrations applied successfully
- [ ] External integrations working
- [ ] No console errors or warnings
- [ ] Performance acceptable (load times, API response times)

## Deployment to Production

Production deployments require manual approval and careful coordination.

### Timing Considerations

**Best times to deploy:**
- Weekdays during business hours (when team is available)
- Low-traffic periods (if applicable)
- After QA sign-off
- When team can monitor post-deployment

**Avoid deploying:**
- Fridays or before weekends (limited support availability)
- During high-traffic events
- Before holidays
- When key team members unavailable

### Process

#### 1. Prepare Release

```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Review changes since last release
git log --oneline v1.2.0..HEAD

# Create release notes
# Document breaking changes, new features, bug fixes
```

#### 2. Create Release Tag

```bash
# Tag the release
git tag -a v1.2.1 -m "Release v1.2.1: Feature X and Bug Y fix"
git push origin v1.2.1
```

Or use GitHub's release UI:
1. Go to repository → Releases
2. Click "Draft a new release"
3. Choose or create tag (e.g., `v1.2.1`)
4. Add release title and notes
5. Publish release

#### 3. Trigger Production Deployment

**Via GitHub Actions UI:**
1. Go to Actions tab
2. Select "Release to Production" workflow
3. Click "Run workflow"
4. Enter version (e.g., `v1.2.1`)
5. Click "Run workflow"

**Via CLI:**
```bash
gh workflow run release.yml -f version=v1.2.1
```

#### 4. Approve Deployment

Production deployments require manual approval:

1. Workflow pauses at approval gate
2. Designated approvers receive notification
3. Review deployment details
4. Approve or reject deployment

**Approvers check:**
- Staging validation completed
- Release notes reviewed
- No critical issues reported
- Team ready to monitor

#### 5. Monitor Deployment

Watch the deployment progress:

```bash
# Monitor workflow
gh run watch

# Check application health
curl https://example.com/health

# Watch logs (if using Digital Ocean)
ssh user@production-server
docker logs -f app --tail=100

# Monitor metrics
# - Uptime Kuma: https://status.buildersintl.org
# - PostHog: https://app.posthog.com
# - Error tracking dashboard
```

#### 6. Validate Production

After deployment completes:

- [ ] Health check endpoint returns success
- [ ] Application loads in browser
- [ ] Authentication works
- [ ] Critical user flows tested
- [ ] API endpoints responding correctly
- [ ] No spike in error rates
- [ ] Performance metrics normal
- [ ] Uptime Kuma shows service UP
- [ ] No alerts triggered

#### 7. Communicate Status

Update team on deployment status:

```
✅ v1.2.1 deployed to production successfully

Changes:
- Added feature X
- Fixed bug Y
- Updated dependency Z

Validation:
- Health checks passing
- Smoke tests passed
- No errors in logs
- Response times normal

Monitoring:
- Uptime Kuma: ✅
- Error rate: Normal
- Performance: ✅
```

Post in:
- Slack #deployments channel
- Update status page if needed

## Rollback Procedures

If issues are discovered post-deployment, rollback immediately.

### When to Rollback

Rollback if:
- Critical functionality broken
- Significant increase in error rates
- Performance degradation impacting users
- Security vulnerability introduced
- Data integrity issues

### Rollback Process

#### Vercel Deployments

Instant rollback via dashboard:

1. Go to Vercel project dashboard
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Confirm promotion

Or via CLI:
```bash
vercel rollback https://previous-deployment-url.vercel.app --prod
```

#### Digital Ocean Deployments

Rollback to previous Docker image:

```bash
# SSH to server
ssh user@production-server

# Stop current container
docker stop app
docker rm app

# Run previous version
docker run -d \
  --name app \
  -p 3000:3000 \
  --env-file /opt/app/.env.production \
  registry.digitalocean.com/myregistry/app:PREVIOUS_SHA

# Verify health
curl http://localhost:3000/health
```

#### Database Rollback

If migrations were applied:

```bash
# Run down migration
npm run migrate:down

# Or restore from backup (if needed)
# Contact database administrator
```

### Post-Rollback

After rollback:

1. **Verify rollback successful**
   - Application working correctly
   - Error rates normal
   - Users can access service

2. **Investigate issue**
   - Review logs
   - Identify root cause
   - Document findings

3. **Create hotfix or revert**
   ```bash
   # Revert the problematic commit
   git revert <commit-sha>
   git push origin main

   # Or create hotfix branch
   git checkout -b hotfix/fix-critical-issue
   # Make fixes
   git commit -m "fix: resolve production issue"
   # Create PR and fast-track review
   ```

4. **Communicate to team**
   ```
   ⚠️ Production rollback executed

   Reason: Critical bug in feature X
   Rolled back to: v1.2.0
   Status: Service restored, investigating issue

   Next steps:
   - Root cause analysis
   - Hotfix in progress
   - ETA for fix: 2 hours
   ```

## Database Migrations

When deployments include database changes:

### Before Deployment

1. **Test migrations**
   ```bash
   # Test on staging database
   npm run migrate:up

   # Verify data integrity
   npm run migrate:verify

   # Test rollback
   npm run migrate:down
   npm run migrate:up
   ```

2. **Backup production database**
   ```bash
   # Automatic backups should be configured
   # Verify recent backup exists
   # Document backup ID for quick restore if needed
   ```

### During Deployment

1. **Apply migrations before code deployment**
   - Ensures database ready for new code
   - Use backward-compatible migrations when possible

2. **Zero-downtime migrations**
   - Add new columns (don't remove old ones immediately)
   - Deploy code that uses both old and new schema
   - Remove old columns in subsequent deployment

### After Deployment

1. **Verify migrations**
   ```bash
   # Check migration status
   npm run migrate:status

   # Verify data integrity
   npm run test:data-integrity
   ```

2. **Monitor query performance**
   - Watch for slow queries
   - Check index usage
   - Verify no lock contention

## Emergency Procedures

### Complete Service Outage

1. **Immediate Actions**
   - Trigger incident response
   - Page on-call engineer
   - Update status page
   - Rollback if deployment-related

2. **Communication**
   ```
   🚨 INCIDENT: Service outage detected

   Status: Investigating
   Impact: All users unable to access service
   Started: 2024-03-26 14:32 UTC
   Team: Investigating

   Updates: Will provide update in 15 minutes
   ```

3. **Resolution**
   - Identify root cause
   - Implement fix or rollback
   - Verify service restored
   - Post-mortem within 24 hours

### Partial Degradation

1. **Assess Impact**
   - Identify affected functionality
   - Determine user impact
   - Evaluate severity

2. **Decide on Action**
   - If minor: Monitor and fix in next deployment
   - If moderate: Accelerate hotfix
   - If major: Rollback

3. **Communicate**
   - Update team
   - Update status page if user-facing
   - Set expectations for fix timeline

## Deployment Checklist

Use this checklist for every production deployment:

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Staging validated
- [ ] Release notes written
- [ ] Database migrations tested
- [ ] Team notified of deployment
- [ ] Monitoring configured
- [ ] Rollback plan ready

### Deployment
- [ ] Tag created
- [ ] Workflow triggered
- [ ] Approval obtained
- [ ] Deployment completed
- [ ] Health checks passing

### Post-Deployment
- [ ] Application validated
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Uptime monitors green
- [ ] Team notified of success
- [ ] Deployment documented

### If Issues
- [ ] Issue documented
- [ ] Rollback executed (if needed)
- [ ] Root cause identified
- [ ] Hotfix planned
- [ ] Post-mortem scheduled

## Deployment Metrics

Track these metrics for each deployment:

- **Deployment frequency:** How often we deploy
- **Lead time:** Time from commit to production
- **Change failure rate:** % of deployments causing issues
- **Mean time to recovery (MTTR):** Time to recover from failures

**Goals:**
- Deploy at least daily to staging
- Deploy to production multiple times per week
- Change failure rate under 5 percent
- MTTR under 30 minutes

## Resources

- [CI/CD Workflows](../../cicd-deployment/workflows.md)
- [Environment Configuration](../../cicd-deployment/environments.md)
- [Infrastructure Monitoring](../../infrastructure/uptime-kuma.md)
- [Incident Response Playbook](#) (TODO: Create this document)
EOF
```

- [ ] **Step 6: Create environments.md**

```bash
cat > docs/cicd-deployment/environments.md << 'EOF'
# Environment Configuration

## Overview

Builders International uses multiple environments to ensure code quality and safe deployments. Each environment has specific purposes, access controls, and configurations.

## Environment Hierarchy

```
Development (Local) → Staging → Production
```

## Development Environment

### Purpose
Local development and testing on developer machines.

### Characteristics
- **Access:** All developers
- **Data:** Local/mock data only
- **Stability:** Unstable, frequent changes
- **Deployment:** Manual, on-demand

### Setup

```bash
# Clone repository
git clone https://github.com/Builders-International/project-name.git
cd project-name

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure local environment
# Edit .env.local with local settings

# Start development server
npm run dev
```

### Environment Variables

```bash
# .env.local
NODE_ENV=development
API_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/myapp_dev
LOG_LEVEL=debug
ENABLE_DEBUG_TOOLS=true

# External services (use test/sandbox APIs)
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=SG.test...
```

### Database

Local PostgreSQL or SQLite:

```bash
# Using Docker
docker run -d \
  --name postgres-dev \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=myapp_dev \
  postgres:15

# Run migrations
npm run migrate:dev

# Seed with test data
npm run db:seed
```

### Testing

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# E2E tests (against local server)
npm run test:e2e
```

## Staging Environment

### Purpose
Pre-production testing and validation before deploying to production.

### Characteristics
- **Access:** Team + stakeholders
- **Data:** Sanitized production-like data
- **Stability:** Stable, updated on merge to main
- **Deployment:** Automatic via CI/CD

### URL Structure

```
Web: https://staging-project.vercel.app
API: https://staging-api.buildersintl.org
Admin: https://staging-admin.buildersintl.org
```

### Environment Variables

Configured in deployment platform (Vercel, DO, etc.):

```bash
NODE_ENV=staging
API_URL=https://staging-api.buildersintl.org
DATABASE_URL=postgresql://staging-db.buildersintl.org:5432/myapp_staging
LOG_LEVEL=info

# External services (test/sandbox)
STRIPE_KEY=sk_test_...
SENDGRID_API_KEY=SG.staging...

# Feature flags
ENABLE_BETA_FEATURES=true
ENABLE_DEBUG_PANEL=true

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_API_KEY=phc_staging...
```

### Database

Hosted database with sanitized data:

- **Provider:** Digital Ocean Managed PostgreSQL
- **Backups:** Daily automated backups
- **Data:** Sanitized copy of production (PII removed)
- **Size:** Smaller than production (representative sample)

### Data Sanitization

Production data is sanitized before copying to staging:

```sql
-- Example sanitization script
UPDATE users
SET
  email = CONCAT('user', id, '@example.com'),
  phone = CONCAT('+1555000', LPAD(id::text, 4, '0')),
  name = CONCAT('Test User ', id);

UPDATE orders
SET
  shipping_address = 'Sanitized Address';
```

### Access Control

- **VPN:** Not required (staging is publicly accessible)
- **Authentication:** Separate auth system (staging accounts)
- **Admin Access:** Limited to team members

### Deployment Process

Automatic on merge to `main`:

1. CI tests pass
2. Build created
3. Deploy to staging
4. Smoke tests run
5. Team notified in Slack

### Testing on Staging

```bash
# Run E2E tests against staging
npm run test:e2e -- --baseUrl=https://staging-project.vercel.app

# Manual testing checklist
# - Authentication flows
# - Key user journeys
# - Payment processing (test mode)
# - Email notifications (test inbox)
# - Error handling
# - Performance (load times)
```

### Monitoring

- **Uptime Kuma:** Monitors service availability
- **Sentry:** Tracks errors and exceptions
- **PostHog:** Analytics (separate staging project)
- **Logs:** Centralized logging system

## Production Environment

### Purpose
Live, user-facing services serving real users.

### Characteristics
- **Access:** End users + limited team access
- **Data:** Real user data (PII, financial, etc.)
- **Stability:** Highly stable, manual deployment
- **Deployment:** Manual approval required

### URL Structure

```
Web: https://buildersintl.org
API: https://api.buildersintl.org
Admin: https://admin.buildersintl.org
```

### Environment Variables

Configured securely in deployment platform:

```bash
NODE_ENV=production
API_URL=https://api.buildersintl.org
DATABASE_URL=postgresql://prod-db.buildersintl.org:5432/myapp_production
LOG_LEVEL=warn

# External services (production)
STRIPE_KEY=sk_live_...
SENDGRID_API_KEY=SG.prod...

# Feature flags
ENABLE_BETA_FEATURES=false
ENABLE_DEBUG_PANEL=false

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_API_KEY=phc_prod...

# Security
RATE_LIMIT_ENABLED=true
CORS_ORIGINS=https://buildersintl.org
```

### Database

Production-grade database:

- **Provider:** Digital Ocean Managed PostgreSQL
- **Backups:** Continuous + daily snapshots (30-day retention)
- **High Availability:** Primary + standby replicas
- **Encryption:** At rest and in transit
- **Monitoring:** Query performance, slow query log

### Access Control

- **VPN:** Required for infrastructure access
- **2FA:** Required for all admin access
- **Principle of Least Privilege:** Minimal access granted
- **Audit Logging:** All access logged and monitored

### Deployment Process

Manual with approval gates:

1. Create release tag
2. Trigger release workflow
3. Platform team approval required
4. Deploy with health checks
5. Smoke tests + monitoring
6. Team notification

See [Deployment Process](../../cicd-deployment/deployment-process.md) for details.

### Monitoring & Alerting

- **Uptime Kuma:** Service availability (1-minute checks)
- **Sentry:** Error tracking with alerting
- **PostHog:** User analytics and session recording
- **CrowdSec:** Security monitoring
- **Custom Dashboards:** Key business metrics

**Alert Channels:**
- Slack: #alerts channel
- PagerDuty: For critical incidents
- Email: For non-urgent notifications

### Backup & Disaster Recovery

**Database Backups:**
- Point-in-time recovery available
- Daily full backups retained for 30 days
- Tested restore procedures quarterly

**Application Backups:**
- Code in Git (version controlled)
- Configuration in deployment platform
- Secrets in secure secrets management

**Disaster Recovery Plan:**
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 5 minutes
- Documented runbooks for common scenarios

## Secrets Management

### Storage

**GitHub Secrets:**
Used for CI/CD workflows:

```
Settings → Secrets and variables → Actions
```

**Vercel Environment Variables:**
```
Project Settings → Environment Variables
```

**Digital Ocean:**
- Secrets stored in `/opt/app/.env.production` on droplet
- Access controlled via SSH keys
- Encrypted at rest

### Rotation Policy

- **API Keys:** Rotate every 90 days
- **Database Passwords:** Rotate every 180 days
- **SSH Keys:** Rotate annually
- **Service Account Tokens:** Rotate every 90 days

### Required Secrets per Environment

**Development:**
- Local database credentials
- Test API keys (Stripe, etc.)
- Development OAuth credentials

**Staging:**
- Staging database URL
- Test API keys
- Staging Sentry DSN
- Staging PostHog key
- Deployment credentials

**Production:**
- Production database URL
- Live API keys (Stripe, SendGrid, etc.)
- Production monitoring keys
- Domain certificates (auto-managed by Cloudflare)
- Deployment credentials

## Environment-Specific Configuration

### Feature Flags

Control features per environment:

```typescript
// config/features.ts
const features = {
  development: {
    betaFeatures: true,
    debugPanel: true,
    analytics: false,
  },
  staging: {
    betaFeatures: true,
    debugPanel: true,
    analytics: true,
  },
  production: {
    betaFeatures: false,
    debugPanel: false,
    analytics: true,
  },
}

export const isFeatureEnabled = (feature: keyof typeof features.development) => {
  return features[process.env.NODE_ENV][feature]
}
```

### Rate Limiting

```typescript
const rateLimits = {
  development: {
    enabled: false,
    requests: Infinity,
  },
  staging: {
    enabled: true,
    requests: 1000, // per hour
  },
  production: {
    enabled: true,
    requests: 100, // per hour
  },
}
```

### Logging

```typescript
const logging = {
  development: {
    level: 'debug',
    pretty: true,
  },
  staging: {
    level: 'info',
    pretty: false,
  },
  production: {
    level: 'warn',
    pretty: false,
  },
}
```

## Adding a New Environment Variable

1. **Add to documentation**
   - Document purpose and format
   - Specify which environments need it

2. **Add to example files**
   ```bash
   # .env.example
   NEW_VARIABLE=example_value
   ```

3. **Configure in deployment platforms**
   - Vercel: Project settings
   - Digital Ocean: Update .env file on droplet

4. **Update CI/CD workflows**
   - Add secret to GitHub if needed
   - Update workflow files

5. **Test in staging first**
   - Verify variable is accessible
   - Ensure feature works correctly

6. **Deploy to production**
   - Add variable to production environment
   - Verify configuration

## Troubleshooting

### Environment Variable Not Loading

```bash
# Check environment
echo $NODE_ENV

# Verify .env file loaded
node -e "require('dotenv').config(); console.log(process.env)"

# Check deployment platform configuration
# Vercel: vercel env ls
# Digital Ocean: SSH and check .env file
```

### Database Connection Issues

```bash
# Test database connectivity
psql $DATABASE_URL

# Check connection pool
# Monitor active connections
# Verify credentials are correct
```

### Staging/Production Drift

If environments diverge:

1. Document differences
2. Create plan to reconcile
3. Update infrastructure as code
4. Apply changes consistently

## Best Practices

1. **Environment Parity:** Keep staging as close to production as possible
2. **Secrets Hygiene:** Never commit secrets, rotate regularly
3. **Configuration as Code:** Define environment config in version control
4. **Least Privilege:** Grant minimum necessary access
5. **Monitor Everything:** Track metrics and logs in all environments
6. **Test on Staging First:** Always validate changes on staging before production
7. **Document Changes:** Keep environment documentation up to date
8. **Automate Provisioning:** Use infrastructure as code when possible
9. **Backup Regularly:** Ensure all environments have backup strategies
10. **Review Access:** Audit environment access quarterly

## Resources

- [Infrastructure Overview](../../infrastructure/overview.md)
- [Deployment Process](../../cicd-deployment/deployment-process.md)
- [CI/CD Workflows](../../cicd-deployment/workflows.md)
- [Secrets Management](#) (TODO: Detailed secrets guide)
EOF
```

- [ ] **Step 7: Commit CI/CD documentation**

```bash
git add docs/cicd-deployment/
git commit -m "docs: add CI/CD and deployment documentation

Added comprehensive CI/CD workflows adapted from egi-ci:cd repository.
Includes GitHub Actions templates, deployment procedures, and environment configuration.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

**(Implementation plan continues in next message due to length constraints...)**

## Task 3: Create Code Quality Documentation

**Files:**
- Create: `docs/code-quality/overview.md`
- Create: `docs/code-quality/testing-standards.md`
- Create: `docs/code-quality/code-review.md`
- Create: `docs/code-quality/best-practices.md`

- [ ] **Step 1: Create code-quality directory**

```bash
mkdir -p docs/code-quality
```

- [ ] **Step 2: Create overview.md**

Create comprehensive code quality philosophy document covering:
- Quality expectations for all projects
- Code review culture
- Testing philosophy
- Documentation standards
- Security awareness

- [ ] **Step 3: Create testing-standards.md**

Document testing requirements:
- Unit testing (Jest, PyTest, Go test)
- Integration testing
- E2E testing (Playwright, Cypress)
- Coverage expectations (>80%)
- Test organization patterns
- Mocking strategies
- CI integration

- [ ] **Step 4: Create code-review.md**

Document PR review process:
- Review checklist
- Approval requirements
- Review timelines
- Constructive feedback guidelines
- Security review points
- Performance considerations

- [ ] **Step 5: Create best-practices.md**

Language-specific best practices:
- JavaScript/TypeScript standards
- Python standards
- Go standards
- Naming conventions
- Error handling
- Logging practices
- Security (OWASP top 10)
- Performance optimization

- [ ] **Step 6: Commit code quality documentation**

```bash
git add docs/code-quality/
git commit -m "docs: add code quality standards

Comprehensive code quality documentation including testing standards,
code review process, and language-specific best practices.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Document Builders-Data-Dashboard Project

**Files:**
- Create: `docs/Builders-Data-Dashboard/overview.md`
- Create: `docs/Builders-Data-Dashboard/architecture.md`
- Create: `docs/Builders-Data-Dashboard/repo-link.md`
- Create: `docs/Builders-Data-Dashboard/next-steps.md`

- [ ] **Step 1: Explore Builders-Data-Dashboard repository**

```bash
cd ~/Developer/Builders-Data-Dashboard
ls -la
cat README.md
cat package.json
git log --oneline -10
git remote -v
```

- [ ] **Step 2: Analyze project structure**

```bash
tree -L 3 -I 'node_modules|.git' > /tmp/bdd-structure.txt
cat /tmp/bdd-structure.txt
```

- [ ] **Step 3: Extract tech stack and dependencies**

```bash
# Read key files
cat package.json | jq '.dependencies, .devDependencies'
cat prisma/schema.prisma 2>/dev/null || echo "No Prisma schema"
ls app/api/ 2>/dev/null || ls pages/api/ 2>/dev/null || echo "Check API structure"
```

- [ ] **Step 4: Create overview.md**

Extract and document:
- Project purpose (from README, CLAUDE.md memory)
- Business value
- Tech stack (Next.js, Prisma, PostgreSQL, etc.)
- Key features
- Target users
- Current status

- [ ] **Step 5: Create architecture.md**

Document:
- System architecture
- Database schema (from Prisma schema)
- API endpoints (from app/api or pages/api)
- File structure
- External integrations
- Design patterns used

- [ ] **Step 6: Create repo-link.md**

Document:
- Local path: `~/Developer/Builders-Data-Dashboard`
- GitHub URL (from git remote)
- Branch structure (from git branch -a)
- Key maintainers (from git log)

- [ ] **Step 7: Create next-steps.md**

Document:
- Known issues (from TODOs in code)
- Planned features
- Technical debt
- Dependencies needing updates

- [ ] **Step 8: Clean up node_modules**

```bash
cd ~/Developer/Builders-Data-Dashboard
du -sh node_modules build dist .next 2>/dev/null
rm -rf node_modules build dist .next .turbo
du -sh .
```

- [ ] **Step 9: Commit Builders-Data-Dashboard documentation**

```bash
cd ~/Developer/builders-docs
git add docs/Builders-Data-Dashboard/
git commit -m "docs: add Builders-Data-Dashboard documentation

Comprehensive documentation extracted from repository including
architecture, API endpoints, database schema, and deployment info.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Document Builders-Events Project

**Files:**
- Create: `docs/Builders-Events/overview.md`
- Create: `docs/Builders-Events/architecture.md`
- Create: `docs/Builders-Events/repo-link.md`
- Create: `docs/Builders-Events/next-steps.md`

- [ ] **Step 1: Explore Builders-Events repository**

```bash
cd ~/Developer/Builders-Events
ls -la
cat README.md
cat package.json
git log --oneline -10
git remote -v
```

- [ ] **Step 2: Analyze project structure and extract documentation**

Follow same process as Task 4:
- Analyze structure
- Extract tech stack
- Create 4 documentation files
- Clean up dependencies
- Commit

- [ ] **Step 3: Clean up and commit**

```bash
rm -rf node_modules build dist .next
cd ~/Developer/builders-docs
git add docs/Builders-Events/
git commit -m "docs: add Builders-Events documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Document builders-events-mobile Project

**Files:**
- Create: `docs/builders-events-mobile/overview.md`
- Create: `docs/builders-events-mobile/architecture.md`
- Create: `docs/builders-events-mobile/repo-link.md`
- Create: `docs/builders-events-mobile/next-steps.md`

- [ ] **Step 1: Explore builders-events-mobile repository**

```bash
cd ~/Developer/builders-events-mobile
ls -la
cat README.md
cat package.json
cat app.json 2>/dev/null || cat app.config.js 2>/dev/null
git log --oneline -10
git remote -v
```

- [ ] **Step 2: Analyze React Native project structure**

```bash
# Check if Expo or bare React Native
cat package.json | jq '.dependencies.expo, .dependencies."react-native"'
tree -L 2 -I 'node_modules|ios/Pods|android/build'
```

- [ ] **Step 3: Create documentation files**

Document React Native specific architecture:
- Expo vs bare React Native
- Navigation structure
- State management
- Native modules
- Build configuration

- [ ] **Step 4: Clean up and commit**

```bash
rm -rf node_modules ios/Pods android/build android/.gradle
cd ~/Developer/builders-docs
git add docs/builders-events-mobile/
git commit -m "docs: add builders-events-mobile documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Document builders-radio Project

**Files:**
- Create: `docs/builders-radio/overview.md`
- Create: `docs/builders-radio/architecture.md`
- Create: `docs/builders-radio/repo-link.md`
- Create: `docs/builders-radio/next-steps.md`

- [ ] **Step 1: Explore builders-radio repository**

```bash
cd ~/Developer/builders-radio
ls -la
cat README.md
```

Note: User mentioned this is "just keys" and is a web radio hosted on AzuraCast on a DO droplet.

- [ ] **Step 2: Document simple configuration project**

For configuration-only project:
- Document what AzuraCast is
- Document DO droplet hosting
- Document configuration files present
- Document access procedures

- [ ] **Step 3: Commit documentation**

```bash
cd ~/Developer/builders-docs
git add docs/builders-radio/
git commit -m "docs: add builders-radio documentation

Documentation for web radio configuration hosted on AzuraCast.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Document buildersintl-website Project

**Files:**
- Create: `docs/buildersintl-website/overview.md`
- Create: `docs/buildersintl-website/architecture.md`
- Create: `docs/buildersintl-website/repo-link.md`
- Create: `docs/buildersintl-website/next-steps.md`

- [ ] **Step 1: Explore buildersintl-website repository**

```bash
cd ~/Developer/buildersintl-website
ls -la
cat README.md
cat package.json
```

Note: User mentioned migrating from WordPress to Astro/Payload local with DO Droplet fallback.

- [ ] **Step 2: Document migration project**

Document:
- Current state (WordPress vs Astro/Payload)
- Migration plan/status
- Astro project structure
- Payload CMS integration
- DO droplet deployment
- Migration timeline

- [ ] **Step 3: Clean up and commit**

```bash
rm -rf node_modules build dist .astro
cd ~/Developer/builders-docs
git add docs/buildersintl-website/
git commit -m "docs: add buildersintl-website documentation

Documentation for website migration from WordPress to Astro/Payload.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Document Vireo Project

**Files:**
- Create: `docs/Vireo/overview.md`
- Create: `docs/Vireo/architecture.md`
- Create: `docs/Vireo/repo-link.md`
- Create: `docs/Vireo/next-steps.md`

- [ ] **Step 1: Explore Vireo repository**

```bash
cd ~/Developer/Vireo
ls -la
cat README.md
cat package.json 2>/dev/null || cat requirements.txt 2>/dev/null || cat go.mod 2>/dev/null
git log --oneline -10
git remote -v
```

- [ ] **Step 2: Analyze and document Vireo**

Follow comprehensive documentation process:
- Extract project purpose
- Document architecture
- Map APIs and integrations
- Note deployment information

- [ ] **Step 3: Clean up and commit**

```bash
# Clean up based on tech stack
rm -rf node_modules build dist __pycache__ venv vendor target
cd ~/Developer/builders-docs
git add docs/Vireo/
git commit -m "docs: add Vireo documentation

Comprehensive Vireo project documentation with architecture and APIs.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update Sidebar Navigation

**Files:**
- Modify: `sidebars.ts`

- [ ] **Step 1: Read current sidebars.ts**

```bash
cd ~/Developer/builders-docs
cat sidebars.ts
```

- [ ] **Step 2: Update sidebars.ts with all new sections**

Add standards sections at the top, then alphabetically integrate new projects with existing ones:

```typescript
module.exports = {
  mainSidebar: [
    'index',
    
    // Development Standards
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/overview',
        'infrastructure/crowdsec',
        'infrastructure/uptime-kuma',
        'infrastructure/cloudflare',
        'infrastructure/posthog',
      ],
    },
    {
      type: 'category',
      label: 'CI/CD & Deployment',
      items: [
        'cicd-deployment/overview',
        'cicd-deployment/workflows',
        'cicd-deployment/deployment-process',
        'cicd-deployment/environments',
      ],
    },
    {
      type: 'category',
      label: 'Code Quality',
      items: [
        'code-quality/overview',
        'code-quality/testing-standards',
        'code-quality/code-review',
        'code-quality/best-practices',
      ],
    },
    
    // Projects (alphabetical)
    // ... existing projects ...
    // ... new projects added in alphabetical order ...
  ],
};
```

- [ ] **Step 3: Verify sidebar syntax**

```bash
npx tsc --noEmit sidebars.ts
```

Expected: No errors

- [ ] **Step 4: Commit sidebar updates**

```bash
git add sidebars.ts
git commit -m "docs: update sidebar with new sections

Added Infrastructure, CI/CD & Deployment, and Code Quality sections.
Added 6 new project documentation sections.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Update Main Index Page

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: Read current index**

```bash
cat docs/index.md
```

- [ ] **Step 2: Update index.md with new sections**

Add Development Standards section before Projects section:

```markdown
# Builders International Documentation

Welcome to the Builders International project documentation.

## Development Standards

- [Infrastructure](./infrastructure/overview.md) - Cloud security, monitoring, DNS, and analytics
- [CI/CD & Deployment](./cicd-deployment/overview.md) - Deployment workflows and processes
- [Code Quality](./code-quality/overview.md) - Testing, code review, and best practices

## Projects

[List all projects including new ones]
```

- [ ] **Step 3: Commit index updates**

```bash
git add docs/index.md
git commit -m "docs: update index with development standards

Added Development Standards section covering Infrastructure, CI/CD, and Code Quality.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Build and Verify Site

**Files:**
- None (verification only)

- [ ] **Step 1: Install dependencies**

```bash
cd ~/Developer/builders-docs
npm install
```

- [ ] **Step 2: Build site**

```bash
npm run build
```

Expected: Build completes without errors

- [ ] **Step 3: Start development server**

```bash
npm start
```

Expected: Site runs at http://localhost:3000

- [ ] **Step 4: Manual verification checklist**

- [ ] Homepage loads
- [ ] All 3 standards sections visible in sidebar
- [ ] All standards pages load correctly
- [ ] All 6 new project sections visible in sidebar
- [ ] All new project pages load correctly
- [ ] Internal links work (click random links to standards)
- [ ] No broken links or 404s
- [ ] Sidebar navigation is alphabetical
- [ ] Search works (if enabled)

- [ ] **Step 5: Check for broken links**

```bash
# Optional: Use link checker if available
npm run check-links 2>/dev/null || echo "No link checker configured"
```

- [ ] **Step 6: Stop development server**

Press Ctrl+C

---

## Task 13: Final Cleanup and Summary

**Files:**
- None

- [ ] **Step 1: Verify all project repos cleaned up**

```bash
du -sh ~/Developer/Builders-Data-Dashboard
du -sh ~/Developer/Builders-Events
du -sh ~/Developer/builders-events-mobile
du -sh ~/Developer/builders-radio
du -sh ~/Developer/buildersintl-website
du -sh ~/Developer/Vireo
```

Expected: All should be smaller (no node_modules, build artifacts)

- [ ] **Step 2: Review all commits**

```bash
cd ~/Developer/builders-docs
git log --oneline --since="today"
```

- [ ] **Step 3: Create summary of changes**

```bash
git log --oneline --since="today" > /tmp/documentation-update-summary.txt
cat /tmp/documentation-update-summary.txt
```

- [ ] **Step 4: Final commit if needed**

```bash
# If any loose ends, commit them
git status
git add .
git commit -m "docs: final documentation update cleanup

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Push to remote**

```bash
git push origin master
```

---

## Success Criteria

✅ **Documentation Completeness:**
- [ ] 3 standards sections created (Infrastructure, CI/CD & Deployment, Code Quality)
- [ ] 13 infrastructure/standards files created
- [ ] 6 new project sections created
- [ ] 24 project documentation files created
- [ ] All existing 8 projects remain unchanged
- [ ] Sidebar navigation updated
- [ ] Main index updated

✅ **Quality:**
- [ ] All markdown renders correctly
- [ ] All internal links work
- [ ] Cross-references to standards functional
- [ ] No placeholder content (TBD, TODO)
- [ ] Consistent formatting across all files
- [ ] Site builds without errors

✅ **Technical:**
- [ ] All project repos cleaned (no node_modules)
- [ ] All changes committed
- [ ] All commits pushed to remote
- [ ] Site verified locally

✅ **Documentation:**
- [ ] CI/CD workflows adapted from egi-ci:cd
- [ ] Infrastructure tooling comprehensively documented
- [ ] Code quality standards established
- [ ] Project architectures extracted from repos
- [ ] Deployment information documented

---

## Estimated Time

- **Task 1 (Infrastructure):** 30 minutes
- **Task 2 (CI/CD):** 45 minutes  
- **Task 3 (Code Quality):** 30 minutes
- **Tasks 4-9 (6 Projects):** 2-3 hours (20-30 min each)
- **Task 10-11 (Navigation):** 15 minutes
- **Task 12 (Verification):** 20 minutes
- **Task 13 (Cleanup):** 10 minutes

**Total: ~5-6 hours of focused work**

---

## Notes for Implementation

1. **Work Standards-First:** Complete Tasks 1-3 before starting project documentation
2. **Test as You Go:** Build site after major sections to catch issues early
3. **Clean Immediately:** Remove node_modules right after documenting each project
4. **Commit Frequently:** One commit per task or sub-task
5. **Cross-Reference:** Link to standards sections from project docs
6. **Ask Questions:** If repo structure unclear, note in next-steps.md
7. **Security Conscious:** Don't document secrets, API keys, or sensitive paths
8. **Stakeholder Friendly:** Write for both developers and non-technical stakeholders

---

## Troubleshooting

### Build Fails
- Check for markdown syntax errors
- Verify all file paths in sidebars.ts are correct
- Ensure no special characters in filenames
- Run `npm run clear` to clear Docusaurus cache

### Links Broken
- Verify relative paths are correct
- Check file extensions (.md)
- Ensure case sensitivity matches (Linux vs Mac)

### Sidebar Not Updating
- Restart development server
- Clear cache: `npm run clear && npm start`
- Check for TypeScript errors in sidebars.ts

### Project Documentation Incomplete
- If README is sparse, extract from code comments
- Check for ARCHITECTURE.md or docs/ folder in repo
- Review git commit messages for context
- Note gaps in next-steps.md for future research

