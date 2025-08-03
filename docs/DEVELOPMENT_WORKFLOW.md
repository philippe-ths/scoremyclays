# Development Workflow - ScoreMyClays

## Overview

This guide outlines the complete development workflow for the ScoreMyClays clay shooting app,
integrating ESLint, Prettier, and TypeScript for optimal code quality and consistency.

## Tool Integration

### Code Quality Stack

- **ESLint**: Logic validation, best practices, and code quality
- **Prettier**: Automatic code formatting and style consistency
- **TypeScript**: Type safety and compile-time error detection
- **VS Code**: Unified development environment with real-time feedback

### Conflict-Free Configuration

Our setup ensures tools work together seamlessly:

- ✅ **No conflicts**: `eslint-config-prettier` disables ESLint formatting rules
- ✅ **Separation of concerns**: ESLint for logic, Prettier for formatting
- ✅ **Automatic workflows**: Save files to format and fix issues
- ✅ **Real-time feedback**: Immediate error detection and correction

## Daily Development Workflow

### 1. Development Environment Setup

Ensure you have the required VS Code extensions:

- **ESLint** - Real-time code quality feedback
- **Prettier** - Automatic code formatting
- **TypeScript** - Built-in type checking support

### 2. Real-Time Development Process

```
Write Code → TypeScript Checks → ESLint Validates → Prettier Formats → Save
    ↓              ↓                ↓                ↓           ↓
Type Safety → Logic Quality → Style Consistency → Auto-Fix → Commit Ready
```

#### Step-by-Step Process:

1. **Write code** with TypeScript intellisense
2. **See immediate feedback** - red squiggles for logic issues only
3. **Save files** - triggers automatic Prettier formatting
4. **Auto-fix** - correctable ESLint issues fixed on save
5. **Focus on logic** - tools handle formatting automatically

### 3. Pre-Commit Quality Assurance

Before every commit, run this sequence:

```bash
# Navigate to app directory
cd app

# 1. Check code quality and logic
npm run lint

# 2. Verify formatting consistency
npm run format:check

# 3. Ensure type safety
npm run type-check

# 4. Fix auto-correctable issues (if needed)
npm run lint:fix

# 5. Format any unformatted files (if needed)
npm run format
```

## Error Resolution Guide

### Priority Order

1. **🔴 TypeScript Errors**: Fix immediately - prevent builds
2. **🟠 ESLint Errors**: Address logic and safety issues
3. **🟡 ESLint Warnings**: Review for code quality improvements
4. **🟢 Formatting Issues**: Let Prettier handle automatically

### Common Scenarios

#### TypeScript Errors

```typescript
// ❌ Bad: Using 'any' for scoring data
const scores: any = getScores();

// ✅ Good: Proper typing for clay shooting
const scores: ScoringData[] = getScores();
```

#### ESLint Logic Issues

```typescript
// ❌ Bad: Unused variables
const shotsPerStand = 25; // unused

// ✅ Good: Remove unused or prefix with underscore
const _shotsPerStand = 25; // intentionally unused
```

#### Accessibility Warnings

```tsx
// ❌ Bad: Missing accessibility for outdoor use
<button onClick={handleScore}>Hit</button>

// ✅ Good: Proper accessibility for clay shooting
<button
  onClick={handleScore}
  aria-label="Mark clay as hit"
  type="button"
>
  Hit
</button>
```

## Clay Shooting Specific Guidelines

### Performance Considerations

- **Touch responsiveness**: Optimize for quick scoring inputs
- **Offline scenarios**: Handle disconnected clay shooting rounds
- **Mobile optimization**: Ensure smooth operation on shooting grounds

### Code Quality for Clay Shooting

- **Type safety**: Proper scoring data structures
- **Error handling**: Graceful offline/online transitions
- **Accessibility**: Outdoor visibility and touch-friendly interfaces
- **Performance**: Fast scoring input and display updates

### Example Clay Shooting Code Standards

```typescript
// Proper scoring data types
interface ShotResult {
  readonly id: string;
  readonly position: number;
  readonly result: 'hit' | 'miss';
  readonly timestamp: Date;
}

// Proper error handling for offline scoring
const saveScore = async (shot: ShotResult): Promise<void> => {
  try {
    await scoringService.save(shot);
  } catch (error) {
    // Handle offline scenario gracefully
    await offlineStorage.queue(shot);
    showOfflineIndicator();
  }
};

// Accessible scoring interface
const ScoringButton: React.FC<ScoringButtonProps> = ({
  onScore,
  result,
  position
}) => (
  <button
    onClick={() => onScore(result)}
    aria-label={`Mark position ${position} as ${result}`}
    className="touch-friendly-scoring-button"
    type="button"
  >
    {result === 'hit' ? 'Hit' : 'Miss'}
  </button>
);
```

## VS Code Configuration

Your VS Code should be configured with these settings (automatically set up in
`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Available Commands

### Development Commands

```bash
# Start development server
npm run dev

# Type checking (runs in parallel with development)
npm run type-check
```

### Quality Assurance Commands

```bash
# ESLint - Code quality and logic
npm run lint              # Check issues
npm run lint:fix          # Fix auto-correctable issues
npm run lint:strict       # Strict checking

# Prettier - Code formatting
npm run format            # Format all files
npm run format:check      # Check formatting without changes
```

### Build Commands

```bash
# Production build with quality checks
npm run build
```

## Team Collaboration

### Code Review Focus

When reviewing code, focus on:

- ✅ **Logic and architecture** - core clay shooting functionality
- ✅ **Type safety** - proper TypeScript usage
- ✅ **Accessibility** - outdoor mobile usability
- ✅ **Performance** - clay shooting app responsiveness
- ❌ **Formatting** - handled automatically by Prettier

### Consistency Benefits

- **Zero style debates** - Prettier enforces consistent formatting
- **Shared quality standards** - ESLint rules for all developers
- **Type safety** - TypeScript prevents runtime errors
- **Focus on features** - tools handle code style automatically

## Troubleshooting

### Common Issues

#### "Conflicting formatting rules"

- **Solution**: Ensure `prettier` is last in ESLint extends array
- **Check**: Run `npx eslint-config-prettier src/app/page.tsx` (flattened structure)

#### "ESLint and Prettier fighting"

- **Solution**: Never use `eslint-plugin-prettier` - use separate tools
- **Verify**: Check that formatting is handled by Prettier, not ESLint

#### "VS Code not formatting"

- **Solution**: Install Prettier extension and check default formatter settings
- **Verify**: Ensure `"editor.defaultFormatter": "esbenp.prettier-vscode"`

### Performance Issues

- **Slow linting**: Disable type-checked rules for faster development if needed
- **Large files**: Use ESLint file patterns to exclude unnecessary files
- **Build times**: Run type checking separate from linting

## Conclusion

This workflow ensures:

- 🎯 **High code quality** for clay shooting app reliability
- 🚀 **Consistent formatting** across the entire team
- 🔒 **Type safety** for scoring data integrity
- 📱 **Mobile optimization** for outdoor clay shooting usage
- ⚡ **Developer productivity** with automated quality checks

Follow this workflow to maintain professional-grade code while focusing on building the best clay
shooting scoring app possible.
