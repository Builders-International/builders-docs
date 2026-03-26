# Builders Radio Overview

## What is Builders Radio?

Builders Radio is a web-based streaming radio service that broadcasts audio content for Builders International. The service is built on AzuraCast, a powerful, open-source radio management and automation platform that provides professional-grade broadcasting capabilities.

## Purpose

The primary purpose of Builders Radio is to:

- **Stream live and pre-recorded audio content** to listeners worldwide
- **Maintain a curated library** of music, instrumental tracks, and worship content
- **Provide a consistent listening experience** with a web-based player interface
- **Enable automated playlist management** and scheduled broadcasting

## Hosting Infrastructure

### Platform: AzuraCast

AzuraCast is a self-contained, standalone radio server that handles:

- **Media library management** - organizing, uploading, and managing audio files
- **Live streaming capabilities** - broadcasting to multiple bitrates and formats
- **Playlist automation** - scheduling and rotating content automatically
- **Web player integration** - embedding players on websites
- **Analytics and statistics** - tracking listener demographics and engagement
- **Remote management** - controlling the station via web dashboard and API

### Server Deployment

The AzuraCast instance is hosted on a **DigitalOcean droplet**, a cloud-based virtual private server (VPS) that provides:

- Reliable, redundant infrastructure
- Automatic backups and snapshots
- Scalable resources for handling concurrent listeners
- Global CDN support for lower latency streaming

## Repository Contents

The builders-radio repository stores essential infrastructure components:

### 1. SSH Keys (`builders-radio`, `builders-radio.pub`)

SSH key pair used for secure shell access to the DigitalOcean droplet hosting AzuraCast.

**Security note:** The private key should only be accessible to authorized team members with deployment responsibilities.

### 2. Media Files (`/media` directory)

Organized audio content library with three main categories:

- **Bilateral** - Content for bilateral programming
- **Instrumentals** - Instrumental music tracks
- **Worship** - Worship-related audio content

These files are synchronized with the AzuraCast media library.

### 3. Video Integration Code (`/vimeo_transfer` directory)

Python utilities for transferring video content from Vimeo to AWS S3 storage, enabling video playback on web properties. This supports the broader Builders International media ecosystem.

### 4. Public Code (`/public_code` directory)

Web-facing code for embedding the radio player on websites:

- **glassPlayer.css** - Styling for the radio player widget
- **public.js** - JavaScript for video background playback
- **public.css** - Additional styling for public-facing elements

## Current Status

The Builders Radio service is:

- ✅ **Operational** - actively streaming audio content
- ✅ **Automated** - using playlist scheduling and rotation
- ✅ **Integrated** - embedded on Builders International web properties
- ✅ **Monitored** - regular maintenance and content updates performed

## Access and Management

### Who Has Access?

- **Technical team:** SSH access to DigitalOcean droplet for maintenance
- **Content managers:** AzuraCast web dashboard for playlist and media management
- **Developers:** API access for integrations and custom features
- **Public listeners:** Web player access via published stream URLs

### Key Access Points

- **AzuraCast Dashboard:** Web-based administration interface
- **SSH/Remote Access:** Via key pair stored in this repository
- **Stream URLs:** Public endpoints for listener connection
- **API:** For programmatic control and integration

## Related Documentation

- [Architecture](./architecture.md) - Technical setup and infrastructure details
- [Repository Links](./repo-link.md) - Connection details and access information
- [Next Steps](./next-steps.md) - Planned improvements and maintenance tasks

## Quick Facts

- **Technology Stack:** AzuraCast (Docker), DigitalOcean (hosting), AWS S3 (backup storage)
- **Audio Formats:** Multiple bitrates for adaptive streaming
- **Player:** GlassPlayer web widget
- **Content:** Music, instrumentals, worship tracks, pre-recorded broadcasts
- **Audience:** Global listeners via web player
