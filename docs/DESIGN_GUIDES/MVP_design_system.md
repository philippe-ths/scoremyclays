Perfect! Here's the MVP-focused component system document that you can copy:

---

```markdown
---
id: mvp_component_system
title: ScoreMyClays MVP Component System
sidebar_label: MVP Component System
---

# ScoreMyClays MVP Component System

*Ultra-simplified component library for MVP - focused exclusively on core scoring functionality*

## Executive Summary

This MVP component system provides **only the essential UI components** needed for the ScoreMyClays MVP. Every component is designed for **outdoor visibility, touch-first interaction, and offline reliability**.

**MVP Focus**: Single discipline (Sporting Clays), basic scoring workflow, no authentication, no social features.

---

## 1. Core Scoring Components

### 1.1 Primary Action Buttons (HIT/MISS/NO BIRD/UNDO)

```css
.action-button {
  width: 140px;
  height: 100px;
  border-radius: 16px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.1s ease;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  margin: 8px;
}

.action-button--hit {
  background-color: #22C55E;
  color: #FFFFFF;
}

.action-button--hit:active {
  background-color: #16A34A;
  transform: scale(0.95);
}

.action-button--miss {
  background-color: #EF4444;
  color: #FFFFFF;
}

.action-button--miss:active {
  background-color: #DC2626;
  transform: scale(0.95);
}

.action-button--no-bird {
  background-color: #F59E0B;
  color: #FFFFFF;
}

.action-button--no-bird:active {
  background-color: #D97706;
  transform: scale(0.95);
}

.action-button--undo {
  background-color: #6B7280;
  color: #FFFFFF;
}

.action-button--undo:active {
  background-color: #4B5563;
  transform: scale(0.95);
}
```

**Accessibility:**
- Minimum 44x44px exceeded at 140x100px
- High contrast ratios (7:1+)
- Screen reader labels: "Hit", "Miss", "No Bird", "Undo"
- Voice commands supported

### 1.2 Score Display (Current Position)

```css
.score-display {
  background-color: #FFFFFF;
  border: 3px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.score-display__target {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
}

.score-display__current {
  font-family: 'Roboto Mono', monospace;
  font-size: 48px;
  font-weight: 900;
  color: #1F2937;
  line-height: 1;
  margin: 12px 0;
}

.score-display__running-total {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 700;
  color: #D97706;
  margin-top: 16px;
}

.score-display__percentage {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #059669;
  margin-top: 8px;
}
```

---

## 2. Form Components (Session Setup)

### 2.1 Text Input Fields

```css
.form-input {
  width: 100%;
  padding: 20px;
  border: 3px solid #E5E7EB;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #1F2937;
  background-color: #FFFFFF;
  transition: border-color 0.2s ease;
  min-height: 60px;
}

.form-input:focus {
  outline: none;
  border-color: #D97706;
  box-shadow: 0 0 0 4px rgba(217,119,6,0.1);
}

.form-input::placeholder {
  color: #9CA3AF;
  font-weight: 400;
}

.form-label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}
```

### 2.2 Primary Action Button (Start/Next/Finish)

```css
.primary-button {
  width: 100%;
  padding: 20px;
  border: none;
  border-radius: 12px;
  background-color: #D97706;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
  box-shadow: 0 4px 8px rgba(217,119,6,0.2);
}

.primary-button:hover {
  background-color: #B45309;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(217,119,6,0.3);
}

.primary-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(217,119,6,0.2);
}

.primary-button:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

---

## 3. Layout Components

### 3.1 Screen Container

```css
.screen-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #F9FAFB;
  display: flex;
  flex-direction: column;
}

.screen-header {
  text-align: center;
  margin-bottom: 32px;
}

.screen-title {
  font-family: 'Inter', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #1F2937;
  margin-bottom: 8px;
}

.screen-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #6B7280;
}

.screen-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}
```

### 3.2 Scoring Grid Layout

```css
.scoring-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 32px 0;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.scoring-grid--four-buttons {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.scoring-grid__undo {
  grid-column: 1 / -1;
  margin-top: 16px;
}
```

