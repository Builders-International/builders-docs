# Builders Documentation Update - Design Specification

**Date:** 2026-03-26
**Status:** Approved
**Author:** Claude (with Elliott Godwin)

## Executive Summary

This specification outlines the comprehensive update to the Builders International documentation repository. The update adds 6 new project documentation sections and establishes 3 development standards sections covering infrastructure tooling, CI/CD workflows, and code quality practices.

**Scope:**
- Add documentation for 6 projects from local repositories
- Create 3 comprehensive standards sections (Infrastructure, CI/CD & Deployment, Code Quality)
- Integrate CI/CD workflows from egi-ci:cd repository
- Maintain existing 8 project documentation sections as-is
- Clean up heavy dependencies after documentation extraction

**Audience:** Internal development team + stakeholders/management

## 1. Overall Structure & Organization

### Documentation Hierarchy

```
docs/
├── [existing projects - unchanged]
├── infrastructure/
│   ├── overview.md
│   ├── crowdsec.md
│   ├── uptime-kuma.md
│   ├── cloudflare.md
│   └── posthog.md
├── cicd-deployment/
│   ├── overview.md
│   ├── workflows.md
│   ├── deployment-process.md
│   └── environments.md
├── code-quality/
│   ├── overview.md
│   ├── testing-standards.md
│   ├── code-review.md
│   └── best-practices.md
├── Builders-Data-Dashboard/
│   ├── overview.md
│   ├── architecture.md
│   ├── repo-link.md
│   └── next-steps.md
├── Builders-Events/
│   └── [same 4-file structure]
├── builders-events-mobile/
│   └── [same 4-file structure]
├── builders-radio/
│   └── [same 4-file structure]
├── buildersintl-website/
│   └── [same 4-file structure]
└── Vireo/
    └── [same 4-file structure]
```

### Naming Conventions

- **Standards folders:** lowercase-with-hyphens for consistency
- **Project folders:** Match exact repository names (preserves case)
- **File names:** Consistent across all sections (overview, architecture, repo-link, next-steps)

### Organization Principles

1. Standards sections appear first in navigation (reference material)
2. Projects listed alphabetically for easy scanning
3. Existing project documentation remains unchanged
4. Consistent 4-page structure for all projects

## 2. Standards Documentation Content

### Infrastructure Section

**Purpose:** Document cloud-first infrastructure approach and standardized tooling

**Files:**
- **overview.md:** Infrastructure philosophy, migration to cloud-first, how components integrate
- **crowdsec.md:** Cloud security setup, configuration, project integration, monitoring/alerting
- **uptime-kuma.md:** Uptime monitoring setup, service addition, notifications, dashboard access
- **cloudflare.md:** DNS management, CDN configuration, security settings, migration procedures
- **posthog.md:** Analytics integration, event tracking standards, dashboard setup, privacy considerations

**Content Characteristics:**
- Comprehensive with examples and commands
- Links to relevant tools and dashboards
- Mindful of security for stakeholder audience
- Step-by-step setup and configuration guides

### CI/CD & Deployment Section

**Purpose:** Establish deployment standards and document automated workflows

**Files:**
- **overview.md:** Deployment philosophy, environments (dev/staging/prod), general workflow
- **workflows.md:** GitHub Actions workflows from egi-ci:cd, automated testing, deployment pipelines
- **deployment-process.md:** Step-by-step deployment procedures, rollback strategies, checklists
- **environments.md:** Environment configuration, secrets management, environment-specific settings

**Content Characteristics:**
- Adapted workflows from egi-ci:cd repository
- Annotated YAML/config with explanations
- Reusable templates for different project types
- Troubleshooting guides for common issues

### Code Quality Section

**Purpose:** Define code quality expectations and processes across all projects

**Files:**
- **overview.md:** Code quality philosophy, expectations for all projects
- **testing-standards.md:** Unit/integration/e2e testing requirements, coverage, tools
- **code-review.md:** PR review process, approval requirements, review checklist
- **best-practices.md:** Language-specific standards, naming conventions, documentation, security

