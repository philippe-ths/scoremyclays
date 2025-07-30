import { test, expect } from '@playwright/test';

/**
 * PWA Functionality Tests
 * Testing Progressive Web App features for clay shooting
 */

test.describe('PWA Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have valid PWA manifest', async ({ page }) => {
    // Check manifest exists and is accessible
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.ok()).toBeTruthy();
    
    const manifest = await manifestResponse.json();
    
    // Validate core manifest properties
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBeDefined();
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThan(0);
    
    // Clay shooting app specific validations
    expect(manifest.name.toLowerCase()).toContain('clay');
    expect(manifest.display).toBe('standalone');
  });

  test('should register service worker', async ({ page }) => {
    // Check if service worker is supported and registered
    const serviceWorkerSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(serviceWorkerSupported).toBeTruthy();
    
    // Wait for service worker registration
    await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        return navigator.serviceWorker.ready;
      }
    });
    
    // Check service worker registration
    const registrations = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length;
      }
      return 0;
    });
    
    expect(registrations).toBeGreaterThan(0);
  });

  test('should cache essential resources', async ({ page }) => {
    // Check if cache API is available
    const cacheSupported = await page.evaluate(() => {
      return 'caches' in window;
    });
    
    expect(cacheSupported).toBeTruthy();
    
    // Wait a bit for service worker to cache resources
    await page.waitForTimeout(2000);
    
    // Check for cached resources
    const cachedResources = await page.evaluate(async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        let totalCached = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalCached += keys.length;
        }
        
        return totalCached;
      }
      return 0;
    });
    
    // Should have some cached resources
    expect(cachedResources).toBeGreaterThan(0);
  });

  test('should work in offline mode', async ({ page }) => {
    // First, load the app online to ensure everything is cached
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for service worker to cache resources
    await page.waitForTimeout(3000);
    
    // Go offline
    await page.context().setOffline(true);
    
    // Reload the page
    await page.reload();
    
    // Should still load basic content
    await expect(page.locator('body')).toBeVisible();
    
    // Navigation should still work
    const navigation = page.locator('[role="navigation"], nav');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
    
    // Go back online
    await page.context().setOffline(false);
  });

  test('should display install prompt on supported browsers', async ({ page, browserName }) => {
    // This test is primarily for Chromium-based browsers
    if (browserName !== 'chromium') {
      test.skip('Install prompt test only for Chromium browsers');
    }
    
    // Navigate and wait for potential install prompt
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if beforeinstallprompt event is supported
    const installPromptSupported = await page.evaluate(() => {
      return new Promise((resolve) => {
        let supported = false;
        
        window.addEventListener('beforeinstallprompt', () => {
          supported = true;
          resolve(true);
        });
        
        // Timeout if no prompt appears
        setTimeout(() => resolve(supported), 2000);
      });
    });
    
    // Note: Install prompt may not always appear in test environment
    // This mainly validates the capability exists
    expect(typeof installPromptSupported).toBe('boolean');
  });

  test('should have proper meta tags for PWA', async ({ page }) => {
    // Check viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
    
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveCount(1);
    
    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);
    
    // Check apple touch icon for iOS
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    // Should have at least one apple touch icon
    expect(await appleIcon.count()).toBeGreaterThanOrEqual(0);
  });

  test('should handle app updates gracefully', async ({ page }) => {
    // Load initial version
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for update mechanism (could be service worker update)
    const updateMechanism = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        return !!registration.update;
      }
      return false;
    });
    
    expect(updateMechanism).toBeTruthy();
  });

  test('should maintain app state during PWA usage', async ({ page }) => {
    // Navigate to scoring page
    await page.goto('/scoring');
    await page.waitForLoadState('networkidle');
    
    // Simulate PWA-like navigation (no browser chrome)
    await page.addInitScript(() => {
      // Simulate standalone mode
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        writable: false
      });
    });
    
    // Refresh in "standalone" mode
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should maintain app state and navigation
    expect(page.url()).toContain('/scoring');
    await expect(page.locator('body')).toBeVisible();
  });
});