---

## 4. Data Display Components

### 4.1 Position Summary Card

```css
.position-card {
  background-color: #FFFFFF;
  border: 2px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.position-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.position-card__name {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1F2937;
}

.position-card__score {
  font-family: 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: 900;
  color: #D97706;
}

.position-card__details {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #F3F4F6;
}

.position-card__detail {
  text-align: center;
}

.position-card__detail-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #1F2937;
  display: block;
}

.position-card__detail-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}
```

### 4.2 Final Scorecard Table

```css
.scorecard-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #FFFFFF;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  margin: 24px 0;
}

.scorecard-table__header {
  background-color: #F3F4F6;
}

.scorecard-table__header th {
  padding: 16px 12px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scorecard-table__row {
  border-bottom: 1px solid #F3F4F6;
}

.scorecard-table__row:nth-child(even) {
  background-color: #F9FAFB;
}

.scorecard-table__cell {
  padding: 16px 12px;
  font-family: 'Roboto Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.scorecard-table__cell--position {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.scorecard-table__cell--score {
  text-align: center;
  font-weight: 900;
  color: #D97706;
}

.scorecard-table__footer {
  background-color: #FEF3C7;
  font-weight: 900;
}

.scorecard-table__footer .scorecard-table__cell {
  color: #92400E;
  font-size: 18px;
}
```

---

## 5. Feedback Components

### 5.1 Toast Notifications (Offline/Sync Status)

```css
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1F2937;
  color: #FFFFFF;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1000;
  max-width: 320px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  animation: toast-slide-down 0.3s ease;
}

.toast--success {
  background-color: #059669;
}

.toast--warning {
  background-color: #D97706;
}

.toast--error {
  background-color: #DC2626;
}

.toast--offline {
  background-color: #6B7280;
}

@keyframes toast-slide-down {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

---

## 6. Responsive Utilities

### 6.1 Mobile-First Layout

```css
.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Landscape phone adjustments */
@media (orientation: landscape) and (max-height: 500px) {
  .scoring-grid {
    gap: 12px;
  }
  
  .action-button {
    height: 80px;
    font-size: 24px;
  }
  
  .screen-content {
    justify-content: flex-start;
    padding-top: 20px;
  }
}

