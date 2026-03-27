# Builders International Website - Repository Link

## Repository Information

### Primary Repository
- **Name:** BuildersIntl-Website
- **Location:** `~/Developer/buildersintl-website`
- **GitHub URL:** https://github.com/Builders-International/BuildersIntl-Website
- **Visibility:** Private
- **Primary Branch:** master
- **License:** MIT

### Local Path
```bash
/Users/elliottgodwin/Developer/buildersintl-website
```

### Quick Access
```bash
# Navigate to repository
cd ~/Developer/buildersintl-website

# Open in VS Code
code ~/Developer/buildersintl-website

# View recent commits
cd ~/Developer/buildersintl-website && git log --oneline -10
```

## Repository Structure

```
buildersintl-website/
├── frontend/              # Astro SSR application
├── payload/               # Payload CMS backend
├── nginx/                 # Nginx configuration
├── scripts/               # Utility scripts
├── docs/                  # Project documentation
├── docker-compose.yml     # Full stack orchestration
├── package.json           # Root package
├── .env.example           # Environment template
└── README.md              # Project overview
```

## Git Information

### Recent Commits
```
71d9ef3 docs: add infrastructure foundation design specification
0ab524e docs: add infrastructure standards
dbe9805 docs: update scope with deployment status
7c2bf24 docs: add comprehensive project scope document
069b19d fix: add retry mechanism to wait for Payload to be ready
4acc6cf fix: include author field in post imports
1214e23 fix: add authentication to import script
5676f93 feat: simpler HTTP-based import script (no module issues)
b9b824f revert: restore working payload config with buildConfig
9052fdd fix: add verbose logging and error handlers to import script
```

### Current Status
- **Branch:** master
- **Status:** Clean working directory (as of last check)
- **Commits:** 10+ commits
- **Contributors:** Primary developer

### Branching Strategy
- **master** - Main development branch (current)
- **Feature branches** - For new features (as needed)
- **No production branch yet** - Will be created for production deployment

## Project Documentation

### In-Repository Documentation

Located in the repository at various locations:

1. **README.md** - Project overview and quick start
2. **ARCHITECTURE.md** - Technical architecture details
3. **STATUS.md** - Current project status snapshot
4. **NEXT_STEPS.md** - Immediate next actions
5. **DIGITALOCEAN_SETUP.md** - Cloud deployment guide
6. **PHASE_2_1_STATUS.md** - Phase 2.1 detailed progress
7. **PHASE_2_2_STATUS.md** - Phase 2.2 detailed progress
8. **QUICK_START_DO.md** - Quick start on Digital Ocean
9. **SUMMARY_2026-03-24.md** - Daily project summary
10. **DISK_SPACE.md** - Disk space analysis

### External Documentation
- This documentation set (builders-docs repository)
- Builders-docs location: `~/Developer/builders-docs/docs/buildersintl-website/`

## Team and Contributors

### Primary Developer
- Active development and architecture decisions
- Git commit author: Development team
- Responsible for all phases of migration

### Contributors (Future)
- Content editors - Once CMS is deployed
- Additional developers - As team grows
- DevOps engineers - For production deployment

### Roles and Access

**Admin Level:**
- Full repository access
- Deploy to production
- Manage secrets and environment variables
- Database access

**Developer Level:**
- Clone and fork repository
- Create feature branches
- Submit pull requests
- Deploy to staging

**Content Editor Level:**
- Access to Payload CMS admin (/admin)
- Create and edit content
- Upload media
- No code access

## Development Environment

### Prerequisites
- **Node.js:** >= 22.12.0
- **npm:** Latest version
- **Docker:** Desktop (for local) or Engine (for production)
- **Docker Compose:** v2+
- **Git:** Latest version
- **Code Editor:** VS Code recommended

### Environment Setup

1. **Clone Repository:**
```bash
git clone https://github.com/Builders-International/BuildersIntl-Website.git
cd BuildersIntl-Website
```

2. **Install Dependencies:**
```bash
# Frontend dependencies
cd frontend
npm install

# Payload dependencies
cd ../payload
npm install
```

3. **Configure Environment:**
```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

4. **Start Development:**

**Option A: Local Development (no Docker)**
```bash
# Terminal 1: Start Payload CMS
cd payload
npm run dev

