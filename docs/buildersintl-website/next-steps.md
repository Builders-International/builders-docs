# Builders International Website - Next Steps

## Current Status Summary

**Phase:** 2.1 (Astro Frontend Foundation) - ~40% Complete
**Last Updated:** March 26, 2026
**Active Work:** Payload CMS integration and Docker deployment

### What's Complete
- ✅ Astro v6.0.8 project with SSR mode
- ✅ Content collections configured (pages, posts)
- ✅ Three layout templates (Base, Page, Post)
- ✅ Dynamic routing implemented
- ✅ Test content created (2 pages, 2 posts)
- ✅ Payload CMS configured with MongoDB
- ✅ Docker Compose stack configured
- ✅ Git repository with clean history

### What's In Progress
- 🚧 Payload CMS testing and validation
- 🚧 MongoDB setup and data modeling
- 🚧 Docker deployment verification
- 🚧 S3 media integration testing

### What's Blocked
- ⏸️ WordPress content extraction (S3 buckets mostly empty)
- ⏸️ Design recreation (waiting for extraction or manual process)

## Immediate Next Steps (This Week)

### Priority 1: Complete Phase 2.2 - Payload CMS + Docker

**Estimated Time:** 1-2 days

#### Task 1: Test Full Docker Stack
**Why:** Validate all services work together
```bash
cd ~/Developer/buildersintl-website

# Start Docker Desktop (if not running)
open -a Docker

# Build and start services
docker-compose build
docker-compose up -d

# Verify all services healthy
docker-compose ps

# Expected output:
# buildersintl-mongo     Up (healthy)
# buildersintl-payload   Up
# buildersintl-frontend  Up
# buildersintl-nginx     Up (healthy)

# Check logs for errors
docker-compose logs -f
```

**Success Criteria:**
- All 4 containers running
- No error messages in logs
- Health checks passing
- Nginx accessible on port 80

#### Task 2: Access Payload Admin and Create First User
**Why:** Validate CMS is functioning correctly
```bash
# Verify Payload is accessible
curl http://localhost/admin

# Open in browser
open http://localhost/admin
```

**Steps:**
1. Navigate to http://localhost/admin
2. Click "Create your first user"
3. Fill in form:
   - Email: your@email.com
   - Name: Your Name
   - Password: Secure password (12+ chars)
   - Role: Admin
4. Click "Create"
5. Verify login successful

**Success Criteria:**
- Registration form loads
- User created successfully
- Can log into admin panel
- Admin dashboard displays correctly

#### Task 3: Create Test Content in CMS
**Why:** Validate content creation workflow

**Create a Page:**
1. In Payload admin, go to Collections → Pages
2. Click "Create New"
3. Fill in:
   - Title: "Welcome"
   - Slug: "welcome"
   - Content: "Welcome to Builders International. This is test content."
   - Status: Published
4. Save

**Create a Blog Post:**
1. Go to Collections → Posts
2. Click "Create New"
3. Fill in:
   - Title: "First Post"
   - Slug: "first-post"
   - Author: (select yourself)
   - Content: "This is our first blog post."
   - Categories: "Updates"
   - Status: Published
   - Published Date: Today
4. Save

**Upload Media:**
1. Go to Collections → Media
2. Click "Upload"
3. Select test image
4. Fill in:
   - Alt text: "Test image"
   - Caption: "This is a test"
5. Save

**Success Criteria:**
- Page created and saved
- Post created and saved
- Media uploaded to S3
- No errors in console

#### Task 4: Verify Frontend Displays CMS Content
**Why:** Validate Astro → Payload integration

```bash
# Test API endpoints
curl http://localhost/api/pages
curl http://localhost/api/posts

# Open frontend
open http://localhost/
```

**Check:**
- Homepage loads
- Navigate to /welcome (page created in CMS)
- Navigate to /blog (should list posts)
- Navigate to /blog/first-post (individual post)
- Images load from S3

**Success Criteria:**
- All pages load without errors
- Content from Payload displays correctly
- Images render properly
- No console errors

### Priority 2: Design Recreation Strategy

**Estimated Time:** 2-3 days

#### Option A: Extract from Live WordPress Site
**Pros:** Get actual production styles
**Cons:** Requires careful extraction

