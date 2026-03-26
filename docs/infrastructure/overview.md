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
- See [Cloudflare documentation](./cloudflare.md)

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
