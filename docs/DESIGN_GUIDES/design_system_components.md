---
id: design_system_components
title: ScoreMyClays Design System Components
sidebar_label: ScoreMyClays Design System Components
---

# ScoreMyClays Design System Components

*Detailed component specifications and implementation guide*

## Component Library Overview

This document provides detailed specifications for all UI components in the ScoreMyClays design system, adapted from GolfGameBook's successful patterns for clay shooting applications.

---

## 1. Score Entry Components

### 1.1 Hit/Miss Buttons (Primary Scoring)
**ESP, DTL, Skeet, Sporting Clays**

```css
.score-button {
  width: 120px;
  height: 80px;
  border-radius: 12px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  transition: all 0.1s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.score-button--hit {
  background-color: #228B22;
  color: #FFFFFF;
}

.score-button--hit:active {
  background-color: #1E7B1E;
  transform: scale(0.95);
}

.score-button--miss {
  background-color: #DC143C;
  color: #FFFFFF;
}

.score-button--miss:active {
  background-color: #C4122F;
  transform: scale(0.95);
}

.score-button--disabled {
  background-color: #ADB5BD;
  color: #6C757D;
  cursor: not-allowed;
}
```

**Accessibility:**
- Minimum 44x44px touch target (exceeded at 120x80px)
- High contrast ratios (4.5:1 minimum)
- Screen reader labels: "Hit" / "Miss" / "Kill" / "Lost"
- Voice input: "Hit" / "Miss" commands

### 1.2 Numerical Score Entry (Competition Scoring)
**For disciplines requiring specific scores**

```css
.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 280px;
  margin: 0 auto;
}

.number-button {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid #E9ECEF;
  background-color: #F8F9FA;
  color: #2C3E50;
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s ease;
}

.number-button:hover {
  border-color: #D2691E;
}

.number-button:active {
  background-color: #D2691E;
  color: #FFFFFF;
  transform: scale(0.95);
}

.number-button--selected {
  background-color: #D2691E;
  color: #FFFFFF;
  border-color: #D2691E;
}
```

### 1.3 Running Score Display
**Real-time score tracking**

```css
.score-display {
  background-color: #F8F9FA;
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  margin: 16px 0;
}

.score-display__current {
  font-family: 'Roboto Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  color: #2C3E50;
  line-height: 1.2;
}

.score-display__total {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  color: #6C757D;
  margin-top: 4px;
}

.score-display__percentage {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #D2691E;
  margin-top: 8px;
}
```

---

## 2. Navigation Components

### 2.1 Bottom Navigation
**Primary app navigation**

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  border-top: 1px solid #E9ECEF;
  height: 84px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  min-width: 44px;
  min-height: 44px;
  text-decoration: none;
  color: #6C757D;
  transition: color 0.2s ease;
}

.nav-item--active {
  color: #D2691E;
}

.nav-item__icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.nav-item__label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.nav-item--primary {
  background-color: #D2691E;
  color: #FFFFFF;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin-top: -20px;
  box-shadow: 0 4px 12px rgba(210,105,30,0.3);
}

.nav-item--primary .nav-item__icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0;
}
```

### 2.2 Header Navigation
**Page-level navigation**

```css
.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E9ECEF;
  min-height: 56px;
}

.header-nav__back {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-left: -8px;
  color: #D2691E;
  text-decoration: none;
  min-width: 44px;
  min-height: 44px;
}

.header-nav__title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  text-align: center;
  flex: 1;
}

.header-nav__action {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-right: -8px;
  color: #D2691E;
  text-decoration: none;
  min-width: 44px;
  min-height: 44px;
}
```

---

## 3. Card Components

### 3.1 Round Summary Card
**Completed round display**

```css
.round-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.round-card--featured {
  border: 2px solid #D2691E;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.round-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.round-card__discipline {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C3E50;
  margin-right: 12px;
}

.round-card__date {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #6C757D;
  margin-left: auto;
}

.round-card__score {
  font-family: 'Roboto Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  color: #2C3E50;
  text-align: center;
  margin: 20px 0;
}

.round-card__details {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E9ECEF;
}

.round-card__detail {
  text-align: center;
}

.round-card__detail-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  display: block;
}

.round-card__detail-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6C757D;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### 3.2 Ground Information Card
**Shooting ground details**

