import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';
import { ensureAuthenticated } from '../helpers/auth-helper';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000); // Increased timeout for authentication
    // Ensure authenticated session is valid (will re-authenticate if expired)
    await ensureAuthenticated(page);
    // Wait for page to be fully loaded
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('Navigate to Patients page', async ({ page }) => {
    test.setTimeout(60_000); // Increased timeout for navigation
    
    const dashboard = new DashboardPage(page);
    await dashboard.openPatients();
    
    // Check if session expired after navigation
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      console.log('[2FA] Session expired after navigation, re-authenticating...');
      await ensureAuthenticated(page);
      // Retry navigation
      await dashboard.openPatients();
    }
  });

  test('Navigate to Census page', async ({ page }) => {
    test.setTimeout(60_000); // Increased timeout for navigation
    
    const dashboard = new DashboardPage(page);
    await dashboard.openCensus();
    
    // Check if session expired after navigation
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      console.log('[2FA] Session expired after navigation, re-authenticating...');
      await ensureAuthenticated(page);
      // Retry navigation
      await dashboard.openCensus();
    }
  });

  test('Navigate to Smart Drive page', async ({ page }) => {
    test.setTimeout(60_000); // Increased timeout for navigation
    
    const dashboard = new DashboardPage(page);
    await dashboard.openSmartDrive();
    
    // Check if session expired after navigation
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      console.log('[2FA] Session expired after navigation, re-authenticating...');
      await ensureAuthenticated(page);
      // Retry navigation
      await dashboard.openSmartDrive();
    }
  });

  test('Navigate to Charge Capture page', async ({ page }) => {
    test.setTimeout(60_000); // Increased timeout for navigation
    
    const dashboard = new DashboardPage(page);
    await dashboard.openChargeCapture();
    
    // Check if session expired after navigation
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      console.log('[2FA] Session expired after navigation, re-authenticating...');
      await ensureAuthenticated(page);
      // Retry navigation
      await dashboard.openChargeCapture();
    }
  });
});