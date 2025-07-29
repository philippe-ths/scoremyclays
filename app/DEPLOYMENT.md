# ScoreMyClays Deployment Guide

## Quick Deploy to Vercel

### One-Click Deploy
The fastest way to deploy ScoreMyClays is using Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

### Environment Variables
Configure these in Vercel Dashboard or via CLI:

```bash
# Optional: For cloud sync (leave empty for offline-only)
NEXT_PUBLIC_POWERSYNC_URL=your_powersync_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Manual Deployment

### Build Process
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build for production
npm run build

# Test production build locally
npm start
```

### Build Outputs
- **Static files**: `/.next/static/`
- **PWA assets**: `/public/sw.js`, `/public/workbox-*.js`
- **App routes**: Server-side rendered pages

## PWA Configuration

### Required Assets
Create these icon sizes in `/public/icons/`:
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)

### Manifest Settings
The PWA manifest is configured in `/public/manifest.json` with:
- Clay shooting specific metadata
- Offline-first capabilities
- Touch-friendly shortcuts

## Performance Optimization

### Production Checklist
- [ ] Icons optimized and properly sized
- [ ] Environment variables configured
- [ ] PWA manifest includes all required fields
- [ ] Service worker enabled (automatic via next-pwa)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build completes successfully (`npm run build`)

### Performance Targets
- **First Load**: < 100kB JavaScript bundle
- **PWA Score**: 90+ on Lighthouse
- **Offline**: Core functionality works without internet

## Custom Domain

### Vercel Domain Setup
1. Add domain in Vercel Dashboard
2. Configure DNS (A/CNAME records)
3. SSL automatically provisioned

### Recommended Structure
- **Production**: `app.scoremyclays.com`
- **Staging**: `staging.scoremyclays.com`
- **Development**: Local development

## Monitoring

### Built-in Monitoring
- Next.js analytics (automatic)
- PWA performance metrics
- Service worker statistics

### Optional Integrations
- Vercel Analytics (set `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`)
- Error tracking (Sentry, etc.)
- Performance monitoring

## Troubleshooting

### Common Issues

1. **PWA not installing**
   - Check manifest.json is valid
   - Ensure HTTPS (required for PWA)
   - Verify service worker is registered

2. **Build failures**
   - Run `npm run type-check` for TypeScript errors
   - Check all imports are properly typed
   - Ensure all dependencies are installed

3. **Offline functionality not working**
   - Service worker may be disabled in development
   - Check browser cache and clear if needed
   - Verify PWA configuration in next.config.js

### Debug Commands
```bash
# Check build
npm run build

# Check types
npm run type-check

# Check linting
npm run lint

# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Environment

### Environment Variables
```env
# Required for Vercel deployment
NODE_ENV=production

# Optional: Database and sync
NEXT_PUBLIC_POWERSYNC_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

### Security Considerations
- Environment variables properly scoped (NEXT_PUBLIC_ for client-side)
- No sensitive keys exposed to client
- HTTPS enforced for PWA functionality
- Service worker scope properly configured

This scaffold is ready for production deployment with minimal configuration!