/* Tablet adjustments */
@media (min-width: 768px) {
  .container {
    max-width: 600px;
    padding: 0 40px;
  }
  
  .scoring-grid {
    max-width: 400px;
    gap: 20px;
  }
  
  .action-button {
    width: 160px;
    height: 120px;
    font-size: 32px;
  }
}
```

### 6.2 Utility Classes

```css
/* Spacing */
.mb-16 { margin-bottom: 16px; }
.mb-24 { margin-bottom: 24px; }
.mb-32 { margin-bottom: 32px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.mt-32 { margin-top: 32px; }

/* Text alignment */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* Display */
.hidden { display: none; }
.block { display: block; }
.flex { display: flex; }
.flex-column { flex-direction: column; }
.justify-center { justify-content: center; }
.align-center { align-items: center; }
.space-between { justify-content: space-between; }
```

---

## 7. Animation Library (Minimal)

### 7.1 Button Feedback Animations

```css
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes success-feedback {
  0% { 
    transform: scale(1); 
    background-color: #22C55E;
  }
  50% { 
    transform: scale(1.05); 
    background-color: #16A34A;
  }
  100% { 
    transform: scale(1); 
    background-color: #22C55E;
  }
}

@keyframes error-feedback {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.animate-press {
  animation: button-press 0.15s ease;
}

.animate-success {
  animation: success-feedback 0.4s ease;
}

.animate-error {
  animation: error-feedback 0.3s ease;
}
```

### 7.2 Screen Transitions

```css
.screen-enter {
  opacity: 0;
  transform: translateX(100%);
}

.screen-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.screen-exit {
  opacity: 1;
  transform: translateX(0);
}

.screen-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

---

## 8. Accessibility (MVP Essentials)

### 8.1 Focus Management

```css
.focus-visible {
  outline: 3px solid #D97706;
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #D97706;
  color: #FFFFFF;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 8px;
  z-index: 1001;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.skip-link:focus {
  top: 6px;
}
```

### 8.2 Screen Reader Support

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 9. Offline/Loading States

### 9.1 Loading Spinner

```css
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top: 4px solid #D97706;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #6B7280;
  text-align: center;
  margin-top: 12px;
}
```

### 9.2 Offline Indicator

```css
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #6B7280;
  color: #FFFFFF;
  padding: 12px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  z-index: 999;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.offline-banner--visible {
  transform: translateY(0);
}

.offline-banner__icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}
```

---

## 10. Implementation Guidelines

### 10.1 MVP Component Priority

**Essential (Must Have):**
1. Action buttons (HIT/MISS/NO BIRD/UNDO)
2. Score display
3. Text inputs (Place, Shooter, Position names)
4. Primary action button (Start/Next/Finish)
5. Position summary card
6. Final scorecard table

**Important (Should Have):**
7. Toast notifications
8. Loading states
9. Offline indicator
10. Basic animations

**Nice to Have (Could Have):**
11. Advanced transitions
12. Enhanced accessibility features

### 10.2 Performance Requirements

- **Touch Response**: < 100ms for all button interactions
- **Screen Transitions**: < 300ms between screens
- **Offline Storage**: Instant save to local storage
- **Bundle Size**: Keep CSS under 50KB compressed

### 10.3 Browser Support (MVP)

- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Firefox Mobile**: 90+
- **Samsung Internet**: 14+

### 10.4 Testing Checklist

**Functionality:**
- [ ] All buttons respond to touch
- [ ] Score calculations are accurate
- [ ] Data persists offline
- [ ] Screen transitions work smoothly

**Accessibility:**
- [ ] All interactive elements have 44px+ touch targets
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader labels are present
- [ ] Keyboard navigation works

**Performance:**
- [ ] App loads in under 3 seconds
- [ ] Interactions feel instant
- [ ] Works in airplane mode
- [ ] Battery usage is minimal

---

## 11. Color Palette (MVP)

```css
:root {
  /* Primary Colors */
  --color-primary: #D97706;        /* Clay Orange */
  --color-primary-dark: #B45309;   /* Hover state */
  
  /* Action Colors */
  --color-hit: #22C55E;           /* Success Green */
  --color-miss: #EF4444;          /* Error Red */
  --color-no-bird: #F59E0B;       /* Warning Amber */
  --color-undo: #6B7280;          /* Neutral Gray */
  
  /* Text Colors */
  --color-text-primary: #1F2937;   /* Dark Gray */
  --color-text-secondary: #6B7280; /* Medium Gray */
  --color-text-muted: #9CA3AF;     /* Light Gray */
  
  /* Background Colors */
  --color-bg-primary: #FFFFFF;     /* White */
  --color-bg-secondary: #F9FAFB;   /* Light Gray */
  --color-bg-tertiary: #F3F4F6;    /* Lighter Gray */
  
  /* Border Colors */
  --color-border: #E5E7EB;         /* Light Border */
  --color-border-focus: #D97706;   /* Focus Border */
}
```

---

## 12. Typography Scale (MVP)

```css
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Roboto Mono', 'SF Mono', Monaco, monospace;
  
  /* Font Sizes */
  --text-xs: 12px;    /* Labels, captions */
  --text-sm: 14px;    /* Body text, notifications */
  --text-base: 16px;  /* Default body text */
  --text-lg: 18px;    /* Input text, subtitles */
  --text-xl: 20px;    /* Button text, headings */
  --text-2xl: 24px;   /* Running totals */
  --text-3xl: 28px;   /* Screen titles, action buttons */
  --text-4xl: 32px;   /* Large action buttons */
  --text-5xl: 48px;   /* Current score display */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

---

This MVP component system provides everything needed to build the ScoreMyClays MVP with a focus on **simplicity, outdoor usability, and offline reliability**. Each component is designed to work perfectly for clay shooting scenarios while maintaining the ultra-simplified scope required for MVP validation.
```