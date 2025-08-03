const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes needed by the PWA manifest
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Colors from our design
const COLORS = {
  background: '#1f2937', // Dark gray
  target: '#22c55e',     // Green
  center: '#1f2937'      // Dark gray
};

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Calculate proportional sizes
  const radius = Math.round(size * 0.104); // Corner radius (20/192 ratio)
  const outerRadius = Math.round(size * 0.208); // Target outer ring (40/192 ratio)
  const innerRadius = Math.round(size * 0.104); // Target center hole (20/192 ratio)
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Background rounded rectangle
  ctx.fillStyle = COLORS.background;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  
  // Outer green circle (clay target)
  ctx.fillStyle = COLORS.target;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Inner dark circle (center hole)
  ctx.fillStyle = COLORS.center;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  return canvas;
}

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate all icon sizes
console.log('🎯 Generating ScoreMyClays PWA icons...');

iconSizes.forEach(size => {
  try {
    const canvas = generateIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = `icon-${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Generated ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate icon-${size}.png:`, error.message);
  }
});

// Generate shortcut icon
try {
  const canvas = generateIcon(96);
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(iconsDir, 'shortcut-new.png');
  
  fs.writeFileSync(filepath, buffer);
  console.log('✅ Generated shortcut-new.png (96x96)');
} catch (error) {
  console.error('❌ Failed to generate shortcut icon:', error.message);
}

console.log('🎉 All PWA icons generated successfully!');
console.log(`📁 Icons saved to: ${iconsDir}`); 