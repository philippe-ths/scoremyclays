---
id: TECHNICAL_SPEC
title: ScoreMyClays Technical Specification
sidebar_label: ScoreMyClays Technical Specification
---

# ScoreMyClays Technical Specification

## 1. Technology Stack Overview

### Core Development Stack
- **AI-Assisted Development**: Claude Code for codebase structure and business logic
- **UI Generation**: V0 for React component generation with Tailwind CSS
- **Deployment Platform**: Vercel with edge functions and global CDN
- **Database**: Supabase Postgres with Row-Level Security
- **Offline Sync**: PowerSync for offline-first architecture
- **API Layer**: tRPC with Zod validation for end-to-end type safety
- **Database ORM**: Prisma Edge for optimized edge runtime performance

### Supporting Technologies
- **Frontend Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS (V0 generated)
- **State Management**: TanStack Query for server state caching
- **Authentication**: Supabase Auth with social providers
- **Testing**: Playwright for E2E testing
- **Analytics**: Vercel Analytics + Supabase Log Drains

## 2. Architecture Overview

### Offline-First Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile PWA    │    │   Vercel Edge   │    │   Supabase      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ React UI    │ │    │ │ tRPC API    │ │    │ │ Postgres    │ │
│ │ (V0 Generated)│ │    │ │ Handlers    │ │    │ │ Database    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ PowerSync   │ │◄──►│ │ PowerSync   │ │◄──►│ │ PowerSync   │ │
│ │ Client      │ │    │ │ Service     │ │    │ │ Integration │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Local       │ │    │ │ Edge        │ │    │ │ Auth &      │ │
│ │ SQLite      │ │    │ │ Functions   │ │    │ │ Storage     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Architectural Principles
1. **Offline-First**: All critical functions work without internet connectivity
2. **Edge-Optimized**: &lt;50ms latency globally using Vercel Edge Functions
3. **Type-Safe**: End-to-end TypeScript with tRPC and Zod validation
4. **Mobile-First**: PWA with native app-like experience
5. **Real-time**: Live updates for competition scoring and leaderboards

## 3. Database Schema Design

### Core Tables (Prisma Schema)
```prisma
// User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?
  classification String?  // UK: A, B, C, D
  cpsa_number   String?   @unique
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt
  
  rounds        Round[]
  club_memberships ClubMembership[]
  
  @@map("users")
}

// Shooting Rounds
model Round {
  id          String      @id @default(cuid())
  user_id     String
  discipline  Discipline
  ground_id   String?
  date        DateTime    @default(now())
  targets     Int
  score       Int
  percentage  Float
  weather     String?
  notes       String?
  synced      Boolean     @default(false)
  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt
  
  user        User        @relation(fields: [user_id], references: [id])
  ground      Ground?     @relation(fields: [ground_id], references: [id])
  shots       Shot[]
  
  @@map("rounds")
}

// Individual Shots
model Shot {
  id          String   @id @default(cuid())
  round_id    String
  station     Int
  target      Int
  hit         Boolean
  created_at  DateTime @default(now())
  
  round       Round    @relation(fields: [round_id], references: [id])
  
  @@map("shots")
}

// Shooting Grounds
model Ground {
  id          String  @id @default(cuid())
  name        String
  location    String
  postcode    String
  latitude    Float?
  longitude   Float?
  facilities  Json?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  rounds      Round[]
  competitions Competition[]
  
  @@map("grounds")
}

// Competition Management
model Competition {
  id          String         @id @default(cuid())
  name        String
  ground_id   String
  date        DateTime
  discipline  Discipline
  entry_fee   Float?
  max_entries Int?
  status      CompetitionStatus
  created_at  DateTime       @default(now())
  
  ground      Ground         @relation(fields: [ground_id], references: [id])
  entries     CompetitionEntry[]
  
  @@map("competitions")
}

// Enums
enum Discipline {
  ESP
  DTL
  SKEET
  TRAP
  SPORTING
}

enum CompetitionStatus {
  OPEN
  CLOSED
  CANCELLED
  COMPLETED
}
```