**Steps:**
1. **Visit current site:** https://buildersintl.org
2. **Use browser DevTools:**
   - Inspect elements
   - Copy computed styles
   - Screenshot each page type
3. **Extract CSS:**
   - Right-click → View Page Source
   - Find `<style>` tags or `<link>` to CSS files
   - Save CSS files
4. **Save to project:**
```bash
mkdir -p ~/Developer/buildersintl-website/frontend/src/styles/wordpress
cd ~/Developer/buildersintl-website/frontend/src/styles/wordpress
# Save extracted CSS files here
```

#### Option B: httrack Full Site Download
**Pros:** Automated, complete
**Cons:** Large download, needs cleanup

```bash
# Install httrack
brew install httrack

# Download site
cd ~/Desktop
httrack https://buildersintl.org -O buildersintl-wordpress

# Extract CSS and images
cp buildersintl-wordpress/*.css ~/Developer/buildersintl-website/frontend/src/styles/wordpress/
cp -r buildersintl-wordpress/images ~/Developer/buildersintl-website/frontend/public/
```

#### Option C: Manual Recreation
**Pros:** Clean, modern code
**Cons:** Time-consuming

**Process:**
1. Screenshot every page type from buildersintl.org
2. Save to project docs
3. Recreate in Astro components with modern CSS
4. Compare side-by-side for accuracy

**Recommended:** Option A or C (B is heavy)

#### Task 5: Build Component Library
**Why:** Reusable, maintainable components

**Components to Create:**
```
frontend/src/components/
├── Header.astro          # Main navigation, logo
├── Footer.astro          # Footer links, copyright
├── Navigation.astro      # Nav menu
├── Hero.astro            # Homepage hero section
├── Card.astro            # Blog post cards
├── Button.astro          # CTA buttons
├── Form.astro            # Contact forms
├── Image.astro           # Optimized images
└── SEO.astro             # Meta tags
```

**Steps:**
1. Create component files
2. Extract styles from WordPress
3. Convert to Astro components
4. Import in layouts
5. Test on all pages

**Success Criteria:**
- All components created
- Styles match WordPress design
- Reusable across pages
- No code duplication

## Short-Term Goals (Next 1-2 Weeks)

### Goal 1: Complete Phase 2.2 (100%)

**Remaining Tasks:**
- ✅ Docker stack operational
- ✅ Payload CMS tested
- ✅ Test content created
- ✅ Frontend integration verified
- ⏳ Design components built
- ⏳ CSS recreation complete
- ⏳ Responsive layouts tested
- ⏳ Admin user training materials

**Deliverables:**
- Fully functional CMS
- Working Docker deployment
- Basic component library
- Design that matches WordPress

### Goal 2: Content Strategy Decision

**Option A: Fix WordPress Extraction**
```bash
# Return to extraction tool
cd ~/Developer/Builders-Website

# Debug S3 upload issues
npm run extract
npm run upload-to-s3

# Verify uploads
aws s3 ls s3://builders-website-content/
aws s3 ls s3://builders-website-media/
```

**Option B: Create Content Fresh in Payload**
- Create 5-10 key pages manually
- Import blog posts via CSV (if available)
- Upload media directly to S3 via CMS
- Build out content incrementally

**Option C: Hybrid Approach**
- Create critical pages manually (About, Contact, Ministries)
- Fix extraction for blog posts
- Manually upload featured media

**Recommended:** Option B or C (most pragmatic)

### Goal 3: Performance Baseline

**Tasks:**
1. **Run Lighthouse on Test Pages:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run on homepage
lighthouse http://localhost/ --view

