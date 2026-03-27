# Builders International Website - Technical Architecture

## System Architecture Overview

The Builders International website employs a modern **headless CMS architecture** with clear separation between content management (backend) and content presentation (frontend). This separation provides flexibility, security, and optimal performance while maintaining an excellent developer and content editor experience.

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet / Users                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS (443) / HTTP (80)
                             ▼
                    ┌────────────────┐
                    │    Cloudflare  │
                    │   (DNS + CDN)  │
                    └────────┬───────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
        Primary (Local)          Failover (Cloud)
                 │                       │
                 ▼                       ▼
      ┌──────────────────┐    ┌──────────────────┐
      │  Synology NAS    │    │  DigitalOcean    │
      │  or Local Server │    │    Droplet       │
      └────────┬─────────┘    └────────┬─────────┘
               │                       │
               │ Docker Compose Stack  │
               │                       │
               ▼                       ▼
      ┌─────────────────────────────────────────┐
      │              Nginx                       │
      │       (Reverse Proxy + SSL)              │
      │                                          │
      │  Routes:                                 │
      │  • /admin  → Payload CMS Admin          │
      │  • /api    → Payload CMS API            │
      │  • /*      → Astro Frontend             │
      └──────┬──────────────┬────────────┬──────┘
             │              │            │
             ▼              ▼            ▼
      ┌──────────┐  ┌─────────────┐  ┌──────────┐
      │  Astro   │  │   Payload   │  │ MongoDB  │
      │ Frontend │◄─┤     CMS     │──┤ Database │
      │  (SSR)   │  │  (Express)  │  │          │
      └──────────┘  └──────┬──────┘  └──────────┘
                           │
                           │ AWS SDK
                           ▼
                    ┌─────────────┐
                    │   AWS S3    │
                    │   (Media)   │
                    └─────────────┘
```

## Technology Stack Details

### Frontend: Astro v6.0.8

**Why Astro?**
Astro is a modern meta-framework optimized for content-focused websites. It ships minimal JavaScript by default, resulting in lightning-fast page loads while still supporting interactive components when needed.

**Key Features Used**:

1. **Server-Side Rendering (SSR)**
   - Dynamic content from Payload CMS API
   - Real-time content updates without rebuilds
   - SEO-friendly server-rendered HTML

2. **Content Collections (Legacy Support)**
   - Markdown content with frontmatter
   - Type-safe content schemas with Zod
   - Currently used for test content during migration
   - Will be replaced by Payload API once CMS is fully integrated

3. **File-Based Routing**
   - `pages/index.astro` → Homepage
   - `pages/[...slug].astro` → Dynamic pages
   - `pages/blog/index.astro` → Blog listing
   - `pages/blog/[...slug].astro` → Individual posts
   - `pages/health.ts` → Health check endpoint

4. **Layouts System**
   - `BaseLayout.astro` - Global wrapper with head section and navigation
   - `PageLayout.astro` - Static pages (About, Contact)
   - `PostLayout.astro` - Blog posts with author, date, categories

5. **Node.js Adapter**
   - Standalone mode for self-hosted deployment
   - Single-process server (no PM2 needed)
   - Docker-friendly with environment configuration

**Configuration** (`frontend/astro.config.mjs`):
```javascript
export default defineConfig({
  output: 'server',        // SSR mode
  adapter: node({
    mode: 'standalone',    // Self-contained server
  }),
  server: {
    host: '0.0.0.0',       // Docker compatibility
    port: 4321,
  },
  integrations: [
    sitemap(),             // Auto-generate sitemap.xml
  ],
  site: 'https://buildersintl.org',
});
```

**Directory Structure**:
```
frontend/
├── src/
│   ├── content/              # Content collections (legacy)
│   │   ├── config.ts         # Zod schemas
│   │   ├── pages/            # Markdown pages
│   │   └── posts/            # Markdown posts
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Global wrapper
│   │   ├── PageLayout.astro  # Static pages
│   │   └── PostLayout.astro  # Blog posts
│   ├── components/           # Reusable components (future)
│   ├── pages/                # Route definitions
│   │   ├── index.astro       # Homepage
│   │   ├── [...slug].astro   # Dynamic pages
│   │   ├── health.ts         # Health endpoint
│   │   └── blog/
│   │       ├── index.astro   # Blog index
│   │       └── [...slug].astro
│   ├── lib/
│   │   └── payload.ts        # Payload API client
│   └── styles/
│       └── global.css        # Base styles
├── public/                   # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── Dockerfile
```

**Content Collections Schema** (`src/content.config.ts`):
```typescript
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string().optional(),
    date: z.coerce.date(),
    modified: z.coerce.date(),
    excerpt: z.string().optional(),
    featuredImage: z.string().url().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    modified: z.coerce.date(),
    excerpt: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string().url().optional(),
  }),
});
```

**Payload API Integration** (`src/lib/payload.ts`):
```typescript
// Fetch pages from Payload CMS
export async function getPages() {
  const response = await fetch(`${PAYLOAD_URL}/api/pages`);
  return response.json();
}

// Fetch single page by slug
export async function getPageBySlug(slug: string) {
  const response = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}`
  );
  const data = await response.json();
  return data.docs[0];
}
```

### Backend: Payload CMS v2.x

**Why Payload?**
Payload is a TypeScript-first headless CMS built on Express.js. It provides a beautiful admin UI, flexible content modeling, and powerful APIs while giving developers full control over the codebase.

**Key Features Used**:

1. **Content Collections**
   - Users (authentication and authorization)
   - Pages (static content like About, Contact)
   - Posts (blog articles with authors, categories, tags)
   - Media (images, documents, videos)

2. **Admin Panel**
   - React-based UI at `/admin`
   - WYSIWYG rich text editor (Slate)
   - Media library with drag-and-drop uploads
   - Collection management (create, edit, delete)
   - User management and permissions

3. **REST API**
   - CRUD operations for all collections
   - Query parameters for filtering, sorting, pagination
   - Relationship population (author in posts)
   - Example: `GET /api/pages?where[slug][equals]=about`

4. **Authentication**
   - JWT-based sessions
   - Email/password login
   - Role-based access control
   - Admin, Editor, Viewer roles (custom)

5. **S3 Cloud Storage Plugin**
   - Direct uploads to AWS S3
   - Automatic file URL generation
   - Bucket: `builders-website-media`
   - CloudFront CDN integration (future)

**Configuration** (`payload/src/payload.config.ts`):
```typescript
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Builders International',
      favicon: '/favicon.ico',
    },
  },
  editor: slateEditor({}),
  collections: [Users, Pages, Posts, Media],
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: s3Adapter({
            config: {
              credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              },
              region: process.env.AWS_REGION || 'us-west-2',
            },
            bucket: process.env.S3_BUCKET || 'builders-website-media',
          }),
          generateFileURL: ({ filename }) => {
            return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
          },
        },
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://mongo:27017/buildersintl',
  }),
});
```

**Collections Structure**:

1. **Users Collection** (`src/collections/Users.ts`):
```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      defaultValue: 'editor',
    },
  ],
};
```

2. **Pages Collection** (`src/collections/Pages.ts`):
```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true, // Public pages
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
};
```

3. **Posts Collection** (`src/collections/Posts.ts`):
```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: 'published' } };
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
};
```

4. **Media Collection** (`src/collections/Media.ts`):
```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
};
```

**Directory Structure**:
```
payload/
├── src/
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Pages.ts
│   │   ├── Posts.ts
│   │   └── Media.ts
│   ├── payload.config.ts    # Main configuration
│   ├── server.ts            # Express server entry
│   └── payload-types.ts     # Generated TypeScript types
├── scripts/
│   └── import-via-api.ts    # S3 content import (future)
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Database: MongoDB

**Why MongoDB?**
Payload CMS v2.x has better native support for MongoDB through the Mongoose adapter. MongoDB's document-based structure aligns naturally with Payload's flexible content modeling.

**Key Decisions**:
- **Initial Plan**: PostgreSQL (relational database)
- **Current**: MongoDB (document database)
- **Reason**: Payload 2.x compatibility, easier schema migrations, better performance for nested content structures

**Configuration**:
- **Image**: `mongo:7-jammy` (Docker official image)
- **Database Name**: `buildersintl`
- **Port**: 27017 (internal Docker network only)
- **Authentication**: Username/password via environment variables
- **Persistence**: Docker volume `mongo_data` for data durability

**Connection String**:
```
mongodb://buildersintl:password@mongo:27017/buildersintl?authSource=admin
```

**Collections Created by Payload**:
- `users` - CMS users and authentication
- `pages` - Static page content
- `posts` - Blog post content
- `media` - Media file metadata (files stored in S3)
- `payload-preferences` - User preferences in admin
- `payload-migrations` - Schema version tracking

**Backup Strategy**:
```bash
# Daily automatic backup
docker exec buildersintl-mongo mongodump \
  --uri="mongodb://buildersintl:password@localhost:27017/buildersintl" \
  --out=/backup/$(date +%Y%m%d)

# Restore from backup
docker exec -i buildersintl-mongo mongorestore \
  --uri="mongodb://buildersintl:password@localhost:27017/buildersintl" \
  /backup/20260324
```

**Replication Setup (Phase 2.3)**:
- Primary: Local MongoDB instance
- Replica: Cloud MongoDB instance on Digital Ocean
- Sync: Real-time replication for failover
- Tool: MongoDB replica set configuration

### Media Storage: AWS S3

**Buckets**:
1. `builders-website-content` - WordPress content export (legacy, mostly empty)
2. `builders-website-media` - Images, videos, documents

**Configuration**:
- **Region**: us-west-2 (Oregon)
- **Access**: Private (signed URLs or public with specific keys)
- **Versioning**: Enabled (for backup and recovery)
- **Lifecycle**: Transition to S3 Glacier after 180 days (future)

**Integration with Payload**:
- Payload S3 cloud storage plugin handles uploads
- Files uploaded via admin panel go directly to S3
- Database stores metadata + S3 URL
- Payload generates signed URLs for private content

**URL Structure**:
```
https://builders-website-media.s3.us-west-2.amazonaws.com/filename.jpg
```

**Future CDN Integration**:
```
https://cdn.buildersintl.org/filename.jpg  (CloudFront)
```

**Sync Script** (currently not in use):
```javascript
// scripts/sync-content.mjs
// Downloads content from S3 content bucket to local Markdown files
// On hold until WordPress extraction completes
```

### Reverse Proxy: Nginx

**Why Nginx?**
Nginx provides efficient request routing, SSL termination, caching, and load balancing in a lightweight package. It's the de facto standard for modern web applications.

**Configuration** (`nginx/nginx.conf`):
```nginx
upstream payload {
  server payload:3000;
}

upstream frontend {
  server frontend:4321;
}

server {
  listen 80;
  server_name buildersintl.org www.buildersintl.org;

  # Health check endpoint
  location /health {
    return 200 'OK';
    add_header Content-Type text/plain;
  }

  # Payload CMS admin
  location /admin {
    proxy_pass http://payload;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Payload CMS API
  location /api {
    proxy_pass http://payload;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Astro frontend (all other routes)
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

# HTTPS (future - Let's Encrypt)
server {
  listen 443 ssl http2;
  server_name buildersintl.org www.buildersintl.org;

  ssl_certificate /etc/nginx/ssl/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/privkey.pem;

  # Same location blocks as above
}
```

**Features**:
- Request routing based on path
- Proxy headers for backend awareness
- Health check endpoint for monitoring
- SSL/TLS termination (production)
- HTTP/2 support for performance
- Gzip compression for text assets
- Static asset caching (future)

### Containerization: Docker

**Why Docker?**
Docker ensures consistent environments across development, staging, and production. It simplifies deployment, scaling, and maintenance while isolating services.

**Services** (docker-compose.yml):

1. **MongoDB** (`mongo:7-jammy`):
   - Database for Payload CMS
   - Port: 27017 (internal)
   - Volume: `mongo_data` for persistence
   - Health check: `mongosh --eval "db.adminCommand('ping')"`

2. **Payload CMS** (custom Dockerfile):
   - Express.js server with admin panel
   - Port: 3000 (internal)
   - Depends on: MongoDB
   - Env: Database URI, S3 credentials, secrets

3. **Astro Frontend** (custom Dockerfile):
   - Node.js SSR server
   - Port: 4321 (internal)
   - Depends on: Payload
   - Env: Payload API URL

4. **Nginx** (`nginx:alpine`):
   - Reverse proxy and SSL termination
   - Ports: 80 (HTTP), 443 (HTTPS)
   - Depends on: Frontend, Payload
   - Volumes: Config, SSL certificates

**Docker Compose Configuration**:
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7-jammy
    container_name: buildersintl-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-buildersintl}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB:-buildersintl}
    volumes:
      - mongo_data:/data/db
    networks:
      - internal
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  payload:
    build: ./payload
    container_name: buildersintl-payload
    environment:
      DATABASE_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DB}?authSource=admin
      PAYLOAD_PUBLIC_SERVER_URL: ${SITE_URL}
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      S3_BUCKET: ${S3_MEDIA_BUCKET}
      AWS_REGION: ${AWS_REGION}
      NODE_ENV: production
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - internal
      - external
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: buildersintl-frontend
    environment:
      PAYLOAD_URL: http://payload:3000
      NODE_ENV: production
    depends_on:
      - payload
    networks:
      - internal
      - external
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: buildersintl-nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - payload
    networks:
      - external
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  mongo_data:
    driver: local

networks:
  internal:
    driver: bridge
  external:
    driver: bridge
```

**Dockerfile Examples**:

**Payload Dockerfile** (`payload/Dockerfile`):
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build Astro
RUN npm run build

# Expose port
EXPOSE 4321

# Start server
CMD ["node", "./dist/server/entry.mjs"]
```

## Data Flow Architecture

### Content Creation Flow

```
1. Content Editor logs into Payload admin (/admin)
   ↓
2. Creates or edits content (page, post, media)
   ↓
3. Payload validates and saves to MongoDB
   ↓
4. Media files uploaded directly to S3
   ↓
5. Content marked as "Published"
   ↓
6. Content immediately available via REST API (/api)
   ↓
7. Astro frontend fetches content via API on page request
   ↓
8. SSR renders HTML with fresh content
   ↓
9. User sees updated content in browser
```

### Page Request Flow

```
1. User visits https://buildersintl.org/about
   ↓
2. DNS resolves to Cloudflare
   ↓
3. Cloudflare routes to primary server (local or cloud)
   ↓
4. Nginx receives request on port 80/443
   ↓
5. Nginx proxies to Astro frontend on port 4321
   ↓
6. Astro [...slug].astro route handler matches "/about"
   ↓
7. Astro fetches page data from Payload API
   ↓
8. Payload queries MongoDB for page with slug="about"
   ↓
9. MongoDB returns page document
   ↓
10. Payload sends JSON response to Astro
   ↓
11. Astro renders PageLayout with content
   ↓
12. Nginx sends HTML response to user
   ↓
13. Browser renders page (< 2 seconds)
```

### Media Upload Flow

```
1. Editor uploads image in Payload admin
   ↓
2. Payload receives file upload (multipart/form-data)
   ↓
3. S3 cloud storage plugin intercepts upload
   ↓
4. File uploaded directly to S3 bucket (builders-website-media)
   ↓
5. S3 returns file URL
   ↓
6. Payload saves media metadata to MongoDB:
   - filename
   - S3 URL
   - alt text
   - dimensions
   - file size
   ↓
7. Image available for use in pages/posts
   ↓
8. Astro renders <img> tag with S3 URL
```

## File Structure

### Complete Project Structure

```
buildersintl-website/
├── frontend/                      # Astro SSR Application
│   ├── src/
│   │   ├── content/               # Content collections (legacy)
│   │   │   ├── config.ts          # Zod schemas
│   │   │   ├── pages/             # Markdown pages (2 test pages)
│   │   │   └── posts/             # Markdown posts (2 test posts)
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro   # Global wrapper (HTML, head, nav)
│   │   │   ├── PageLayout.astro   # Static pages template
│   │   │   └── PostLayout.astro   # Blog post template
│   │   ├── components/            # (Empty - future component library)
│   │   ├── pages/                 # Route definitions
│   │   │   ├── index.astro        # Homepage
│   │   │   ├── [...slug].astro    # Dynamic pages
│   │   │   ├── health.ts          # Health check endpoint
│   │   │   └── blog/
│   │   │       ├── index.astro    # Blog index
│   │   │       └── [...slug].astro # Blog post pages
│   │   ├── lib/
│   │   │   └── payload.ts         # Payload API client functions
│   │   └── styles/
│   │       └── global.css         # Base styles
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── .astro/                    # Build cache (gitignored)
│   ├── dist/                      # Build output (gitignored)
│   ├── node_modules/              # Dependencies (gitignored)
│   ├── astro.config.mjs           # Astro configuration
│   ├── tsconfig.json              # TypeScript config
│   ├── package.json               # Dependencies and scripts
│   ├── Dockerfile                 # Docker image definition
│   └── .dockerignore
│
├── payload/                       # Payload CMS Backend
│   ├── src/
│   │   ├── collections/
│   │   │   ├── Users.ts           # User authentication
│   │   │   ├── Pages.ts           # Static pages collection
│   │   │   ├── Posts.ts           # Blog posts collection
│   │   │   └── Media.ts           # Media library
│   │   ├── payload.config.ts      # Main CMS configuration
│   │   ├── server.ts              # Express server entry
│   │   └── payload-types.ts       # Generated TypeScript types
│   ├── scripts/
│   │   └── import-via-api.ts      # S3 content import (future)
│   ├── node_modules/              # Dependencies (gitignored)
│   ├── dist/                      # Build output (gitignored)
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript config
│   ├── Dockerfile                 # Docker image definition
│   ├── .dockerignore
│   └── .env                       # Secrets (gitignored)
│
├── nginx/                         # Nginx Reverse Proxy
│   ├── nginx.conf                 # Main configuration
│   ├── ssl/                       # SSL certificates (gitignored)
│   │   ├── fullchain.pem
│   │   └── privkey.pem
│   └── README.md                  # SSL setup instructions
│
├── scripts/
│   └── sync-content.mjs           # S3 content sync (not in use)
│
├── docs/                          # Project documentation
│   ├── ARCHITECTURE.md            # Technical architecture (this file)
│   ├── README.md                  # Project overview
│   ├── STATUS.md                  # Current status snapshot
│   ├── NEXT_STEPS.md              # Immediate next actions
│   ├── DIGITALOCEAN_SETUP.md      # Cloud deployment guide
│   ├── PHASE_2_1_STATUS.md        # Phase 2.1 detailed status
│   ├── PHASE_2_2_STATUS.md        # Phase 2.2 detailed status
│   ├── QUICK_START_DO.md          # Quick start on Digital Ocean
│   ├── SUMMARY_2026-03-24.md      # Daily summary
│   └── DISK_SPACE.md              # Disk space analysis
│
├── docker/
│   └── README.md                  # Docker setup instructions
│
├── keys/                          # SSH keys and secrets (gitignored)
│
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
├── docker-compose.yml             # Full stack orchestration
├── package.json                   # Root package with scripts
└── README.md                      # Project README
```

## Design Patterns

### 1. Headless CMS Pattern

**Concept**: Separate content management (backend) from content presentation (frontend).

**Implementation**:
- **Backend**: Payload CMS provides admin UI and REST API
- **Frontend**: Astro consumes API and renders pages
- **Benefits**: Flexibility, security, scalability, multiple frontends possible

### 2. Microservices Pattern

**Concept**: Application composed of independently deployable services.

**Implementation**:
- **Services**: MongoDB, Payload, Astro, Nginx
- **Communication**: HTTP/REST APIs
- **Orchestration**: Docker Compose
- **Benefits**: Independent scaling, easier maintenance, technology flexibility

### 3. API Gateway Pattern

**Concept**: Single entry point for all client requests, routing to appropriate backend service.

**Implementation**:
- **Gateway**: Nginx reverse proxy
- **Routes**: `/admin` → Payload, `/api` → Payload, `/*` → Astro
- **Benefits**: Centralized routing, SSL termination, load balancing, caching

### 4. Repository Pattern (Future)

**Concept**: Abstract data access logic behind interface.

**Implementation** (planned for Astro frontend):
```typescript
// lib/repositories/PageRepository.ts
export class PageRepository {
  async getAll() { /* fetch from Payload */ }
  async getBySlug(slug: string) { /* fetch by slug */ }
  async search(query: string) { /* search pages */ }
}
```

**Benefits**: Testability, flexibility to change data source, clear separation of concerns

### 5. Layout Component Pattern

**Concept**: Reusable layout templates for consistent page structure.

**Implementation**:
- `BaseLayout.astro` - Global wrapper with head section, navigation, footer
- `PageLayout.astro` - Extends Base, adds page-specific structure
- `PostLayout.astro` - Extends Base, adds blog-specific elements

**Benefits**: DRY principle, consistent design, easy global changes

## Migration Strategy

### Phase 1: Content Extraction (ON HOLD)

**Original Plan**:
1. Export WordPress site as .wpress file
2. Parse WordPress database export (XML)
3. Convert posts and pages to Markdown
4. Upload content to S3 (`builders-website-content`)
5. Upload media to S3 (`builders-website-media`)
6. Sync from S3 to local Markdown files

**Current Status**: Incomplete
- Extraction tool built but S3 upload failed
- Content bucket mostly empty (1 undefined page)
- Media bucket completely empty

**Revised Strategy**: Build infrastructure first, address content later

### Phase 2.1: Astro Frontend Foundation (~40% Complete)

**Completed**:
- ✅ Astro project with SSR mode
- ✅ Content collections with Zod schemas
- ✅ Three layout templates
- ✅ Dynamic routing for pages and posts
- ✅ Test content (2 pages, 2 posts)
- ✅ Dev server tested successfully

**Remaining**:
- Extract WordPress design (CSS/HTML)
- Build component library
- Pixel-perfect design recreation
- Performance optimization

### Phase 2.2: Payload CMS Setup (Next)

**Tasks**:
1. Initialize Payload in `payload/` directory
2. Configure MongoDB connection
3. Create collections (Users, Pages, Posts, Media)
4. Set up S3 storage plugin
5. Build Docker images
6. Test Docker Compose stack
7. Create admin users
8. Import or create content

**Decision Point**: PostgreSQL vs MongoDB
- **Initial Plan**: PostgreSQL (relational)
- **Current**: MongoDB (document-based)
- **Reason**: Payload 2.x better compatibility

### Phase 2.3: Cloud Failover (Future)

**Tasks**:
1. Deploy to Digital Ocean droplet
2. Configure database replication
3. Set up Cloudflare Load Balancer
4. Implement health checks
5. Test failover scenarios
6. Document operational procedures

### Phase 2.4: Production Launch (Future)

**Tasks**:
1. Design QA and refinement
2. Performance optimization
3. SEO implementation
4. SSL certificates
5. Content migration complete
6. User training
7. DNS cutover
8. WordPress decommissioning
9. Monitoring setup

### URL Preservation Strategy

**Goal**: Maintain SEO rankings by preserving WordPress URLs or redirecting properly.

**WordPress URL Structure**:
```
https://buildersintl.org/about-us/
https://buildersintl.org/blog/post-title/
https://buildersintl.org/ministries/africa/
```

**New URL Structure**:
```
https://buildersintl.org/about
https://buildersintl.org/blog/post-title
https://buildersintl.org/ministries/africa
```

**301 Redirects** (Nginx configuration):
```nginx
# Redirect old WordPress URLs
rewrite ^/about-us/?$ /about permanent;
rewrite ^/contact-us/?$ /contact permanent;
rewrite ^/blog/(.+)/?$ /blog/$1 permanent;
```

**Sitemap Comparison**:
1. Generate sitemap from old WordPress site
2. Generate sitemap from new Astro site
3. Compare URLs and create redirect rules
4. Test all critical pages

## Deployment Architecture

### Local Deployment (Primary)

**Hardware Options**:
1. **Synology NAS** (recommended):
   - Docker support via DSM
   - Built-in backup and redundancy
   - Low power consumption
   - 4GB+ RAM required

2. **Dedicated Server**:
   - Ubuntu 24.04 LTS
   - 4GB+ RAM
   - 20GB+ storage
   - Static IP or DDNS

**Network Configuration**:
- Router port forwarding: 80 → Server:80, 443 → Server:443
- Firewall: Allow incoming on 80, 443
- Dynamic DNS (if no static IP): DuckDNS or Cloudflare
- UPS recommended for power reliability

**Benefits**:
- No monthly hosting costs
- Fast local access
- Full control over infrastructure
- Works during internet outages (local network)

**Challenges**:
- Requires technical expertise
- Dependent on local network and power
- Need backup internet connection for redundancy

### Cloud Deployment (Failover)

**Digital Ocean Droplet**:
- **Size**: 4GB RAM / 2 vCPU ($24/month)
- **Region**: San Francisco 3 (or closest to users)
- **OS**: Ubuntu 24.04 LTS x64
- **Storage**: 50GB SSD
- **Network**: 1TB transfer/month

**Deployment Steps**:
1. Create droplet via dashboard
2. SSH in and install Docker + Docker Compose
3. Configure firewall (UFW): allow 22, 80, 443
4. Clone git repository
5. Configure `.env` with production secrets
6. Run `docker-compose up -d`
7. Install SSL certificates (Let's Encrypt)
8. Verify health checks passing

**Benefits**:
- High availability and reliability
- Automatic failover when local down
- Professional hosting infrastructure
- Easy to scale if needed

**Challenges**:
- Monthly hosting costs (~$24)
- Slightly higher latency for local users
- Need database replication for sync

### Hybrid Deployment (Recommended)

**Architecture**:
```
Cloudflare DNS + Load Balancer
         │
         ├─── Primary: Local Server (fast, free)
         │
         └─── Failover: Digital Ocean (reliable, paid)
