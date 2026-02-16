import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard.page';
import { CensusPage } from '../../pages/census.page';
import { ensureAuthenticated } from '../helpers/auth-helper';

/** Test: Verify that user is able to create census with the default selected facility */

test.describe('Census - Create with Default Facility', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(120_000);
    await ensureAuthenticated(page);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('Verify that user is able to create census with the default selected facility', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const censusPage = new CensusPage(page);

    // Step 1: After Successful Login - ensure we're on dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      await ensureAuthenticated(page);
    }
    await dashboard.waitForDashboard(15000);
    await page.waitForTimeout(2000);

    // Step 2: Go to Census
    await dashboard.openCensus();
    await page.waitForTimeout(2500);

    // Re-check session after navigation
    const urlAfterCensus = page.url();
    if (urlAfterCensus.includes('/login') || urlAfterCensus.includes('/auth')) {
      await ensureAuthenticated(page);
      await dashboard.openCensus();
      await page.waitForTimeout(2500);
    }

    // Step 3: Click on the Create New Patient Census button
    await censusPage.clickCreateNewPatientCensus();

    // Step 4: Wait for dialog - Date, Name, Facility are all pre-filled with defaults
    await censusPage.waitForCreateDialog();

    // Step 5: Click Create - census will be created with current DOS and default facility
    await censusPage.clickCreateButton();

    // Expected: The census should be created for the by default selected facility and appear on census screen
    await censusPage.verifyCensusCreated();

    // Verify census appears on census screen
    const censusList = page.locator('app-census-list');
    await expect(censusList).toBeVisible({ timeout: 15000 });
  });
});