# Run on blog post
lighthouse http://localhost/blog/first-post --view
```

2. **Record Baseline Scores:**
   - Performance: ___/100
   - Accessibility: ___/100
   - Best Practices: ___/100
   - SEO: ___/100

3. **Identify Quick Wins:**
   - Image optimization
   - Font loading
   - Unused CSS removal
   - Caching headers

**Target:** >80 on all metrics (aim for >90 before production)

### Goal 4: Documentation Update

**Tasks:**
1. Update STATUS.md with current progress
2. Document any architecture changes
3. Create CMS user guide (for content editors)
4. Update README with Docker instructions
5. Git commit all documentation changes

## Medium-Term Goals (Next 1-2 Months)

### Phase 2.3: Cloud Failover Setup

**Estimated Time:** 1 week

**Tasks:**

#### 1. Deploy to Digital Ocean
```bash
# Create droplet (see DIGITALOCEAN_SETUP.md)
doctl compute droplet create buildersintl-prod \
  --region sfo3 \
  --size s-2vcpu-4gb \
  --image ubuntu-24-04-x64 \
  --ssh-keys $(doctl compute ssh-key list --format ID --no-header)

# Get IP
DROPLET_IP=$(doctl compute droplet list buildersintl-prod --format PublicIPv4 --no-header)
echo $DROPLET_IP
```

#### 2. Configure Server
```bash
# SSH into droplet
ssh root@$DROPLET_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt install -y docker-compose-plugin

# Clone repository
cd /opt
git clone https://github.com/Builders-International/BuildersIntl-Website.git

# Configure .env
cd BuildersIntl-Website
cp .env.example .env
nano .env  # Fill in production secrets

# Start services
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost/health
```

#### 3. Set Up Database Replication
```bash
# Configure MongoDB replica set
# Primary: Local MongoDB
# Secondary: Cloud MongoDB

# Documentation: https://docs.mongodb.com/manual/replication/
```

#### 4. Configure Cloudflare Load Balancer
**Steps:**
1. Log into Cloudflare
2. Go to Traffic → Load Balancing
3. Create Load Balancer:
   - Name: builders-intl-lb
   - Hostname: buildersintl.org
4. Add Origin Pools:
   - Primary Pool: Local server IP
   - Failover Pool: Digital Ocean IP
5. Configure Health Checks:
   - Path: /health
   - Interval: 30 seconds
   - Timeout: 5 seconds
   - Retries: 3
6. Set Failover Rules:
   - Primary fails → Route to failover
   - Primary recovers → Route back to primary (manual or automatic)

#### 5. Test Failover
```bash
# Stop local services (simulate failure)
docker-compose down

# Wait 2-3 minutes for health checks to fail

# Verify traffic routes to cloud
curl https://buildersintl.org/health
# Should still return OK from cloud

# Restart local services
docker-compose up -d

# Wait for health checks to pass

