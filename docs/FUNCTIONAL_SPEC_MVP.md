---
id: FUNCTIONAL_SPEC_MVP
title: ScoreMyClays MVP Functional Specification
sidebar_label: MVP Functional Specification
---

# ScoreMyClays MVP Functional Specification

## Executive Summary

ScoreMyClays MVP is a **ultra-simple** clay shooting scoring app that validates the core concept: **helping shooters easily track their clay shooting performance**. The MVP focuses exclusively on the essential user workflow with an offline-first approach.

## MVP Core Value Proposition

**"A clay shooter can quickly and easily track their performance during a round, with or without an internet connection."**

## MVP Scope (Absolute Minimum)

### What's INCLUDED in MVP
✅ **Mobile-First**: Touch-friendly interface
✅ **Offline-First**: Must work off-line and synchronise with cloud when on-line 
✅ **Single Discipline**: Sporting Clays only
✅ **Basic Session Setup**: A scorecard of ten targets at ten positions
✅ **Position Setup**: Name a position before shooting at it
✅ **Simple Scoring at Position**:
- HIT/MISS buttons
- "No Bird" button
- "Undo" Button
✅ **Shot Tracking**: Current shot number and current score at current position 
✅ **Scorecard Tracking**:
- Scores per position
- Cummulative running total of hits
- Cummulative percentage of hits
✅ **Scorecard Completion**: Final scorecard display
✅ **Storage**: Scorecards saved to cloud via an offline-first sync engine

### What's EXCLUDED from MVP
❌ User accounts/authentication  
❌ Other disciplines (Trap, Down-the-Line, Skeet, Compak Sporting)
❌ Squad/group scoring  
❌ Analytics and charts  
❌ Historical data/trends  
❌ Data export/sharing  
❌ Social features  
❌ Advanced target types (pairs, reports)  
❌ Position Stands and Flight tracking

## User Flow (MVP)

### Primary User Journey
1. **Open App** → See simple start screen
2. **List of Sessions** → Grouped by Place; Display Date and Scorecard Total Score
3. **Name Place of Shooting** → Enter name of Shooting School or Range
4. **Name of Shooter** → Enter name of person who is shooting
5. **Start Session** → App prompts to enter name of the first Position
6. **Shoot at Position** → See "Target 1 of 10" with HIT/MISS, No Bird, Undo buttons
7. **Record Shots** → Tap HIT, MISS, etc. for each of ten targets
8. **Next Position** → After 10 targets, the app shows the score for that position, the running total, and prompts for the next position's name.
9. **Complete Round** → After 10 positions, see the final scorecard.
10. **Start New Session** → Return to the start screen.

### Screen Flow
```
[Start Screen: Input for Shooting Ground & Shooter Name]
     ↓
[Input for Position 1 Name]
     ↓
[Scoring Screen: Position 1, Target 1-10]
- HIT/MISS/NO BIRD/UNDO buttons
- Shows score for current position
     ↓
[Position 1 Summary & Input for Position 2 Name]
- Shows Position 1 score (e.g., 8/10)
- Shows running total (e.g., 8/10)
     ↓
[Scoring Screen: Position 2, Target 1-10]
     ↓
... (repeat for 10 positions)
     ↓
[Final Scorecard Screen]
- Shows breakdown per position
- Shows final score (e.g., 78/100)
     ↓
[Button to Start New Session]
```

## Functional Requirements

### 1. Session Setup
- An initial screen to capture:
  - **Place of Shooting**: Text input for the shooting ground or range name.
  - **Shooter Name**: Text input for the person's name.
- A "Start Session" button that proceeds to the first position.

### 2. Position Management
- Before each set of 10 targets, the app prompts the user to name the position (e.g., "High Tower", "Rabbit Stand").
- After 10 targets at a position are scored, a summary screen displays the score for that position and the cumulative session score.
- A "Next Position" button to proceed.