# Terminal 2: Start Astro frontend
cd frontend
npm run dev
```

**Option B: Docker Development**
```bash
# Start full stack
docker-compose up -d

# View logs
docker-compose logs -f
```

### Environment Variables

Required in `.env` file:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-west-2
S3_CONTENT_BUCKET=builders-website-content
S3_MEDIA_BUCKET=builders-website-media

# Payload CMS Configuration
PAYLOAD_SECRET=generate_with_openssl_rand_base64_32
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# MongoDB Configuration
MONGO_USER=buildersintl
MONGO_PASSWORD=generate_secure_password
MONGO_DB=buildersintl
DATABASE_URI=mongodb://buildersintl:password@mongo:27017/buildersintl?authSource=admin

# Site Configuration
SITE_URL=http://localhost

# Environment
NODE_ENV=development
```

### Generating Secrets

```bash
# Generate Payload secret
openssl rand -base64 32

# Generate MongoDB password
openssl rand -base64 24
```

## Deployment Information

### Development Deployment
- **Location:** Local machine
- **URL:** http://localhost
- **Payload Admin:** http://localhost/admin
- **Frontend:** http://localhost/
- **API:** http://localhost/api

### Staging Deployment (Future)
- **Location:** Digital Ocean droplet (to be created)
- **URL:** http://staging.buildersintl.org
- **Purpose:** Testing before production
- **Access:** Team only (basic auth)

### Production Deployment (Future)

**Primary (Local):**
- **Location:** Synology NAS or local server
- **URL:** https://buildersintl.org
- **Purpose:** Primary production site
- **Backup:** Real-time to cloud

**Failover (Cloud):**
- **Location:** Digital Ocean droplet
- **URL:** https://buildersintl.org (same, via Cloudflare)
- **Purpose:** Automatic failover
- **Sync:** Database replication from primary

### Deployment Access

**SSH Access (Cloud):**
```bash
# Digital Ocean droplet (when created)
ssh root@droplet_ip_address

# With SSH key
ssh -i ~/.ssh/builders_rsa root@droplet_ip_address
```

**Docker Access:**
```bash
# View running containers
docker ps

# Access logs
docker-compose logs -f

# Restart services
docker-compose restart

# Full restart
docker-compose down && docker-compose up -d
```

**Database Access:**
```bash
# MongoDB CLI
docker exec -it buildersintl-mongo mongosh -u buildersintl -p password

# Backup database
docker exec buildersintl-mongo mongodump \
  --uri="mongodb://buildersintl:password@localhost:27017/buildersintl" \
  --out=/backup/$(date +%Y%m%d)
```

## CMS Access

### Payload CMS Admin Panel

**Development:**
- URL: http://localhost/admin
- Default Port (if not using Docker): http://localhost:3000/admin

**Production (Future):**
- URL: https://buildersintl.org/admin

### Admin User Accounts

**Initial Setup:**
1. Navigate to `/admin` on first deployment
2. Click "Create your first user"
3. Fill in:
   - Email: admin email
   - Name: Full name
   - Password: Secure password (12+ characters)
   - Role: Admin
4. Save and log in

**User Roles:**
- **Admin** - Full access (create users, manage settings, all content)
- **Editor** - Create and publish content (pages, posts, media)
- **Viewer** - Read-only access (view content, no editing)

### API Access

**REST API:**
```bash
# Get all pages
curl http://localhost/api/pages

# Get single page by slug
curl http://localhost/api/pages?where[slug][equals]=about

# Get all posts
curl http://localhost/api/posts

# Get published posts only
curl http://localhost/api/posts?where[status][equals]=published
```

**GraphQL API (Future):**
```graphql
query {
  Pages {
    docs {
      title
      slug
      content
    }
  }
}
```

## Development Workflow

### Feature Development

1. **Create Feature Branch:**
```bash
git checkout -b feature/new-component
```

2. **Make Changes:**
```bash
# Edit files
# Test locally
npm run dev
```

3. **Commit Changes:**
```bash
git add .
git commit -m "feat: add new component

- Description of changes
- Why the changes were made

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

4. **Push Branch:**
```bash
git push origin feature/new-component
```

5. **Create Pull Request:**
- Go to GitHub
- Create PR from feature branch to master
- Request review
- Merge when approved

### Deployment Workflow

**Local/Development:**
```bash
# Pull latest changes
git pull origin master

