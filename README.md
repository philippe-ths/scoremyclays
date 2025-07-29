# ScoreMyClays

An **offline-first Progressive Web Application** for clay pigeon shooting scoring and performance tracking, designed specifically for the UK clay shooting community.

## Overview

ScoreMyClays addresses the critical need for reliable clay shooting scoring in environments with poor connectivity. Built as a mobile-first PWA, it provides simple, fast, and dependable score tracking that works seamlessly both online and offline.

### Core Value Proposition

**"Simple, reliable clay shooting score tracking that works anywhere, anytime - with or without an internet connection."**

## Market Opportunity

- **60,000 regular UK clay shooters** generate 96% of activity volume
- **3 million rounds** shot annually (100-clay equivalents)
- Proven digital transformation success in golf (78% core golfer adoption)
- **Critical gap**: No reliable offline-first clay shooting apps exist

### Target Market
- **Primary**: Recreational and competitive Sporting Clays shooters
- **Secondary**: Shooting clubs and competition organizers
- **Geographic Focus**: UK clay shooting community

## Key Features (MVP)

### ✅ Core Functionality
- **Offline-First Architecture**: Works reliably at shooting grounds with poor connectivity
- **Session-Based Scoring**: 10 positions × 10 targets per session (Sporting Clays)
- **Simple Scoring Interface**: Large HIT/MISS/NO BIRD/UNDO buttons
- **Real-Time Feedback**: Live score tracking and position summaries
- **Session History**: Past sessions grouped by shooting ground
- **Cloud Synchronization**: Automatic sync when connectivity available

### 🚀 Technical Features
- **Progressive Web App (PWA)**: Native app-like experience
- **Mobile-Optimized**: Touch-friendly interface for outdoor use
- **Sub-100ms Response**: Instant feedback for scoring actions
- **Cross-Platform**: Works on iOS, Android, and web browsers
- **Battery Efficient**: Optimized for long shooting sessions

## Technology Stack

- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Backend**: Supabase PostgreSQL with Row-Level Security
- **Offline Sync**: PowerSync SDK for bidirectional synchronization
- **Hosting**: Vercel with global edge network
- **Local Storage**: SQLite via PowerSync client

## Repository Structure

```
├── docs/                          # Core project documentation
│   ├── FUNCTIONAL_SPECIFICATION.md # Complete MVP requirements
│   ├── TECHNICAL_ARCHITECTURE.md   # Technical implementation guide
│   ├── ROADMAP.md                  # Development phases and features
│   └── DESIGN_GUIDES/              # UI/UX design system
├── research/                       # Market research and analysis
│   ├── MARKET_RESEARCH.md          # UK market analysis
│   ├── SHOOTER_NUMBERS.md          # User segmentation data
│   └── GOLF_APPS/                  # Competitive analysis
├── prototypes/                     # UI/UX prototypes and demos
├── plans/                          # Implementation planning
├── app/                           # Next.js application
└── website/                       # Docusaurus documentation site
```

## Getting Started

### For Developers
1. **Start Here**: [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
2. **Requirements**: [Functional Specification](docs/FUNCTIONAL_SPECIFICATION.md)
3. **UI Guidelines**: [Design Guides](docs/DESIGN_GUIDES/)
4. **Prototypes**: [Interactive Mockups](prototypes/)

### For Business Analysis
1. **Market Research**: [Market Analysis](research/MARKET_RESEARCH.md)
2. **User Data**: [Shooter Numbers](research/SHOOTER_NUMBERS.md)
3. **Competitive Analysis**: [Golf Apps Analysis](research/GOLF_APPS/)
4. **Development Plan**: [Product Roadmap](docs/ROADMAP.md)

### For Designers
1. **UX Guidelines**: [UX Design Guide](docs/DESIGN_GUIDES/scoremyclays_ux_design_guide.md)
2. **UI System**: [UI Design Guide](docs/DESIGN_GUIDES/scoremyclays_ui_design_guide.md)
3. **Components**: [MVP Design System](docs/DESIGN_GUIDES/MVP_design_system.md)
4. **Live Demos**: [Interactive Prototypes](prototypes/)

## Business Model

**Freemium Approach** with MVP validation:
- **MVP Phase**: Free core scoring functionality
- **Phase 1**: Authentication and user profiles
- **Phase 2**: Premium analytics and multi-user sessions (£2.99/month)
- **Phase 3**: Club management features (£19.99/month)

**Target**: Break-even at 2,500 premium users within 18 months

## Development Status

### ✅ Completed
- Market research and validation
- Competitive analysis (golf app insights)
- UI/UX design system and prototypes
- Technical architecture specification
- MVP functional requirements

### 🔄 Current Phase
- **UI Experiment Framework**: Testing design system with interactive prototypes
- **Technical Planning**: Finalizing MVP implementation approach
- **Market Validation**: Gathering feedback from clay shooting community

### ⏳ Next Steps
- MVP development (Next.js + PowerSync + Supabase)
- User testing with real shooters
- Market launch and iteration

## MVP Success Criteria

**MVP is successful if:**
- 80%+ session completion rate
- 50%+ sessions include offline usage
- 95%+ successful data synchronization
- 60%+ user retention for multiple sessions
- Sub-100ms consistent scoring response times
- Zero critical bugs in core workflows

## Architecture Highlights

### Offline-First Design
- **Local Storage**: SQLite database via PowerSync
- **Automatic Sync**: Background synchronization when online
- **Conflict Resolution**: Built-in handling for offline/online data conflicts
- **Performance**: All critical functions available without internet

### Mobile-Optimized UX
- **Large Touch Targets**: Designed for gloved hands and outdoor conditions
- **High Contrast UI**: Visible in bright sunlight
- **Instant Feedback**: Sub-100ms response times for scoring actions
- **Battery Efficient**: Optimized for 2+ hour shooting sessions

## Contributing

This project follows AI-assisted development workflows:
- **Component Generation**: v0.dev for rapid UI prototyping
- **Logic Implementation**: Cursor AI for business logic
- **Testing**: Vitest for unit tests
- **Deployment**: Automatic Vercel deployments

See the [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) for detailed development guidelines.

## Contact & Documentation

- **Complete Documentation**: See [docs/](docs/) directory
- **Technical Specs**: [TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md)
- **Market Research**: [research/](research/) directory
- **Live Prototypes**: [prototypes/](prototypes/) directory

This project is in active development. For detailed specifications, implementation guides, and market validation, explore the documentation directories above.

---

*ScoreMyClays aims to become the leading digital platform for UK clay shooting, starting with a proven MVP foundation and expanding through user-driven development.*