```

**Configuration**:
1. **Cloudflare Load Balancer**:
   - Monitor: `/health` endpoint every 30s
   - Primary pool: Local server
   - Failover pool: Digital Ocean droplet
   - Automatic traffic shifting on failure

2. **Database Replication**:
   - Primary: Local MongoDB
   - Replica: Cloud MongoDB
   - Sync: Real-time replication
   - Failover: Automatic with Mongo replica sets

3. **Health Checks**:
   - HTTP GET to `/health`
   - Expected response: 200 OK with body "OK"
   - Failure threshold: 3 consecutive failures
   - Recovery: Automatic when health checks pass

**Benefits**:
- Best of both worlds (speed + reliability)
- Cost-effective (primary traffic free)
- High availability (automatic failover)
- Geographic redundancy

## Performance Optimizations

### Frontend Optimizations

1. **Static Site Generation (SSG)**:
   - Pre-render static pages at build time
   - Serve HTML files directly (fastest possible)
   - Use for pages that rarely change (About, Contact)

2. **Server-Side Rendering (SSR)**:
   - Generate HTML on demand for dynamic content
   - Fresh content without rebuild
   - Use for blog posts, news updates

3. **Image Optimization**:
   - Convert to WebP format
   - Generate multiple sizes (responsive images)
   - Lazy loading for below-the-fold images
   - Use Astro's `<Image>` component

4. **Code Splitting**:
   - Astro's island architecture (minimal JS)
   - Load JavaScript only for interactive components
   - Lazy load components below the fold

5. **Asset Optimization**:
   - Minify CSS and JavaScript
   - Inline critical CSS
   - Use CDN for static assets (future)
   - Enable gzip/brotli compression

### Backend Optimizations

1. **Database Indexing**:
   - Index on `slug` field for fast lookups
   - Index on `status` and `publishedDate` for filtering
   - Compound indexes for complex queries

2. **API Response Caching**:
   - Cache frequently requested pages
   - Use HTTP Cache-Control headers
   - Redis for cache storage (future)

3. **Query Optimization**:
   - Limit fields returned (projection)
   - Pagination for list endpoints
   - Avoid N+1 queries with population

### Infrastructure Optimizations

1. **Nginx Caching**:
   - Cache static assets (images, CSS, JS)
   - Cache API responses with short TTL
   - Cache HTML pages for anonymous users

2. **HTTP/2**:
   - Enable HTTP/2 in Nginx
   - Multiplexing for faster page loads
   - Server push for critical assets (future)

3. **CDN Integration** (future):
   - CloudFront for S3 media
   - Cloudflare for entire site
   - Edge caching for global users

## Security Architecture

### Infrastructure Security

1. **Firewall**:
   - UFW (Uncomplicated Firewall) on Ubuntu
   - Allow only necessary ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
   - Deny all other incoming traffic
   - Rate limiting to prevent DDoS

2. **SSL/TLS**:
   - Let's Encrypt certificates (free, auto-renew)
   - TLS 1.2+ only (disable TLS 1.0, 1.1)
   - Strong cipher suites
   - HSTS header for HTTPS enforcement

3. **Docker Security**:
   - Non-root users in containers
   - Read-only file systems where possible
   - Resource limits (CPU, memory) to prevent resource exhaustion
   - Regular image updates for security patches

### Application Security

1. **Authentication**:
   - Payload JWT-based sessions
   - Secure password requirements (min 10 chars, complexity)
   - Password hashing with bcrypt
   - Session expiration and refresh

2. **Authorization**:
   - Role-based access control (Admin, Editor, Viewer)
   - Collection-level permissions
   - Field-level permissions (future)
   - API rate limiting per user

3. **Content Security Policy**:
   - Restrict script sources to prevent XSS
   - Restrict frame ancestors to prevent clickjacking
   - Report violations for monitoring

4. **Input Validation**:
   - Validate all user inputs (forms, API)
   - Sanitize rich text content
   - Prevent NoSQL injection
   - Escape output to prevent XSS

### Data Security

1. **Environment Variables**:
   - Never commit secrets to git
   - Use `.env` files (gitignored)
   - Different secrets for dev/staging/prod
   - Rotate secrets periodically

2. **Database Security**:
   - Strong password for MongoDB
   - Authentication required for all connections
   - Database on internal Docker network only
   - Regular backups encrypted at rest

3. **S3 Security**:
   - Private buckets (no public read)
   - IAM user with minimal permissions
   - Signed URLs for temporary access
   - Versioning enabled for backup

## Monitoring and Observability

### Health Checks

**Endpoint**: `/health`
**Implementation** (`frontend/src/pages/health.ts`):
```typescript
export async function get() {
  return new Response('OK', { status: 200 });
}
```

**Monitoring**:
- Cloudflare Load Balancer checks every 30s
- Docker Compose health checks every 10s
- Uptime monitoring service (future): UptimeRobot, Pingdom

### Logging

**Docker Logs**:
```bash
docker-compose logs -f [service]
```

**Centralized Logging** (future):
- Collect logs from all containers
- Store in Elasticsearch or Loki
- Visualize with Kibana or Grafana
- Alert on error patterns

### Metrics (Future)

**Application Metrics**:
- Request count and latency
- Error rates by endpoint
- Database query performance
- Cache hit rates

**Infrastructure Metrics**:
- CPU and memory usage
- Disk space utilization
- Network bandwidth
- Container health status

**Tools**:
- Prometheus for metrics collection
- Grafana for visualization
- Alertmanager for notifications

## Disaster Recovery

### Backup Strategy

1. **Database Backups**:
   - Automated daily backups
   - Retention: 7 daily, 4 weekly, 12 monthly
   - Stored locally and in S3
   - Test restoration quarterly

2. **Media Backups**:
   - S3 versioning enabled
   - S3 lifecycle policy for Glacier archival
   - Cross-region replication (future)

3. **Configuration Backups**:
   - Git repository for all code and config
   - Tagged releases for easy rollback
   - `.env` files backed up securely (encrypted)

### Recovery Procedures

**Scenario 1: Service Failure**
```bash
# Restart failed service
docker-compose restart [service]

