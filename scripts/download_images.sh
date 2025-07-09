#!/bin/bash

# Image Download Script for GolfGameBook Screenshots
# Usage: ./download_images.sh

# Create the golfgamebook directory if it doesn't exist
mkdir -p ./research/GOLF_APPS/golfgamebook/screenshots

# Function to download image with proper naming
download_image() {
    local url=$1
    local filename=$2
    local description=$3
    
    echo "Downloading: $description"
    echo "URL: $url"
    
    # Download with curl using proper headers
    curl -L \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
        -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
        -H "Accept-Language: en-US,en;q=0.9" \
        -H "Accept-Encoding: gzip, deflate, br" \
        -H "Connection: keep-alive" \
        -H "Upgrade-Insecure-Requests: 1" \
        --max-time 30 \
        --retry 3 \
        --retry-delay 2 \
        -o "./research/GOLF_APPS/golfgamebook/screenshots/$filename" \
        "$url"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully downloaded: $filename"
        
        # Get file info
        file_size=$(ls -lh "./research/GOLF_APPS/golfgamebook/screenshots/$filename" | awk '{print $5}')
        echo "   File size: $file_size"
        
        # Check if it's actually an image
        file_type=$(file "./research/GOLF_APPS/golfgamebook/screenshots/$filename" | cut -d: -f2)
        echo "   File type: $file_type"
        
        echo ""
    else
        echo "❌ Failed to download: $filename"
        echo ""
    fi
}

# Common App Store screenshot URLs (you'll need to replace these with actual URLs)
echo "=== GolfGameBook Image Download Script ==="
echo ""

# Example URLs - Replace these with actual screenshot URLs from app stores
# You can find these by:
# 1. Going to App Store page for GolfGameBook
# 2. Right-click on screenshots -> "Copy image address"
# 3. Replace the URLs below

# App Store Screenshots (replace with actual URLs)
echo "Note: Please replace the example URLs below with actual screenshot URLs from:"
echo "- Apple App Store: https://apps.apple.com/us/app/golf-gamebook-scorecard-gps/id409307935"
echo "- Google Play Store: https://play.google.com/store/apps/details?id=com.golfgamebook.golfgamebook"
echo "- Official website: https://www.golfgamebook.com/"
echo ""

# Example download commands (uncomment and replace URLs when you have them)
# download_image "https://example.com/screenshot1.png" "01_scorecard_interface.png" "Main scorecard interface"
# download_image "https://example.com/screenshot2.png" "02_live_leaderboard.png" "Live leaderboard view"
# download_image "https://example.com/screenshot3.png" "03_gps_course_map.png" "GPS course mapping"
# download_image "https://example.com/screenshot4.png" "04_statistics_dashboard.png" "Statistics dashboard"
# download_image "https://example.com/screenshot5.png" "05_social_feed.png" "Social feed interface"
# download_image "https://example.com/screenshot6.png" "06_tournament_view.png" "Tournament management"

echo "=== Manual Steps Required ==="
echo "1. Visit the GolfGameBook app store pages"
echo "2. Right-click on screenshots and copy image URLs"
echo "3. Replace the example URLs in this script"
echo "4. Run the script again to download images"
echo ""
echo "App Store URLs:"
echo "- iOS: https://apps.apple.com/us/app/golf-gamebook-scorecard-gps/id409307935"
echo "- Android: https://play.google.com/store/apps/details?id=com.golfgamebook.golfgamebook"
echo "- Website: https://www.golfgamebook.com/"
echo ""

# Create a README file for the screenshots folder
cat > ./research/GOLF_APPS/golfgamebook/screenshots/README.md << 'EOF'
# GolfGameBook Screenshots

This folder contains screenshots of the GolfGameBook app interface for UI/UX research purposes.

## Screenshot Categories

### Core Interface
- `01_scorecard_interface.png` - Main scoring interface
- `02_live_leaderboard.png` - Live leaderboard view
- `03_gps_course_map.png` - GPS course mapping feature

### Advanced Features
- `04_statistics_dashboard.png` - Statistics and analytics
- `05_social_feed.png` - Social community features
- `06_tournament_view.png` - Tournament management

### Mobile Views
- `07_mobile_scorecard.png` - Mobile scorecard view
- `08_mobile_leaderboard.png` - Mobile leaderboard
- `09_apple_watch.png` - Apple Watch interface

## Usage Notes

These screenshots are used for:
- UI/UX research and inspiration
- Understanding GolfGameBook's design patterns
- Informing ScoreMyClays interface design
- Competitive analysis and feature comparison

## Sources

Screenshots obtained from:
- Apple App Store listing
- Google Play Store listing
- Official GolfGameBook website
- App interface captures

*Last updated: $(date)*
EOF

echo "Created README.md in screenshots folder"
echo ""
echo "Script completed. Update URLs and run again to download images."