```css
.ground-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ground-card__name {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 8px;
}

.ground-card__location {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #6C757D;
  margin-bottom: 16px;
}

.ground-card__disciplines {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.discipline-tag {
  background-color: #F8F9FA;
  border: 1px solid #E9ECEF;
  border-radius: 16px;
  padding: 4px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2C3E50;
}

.ground-card__contact {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E9ECEF;
}

.contact-button {
  flex: 1;
  padding: 12px;
  border: 1px solid #D2691E;
  border-radius: 8px;
  background-color: transparent;
  color: #D2691E;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.contact-button:hover {
  background-color: #D2691E;
  color: #FFFFFF;
}
```

---

## 4. Form Components

### 4.1 Input Fields
**Standard text input**

```css
.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #2C3E50;
  background-color: #FFFFFF;
  transition: border-color 0.2s ease;
  min-height: 48px;
}

.form-input:focus {
  outline: none;
  border-color: #D2691E;
  box-shadow: 0 0 0 3px rgba(210,105,30,0.1);
}

.form-input::placeholder {
  color: #6C757D;
}

.form-input:disabled {
  background-color: #F8F9FA;
  color: #6C757D;
  cursor: not-allowed;
}

.form-input--error {
  border-color: #DC143C;
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(220,20,60,0.1);
}
```

### 4.2 Select Dropdown
**Option selection**

```css
.form-select {
  width: 100%;
  padding: 16px;
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #2C3E50;
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236C757D' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  appearance: none;
  cursor: pointer;
  min-height: 48px;
}

.form-select:focus {
  outline: none;
  border-color: #D2691E;
  box-shadow: 0 0 0 3px rgba(210,105,30,0.1);
}
```

### 4.3 Toggle Switch
**Boolean settings**

```css
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch__input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch__slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ADB5BD;
  transition: 0.2s;
  border-radius: 28px;
}

.toggle-switch__slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.toggle-switch__input:checked + .toggle-switch__slider {
  background-color: #D2691E;
}

.toggle-switch__input:checked + .toggle-switch__slider:before {
  transform: translateX(24px);
}

.toggle-switch__input:focus + .toggle-switch__slider {
  box-shadow: 0 0 0 3px rgba(210,105,30,0.1);
}
```

---

## 5. Data Display Components

### 5.1 Statistics Table
**Performance data display**

```css
.stats-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  overflow: hidden;
}

.stats-table__header {
  background-color: #F8F9FA;
}

.stats-table__header th {
  padding: 12px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2C3E50;
  border-bottom: 1px solid #E9ECEF;
}

.stats-table__row {
  border-bottom: 1px solid #F1F3F4;
}

.stats-table__row:nth-child(even) {
  background-color: #F8F9FA;
}

.stats-table__cell {
  padding: 12px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  color: #2C3E50;
  border-bottom: 1px solid #F1F3F4;
}

.stats-table__cell--numeric {
  text-align: right;
}

.stats-table__cell--highlight {
  background-color: #FFF3E0;
  color: #D2691E;
  font-weight: 500;
}
```

### 5.2 Progress Bar
**Performance tracking**

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #E9ECEF;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-bar__fill {
  height: 100%;
  background-color: #D2691E;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-bar--success .progress-bar__fill {
  background-color: #228B22;
}

.progress-bar--warning .progress-bar__fill {
  background-color: #FFB000;
}

.progress-bar--error .progress-bar__fill {
  background-color: #DC143C;
}

.progress-bar__label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6C757D;
}
```

---

## 6. Feedback Components

### 6.1 Alert Messages
**System notifications**

```css
.alert {
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}

.alert--success {
  background-color: #E8F5E8;
  color: #1E7B1E;
  border: 1px solid #C3E6C3;
}

.alert--error {
  background-color: #FFEAEA;
  color: #A91B1B;
  border: 1px solid #F5C6CB;
}

.alert--warning {
  background-color: #FFF8E1;
  color: #8B6914;
  border: 1px solid #FFE082;
}

.alert--info {
  background-color: #E3F2FD;
  color: #1565C0;
  border: 1px solid #BBDEFB;
}

.alert__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert__content {
  flex: 1;
}

.alert__title {
  font-weight: 600;
  margin-bottom: 4px;
}

