#!/bin/bash

# CI/CD Validation Script for ScoreMyClays
# This script validates the GitHub Actions workflow setup

set -e

echo "🔍 Validating CI/CD Configuration for ScoreMyClays..."
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Validation functions
validate_workflows() {
    echo "📁 Checking GitHub Actions workflow files..."
    
    if [ -f ".github/workflows/ci.yml" ]; then
        print_status 0 "CI workflow file exists"
    else
        print_status 1 "CI workflow file missing"
        return 1
    fi
    
    if [ -f ".github/workflows/deploy.yml" ]; then
        print_status 0 "Deployment workflow file exists"
    else
        print_status 1 "Deployment workflow file missing"
        return 1
    fi
    
    # Validate YAML syntax
    if command -v yamllint >/dev/null 2>&1; then
        if yamllint .github/workflows/*.yml >/dev/null 2>&1; then
            print_status 0 "Workflow YAML syntax is valid"
        else
            print_status 1 "Workflow YAML syntax errors detected"
            return 1
        fi
    else
        print_warning "yamllint not installed - skipping YAML validation"
    fi
}

validate_package_scripts() {
    echo
    echo "📦 Checking package.json scripts..."
    
    cd app
    
    # Check required scripts
    local required_scripts=("lint" "lint:fix" "format" "format:check" "type-check" "build")
    
    for script in "${required_scripts[@]}"; do
        if npm run --silent "$script" --dry-run >/dev/null 2>&1; then
            print_status 0 "Script '$script' exists"
        else
            print_status 1 "Script '$script' missing or invalid"
        fi
    done
    
    cd ..
}

validate_eslint_config() {
    echo
    echo "🔍 Checking ESLint configuration..."
    
    if [ -f "app/.eslintrc.cjs" ]; then
        print_status 0 "ESLint configuration exists"
    else
        print_status 1 "ESLint configuration missing"
        return 1
    fi
    
    # Check if ESLint can parse the config
    cd app
    if npm run lint --silent >/dev/null 2>&1; then
        print_status 0 "ESLint configuration is valid"
    else
        print_warning "ESLint configuration may have issues"
    fi
    cd ..
}

validate_prettier_config() {
    echo
    echo "🎨 Checking Prettier configuration..."
    
    if [ -f "app/.prettierrc.js" ]; then
        print_status 0 "Prettier configuration exists"
    else
        print_status 1 "Prettier configuration missing"
        return 1
    fi
    
    cd app
    if npm run format:check --silent >/dev/null 2>&1; then
        print_status 0 "Prettier configuration is valid"
    else
        print_warning "Prettier configuration may have issues"
    fi
    cd ..
}

validate_pwa_files() {
    echo
    echo "📱 Checking PWA configuration..."
    
    if [ -f "app/public/manifest.json" ]; then
        print_status 0 "PWA manifest exists"
        
        # Basic JSON validation
        if command -v jq >/dev/null 2>&1; then
            if jq empty app/public/manifest.json >/dev/null 2>&1; then
                print_status 0 "PWA manifest is valid JSON"
            else
                print_status 1 "PWA manifest JSON is invalid"
            fi
        else
            print_warning "jq not installed - skipping JSON validation"
        fi
    else
        print_status 1 "PWA manifest missing"
    fi
    
    if [ -f "app/next.config.js" ]; then
        if grep -q "next-pwa" app/next.config.js; then
            print_status 0 "next-pwa configuration found"
        else
            print_warning "next-pwa configuration may be missing"
        fi
    fi
}

validate_vercel_config() {
    echo
    echo "🚀 Checking Vercel configuration..."
    
    if [ -f "app/vercel.json" ]; then
        print_status 0 "Vercel configuration exists"
    else
        print_warning "Vercel configuration missing (may use defaults)"
    fi
    
    # Check for Vercel CLI
    if command -v vercel >/dev/null 2>&1; then
        print_status 0 "Vercel CLI is available"
    else
        print_warning "Vercel CLI not installed globally"
    fi
}

validate_clay_shooting_context() {
    echo
    echo "🎯 Checking clay shooting specific files..."
    
    # Check for scoring components
    if find app/src -name "*scoring*" -type f | grep -q .; then
        print_status 0 "Scoring components found"
    else
        print_warning "No scoring components found"
    fi
    
    # Check manifest for clay shooting context
    if grep -qi "clay\|shooting\|trap\|skeet" app/public/manifest.json 2>/dev/null; then
        print_status 0 "Clay shooting context in manifest"
    else
        print_warning "Clay shooting context not found in manifest"
    fi
    
    # Check for mobile-optimized components
    if find app/src -name "*mobile*" -o -name "*touch*" -type f | grep -q .; then
        print_status 0 "Mobile-optimized components found"
    else
        print_warning "Consider adding mobile-specific components"
    fi
}

check_dependencies() {
    echo
    echo "📋 Checking dependencies..."
    
    cd app
    
    # Check for security vulnerabilities
    if npm audit --audit-level=high >/dev/null 2>&1; then
        print_status 0 "No high-severity vulnerabilities found"
    else
        print_warning "High-severity vulnerabilities detected - run 'npm audit fix'"
    fi
    
    # Check for outdated packages
    if command -v npm-check-updates >/dev/null 2>&1; then
        outdated=$(npm outdated --json 2>/dev/null | jq -r 'keys | length' 2>/dev/null || echo "unknown")
        if [ "$outdated" = "0" ]; then
            print_status 0 "All packages are up to date"
        else
            print_warning "$outdated packages may be outdated"
        fi
    fi
    
    cd ..
}

provide_setup_guidance() {
    echo
    echo "📚 Next Steps for CI/CD Setup:"
    echo
    print_info "1. Add GitHub repository secrets:"
    echo "   - VERCEL_TOKEN (from Vercel dashboard)"
    echo "   - VERCEL_ORG_ID (from Vercel project settings)"
    echo "   - VERCEL_PROJECT_ID (from Vercel project settings)"
    echo
    print_info "2. Configure branch protection rules for 'main' branch"
    echo
    print_info "3. Test the workflow by creating a pull request"
    echo
    print_info "4. Monitor GitHub Actions tab for workflow execution"
    echo
    print_info "5. Verify deployment works on Vercel"
    echo
    echo "📖 See docs/CI_CD_SETUP.md for detailed instructions"
}

# Main execution
main() {
    validate_workflows
    validate_package_scripts
    validate_eslint_config
    validate_prettier_config
    validate_pwa_files
    validate_vercel_config
    validate_clay_shooting_context
    check_dependencies
    
    echo
    echo "🎯 CI/CD validation complete!"
    provide_setup_guidance
}

# Run main function
main "$@"