### PowerSync Integration Schema
```sql
-- PowerSync sync rules for offline capability
CREATE TABLE sync_rules (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  sync_data JSONB,
  last_sync TIMESTAMP DEFAULT NOW()
);

-- Offline queue for unsynced changes
CREATE TABLE offline_queue (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. API Design (tRPC Procedures)

### Authentication Procedures
```typescript
// auth/auth.router.ts
export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6)
    }))
    .mutation(async ({ input, ctx }) => {
      // Supabase auth implementation
    }),
    
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2)
    }))
    .mutation(async ({ input, ctx }) => {
      // User creation with Supabase
    }),
    
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      // Return user profile data
    })
});
```

### Scoring Procedures
```typescript
// scoring/scoring.router.ts
export const scoringRouter = router({
  createRound: protectedProcedure
    .input(z.object({
      discipline: z.enum(['ESP', 'DTL', 'SKEET', 'TRAP', 'SPORTING']),
      ground_id: z.string().optional(),
      targets: z.number().min(1).max(200),
      weather: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Create new scoring round
    }),
    
  recordShot: protectedProcedure
    .input(z.object({
      round_id: z.string(),
      station: z.number().min(1),
      target: z.number().min(1),
      hit: z.boolean()
    }))
    .mutation(async ({ input, ctx }) => {
      // Record individual shot with offline queue
    }),
    
  getRounds: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
      discipline: z.enum(['ESP', 'DTL', 'SKEET', 'TRAP', 'SPORTING']).optional()
    }))
    .query(async ({ input, ctx }) => {
      // Return paginated rounds with analytics
    })
});
```

### Analytics Procedures
```typescript
// analytics/analytics.router.ts
export const analyticsRouter = router({
  getPerformanceStats: protectedProcedure
    .input(z.object({
      discipline: z.enum(['ESP', 'DTL', 'SKEET', 'TRAP', 'SPORTING']).optional(),
      date_from: z.date().optional(),
      date_to: z.date().optional()
    }))
    .query(async ({ input, ctx }) => {
      // Return performance analytics
    }),
    
  getLeaderboard: protectedProcedure
    .input(z.object({
      discipline: z.enum(['ESP', 'DTL', 'SKEET', 'TRAP', 'SPORTING']),
      timeframe: z.enum(['week', 'month', 'year']).default('month')
    }))
    .query(async ({ input, ctx }) => {
      // Return leaderboard data
    })
});
```

## 5. Offline Synchronization Strategy

### PowerSync Configuration
```typescript
// lib/powersync.ts
import { PowerSyncDatabase } from '@powersync/react-native';

export const db = new PowerSyncDatabase({
  schema: {
    rounds: {
      id: 'text',
      user_id: 'text',
      discipline: 'text',
      score: 'integer',
      synced: 'integer'
    },
    shots: {
      id: 'text',
      round_id: 'text',
      station: 'integer',
      target: 'integer',
      hit: 'integer'
    }
  },
  
  // Sync rules for offline data
  syncRules: {
    rounds: `
      SELECT * FROM rounds 
      WHERE user_id = current_user_id()
    `,
    shots: `
      SELECT shots.* FROM shots
      INNER JOIN rounds ON shots.round_id = rounds.id
      WHERE rounds.user_id = current_user_id()
    `
  }
});
```

### Conflict Resolution
```typescript
// lib/sync-manager.ts
export class SyncManager {
  async handleConflict(localData: any, remoteData: any) {
    // Last-write-wins for score updates
    if (localData.updated_at > remoteData.updated_at) {
      return localData;
    }
    
    // Merge shot arrays for complete rounds
    if (localData.shots && remoteData.shots) {
      const mergedShots = this.mergeShots(localData.shots, remoteData.shots);
      return { ...remoteData, shots: mergedShots };
    }
    
    return remoteData;
  }
  
