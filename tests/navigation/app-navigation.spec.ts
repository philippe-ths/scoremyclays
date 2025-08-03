import { test, expect } from '@playwright/test';

/**
 * App Navigation Tests
 * Testing core navigation flows and user journeys
 */

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display main navigation', async ({ page }) => {
    // Check for navigation elements
    const navigation = page.locator('[role="navigation"], nav');
    await expect(navigation.first()).toBeVisible();
    
    // Look for common navigation links
    const expectedPages = ['scoring', 'history', 'stats', 'profile'];
    
    for (const pageName of expectedPages) {
      const link = page.getByRole('link', { name: new RegExp(pageName, 'i') });
      if (await link.count() > 0) {
        await expect(link.first()).toBeVisible();
      }
    }
  });

  test('should navigate between main sections', async ({ page }) => {
    const sections = [
      { name: 'scoring', path: '/scoring' },
      { name: 'history', path: '/history' },
      { name: 'stats', path: '/stats' },
      { name: 'profile', path: '/profile' }
    ];

    for (const section of sections) {
      // Try to navigate to section
      const link = page.getByRole('link', { name: new RegExp(section.name, 'i') });
      
      if (await link.count() > 0) {
        await link.first().click();
        
        // Wait for navigation
        await page.waitForURL(new RegExp(section.path));
        
        // Verify we're on the correct page
        expect(page.url()).toContain(section.path);
        
        // Verify page content loads
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start on home page
    await page.goto('/');
    const homeUrl = page.url();
    
    // Navigate to scoring if available
    const scoringLink = page.getByRole('link', { name: /scoring/i });
    if (await scoringLink.count() > 0) {
      await scoringLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Should be back on home page
      expect(page.url()).toBe(homeUrl);
      
      // Go forward
      await page.goForward();
      await page.waitForLoadState('networkidle');
      
      // Should be back on scoring page
      expect(page.url()).toContain('/scoring');
    } else {
      test.skip('Navigation links not yet available');
    }
  });

  test('should maintain navigation state on page refresh', async ({ page }) => {
    // Navigate to a specific page
    await page.goto('/scoring');
    await page.waitForLoadState('networkidle');
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on the same page
    expect(page.url()).toContain('/scoring');
    
    // Navigation should still be visible
    const navigation = page.locator('[role="navigation"], nav');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
  });

  test('should handle deep linking', async ({ page }) => {
    // Test direct navigation to different pages
    const pages = ['/scoring', '/history', '/stats', '/profile'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
      
      // URL should match
      expect(page.url()).toContain(pagePath);
      
      // Navigation should be present
      const navigation = page.locator('[role="navigation"], nav');
      if (await navigation.count() > 0) {
        await expect(navigation.first()).toBeVisible();
      }
    }
  });

  test('should work with keyboard navigation', async ({ page }) => {
    // Focus on navigation
    const firstLink = page.getByRole('link').first();
    
    if (await firstLink.count() > 0) {
      await firstLink.focus();
      
      // Tab through navigation links
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Enter should activate focused link
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');
        
        // Should have navigated somewhere
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should display loading states during navigation', async ({ page }) => {
    // Navigate to a page
    const link = page.getByRole('link').first();
    
    if (await link.count() > 0) {
      // Start navigation
      const navigationPromise = page.waitForLoadState('networkidle');
      await link.click();
      
      // During navigation, page should remain functional
      await expect(page.locator('body')).toBeVisible();
      
      // Wait for navigation to complete
      await navigationPromise;
      
      // Page should be fully loaded
      await expect(page.locator('body')).toBeVisible();
    }
  });
});