import { FullConfig } from '@playwright/test';

/**
 * Global teardown for ScoreMyClays E2E tests
 * Cleanup and test result processing
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up ScoreMyClays E2E test environment...');

  try {
    // Log test completion summary
    console.log('📊 E2E test run completed');
    
    // Could add cleanup for test data, screenshots, etc.
    // For now, Playwright handles most cleanup automatically
    
    console.log('✅ ScoreMyClays E2E cleanup completed');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't fail the test run
  }
}

export default globalTeardown;