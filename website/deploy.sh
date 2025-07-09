#!/bin/bash

# ScoreMyClays Documentation Deployment Script
# This script handles both preview and production deployments

echo "🚀 ScoreMyClays Documentation Deployment"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists vercel; then
    echo "❌ Error: Vercel CLI not installed"
    echo "Install with: npm i -g vercel"
    exit 1
fi

# Parse arguments
DEPLOY_TYPE="${1:-preview}"
DEPLOY_MESSAGE="${2:-Manual deployment}"

# Change to website directory
cd "$(dirname "$0")" || exit 1

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building documentation..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy based on type
if [ "$DEPLOY_TYPE" = "production" ]; then
    echo "🌍 Deploying to PRODUCTION..."
    vercel --prod --confirm
else
    echo "👁️  Creating preview deployment..."
    vercel
fi

echo ""
echo "✨ Deployment complete!"
echo "Check your Vercel dashboard for the deployment URL"