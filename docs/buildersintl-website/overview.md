# Builders International Website - Project Overview

## Introduction

The Builders International website project represents a comprehensive modernization effort to migrate the organization's public-facing website from WordPress to a modern, performant stack built on Astro and Payload CMS. This migration addresses critical issues with the legacy WordPress setup including performance bottlenecks, developer experience limitations, and maintenance complexity.

**Repository**: `~/Developer/buildersintl-website`
**GitHub**: https://github.com/Builders-International/BuildersIntl-Website
**Status**: Active Migration (Phase 2.1 ~40% Complete)
**Started**: March 2026

## Project Purpose

The Builders International website serves as the primary digital presence for Builders International, a missions organization focused on global ministry work. The website serves multiple critical functions:

### Primary Functions

1. **Public Information Hub**
   - Organization mission, vision, and values
   - Ministry focus areas and impact stories
   - Team member profiles and leadership information
   - Contact information and office locations

2. **Content Publication Platform**
   - Blog posts and ministry updates
   - Event announcements and reports
   - Photo galleries and media content
   - Newsletter archives and resources

3. **Engagement Portal**
   - Donation and giving information
   - Volunteer opportunities and applications
   - Partnership programs for churches and organizations
   - Prayer request submissions

4. **Resource Library**
   - Downloadable ministry resources
   - Training materials and guides
   - Annual reports and financial transparency
   - Multimedia content (videos, podcasts)

## Migration Context

### FROM: WordPress (Legacy System)

The previous WordPress-based website suffered from several critical limitations:

**Technical Limitations**:
- Slow page load times (3-5 seconds average)
- Bloated codebase with excessive plugins
- Security vulnerabilities requiring constant patching
- PHP-based architecture difficult to maintain
- Limited customization without theme conflicts
- Poor mobile performance
- Expensive managed WordPress hosting

**Content Management Issues**:
- Complex admin interface overwhelming for non-technical users
- Frequent plugin conflicts breaking functionality
- Limited content modeling flexibility
- Media management inefficient for large libraries
- Version control difficult for code changes

**Developer Experience Problems**:
- Local development setup complex and fragile
- Theme development requires PHP expertise
- Plugin ecosystem unpredictable and risky
- Debugging difficult with poor error messages
- No TypeScript support for type safety

### TO: Astro + Payload CMS (Modern Stack)

The new architecture leverages modern web technologies to address these limitations:

**Astro Frontend**:
- Static Site Generation (SSG) + Server-Side Rendering (SSR) hybrid
- Optimal performance with minimal JavaScript
- Component-based architecture for reusability
- Build-time optimization for images and assets
- Modern developer experience with TypeScript

**Payload CMS Backend**:
- TypeScript-first headless CMS
- Intuitive admin interface for content editors
- Flexible content modeling with collections
- Built-in media management with S3 integration
- REST and GraphQL APIs for data access
- Modern authentication and user management

**Infrastructure Benefits**:
- Docker containerization for consistency
- Local-first deployment with cloud failover
- PostgreSQL/MongoDB for reliable data storage
- Nginx for efficient reverse proxy and SSL
- Automated backups and disaster recovery

### Why Migrate?

**Performance**: Astro's static generation and minimal JavaScript approach delivers sub-second page loads, significantly improving user experience and SEO rankings.

**Developer Experience**: Modern TypeScript-based stack with excellent tooling, hot module replacement, and clear error messages accelerates development velocity.

**Content Management**: Payload's clean admin interface and flexible content modeling empowers content editors while giving developers full control over data structures.

**Maintainability**: Component-based architecture, TypeScript type safety, and Docker containerization reduce technical debt and simplify long-term maintenance.

**Cost Efficiency**: Self-hosted solution on Digital Ocean or local infrastructure eliminates expensive managed WordPress hosting fees.

**Security**: Headless architecture with separate frontend and backend reduces attack surface. Regular updates simpler with containerized deployments.

**Scalability**: Stateless architecture with database-backed CMS enables horizontal scaling as traffic grows.

## Current Migration Status

### Phase 1: Content Extraction (ON HOLD - Incomplete)

**Status**: ⏸️ Paused
**Repository**: `~/Developer/Builders-Website/` (separate extraction tool)

