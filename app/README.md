# ScoreMyClays PWA

This is the **ScoreMyClays Progressive Web Application** - an offline-first clay shooting scoring app built with Next.js 14+.

## Architecture

This PWA follows the technical architecture specified in `/docs/TECHNICAL_ARCHITECTURE.md`:

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Offline Sync**: PowerSync SDK for bidirectional synchronization
- **Database**: Supabase PostgreSQL with Row-Level Security
- **PWA Features**: Service workers, offline capability, installable

## Project Structure

```
app/
├── src/                    # Source code (to be created)
├── public/                 # Static assets
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js + PWA configuration
├── vercel.json           # Vercel deployment configuration
├── tsconfig.json         # TypeScript configuration
└── .env.example          # Environment variables template
```

## Quick Start

### Prerequisites

1. Node.js 18+ installed
2. Copy `.env.example` to `.env.local` and configure variables

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_POWERSYNC_URL=your_powersync_endpoint

# Optional
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

## PWA Features

- **Offline-First**: Core functionality works without internet
- **Installable**: Can be installed as native app
- **Service Workers**: Background sync and caching
- **Responsive**: Optimized for mobile devices
- **Performance**: Sub-100ms response times for scoring

## Deployment to Vercel

### Setup

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login and Link**:
   ```bash
   vercel login
   vercel link
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

### Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Strategy

- **Development**: Local development (`npm run dev`)
- **Preview**: Feature branch deployments (automatic)
- **Production**: Main branch deployment (automatic)

## Domain Configuration

Recommended domain setup:
- **Production**: `app.scoremyclays.com`
- **Preview**: Auto-generated Vercel URLs

## Technical Specifications

### Performance Targets
- **Scoring Response Time**: < 100ms for HIT/MISS buttons
- **App Load Time**: < 3 seconds on 3G connection
- **Offline Capability**: 100% core functionality available offline
- **Sync Time**: < 5 seconds for session sync when online

### Browser Support
- **Primary**: Chrome, Safari, Firefox (modern versions)
- **Mobile**: iOS Safari, Android Chrome
- **PWA Features**: Service workers, app installation

## Development Guidelines

1. **Mobile-First**: Design for mobile devices first
2. **Offline-First**: Ensure core features work offline
3. **Performance**: Optimize for fast loading and smooth interactions
4. **Accessibility**: Follow WCAG guidelines
5. **TypeScript**: Use strict TypeScript for type safety

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Support

- **Documentation**: See `/docs/` directory in project root
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **PowerSync**: [powersync.co/docs](https://powersync.co/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

**Status**: 🚧 Scaffold ready for development

**Next Steps**: 
1. Set up Supabase and PowerSync
2. Install dependencies (`npm install`)
3. Configure environment variables
4. Start building the application components