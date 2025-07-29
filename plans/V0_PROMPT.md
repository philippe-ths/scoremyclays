# v0 UI/UX Generation Prompt for ScoreMyClays

## Project Overview
You are building UI/UX components for **ScoreMyClays**, an offline-first Progressive Web App for clay pigeon shooting score tracking, specifically focused on Sporting Clays.

## Context Documents
Before starting, please review these project documents:
- `/docs/FUNCTIONAL_SPECIFICATION.md` - Complete app requirements and user flows
- `/docs/TECHNICAL_ARCHITECTURE.md` - Technical stack and architecture decisions
- `/app/src/types/index.ts` - Complete TypeScript definitions for clay shooting domain
- `/app/README.md` - Development scaffold overview and integration guidelines

## Current Scaffold State
The project has a complete Next.js 14 scaffold running at `http://localhost:3000` with:
- ✅ TypeScript types for clay shooting domain
- ✅ React Context for state management (`useScoring()` hook)
- ✅ Tailwind CSS with clay shooting specific utilities
- ✅ PWA configuration for offline functionality
- ✅ shadcn/ui compatible component structure

## Design Requirements

### Clay Shooting Specific
- **Mobile-First**: Designed for outdoor use on smartphones
- **Touch-Friendly**: Minimum 44px touch targets, easy to use with gloves
- **High Contrast**: Visible in bright outdoor conditions
- **Offline-First**: Works without internet connectivity
- **Fast**: Sub-100ms response for scoring buttons

### Color Scheme
```css
/* Pre-configured in Tailwind */
--hit: 142 76% 36%;     /* Green for hits */
--miss: 0 84% 60%;      /* Red for misses */
--no-bird: 221 83% 53%; /* Blue for no birds */
--warning: 38 92% 50%;  /* Orange for warnings */
```

### Component Classes Available
```css
/* Button variants */
.btn-hit, .btn-miss, .btn-no-bird, .btn-secondary
/* Sizes */
.touch-target, .touch-lg
/* Layouts */
.position-card, .session-card, .score-large, .score-medium
```

## Task List Request
**Before generating any components, please provide a detailed task list of what you plan to create, including:**

1. Component priorities (which to build first)
2. Integration points with existing scaffold
3. State management approach using `useScoring()` hook
4. File structure and naming conventions
5. Responsive design considerations
6. Accessibility features for outdoor use

## Components to Generate

### Priority 1: Core Scoring Interface
1. **Scoring Screen** (`/src/components/scoring/scoring-screen.tsx`)
   - Large HIT/MISS/NO BIRD buttons with touch-friendly sizing
   - Current target display (e.g., "Target 5 of 10")
   - Position progress and running score
   - Undo last shot functionality
   - Position completion flow

2. **Session Setup Modal** (enhance existing `/src/components/scoring/session-setup-modal.tsx`)
   - Ground name and shooter name inputs
   - Form validation with clay shooting specific rules
   - Mobile-optimized input fields

### Priority 2: Navigation & Overview
3. **Session History** (enhance existing `/src/components/scoring/session-history.tsx`)
   - Grouped by shooting ground
   - Session cards with score summaries
   - Complete/In Progress status indicators
   - Touch-friendly list items

4. **Position Setup Screen** (`/src/components/scoring/position-setup.tsx`)
   - Position naming (e.g., "High Tower", "Rabbit Run")
   - Position number display (1-10)
   - Navigation between positions

### Priority 3: Results & Summary
5. **Position Complete Screen** (`/src/components/scoring/position-complete.tsx`)
   - Position score display
   - Shot-by-shot breakdown
   - Continue to next position flow

6. **Session Complete Screen** (`/src/components/scoring/session-complete.tsx`)
   - Final scorecard display (position breakdown)
   - Total score and percentage
   - Session summary and sharing options

## Integration Requirements

### State Management
Use the existing `useScoring()` hook:
```typescript
const { state, recordShot, undoLastShot, setupPosition } = useScoring()
// state.currentSession, state.currentPosition, state.currentTarget
```

### Type Safety
Import and use existing types:
```typescript
import { Session, Position, Shot, ShotResult } from '@/types'
// ShotResult = 'hit' | 'miss' | 'no-bird'
```

### Component Structure
Follow existing patterns:
```typescript
// Use existing UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Clay shooting specific styling
<Button variant="hit" size="touch-lg">HIT</Button>
<Button variant="miss" size="touch-lg">MISS</Button>
<Button variant="no-bird" size="touch-lg">NO BIRD</Button>
```

## User Experience Requirements

### Sporting Clays Workflow
1. **Session Start**: Ground name → Shooter name → First position
2. **Position Flow**: Position name → 10 targets → Position complete → Next position
3. **Scoring**: Simple tap workflow for each target result
4. **Error Handling**: Easy undo for mis-taps, clear error states
5. **Completion**: Session summary with position-by-position breakdown

### Mobile UX Priorities
- **One-handed operation** where possible
- **Clear visual feedback** for all actions
- **Minimal input required** during scoring
- **Obvious navigation** between screens
- **Offline indicators** and sync status

## Technical Constraints

### Performance
- Components must render in <50ms
- Smooth animations for button presses
- Efficient re-renders during rapid scoring

### Accessibility
- Screen reader support for score announcements
- High contrast mode compatibility
- Keyboard navigation fallbacks

### PWA Compatibility
- Touch gestures and haptic feedback
- Proper viewport handling
- Safe area considerations for notched devices

## File Placement
Place generated components in:
- `/src/components/scoring/` - Main clay shooting components
- `/src/components/ui/` - Reusable UI components
- Update existing files rather than replacing them

## Success Criteria
✅ Components integrate seamlessly with existing scaffold
✅ Touch-friendly for outdoor clay shooting use
✅ Maintains state correctly using existing context
✅ Works offline without degradation
✅ Follows clay shooting domain rules (10 positions × 10 targets)
✅ Mobile-responsive and accessible

**Please provide your task list and implementation plan before generating the components.**