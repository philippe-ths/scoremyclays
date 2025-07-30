# 🔧 ScoreMyClays Test Tool Setup Plan

## Plan Overview

**Purpose**: Set up and configure the testing tools and infrastructure for ScoreMyClays MVP
**Timeline**: Single development session focused on tool installation and configuration
**Goal**: Establish complete testing tool foundation ready for test implementation
**Scope**: Tool setup only - no actual test creation or implementation

## Reference Architecture

This plan implements the formal testing strategy documented in:

- **`docs/PWA_TESTING_GUIDE.md`**: Complete testing architecture and standards
- **`docs/FUNCTIONAL_SPECIFICATION.md`**: MVP scope and feature constraints
- **`.cursor/rules/20-testing-standards.mdc`**: AI agent testing guidelines
- **`.cursor/rules/21-test-automation-constraints.mdc`**: Implementation constraints

## Tool Setup Scope

**FOCUS**: Configure complete testing infrastructure for MVP development:

🔧 **Tool Installation & Configuration**:

- **Vitest**: Unit testing framework with coverage thresholds
- **React Testing Library**: Component testing with accessibility focus
- **Playwright**: E2E testing with PWA capabilities
- **Browser MCP**: Universal debugging and real-time inspection
- **VS Code Extensions**: Testing productivity and integration
- **Configuration Files**: Optimized settings for MVP development

🎯 **Ready for Implementation**:

- Test directory structure established
- Mock data and utilities configured
- Coverage thresholds and scripts defined
- Browser MCP integrated across all testing layers
- Documentation and standards in place

## Tool Setup Architecture

### Testing Tool Stack

| Tool                      | Purpose                                    | Status     | Configuration Priority |
| ------------------------- | ------------------------------------------ | ---------- | ---------------------- |
| **Vitest**                | Unit testing framework                     | ✅ Setup   | High - Core testing    |
| **React Testing Library** | Component testing                          | ✅ Setup   | High - UI validation   |
| **Playwright**            | E2E testing                                | ✅ Setup   | Medium - Workflows     |
| **Browser MCP**           | Universal debugging & real-time inspection | ⏳ Pending | High - AI integration  |

### Configuration Files Status

- **`vite.config.ts`**: ✅ Vitest configured with coverage thresholds
- **`package.json`**: ✅ Scripts and dependencies installed
- **`playwright.config.ts`**: ✅ PWA and mobile testing configured
- **`src/__tests__/setup.ts`**: ✅ Test utilities and mock data
- **`.vscode/settings.json`**: ✅ Development environment optimized

## Phase 1: Core Tool Installation ✅ **COMPLETE**

### Testing Dependencies Installation

- [x] **Vitest Setup** ✅ **COMPLETE**

  ```bash
  npm install -D vitest @vitest/ui @vitest/browser
  ```

- [x] **React Testing Library Setup** ✅ **COMPLETE**

  ```bash
  npm install -D @testing-library/react @testing-library/user-event
  npm install -D @testing-library/jest-dom jsdom
  ```

- [x] **Playwright Setup** ✅ **COMPLETE**

  ```bash
  npm init playwright@latest
  npm install -D @playwright/test
  ```

### Configuration Setup

- [x] **Vitest Configuration** ✅ **COMPLETE**

  - [x] Coverage thresholds: 80% minimum, 90% for business logic ✅
  - [x] Vitest Browser Mode for component testing ✅
  - [x] Integration with existing `vite.config.ts` ✅

- [x] **Test Directory Structure** ✅ **COMPLETE**

  ```
  app/src/__tests__/          # Unit and component tests ✅
  ├── components/             # Component-specific tests ✅
  ├── lib/                   # Utility function tests ✅
  ├── context/               # React context tests ✅
  └── setup.ts               # Test configuration ✅

  app/tests/                  # E2E and integration tests ✅
  ├── scoring/               # Scoring workflow tests ✅
  ├── pwa/                   # PWA feature tests ✅
  └── performance/           # Performance tests ✅
  ```

- [x] **Test Utilities Configuration** ✅ **COMPLETE**
  - [x] Custom render function with providers ✅
  - [x] MVP mock data generators (MOCK_SPORTING_CLAYS_DATA) ✅
  - [x] PWA mock utilities (serviceWorker, localStorage) ✅

## Phase 2: Browser MCP Integration ⏳ **PENDING**

### Browser MCP Installation (Universal Debugging)

- [ ] **Chrome Extension Setup** ⏳ **NEXT PRIORITY**

  - [ ] Install Browser MCP Chrome extension from Chrome Web Store
  - [ ] Pin extension to Chrome toolbar for easy access
  - [ ] Connect extension to MCP server
  - [ ] Test basic navigation and DOM access functionality

- [ ] **MCP Server Configuration** ⏳ **NEXT PRIORITY**

  - [ ] Configure Cursor IDE with Browser MCP integration
  - [ ] Set up Claude Desktop MCP configuration (if applicable)
  - [ ] Verify real-time DOM access and console log monitoring
  - [ ] Test screenshot elimination through live inspection

