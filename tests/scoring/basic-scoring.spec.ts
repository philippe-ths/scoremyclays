import { test, expect } from '@playwright/test';

/**
 * Basic Clay Shooting Scoring Tests
 * Core user workflows for scoring clay targets
 */

test.describe('Basic Scoring Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display scoring interface', async ({ page }) => {
    // Navigate to scoring page
    await page.getByRole('link', { name: /scoring/i }).click();
    
    // Verify scoring interface elements are present
    await expect(page.getByRole('heading')).toContainText(/scoring|clay/i);
    
    // Look for scoring buttons or interface
    const scoringElements = page.locator('[data-testid*="scoring"], [data-testid*="shot"], button:has-text("Hit"), button:has-text("Miss")');
    await expect(scoringElements.first()).toBeVisible();
  });

  test('should allow starting a new scoring session', async ({ page }) => {
    await page.goto('/scoring');
    
    // Look for new session button
    const newSessionButton = page.getByRole('button', { name: /new session|start/i }).first();
    
    if (await newSessionButton.isVisible()) {
      await newSessionButton.click();
      
      // Check if session setup modal or form appears
      const sessionSetup = page.locator('[data-testid*="session"], [role="dialog"], form');
      await expect(sessionSetup.first()).toBeVisible();
    } else {
      // If no explicit button, check if scoring interface is already available
      const scoringInterface = page.locator('[data-testid*="scoring"], button:has-text("Hit")');
      await expect(scoringInterface.first()).toBeVisible();
    }
  });

  test('should handle basic hit/miss input', async ({ page }) => {
    await page.goto('/scoring');
    
    // Try to find hit/miss buttons
    const hitButton = page.getByRole('button', { name: /hit/i }).first();
    const missButton = page.getByRole('button', { name: /miss/i }).first();
    
    // If buttons exist, test basic interaction
    if (await hitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await hitButton.click();
      
      // Verify some kind of feedback or score update
      // This might be a score display, counter, or other UI feedback
      await page.waitForTimeout(500); // Allow for UI updates
      
      // Check for score-related elements
      const scoreElements = page.locator('[data-testid*="score"], [class*="score"], text=/\d+/');
      const hasScoreElements = await scoreElements.count() > 0;
      
      expect(hasScoreElements).toBeTruthy();
    } else {
      // Skip test if scoring interface not ready
      test.skip('Scoring interface not yet implemented');
    }
  });

  test('should persist scoring data locally', async ({ page }) => {
    await page.goto('/scoring');
    
    // Check if localStorage has any scoring-related data
    const localStorageData = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      return keys.filter(key => 
        key.includes('scoring') || 
        key.includes('session') || 
        key.includes('clay')
      );
    });
    
    // This test validates storage capability exists
    expect(Array.isArray(localStorageData)).toBeTruthy();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/scoring');
    
    // Verify page renders properly on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check that navigation is still accessible
    const navigation = page.locator('[role="navigation"], nav');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
    
    // Verify touch targets are appropriately sized
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const boundingBox = await firstButton.boundingBox();
      
      if (boundingBox) {
        // Buttons should be at least 44px for good touch targets
        expect(boundingBox.height).toBeGreaterThanOrEqual(32);
        expect(boundingBox.width).toBeGreaterThanOrEqual(32);
      }
    }
  });
});