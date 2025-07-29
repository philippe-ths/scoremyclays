# ESLint and Prettier Setup for ScoreMyClays

## Overview

ESLint and Prettier have been configured for this Next.js 14 TypeScript project with comprehensive rules for code quality, consistency, and best practices specific to clay shooting app development. The tools work together without conflicts, with ESLint handling logic and code quality while Prettier handles formatting.

## Installed Packages

### ESLint Packages
```bash
npm install --save-dev \
  @typescript-eslint/eslint-plugin@^8.0.0 \
  @typescript-eslint/parser@^8.0.0 \
  eslint-plugin-unused-imports
```

### Prettier Packages
```bash
npm install --save-dev \
  prettier \
  eslint-config-prettier
```

Note: The other required packages (`eslint`, `eslint-config-next`, `eslint-plugin-react`, etc.) were already installed through `eslint-config-next`.

## Configuration Files

### `.eslintrc.cjs`
- Main ESLint configuration with TypeScript, React, and Next.js rules
- Optimized for mobile PWA development and clay shooting workflows
- Includes accessibility rules important for outdoor mobile use
- Custom rules for performance and code quality
- **Includes `eslint-config-prettier` to prevent formatting conflicts**

### `.eslintignore`
- Excludes build outputs, dependencies, and generated files
- Prevents linting of service worker files and type definitions

### `.prettierrc.js`
- Prettier configuration optimized for TypeScript and React
- Single quotes, semicolons, and 80-character line width
- Consistent formatting for JSX and TypeScript files
- Special rules for markdown and JSON files

### `.prettierignore`
- Excludes build outputs, dependencies, and generated files
- Mirrors `.eslintignore` for consistency

### `.vscode/settings.json`
- VS Code integration for both ESLint and Prettier
- **Prettier as default formatter** for automatic formatting on save
- **ESLint for code quality** with auto-fix on save
- Proper file associations for TypeScript/React files

## Available Scripts

### ESLint Scripts
```bash
# Run ESLint with Next.js integration (recommended)
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Run strict ESLint check on all files
npm run lint:strict
```

### Prettier Scripts
```bash
# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

### Other Scripts
```bash
# Type checking
npm run type-check
```

## Development Workflow

### Recommended Workflow
1. **Write code** with real-time ESLint feedback in VS Code
2. **Save files** to auto-format with Prettier and auto-fix ESLint issues
3. **Before committing**: Run `npm run lint` and `npm run format:check`
4. **Address any remaining issues** manually

### Conflict-Free Setup
- ✅ **ESLint**: Handles logic, best practices, and code quality
- ✅ **Prettier**: Handles formatting (indentation, quotes, spacing)
- ✅ **No conflicts**: `eslint-config-prettier` disables ESLint formatting rules
- ✅ **Separate concerns**: Each tool does what it does best

## Key Features

### TypeScript Integration
- Full type-aware linting with project configuration
- Consistent type imports
- Strict null checks and type safety
- Promise handling validation

### React/Next.js Rules
- JSX accessibility for outdoor mobile use
- React Hooks best practices
- Next.js specific optimizations
- Component key validation

### Code Quality
- Import organization and deduplication
- Unused variable detection
- Console statement warnings
- Performance-focused rules for mobile PWA

### Clay Shooting App Specific
- Mobile-first accessibility rules
- Touch interface considerations
- Performance optimizations for outdoor use
- Error handling for offline scenarios

## Common Issues and Solutions

### TypeScript Version Warning
The warning about TypeScript version (5.8.3) not being officially supported is informational only. ESLint will work correctly - this is a common lag between TypeScript releases and ESLint plugin updates.

### Import Order Issues
The configuration enforces specific import ordering:
1. Node.js built-ins
2. External packages (React, Next.js, etc.)
3. Internal packages (@/ imports)
4. Relative imports
5. Type-only imports

### Console Statements
Console statements generate warnings to prevent debug code in production. Use `eslint-disable-next-line no-console` for intentional logging.

### Accessibility Rules
JSX accessibility rules are strict to ensure the app works well for all clay shooters, including those using assistive technologies outdoors.

## VS Code Integration

With the ESLint VS Code extension installed:
- Auto-fix on save is enabled
- Import organization happens automatically
- Real-time error highlighting
- Format on paste for consistency

## Customization

To modify rules, edit `.eslintrc.cjs`:
- Add rule overrides in the `rules` section
- Adjust file-specific rules in `overrides`
- Update ignored patterns in `.eslintignore`

## Best Practices

1. **Fix linting issues incrementally** - Don't disable rules without good reason
2. **Use type imports** - Prefer `import type` for type-only imports
3. **Handle promises properly** - Always await or catch async operations
4. **Avoid `any` types** - Use proper TypeScript types for better safety
5. **Keep accessibility in mind** - Follow JSX a11y rules for better mobile UX

## Professional Development Workflow

### Daily Development
1. **Write code** with real-time ESLint feedback in VS Code
2. **Save files** - Prettier auto-formats, ESLint auto-fixes issues
3. **See immediate feedback** - Red squiggles for logic issues only
4. **No formatting distractions** - Prettier handles all styling automatically

### Before Committing
```bash
# Check code quality
npm run lint

# Check formatting
npm run format:check

# Fix any auto-fixable issues
npm run lint:fix

# Format all files
npm run format
```

### Best Practices
1. **Trust the tools** - Let Prettier handle formatting completely
2. **Focus on logic** - ESLint errors are about code quality, not style
3. **Fix incrementally** - Address ESLint issues as they appear
4. **Use type imports** - Prefer `import type` for type-only imports
5. **Handle promises properly** - Always await or catch async operations

This setup ensures consistent, high-quality code that follows modern best practices for React, TypeScript, and mobile PWA development with zero conflicts between formatting and linting tools.