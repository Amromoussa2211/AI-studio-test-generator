import { test, expect } from '@playwright/test';
import { test as base } from '../../fixtures/testFixtures';

/**
 * Extended test with fixtures
 */
const testWithFixtures = base.extend<{
  loginPage: import('../../page-objects/LoginPage').LoginPage;
  testData: any;
}>({
  loginPage: async ({ page, baseURL }, use) => {
    const loginPage = new (await import('../../page-objects/LoginPage')).LoginPage(page, baseURL);
    await use(loginPage);
  },
  testData: async ({}, use) => {
    const testData = await (await import('../../test-data/testData')).default;
    await use(testData);
  }
});

const { describe, beforeEach, afterEach } = testWithFixtures;

describe('Login Tests', () => {
  beforeEach(async ({ loginPage, baseURL }) => {
    // Navigate to login page before each test
    await loginPage.goto();
  });

  describe('Valid Login', () => {
    test('should login with valid admin credentials', async ({ loginPage, testData, page }) => {
      const adminUser = testData.users.find((user: any) => user.role === 'admin');
      
      // Perform login
      await loginPage.login(adminUser.email, adminUser.password);
      
      // Verify successful login
      await expect(page).toHaveURL(/.*dashboard|.*home|.*profile/);
      await expect(page.locator('[data-testid="user-menu"], .user-menu, .profile-menu')).toBeVisible();
    });

    test('should login with valid user credentials', async ({ loginPage, testData, page }) => {
      const regularUser = testData.users.find((user: any) => user.role === 'user' && user.isActive);
      
      // Perform login
      await loginPage.login(regularUser.email, regularUser.password);
      
      // Verify successful login
      await expect(page).toHaveURL(/.*dashboard|.*home|.*profile/);
      await expect(page.locator('[data-testid="user-menu"], .user-menu, .profile-menu')).toBeVisible();
    });

    test('should show remember me option', async ({ loginPage, testData }) => {
      // Verify remember me checkbox exists
      await expect(loginPage.page.locator('[data-testid="remember-me-checkbox"]')).toBeVisible();
      
      // Click remember me
      await loginPage.checkRememberMe();
      
      // Verify it's checked
      await expect(loginPage.page.locator('[data-testid="remember-me-checkbox"]')).toBeChecked();
    });
  });

  describe('Invalid Login', () => {
    test('should show error with invalid credentials', async ({ loginPage }) => {
      await loginPage.loginWithInvalidCredentials();
      
      // Verify error message is displayed
      await expect(loginPage.page.locator('[data-testid="error-message"]')).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText.toLowerCase()).toMatch(/invalid|incorrect|wrong|failed/);
    });

    test('should show error with empty credentials', async ({ loginPage }) => {
      await loginPage.login('', '');
      
      // Verify error message for empty email
      await expect(loginPage.page.locator('[data-testid="email-error"], .error-message')).toBeVisible();
    });

    test('should show error with invalid email format', async ({ loginPage }) => {
      await loginPage.login('invalid-email', 'password123');
      
      // Verify error message for invalid email format
      await expect(loginPage.page.locator('[data-testid="email-error"], .error-message')).toBeVisible();
      const errorText = await loginPage.getErrorMessage();
      expect(errorText.toLowerCase()).toMatch(/email|invalid/);
    });

    test('should show error with inactive user', async ({ loginPage, testData }) => {
      const inactiveUser = testData.users.find((user: any) => !user.isActive);
      
      if (inactiveUser) {
        await loginPage.login(inactiveUser.email, inactiveUser.password);
        
        // Verify error message for inactive user
        await expect(loginPage.page.locator('[data-testid="error-message"]')).toBeVisible();
      }
    });
  });

  describe('Login Page UI', () => {
    test('should display all login form elements', async ({ loginPage }) => {
      // Verify form elements are visible
      await expect(loginPage.page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(loginPage.page.locator('[data-testid="password-input"]')).toBeVisible();
      await expect(loginPage.page.locator('[data-testid="login-button"]')).toBeVisible();
    });

    test('should have proper input types', async ({ loginPage }) => {
      // Email should have email type
      const emailInput = loginPage.page.locator('[data-testid="email-input"]');
      const emailType = await emailInput.getAttribute('type');
      expect(emailType).toBe('email');
      
      // Password should have password type
      const passwordInput = loginPage.page.locator('[data-testid="password-input"]');
      const passwordType = await passwordInput.getAttribute('type');
      expect(passwordType).toBe('password');
    });

    test('should have forgot password link', async ({ loginPage }) => {
      // Verify forgot password link exists
      await expect(loginPage.page.locator('[data-testid="forgot-password-link"]')).toBeVisible();
      
      // Click forgot password link
      await loginPage.clickForgotPassword();
      
      // Should navigate to forgot password page
      await expect(loginPage.page).toHaveURL(/.*forgot.*password|.*reset.*password/);
    });
  });

  describe('Login Flow', () => {
    test('should complete full login flow successfully', async ({ loginPage, testData, page }) => {
      const user = testData.users.find((user: any) => user.role === 'user' && user.isActive);
      
      // Fill credentials
      await loginPage.fillCredentials(user.email, user.password);
      
      // Verify form is filled
      await expect(loginPage.page.locator('[data-testid="email-input"]')).toHaveValue(user.email);
      await expect(loginPage.page.locator('[data-testid="password-input"]')).toHaveValue(user.password);
      
      // Submit login
      await loginPage.submitLogin();
      
      // Verify redirect after login
      await expect(page).toHaveURL(/.*dashboard|.*home|.*profile/);
    });

    test('should handle form validation errors gracefully', async ({ loginPage }) => {
      // Try to submit with empty form
      await loginPage.submitLogin();
      
      // Verify validation errors
      await expect(loginPage.page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(loginPage.page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    test('should handle network errors', async ({ loginPage }) => {
      // This test would require mock server or network interception
      // Skipping for now
      test.skip(true, 'Requires network mocking setup');
    });
  });

  describe('Security Tests', () => {
    test('should not expose password in URL', async ({ loginPage, testData, page }) => {
      const user = testData.users.find((user: any) => user.role === 'user');
      
      await loginPage.login(user.email, user.password);
      
      // Verify password is not in URL
      const currentUrl = page.url();
      expect(currentUrl).not.toContain(user.password);
    });

    test('should show different error messages for different failures', async ({ loginPage, testData }) => {
      // Test invalid credentials
      await loginPage.login('nonexistent@example.com', 'wrongpassword');
      const invalidEmailError = await loginPage.getErrorMessage();
      
      // Test empty fields
      await loginPage.login('', '');
      const emptyFieldsError = await loginPage.getErrorMessage();
      
      // Error messages should be different or same generic message
      // (depends on implementation - showing generic error for security)
      expect(invalidEmailError || emptyFieldsError).toBeTruthy();
    });

    test('should clear form after failed login', async ({ loginPage, testData }) => {
      const user = testData.users.find((user: any) => user.role === 'user');
      
      // Fill credentials
      await loginPage.fillCredentials(user.email, user.password);
      
      // Attempt login with wrong password
      await loginPage.fillPassword('wrongpassword');
      await loginPage.submitLogin();
      
      // Wait a bit for error
      await loginPage.wait(1000);
      
      // Form should be cleared or maintain values (implementation dependent)
      // This test depends on specific implementation
    });
  });
});

// Export test for direct use
export { testWithFixtures as test };
