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
4. Consider adding CDN (see [Cloudflare docs](./cloudflare.md))

## Resources

- [Uptime Kuma GitHub](https://github.com/louislam/uptime-kuma)
- [Documentation](https://github.com/louislam/uptime-kuma/wiki)
- [Community Forum](https://github.com/louislam/uptime-kuma/discussions)