# Full restart if needed
docker-compose down
docker-compose up -d
```

**Scenario 2: Database Corruption**
```bash
# Restore from last backup
docker exec -i buildersintl-mongo mongorestore \
  --uri="mongodb://..." \
  /backup/latest

# Restart services
docker-compose restart payload frontend
```

**Scenario 3: Complete Server Failure**
1. Cloudflare automatically fails over to cloud server
2. Cloud server (Digital Ocean) takes over traffic
3. Restore local server from backups
4. Sync database from cloud to local
5. Switch DNS back to local when ready

**Recovery Time Objectives (RTO)**:
- Service restart: < 5 minutes
- Database restoration: < 30 minutes
- Complete server rebuild: < 4 hours
- Failover to cloud: < 1 minute (automatic)

## Future Enhancements

### Short-Term (Next 3-6 Months)

1. **Complete Design Migration**:
   - Extract all CSS from WordPress
   - Build complete component library
   - Pixel-perfect design match

2. **Content Migration**:
   - Fix WordPress extraction pipeline
   - Import all pages and posts to Payload
   - Migrate media library to S3

3. **SEO Optimization**:
   - Implement structured data (JSON-LD)
   - Generate dynamic sitemap
   - Add meta tags to all pages
   - Set up Google Search Console

4. **Performance Tuning**:
   - Achieve Lighthouse scores >90
   - Implement image optimization
   - Set up CDN (CloudFront)
   - Enable aggressive caching

### Medium-Term (6-12 Months)

1. **Advanced Features**:
   - Search functionality (Algolia or Meilisearch)
   - Newsletter integration (Mailchimp or ConvertKit)
   - Event calendar with registration
   - Donation integration (Stripe or Donorbox)

2. **Multi-Language Support**:
   - Spanish and Portuguese translations
   - Language switcher in navigation
   - Localized content collections

3. **Enhanced CMS Features**:
   - Workflow with draft/review/publish states
   - Scheduled publishing
   - Content version history
   - Collaboration tools (comments, approvals)

4. **Analytics and Reporting**:
   - Google Analytics 4 integration
   - Custom dashboards for key metrics
   - Email reports for site performance

### Long-Term (1+ Years)

1. **Scaling and Performance**:
   - Multi-instance deployment (load balancing)
   - Database sharding for large datasets
   - Global CDN with edge caching
   - Serverless functions for heavy computations

2. **Advanced Integrations**:
   - CRM integration (Salesforce, HubSpot)
   - Social media auto-posting
   - Video hosting (Vimeo, YouTube API)
   - Podcast RSS feed generation

3. **Mobile App** (potential):
   - React Native or Flutter app
   - Consume same Payload API
   - Push notifications for updates
   - Offline content reading

## Conclusion

The Builders International website architecture represents a modern, performant, and maintainable approach to web development. By leveraging Astro for the frontend, Payload CMS for content management, and Docker for deployment, the project achieves an optimal balance of developer experience, content editor usability, and end-user performance.

Key architectural decisions prioritize:
- **Performance**: Static generation, minimal JavaScript, optimized assets
- **Flexibility**: Headless CMS enables future mobile app or other frontends
- **Reliability**: Hybrid deployment with automatic failover ensures high availability
- **Security**: Defense in depth with multiple layers of protection
- **Maintainability**: TypeScript, Docker, clear separation of concerns

The phased migration approach allows for incremental progress and validation, reducing risk while delivering value early. With Phase 2.1 foundation complete and Phase 2.2 ready to begin, the project is well-positioned for a successful production launch.

For operational details, see the Deployment Guide and Next Steps documentation. For current project status, see the Repository Link documentation.
