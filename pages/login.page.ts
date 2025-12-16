import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://dev-app.doctornow.io/login');
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
  }

  async loginWith2FA(email: string, password: string, code: string) {
    await this.fillCredentials(email, password);
    await this.submitLogin();
    await this.page.waitForTimeout(10_000);
    await this.submitPasscode(code);
  }
}
