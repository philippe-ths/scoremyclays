---
id: scoremyclays_ui_design_guide
title: ScoreMyClays UI Design Guide
sidebar_label: ScoreMyClays UI Design Guide
---

# ScoreMyClays UI Design Guide

*Comprehensive visual design system adapted from GolfGameBook analysis*

## Executive Summary

This UI design guide establishes the visual language for ScoreMyClays, translating GolfGameBook's successful design patterns to clay shooting contexts. The system prioritizes outdoor visibility, touch-friendly interactions, and professional presentation while respecting British clay shooting traditions.

---

## 1. Design Philosophy

### 1.1 Core Design Principles
**Outdoor Sports Optimization:**
- **High contrast first** - visibility in bright outdoor conditions
- **Large touch targets** - gloved hands and safety considerations
- **Immediate feedback** - instant visual confirmation of actions
- **Minimal cognitive load** - focus remains on shooting safety

**Clay Shooting Heritage:**
- **Traditional color schemes** - earth tones, clay orange, gun metal
- **Professional presentation** - suitable for club records
- **British sporting culture** - respect for tradition and formality
- **Safety-conscious design** - never distract from shooting protocols

### 1.2 Visual Hierarchy
**Primary Level:**
- Current score and round information
- Essential action buttons (HIT/MISS)
- Safety-critical information
- Navigation elements

**Secondary Level:**
- Round details and statistics
- Social features and notifications
- Weather and ground information
- Performance trends

**Tertiary Level:**
- Historical data and analytics
- Settings and preferences
- Help and support content
- Advanced features

---

## 2. Color System

