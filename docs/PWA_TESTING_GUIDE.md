# ScoreMyClays PWA Testing Architecture

## Overview

This document defines the comprehensive testing strategy for the ScoreMyClays Progressive Web Application, optimized for clay shooting domain requirements and mobile-first development.

## Testing Philosophy

### Core Principles
1. **Clay Shooter Focused**: All testing scenarios prioritize real-world clay shooting use cases
2. **Mobile-First**: Test design emphasizes touch interfaces and outdoor visibility
3. **Offline-First**: PWA functionality must work reliably without network connectivity
4. **Performance Critical**: Scoring interactions must be instantaneous and responsive
5. **AI-Enhanced**: Leverage Cursor IDE capabilities for comprehensive test coverage

### Quality Standards
- **Zero tolerance** for scoring data loss or corruption
- **Sub-200ms** response time for critical scoring interactions
- **100% uptime** for offline core functionality
- **Cross-platform consistency** across iOS, Android, and desktop PWA

## Testing Architecture

### Three-Tier Testing Strategy

| Layer | Technology | Purpose | Coverage | Maintenance |
|-------|------------|---------|----------|-------------|
| **Unit** | Vitest | Business logic, utilities, pure functions | 70% | Low |
| **Component** | React Testing Library + Vitest Browser Mode | Component behavior, user interactions | 20% | Medium |
| **E2E/Integration** | Playwright | User workflows, PWA features, cross-browser | 8% | Medium |
| **Visual Regression** | BrowserBase + Stagehand | AI-enhanced UI testing, responsive design | 2% | Low |

### Technology Stack Rationale

#### Vitest (Unit Testing)
- **Justification**: Vite-native performance, excellent TypeScript support, minimal configuration
- **Clay Shooting Context**: Fast iteration for scoring calculation accuracy
- **Integration**: Built-in coverage reporting, hot module replacement during development

#### Playwright (E2E Testing)
- **Justification**: Superior PWA support, Chrome reliability, mobile device emulation
- **Clay Shooting Context**: Outdoor environment simulation, touch gesture testing
- **Integration**: Native service worker testing, offline mode simulation in Chrome

#### BrowserBase + Stagehand (Visual Regression)
- **Justification**: AI-powered element detection, self-healing selectors, cloud scalability
- **Clay Shooting Context**: Responsive design validation for outdoor readability
- **Integration**: Natural language test authoring, reduced maintenance overhead

## Implementation Standards

### Unit Testing Requirements

#### Business Logic Coverage
```typescript
// Example: Scoring calculation validation
describe('calculateSessionScore', () => {
  it('should handle 25-target perfect round', () => {
    const positions = Array(25).fill({ result: 'hit' })
    expect(calculateSessionScore(positions)).toBe(25)
  })

  it('should handle mixed results with no-birds', () => {
    const positions = [
      { result: 'hit' },
      { result: 'miss' },
      { result: 'no-bird' },
      { result: 'hit' }
    ]
    expect(calculateSessionScore(positions)).toBe(2)
  })

  it('should throw on invalid session data', () => {
    expect(() => calculateSessionScore(null)).toThrow('Invalid session data')
  })
})
```

#### Configuration Standards
- **Coverage Thresholds**: 80% minimum for all metrics
- **Test Environment**: Node.js for business logic, browser for components
- **Mock Strategy**: External APIs, localStorage, service workers
- **Naming Convention**: `should [expected behavior] when [condition]`

### Component Testing Requirements

#### React Testing Library Integration
```typescript
// Example: Scoring interface component test
describe('ScoringButton', () => {
  it('should record hit when tapped quickly', async () => {
    const user = userEvent.setup()
    const onScore = vi.fn()
    
    render(<ScoringButton onScore={onScore} />)
    
    await user.click(screen.getByRole('button', { name: /hit/i }))
    
    expect(onScore).toHaveBeenCalledWith('hit')
  })

  it('should handle rapid successive taps', async () => {
    const user = userEvent.setup()
    const onScore = vi.fn()
    
    render(<ScoringButton onScore={onScore} />)
    const button = screen.getByRole('button', { name: /hit/i })
    
    // Simulate rapid tapping
    await user.click(button)
    await user.click(button)
    await user.click(button)
    
    expect(onScore).toHaveBeenCalledTimes(1) // Should debounce
  })
})
```

