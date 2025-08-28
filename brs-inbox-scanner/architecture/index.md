# BRS Inbox Scanner - Architecture

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gmail API     │ -> │  BRS Backend    │ -> │  Google Drive   │
│  (Email Scan)   │    │ (OCR/Categorize)│    │ (Organization)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌──────────┐           ┌─────────────┐
    │ Pub/Sub │            │   GCS    │           │  Firestore  │
    │Webhooks │            │ Storage  │           │   Audit     │
    └─────────┘            └──────────┘           └─────────────┘
```

## System Components

### Core Processing Pipeline

#### Email Processing Layer
- **EmailScanner** (`src/services/emailScanner.js`)
  - Gmail API integration with domain-wide delegation
  - Real-time email monitoring and attachment detection
  - Multi-user inbox scanning capabilities
  - Smart filtering based on keywords and sender patterns

- **PubSubService** (`src/services/pubsubService.js`)
  - Real-time Gmail webhook processing
  - Asynchronous message handling with retry logic
  - Dead letter queue for failed message processing

- **DeduplicationService** (`src/services/deduplicationService.js`)
  - Prevents duplicate processing of messages
  - Message fingerprinting and tracking
  - Firestore-based deduplication cache

#### Document Processing Layer
- **ReceiptProcessor** (`src/services/receiptProcessor.js`)
  - Integration with existing BRS backend
  - Attachment download and processing coordination
  - Error handling and retry mechanisms

- **VisionOCR** (`src/services/visionOCR.js`)
  - Google Cloud Vision API integration
  - High-accuracy text extraction from images and PDFs
  - Structured data extraction from receipts

- **ChaseStatementParser** (`src/services/chaseStatementParser.js`)
  - Specialized parsing for Chase bank statements
  - Transaction extraction and normalization
  - Date and amount parsing with validation

#### Storage & Organization Layer
- **DriveOrganizer** (`src/services/driveOrganizer.js`)
  - Automated Google Drive folder creation
  - Hierarchical organization (user/year/quarter/month/category)
  - File upload and metadata management

- **FolderCache** (`src/services/folderCache.js`)
  - Intelligent caching system reducing API calls by 90%
  - Cache invalidation and refresh strategies
  - Performance optimization for frequent folder operations

- **ReceiptPrinter** (`src/services/receiptPrinter.js`)
  - PDF generation and merging capabilities
  - Google Cloud Storage integration
  - Signed URL generation for secure downloads

### Management & Control Systems

#### Administration Interface
- **Admin Dashboard** (`src/routes/admin.js`)
  - Web-based management interface
  - User authentication and session management
  - Real-time system monitoring and control

- **SimpleAuth Middleware** (`src/middleware/simpleAuth.js`)
  - Authentication layer for admin access
  - Session-based security with configurable timeouts
  - Google OAuth integration ready

#### Reconciliation System
- **ExpenseReconciliation** (`src/services/expenseReconciliation.js`)
  - Automated matching of bank statements to receipts
  - Fuzzy matching algorithms for transaction correlation
  - Discrepancy detection and reporting

- **ReconciliationReporter** (`src/services/reconciliationReporter.js`)
  - Multi-format report generation (HTML, JSON, CSV)
  - Detailed discrepancy analysis
  - Audit trail documentation

#### Automation & Scheduling
- **Scheduler** (`src/scheduler.js`)
  - Automated processing cycles (configurable intervals)
  - Task queue management
  - Background job coordination

- **AutomatedPrinting** (`src/services/automatedPrinting.js`)
  - Scheduled PDF generation
  - Batch processing capabilities
  - Automated delivery mechanisms

## Technology Stack

### Runtime Environment
- **Node.js**: JavaScript runtime with Express.js framework
- **Express.js**: Web application framework with middleware support
- **Session Management**: Express-session with configurable storage

### Google Cloud Platform Services
- **Cloud Run**: Serverless container platform with auto-scaling
- **Secret Manager**: Secure credential storage and management
- **Pub/Sub**: Asynchronous messaging for Gmail webhooks
- **Firestore**: NoSQL database for audit trails and caching
- **Cloud Storage**: Object storage for generated PDFs
- **Cloud Build**: Automated container builds and deployment

### Google Workspace Integration
- **Gmail API**: Email access with domain-wide delegation
- **Google Drive API**: File storage and organization
- **Google Cloud Vision**: OCR and document analysis
- **OAuth 2.0**: Secure authentication and authorization

### External Integrations
- **BRS Backend**: Existing AWS Elastic Beanstalk service
- **AWS Services**: Integration with existing OCR infrastructure
- **Banking APIs**: Chase statement processing

## Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Service Account │ -> │Domain-wide Deleg│ -> │  User Mailboxes │
│   (No Tokens)   │    │   (Admin Only)  │    │  (Organization) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Domain-wide Delegation**: Service account access without individual user tokens
- **Encrypted Credentials**: AES-256-GCM encryption for sensitive data at rest
- **Cloud Secret Manager**: Production-grade secret storage
- **OAuth Scopes**: Minimal required permissions
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.metadata.readonly`

