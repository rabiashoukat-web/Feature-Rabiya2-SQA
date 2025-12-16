import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForDashboard(timeout = 20000) {
    await this.page.waitForURL(/dashboard/, { timeout });
  }

  async openPatients() {
    await this.page.getByText('Patients').click();
  }

  async openCensus() {
    await this.page.getByText('Census').click();
  }

  async openSmartDrive() {
    await this.page.getByText('Smart Drive').click();
  }

  async openChargeCapture() {
    await this.page.getByText('Charge Capture').click();
  }
}
