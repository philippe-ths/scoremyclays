# ScoreMyClays Documentation Site

This is the **local-only** Docusaurus documentation site for the ScoreMyClays project. It provides rich documentation for developers working on the ScoreMyClays PWA.

## Local Development

```bash
npm install
npm start
```

This command starts a local development server and opens up a browser window at `http://localhost:3000`. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service for testing purposes.

## Documentation Structure

The documentation is organized into the following sections:

### Getting Started
- Service Description - Overview of the ScoreMyClays concept
- Functional Specification - Complete functional requirements
- Technical Specification - Implementation guide and architecture

### Business Analysis
- Feasibility Analysis - Market analysis and business case
- Features - Feature specifications and requirements

### Design & UX
- Design Guides - Complete UI/UX design system including UX guide, UI guide, and component specifications

### Project Information
- Document Index - Navigation guide for all documentation
- Vercel Deployment Guide - PWA deployment strategy

## Architecture Overview

This documentation site supports the ScoreMyClays project architecture:

1. **📚 Documentation Site** (this) - Local Docusaurus for developer reference
2. **📱 ScoreMyClays PWA** (future) - Next.js offline-first progressive web app

## Adding New Documentation

1. Create a new markdown file in the `../docs/` directory
2. Add frontmatter with appropriate metadata
3. Update the sidebar configuration in `sidebars.ts` if needed
4. The local site will automatically rebuild when you refresh

## Configuration

The site is configured through `docusaurus.config.ts` with ScoreMyClays-specific settings:

- Title: ScoreMyClays
- Tagline: Clay pigeon shooting scoring and performance tracking
- GitHub: https://github.com/ianmarr/scoremyclays
- Local URL: http://localhost:3000

## Development Workflow

### Documentation Updates
1. **Edit**: Modify files in `../docs/` directory
2. **Preview**: Run `npm start` to see changes locally
3. **Commit**: Version control your documentation changes
4. **Share**: Other developers can run locally to see updates

### PWA Development Reference
- Use this documentation as reference for PWA development
- Follow technical architecture in `/docs/TECHNICAL_ARCHITECTURE.md`
- Reference functional specs in `/docs/FUNCTIONAL_SPECIFICATION.md`

## Technology

- **Framework**: Docusaurus 3.8+
- **Language**: TypeScript
- **Deployment**: Local development only
- **Purpose**: Developer documentation and reference

## Benefits of Local-Only Documentation

1. **Fast Iteration**: Instant updates without deployment delays
2. **Simple Setup**: No hosting configuration required
3. **Developer Focused**: Serves development team primarily
4. **Cost Effective**: No hosting costs
5. **Version Aligned**: Documentation stays in sync with code

## Future PWA Deployment

When ready to create the ScoreMyClays PWA:

1. **Separate Project**: Create new Next.js project
2. **Reference Documentation**: Use this local documentation as specification
3. **Deploy PWA**: Deploy PWA to Vercel as separate project
4. **Domain Strategy**: `app.scoremyclays.com` for PWA

See `/docs/VERCEL_DEPLOYMENT_GUIDE.md` for complete PWA deployment strategy.

---

**Quick Start**: `npm start` → Opens documentation at http://localhost:3000