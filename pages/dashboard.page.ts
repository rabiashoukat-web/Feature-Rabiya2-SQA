import { expect, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForDashboard(timeout = 20000) {
    await this.page.waitForURL(/dashboard/, { timeout });
  }

  async openPatients() {
    const patientsLocator = this.page.getByText('Patients', { exact: true });
    await patientsLocator.click();
  }

  async openCensus() {
    await this.page.getByText('Census', { exact: true }).click();
  }

  async openSmartDrive() {
    await this.page.getByText('Smart Drive', { exact: true }).click();
  }

  async openChargeCapture() {
    await this.page.getByText('Charge Capture', { exact: true }).click();
  }
}
