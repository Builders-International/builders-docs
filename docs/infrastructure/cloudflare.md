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
Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler" "Monitoring & Analytics"})
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
