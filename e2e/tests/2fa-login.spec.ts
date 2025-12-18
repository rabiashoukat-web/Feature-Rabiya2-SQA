import { test } from '@playwright/test';
import { getTwoFactorCode } from '../mailosaur-helper';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';

test('Login with 2FA email code', async ({ page }) => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD+'1';

  if (!email) {
    throw new Error('EMAIL is not set in environment');
  }
  if (!password) {
    throw new Error('PASSWORD is not set in environment');
  }

  // Increase timeout for this test to 60s
  test.setTimeout(60_000);

  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.fillCredentials(email, password);
  await loginPage.submitLogin();

  // allow email to be delivered
  await page.waitForTimeout(10_000);

  const code = await getTwoFactorCode(email);
  await loginPage.submitPasscode(code);

  await dashboard.waitForDashboard();

  await dashboard.openPatients();
  await dashboard.openCensus();
  await dashboard.openSmartDrive();
  await dashboard.openChargeCapture();
});
