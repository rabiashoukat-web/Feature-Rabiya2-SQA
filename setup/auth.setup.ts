import path from 'path';
import fs from 'fs';
import { LoginPage } from '../pages/login.page';
import { test } from '@playwright/test';
import { getTwoFactorCode } from '../e2e/mailosaur-helper';


const authSessionFile = path.resolve(__dirname, '../e2e/playwright/.auth/user.json');
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
if (!email) {
  throw new Error('EMAIL is not set in environment');
}
if (!password) {
  throw new Error('PASSWORD is not set in environment');
}


test('authenticate', async ({ page }) => { 
    test.setTimeout(90_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillCredentials(email, password);
    await loginPage.submitLogin();
    // allow email to be delivered
    await page.waitForTimeout(7_000);
    const code = await getTwoFactorCode(email);
    await loginPage.submitPasscode(code);
    await loginPage.verifySuccessfulLogin(page)
    await page.context().storageState({
        path: authSessionFile
    })
  
});