**Content Characteristics:**
- Practical examples and code snippets
- Clear expectations and requirements
- Language-agnostic principles with language-specific guidance
- Security best practices (OWASP top 10 awareness)

## 3. Project Documentation Extraction Approach

### Projects to Document

1. **Builders-Data-Dashboard** - ~/Developer/Builders-Data-Dashboard
2. **Builders-Events** - ~/Developer/Builders-Events
3. **builders-events-mobile** - ~/Developer/builders-events-mobile
4. **builders-radio** - ~/Developer/builders-radio
5. **buildersintl-website** - ~/Developer/buildersintl-website
6. **Vireo** - ~/Developer/Vireo

### Information Extraction Per Project

#### overview.md
- Project purpose and business value
- Tech stack (from package.json, requirements.txt, go.mod, etc.)
- Key features and capabilities
- Target users/audience
- Current status (production, development, maintenance)

#### architecture.md
- System architecture (text-based description)
- Tech stack details with versions
- Key dependencies and their purposes
- Database schema (from Prisma schema, migrations, models)
- API endpoints and routes (from route files, API definitions)
- External integrations (from config files, environment variables)
- File structure and organization
- Design patterns used

#### repo-link.md
- Local repository path
- GitHub repository URL (from git remote)
- Branch structure
- Key maintainers/contacts (from git log, package.json author)

#### next-steps.md
- Known issues or technical debt (from TODOs, comments)
- Planned features or improvements (from comments, roadmap files)
- Dependencies needing updates
- Refactoring opportunities

### Extraction Process

1. Read README, package.json/equivalent, main config files
2. Analyze project structure (directory tree)
3. Identify entry points and main application files
4. Extract API routes, database models, key business logic
5. Document environment variables and configuration
6. Note deployment information (Dockerfiles, hosting, Digital Ocean droplets)
7. Cross-reference to relevant standards sections
8. Clean up node_modules/vendor/build directories

### Cross-Referencing Strategy

Each project will reference relevant standards sections using relative links:
- "Deployment follows [CI/CD workflows](../cicd-deployment/workflows.md)"
- "Uses [Cloudflare DNS](../infrastructure/cloudflare.md) per infrastructure standards"
- "Analytics tracked via [PostHog](../infrastructure/posthog.md)"

## 4. egi-ci:cd Integration & Adaptation

### Source Repository

**Location:** ~/Developer/egi-ci:cd (local repository)

### Integration Strategy

#### Phase 1: Extraction
1. Read all workflow files (.github/workflows/, CI configs, scripts)
2. Understand CI/CD patterns and processes
3. Extract deployment scripts and automation
4. Document workflow dependencies and requirements

#### Phase 2: Adaptation
1. Change local paths from egi-ci:cd context to builders-docs context
2. Update repository references
3. Generalize workflows to serve as templates
4. Document each workflow's purpose and usage
5. Identify required secrets and environment variables

#### Phase 3: Documentation
1. Present workflows as reusable templates in cicd-deployment/workflows.md
2. Include actual workflow YAML/config content as code blocks
3. Explain how to adapt for different project types
4. Provide project-specific adaptation examples
5. Link to GitHub Actions documentation

#### Phase 4: SOP Integration
1. Create standard operating procedures based on workflows
2. Document when to run which workflows
3. Include troubleshooting for common CI/CD issues
4. Cross-reference Infrastructure and Code Quality standards

### Output Format

- Workflow files as syntax-highlighted code blocks
- Inline comments explaining each section
- Before/after examples showing adaptations
- Links to external documentation where relevant
- Troubleshooting section for common errors

## 5. Sidebar Navigation Structure

### Updated sidebars.ts

