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
