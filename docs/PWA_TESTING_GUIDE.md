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

| Layer               | Technology                                  | Purpose                                     | Coverage | Browser MCP Integration |
| ------------------- | ------------------------------------------- | ------------------------------------------- | -------- | ----------------------- |
| **Unit**            | Vitest                                      | Business logic, utilities, pure functions   | 70%      | AI Test Generation      |
| **Component**       | React Testing Library + Vitest Browser Mode | Component behavior, user interactions       | 20%      | Real Browser Validation |
| **E2E/Integration** | Playwright + Browser MCP                    | User workflows, PWA features, cross-browser | 8%       | Live Debugging          |
| **AI-Enhanced**     | Browser MCP (Cross-Cutting)                 | Real-time inspection across all layers      | 100%     | Integrated              |

### Technology Stack Rationale

#### Vitest (Unit Testing)

- **Justification**: Vite-native performance, excellent TypeScript support, minimal configuration
- **Clay Shooting Context**: Fast iteration for scoring calculation accuracy
- **Integration**: Built-in coverage reporting, hot module replacement during development

#### Playwright (E2E Testing)

- **Justification**: Superior PWA support, Chrome reliability, mobile device emulation
- **Clay Shooting Context**: Outdoor environment simulation, touch gesture testing
- **Integration**: Native service worker testing, offline mode simulation in Chrome

#### Browser MCP (Cross-Cutting Integration)

- **Justification**: Real-time UI inspection, cost-free local automation, eliminates screenshot workflows
- **MVP Context**: Authentic Sporting Clays testing with real touch interactions and session persistence
- **Integration**: Seamless Cursor/Claude debugging, live DOM access, real-time error detection across all testing layers

## Implementation Standards

### Unit Testing Requirements

#### Business Logic Coverage

```typescript
// Example: MVP Sporting Clays scoring calculation validation
describe("calculateSessionScore", () => {
  it("should handle 100-target perfect round", () => {
    const positions = Array(10)
      .fill(null)
      .map(() => Array(10).fill({ result: "hit" }));
    expect(calculateSessionScore(positions)).toBe(100);
  });

  it("should handle mixed results with no-birds", () => {
    const position1 = [
      { result: "hit" },
      { result: "miss" },
      { result: "no-bird" },
      { result: "hit" },
      ...Array(6).fill({ result: "hit" }),
    ];
    expect(calculatePositionScore(position1)).toBe(8); // 8/10 (no-bird doesn't count)
  });

  it("should throw on invalid session data", () => {
    expect(() => calculateSessionScore(null)).toThrow("Invalid session data");
  });
});
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
describe("ScoringButton", () => {
  it("should record hit when tapped quickly", async () => {
    const user = userEvent.setup();
    const onScore = vi.fn();

    render(<ScoringButton onScore={onScore} />);

    await user.click(screen.getByRole("button", { name: /hit/i }));

    expect(onScore).toHaveBeenCalledWith("hit");
  });

  it("should handle rapid successive taps", async () => {
    const user = userEvent.setup();
    const onScore = vi.fn();

    render(<ScoringButton onScore={onScore} />);
    const button = screen.getByRole("button", { name: /hit/i });

    // Simulate rapid tapping
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onScore).toHaveBeenCalledTimes(1); // Should debounce
  });
});
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
test.describe("Offline Scoring", () => {
  test("should continue scoring session when network disconnects", async ({
    page,
  }) => {
    await page.goto("/scoring");

    // Start scoring session
    await page.click('[data-testid="new-session"]');
    await page.fill('[data-testid="session-name"]', "Range Session");
    await page.click('[data-testid="start-session"]');

    // Record some scores online
    await page.click('[data-testid="score-hit"]');
    await page.click('[data-testid="score-miss"]');

    // Simulate network disconnect
    await page.context().setOffline(true);

    // Continue scoring offline
    await page.click('[data-testid="score-hit"]');
    await page.click('[data-testid="score-hit"]');

    // Verify scores are preserved
    await expect(page.locator('[data-testid="session-score"]')).toContainText(
      "3/4"
    );

    // Reconnect and verify sync
    await page.context().setOffline(false);
    await page.reload();
    await expect(page.locator('[data-testid="session-score"]')).toContainText(
      "3/4"
    );
  });
});
```

