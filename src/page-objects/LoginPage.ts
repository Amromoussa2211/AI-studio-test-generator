import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for login functionality
 */
export class LoginPage extends BasePage {
  private selectors = {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '[data-testid="error-message"]',
    forgotPasswordLink: '[data-testid="forgot-password-link"]',
    rememberMeCheckbox: '[data-testid="remember-me-checkbox"]'
  };

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto('/login');
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.fillInput(this.selectors.emailInput, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.selectors.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.selectors.loginButton);
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe(): Promise<void> {
    await this.clickElement(this.selectors.rememberMeCheckbox);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.selectors.forgotPasswordLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.selectors.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.errorMessage);
  }

  /**
   * Wait for login to complete
   */
  async waitForLogin(): Promise<void> {
    await this.waitForPageLoad();
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(): Promise<void> {
    await this.login('admin@example.com', 'admin123');
  }

  /**
   * Login as regular user
   */
  async loginAsUser(): Promise<void> {
    await this.login('user@example.com', 'user123');
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(): Promise<void> {
    await this.login('invalid@test.com', 'invalid123');
  }

  /**
   * Check if on login page
   */
  async isOnLoginPage(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loginButton);
  }

  /**
   * Fill both email and password fields together
   */
  async fillCredentials(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  /**
   * Submit login form
   */
  async submitLogin(): Promise<void> {
    await this.clickLoginButton();
    await this.waitForLogin();
  }
}