# Verify traffic routes back to local (if automatic)
```

**Success Criteria:**
- Cloud server deployed and operational
- Database replication working
- Cloudflare Load Balancer configured
- Failover tested successfully
- Failback working (manual or automatic)

### Phase 2.4: Production Launch Preparation

**Estimated Time:** 2-3 weeks

**Pre-Launch Checklist:**

#### Design & UX
- [ ] Pixel-perfect match with WordPress design
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] All links working (internal and external)
- [ ] Forms functional (contact, newsletter)
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Fonts loading correctly
- [ ] Color scheme consistent
- [ ] Accessibility: keyboard navigation, ARIA labels

#### Content
- [ ] All critical pages created (About, Contact, Ministries, etc.)
- [ ] Blog posts migrated or created
- [ ] Media library populated
- [ ] Meta descriptions written
- [ ] Featured images set
- [ ] Author profiles complete
- [ ] Legal pages (Privacy Policy, Terms of Use)

#### Performance
- [ ] Lighthouse Performance >90
- [ ] Lighthouse Accessibility >90
- [ ] Lighthouse Best Practices >90
- [ ] Lighthouse SEO >90
- [ ] Core Web Vitals passing:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] Page load time < 2 seconds
- [ ] Images compressed and optimized
- [ ] Caching headers configured
- [ ] CDN integrated (Cloudflare or CloudFront)

#### SEO
- [ ] XML sitemap generated (automatic via Astro)
- [ ] Robots.txt configured
- [ ] Meta titles optimized (50-60 chars)
- [ ] Meta descriptions optimized (150-160 chars)
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card metadata
- [ ] Canonical URLs set
- [ ] Structured data (JSON-LD):
  - Organization
  - Article (blog posts)
  - Event (future)
- [ ] 301 redirects from old WordPress URLs
- [ ] Google Search Console configured
- [ ] Google Analytics 4 integrated

#### Security
- [ ] SSL certificates installed (Let's Encrypt)
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] HSTS header enabled
- [ ] Firewall configured (UFW):
  - Allow: 22 (SSH), 80 (HTTP), 443 (HTTPS)
  - Deny: All others
- [ ] Secrets in environment variables (not hardcoded)
- [ ] .env files in .gitignore
- [ ] Strong passwords for all accounts
- [ ] SSH key-based authentication
- [ ] Regular security updates scheduled
- [ ] Content Security Policy (CSP) headers
- [ ] Rate limiting configured (Nginx)

#### Infrastructure
- [ ] Production MongoDB database created
- [ ] Database backups configured (daily)
- [ ] Backup restoration tested
- [ ] Docker images built and tested
- [ ] Docker Compose configured for production
- [ ] Environment variables set correctly
- [ ] Health check endpoints working
- [ ] Monitoring configured (uptime, performance)
- [ ] Alerting set up (email/SMS for downtime)
- [ ] Logging configured (centralized)

#### Testing
- [ ] Manual QA on all pages
- [ ] Cross-browser testing:
  - Chrome
  - Firefox
  - Safari
  - Edge
- [ ] Mobile testing:
  - iOS Safari
  - Android Chrome
- [ ] Form submissions tested
- [ ] API endpoints tested
- [ ] Admin panel tested
- [ ] User authentication tested
- [ ] Media uploads tested
- [ ] Database operations tested
- [ ] Backup/restore tested
- [ ] Failover tested

#### Documentation
- [ ] README updated with production info
- [ ] Architecture docs finalized
- [ ] Deployment guide written
- [ ] CMS user manual created
- [ ] Admin procedures documented
- [ ] Backup/restore procedures documented
- [ ] Disaster recovery plan written
- [ ] Support contact information updated

#### Training
- [ ] CMS training for content editors (video + written guide)
- [ ] Admin panel walkthrough
- [ ] Content publishing workflow
- [ ] Media management tutorial
- [ ] Troubleshooting common issues

#### DNS & Launch
- [ ] DNS records prepared (A, CNAME, MX)
- [ ] TTL lowered 24 hours before launch (for faster propagation)
- [ ] Cloudflare DNS configured
- [ ] Email not disrupted (MX records correct)
- [ ] SSL certificates valid for new domain
- [ ] Launch date/time scheduled
- [ ] Rollback plan prepared
- [ ] Team notified of launch
- [ ] Stakeholders notified

## Long-Term Roadmap (Next 3-12 Months)

### Q2 2026: Production Launch & Stabilization

**April:**
- Complete Phase 2.4 pre-launch tasks
- Final QA and testing
- User training sessions
- Launch preparation

**May:**
- Production launch
- Monitor for issues
- Quick bug fixes
- Content editor onboarding

**June:**
- Stabilization period
- Performance optimization
- User feedback incorporation
- Post-launch review

### Q3 2026: Feature Enhancements

**July-September:**
- Search functionality (Algolia or Meilisearch)
- Newsletter integration (Mailchimp or ConvertKit)
- Event calendar with registration
- Donation integration (Stripe or Donorbox)
- Advanced analytics dashboard
- Content workflow improvements (draft/review/publish)
- Multi-language support (Spanish, Portuguese)

### Q4 2026: Scale & Optimize

**October-December:**
- CDN optimization (CloudFront)
- Database performance tuning
- Caching strategy refinement
- Mobile app exploration (React Native/Flutter)
- CRM integration (Salesforce, HubSpot)
- Video hosting integration (Vimeo, YouTube)
- Podcast RSS feed generation

## Known Issues & Technical Debt

### Current Issues

#### 1. WordPress Extraction Incomplete
**Issue:** S3 buckets mostly empty, content not migrated
**Impact:** Cannot automatically import old content
**Workaround:** Create content fresh in Payload CMS
**Resolution:** Debug extraction pipeline or manually migrate critical content
**Priority:** Medium (not blocking current progress)

#### 2. Design Not Yet Recreated
**Issue:** Current Astro frontend has basic styling only
**Impact:** Does not match production WordPress site
**Workaround:** Use test pages for functionality testing
**Resolution:** Extract CSS from WordPress, build component library
**Priority:** High (required for production launch)

#### 3. No Production SSL Certificates
**Issue:** Development using HTTP only
**Impact:** Cannot test HTTPS, SSL configurations
**Workaround:** Use Let's Encrypt on production deployment
**Resolution:** Install certbot, configure Nginx for SSL
**Priority:** High (required before launch)

### Technical Debt

#### 1. Content Collections (Legacy)
**Debt:** Astro content collections still in use (Markdown files)
**Plan:** Remove once fully migrated to Payload CMS API
**Effort:** Low (delete files, update routing)
**Timeline:** After Payload CMS fully tested

#### 2. No Test Suite
**Debt:** No automated tests for frontend or backend
**Plan:** Add unit tests (Jest), integration tests (Playwright)
**Effort:** Medium (set up testing framework)
**Timeline:** Q3 2026

#### 3. Hard-Coded Content
**Debt:** Some content still hard-coded in Astro layouts
**Plan:** Move all content to CMS (including nav menus, footer)
**Effort:** Low (create CMS collections for menus)
**Timeline:** Q2 2026

#### 4. No Monitoring/Alerting
**Debt:** Basic health checks only, no comprehensive monitoring
**Plan:** Set up Prometheus + Grafana, configure alerts
**Effort:** Medium (install and configure)
**Timeline:** Q3 2026

## Risks & Mitigation

### Risk 1: Content Migration Delays
**Risk:** WordPress extraction takes longer than expected
**Impact:** Launch delay, manual content creation needed
**Probability:** Medium
**Mitigation:**
- Prioritize manual creation of critical pages
- Fix extraction pipeline incrementally
- Accept partial migration for launch

### Risk 2: Design Recreation Complexity
**Risk:** WordPress/Divi design difficult to recreate in Astro
**Impact:** Launch delay, potential redesign needed
**Probability:** Low-Medium
**Mitigation:**
- Extract CSS systematically
- Break design into small components
- Accept minor deviations if necessary
- Consider professional design help

### Risk 3: Performance Issues
**Risk:** SSR mode slower than expected, database queries inefficient
**Impact:** Poor user experience, SEO penalties
**Probability:** Low
**Mitigation:**
- Benchmark early and often
- Implement caching aggressively
- Optimize database queries
- Use CDN for static assets

### Risk 4: Failover Complexity
**Risk:** Database replication or load balancer difficult to configure
**Impact:** No automatic failover, single point of failure
**Probability:** Medium
**Mitigation:**
- Thorough testing in staging
- Document procedures clearly
- Have manual failover plan
- Consider managed database (MongoDB Atlas)

### Risk 5: Learning Curve for Content Editors
**Risk:** Payload CMS unfamiliar, training takes time
**Impact:** Slow content updates, errors
**Probability:** Low
**Mitigation:**
- Create comprehensive user guide
- Record video tutorials
- Hands-on training sessions
- Quick reference cards

## Success Metrics

### Technical Metrics
- [ ] Lighthouse Performance > 90
- [ ] Page load time < 2 seconds
- [ ] Uptime > 99.5%
- [ ] Zero critical security vulnerabilities
- [ ] All pages mobile-responsive
- [ ] API response time < 200ms

### Content Metrics
- [ ] All critical pages migrated
- [ ] 50+ blog posts published
- [ ] Media library > 100 images
- [ ] Content editors can publish without dev help
- [ ] Average content publish time < 10 minutes

### Business Metrics
- [ ] Site traffic maintained or increased
- [ ] Bounce rate < 40%
- [ ] Donor conversion rate maintained
- [ ] Contact form submissions increased
- [ ] Newsletter signups increased

### User Experience Metrics
- [ ] Content editor satisfaction > 8/10
- [ ] No critical bugs reported in first month
- [ ] Positive feedback from stakeholders
- [ ] Mobile usage increased

## Resource Requirements

### Development Resources
- **Developer Time:** 40-60 hours to complete Phase 2.2-2.4
- **Design Time:** 10-20 hours for component library
- **QA Time:** 10-15 hours for testing
- **Content Time:** 20-40 hours for content creation

### Infrastructure Resources
- **Local Server:** Synology NAS or dedicated server (4GB RAM, 20GB storage)
- **Cloud Server:** Digital Ocean droplet ($24/month)
- **AWS S3:** ~$5-10/month for media storage
- **Cloudflare:** Free plan (or paid for advanced features)
- **Domain:** buildersintl.org (existing)

### Tools & Services
- **Development:** VS Code, Node.js, Docker Desktop, Git
- **Deployment:** Docker, Docker Compose, Nginx
- **Monitoring:** Docker health checks, Cloudflare (future: Prometheus, Grafana)
- **Analytics:** Google Analytics 4 (future)
- **Backups:** Automated scripts, S3 storage

## Questions & Decisions Needed

### Open Questions

1. **Content Strategy:**
   - Should we fix WordPress extraction or create content fresh?
   - How many pages are critical for launch?
   - Who will create/migrate content?

2. **Design Approach:**
   - Exact match to WordPress or modernize?
   - Keep Divi design or simplify?
   - Mobile-first or desktop-first?

3. **Launch Timeline:**
   - Target launch date?
   - Soft launch or full launch?
   - Press release or quiet launch?

4. **Failover Strategy:**
   - Automatic failover or manual?
   - Bidirectional sync or one-way?
   - How often test failover?

5. **Post-Launch Support:**
   - Who handles content updates?
   - Who handles technical issues?
   - What's the on-call strategy?

### Decisions to Make

**Decision 1: MongoDB vs PostgreSQL**
- **Status:** Decided - MongoDB
- **Rationale:** Better Payload CMS v2 support
- **Date:** March 2026

**Decision 2: Local + Cloud vs Cloud Only**
- **Status:** Decided - Local + Cloud (hybrid)
- **Rationale:** Cost savings + high availability
- **Date:** March 2026

**Decision 3: Astro SSR vs SSG**
- **Status:** Decided - SSR
- **Rationale:** Dynamic content from CMS
- **Date:** March 2026

**Decision 4: Content Strategy (Pending)**
- **Options:** Fix extraction vs Create fresh vs Hybrid
- **Recommendation:** Create fresh (most pragmatic)
- **Decision Needed By:** End of March 2026

**Decision 5: Launch Date (Pending)**
- **Options:** Q2 2026 vs Q3 2026
- **Recommendation:** Late Q2 2026 (May/June)
- **Decision Needed By:** Mid-April 2026

## Action Items Summary

### This Week
1. [ ] Test full Docker stack locally
2. [ ] Create first Payload admin user
3. [ ] Create test content (pages, posts, media)
4. [ ] Verify frontend displays CMS content
5. [ ] Start design extraction from WordPress

### Next Week
6. [ ] Build component library (Header, Footer, Card, etc.)
7. [ ] Recreate homepage design
8. [ ] Test responsive layouts
9. [ ] Run Lighthouse baseline
10. [ ] Decide on content strategy

### This Month
11. [ ] Complete Phase 2.2 (Payload CMS + Docker)
12. [ ] Migrate or create 10+ critical pages
13. [ ] Build and test component library
14. [ ] Performance optimization pass
15. [ ] Update all documentation

### Next Month
16. [ ] Deploy to Digital Ocean (staging)
17. [ ] Configure database replication
18. [ ] Set up Cloudflare Load Balancer
19. [ ] Test failover scenarios
20. [ ] Plan production launch

## Conclusion

The Builders International website migration is progressing well with Phase 2.1 ~40% complete and Phase 2.2 ready to begin. The immediate focus is on completing the Payload CMS + Docker stack, testing thoroughly, and making key decisions about content strategy and design recreation.

With clear priorities, realistic timelines, and proper risk mitigation, the project is on track for a successful production launch in Q2 2026. The phased approach allows for incremental progress and validation while minimizing risk.

Key to success will be:
- Completing Docker deployment testing (this week)
- Making content strategy decision (this month)
- Systematic design recreation (this month)
- Thorough testing before launch (next month)
- Clear communication with stakeholders throughout

For technical details, see the Architecture documentation. For repository access and commands, see the Repository Link documentation. For project context, see the Overview documentation.