# Restart Docker services
docker-compose down
docker-compose up -d --build
```

**Production (Future):**
```bash
# SSH into server
ssh root@production_server

# Navigate to repo
cd /opt/buildersintl-website

# Pull latest
git pull origin master

# Rebuild and restart
docker-compose build
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost/health
```

### Content Publishing Workflow

1. **Log into Payload Admin** - http://localhost/admin
2. **Create Content:**
   - Navigate to Pages or Posts collection
   - Click "Create New"
   - Fill in all fields
   - Upload featured image (if applicable)
   - Set status to "Draft"
   - Save
3. **Review and Edit:**
   - Preview content
   - Make edits as needed
   - Save draft
4. **Publish:**
   - Change status to "Published"
   - Set publish date
   - Save
5. **Verify:**
   - Visit frontend URL
   - Confirm content appears correctly

## Troubleshooting

### Common Issues

**Issue: Cannot clone repository**
```bash
# Check SSH keys
ssh -T git@github.com

# Or use HTTPS
git clone https://github.com/Builders-International/BuildersIntl-Website.git
```

**Issue: Docker services won't start**
```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart Docker Desktop (Mac)
open -a Docker

# Clean and restart
docker-compose down
docker-compose up -d --build
```

**Issue: Port conflicts**
```bash
# Check what's using port
lsof -i :80
lsof -i :443
lsof -i :3000

# Kill process or change ports in docker-compose.yml
```

**Issue: MongoDB connection failed**
```bash
# Check MongoDB is running
docker-compose ps mongo

# View MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

**Issue: Cannot access Payload admin**
```bash
# Check Payload is running
docker-compose ps payload

# View Payload logs
docker-compose logs payload

# Restart Payload
docker-compose restart payload
```

**Issue: Environment variables not loading**
```bash
# Verify .env file exists
ls -la .env

# Check .env syntax (no spaces around =)
cat .env

# Restart services to reload env
docker-compose down
docker-compose up -d
```

### Getting Help

**Documentation:**
- Check in-repository docs (ARCHITECTURE.md, STATUS.md, etc.)
- Review this documentation (builders-docs)
- Check official docs (Astro, Payload, Docker)

**Contact:**
- Open GitHub issue
- Contact development team
- Slack channel (if applicable)

## Useful Commands Reference

### Git Commands
```bash
# Status and changes
git status
git log --oneline -10
git diff

# Branch management
git branch
git checkout -b feature/new-feature
git checkout master

# Sync with remote
git pull origin master
git push origin branch-name

# Undo changes
git reset --hard origin/master  # CAREFUL: destroys local changes
git checkout -- filename         # Undo changes to file
```

### Docker Commands
```bash
# Container management
docker ps                        # List running containers
docker ps -a                     # List all containers
docker-compose up -d             # Start services
docker-compose down              # Stop services
docker-compose restart           # Restart all
docker-compose restart payload   # Restart specific service

# Logs and debugging
docker-compose logs -f           # Follow all logs
docker-compose logs payload      # View specific service
docker exec -it container bash   # Access container shell

# Cleanup
docker system prune              # Remove unused data
docker-compose down -v           # Remove volumes too
```

### Node/npm Commands
```bash
# Install dependencies
npm install                      # Install from package.json
npm ci                          # Clean install (faster)

# Development
npm run dev                     # Start dev server
npm run build                   # Build for production
npm run preview                 # Preview production build

# Maintenance
npm outdated                    # Check for updates
npm update                      # Update dependencies
npm audit                       # Check for vulnerabilities
```

### MongoDB Commands
```bash
# Access MongoDB shell
docker exec -it buildersintl-mongo mongosh -u buildersintl -p password

# Inside mongosh:
show dbs                        # List databases
use buildersintl                # Switch to database
show collections                # List collections
db.pages.find()                 # Query pages collection
db.posts.countDocuments()       # Count posts
exit                            # Exit shell

# Backup
docker exec buildersintl-mongo mongodump \
  --uri="mongodb://buildersintl:password@localhost:27017/buildersintl" \
  --out=/backup/$(date +%Y%m%d)

# Restore
docker exec -i buildersintl-mongo mongorestore \
  --uri="mongodb://buildersintl:password@localhost:27017/buildersintl" \
  /backup/20260324
```