  private mergeShots(localShots: Shot[], remoteShots: Shot[]) {
    // Merge by station and target, prefer local for conflicts
    const shotMap = new Map();
    
    remoteShots.forEach(shot => {
      shotMap.set(`${shot.station}-${shot.target}`, shot);
    });
    
    localShots.forEach(shot => {
      shotMap.set(`${shot.station}-${shot.target}`, shot);
    });
    
    return Array.from(shotMap.values());
  }
}
```

## 6. Performance Optimization

### Edge Function Optimization
```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/router';

export const runtime = 'edge';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({
      // Edge-optimized context
    }),
  });

export { handler as GET, handler as POST };
```

### Database Query Optimization
```typescript
// lib/queries/performance.ts
export const getUserPerformance = async (userId: string, discipline?: string) => {
  const query = db.selectFrom('rounds')
    .where('user_id', '=', userId)
    .where('synced', '=', true)
    .$if(discipline !== undefined, (qb) => qb.where('discipline', '=', discipline!))
    .select([
      'discipline',
      'score',
      'targets',
      'date',
      (eb) => eb.fn.avg('score').as('avg_score'),
      (eb) => eb.fn.count('id').as('round_count')
    ])
    .groupBy(['discipline'])
    .orderBy('date', 'desc');
    
  return await query.execute();
};
```

## 7. Security Implementation

### Row-Level Security (Supabase)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Rounds access control
CREATE POLICY "Users can view own rounds" ON rounds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rounds" ON rounds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shots access control
CREATE POLICY "Users can view own shots" ON shots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rounds 
      WHERE rounds.id = shots.round_id 
      AND rounds.user_id = auth.uid()
    )
  );
```

### API Security
```typescript
// lib/trpc/context.ts
import { createServerSideHelpers } from '@trpc/react-query/server';
import { createClient } from '@supabase/supabase-js';

export const createContext = async (req: Request) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token);
    return { user, supabase };
  }
  
  return { user: null, supabase };
};

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

## 8. PWA Configuration

### Service Worker (Offline Capabilities)
```typescript
// public/sw.js
const CACHE_NAME = 'scoremyclays-v1';
const urlsToCache = [
  '/',
  '/scoring',
  '/analytics',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### Manifest Configuration
```json
{
  "name": "ScoreMyClays",
  "short_name": "ScoreMyClays",
  "description": "Clay pigeon shooting scoring app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#D2691E",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 9. Development Workflow

### AI-Assisted Development Process
1. **UI Generation**: Use V0 to create component mockups from design requirements
2. **Code Structure**: Claude Code organizes components into proper architecture
3. **API Development**: Generate tRPC procedures with proper validation
4. **Database Schema**: Create Prisma models with PowerSync integration
5. **Testing**: Playwright tests for critical user journeys
6. **Deployment**: Automatic deployment to Vercel on git push

### Environment Configuration
```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POWERSYNC_URL=your_powersync_url
POWERSYNC_JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

## 10. Deployment Strategy

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/trpc/**": {
      "runtime": "edge"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm run test
      - name: Build project
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 11. Testing Strategy

### E2E Testing with Playwright
```typescript
// tests/scoring.spec.ts
import { test, expect } from '@playwright/test';

test('complete scoring round offline', async ({ page }) => {
  await page.goto('/scoring');
  
  // Start new round
  await page.click('[data-testid="start-round"]');
  await page.selectOption('[data-testid="discipline"]', 'ESP');
  await page.fill('[data-testid="targets"]', '50');
  await page.click('[data-testid="begin-round"]');
  
  // Record some shots
  for (let i = 0; i < 10; i++) {
    await page.click('[data-testid="hit-button"]');
  }
  
  // Verify score
  await expect(page.locator('[data-testid="current-score"]')).toHaveText('10');
  
  // Complete round
  await page.click('[data-testid="complete-round"]');
  await expect(page.locator('[data-testid="final-score"]')).toHaveText('10/50 (20%)');
});
```

This technical specification provides a comprehensive guide for implementing ScoreMyClays using the chosen AI-assisted development stack with robust offline capabilities and professional presentation suitable for the UK clay shooting market.