### 3. Scoring Interface
- **Shot Display**: Clearly indicates the current target number (e.g., "Target 4 of 10").
- **Score Buttons**: Large, easy-to-tap buttons for:
  - **HIT** (Green)
  - **MISS** (Red)
  - **NO BIRD**: This shot is disregarded and does not count towards the 10 targets for the position. The user repeats the shot.
  - **UNDO**: Reverts the last action (HIT, MISS, or NO BIRD). Can be used multiple times.
- **Running Score**: A live display of the score for the current position (e.g., "Position Score: 3/10").

### 4. Scorecard & Session Completion
- The main scorecard view updates after each position is completed, showing a list of positions and their scores.
- A cumulative running total and hit percentage are always visible.
- After 10 positions are completed, a final scorecard summary is displayed.
- A "Start New Session" button allows the user to begin a new scorecard.

## Technical Requirements (Simplified)

### Platform
- **Progressive Web App (PWA)**
- **Mobile-first responsive design**
- **Offline-First Architecture**: Core functionality must be available without an internet connection.

### Data Management & Synchronization
- **Offline Storage**: All data is written to a local on-device database first (e.g., SQLite via PowerSync).
- **Cloud Storage**: Data is stored in a primary cloud database (e.g., Supabase PostgreSQL).
- **Automatic Sync**: The app automatically synchronizes data between the local device and the cloud when a network connection is available.

### Performance
- **Instant response** to scoring taps (< 100ms), regardless of network status.
- **Fast load time** (< 3 seconds).
- **Efficient battery usage**, especially during long scoring sessions.

### Browser Support
- **Chrome, Safari, Firefox** (modern versions only)
- **iOS Safari, Android Chrome**

## User Interface Requirements

### Design Principles
- **Ultra-simple**: One primary action per screen.
- **Large touch targets**: Easy to tap with gloves on.
- **High contrast**: Clearly visible in bright outdoor conditions.
- **Minimal text**: Use visual hierarchy with large buttons and numbers.

### Key UI Elements
- **Large typography**: Scores and shot numbers must be easily readable.
- **Color coding**: Green for HIT, Red for MISS, Blue/Gray for neutral actions.
- **Haptic/Visual Feedback**: Button presses should have a clear visual animation.
- **Clean layout**: Ample spacing, no visual clutter.

## Success Metrics (MVP)

### Primary Metrics
- **Session completion rate**: % of users who complete a full 10-position session.
- **Offline usage**: Number of sessions recorded or updated while offline.
- **Sync success rate**: % of sessions that sync successfully to the cloud.
- **Return usage**: % of users who start a second session.

### Validation Goals
- **20+ sessions completed** by different users, with a mix of online and offline scenarios.
- **Positive feedback** on the ease of use of the position-based scoring flow.
- **Zero critical bugs** in the core scoring and data sync flow.

## MVP Assumptions

- Users shoot Sporting Clays in sessions of multiple positions.
- Users want simple, reliable score tracking over advanced features for an MVP.
- Mobile phone usage at shooting ranges is common.
- An offline-first approach is critical due to poor connectivity at ranges.

## Risks & Mitigation

### Technical Risks
- **Offline Sync Conflicts**: Low risk for MVP as a single user is editing their own scores. The sync engine (PowerSync) has built-in conflict resolution.
- **Battery drain**: Mitigate by ensuring the UI is simple and animations are not resource-intensive.
- **Data loss**: Mitigate with an offline-first architecture where data is always saved to the device before any network operation is attempted.

### Product Risks
- **Flow is too complex**: The position-based flow might be more complex than a simple target count. We must ensure the UI guides the user clearly.
- **Limited appeal**: Focus on validating the core Sporting Clays scoring experience first.

## Definition of MVP Success

**MVP is successful if:**
1. Users can complete a full 10-position scorecard without confusion.
2. Score recording feels fast and accurate, both online and offline.
3. Data reliably syncs to the cloud when a connection is restored.
4. Users express interest in the product and provide feedback for the next features.
5. There are no blocking bugs in the core scoring or data synchronization flow.

---

*This MVP specification intentionally excludes 90% of features from the full spec to focus on validating the core concept quickly and efficiently. For future features and development phases, see the [Product Roadmap](./ROADMAP.md).* 