### Browser MCP Validation

- [ ] **Tool Integration Testing** ⏳ **NEXT PRIORITY**

  - [ ] Verify Browser MCP works with all testing layers
  - [ ] Test natural language command execution
  - [ ] Confirm real-time debugging capabilities
  - [ ] Validate screenshot workflow elimination

- [ ] **Configuration Documentation** ⏳ **NEXT PRIORITY**
  - [ ] Document Browser MCP setup process
  - [ ] Create configuration examples for future reference
  - [ ] Verify integration with existing test infrastructure

## Phase 3: Development Environment Setup ✅ **COMPLETE**

### VS Code Configuration

- [x] **Recommended Extensions** ✅ **COMPLETE**

  - [x] Vitest extension for test running and debugging ✅
  - [x] Playwright Test for VS Code extension ✅
  - [x] Testing Library extension for component testing ✅
  - [x] ESLint and Prettier for code quality ✅
  - [x] PWA Tools extension for PWA debugging ✅

- [x] **Workspace Settings** ✅ **COMPLETE**

  - [x] `.vscode/settings.json` configured for optimal testing workflow ✅
  - [x] Test file associations and patterns ✅
  - [x] Auto-save and format on save enabled ✅
  - [x] Testing-specific UI preferences ✅

### Documentation Setup

- [x] **Testing Standards** ✅ **COMPLETE**

  - [x] `docs/PWA_TESTING_GUIDE.md` - Complete testing architecture ✅
  - [x] `.cursor/rules/22-browser-mcp-integration.mdc` - Browser MCP standards ✅
  - [x] Testing patterns and constraints documented ✅
  - [x] MVP scope alignment documented ✅

## Implementation Status

### Tool Setup Session ✅ **COMPLETE**

- **Focus**: Testing tool installation and configuration
- **Deliverables**:
  - [x] Vitest installation and configuration ✅
  - [x] React Testing Library setup ✅
  - [x] Playwright configuration ✅
  - [x] Test directory structure ✅
  - [x] Mock data and utilities ✅
  - [x] VS Code development environment ✅
  - [x] Documentation and standards ✅
- **Duration**: Single session
- **Status**: ✅ Complete testing tool foundation established

### Next Priority: Browser MCP Installation ⏳ **PENDING**

- **Focus**: Browser MCP setup and integration
- **Deliverables**:
  - [ ] Chrome extension installation ⏳
  - [ ] MCP server configuration ⏳
  - [ ] Integration validation ⏳
  - [ ] Documentation completion ⏳
- **Duration**: 30-60 minutes
- **Status**: Ready for immediate implementation

### Ready for Development

**Tool Infrastructure**: ✅ Complete and ready for test implementation
**Browser MCP**: ⏳ Installation pending (final setup step)
**Documentation**: ✅ Complete with standards and guidelines
**Development Environment**: ✅ VS Code optimized for testing workflow

## Tool Setup Success ✅ **ACHIEVED**

### Infrastructure Completion

- **✅ Testing Dependencies**: All frameworks installed and configured
- **✅ Configuration Files**: All tool configurations optimized
- **✅ Directory Structure**: Standardized test organization established
- **✅ Mock Data**: MVP-aligned test utilities ready
- **✅ Documentation**: Complete standards and guidelines documented
- **✅ Development Environment**: VS Code optimized for testing workflow

### Next Phase Requirements

**Browser MCP Installation**: Final tool setup step for universal debugging
**Testing Infrastructure**: Ready for immediate test implementation
**Standards Compliance**: All configurations align with MVP scope and PWA requirements

## Tools and Resources

### Installed Testing Tools

- **Vitest**: https://vitest.dev/ - Unit testing framework ✅
- **React Testing Library**: https://testing-library.com/ - Component testing ✅
- **Playwright**: https://playwright.dev/ - E2E testing framework ✅
- **Browser MCP**: https://github.com/modelcontextprotocol/mcp-browser - Universal debugging ⏳

### AI and Automation (Ready)

- **Cursor IDE**: AI-enhanced development with Browser MCP integration
- **Browser MCP**: Real-time debugging eliminating screenshot workflows
- **Natural Language Testing**: AI-generated test scenarios for MVP workflows
- **Universal Debugging**: Cross-cutting inspection across all testing layers

### Configuration Files (Complete)

- **`vite.config.ts`**: Vitest configuration with coverage thresholds ✅
- **`playwright.config.ts`**: PWA and mobile testing configuration ✅
- **`package.json`**: Testing scripts and dependencies ✅
- **`src/__tests__/setup.ts`**: Test utilities and MVP mock data ✅
- **`.vscode/settings.json`**: Development environment optimization ✅

---

**🎯 Status**: Tool setup complete - ready for Browser MCP installation and test implementation
**🚀 Next Step**: Install Browser MCP Chrome extension to complete testing infrastructure
