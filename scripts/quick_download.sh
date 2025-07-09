#!/bin/bash

# Quick Image Download Script
# Usage: ./quick_download.sh "image_url" "filename" "description"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <image_url> [filename] [description]"
    echo ""
    echo "Examples:"
    echo "  $0 'https://example.com/screenshot.png' 'scorecard.png' 'Scorecard interface'"
    echo "  $0 'https://example.com/image.jpg' # Will auto-generate filename"
    echo ""
    exit 1
fi

URL=$1
FILENAME=${2:-$(basename "$URL")}
DESCRIPTION=${3:-"Downloaded image"}

# Create directory if it doesn't exist
mkdir -p ./research/GOLF_APPS/golfgamebook/screenshots

echo "Downloading: $DESCRIPTION"
echo "URL: $URL"
echo "Filename: $FILENAME"
echo ""

# Download with curl
curl -L \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
    -H "Accept-Language: en-US,en;q=0.9" \
    -H "Referer: https://apps.apple.com/" \
    --max-time 30 \
    --retry 3 \
    --retry-delay 2 \
    --progress-bar \
    -o "./research/GOLF_APPS/golfgamebook/screenshots/$FILENAME" \
    "$URL"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully downloaded: $FILENAME"
    
    # Get file info
    if [ -f "./research/GOLF_APPS/golfgamebook/screenshots/$FILENAME" ]; then
        file_size=$(ls -lh "./research/GOLF_APPS/golfgamebook/screenshots/$FILENAME" | awk '{print $5}')
        file_type=$(file "./research/GOLF_APPS/golfgamebook/screenshots/$FILENAME" | cut -d: -f2)
        
        echo "   File size: $file_size"
        echo "   File type: $file_type"
        
        # Check if it's actually an image
        if [[ "$file_type" == *"image"* || "$file_type" == *"PNG"* || "$file_type" == *"JPEG"* || "$file_type" == *"WebP"* ]]; then
            echo "   ✅ Valid image file"
        else
            echo "   ⚠️  Warning: May not be a valid image file"
        fi
    fi
else
    echo ""
    echo "❌ Failed to download: $FILENAME"
    echo "Check the URL and try again"
fi

echo ""
echo "Files in screenshots folder:"
ls -la ./research/GOLF_APPS/golfgamebook/screenshots/ 2>/dev/null || echo "No files found"