#### Chrome-Focused Testing

- **Desktop**: Chrome (latest stable version)
- **Mobile**: Android Chrome (latest stable version)
- **PWA Mode**: Installed PWA behavior validation in Chrome
- **Performance**: Core Web Vitals compliance in Chrome environment

### Cross-Cutting Browser MCP Integration

Browser MCP serves as a **universal debugging and inspection layer** across all testing tiers, providing real-time UI access without screenshot workflows.

#### Integration Across Testing Layers

##### **Unit Testing + Browser MCP**

```typescript
// AI-generated unit tests with real browser validation
describe("MVP Scoring Calculations", () => {
  it("should calculate position score correctly", async () => {
    // Traditional unit test
    const result = calculatePositionScore([...hits, ...misses]);
    expect(result).toBe(8);

    // Browser MCP validation
    await browserMCP.execute("Open scoring interface and verify calculation");
    const uiScore = await browserMCP.getElementText(
      '[data-testid="position-score"]'
    );
    expect(uiScore).toContain("8/10");
  });
});
```

##### **Component Testing + Browser MCP**

```typescript
// React Testing Library + Real browser validation
describe("Scoring Button Component", () => {
  it("should handle rapid touch inputs", async () => {
    render(<ScoringButton onScore={mockFn} />);

    // Component test
    await user.click(screen.getByRole("button", { name: /hit/i }));
    expect(mockFn).toHaveBeenCalled();

    // Browser MCP real interaction test
    await browserMCP.execute("Rapidly tap hit button 5 times");
    const debugInfo = await browserMCP.getConsoleLogs();
    expect(debugInfo).not.toContain("error");
  });
});
```

##### **E2E Testing + Browser MCP**

```typescript
// Playwright + Browser MCP enhanced debugging
test("Complete MVP Sporting Clays session", async ({ page }) => {
  await page.goto("/scoring");

  // Traditional E2E test
  await page.click('[data-testid="new-session"]');
  await page.fill('[data-testid="ground-name"]', "Test Ground");

  // Browser MCP real-time debugging
  await browserMCP.execute("Monitor session creation process");
  const sessionState = await browserMCP.getAccessibilitySnapshot();

  // If errors occur, Browser MCP provides immediate insight
  if (sessionState.errors?.length > 0) {
    const consoleLogs = await browserMCP.getConsoleLogs();
    const networkActivity = await browserMCP.getNetworkActivity();
    // Cursor sees full context without manual screenshot
  }
});
```

### AI-Enhanced Testing

#### Browser MCP Natural Language Workflows

```typescript
// Example: AI-driven MVP Sporting Clays workflow with Browser MCP
describe("MVP Sporting Clays Session Automation", () => {
  it("should complete a 100-target session with natural language commands", async () => {
    // Natural language instructions to Browser MCP via Cursor/Claude
    const commands = [
      "Navigate to ScoreMyClays PWA",
      "Start a new Sporting Clays session",
      "Enter shooter name 'Test Shooter' and ground 'Test Range'",
      "Complete position 1 with pattern: 8 hits, 2 misses",
      "Complete position 2 with pattern: 7 hits, 2 misses, 1 no-bird",
      "Complete remaining 8 positions with varied scoring",
      "Verify final score shows 78/100 (78%)",
      "Save session and confirm data persistence",
    ];

    // Browser MCP executes in real Chrome with actual touch events
    for (const command of commands) {
      await browserMCP.execute(command);
      await browserMCP.waitForCompletion();
    }

    // Verify session data in actual localStorage
    const sessionData = await browserMCP.getLocalStorage(
      "clay-shooting-sessions"
    );
    expect(sessionData).toContain("Test Shooter");
    expect(sessionData).toContain("78/100");
  });

  it("should test offline PWA functionality", async () => {
    await browserMCP.execute("Open ScoreMyClays and go offline");
    await browserMCP.execute("Continue scoring session without network");
    await browserMCP.execute("Record 10 more clay results");
    await browserMCP.execute("Go back online and verify data sync");

    // Real browser offline testing with service worker
    const syncStatus = await browserMCP.getNetworkStatus();
    expect(syncStatus.dataPersisted).toBe(true);
  });
});
```