The initial WordPress content extraction pipeline encountered issues:
- WordPress .wpress file successfully exported
- Content parser built and tested
- S3 upload incomplete or failed (buckets mostly empty)
- Only one "undefined" page in S3 content bucket
- Media bucket completely empty

**Decision**: Proceed with infrastructure build first, address extraction later. Content can be created directly in Payload CMS or extracted after infrastructure is stable.

### Phase 2.1: Astro Frontend Foundation (~40% Complete)

**Status**: 🚧 In Progress
**Repository**: `~/Developer/buildersintl-website/`

**Completed Components**:
- ✅ Astro v6.0.8 project initialized with SSR mode
- ✅ Content collections configured (pages, posts)
- ✅ Three layout templates created (Base, Page, Post)
- ✅ Dynamic routing implemented ([...slug].astro)
- ✅ Homepage with hero section
- ✅ Blog index with post listings
- ✅ Individual blog post pages
- ✅ Static pages (About, Contact)
- ✅ Test content (2 pages, 2 posts)
- ✅ Dev server tested successfully (http://localhost:4321)
- ✅ Git repository initialized with clean history

**Remaining Work**:
- ⏳ Extract WordPress design (CSS/HTML from buildersintl.org)
- ⏳ Build component library (Header, Footer, Navigation, Cards, Forms)
- ⏳ Recreate pixel-perfect design from WordPress
- ⏳ Implement responsive layouts for all screen sizes
- ⏳ Performance optimization (Lighthouse score >90)
- ⏳ SEO implementation (meta tags, structured data, sitemap)

### Phase 2.2: Payload CMS + Docker (Next Priority)

**Status**: 📋 Ready to Start
**Estimated Duration**: 1-2 weeks

**Planned Tasks**:
1. Initialize Payload CMS in `payload/` directory
2. Configure MongoDB database via Docker
3. Create content collections (Users, Pages, Posts, Media)
4. Set up S3 storage plugin for media uploads
5. Build Docker images for all services
6. Configure docker-compose.yml orchestration
7. Set up Nginx reverse proxy with SSL
8. Test full stack locally or on Digital Ocean
9. Create admin user accounts
10. Import or create initial content

**Key Decision**: Changed from PostgreSQL to MongoDB due to Payload 2.x compatibility. MongoDB provides better out-of-the-box support for Payload's document-based architecture.

### Phase 2.3: Cloud Failover Setup (Future)

**Status**: 📋 Planned
**Estimated Duration**: 1 week

**Infrastructure Goals**:
- Deploy to Digital Ocean droplet as failover
- Configure database replication (local → cloud)
- Set up Cloudflare Load Balancer for health checks
- Implement automatic failover when local goes down
- Test failover and failback scenarios
- Document operational procedures

### Phase 2.4: Production Launch (Future)

**Status**: 📋 Planned
**Estimated Duration**: 2-3 weeks

**Launch Requirements**:
- Design QA (pixel-perfect match with WordPress)
- Performance validation (Lighthouse >90 on all pages)
- SEO verification (meta tags, sitemap, robots.txt, structured data)
- Content migration or creation complete
- SSL certificates installed (local + cloud)
- DNS cutover to new site
- WordPress decommissioning plan
- User training for CMS (video tutorials and documentation)
- Monitoring and alerting setup
- Post-launch support plan

## Technology Stack

### Frontend Layer

**Astro** v6.0.8
- Modern meta-framework for content-focused websites
- Hybrid SSG/SSR rendering for optimal performance
- Component islands architecture (ship minimal JavaScript)
- Built-in image optimization and asset handling
- File-based routing with dynamic parameters
- TypeScript support out of the box

**Node.js Adapter** (@astrojs/node)
- Standalone mode for self-hosted deployment
- Server-side rendering capabilities
- Docker-friendly single-process server

**Sitemap Integration** (@astrojs/sitemap)
- Automatic XML sitemap generation
- SEO optimization for search engines

### Backend Layer

**Payload CMS** v2.x
- TypeScript-first headless CMS
- Express.js-based REST API server
- Built-in admin UI (React-based)
- Flexible content collections with schemas
- User authentication and role-based access control
- Webpack bundler for admin panel

**Database**:
- **MongoDB** for Payload CMS data storage (collections, users, sessions)
- Document-based schema for flexible content modeling
- Mongoose adapter for Payload integration
- Replication support for high availability

**Media Storage**:
- **AWS S3** for image and file uploads
- Payload S3 cloud storage plugin
- Content bucket: `builders-website-content`
- Media bucket: `builders-website-media`
- CloudFront CDN integration (future)

### Infrastructure Layer

**Docker** + **Docker Compose**
- Containerized services for consistency across environments
- Services: MongoDB, Payload CMS, Astro Frontend, Nginx
- Volume persistence for database and uploads
- Health checks for service monitoring
- Easy deployment and scaling

**Nginx**
- Reverse proxy for routing requests
- SSL/TLS termination
- Load balancing (future multi-instance)
- Static asset serving with caching
- Request routing:
  - `/admin` → Payload CMS admin panel
  - `/api` → Payload CMS REST API
  - `/*` → Astro frontend

**Hosting Options**:
- **Primary**: Local deployment (Synology NAS or dedicated server)
- **Failover**: Digital Ocean droplet (4GB RAM, 2 vCPU, $24/month)
- **DNS/CDN**: Cloudflare (DNS management, DDoS protection, caching)

### Development Tools

**Package Management**: npm
**Version Control**: Git + GitHub
**Code Quality**: TypeScript, ESLint (future)
**Containerization**: Docker Desktop (local), Docker Engine (production)
**Deployment**: Docker Compose orchestration
**Monitoring**: Docker health checks, Cloudflare analytics (future)

## Key Pages and Sections

### Homepage
- Hero section with mission statement
- Featured ministry updates
- Call-to-action buttons (Donate, Get Involved, Learn More)
- Latest blog posts preview
- Impact statistics
- Partner logos

### About Section
- Organization history and timeline
- Mission, vision, and core values
- Leadership team profiles
- Ministry focus areas
- Financial transparency and annual reports

### Blog/News
- Chronological listing of posts with pagination
- Category filtering (Ministry Updates, Field Reports, Events, Resources)
- Tag-based content discovery
- Search functionality (future)
- Author archives
- Featured posts

### Get Involved
- Donation options and giving information
- Volunteer opportunities and application forms
- Partnership programs for churches
- Prayer request submission
- Newsletter subscription
- Contact forms

### Ministries
- Overview of ministry focus areas
- Geographic regions served
- Project showcases with photos
- Impact stories and testimonials
- Partner organization links

### Events
- Upcoming events calendar
- Event details and registration
- Past event recaps with photos
- Conference and training opportunities

### Resources
- Downloadable ministry resources
- Training materials and guides
- Video library
- Podcast episodes (if applicable)
- Newsletter archives

### Contact
- Contact form
- Office locations and hours
- Staff directory
- Social media links
- Map integration

## Target Audiences

### Primary Audiences

**1. Donors and Supporters**
- Individuals who financially support the ministry
- Churches and organizations providing partnership support
- Monthly recurring donors seeking impact updates
- Major donors requiring transparency and reporting

**Content Needs**: Impact stories, financial transparency, giving options, ministry updates, annual reports

**2. Prospective Volunteers**
- Short-term mission trip participants
- Long-term missionaries exploring opportunities
- Skilled professionals (medical, education, construction) wanting to serve
- Students and young adults seeking ministry experience

**Content Needs**: Volunteer opportunities, application process, testimonials, training resources, FAQ

**3. Partner Churches and Organizations**
- Churches seeking partnership opportunities
- Mission agencies exploring collaboration
- Educational institutions interested in service learning
- Corporate partners for skills-based volunteering

**Content Needs**: Partnership programs, collaboration opportunities, resource sharing, event coordination

**4. Ministry Stakeholders**
- Current missionaries and field workers
- Board members and advisors
- Staff and administrative team
- Prayer partners and intercessors

**Content Needs**: Internal updates, resource access, communication tools, policy documentation

### Secondary Audiences

**5. General Public**
- Individuals curious about missions work
- Researchers studying international development
- Media and journalists covering ministry stories
- Academics studying faith-based organizations

**Content Needs**: General information, press resources, research data, media kit

**6. Beneficiaries and Communities Served**
- Local communities receiving ministry services
- International partners and local organizations
- Students in ministry-supported schools
- Recipients of humanitarian aid

**Content Needs**: Program information, success stories, community resources, local language support (future)

## Content Types

### Pages (Static Content)
- About Us
- Mission & Vision
- Leadership Team
- Ministries Overview
- Get Involved
- Donate
- Contact Us
- Privacy Policy
- Terms of Use

**Collection Schema**: Title, slug, content (rich text), author, dates, SEO metadata, featured image

### Posts (Blog Content)
- Ministry updates from the field
- Event recaps and announcements
- Impact stories and testimonials
- Prayer requests and praise reports
- Theological reflections
- Resource recommendations

**Collection Schema**: Title, slug, content (rich text), author, publish date, categories, tags, excerpt, featured image, SEO metadata

### Media Library
- Photography from ministry sites
- Event photos and team pictures
- Infographics and illustrations
- Document uploads (PDFs, presentations)
- Video files (YouTube embeds preferred)

**Collection Schema**: File, alt text, caption, credit/photographer, upload date, related content

### Team Members (Future)
- Staff and missionary profiles
- Leadership team bios
- Board member information

**Collection Schema**: Name, role, bio, photo, email, social links, ministry focus

### Events (Future)
- Upcoming conferences and training
- Mission trip opportunities
- Fundraising events
- Webinars and online events

**Collection Schema**: Title, description, date/time, location, registration link, capacity, status

## Deployment Strategy

### Digital Ocean Droplet Deployment

**Server Specifications**:
- Region: San Francisco 3 (or closest to primary users)
- OS: Ubuntu 24.04 LTS x64
- Size: 4GB RAM / 2 vCPU (recommended for production)
- Storage: 50GB SSD included
- Network: 1TB transfer/month included
- Cost: ~$24/month

**Deployment Process**:
1. Create droplet via Digital Ocean dashboard
2. SSH into server and update system packages
3. Install Docker and Docker Compose
4. Configure UFW firewall (ports 22, 80, 443)
5. Clone git repository to `/opt/buildersintl-website`
6. Configure `.env` file with production secrets
7. Pull base images and build custom images
8. Start services with `docker-compose up -d`
9. Verify all containers healthy
10. Configure SSL with Let's Encrypt (certbot)
11. Test all endpoints and admin panel
12. Create admin users and initial content
13. Configure automated backups
14. Set up monitoring and alerting

**Reference Documentation**: See `/DIGITALOCEAN_SETUP.md` in project repository

### Local Deployment Option

For organizations with on-premises infrastructure or Synology NAS:

**Requirements**:
- Linux server or NAS with Docker support
- 4GB+ RAM available
- 20GB+ storage for Docker images and database
- Static IP address or dynamic DNS
- Port forwarding (80, 443) configured on router

**Benefits**:
- No monthly hosting costs
- Faster response times for local users
- Full control over infrastructure
- Ability to work during internet outages

**Challenges**:
- Requires technical expertise to maintain
- Dependent on local network reliability
- Need backup power solution (UPS)
- Remote access requires VPN or public IP

### Hybrid Deployment (Recommended)

**Primary**: Local server for fast access and cost savings
**Failover**: Digital Ocean droplet for high availability

**Architecture**:
- Cloudflare Load Balancer monitors health of both servers
- Primary traffic routed to local server
- Health check endpoint (`/health`) polled every 30 seconds
- On local server failure, traffic automatically fails over to cloud
- Database replication keeps cloud copy up-to-date
- Manual or automatic failback when local server recovers

**Benefits**:
- Best of both worlds (cost + reliability)
- High availability with automatic failover
- Reduced cloud hosting costs (only failover traffic)
- Geographic redundancy

## Performance Goals

### Lighthouse Scores (Target)
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >95

### Load Time Goals
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

### Optimization Strategies
- Static generation for unchanged content
- Image optimization (WebP format, responsive sizes)
- Lazy loading for images and components
- Minimal JavaScript bundles with code splitting
- Efficient caching headers
- CDN integration (Cloudflare or CloudFront)
- Database query optimization
- Nginx compression (gzip/brotli)

## SEO Strategy

### On-Page SEO
- Semantic HTML markup
- Descriptive meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs to prevent duplicate content
- Structured data (JSON-LD) for rich snippets
- Alt text for all images
- Clean URL structure (no query parameters)

### Technical SEO
- XML sitemap generation (automatic via Astro)
- Robots.txt configuration
- 301 redirects from old WordPress URLs
- Mobile-responsive design (viewport meta tag)
- Fast page load times (Core Web Vitals)
- HTTPS everywhere (SSL certificates)
- Schema.org markup for organization, articles, events

### Content SEO
- Keyword research for ministry-related terms
- Long-form content for blog posts (1000+ words)
- Internal linking between related content
- Regular content updates to maintain freshness
- Geographic targeting for ministry locations
- Multilingual support (future - Spanish, Portuguese)

## Security Considerations

### Infrastructure Security
- Firewall configuration (UFW) limiting exposed ports
- SSL/TLS certificates (Let's Encrypt) for HTTPS
- Regular system updates (Ubuntu unattended-upgrades)
- Non-root user for application deployment
- SSH key-based authentication (disable password auth)
- Docker container isolation
- Nginx rate limiting to prevent DDoS

### Application Security
- Payload CMS authentication and authorization
- Role-based access control (Admin, Editor, Viewer)
- Secure password requirements
- Session management with httpOnly cookies
- CSRF protection
- Content Security Policy (CSP) headers
- Input validation and sanitization
- SQL/NoSQL injection prevention

### Data Security
- Database credentials stored in environment variables
- Secrets never committed to git (use .env)
- Regular database backups (automated daily)
- Backup encryption for sensitive data
- S3 bucket permissions (private with signed URLs)
- API rate limiting to prevent abuse

## Maintenance and Support

### Regular Maintenance Tasks

**Daily**:
- Monitor service health checks
- Review application logs for errors
- Check backup completion status

**Weekly**:
- Review content editor feedback
- Update content as needed
- Monitor website analytics
- Check SSL certificate expiration

**Monthly**:
- Apply system security patches
- Review and optimize database performance
- Update dependencies (npm packages)
- Test backup restoration process
- Review and analyze SEO metrics
- Content audit and cleanup

**Quarterly**:
- Major version updates (Astro, Payload, Node.js)
- Security audit and vulnerability scanning
- Performance testing and optimization
- User feedback review and prioritization
- Disaster recovery drill

### Support Resources

**Documentation**:
- Project README with setup instructions
- ARCHITECTURE.md for technical overview
- DIGITALOCEAN_SETUP.md for deployment guide
- Inline code comments for complex logic
- CMS user guide for content editors (to be created)

**External Resources**:
- [Astro Documentation](https://docs.astro.build/)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## Success Metrics

### Technical Metrics
- Page load time <2 seconds (90th percentile)
- Uptime >99.5% (excluding planned maintenance)
- Zero critical security vulnerabilities
- Lighthouse scores >90 across all metrics
- Mobile usability score 100/100

### User Experience Metrics
- Bounce rate <40%
- Average session duration >2 minutes
- Pages per session >2.5
- Contact form submission rate >5% of visitors
- Newsletter signup rate >3% of visitors

### Content Management Metrics
- Content editors can publish without technical assistance
- Average time to publish new content <10 minutes
- Image upload and optimization seamless
- Zero content publication errors
- Editor satisfaction score >8/10

### Business Metrics
- Donor conversion rate maintained or improved
- Volunteer application submissions increased
- Newsletter subscriber growth
- Event registration completions
- Social media engagement from shared content

## Conclusion

The Builders International website migration from WordPress to Astro + Payload CMS represents a strategic investment in modern web infrastructure that will serve the organization for years to come. By prioritizing performance, developer experience, and content management flexibility, this project positions Builders International to effectively communicate their mission and engage supporters in the digital age.

The phased migration approach allows for careful testing and validation at each stage, minimizing risk while delivering incremental value. With Phase 2.1 foundation complete and Phase 2.2 ready to begin, the project is on track for a successful production launch in Q2 2026.

For detailed technical information, see the Architecture documentation. For current project status and next steps, see the Repository Link and Next Steps documentation.
