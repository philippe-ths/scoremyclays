---
id: FUNCTIONAL_SPECIFICATION
title: ScoreMyClays Functional Specification
sidebar_label: Functional Specification
---

# ScoreMyClays Functional Specification

## Executive Summary

ScoreMyClays is an **offline-first Progressive Web Application** designed specifically for clay pigeon shooting scoring and performance tracking. Starting with a focused MVP for Sporting Clays, the service provides reliable, mobile-optimized scoring that works seamlessly both online and offline, addressing the critical connectivity challenges at UK shooting grounds.

## Core Value Proposition

**"Simple, reliable clay shooting score tracking that works anywhere, anytime - with or without an internet connection."**

## Target Market

### Primary Market: UK Clay Shooting Community
- **60,000 regular UK clay shooters** who generate 96% of shooting activity
- Focus on **Sporting Clays discipline** (most popular format)
- **Mobile-first approach** for on-range usage
- **Recreational and competitive shooters** seeking digital scoring solutions

### Market Pain Points Addressed
- **Poor connectivity at shooting ranges** requiring offline-first solutions
- **Lack of simple, reliable digital scoring tools** for clay shooting
- **Need for immediate score tracking** during shooting sessions
- **Desire for basic performance insights** without overwhelming complexity

## MVP Scope (Absolute Minimum)

### What's INCLUDED in MVP
✅ **Mobile-First**: Touch-friendly interface optimized for outdoor use
✅ **Offline-First**: Must work offline and synchronize with cloud when online 
✅ **Single Discipline**: Sporting Clays only (10 positions × 10 targets)
✅ **Session Setup**: Capture shooting ground name and shooter name
✅ **Position Management**: Name each position before shooting
✅ **Simple Scoring Interface**:
- Large HIT/MISS buttons (green/red)
- "No Bird" button (blue) - shot doesn't count, repeat target
- "Undo" button (gray) - reverts last action
✅ **Real-time Feedback**:
- Current shot number display (e.g., "Target 4 of 10")
- Live position score (e.g., "Position Score: 3/10")
- Running session totals and percentage
✅ **Session Completion**: Final scorecard display with breakdown
✅ **Session History**: List of past sessions grouped by shooting ground
✅ **Cloud Storage**: Automatic sync via offline-first sync engine

### What's EXCLUDED from MVP
❌ User accounts/authentication  
❌ Other disciplines (Trap, DTL, Skeet, Compak Sporting)
❌ Squad/group scoring  
❌ Analytics and charts  
❌ Historical trends analysis
❌ Data export/sharing features
❌ Social features  
❌ Advanced target types (pairs, reports)  
❌ Stand and flight tracking

## User Flow (MVP)

### Primary User Journey
1. **App Launch** → See home screen with session history
2. **Session History** → List grouped by shooting ground with dates and scores
3. **Start New Session** → Enter shooting ground name and shooter name
4. **Position Setup** → App prompts for first position name
5. **Scoring Interface** → Shows "Target 1 of 10" with scoring buttons
6. **Record Shots** → Tap HIT/MISS/NO BIRD/UNDO for each target
7. **Position Complete** → After 10 targets, shows position score and running total
8. **Next Position** → Prompts for next position name, repeat process
9. **Session Complete** → After 10 positions, displays final scorecard
10. **Return Home** → Back to session history with new session added

### Screen Flow Diagram
```
[Home: Session History List]
     ↓
[New Session: Enter Ground & Shooter Name]
     ↓
[Position 1: Enter Position Name]
     ↓
[Scoring: Position 1, Target 1-10]
- HIT/MISS/NO BIRD/UNDO buttons
- Live position score display
- Current target indicator
     ↓
[Position Summary: P1 Score + Running Total]
     ↓
[Position 2: Enter Position Name]
     ↓
[Scoring: Position 2, Target 1-10]
     ↓
... (repeat for 10 positions)
     ↓
[Final Scorecard: Complete Breakdown]
- Position-by-position scores
- Final total (e.g., 78/100)
- Session percentage
     ↓
[Return to Home Screen]
```

## Detailed Functional Requirements

### 1. Home Screen & Session History
- **Session List**: Display past sessions grouped by shooting ground
- **Session Summary**: Show date, shooter name, and final score for each session
- **Quick Access**: Most recent sessions at top of list
- **New Session Button**: Prominent button to start new session
- **Sync Status**: Visual indicator of offline/online sync status

### 2. Session Setup
- **Shooting Ground Input**: Text field for venue name (auto-suggest from history)
- **Shooter Name Input**: Text field for participant name
- **Validation**: Ensure both fields are completed before proceeding
- **Start Session**: Clear call-to-action button

### 3. Position Management
- **Position Naming**: Text input for each position (e.g., "High Tower", "Rabbit Run")
- **Position Counter**: Clear indication of current position (1 of 10)
- **Position Summary**: After completion, show position score and running totals
- **Navigation**: Easy progression to next position

### 4. Scoring Interface
- **Visual Hierarchy**: 
  - Current position name (large, prominent)
  - Target counter (e.g., "Target 4 of 10")
  - Live position score (e.g., "3/10")
