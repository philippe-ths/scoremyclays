---
id: DOCUMENT_INDEX
title: ScoreMyClays Document Index
sidebar_label: ScoreMyClays Document Index
---

# ScoreMyClays Document Index

*Complete documentation structure and file locations*

## Project Root Files

### Core Documentation
- **CLAUDE.md** - Project instructions for Claude Code
- **README.md** - Main project readme

---

## /docs/ Directory

### Core Project Documentation
- **FUNCTIONAL_SPEC.md** - Complete functional specification
- **FEASIBILITY_ANALYSIS.md** - Comprehensive business case analysis
- **FEATURES.md** - Feature specifications and requirements
- **DOCUMENT_INDEX.md** - This document index
- **BROKEN_LINKS_REPORT.md** - File reference fixes report

### /docs/DESIGN_GUIDES/
- **design_system_components.md** - Detailed component specifications
- **scoremyclays_ui_design_guide.md** - Visual design system
- **scoremyclays_ux_design_guide.md** - User experience framework

---

## /research/ Directory

### Market & User Research
- **MARKET_RESEARCH.md** - UK clay shooting market analysis
- **SHOOTER_NUMBERS.md** - Shooter numbers and classification data
- **FEATURES_FUTURES.md** - Future feature considerations

### Golf App Analysis
- **GOLF_APP_INSIGHTS.md** - Synthesis of golf app market lessons
- **GOLF_APPS_ANALYSED.md** - List of analyzed golf applications

### /research/GOLF_APPS/golfgamebook/
- **ui_analysis.md** - Visual design analysis
- **key_features.md** - Feature breakdown
- **gameplay_analysis.md** - Live session analysis
- **detailed_ux_review.md** - Comprehensive UX review
- **screenshots/** - 60+ app screenshots and images
  - **image_catalog.md** - Screenshot documentation

---

## /scripts/ Directory

### Utility Scripts
- **download_images.sh** - Batch image download script
- **quick_download.sh** - Single image download utility

---

## Document Cross-References

### FUNCTIONAL_SPEC.md References
The functional specification references the following documents that need path updates:
- Market Research: `/research/market_research_cleaned.md` → `/research/MARKET_RESEARCH.md`
- Feature Specifications: `/research/FEATURES.md` → `/docs/FEATURES.md`
- Golf App Market Insights: `/research/GOLF_APP_INSIGHTS.md` ✓
- Feasibility Analysis: `/research/FEASIBILITY_ANALYSIS.md` → `/docs/FEASIBILITY_ANALYSIS.md`
- Shooter Numbers: `/research/shooter_numbers_classification.md` → `/research/SHOOTER_NUMBERS.md`
- Golf Apps Analyzed: `/research/golf_apps_analyzed.md` → `/research/GOLF_APPS_ANALYSED.md`
- GolfGameBook files: `/research/golfgamebook/*` → `/research/GOLF_APPS/golfgamebook/*`
- Design Guides: `/research/design_guides/*` → `/docs/DESIGN_GUIDES/*`

### Common Reference Patterns
- Market data: Reference `/research/MARKET_RESEARCH.md` and `/research/SHOOTER_NUMBERS.md`
- Features: Reference `/docs/FEATURES.md`
- Business case: Reference `/docs/FEASIBILITY_ANALYSIS.md`
- Design system: Reference `/docs/DESIGN_GUIDES/` directory
- Golf insights: Reference `/research/GOLF_APPS/` directory

---

## Quick Navigation

### For Developers
1. Start with `/docs/FUNCTIONAL_SPEC.md` for requirements
2. Review `/docs/DESIGN_GUIDES/` for UI/UX specifications
3. Check `/src/mock_up/ui_mockup.html` for working example
4. See `/src/mock_up/README_UI.md` for implementation notes

### For Business Analysis
1. Read `/docs/FEASIBILITY_ANALYSIS.md` for business case
2. Review `/research/MARKET_RESEARCH.md` for market data
3. Check `/research/SHOOTER_NUMBERS.md` for user segments
4. See `/docs/FEATURES.md` for feature priorities

### For Designers
1. Study `/docs/DESIGN_GUIDES/scoremyclays_ux_design_guide.md`
2. Reference `/docs/DESIGN_GUIDES/scoremyclays_ui_design_guide.md`
3. Use `/docs/DESIGN_GUIDES/design_system_components.md` for specs
4. View `/src/mock_up/ui_components_showcase.html` for examples

### For Product Strategy
1. Review `/research/GOLF_APP_INSIGHTS.md` for market lessons
2. Study `/research/GOLF_APPS/golfgamebook/` for competitor analysis
3. Check `/research/FEATURES_FUTURES.md` for roadmap ideas
4. Read `/docs/FEASIBILITY_ANALYSIS.md` for strategic approach

---

*Last updated: July 2025*