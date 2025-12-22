import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { getEnvCredentials, ensureLoginPageLoaded } from '../helpers/auth-helper';
import { getTwoFactorCode } from '../helpers/mailosaur-helper';

test('Login with 2FA email code', async ({ page }) => {
  test.setTimeout(90_000); // Increased timeout for 2FA login
  
  const { email, password } = getEnvCredentials();
  const loginPage = new LoginPage(page);
  
  // Perform 2FA login
  await loginPage.goto();
  // Ensure login page is fully loaded before proceeding
  await ensureLoginPageLoaded(page, loginPage);
  await loginPage.fillCredentials(email, password);
  await loginPage.submitLogin();
  
  // Wait for email to be delivered and get 2FA code
  await page.waitForTimeout(6_000);
  const code = await getTwoFactorCode(email);
  await loginPage.submitPasscode(code);
});

