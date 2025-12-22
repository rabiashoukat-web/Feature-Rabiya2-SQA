import { test } from '@playwright/test';
import { getTwoFactorCode } from '../mailosaur-helper';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';

// Helper function to get and validate environment variables
function getEnvCredentials() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  if (!email) {
    throw new Error('EMAIL is not set in environment');
  }
  if (!password) {
    throw new Error('PASSWORD is not set in environment');
  }
  return { email, password };
}

// test('Login with 2FA email code', async ({ page }) => {
//   const { email, password } = getEnvCredentials();
//   const loginPage = new LoginPage(page);
  
//   // Perform 2FA login
//   await loginPage.goto();
//   await loginPage.fillCredentials(email, password);
//   await loginPage.submitLogin();
  
//   // Wait for email to be delivered and get 2FA code
//   await page.waitForTimeout(7_000);
//   const code = await getTwoFactorCode(email);
//   await loginPage.submitPasscode(code);
// });

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    // Navigate to dashboard - storageState should already be loaded from auth-setup
    await loginPage.gotoMain();
    await dashboard.waitForDashboard();
  });

  test('Navigate to Patients page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openPatients();
  });

  test('Navigate to Census page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openCensus();
  });

  test('Navigate to Smart Drive page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openSmartDrive();
  });

  test('Navigate to Charge Capture page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openChargeCapture();
  });
});