```typescript
module.exports = {
  mainSidebar: [
    'index',

    // Development Standards (first, as reference material)
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/overview',
        'infrastructure/crowdsec',
        'infrastructure/uptime-kuma',
        'infrastructure/cloudflare',
        'infrastructure/posthog',
      ],
    },
    {
      type: 'category',
      label: 'CI/CD & Deployment',
      items: [
        'cicd-deployment/overview',
        'cicd-deployment/workflows',
        'cicd-deployment/deployment-process',
        'cicd-deployment/environments',
      ],
    },
    {
      type: 'category',
      label: 'Code Quality',
      items: [
        'code-quality/overview',
        'code-quality/testing-standards',
        'code-quality/code-review',
        'code-quality/best-practices',
      ],
    },

    // Projects (alphabetical, including existing + new)
    {
      type: 'category',
      label: 'BFA',
      items: [
        'BFA/overview',
        'BFA/architecture',
        'BFA/next-steps',
        'BFA/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'BRS Inbox Scanner',
      items: [
        'brs-inbox-scanner/overview',
        'brs-inbox-scanner/architecture',
        'brs-inbox-scanner/next-steps',
        'brs-inbox-scanner/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'BRS RSA',
      items: [
        'BRS-RSA/overview',
        'BRS-RSA/architecture',
        'BRS-RSA/next-steps',
        'BRS-RSA/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'Builders Data Dashboard',
      items: [
        'Builders-Data-Dashboard/overview',
        'Builders-Data-Dashboard/architecture',
        'Builders-Data-Dashboard/repo-link',
        'Builders-Data-Dashboard/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'Builders Events',
      items: [
        'Builders-Events/overview',
        'Builders-Events/architecture',
        'Builders-Events/repo-link',
        'Builders-Events/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'Builders Events Mobile',
      items: [
        'builders-events-mobile/overview',
        'builders-events-mobile/architecture',
        'builders-events-mobile/repo-link',
        'builders-events-mobile/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'Builders Radio',
      items: [
        'builders-radio/overview',
        'builders-radio/architecture',
        'builders-radio/repo-link',
        'builders-radio/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'Builders Website',
      items: [
        'buildersintl-website/overview',
        'buildersintl-website/architecture',
        'buildersintl-website/repo-link',
        'buildersintl-website/next-steps',
      ],
    },
    {
      type: 'category',
      label: 'DBC',
      items: [
        'DBC/overview',
        'DBC/architecture',
        'DBC/next-steps',
        'DBC/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'FPD Sage Sync',
      items: [
        'FPD-Sage-Sync/overview',
        'FPD-Sage-Sync/architecture',
        'FPD-Sage-Sync/next-steps',
        'FPD-Sage-Sync/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'FoundryOne',
      items: [
        'FoundryOne/overview',
        'FoundryOne/architecture',
        'FoundryOne/next-steps',
        'FoundryOne/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'Num Spoofer',
      items: [
        'Num_Spoofer/overview',
        'Num_Spoofer/architecture',
        'Num_Spoofer/next-steps',
        'Num_Spoofer/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'ProspectIQ',
      items: [
        'ProspectIQ/overview',
        'ProspectIQ/architecture',
        'ProspectIQ/next-steps',
        'ProspectIQ/repo-link',
      ],
    },
    {
      type: 'category',
      label: 'Vireo',
      items: [
        'Vireo/overview',
        'Vireo/architecture',
        'Vireo/repo-link',
        'Vireo/next-steps',
      ],
    },
  ],
};
```

### Navigation Principles

1. **Standards First:** Reference material immediately accessible at top of sidebar
2. **Alphabetical Projects:** Easy scanning and predictable location
3. **Human-Readable Labels:** Use spaces and proper capitalization
4. **Consistent Structure:** Every project and standards section follows same pattern
5. **Collapsible Categories:** Each section can expand/collapse independently

## 6. Cleanup Strategy for Heavy Dependencies

### Purpose

Ensure local repositories remain clean after comprehensive documentation extraction without affecting source code.

### Cleanup Targets

**Node.js Projects:**
- `node_modules/` - Installed dependencies
- `build/`, `dist/`, `.next/` - Build artifacts
- `coverage/` - Test coverage reports

**Python Projects:**
- `__pycache__/`, `*.pyc` - Python cache files
- `venv/`, `env/` - Virtual environments

