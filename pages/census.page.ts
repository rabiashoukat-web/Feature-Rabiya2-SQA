import { expect, Page } from '@playwright/test';

/** Delay between steps (ms) - prevents flakiness from fast execution */
const STEP_DELAY = 1800;

/** Short delay for UI to settle after actions */
const SETTLE_DELAY = 1200;

export class CensusPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async delay(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Click the "Create New Patient Census" button on the census list.
   * XPath: //app-census-list//mat-card//mat-card-content//button[1] (stable structure)
   * User XPath: //*[@id="mat-tab-content-0-0"]/div/app-census-list/main/div/mat-card/mat-card-content/div[1]/button[1]/span[2]
   */
  async clickCreateNewPatientCensus() {
    await this.delay(STEP_DELAY);
    const createBtn = this.page.locator('app-census-list mat-card mat-card-content div button').first();
    await expect(createBtn).toBeVisible({ timeout: 15000 });
    await this.delay(SETTLE_DELAY);
    await createBtn.click();
    await this.delay(STEP_DELAY);
  }

  /**
   * Wait for the create census dialog to be visible.
   * Date, Name, Facility are pre-filled with defaults - no interaction needed.
   */
  async waitForCreateDialog() {
    await this.delay(SETTLE_DELAY);
    const dialog = this.page.locator('app-create-patient-rounding-sheet-dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await this.delay(1500);
  }

  /**
   * Click the Create button in the dialog (blue button at bottom).
   */
  async clickCreateButton() {
    await this.delay(2000);
    const dialog = this.page.locator('app-create-patient-rounding-sheet-dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    const createBtn = this.page.locator('mat-dialog-container button').filter({ hasText: /create/i });
    await expect(createBtn).toBeVisible({ timeout: 20000 });
    await expect(createBtn).toBeEnabled({ timeout: 5000 });
    await createBtn.scrollIntoViewIfNeeded();
    await this.delay(500);
    await createBtn.click();
    await this.delay(STEP_DELAY);
  }

  /**
   * Verify census was created successfully (dialog closes, success state).
   */
  async verifyCensusCreated() {
    await this.delay(2000);
    const dialog = this.page.locator('app-create-patient-rounding-sheet-dialog');
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
    await this.delay(SETTLE_DELAY);
  }
}