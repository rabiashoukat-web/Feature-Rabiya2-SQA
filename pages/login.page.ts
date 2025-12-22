import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    const url = process.env.URL;
    if (!url) {
      throw new Error('URL is not set in environment');
    }
    await this.page.goto(url);
  }

  async gotoMain() {
    const url = process.env.URL;
    if (!url) {
      throw new Error('URL is not set in environment');
    }
    // Normalize URL: remove trailing slash if present, then add /dashboard
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    await this.page.goto(baseUrl + '/dashboard');
  }

  async fillCredentials(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
  }

  async submitLogin() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async waitForPasscodeField(timeout = 20000) {
    const passcodeField = this.page.getByRole('textbox', { name: 'Enter Passcode' });
    await expect(passcodeField).toBeVisible({ timeout });
    return passcodeField;
  }

  async submitPasscode(code: string) {
    const field = await this.waitForPasscodeField();
    await field.fill(code);
    await this.page.getByRole('button', { name: 'Authenticate' }).click();
    // Wait for navigation to dashboard instead of generic 'load' event
    await this.verifySuccessfulLogin(this.page);
  }

  async loginWith2FA(email: string, password: string, code: string) {
    await this.fillCredentials(email, password);
    await this.submitLogin();
    await this.page.waitForTimeout(10_000);
    await this.submitPasscode(code);
  }

  async verifySuccessfulLogin(page: Page) {
    const url = process.env.URL;
    if (!url) {
      throw new Error('URL is not set in environment');
    }
    // Normalize URL: remove trailing slash if present, then add /dashboard
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    await expect(page).toHaveURL(baseUrl + '/dashboard');
  }
}


