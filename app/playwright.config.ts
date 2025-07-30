import { defineConfig, devices } from '@playwright/test';

/**
 * ScoreMyClays PWA Test Configuration
 * Optimized for clay shooting app testing with mobile-first approach
 */
export default defineConfig({
  testDir: './tests',
  
  /* Test configuration */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  
  /* Timeout settings for clay shooting scenarios */
  timeout: 30000, // 30s for complete scoring rounds
  expect: {
    timeout: 10000, // 10s for clay shooting interactions
  },
  
  /* Reporter configuration */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],

  /* Global test settings optimized for PWA */
  use: {
    /* Base URL for local development */
    baseURL: 'http://localhost:3000',

    /* Browser settings for PWA testing */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Clay shooting app specific settings */
    actionTimeout: 5000, // Touch interactions for outdoor use
    navigationTimeout: 10000, // PWA loading timeout
    
    /* PWA permissions for testing */
    permissions: ['notifications', 'geolocation'],
    
    /* Ignore HTTPS errors for local testing */
    ignoreHTTPSErrors: true,
  },

  /* Project configurations for comprehensive testing */
  projects: [
    /* Desktop Testing - Development validation */
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Mobile Testing - Primary clay shooting use case */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Outdoor visibility simulation
        forcedColors: 'none',
      },
    },

    {
      name: 'iPhone',
      use: { 
        ...devices['iPhone 12'],
        // iOS PWA specific settings
        isMobile: true,
        hasTouch: true,
      },
    },

    {
      name: 'iPad',
      use: { 
        ...devices['iPad Pro'],
        // Tablet scoring interface
        viewport: { width: 1024, height: 768 },
      },
    },

    /* Cross-browser validation */
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    /* PWA Installation Testing */
    {
      name: 'PWA Installation',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          // Enable PWA installation prompts
          permissions: ['notifications'],
        },
      },
      testMatch: ['**/pwa.spec.ts'],
    },

    /* Offline Testing */
    {
      name: 'Offline',
      use: {
        ...devices['Pixel 5'],
        // Start tests offline to validate service worker
        offline: true,
      },
      testMatch: ['**/offline.spec.ts'],
    },
  ],

  /* Development server configuration */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for Next.js startup
  },

  /* Output directories */
  outputDir: 'test-results/',
  
  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});