**Other Languages:**
- `vendor/` - PHP/Go/Ruby dependencies
- `.gradle/`, `target/` - Java/Gradle build files
- `bin/`, `obj/` - .NET build artifacts

### Cleanup Process

**Per Project After Documentation:**

1. **Identify size before cleanup:**
   ```bash
   cd ~/Developer/[project-name]
   du -sh node_modules build dist .next vendor __pycache__ coverage target 2>/dev/null | sort -hr
   ```

2. **Remove generated/installed files:**
   ```bash
   rm -rf node_modules build dist .next vendor __pycache__ coverage target .gradle bin obj venv env
   ```

3. **Verify cleanup:**
   ```bash
   du -sh .
   ```

4. **Document freed space in progress updates**

### Safety Measures

- Only clean generated/installed dependencies, never source code
- Verify correct directory before deletion commands
- Use `2>/dev/null` to suppress errors for non-existent directories
- Preserve all source files, configs, and version control
- Document cleanup actions in commit messages

### Cleanup Schedule

- Immediate cleanup after each project documentation is complete
- Final verification pass after all 6 projects documented
- Report total disk space freed

## 7. Implementation Approach

### Phase 1: Standards Documentation (Priority)

1. Create folder structure for 3 standards sections
2. Document Infrastructure tooling (CrowdSec, Uptime Kuma, Cloudflare, PostHog)
3. Extract and adapt egi-ci:cd workflows
4. Document CI/CD & Deployment processes
5. Create Code Quality standards and best practices
6. Update sidebar navigation to include standards sections

### Phase 2: Project Documentation

**For each of 6 projects:**
1. Explore repository structure
2. Extract comprehensive information per extraction approach (Section 3)
3. Create 4-page documentation structure
4. Cross-reference to relevant standards
5. Clean up heavy dependencies immediately
6. Update sidebar navigation

**Project Order:**
- Alphabetical order for consistency
- Allows parallel work if needed

### Phase 3: Integration & Review

1. Update main index.md with new sections
2. Verify all internal links work
3. Test site build locally
4. Final cleanup verification
5. Commit all changes

## 8. Success Criteria

**Documentation Completeness:**
- ✅ 3 standards sections with 4-5 pages each
- ✅ 6 new project sections with 4 pages each
- ✅ egi-ci:cd workflows integrated and documented
- ✅ All cross-references working
- ✅ Sidebar navigation updated

**Quality Standards:**
- ✅ Comprehensive technical details for developers
- ✅ Accessible explanations for stakeholders
- ✅ Consistent formatting across all sections
- ✅ No placeholder content or TODOs
- ✅ Security-conscious documentation

**Technical:**
- ✅ Site builds without errors
- ✅ All markdown links resolve correctly
- ✅ No heavy dependencies left in repos
- ✅ Git repository clean and committed

## 9. Out of Scope

The following are explicitly out of scope for this update:

- Updating existing 8 project documentation sections
- Documenting builders-docs deployment process
- Creating visual diagrams or screenshots
- Setting up actual CI/CD workflows (only documenting them)
- Implementing any infrastructure changes
- Modifying project source code
- Creating automated documentation generation

## 10. Risks & Mitigations

**Risk:** Project repositories may lack comprehensive READMEs or documentation
**Mitigation:** Extract information directly from source code, configs, and package files

**Risk:** egi-ci:cd workflows may be project-specific and hard to generalize
**Mitigation:** Document adaptations clearly, provide multiple examples, include troubleshooting

**Risk:** Heavy dependencies cleanup might accidentally remove important files
**Mitigation:** Only delete known generated/installed directories, verify paths before deletion

**Risk:** Documentation may become outdated as projects evolve
**Mitigation:** Establish "next-steps" sections noting what needs updating, encourage culture of documentation updates

## 11. Future Enhancements (Post-Implementation)

- Automated documentation generation from code comments
- Visual architecture diagrams using mermaid.js
- Automated link checking in CI/CD
- Version-specific documentation for major releases
- Integration with project management tools
- Automated changelog generation
