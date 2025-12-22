import { Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { DashboardPage } from '../../pages/dashboard.page';
import { getTwoFactorCode } from './mailosaur-helper';
import path from 'path';

// Helper function to get and validate environment variables
export function getEnvCredentials() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  if (!email) {
    throw new Error('EMAIL is not set in environment');
  }
  if (!password) {
    throw new Error('PASSWORD is not set in environment');
  }
  return { email, password };
}

// Helper function to verify login page is fully loaded
export async function ensureLoginPageLoaded(page: Page, loginPage: LoginPage, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000); // Additional wait for form to be ready
      
      // Check if login form elements are visible
      const emailField = page.getByRole('textbox', { name: 'Email Address' });
      const loginButton = page.getByRole('button', { name: 'Login' });
      
      await expect(emailField).toBeVisible({ timeout: 5000 });
      await expect(loginButton).toBeVisible({ timeout: 5000 });
      
      console.log('[2FA] Login page fully loaded');
      return true;
    } catch (error) {
      console.log(`[2FA] Login page not fully loaded (attempt ${attempt}/${maxRetries}), reloading...`);
      if (attempt < maxRetries) {
        await loginPage.goto();
      } else {
        throw new Error(`Login page failed to load after ${maxRetries} attempts`);
      }
    }
  }
  return false;
}

// Helper function to verify authentication state is valid
export async function ensureAuthenticated(page: Page) {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  
  try {
    // Try to navigate to dashboard with existing auth state
    await loginPage.gotoMain();
    
    // Wait for either dashboard to load or redirect to login (with timeout)
    try {
      await Promise.race([
        dashboard.waitForDashboard(10000),
        page.waitForURL(/\/login|\/auth/, { timeout: 10000 }).then(() => {
          throw new Error('Session expired - redirected to login');
        })
      ]);
    } catch (error: any) {
      // Check if it's a redirect to login or just a timeout
      const currentUrl = page.url();
      if (error.message && error.message.includes('Session expired')) {
        throw error; // Re-throw redirect error
      }
      if (currentUrl && (currentUrl.includes('/login') || currentUrl.includes('/auth'))) {
        throw new Error('Session expired - redirected to login');
      }
      // If we're on dashboard but waitForDashboard timed out, continue anyway
    }
    
    // Double-check: if we're on login page, session expired
    const currentUrl = page.url();
    if (currentUrl && (currentUrl.includes('/login') || currentUrl.includes('/auth'))) {
      throw new Error('Session expired - on login page');
    }
    
    // Session is valid, ensure dashboard is loaded
    try {
      await dashboard.waitForDashboard(5000);
    } catch {
      // Dashboard might already be loaded, continue
    }
    
  } catch (error) {
    // Session expired or navigation failed, re-authenticate
    console.log('[2FA] Session expired or invalid, re-authenticating...');
    const { email, password } = getEnvCredentials();
    
    await loginPage.goto();
    // Ensure login page is fully loaded before proceeding
    await ensureLoginPageLoaded(page, loginPage);
    await loginPage.fillCredentials(email, password);
    await loginPage.submitLogin();
    await page.waitForTimeout(7_000);
    const code = await getTwoFactorCode(email);
    await loginPage.submitPasscode(code);
    await loginPage.verifySuccessfulLogin(page);
    
    // Ensure we're on the dashboard after re-authentication
    await dashboard.waitForDashboard(30000);
    
    // Wait for page to be fully loaded
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      await page.waitForLoadState('domcontentloaded');
    }
    
    // Save the new auth state (with error handling in case context is closed)
    try {
      const authSessionFile = path.resolve(__dirname, '../../e2e/playwright/.auth/user.json');
      await page.context().storageState({
        path: authSessionFile
      });
      console.log('[2FA] Auth state saved successfully');
    } catch (error: any) {
      // Context might be closed, log warning but don't fail
      console.warn('[2FA] Could not save auth state (context may be closed):', error.message);
    }
    
    console.log('[2FA] Re-authentication successful');
  }
}