### 2.1 Primary Color Palette
**Clay Orange (#D2691E):**
- **Usage**: Primary brand color, CTAs, highlights
- **Accessibility**: WCAG AA compliant with white text
- **Emotion**: Energetic, sporting, traditional clay target color
- **Applications**: Buttons, active states, notifications

**Gun Metal (#2C3E50):**
- **Usage**: Primary text, navigation, professional elements
- **Accessibility**: WCAG AAA compliant with white backgrounds
- **Emotion**: Professional, reliable, traditional
- **Applications**: Headers, body text, icons

**Field Green (#228B22):**
- **Usage**: Success states, positive feedback, nature connection
- **Accessibility**: WCAG AA compliant with white text
- **Emotion**: Success, nature, shooting ground environment
- **Applications**: Success indicators, positive notifications

### 2.2 Secondary Color Palette
**Sky Blue (#87CEEB):**
- **Usage**: Information states, secondary actions
- **Accessibility**: WCAG AA compliant with dark text
- **Emotion**: Calm, informative, open sky
- **Applications**: Info badges, secondary buttons

**Warning Amber (#FFB000):**
- **Usage**: Warnings, important notifications
- **Accessibility**: WCAG AA compliant with dark text
- **Emotion**: Caution, attention, safety
- **Applications**: Warning alerts, missing data indicators

**Error Red (#DC143C):**
- **Usage**: Errors, deletion, negative feedback
- **Accessibility**: WCAG AA compliant with white text
- **Emotion**: Alert, stop, error
- **Applications**: Error messages, deletion confirmations

### 2.3 Neutral Color Palette
**Background Colors:**
- **Light Mode**: #FFFFFF (Pure white)
- **Dark Mode**: #1A1A1A (Near black)
- **Card Background**: #F8F9FA (Light gray)
- **Surface**: #E9ECEF (Medium gray)

**Text Colors:**
- **Primary Text**: #212529 (Dark gray)
- **Secondary Text**: #6C757D (Medium gray)
- **Disabled Text**: #ADB5BD (Light gray)
- **Inverted Text**: #FFFFFF (White)

### 2.4 Accessibility Considerations
**Contrast Ratios:**
- **Large text**: Minimum 3:1 ratio
- **Small text**: Minimum 4.5:1 ratio
- **Interactive elements**: 4.5:1 minimum
- **Brand colors**: All tested for accessibility

**Color Blindness:**
- **Red-green**: Patterns and icons supplement color
- **Blue-yellow**: Sufficient contrast maintained
- **Total color blindness**: High contrast modes available

---

## 3. Typography System

### 3.1 Font Family
**Primary Font: Inter**
- **Rationale**: Optimized for UI, excellent readability
- **Weights**: Regular (400), Medium (500), Semi-Bold (600), Bold (700)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

**Secondary Font: Roboto Mono**
- **Usage**: Score displays, statistics, data tables
- **Rationale**: Monospace for aligned numerical data
- **Weights**: Regular (400), Medium (500), Bold (700)

### 3.2 Type Scale
**Display (32px/2rem):**
- **Usage**: Page titles, major headings
- **Weight**: Bold (700)
- **Line height**: 1.2
- **Example**: "ESP Round 1"

**Heading Large (24px/1.5rem):**
- **Usage**: Section titles, card headers
- **Weight**: Semi-Bold (600)
- **Line height**: 1.3
- **Example**: "Stand 3 of 8"

**Heading Medium (20px/1.25rem):**
- **Usage**: Subsection titles
- **Weight**: Medium (500)
- **Line height**: 1.4
- **Example**: "Running Score"

**Body Large (18px/1.125rem):**
- **Usage**: Important body text, button labels
- **Weight**: Regular (400)
- **Line height**: 1.5
- **Example**: Score entry buttons

**Body (16px/1rem):**
- **Usage**: Standard body text
- **Weight**: Regular (400)
- **Line height**: 1.5
- **Example**: General content

**Caption (14px/0.875rem):**
- **Usage**: Secondary information, metadata
- **Weight**: Regular (400)
- **Line height**: 1.4
- **Example**: "Shot at Bisley Camp"

**Small (12px/0.75rem):**
- **Usage**: Fine print, timestamps
- **Weight**: Regular (400)
- **Line height**: 1.3
- **Example**: "Updated 5 mins ago"

### 3.3 Outdoor Readability
**High Contrast Mode:**
- **Increased font weights**: Medium becomes default
- **Larger sizes**: 18px minimum for body text
- **Enhanced spacing**: 1.6 line height minimum
- **Bold emphasis**: Important text automatically bold

**Glare Protection:**
- **Dark mode**: Reduces screen brightness
- **Text shadows**: Subtle shadows for enhanced readability
- **Background opacity**: Semi-transparent overlays
- **Contrast adjustment**: User-controlled contrast levels

---

## 4. Component Design System

### 4.1 Buttons
**Primary Button (Clay Orange):**
```
Background: #D2691E
Text: #FFFFFF
Padding: 16px 24px
Border radius: 8px
Font: Body Large, Medium (500)
Min height: 48px
```

**Secondary Button (Outline):**
```
Background: Transparent
Border: 2px solid #D2691E
Text: #D2691E
Padding: 14px 22px
Border radius: 8px
Font: Body Large, Medium (500)
Min height: 48px
```

**Tertiary Button (Text):**
```
Background: Transparent
Text: #2C3E50
Padding: 12px 16px
Font: Body Large, Medium (500)
Min height: 44px
```

**Large Action Button (Score Entry):**
```
Background: #F8F9FA
Border: 2px solid #E9ECEF
Text: #2C3E50
Padding: 20px
Border radius: 12px
Font: Display, Bold (700)
Min height: 80px
Active state: Clay Orange background
```

### 4.2 Score Entry Interface
**Hit/Miss Buttons:**
```
HIT Button:
- Background: #228B22
- Text: #FFFFFF
- Size: 120px x 80px
- Border radius: 12px
- Font: Heading Large, Bold

MISS Button:
- Background: #DC143C
- Text: #FFFFFF
- Size: 120px x 80px
- Border radius: 12px
- Font: Heading Large, Bold
```

**Number Pad (for disciplines with numerical scores):**
```
Number Buttons:
- Background: #F8F9FA
- Border: 2px solid #E9ECEF
- Text: #2C3E50
- Size: 80px x 80px
- Border radius: 12px
- Font: Display, Bold
- Active: Clay Orange background
```

### 4.3 Cards & Containers
**Standard Card:**
```
Background: #FFFFFF
Border: 1px solid #E9ECEF
Border radius: 12px
Padding: 20px
Box shadow: 0 2px 4px rgba(0,0,0,0.1)
```

**Round Summary Card:**
```
Background: #FFFFFF
Border: 2px solid #D2691E
Border radius: 12px
Padding: 24px
Box shadow: 0 4px 8px rgba(0,0,0,0.15)
```

**Stat Card:**
```
Background: #F8F9FA
Border: 1px solid #E9ECEF
Border radius: 8px
Padding: 16px
Text align: center
```

### 4.4 Navigation
**Bottom Navigation:**
```
Background: #FFFFFF
Border top: 1px solid #E9ECEF
Height: 84px
Padding: 8px 0

Tab Items:
- Icon size: 24px
- Text: Caption, Medium (500)
- Active color: #D2691E
- Inactive color: #6C757D
- Min touch target: 44px x 44px
```

**Primary Action (SHOOT):**
```
Background: #D2691E
Border radius: 50% (circular)
Size: 64px x 64px
Icon: 32px, white
Shadow: 0 4px 12px rgba(210,105,30,0.3)
```

### 4.5 Input Fields
**Standard Input:**
```
Background: #FFFFFF
Border: 2px solid #E9ECEF
Border radius: 8px
Padding: 16px
Font: Body, Regular
Min height: 48px
Focus: Clay Orange border
```

**Search Input:**
```
Background: #F8F9FA
Border: 1px solid #E9ECEF
Border radius: 24px
Padding: 12px 16px
Font: Body, Regular
Icon: Search icon left-aligned
Placeholder: Medium gray
```

### 4.6 Data Display
**Score Display:**
```
Background: #F8F9FA
Border: 2px solid #E9ECEF
Border radius: 8px
Padding: 16px
Font: Roboto Mono, Bold
Text align: center
Color: #2C3E50
```

**Statistics Table:**
```
Background: #FFFFFF
Border: 1px solid #E9ECEF
Cell padding: 12px
Header background: #F8F9FA
Header font: Body, Medium (500)
Data font: Roboto Mono, Regular
Alternating row colors
```

---

## 5. Iconography System

### 5.1 Icon Style
**Design Principles:**
- **Outlined style**: 2px stroke weight
- **Rounded corners**: 2px radius on line ends
- **Consistent sizing**: 24px standard, 32px for primary actions
- **Optical alignment**: Visual center, not geometric center

### 5.2 Core Icons
**Navigation Icons:**
- **Home**: House outline
- **Scores**: Target with score markings
- **Shoot**: Crosshair or target
- **Compete**: Trophy outline
- **Profile**: User circle

**Action Icons:**
- **Add**: Plus circle
- **Edit**: Pencil
- **Delete**: Trash can
- **Share**: Share arrow
- **Settings**: Gear

**Status Icons:**
- **Success**: Checkmark circle (green)
- **Error**: X circle (red)
- **Warning**: Exclamation triangle (amber)
- **Info**: Info circle (blue)

### 5.3 Clay Shooting Specific Icons
**Disciplines:**
- **ESP**: Sporting clays icon
- **DTL**: Down the line target
- **Skeet**: Skeet field layout
- **Trap**: Trap house icon

**Equipment:**
- **Gun**: Shotgun silhouette
- **Cartridge**: Shell icon
- **Choke**: Choke tube icon
- **Glasses**: Safety glasses

**Scoring:**
- **Hit**: Filled circle or checkmark
- **Miss**: Empty circle or X
- **Kill**: Broken target icon
- **Lost**: Intact target icon

---

## 6. Layout System

### 6.1 Grid System
**12-Column Grid:**
- **Container max-width**: 1200px
- **Gutter width**: 20px
- **Breakpoints**: 
  - Mobile: 375px
  - Tablet: 768px
  - Desktop: 1024px

**Mobile-First Approach:**
- **Single column**: Default layout
- **Two columns**: Tablet landscape
- **Multi-column**: Desktop only

### 6.2 Spacing System
**Base Unit: 8px**
- **XS**: 4px (0.25rem)
- **S**: 8px (0.5rem)
- **M**: 16px (1rem)
- **L**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **XXL**: 40px (2.5rem)

**Component Spacing:**
- **Internal padding**: 16px standard
- **Between components**: 24px
- **Section spacing**: 32px
- **Page margins**: 20px mobile, 32px desktop

### 6.3 Responsive Behavior
**Mobile (375px - 767px):**
- **Single column layouts**
- **Full-width components**
- **Stacked navigation**
- **Touch-optimized spacing**

**Tablet (768px - 1023px):**
- **Two-column layouts**
- **Sidebar navigation**
- **Larger touch targets**
- **Landscape optimizations**

**Desktop (1024px+):**
- **Multi-column layouts**
- **Hover states**
- **Keyboard navigation**
- **Dense information display**

---

## 7. Interaction Design

### 7.1 Touch Interactions
**Minimum Touch Targets:**
- **Buttons**: 44px x 44px minimum
- **Score entry**: 80px x 80px for primary actions
- **Links**: 40px x 40px minimum
- **Form inputs**: 48px height minimum

**Feedback Patterns:**
- **Immediate visual feedback**: Color change on touch
- **Haptic feedback**: Vibration for score entry
- **Audio feedback**: Optional sound confirmation
- **Loading states**: Skeleton screens, never spinners

### 7.2 Gestures
**Supported Gestures:**
- **Tap**: Primary selection
- **Long press**: Context menus
- **Swipe**: Navigation between screens
- **Pull to refresh**: Update data
- **Pinch to zoom**: Scorecard viewing

**Avoided Gestures:**
- **Complex multi-finger**: Difficult with gloves
- **Precise movements**: Challenging outdoors
- **Hidden interactions**: All actions visible

### 7.3 Animation & Transitions
**Micro-interactions:**
- **Button press**: 100ms scale down
- **Success feedback**: 300ms checkmark animation
- **Error shake**: 200ms horizontal movement
- **Loading pulse**: 1000ms opacity cycle

**Page Transitions:**
- **Slide transitions**: 300ms ease-out
- **Fade overlays**: 200ms opacity change
- **Modal appearance**: 250ms scale up
- **Bottom sheet**: 300ms slide up

---

## 8. Accessibility Features

### 8.1 Visual Accessibility
**High Contrast Mode:**
- **Enhanced contrast ratios**: 7:1 minimum
- **Bold text options**: Automatically applied
- **Larger text sizes**: User-controlled scaling
- **Reduced motion**: Disable animations

**Low Vision Support:**
- **Screen reader compatibility**: Full VoiceOver support
- **Focus indicators**: High contrast outlines
- **Color-blind friendly**: Patterns supplement color
- **Magnification**: Works with system zoom

### 8.2 Motor Accessibility
**Touch Assistance:**
- **Larger touch targets**: 60px minimum option
- **Sticky buttons**: Prevent accidental presses
- **Voice input**: Score entry by voice
- **Switch control**: External device support

**Outdoor Considerations:**
- **Glove compatibility**: Capacitive touch optimized
- **One-handed operation**: All primary functions
- **Simplified interactions**: Reduce complex gestures
- **Error prevention**: Confirmation dialogs

### 8.3 Cognitive Accessibility
**Mental Load Reduction:**
- **Familiar patterns**: Consistent interactions
- **Clear labeling**: Descriptive button text
- **Progress indicators**: Show completion status
- **Undo functionality**: Reversible actions

**Learning Support:**
- **Contextual help**: Discipline-specific guidance
- **Tutorials**: Interactive learning
- **Tooltips**: Explanation for complex features
- **Consistent behavior**: Predictable responses

---

## 9. Brand Integration

### 9.1 Logo Treatment
**Primary Logo:**
- **Horizontal layout**: Full name with icon
- **Vertical layout**: Stacked for square spaces
- **Icon only**: 32px minimum size
- **Monochrome**: Single color versions

**Usage Guidelines:**
- **Clear space**: 2x logo height on all sides
- **Minimum size**: 120px wide for horizontal
- **Background contrast**: Always legible
- **No modifications**: Use approved versions only

### 9.2 Brand Voice in UI
**Tone Characteristics:**
- **Professional**: Serious about the sport
- **Approachable**: Welcoming to beginners
- **Encouraging**: Celebrates improvement
- **Precise**: Accurate and detailed

**Copy Guidelines:**
- **Button text**: Action-oriented (Record, Share, Join)
- **Error messages**: Helpful, not blaming
- **Success messages**: Encouraging, specific
- **Instructions**: Clear, concise steps

### 9.3 Clay Shooting Context
**Cultural Sensitivity:**
- **Traditional terminology**: Use established terms
- **British English**: Colour, honour, centre
- **Formal address**: Respectful communication
- **Safety emphasis**: Always prioritize safety

**Visual References:**
- **Clay targets**: Orange circles, broken patterns
- **Shooting grounds**: Rural, green environments
- **Equipment**: Shotguns, cartridges, safety gear
- **Competitions**: Trophies, certificates, classifications

---

## 10. Implementation Guidelines

### 10.1 Development Handoff
**Asset Delivery:**
- **SVG icons**: Scalable, all sizes
- **PNG fallbacks**: 1x, 2x, 3x resolutions
- **Color definitions**: Hex, RGB, HSL values
- **Typography**: Font files and specifications

**Component Specifications:**
- **Measurement units**: Pixels and rem values
- **Interaction states**: Hover, active, disabled
- **Responsive behavior**: Breakpoint specifications
- **Animation timings**: Duration and easing

### 10.2 Quality Assurance
**Testing Requirements:**
- **Cross-device testing**: Multiple screen sizes
- **Accessibility testing**: Screen readers, keyboard
- **Performance testing**: Loading times, animations
- **Usability testing**: Real user feedback

**Approval Process:**
- **Design review**: Stakeholder approval
- **Development review**: Technical feasibility
- **User testing**: Validation with clay shooters
- **Iteration cycles**: Continuous improvement

### 10.3 Design System Evolution
**Version Control:**
- **Component library**: Centralized design system
- **Documentation**: Always up-to-date
- **Change tracking**: Version history
- **Team communication**: Updates and rationale

**Continuous Improvement:**
- **User feedback**: Regular collection and analysis
- **Analytics integration**: Usage pattern analysis
- **Performance monitoring**: System responsiveness
- **Accessibility audits**: Regular compliance checks

---

## 11. Platform-Specific Considerations

### 11.1 iOS Design Adaptations
**iOS Guidelines:**
- **SF Symbols**: Use system icons where appropriate
- **Navigation patterns**: iOS-standard back buttons
- **Keyboard handling**: Proper input management
- **Safe areas**: Respect notch and home indicator

**iOS-Specific Features:**
- **Dynamic Type**: Support system text sizing
- **Dark Mode**: Automatic theme switching
- **Haptic feedback**: Appropriate haptic patterns
- **Shortcuts**: Siri integration for common actions

### 11.2 Android Design Adaptations
**Material Design Elements:**
- **Floating Action Button**: Primary action emphasis
- **Bottom sheets**: Android-standard modals
- **Snackbars**: Temporary messages
- **Ripple effects**: Touch feedback

**Android-Specific Features:**
- **Adaptive icons**: Multiple icon formats
- **Back button**: Hardware back button support
- **Notification system**: Rich notifications
- **Widgets**: Home screen widgets

### 11.3 Web Application Considerations
**Progressive Web App:**
- **Responsive design**: All screen sizes
- **Offline functionality**: Service worker implementation
- **App-like experience**: Full-screen, no browser chrome
- **Installation**: Add to home screen

**Web-Specific Features:**
- **Keyboard navigation**: Full accessibility
- **URL routing**: Bookmarkable pages
- **Print styles**: Scorecard printing
- **Share API**: Native sharing when available

---

## Conclusion

This UI design guide provides a comprehensive visual framework for ScoreMyClays, adapted from GolfGameBook's proven success patterns. The system balances modern design principles with clay shooting traditions, ensuring both usability and cultural appropriateness.

Key success factors:
- **Outdoor optimization**: High contrast, large targets, glove compatibility
- **Professional presentation**: Suitable for official records and sharing
- **Accessibility first**: Inclusive design for all users
- **Clay shooting context**: Respectful of traditions and terminology

By following these guidelines, ScoreMyClays will deliver a visually appealing, highly functional, and culturally appropriate experience that serves the UK clay shooting community effectively.

---

*Next: Component specifications, design tokens, and asset library creation.*