#### Browser Mode Configuration
- **Provider**: Playwright for real browser testing
- **Headless Mode**: Default for CI, headed for debugging
- **Device Emulation**: Mobile viewports and touch events
- **Performance**: Monitor rendering times and memory usage

### E2E Testing Requirements

#### PWA-Specific Test Scenarios
```typescript
// Example: Offline functionality validation
test.describe('Offline Scoring', () => {
  test('should continue scoring session when network disconnects', async ({ page }) => {
    await page.goto('/scoring')
    
    // Start scoring session
    await page.click('[data-testid="new-session"]')
    await page.fill('[data-testid="session-name"]', 'Range Session')
    await page.click('[data-testid="start-session"]')
    
    // Record some scores online
    await page.click('[data-testid="score-hit"]')
    await page.click('[data-testid="score-miss"]')
    
    // Simulate network disconnect
    await page.context().setOffline(true)
    
    // Continue scoring offline
    await page.click('[data-testid="score-hit"]')
    await page.click('[data-testid="score-hit"]')
    
    // Verify scores are preserved
    await expect(page.locator('[data-testid="session-score"]')).toContainText('3/4')
    
    // Reconnect and verify sync
    await page.context().setOffline(false)
    await page.reload()
    await expect(page.locator('[data-testid="session-score"]')).toContainText('3/4')
  })
})
```

#### Chrome-Focused Testing
- **Desktop**: Chrome (latest stable version)
- **Mobile**: Android Chrome (latest stable version)
- **PWA Mode**: Installed PWA behavior validation in Chrome
- **Performance**: Core Web Vitals compliance in Chrome environment

### Visual Regression Testing

#### AI-Enhanced Testing with Stagehand
```typescript
// Example: Responsive design validation
describe('Responsive Scoring Interface', () => {
  it('should maintain usability across viewports', async () => {
    await stagehand.page.goto('/scoring')
    
    // AI-powered interaction
    await stagehand.act('start a new scoring session')
    await stagehand.act('record 5 hits in a row')
    
    // Test across viewports
    const viewports = [
      { width: 375, height: 667, name: 'iPhone' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ]

    for (const viewport of viewports) {
      await stagehand.page.setViewportSize(viewport)
      
      // AI understands responsive changes
      await stagehand.act('verify scoring buttons are easily tappable')
      
      const screenshot = await stagehand.page.screenshot({
        fullPage: true,
        animations: 'disabled'
      })
      
      expect(screenshot).toMatchSnapshot(`scoring-${viewport.name}.png`, {
        threshold: 0.2,
        maxDiffPixels: 1000
      })
    }
  })
})
```

## Clay Shooting Domain Requirements

### Critical Test Scenarios

#### Rapid Scoring Validation
- **Response Time**: <100ms for hit/miss/no-bird input
- **Touch Accuracy**: 44px minimum touch targets
- **Gesture Support**: Swipe gestures for position navigation
- **Visual Feedback**: Immediate confirmation of score recording

#### Competition Format Testing
- **Trap Shooting**: 25-target rounds, position rotation
- **Skeet Shooting**: Station-based scoring, doubles validation
- **Sporting Clays**: Variable target counts, multi-discipline sessions
- **Squad Rotation**: Multi-shooter session management

#### Environmental Condition Simulation
- **Outdoor Visibility**: High contrast mode, brightness adaptation
- **Glove Usage**: Touch sensitivity with protective gear
- **Weather Conditions**: Temperature extremes, moisture resistance
- **Battery Optimization**: Extended outdoor session testing

### Data Integrity Requirements

#### Session Data Validation
```typescript
// Example: Session data integrity test
describe('Session Data Integrity', () => {
  it('should recover from corrupted session data', async () => {
    // Simulate data corruption
    localStorage.setItem('scoring-session', '{"invalid": json}')
    
    const session = await recoverSession()
    
    expect(session).toEqual(getDefaultSession())
    expect(console.warn).toHaveBeenCalledWith('Session data corrupted, reset to default')
  })

  it('should maintain data consistency during rapid input', async () => {
    const session = createNewSession()
    
    // Simulate rapid scoring
    const promises = Array(25).fill(null).map((_, i) => 
      recordScore(session.id, i, 'hit')
    )
    
    await Promise.all(promises)
    
    const finalSession = await getSession(session.id)
    expect(finalSession.positions).toHaveLength(25)
    expect(finalSession.positions.every(p => p.result === 'hit')).toBe(true)
  })
})
```

