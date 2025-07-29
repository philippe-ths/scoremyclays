const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Screenshot specifications from manifest
const screenshots = [
  { name: 'home', width: 375, height: 812, title: 'ScoreMyClays Home' },
  { name: 'scoring', width: 375, height: 812, title: 'Clay Shooting Scorer' }
];

// Colors matching our app theme
const COLORS = {
  background: '#f9fafb',   // Light gray background
  primary: '#1f2937',      // Dark text
  accent: '#22c55e',       // Green accent
  secondary: '#6b7280'     // Muted text
};

function generateScreenshot(spec) {
  const canvas = createCanvas(spec.width, spec.height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, spec.width, spec.height);
  
  // Header area
  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(0, 0, spec.width, 120);
  
  // App title in header
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ScoreMyClays', spec.width / 2, 70);
  
  // Main content area
  const contentY = 160;
  
  if (spec.name === 'home') {
    // Home screen content
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Track Your Clay Shooting', spec.width / 2, contentY);
    
    ctx.fillStyle = COLORS.secondary;
    ctx.font = '16px Arial';
    ctx.fillText('Offline & Online Scoring', spec.width / 2, contentY + 40);
    
    // Start session button mockup
    const buttonY = contentY + 100;
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = (spec.width - buttonWidth) / 2;
    
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Start New Session', spec.width / 2, buttonY + 30);
    
    // Clay target icon
    const targetY = buttonY + 100;
    ctx.fillStyle = COLORS.accent;
    ctx.beginPath();
    ctx.arc(spec.width / 2, targetY, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = COLORS.primary;
    ctx.beginPath();
    ctx.arc(spec.width / 2, targetY, 15, 0, 2 * Math.PI);
    ctx.fill();
    
  } else if (spec.name === 'scoring') {
    // Scoring screen content
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Position 1 of 10', spec.width / 2, contentY);
    
    ctx.fillStyle = COLORS.secondary;
    ctx.font = '16px Arial';
    ctx.fillText('Target 5 of 10', spec.width / 2, contentY + 30);
    
    // Score display
    const scoreY = contentY + 80;
    ctx.fillStyle = COLORS.accent;
    ctx.font = 'bold 48px Arial';
    ctx.fillText('24', spec.width / 2 - 40, scoreY);
    
    ctx.fillStyle = COLORS.secondary;
    ctx.font = '24px Arial';
    ctx.fillText('/ 50', spec.width / 2 + 20, scoreY);
    
    // Hit/Miss buttons mockup
    const buttonY = scoreY + 60;
    const buttonSize = 80;
    const spacing = 40;
    
    // Hit button
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(spec.width / 2 - buttonSize - spacing/2, buttonY, buttonSize, buttonSize);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('HIT', spec.width / 2 - buttonSize/2 - spacing/2, buttonY + buttonSize/2 + 5);
    
    // Miss button
    ctx.fillStyle = '#ef4444'; // Red
    ctx.fillRect(spec.width / 2 + spacing/2, buttonY, buttonSize, buttonSize);
    ctx.fillStyle = 'white';
    ctx.fillText('MISS', spec.width / 2 + buttonSize/2 + spacing/2, buttonY + buttonSize/2 + 5);
  }
  
  // Bottom navigation mockup
  const navY = spec.height - 80;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, navY, spec.width, 80);
  
  ctx.fillStyle = COLORS.secondary;
  ctx.font = '12px Arial';
  const navItems = ['Home', 'History', 'Stats', 'Profile'];
  const navSpacing = spec.width / navItems.length;
  
  navItems.forEach((item, index) => {
    const x = navSpacing * index + navSpacing / 2;
    ctx.fillText(item, x, navY + 50);
  });
  
  return canvas;
}

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Generate all screenshots
console.log('📱 Generating ScoreMyClays PWA screenshots...');

screenshots.forEach(spec => {
  try {
    const canvas = generateScreenshot(spec);
    const buffer = canvas.toBuffer('image/png');
    const filename = `${spec.name}.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Generated ${filename} (${spec.width}x${spec.height})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${spec.name}.png:`, error.message);
  }
});

console.log('🎉 All PWA screenshots generated successfully!');
console.log(`📁 Screenshots saved to: ${screenshotsDir}`); 