- **Scoring Buttons**:
  - **HIT**: Large green button, records successful shot
  - **MISS**: Large red button, records missed shot
  - **NO BIRD**: Blue button, shot doesn't count (malfunction/no target)
  - **UNDO**: Gray button, reverses last action
- **Button Behavior**:
  - Instant visual feedback (< 100ms response)
  - Haptic feedback on mobile devices
  - Clear pressed state animation
- **Error Prevention**: Confirm before significant actions

### 5. Scorecard & Completion
- **Live Updates**: Running totals update after each position
- **Position Breakdown**: List showing score for each completed position
- **Final Summary**: Complete scorecard with:
  - Total score (e.g., 78/100)
  - Percentage (e.g., 78%)
  - Position-by-position breakdown
  - Session metadata (date, ground, shooter)

### 6. Data Management
- **Offline-First**: All data written to local storage first
- **Automatic Sync**: Background synchronization when connectivity available
- **Data Validation**: Ensure data integrity before storage
- **Session Persistence**: Never lose scoring data due to app closure or connectivity issues

## Technical Requirements

### Platform & Performance
- **Progressive Web App (PWA)**: Native app-like experience
- **Mobile-First Design**: Optimized for smartphones (375px-768px)
- **Cross-Platform**: Works on iOS, Android, and web browsers
- **Response Time**: < 100ms for scoring button interactions
- **Load Time**: < 3 seconds initial app load
- **Battery Efficiency**: Optimized for 2+ hour shooting sessions

### User Interface Requirements
- **Design Principles**:
  - Ultra-simple: One primary action per screen
  - Large touch targets: Easily accessible with gloves
  - High contrast: Visible in bright outdoor conditions
  - Minimal cognitive load: Clear visual hierarchy
- **Accessibility**:
  - Touch targets ≥ 44px (iOS guidelines)
  - Color coding with text labels
  - High contrast ratios for outdoor visibility
  - Support for screen readers

### Browser Support
- **Primary**: Chrome, Safari, Firefox (modern versions)
- **Mobile**: iOS Safari, Android Chrome
- **PWA Features**: Offline capability, app-like experience

## Success Metrics (MVP)

### Primary Validation Metrics
- **Session Completion Rate**: >80% of started sessions completed
- **Offline Usage**: >50% of sessions include offline periods
- **Sync Success Rate**: >95% successful data synchronization
- **User Retention**: >60% users complete multiple sessions
- **Performance**: &lt;100ms scoring response time consistently

### User Experience Metrics
- **Ease of Use**: Positive feedback on position-based scoring flow
- **Reliability**: Zero critical bugs in scoring and sync
- **Adoption**: 20+ completed sessions by different users
- **Mixed Usage**: Online and offline scenarios tested successfully

## MVP Assumptions & Constraints

### Key Assumptions
- Users primarily shoot Sporting Clays in 10-position sessions
- Mobile phone usage at shooting ranges is common and accepted
- Simple score tracking is more valuable than complex features for MVP
- Offline-first approach is critical due to poor range connectivity
- Position-based scoring workflow matches real shooting practices

### Technical Constraints
- **MVP Simplicity**: No user authentication or advanced features
- **Single Discipline**: Focus exclusively on Sporting Clays format
- **Basic UI**: Simple, functional interface over polished design
- **Limited Analytics**: Basic score tracking only, no trends or insights

## Risk Management

### Technical Risks
- **Offline Sync Conflicts**: Mitigated by PowerSync's proven conflict resolution
- **Battery Drain**: Minimized through simple UI and efficient code
- **Data Loss**: Prevented by offline-first architecture with local persistence

### Product Risks
- **Workflow Complexity**: Position-based flow might confuse users
- **Limited Appeal**: Sporting Clays focus may limit initial adoption
- **Feature Expectations**: Users may expect more features than MVP provides

### Mitigation Strategies
- **User Testing**: Validate workflow with real shooters before release
- **Clear Communication**: Set expectations about MVP scope and future features
- **Feedback Collection**: Systematic gathering of user input for prioritization

## Definition of MVP Success

**MVP is successful if:**
1. ✅ Users can complete full 10-position scorecards without confusion
2. ✅ Score recording feels fast and accurate in both online and offline modes
3. ✅ Data reliably syncs to cloud when connectivity is restored
4. ✅ Users express interest and provide constructive feedback
5. ✅ Zero blocking bugs in core scoring or synchronization workflows
6. ✅ Performance targets are consistently met across different devices
7. ✅ Offline-first approach proves valuable to users at shooting ranges

## Future Development Phases

### Phase 1: User Management
- Authentication and user accounts
- Personal session history
- Basic user preferences

### Phase 2: Enhanced Features
- Multi-user sessions
- Additional clay shooting disciplines
- Basic analytics and trends

### Phase 3: Social & Competition
- Club management features
- Leaderboards and competitions
- Social sharing capabilities

*This functional specification intentionally focuses 90% on MVP requirements to enable rapid validation of core concepts. For detailed technical implementation, see [Technical Architecture](./TECHNICAL_ARCHITECTURE.md). For development phases, see [Product Roadmap](./ROADMAP.md).*

---

**Document Status**: Primary functional specification
**Last Updated**: Current
**Next Review**: After MVP user testing