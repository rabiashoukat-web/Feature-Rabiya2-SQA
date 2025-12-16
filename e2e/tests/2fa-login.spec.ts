import { test } from '@playwright/test';
import { getTwoFactorCode } from './mailosaur-helper';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';

test('Login with 2FA email code (POM)', async ({ page }) => {
  const email = 'put here email';
  const password = 'put here password';

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
