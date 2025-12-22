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
    await expect(patientsLocator).toBeVisible({ timeout: 30000 });
    await patientsLocator.click();
  }

  async openCensus() {
    const censusLocator = this.page.getByText('Census', { exact: true });
    await expect(censusLocator).toBeVisible({ timeout: 30000 });
    await censusLocator.click();
  }

  async openSmartDrive() {
    const smartDriveLocator = this.page.getByText('Smart Drive', { exact: true });
    await expect(smartDriveLocator).toBeVisible({ timeout: 30000 });
    await smartDriveLocator.click();
  }

  async openChargeCapture() {
    const chargeCaptureLocator = this.page.getByText('Charge Capture', { exact: true });
    await expect(chargeCaptureLocator).toBeVisible({ timeout: 30000 });
    await chargeCaptureLocator.click();
  }
}
