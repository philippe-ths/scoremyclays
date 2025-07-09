# ScoreMyClays Documentation Site

This is the Docusaurus documentation site for the ScoreMyClays project.

## Local Development

```bash
npm install
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The site is automatically deployed to Vercel when changes are pushed to the main branch.

Visit: https://scoremyclays-docs.vercel.app

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
- Broken Links Report - Documentation maintenance report

## Adding New Documentation

1. Create a new markdown file in the `docs/` directory
2. Add frontmatter with appropriate metadata
3. Update the sidebar configuration in `sidebars.ts` if needed
4. The site will automatically rebuild and deploy

## Configuration

The site is configured through `docusaurus.config.ts` with ScoreMyClays-specific settings:

- Title: ScoreMyClays
- Tagline: Clay pigeon shooting scoring and performance tracking
- URL: https://scoremyclays-docs.vercel.app
- GitHub: https://github.com/ianmarr/scoremyclays

## Technology

- **Framework**: Docusaurus 3.8+
- **Language**: TypeScript
- **Deployment**: Vercel
- **Styling**: CSS with Docusaurus theming