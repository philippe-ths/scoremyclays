#!/bin/bash

# ScoreMyClays PWA Setup Script
# Automates PWA development environment and Vercel deployment setup

set -e

echo "📱 ScoreMyClays PWA Setup"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists git; then
    print_error "Git is required but not installed."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js 18+ is required but not installed."
    print_info "Install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is required but not installed."
    exit 1
fi

print_status "Prerequisites check passed"

# Install Vercel CLI if not present
if ! command_exists vercel; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_status "Vercel CLI installed"
else
    print_status "Vercel CLI found"
fi

# Navigate to project root
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT=$(pwd)

echo ""
echo "Project root: $PROJECT_ROOT"
echo ""

# Check if user is logged in to Vercel
echo "Checking Vercel authentication..."
if ! vercel whoami > /dev/null 2>&1; then
    print_warning "Not logged in to Vercel. Please log in..."
    vercel login
    print_status "Logged in to Vercel"
else
    VERCEL_USER=$(vercel whoami)
    print_status "Already logged in as: $VERCEL_USER"
fi

# Set up PWA environment
echo ""
echo "Setting up PWA environment..."

cd app || exit 1

# Install dependencies
if [ -f "package.json" ]; then
    print_info "Installing PWA dependencies..."
    npm install
    print_status "Dependencies installed"
else
    print_error "package.json not found in app directory"
    exit 1
fi

# Set up environment variables
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        print_info "Creating .env.local from template..."
        cp .env.example .env.local
        print_warning "Please edit .env.local with your actual environment variables"
    else
        print_warning ".env.example not found"
    fi
fi

# Link PWA project to Vercel
echo ""
echo "Setting up Vercel project for PWA..."

if [ -f ".vercel/project.json" ]; then
    print_warning "PWA already linked to Vercel"
    CURRENT_PROJECT=$(cat .vercel/project.json | grep '"name"' | cut -d'"' -f4)
    print_info "Current project: $CURRENT_PROJECT"
    
    read -p "Do you want to re-link the PWA project? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .vercel
        vercel link
        print_status "PWA project re-linked to Vercel"
    fi
else
    print_info "Linking PWA to Vercel..."
    vercel link
    print_status "PWA project linked to Vercel"
fi

# Go back to project root
cd ..

# Display setup summary
echo ""
echo "🎉 PWA Setup Complete!"
echo "======================"
print_status "PWA scaffold created"
print_status "Dependencies installed"
print_status "Vercel project linked"
print_status "Environment template created"

echo ""
echo "📋 Project Structure:"
echo "---------------------"
print_info "📚 Documentation: ./Docusaurus (local only)"
print_info "📱 PWA Application: ./app (deploys to Vercel)"

echo ""
echo "🚀 Quick Commands:"
echo "------------------"
print_info "Local documentation: cd Docusaurus && npm start"
print_info "PWA development: cd app && npm run dev"
print_info "PWA preview deploy: cd app && vercel"
print_info "PWA production deploy: cd app && vercel --prod"

echo ""
echo "Next Steps:"
echo "----------"
print_info "1. Configure environment variables:"
echo "   → Edit app/.env.local with your Supabase and PowerSync credentials"

print_info "2. Set up Vercel environment variables:"
echo "   → Go to Vercel Dashboard → PWA Project → Settings → Environment Variables"
echo "   → Add: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_POWERSYNC_URL"

print_info "3. Test PWA deployment:"
echo "   → cd app && vercel"

print_info "4. Set up custom domain (optional):"
echo "   → Go to Vercel Dashboard → PWA Project → Settings → Domains"
echo "   → Add: app.scoremyclays.com"

print_info "5. Start building the PWA:"
echo "   → Follow /docs/TECHNICAL_ARCHITECTURE.md specifications"
echo "   → Reference /docs/FUNCTIONAL_SPECIFICATION.md for features"

echo ""
print_status "Ready to build the ScoreMyClays PWA! 🏗️"