.alert__message {
  margin: 0;
}
```

### 6.2 Toast Notifications
**Temporary feedback**

```css
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2C3E50;
  color: #FFFFFF;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  max-width: 320px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  animation: toast-slide-down 0.3s ease;
}

.toast--success {
  background-color: #228B22;
}

.toast--error {
  background-color: #DC143C;
}

.toast--warning {
  background-color: #FFB000;
  color: #2C3E50;
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

## 7. Modal Components

### 7.1 Modal Dialog
**Overlay interactions**

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modal-scale-in 0.25s ease;
}

.modal__header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #E9ECEF;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal__title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6C757D;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.modal__close:hover {
  background-color: #F8F9FA;
}

.modal__body {
  padding: 24px;
}

.modal__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #E9ECEF;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@keyframes modal-scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 7.2 Bottom Sheet
**Mobile-optimized modals**

```css
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.bottom-sheet {
  background-color: #FFFFFF;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 80vh;
  animation: bottom-sheet-slide-up 0.3s ease;
}

.bottom-sheet__handle {
  width: 32px;
  height: 4px;
  background-color: #ADB5BD;
  border-radius: 2px;
  margin: 12px auto 8px;
}

.bottom-sheet__header {
  padding: 16px 24px;
  border-bottom: 1px solid #E9ECEF;
  text-align: center;
}

.bottom-sheet__title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0;
}

.bottom-sheet__content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

@keyframes bottom-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

---

## 8. Responsive Utilities

### 8.1 Breakpoint System
**Media query definitions**

```css
/* Mobile First Approach */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 0 32px;
  }
  
  .col-tablet-2 {
    width: 50%;
  }
  
  .col-tablet-3 {
    width: 33.333%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 0 40px;
  }
  
  .col-desktop-3 {
    width: 33.333%;
  }
  
  .col-desktop-4 {
    width: 25%;
  }
}
```

### 8.2 Spacing Utilities
**Margin and padding helpers**

```css
.m-0 { margin: 0; }
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
.m-4 { margin: 32px; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }

.p-0 { padding: 0; }
.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }

.pt-0 { padding-top: 0; }
.pt-1 { padding-top: 8px; }
.pt-2 { padding-top: 16px; }
.pt-3 { padding-top: 24px; }
.pt-4 { padding-top: 32px; }
```

### 8.3 Display Utilities
**Layout helpers**

```css
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

.flex-column { flex-direction: column; }
.flex-row { flex-direction: row; }
.align-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
```

---

## 9. Animation Library

### 9.1 Micro-interactions
**Button and feedback animations**

```css
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

@keyframes success-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes loading-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-button-press {
  animation: button-press 0.1s ease;
}

.animate-success {
  animation: success-pulse 0.3s ease;
}

.animate-error {
  animation: error-shake 0.2s ease;
}

.animate-loading {
  animation: loading-pulse 1s ease infinite;
}
```

### 9.2 Page Transitions
**Screen navigation animations**

```css
.page-transition-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

---

## 10. Accessibility Enhancements

### 10.1 Focus Management
**Keyboard navigation**

```css
.focus-visible {
  outline: 2px solid #D2691E;
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #D2691E;
  color: #FFFFFF;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1001;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.skip-link:focus {
  top: 6px;
}
```

### 10.2 Screen Reader Support
**ARIA and semantic markup**

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

## Implementation Notes

### Development Guidelines
1. **Use semantic HTML** - Proper heading hierarchy, landmarks
2. **Include ARIA labels** - For complex interactions
3. **Test with screen readers** - VoiceOver, TalkBack
4. **Keyboard navigation** - All interactive elements accessible
5. **Color contrast** - Minimum 4.5:1 for normal text
6. **Touch targets** - Minimum 44x44px for interactive elements

### Performance Considerations
1. **CSS optimization** - Minimize specificity, use efficient selectors
2. **Animation performance** - Use transform/opacity for smooth animations
3. **Bundle size** - Tree-shake unused styles
4. **Critical CSS** - Inline above-the-fold styles

### Browser Support
- **iOS Safari** - 12+
- **Chrome Mobile** - 70+
- **Firefox Mobile** - 68+
- **Desktop browsers** - Progressive enhancement

This component system provides a comprehensive foundation for building ScoreMyClays with consistent, accessible, and performant UI components optimized for outdoor sports use.

---

*Next: Implementation examples and integration guides for specific frameworks (React, Vue, Angular).*