## Related Repositories

### Builders-Website (Extraction Tool)
- **Location:** `~/Developer/Builders-Website/`
- **Purpose:** WordPress content extraction (Phase 1)
- **Status:** On hold - extraction incomplete
- **Relationship:** Separate tool for migrating WordPress content to S3

### builders-docs (Documentation)
- **Location:** `~/Developer/builders-docs/`
- **Purpose:** Centralized documentation for all Builders projects
- **Status:** Active
- **Relationship:** This documentation is part of builders-docs

### Future Repositories (Potential)
- **buildersintl-mobile** - Mobile app (React Native/Flutter)
- **buildersintl-analytics** - Custom analytics dashboard
- **buildersintl-newsletter** - Email newsletter system

## Backup and Recovery

### Repository Backups
- **GitHub:** Automatic cloud backup
- **Local:** Cloned to development machines
- **Server:** Deployed to production servers

### Data Backups
- **MongoDB:** Daily automated backups
- **S3 Media:** Versioning enabled
- **Environment Files:** Encrypted and stored securely

### Recovery Procedures

**Scenario: Lost local repository**
```bash
# Clone fresh copy
cd ~/Developer
git clone https://github.com/Builders-International/BuildersIntl-Website.git buildersintl-website
cd buildersintl-website

# Restore .env from secure backup
# Install dependencies
cd frontend && npm install
cd ../payload && npm install
```

**Scenario: Production server failure**
1. Cloudflare automatically fails over to cloud server
2. Cloud server handles all traffic
3. Restore local server from backups
4. Sync database from cloud to local
5. Verify local server health
6. Failback to local when ready

## Security Notes

### SSH Keys
- Store SSH keys securely (~/.ssh/)
- Never commit SSH keys to repository
- Use separate keys for different environments

### Environment Files
- Never commit .env files to git
- .env files are gitignored
- Store .env backups encrypted
- Rotate secrets regularly (quarterly)

### Access Control
- Limit admin access to trusted team members
- Use strong passwords (12+ characters, complexity)
- Enable 2FA for GitHub and critical services (future)
- Review access logs regularly

### Secret Management
- Use environment variables for all secrets
- Generate strong secrets with cryptographic tools
- Different secrets for dev/staging/prod
- Document where secrets are stored (secure password manager)

## Maintenance Schedule

### Daily
- Monitor service health
- Review application logs
- Verify backups completed

### Weekly
- Check for security updates
- Review open issues/PRs
- Update dependencies (if needed)

### Monthly
- Apply security patches
- Review performance metrics
- Test backup restoration
- Update documentation

### Quarterly
- Major version updates
- Security audit
- Performance optimization
- Disaster recovery drill

## Additional Resources

### Official Documentation
- **Astro:** https://docs.astro.build/
- **Payload CMS:** https://payloadcms.com/docs
- **MongoDB:** https://docs.mongodb.com/
- **Docker:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **Nginx:** https://nginx.org/en/docs/

### Learning Resources
- **Astro Tutorial:** https://docs.astro.build/en/tutorial/0-introduction/
- **Payload Examples:** https://github.com/payloadcms/payload/tree/main/examples
- **MongoDB University:** https://university.mongodb.com/
- **Docker for Beginners:** https://docker-curriculum.com/

### Community
- **Astro Discord:** https://astro.build/chat
- **Payload Slack:** https://payloadcms.com/community
- **MongoDB Community:** https://www.mongodb.com/community/forums/

### Tools and Services
- **GitHub:** Repository hosting and version control
- **Digital Ocean:** Cloud hosting for failover
- **AWS S3:** Media storage
- **Cloudflare:** DNS, CDN, and load balancing
- **Docker Hub:** Container registry

## Conclusion

This repository contains the complete Builders International website migration project, representing a modern approach to web development with Astro, Payload CMS, and Docker. The codebase is well-documented, maintainable, and ready for production deployment.

For technical architecture details, see the Architecture documentation. For development roadmap and next steps, see the Next Steps documentation. For current project status, see the Overview documentation.
