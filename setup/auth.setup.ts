import path from 'path';
import { LoginPage } from '../pages/login.page';
import { test } from '@playwright/test';
import { getTwoFactorCode } from '../e2e/helpers/mailosaur-helper';


const authSessionFile = path.resolve(__dirname, '../e2e/playwright/.auth/user.json');

test('authenticate', async ({ page }) => { 
    test.setTimeout(90_000);
    
    // Check environment variables when test runs (after dotenv loads .env file)
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    if (!email) {
      throw new Error('EMAIL is not set in environment');
    }
    if (!password) {
      throw new Error('PASSWORD is not set in environment');
    }
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillCredentials(email, password);
    await loginPage.submitLogin();
    // allow email to be delivered
    await page.waitForTimeout(4_000);
    const code = await getTwoFactorCode(email);
    await loginPage.submitPasscode(code);
    await loginPage.verifySuccessfulLogin(page)
    await page.context().storageState({
        path: authSessionFile
    })
  
});