### Security Controls
- **Admin-only Dashboard**: Restricted access with authentication
- **Audit Logging**: Comprehensive activity logging with Winston
- **Non-root Container**: Minimal attack surface with security hardening
- **HTTPS Enforcement**: SSL/TLS encryption for all communications
- **Rate Limiting**: API usage optimization and abuse prevention

## Data Flow Architecture

### Email Processing Flow
1. **Gmail Webhook** → Pub/Sub topic receives notification
2. **PubSub Handler** → Processes message and extracts metadata
3. **Deduplication Check** → Prevents reprocessing of existing messages
4. **Attachment Download** → Retrieves PDFs/images from Gmail
5. **OCR Processing** → Extracts text using Google Vision API
6. **BRS Integration** → Sends to existing backend for categorization
7. **Drive Organization** → Creates folders and uploads processed files
8. **Audit Logging** → Records all processing activities

### Reconciliation Flow
1. **Statement Detection** → Identifies Chase statements in email
2. **OCR Extraction** → Converts PDF statements to structured data
3. **Transaction Parsing** → Extracts individual transactions
4. **Receipt Matching** → Fuzzy matching against Drive receipts
5. **Discrepancy Analysis** → Identifies unmatched transactions
6. **Report Generation** → Creates detailed reconciliation reports

## Performance Architecture

### Caching Strategy
- **Folder Cache**: In-memory caching with TTL expiration
- **API Response Caching**: Reduces redundant Google API calls
- **Processing State**: Firestore-based state management

### Scalability Design
- **Auto-scaling**: Cloud Run handles traffic spikes automatically
- **Asynchronous Processing**: Non-blocking operations with event-driven architecture
- **Resource Optimization**: Efficient memory usage and connection pooling
- **Load Balancing**: Automatic distribution across multiple instances

### Monitoring & Observability
- **Health Endpoints**: `/health` and `/admin/status` for monitoring
- **Structured Logging**: Winston with Cloud Logging integration
- **Error Tracking**: Comprehensive error capture and reporting
- **Metrics Collection**: Processing statistics and performance data

## Deployment Architecture

### Container Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3000
USER node
CMD ["npm", "start"]
```

### Environment Configuration
- **Production**: Google Cloud Run with managed certificates
- **Staging**: Separate Cloud Run service with test data
- **Development**: Local Docker container with development database

### Infrastructure as Code
- **Cloud Build**: Automated build and deployment pipeline
- **YAML Configuration**: Declarative service definitions
- **Secret Management**: Automated secret provisioning and rotation

## Integration Patterns

### Gmail Integration
- **Push Notifications**: Real-time webhook processing
- **Batch Processing**: Scheduled full inbox scans
- **Error Recovery**: Retry mechanisms for failed operations

### Drive Integration
- **Hierarchical Organization**: Automated folder structure creation
- **Concurrent Access**: Thread-safe file operations
- **Quota Management**: Intelligent API usage optimization

### Backend Integration
- **RESTful APIs**: Standard HTTP integration with BRS backend
- **Timeout Handling**: Graceful degradation for slow responses
- **Fallback Strategies**: Alternative processing paths for failures