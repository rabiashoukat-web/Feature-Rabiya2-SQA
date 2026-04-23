import { test } from '@playwright/test';
import { ensureAuthenticated } from '../helpers/auth-helper';

test.describe('Login', () => {
  test('Authenticate user only', async ({ page }) => {
    test.setTimeout(90_000);

    await ensureAuthenticated(page);
    await page.waitForLoadState('domcontentloaded');
  });
});