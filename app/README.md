# ScoreMyClays MVP

🎯 **Clay shooting scoring application - Minimum Viable Product**

A Progressive Web App (PWA) for scoring clay shooting rounds with offline-first architecture, specifically designed for ESP (English Sporting) discipline.

## ✨ Features

### Core Functionality
- **🎯 ESP Scoring**: Complete English Sporting round scoring
- **📱 Mobile-First**: Optimized for smartphones and tablets  
- **📶 Offline-First**: Works without internet connection
- **💾 Local Storage**: Rounds saved locally using IndexedDB
- **📊 Performance Tracking**: Basic statistics and round history
- **🎨 Professional UI**: Clay shooting-specific design system

### Technical Features
- **Progressive Web App**: Installable on mobile devices
- **Service Worker**: Robust offline caching
- **Touch Optimized**: Large buttons for gloved hands
- **High Contrast**: Readable in bright outdoor conditions
- **Responsive Design**: Works on all screen sizes

## 🔒 Security

This application has been updated to address known security vulnerabilities:

### ✅ Security Fixes Applied
- **Updated Vite**: Using Vite 6.3.5 (latest stable) with all security patches
- **Secure esbuild**: Forced esbuild ^0.25.6 via overrides to fix CVE-2024-23334 (CORS misconfiguration)
- **Updated dependencies**: All packages updated to latest secure versions
- **Dependency overrides**: Using npm overrides to ensure secure transitive dependencies

### 🛡️ Security Best Practices
- **No remote dependencies**: All assets bundled locally for offline operation
- **Content Security Policy**: Ready for CSP implementation
- **Service Worker**: Secure caching strategy with version control
- **Input validation**: All user inputs properly validated and sanitized

Run `npm audit` to verify zero vulnerabilities.

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** (updated requirement for latest security features)
- **npm 8.3.0+** (required for overrides support)

### Installation & Running

1. **Clone and navigate to the app directory:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Automatically opens at `http://localhost:3000`
   - Or manually visit the URL shown in terminal

### Alternative Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Testing

### Local Network Testing
The dev server allows external connections, so you can test on mobile devices:

1. **Find your computer's IP address:**
   ```bash
   # On macOS/Linux
   ipconfig getifaddr en0
   
   # On Windows
   ipconfig
   ```

2. **Access from mobile device:**
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

### PWA Installation Testing
1. Open the app in Chrome/Safari on mobile
2. Look for "Install App" banner or use browser's "Add to Home Screen"
3. Test offline functionality by turning off wifi

## 🎯 How to Use

### Starting a Round
1. **Launch App**: Open ScoreMyClays
2. **Configure Round**: 
   - Discipline: ESP (English Sporting)
   - Number of stands: 5, 8, or 10
   - Targets per stand: 10, 12, or 15
3. **Begin Scoring**: Tap "Begin Round"

### Scoring Process
1. **Record Shots**: Tap HIT (green) or MISS (red) for each target
2. **Stand Progress**: Automatically moves to next stand when complete
3. **Undo Feature**: Tap "Undo Last Shot" if needed
4. **Real-time Stats**: See running score and percentage

### Round Completion
1. **Final Results**: View complete round statistics
2. **Share Score**: Use device sharing to share results
3. **Start New Round**: Begin another round immediately

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite (fast development and building)
- **Database**: IndexedDB (via idb library)
- **PWA**: Service Worker, Web App Manifest
- **Fonts**: Inter (UI), Roboto Mono (scores)

### File Structure
```
app/
├── index.html          # Main HTML file
├── src/
│   └── main.js         # Application logic
├── public/
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker
├── package.json        # Dependencies
├── vite.config.js      # Build configuration
└── README.md          # This file
```

### Offline-First Architecture
- **Local Storage**: All rounds saved to IndexedDB
- **Service Worker**: Caches app shell and assets
- **Background Sync**: Ready for future API integration
- **No Network Required**: Core functionality works offline

## 🎨 Design System

### Colors
- **Clay Orange**: `#D2691E` (primary brand color)
- **Gun Metal**: `#2C3E50` (text and navigation)
- **Field Green**: `#228B22` (success/hit indicators)
- **Error Red**: `#DC143C` (miss indicators)

### Typography
- **Primary Font**: Inter (UI elements)
- **Monospace Font**: Roboto Mono (scores and data)
- **Base Size**: 16px with responsive scaling

### Touch Targets
- **Minimum Size**: 44×44px (accessibility standard)
- **Score Buttons**: 120×80px (optimized for outdoor use)
- **Form Inputs**: 48px height minimum

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Alias for npm run dev
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **Source Maps**: Debug with original source code
- **Legacy Support**: Automatically handles older browsers
- **Mobile Debugging**: Access from any device on local network

### Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 78+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Android 88+
- **PWA Features**: All modern browsers with PWA support

## 🚢 Deployment

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` directory.

### Deployment Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: Any static file CDN
- **Server**: Any web server (Apache, Nginx, etc.)

### PWA Requirements
- **HTTPS**: Required for PWA features in production
- **Service Worker**: Automatically included in build
- **Manifest**: Configured for installation

## 📊 Data Storage

### Local Data
All data is stored locally in the browser using IndexedDB:

- **Rounds**: Complete round data with scores and timestamps
- **Settings**: User preferences and configuration
- **Performance**: Calculated statistics and averages

### Data Schema
```javascript
Round {
  id: auto-increment,
  discipline: 'esp',
  stands: number,
  targetsPerStand: number,
  totalTargets: number,
  totalScore: number,
  standScores: Array<number>,
  shots: Array<Shot>,
  startTime: Date,
  endTime: Date,
  completed: boolean,
  date: string
}
```

## 🔮 Future Enhancements

### Planned Features
- **Additional Disciplines**: DTL, Skeet, Trap
- **Cloud Sync**: User accounts and cloud storage
- **Social Features**: Share scores, compare with friends
- **Advanced Analytics**: Detailed performance insights
- **Competition Mode**: Tournament and league support

### Technical Improvements
- **Push Notifications**: Round reminders and updates
- **Background Sync**: Upload scores when online
- **Camera Integration**: Score verification via photos
- **GPS Integration**: Automatic ground detection

## 🐛 Troubleshooting

### Common Issues

**App won't load:**
- Check Node.js version (18+ required)
- Clear browser cache and reload
- Check console for error messages

**Offline functionality not working:**
- Ensure Service Worker is registered (check DevTools)
- Test in incognito/private mode
- Check HTTPS requirement for PWA features

**Mobile installation not available:**
- Use Chrome or Safari on mobile
- Ensure HTTPS (for production)
- Check PWA criteria in DevTools

**Performance issues:**
- Close other browser tabs
- Disable browser extensions
- Check available storage space

### Development Issues

**Dependencies won't install:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```bash
# Check Node.js version
node --version

# Update dependencies
npm update
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

This is an MVP project. For feature requests or bugs:
1. Document the issue clearly
2. Include browser/device information  
3. Provide steps to reproduce

## 📞 Support

For technical support:
- Check browser console for errors
- Test in different browsers
- Verify offline functionality
- Review this README for troubleshooting

---

**🎯 Ready to score your next clay shooting round!** 