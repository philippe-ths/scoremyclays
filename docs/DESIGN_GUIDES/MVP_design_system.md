---
id: mvp_component_system
title: ScoreMyClays Design System
sidebar_label: Design System
---

# ScoreMyClays Design System

*Complete UI component library for clay pigeon shooting scoring - optimized for outdoor use and touch interaction*

## Overview

This design system provides all essential UI components for the ScoreMyClays application. Every component is designed for **outdoor visibility, touch-first interaction, and offline reliability**.

**Focus**: Sporting Clays discipline, intuitive scoring workflow, mobile-first design.

---

## Live Component Examples

### Primary Action Buttons

The core scoring buttons that shooters interact with most frequently:

<div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0'}}>
  <button style={{
    width: '140px',
    height: '100px',
    borderRadius: '16px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '28px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }}>
    HIT
  </button>
  <button style={{
    width: '140px',
    height: '100px',
    borderRadius: '16px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '28px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }}>
    MISS
  </button>
  <button style={{
    width: '140px',
    height: '100px',
    borderRadius: '16px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '28px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }}>
    NO BIRD
  </button>
  <button style={{
    width: '140px',
    height: '100px',
    borderRadius: '16px',
    border: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: '28px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer',
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  }}>
    UNDO
  </button>
</div>

#### Implementation Code

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

.action-button--miss {
  background-color: #EF4444;
  color: #FFFFFF;
}

.action-button--no-bird {
  background-color: #F59E0B;
  color: #FFFFFF;
}

.action-button--undo {
  background-color: #6B7280;
  color: #FFFFFF;
}

.action-button:active {
  transform: scale(0.95);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
```

### Score Display Card

Shows current position score and running total:

<div style={{
  backgroundColor: '#FFFFFF',
  border: '3px solid #E5E7EB',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center',
  margin: '16px 0',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  maxWidth: '300px'
}}>
  <div style={{fontSize: '18px', fontWeight: '600', color: '#6B7280'}}>Current Position</div>
  <div style={{fontSize: '48px', fontWeight: '900', color: '#1F2937'}}>7/10</div>
  <div style={{fontSize: '24px', fontWeight: '700', color: '#D97706'}}>Running Total: 35/50</div>
</div>

#### Implementation Code

```css
.score-display {
  background-color: #FFFFFF;
  border: 3px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin: 16px 0;
}

.score-display__label {
  font-size: 18px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 8px;
}

.score-display__current {
  font-size: 48px;
  font-weight: 900;
  color: #1F2937;
  margin: 8px 0;
}

.score-display__total {
  font-size: 24px;
  font-weight: 700;
  color: #D97706;
}
```

### Form Components

Input fields for shooter and position setup:

<div style={{margin: '16px 0'}}>
  <input 
    type="text" 
    placeholder="Shooter Name" 
    style={{
      width: '100%',
      padding: '12px',
      border: '3px solid #E5E7EB',
      borderRadius: '8px',
      marginBottom: '8px',
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif'
    }}
  />
  <input 
    type="text" 
    placeholder="Position Name" 
    style={{
      width: '100%',
      padding: '12px',
      border: '3px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif'
    }}
  />
</div>

#### Implementation Code

```css
.form-input {
  width: 100%;
  padding: 12px;
  border: 3px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #D97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.form-input::placeholder {
  color: #9CA3AF;
}
```

### Toast Notifications

Feedback messages for user actions:

<div style={{margin: '16px 0'}}>
  <div style={{
    backgroundColor: '#059669',
    color: '#FFFFFF',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '8px',
    fontWeight: '600'
  }}>
    ✓ Score saved successfully!
  </div>
  <div style={{
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '600'
  }}>
    ✗ Connection lost - working offline
  </div>
</div>

#### Implementation Code

```css
.toast {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin: 8px 0;
  animation: slideIn 0.3s ease;
}

.toast--success {
  background-color: #059669;
  color: #FFFFFF;
}

.toast--error {
  background-color: #DC2626;
  color: #FFFFFF;
}

.toast--warning {
  background-color: #D97706;
  color: #FFFFFF;
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## Design Principles

### 1. Outdoor Visibility
- **High contrast colors** for bright sunlight conditions
- **Large touch targets** (minimum 44px)
- **Bold typography** with sufficient weight

### 2. Touch-First Interaction
- **Generous spacing** between interactive elements
- **Immediate visual feedback** on touch
- **Large, clearly labeled buttons**

### 3. Offline Reliability
- **Clear offline indicators** when connection is lost
- **Local storage** for critical data
- **Sync status** visible to users

### 4. Performance
- **Minimal animations** to preserve battery
- **Optimized images** for fast loading
- **Efficient CSS** for smooth scrolling

---

## Color System

### Primary Colors
- **Orange**: `#D97706` - Primary brand color, CTAs
- **Green**: `#22C55E` - Success states, HIT button
- **Red**: `#EF4444` - Error states, MISS button
- **Yellow**: `#F59E0B` - Warning states, NO BIRD button

### Neutral Colors
- **Gray 900**: `#1F2937` - Primary text
- **Gray 600**: `#4B5563` - Secondary text
- **Gray 400**: `#9CA3AF` - Placeholder text
- **Gray 200**: `#E5E7EB` - Borders, dividers
- **White**: `#FFFFFF` - Backgrounds, cards

### Usage Guidelines
- Use **high contrast** combinations for outdoor visibility
- **Green for positive actions** (HIT, success)
- **Red for negative actions** (MISS, errors)
- **Orange for primary actions** and brand elements

---

## Typography

### Font Family
- **Primary**: Inter (web-safe fallback: sans-serif)
- **Display**: Inter with increased font-weight

### Scale
- **Heading 1**: 48px, weight 900
- **Heading 2**: 32px, weight 700
- **Heading 3**: 24px, weight 600
- **Body**: 16px, weight 400
- **Button**: 28px, weight 800 (action buttons)
- **Small**: 14px, weight 400

### Guidelines
- **Bold text** for outdoor readability
- **Uppercase** for action buttons
- **Letter spacing** on buttons for clarity

---

## Interactive Prototypes

For hands-on exploration of these components:

- **[Component Library](../../prototypes/component-library.html)** - Live component showcase
- **[MVP User Flow](../../prototypes/mvp-user-flow.html)** - Complete user journey
- **[Accessibility Demo](../../prototypes/accessibility-demo.html)** - Accessibility features
- **[Performance Demo](../../prototypes/performance-demo.html)** - Optimization examples
- **[Animation Showcase](../../prototypes/animation-showcase.html)** - UI animations

---

## Implementation Guidelines

### CSS Structure
```scss
// Base styles
@import 'base/typography';
@import 'base/colors';
@import 'base/layout';

// Components
@import 'components/buttons';
@import 'components/cards';
@import 'components/forms';
@import 'components/notifications';

// Utilities
@import 'utilities/spacing';
@import 'utilities/responsive';
```

### Component Architecture
- **BEM methodology** for CSS class naming
- **Component-based** structure for reusability
- **Mobile-first** responsive design
- **Touch-optimized** interaction states

### Browser Support
- **iOS Safari 12+** (primary mobile target)
- **Chrome Mobile 70+** (Android support)
- **PWA compatibility** for offline functionality

---

*This design system serves as the foundation for all ScoreMyClays UI development. For implementation examples, refer to the interactive prototypes linked above.*