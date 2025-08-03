import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for ScoreMyClays E2E tests
 * Prepares test environment and validates PWA functionality
 */
async function globalSetup(config: FullConfig) {
  console.log('🎯 Setting up ScoreMyClays E2E test environment...');

  // Launch browser for setup validation
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for development server to be ready
    console.log('⏳ Waiting for Next.js development server...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Validate PWA manifest is accessible
    console.log('📱 Validating PWA manifest...');
    const manifestResponse = await page.request.get('/manifest.json');
    if (!manifestResponse.ok()) {
      throw new Error('PWA manifest not accessible');
    }

    // Validate service worker registration
    console.log('⚙️ Checking service worker registration...');
    const serviceWorkerRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    if (!serviceWorkerRegistered) {
      console.warn('⚠️ Service Worker not supported in test environment');
    }

    // Check if core clay shooting components load
    console.log('🎯 Validating core clay shooting components...');
    await page.locator('nav').waitFor({ timeout: 10000 });
    
    // Validate navigation elements for clay shooting app
    const hasBottomNav = await page.locator('[role="navigation"]').count() > 0;
    if (!hasBottomNav) {
      console.warn('⚠️ Navigation components may not be loading correctly');
    }

    console.log('✅ ScoreMyClays E2E test environment ready!');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;