## Clay Shooting Domain Requirements

### Critical Test Scenarios

#### Rapid Scoring Validation

- **Response Time**: <100ms for hit/miss/no-bird input
- **Touch Accuracy**: 44px minimum touch targets
- **Gesture Support**: Swipe gestures for position navigation
- **Visual Feedback**: Immediate confirmation of score recording

#### MVP Workflow Testing

- **Sporting Clays Only**: 10 positions × 10 targets format
- **Individual Sessions**: Single shooter scoring workflow
- **Position Management**: Sequential position naming and scoring
- **Session Completion**: Full 100-target session validation

#### Environmental Condition Simulation

- **Outdoor Visibility**: High contrast mode, brightness adaptation
- **Glove Usage**: Touch sensitivity with protective gear
- **Weather Conditions**: Temperature extremes, moisture resistance
- **Battery Optimization**: Extended outdoor session testing

### Data Integrity Requirements

#### Session Data Validation

```typescript
// Example: Session data integrity test
describe("Session Data Integrity", () => {
  it("should recover from corrupted session data", async () => {
    // Simulate data corruption
    localStorage.setItem("scoring-session", '{"invalid": json}');

    const session = await recoverSession();

    expect(session).toEqual(getDefaultSession());
    expect(console.warn).toHaveBeenCalledWith(
      "Session data corrupted, reset to default"
    );
  });

  it("should maintain data consistency during rapid input", async () => {
    const session = createNewSession();

    // Simulate rapid scoring
    const promises = Array(25)
      .fill(null)
      .map((_, i) => recordScore(session.id, i, "hit"));

    await Promise.all(promises);

    const finalSession = await getSession(session.id);
    expect(finalSession.positions).toHaveLength(25);
    expect(finalSession.positions.every((p) => p.result === "hit")).toBe(true);
  });
});
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
test.describe("Performance Requirements", () => {
  test("should meet Core Web Vitals on mobile", async ({ page }) => {
    await page.goto("/scoring");

    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            lcp: entries.find((e) => e.entryType === "largest-contentful-paint")
              ?.startTime,
            cls: entries.find((e) => e.entryType === "layout-shift")?.value,
            fcp: entries.find(
              (e) =>
                e.entryType === "paint" && e.name === "first-contentful-paint"
            )?.startTime,
          };
          resolve(vitals);
        }).observe({
          entryTypes: ["largest-contentful-paint", "layout-shift", "paint"],
        });
      });
    });

    expect(metrics.lcp).toBeLessThan(2500);
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.fcp).toBeLessThan(1800);
  });
});
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
describe("Outdoor Accessibility", () => {
  it("should maintain readability in high contrast mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addStyleTag({
      content: `
        * { 
          filter: contrast(150%) brightness(120%) !important;
        }
      `,
    });

    await page.goto("/scoring");

    // Verify critical elements remain readable
    const scoreDisplay = page.locator('[data-testid="current-score"]');
    await expect(scoreDisplay).toBeVisible();

    const hitButton = page.locator('[data-testid="score-hit"]');
    await expect(hitButton).toHaveCSS(
      "background-color",
      expect.stringMatching(/rgb\(.*\)/)
    );
  });
});
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
          node-version: "20"
          cache: "npm"
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
          configPath: "./lighthouse-ci.json"
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

## Development Environment Setup

### Required VS Code Extensions

The following extensions are essential for implementing the formal testing architecture and maintaining clay shooting domain accuracy:

#### **Essential Testing Extensions**

- **`vitest.explorer`** - Interactive test runner with real-time feedback for scoring calculations
- **`ms-playwright.playwright`** - E2E test debugging and PWA testing capabilities
- **`dbaeumer.vscode-eslint`** - Real-time code quality feedback for outdoor mobile reliability
- **`esbenp.prettier-vscode`** - Automatic formatting for consistent clay shooting app code

#### **Development Productivity Extensions**

- **`usernamehw.errorlens`** - Inline error display critical for outdoor development scenarios
- **`formulahendry.auto-rename-tag`** - Accelerated JSX component development
- **`eamodio.gitlens`** - Version control for scoring algorithms and business logic tracking

#### **AI-Enhanced Testing Extensions**

- **Browser MCP Chrome Extension** - Real browser automation for AI-driven testing
- **`rangav.vscode-thunder-client`** - API testing for offline sync and data persistence
- **`ms-vscode.live-server`** - Live PWA preview for mobile responsiveness testing
- **`humao.rest-client`** - HTTP endpoint testing with .http files

### VS Code Configuration

The following workspace settings optimize the development environment for ScoreMyClays PWA development:

```json
{
  // Formatter configuration
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,

  // ESLint configuration
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // TypeScript configuration
  "typescript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always",

  // Vitest configuration
  "vitest.enable": true,
  "vitest.commandLine": "npm run test",

  // File associations for clay shooting context
  "files.associations": {
    "*.spec.ts": "typescript",
    "*.test.ts": "typescript",
    "*.test.tsx": "typescriptreact"
  },

  // Playwright configuration
  "playwright.showTrace": true,
  "playwright.reuseBrowser": true,

  // Auto-save for rapid clay shooting development
  "files.autoSave": "onFocusChange",

  // Minimize distractions for outdoor coding
  "workbench.startupEditor": "none",
  "explorer.compactFolders": false,

  // Performance for PWA development
  "typescript.suggest.autoImports": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

### Browser MCP Configuration

For AI-enhanced testing with real browser automation:

#### **Cursor Configuration**

Add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "browser-mcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

#### **Claude Desktop Configuration**

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "browser-mcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

#### **Chrome Extension Installation**

1. Install Browser MCP Chrome Extension from Chrome Web Store
2. Pin the extension to Chrome toolbar
3. Click extension icon and press "Connect" to link browser to MCP server
4. Test with natural language commands like "Navigate to localhost:3000 and test scoring interface"

### Extension Installation

Install essential extensions via VS Code Command Palette (`Cmd+Shift+P`) or terminal:

```bash
# Essential testing extensions
code --install-extension vitest.explorer
code --install-extension ms-playwright.playwright
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode

# Development productivity
code --install-extension formulahendry.auto-rename-tag
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens

# AI-enhanced testing
# Install Browser MCP Chrome Extension manually from Chrome Web Store
# Add Browser MCP server to Cursor/Claude Desktop configuration

# Optional PWA development
code --install-extension rangav.vscode-thunder-client
code --install-extension ms-vscode.live-server
code --install-extension humao.rest-client
```

### Clay Shooting Development Workflow

The configured environment supports:

1. **Real-time Test Feedback**: Vitest Explorer provides immediate feedback on scoring calculation accuracy
2. **PWA Testing Integration**: Playwright extension enables seamless E2E testing of offline functionality
3. **AI-Enhanced Testing**: Browser MCP enables natural language test creation with real browser automation
4. **Code Quality Assurance**: ESLint catches errors that could affect clay shooting data integrity
5. **Rapid Iteration**: Auto-save and formatting enable fast development cycles for outdoor use cases
6. **Performance Monitoring**: Extensions support Core Web Vitals validation and mobile optimization

This testing architecture ensures comprehensive validation of the ScoreMyClays PWA while maintaining development velocity and providing confidence in clay shooting domain accuracy.
