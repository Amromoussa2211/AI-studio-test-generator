import { Page, expect } from '@playwright/test';

/**
 * Base page class that all page objects extend from
 * Provides common functionality for all pages
 */
export abstract class BasePage {
  public readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page, baseUrl?: string) {
    this.page = page;
    this.baseUrl = baseUrl || '';
  }

  /**
   * Navigate to a page
   */
  async goto(path: string = ''): Promise<void> {
    const url = this.baseUrl ? `${this.baseUrl}${path}` : path;
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('body');
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name?: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name || 'screenshot'}_${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { 
      state: 'visible', 
      timeout: timeout || 5000 
    });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, timeout?: number): Promise<void> {
    await this.page.waitForSelector(selector, { 
      state: 'hidden', 
      timeout: timeout || 5000 
    });
  }

  /**
   * Click element with retry
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.scrollIntoViewIfNeeded(selector);
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Wait for specific time (not recommended, use explicit waits instead)
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Refresh the page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}
