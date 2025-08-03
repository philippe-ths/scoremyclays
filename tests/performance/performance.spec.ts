import { test, expect } from '@playwright/test';

/**
 * Performance Tests for Clay Shooting PWA
 * Ensuring fast, responsive experience for outdoor use
 */

test.describe('Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Start performance monitoring
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to main scoring page
    await page.goto('/scoring');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};
        
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.lcp = entries[entries.length - 1].startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID) / Interaction to Next Paint (INP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.fid = entries[0].processingStart - entries[0].startTime;
          }
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Give some time for measurements
        setTimeout(() => resolve(vitals), 3000);
      });
    });
    
    // LCP should be under 2.5 seconds (good threshold)
    if ((vitals as any).lcp) {
      expect((vitals as any).lcp).toBeLessThan(2500);
    }
    
    // FID should be under 100ms (good threshold)
    if ((vitals as any).fid) {
      expect((vitals as any).fid).toBeLessThan(100);
    }
    
    // CLS should be under 0.1 (good threshold)
    if ((vitals as any).cls) {
      expect((vitals as any).cls).toBeLessThan(0.1);
    }
  });

  test('should load quickly on mobile connections', async ({ page }) => {
    // Simulate 3G connection
    await page.context().route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/scoring');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time even on slow connection
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('should respond quickly to touch interactions', async ({ page }) => {
    await page.goto('/scoring');
    
    // Look for interactive elements
    const buttons = page.locator('button').first();
    
    if (await buttons.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Measure interaction response time
      const interactionTime = await page.evaluate(async (buttonSelector) => {
        const button = document.querySelector(buttonSelector);
        if (!button) return null;
        
        const startTime = performance.now();
        
        // Simulate touch interaction
        button.dispatchEvent(new Event('touchstart', { bubbles: true }));
        button.dispatchEvent(new Event('touchend', { bubbles: true }));
        button.dispatchEvent(new Event('click', { bubbles: true }));
        
        // Wait for any visual feedback
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        return performance.now() - startTime;
      }, await buttons.getAttribute('class') ? `button.${(await buttons.getAttribute('class'))?.split(' ')[0]}` : 'button');
      
      if (interactionTime) {
        // Touch response should be under 200ms for good UX
        expect(interactionTime).toBeLessThan(200);
      }
    }
  });

  test('should handle rapid successive inputs', async ({ page }) => {
    await page.goto('/scoring');
    
    // Find hit/miss buttons if they exist
    const hitButton = page.getByRole('button', { name: /hit/i }).first();
    const missButton = page.getByRole('button', { name: /miss/i }).first();
    
    if (await hitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const startTime = Date.now();
      
      // Rapid fire clicks (simulating fast clay shooting scoring)
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          await hitButton.click();
        } else {
          await missButton.click();
        }
        await page.waitForTimeout(50); // 50ms between clicks
      }
      
      const totalTime = Date.now() - startTime;
      
      // Should handle 10 rapid inputs in under 2 seconds
      expect(totalTime).toBeLessThan(2000);
      
      // UI should still be responsive
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should maintain performance during long sessions', async ({ page }) => {
    await page.goto('/scoring');
    
    // Simulate a longer scoring session
    const sessionStart = Date.now();
    
    // Perform various actions to simulate extended use
    for (let i = 0; i < 25; i++) {
      // Navigate around the app
      if (i % 5 === 0) {
        const navLinks = page.locator('[role="navigation"] a, nav a');
        const linkCount = await navLinks.count();
        if (linkCount > 0) {
          await navLinks.nth(i % linkCount).click();
          await page.waitForLoadState('networkidle');
        }
      }
      
      await page.waitForTimeout(100);
    }
    
    const sessionTime = Date.now() - sessionStart;
    
    // App should remain responsive throughout session
    await expect(page.locator('body')).toBeVisible();
    
    // Session shouldn't take unreasonably long
    expect(sessionTime).toBeLessThan(15000); // 15 seconds max
  });

  test('should optimize memory usage', async ({ page }) => {
    await page.goto('/scoring');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Perform memory-intensive operations
    for (let i = 0; i < 100; i++) {
      await page.evaluate(() => {
        // Simulate some data operations
        const data = new Array(1000).fill(0).map((_, i) => ({ id: i, score: Math.random() }));
        // Let garbage collection handle cleanup
      });
      
      if (i % 10 === 0) {
        await page.waitForTimeout(100);
      }
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      // Memory increase should be reasonable
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max increase
    }
  });

  test('should handle network timeouts gracefully', async ({ page }) => {
    // Simulate slow/failing network requests
    await page.context().route('**/*', async (route) => {
      if (route.request().url().includes('.json') || route.request().url().includes('/api/')) {
        // Simulate slow API responses
        await new Promise(resolve => setTimeout(resolve, 5000));
        await route.abort();
      } else {
        await route.continue();
      }
    });
    
    const startTime = Date.now();
    await page.goto('/scoring');
    
    // App should still load basic functionality despite network issues
    await expect(page.locator('body')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should not hang indefinitely
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('should maintain 60fps during animations', async ({ page }) => {
    await page.goto('/scoring');
    
    // Measure frame rate during interactions
    const frameRate = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();
        
        function countFrame() {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrame);
          } else {
            resolve(frames);
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
    
    // Should maintain close to 60fps
    expect(frameRate as number).toBeGreaterThan(45); // Allow some variance
  });
});