## Performance Requirements

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: <2.5s
- **Interaction to Next Paint (INP)**: <200ms
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Contentful Paint (FCP)**: <1.8s

### Mobile Performance Standards
- **Touch Response**: <50ms latency
- **Battery Usage**: <5% per hour of active scoring
- **Memory Usage**: <50MB RAM footprint
- **Bundle Size**: <500KB initial load

### Performance Testing Implementation
```typescript
// Example: Performance validation
test.describe('Performance Requirements', () => {
  test('should meet Core Web Vitals on mobile', async ({ page }) => {
    await page.goto('/scoring')
    
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {
            lcp: entries.find(e => e.entryType === 'largest-contentful-paint')?.startTime,
            cls: entries.find(e => e.entryType === 'layout-shift')?.value,
            fcp: entries.find(e => e.entryType === 'paint' && e.name === 'first-contentful-paint')?.startTime
          }
          resolve(vitals)
        }).observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'paint'] })
      })
    })
    
    expect(metrics.lcp).toBeLessThan(2500)
    expect(metrics.cls).toBeLessThan(0.1)
    expect(metrics.fcp).toBeLessThan(1800)
  })
})
```

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Touch Targets**: Minimum 44x44px with adequate spacing
- **Keyboard Navigation**: Full functionality without mouse/touch
- **Screen Reader**: Complete ARIA implementation

### Outdoor Usability Testing
```typescript
// Example: Accessibility validation
describe('Outdoor Accessibility', () => {
  it('should maintain readability in high contrast mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addStyleTag({
      content: `
        * { 
          filter: contrast(150%) brightness(120%) !important;
        }
      `
    })
    
    await page.goto('/scoring')
    
    // Verify critical elements remain readable
    const scoreDisplay = page.locator('[data-testid="current-score"]')
    await expect(scoreDisplay).toBeVisible()
    
    const hitButton = page.locator('[data-testid="score-hit"]')
    await expect(hitButton).toHaveCSS('background-color', expect.stringMatching(/rgb\(.*\)/))
  })
})
```

## CI/CD Integration

### GitHub Actions Pipeline
```yaml
name: PWA Testing Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
        env:
          CI: true
      - run: npm run test:component
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        device: [desktop, mobile]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run build
      - run: npm run test:e2e:${{ matrix.device }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ matrix.device }}
          path: playwright-report/

  visual-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:visual
        env:
          BROWSERBASE_API_KEY: ${{ secrets.BROWSERBASE_API_KEY }}
          BROWSERBASE_PROJECT_ID: ${{ secrets.BROWSERBASE_PROJECT_ID }}

  performance-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run serve &
      - uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouse-ci.json'
          uploadArtifacts: true
```

### Quality Gates
- **Test Coverage**: >80% for unit tests, 100% for critical paths
- **Performance**: All Core Web Vitals in "Good" range in Chrome
- **Accessibility**: Zero violations for WCAG 2.1 AA
- **Chrome Compatibility**: 100% pass rate on Chrome desktop and mobile

## Monitoring and Maintenance

### Automated Monitoring
- **Real User Monitoring**: Performance tracking in production
- **Error Tracking**: Sentry integration for bug detection
- **Synthetic Testing**: Continuous validation of critical paths
- **Performance Regression**: Automated alerts for metric degradation

### Test Maintenance Strategy
- **Self-Healing Tests**: AI-powered selector adaptation
- **Quarterly Reviews**: Test relevance and coverage assessment
- **Domain Expert Validation**: Clay shooting community feedback
- **Performance Benchmarking**: Regular baseline updates

## Success Metrics

### Coverage Targets
- **Unit Test Coverage**: >90% for business logic
- **E2E Coverage**: 100% of critical user paths
- **Performance Compliance**: 95% Core Web Vitals "Good" ratings
- **Accessibility Compliance**: 100% WCAG 2.1 AA conformance

### Quality Indicators
- **Bug Escape Rate**: <2% for production releases
- **Performance Regression**: <5% degradation tolerance
- **Test Flakiness**: <1% false positive rate
- **Maintenance Overhead**: <10% of development time

This testing architecture ensures comprehensive validation of the ScoreMyClays PWA while maintaining development velocity and providing confidence in clay shooting domain accuracy.