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
        'SERVICE_DESCRIPTION',
        'FUNCTIONAL_SPEC',
        'TECHNICAL_SPEC',
      ],
    },
    {
      type: 'category',
      label: 'Business Analysis',
      items: [
        'FEASIBILITY_ANALYSIS',
        'FEATURES',
      ],
    },
    {
      type: 'category',
      label: 'Design & UX',
      items: [
        'DESIGN_GUIDES/scoremyclays_ux_design_guide',
        'DESIGN_GUIDES/scoremyclays_ui_design_guide',
        'DESIGN_GUIDES/design_system_components',
      ],
    },
  ],
};

export default sidebars;
