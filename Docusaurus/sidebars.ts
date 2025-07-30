import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // ScoreMyClays documentation sidebar
  tutorialSidebar: [
    'DOCUMENT_INDEX',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'FUNCTIONAL_SPECIFICATION',
        'TECHNICAL_ARCHITECTURE',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'ROADMAP',
        'PWA_TESTING_GUIDE',
        'VERCEL_DEPLOYMENT_GUIDE',
      ],
    },
    {
      type: 'category',
      label: 'Design & UX',
      items: [
        'DESIGN_GUIDES/mvp_component_system',
        'DESIGN_GUIDES/scoremyclays_ui_design_guide_mvp',
        'DESIGN_GUIDES/scoremyclays_ux_design_guide_mvp',
      ],
    },
  ],
};

export default sidebars;
