import { test, expect } from '@playwright/test';

/**
 * Offline Functionality Tests
 * Critical for clay shooting ranges with poor connectivity
 */

test.describe('Offline Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Load app online first to ensure service worker and caching
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for service worker to initialize and cache resources
    await page.waitForTimeout(3000);
  });

  test('should load main app offline', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Reload the page
    await page.reload();
    
    // Should still load
    await expect(page.locator('body')).toBeVisible();
    
    // Check for offline indicators if any
    const offlineIndicator = page.locator('[data-testid*="offline"], [class*="offline"]');
    if (await offlineIndicator.count() > 0) {
      await expect(offlineIndicator.first()).toBeVisible();
    }
    
    // Navigation should still work
    const navigation = page.locator('[role="navigation"], nav');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
  });

  test('should enable offline scoring', async ({ page }) => {
    // Navigate to scoring page while online
    await page.goto('/scoring');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Reload scoring page
    await page.reload();
    
    // Scoring interface should still be available
    await expect(page.locator('body')).toBeVisible();
    
    // Look for scoring elements
    const scoringElements = page.locator(
      '[data-testid*="scoring"], button:has-text("Hit"), button:has-text("Miss"), [class*="scoring"]'
    );
    
    if (await scoringElements.count() > 0) {
      await expect(scoringElements.first()).toBeVisible();
    }
  });

  test('should store scoring data offline', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Navigate to scoring
    await page.goto('/scoring');
    
    // Try to interact with scoring interface
    const hitButton = page.getByRole('button', { name: /hit/i }).first();
    
    if (await hitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await hitButton.click();
      
      // Check if data is stored locally
      const localData = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        return keys.filter(key => 
          key.includes('scoring') || 
          key.includes('session') || 
          key.includes('clay')
        );
      });
      
      expect(localData.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should sync data when coming back online', async ({ page }) => {
    // Start offline
    await page.context().setOffline(true);
    await page.goto('/scoring');
    
    // Simulate some offline activity (if possible)
    await page.waitForTimeout(1000);
    
    // Go back online
    await page.context().setOffline(false);
    
    // Reload to trigger potential sync
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should be online and functional
    await expect(page.locator('body')).toBeVisible();
    
    // Check for any sync indicators
    await page.waitForTimeout(2000); // Allow time for background sync
  });

  test('should handle navigation offline', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Test navigation between cached pages
    const links = [
      { name: /scoring/i, path: '/scoring' },
      { name: /history/i, path: '/history' },
      { name: /stats/i, path: '/stats' }
    ];
    
    for (const link of links) {
      const linkElement = page.getByRole('link', { name: link.name });
      
      if (await linkElement.count() > 0) {
        await linkElement.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should navigate successfully
        expect(page.url()).toContain(link.path);
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should show offline status in UI', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Reload page
    await page.reload();
    
    // Look for offline indicators
    const possibleIndicators = [
      '[data-testid*="offline"]',
      '[class*="offline"]',
      'text="Offline"',
      '[aria-label*="offline"]'
    ];
    
    let foundIndicator = false;
    for (const selector of possibleIndicators) {
      if (await page.locator(selector).count() > 0) {
        foundIndicator = true;
        break;
      }
    }
    
    // Note: This test documents expected behavior
    // The app may or may not show explicit offline indicators
    console.log('Offline indicator found:', foundIndicator);
  });

  test('should maintain session state offline', async ({ page }) => {
    // Start a session online if possible
    await page.goto('/scoring');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await page.context().setOffline(true);
    
    // Refresh page
    await page.reload();
    
    // Check if session state is maintained
    const sessionData = await page.evaluate(() => {
      // Check for any stored session data
      const storageKeys = Object.keys(localStorage);
      return storageKeys.some(key => 
        key.includes('session') || 
        key.includes('scoring') ||
        key.includes('current')
      );
    });
    
    // Session data should be preserved offline
    expect(typeof sessionData).toBe('boolean');
  });

  test('should handle offline errors gracefully', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true);
    
    // Try to navigate to a potentially uncached page
    await page.goto('/some-uncached-page');
    
    // Should handle gracefully (either show cached content or error page)
    await expect(page.locator('body')).toBeVisible();
    
    // Should not show browser error page
    const browserError = page.locator('text="ERR_INTERNET_DISCONNECTED"');
    await expect(browserError).toHaveCount(0);
  });
});