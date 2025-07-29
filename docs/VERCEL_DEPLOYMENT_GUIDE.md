# Vercel Deployment Guide - ScoreMyClays PWA

## Architecture Overview

This guide covers the deployment strategy for the **ScoreMyClays Progressive Web Application**. The project has a clear separation:

1. **📚 Documentation Site** - Docusaurus for local development and reference
2. **📱 ScoreMyClays PWA** - Next.js offline-first progressive web app (deployed to Vercel)

## Current Setup

### Documentation (Local Only)
The Docusaurus documentation site is designed for **local development only**:

```bash
cd Docusaurus
npm install
npm start
# Opens http://localhost:3000
```

This provides a rich local documentation experience for developers without the complexity of deployment.

### PWA Application (Future Vercel Deployment)
When ready to deploy the ScoreMyClays PWA, it will be a separate Next.js project deployed to Vercel.

## PWA Deployment Strategy

### Environment Setup (Future)

When you create the ScoreMyClays PWA, you'll use this **3-environment approach**:

- **Development** (`dev`) - Local development with hot reloading
- **Preview** (`preview`) - Feature branch deployments for testing
- **Production** (`production`) - Live PWA application (`main` branch)

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **Git Repository**: Your PWA code should be in a Git repository

## PWA Project Setup (When Ready)

### 1. Create Next.js PWA Project

```bash
# Create the PWA application (separate from this documentation repo)
npx create-next-app@latest scoremyclays-app --typescript --tailwind --app
cd scoremyclays-app

# Install PWA dependencies
npm install next-pwa @powersync/web @supabase/supabase-js
npm install -D @types/node
```

### 2. Configure PWA

Following the technical architecture in `/docs/TECHNICAL_ARCHITECTURE.md`:

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  experimental: {
    appDir: true
  },
  env: {
    NEXT_PUBLIC_POWERSYNC_URL: process.env.NEXT_PUBLIC_POWERSYNC_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
});
```

### 3. Deploy to Vercel

```bash
# In your PWA project directory
vercel login
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Configuration (PWA)

### Branch → Environment Mapping

- `main` branch → **Production** environment
- All other branches → **Preview** environment
- Local development → **Development** environment

### Environment Variables

Set these in Vercel Dashboard for the PWA project:

```bash
# Required for PWA
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_POWERSYNC_URL=your_powersync_url

# Environment-specific
NODE_ENV=production     # Production only
NODE_ENV=development    # Development only

# Optional
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

## Domain Configuration (PWA)

### Recommended Domain Setup

- **Production**: `app.scoremyclays.com` (PWA application)
- **Documentation**: Local only (`localhost:3000`)
- **Preview**: Auto-generated Vercel URLs

### Setting Up Custom Domain

1. **Add Domain in Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add `app.scoremyclays.com`

2. **DNS Configuration:**
   ```
   # CNAME Record
   app → cname.vercel-dns.com
   ```

## PWA Technical Requirements

Based on `/docs/TECHNICAL_ARCHITECTURE.md`, the PWA will include:

### Core Technologies
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** + shadcn/ui components
- **PowerSync SDK** for offline synchronization
- **Supabase** for backend services
- **Service Workers** for offline capability

### Performance Targets
- **Scoring Response Time**: < 100ms for HIT/MISS buttons
- **App Load Time**: < 3 seconds on 3G connection
- **Offline Capability**: 100% core functionality available offline
- **Sync Time**: < 5 seconds for session sync when online

### PWA Manifest
```json
{
  "name": "ScoreMyClays",
  "short_name": "ScoreMyClays",
  "description": "Clay shooting scoring app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Current Documentation Workflow

For now, with Docusaurus remaining local:

### Local Documentation Development

```bash
# Start documentation site
cd Docusaurus
npm install
npm start

# Make documentation changes
# Edit files in /docs/ directory
# Changes appear immediately in browser
```

### Documentation Maintenance

1. **Edit Documentation**: Modify files in `/docs/` directory
2. **Preview Locally**: Use `npm start` in Docusaurus directory
3. **Version Control**: Commit documentation changes to Git
4. **Share**: Documentation changes are available to all developers locally

## Future Integration

When the PWA is deployed:

1. **PWA Repository**: Separate Git repository for the PWA application
2. **Documentation Reference**: PWA developers reference this local documentation
3. **Architecture Alignment**: PWA follows specifications in `/docs/TECHNICAL_ARCHITECTURE.md`
4. **Deployment Independence**: Documentation and PWA deploy separately

## Benefits of This Approach

1. **Simplified Development**: No deployment complexity for documentation
2. **Fast Iteration**: Instant documentation updates locally
3. **Clear Separation**: Documentation and application concerns separated
4. **Cost Effective**: No hosting costs for documentation
5. **Developer Focused**: Documentation serves development team primarily

## CLI Commands Reference (PWA)

### Essential PWA Deployment Commands

```bash
# PWA project setup
npx create-next-app@latest scoremyclays-app --typescript --tailwind --app

# Link to Vercel
vercel login
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# Environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env pull .env.local
```

### Documentation Commands

```bash
# Local documentation
cd Docusaurus && npm start

# Build documentation (for testing)
cd Docusaurus && npm run build

# Serve built documentation
cd Docusaurus && npm run serve
```

## Support

- **Next.js PWA**: [nextjs.org/docs](https://nextjs.org/docs)
- **PowerSync**: [powersync.co/docs](https://powersync.co/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: Use this repository's issue tracker

---

**Next Steps**: 
1. Continue developing with local Docusaurus documentation
2. When ready for PWA development, create separate Next.js project
3. Follow technical architecture specifications in `/docs/TECHNICAL_ARCHITECTURE.md`