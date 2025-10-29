import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class with common functionality
 */
export abstract class BasePage {
  protected page: Page;
  protected pageUrl: string;

  constructor(page: Page, pageUrl: string) {
    this.page = page;
    this.pageUrl = pageUrl;
  }

  /**
   * Navigate to the page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${this.pageUrl}${path}`);
  }

  /**
   * Wait for page to load
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await expect(this.page.locator(selector)).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Click element
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string): Promise<Locator> {
    return await this.page.locator(selector).waitFor();
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}

/**
 * Common form elements and interactions
 */
export class FormElements {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Fill form fields from data object
   */
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.locator(selector).fill(value);
    }
  }

  /**
   * Submit form
   */
  async submitForm(submitSelector: string): Promise<void> {
    await this.page.locator(submitSelector).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if form is valid
   */
  async isFormValid(): Promise<boolean> {
    try {
      await expect(this.page.locator('input:invalid, select:invalid, textarea:invalid')).toHaveCount(0);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear form fields
   */
  async clearForm(fieldSelectors: string[]): Promise<void> {
    for (const selector of fieldSelectors) {
      const element = this.page.locator(selector);
      await element.clear();
      await element.fill('');
    }
  }
}

/**
 * Table interactions
 */
export class TableElements {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get table headers
   */
  async getTableHeaders(): Promise<string[]> {
    const headers = await this.page.locator('thead th').allTextContents();
    return headers;
  }

  /**
   * Get table rows
   */
  async getTableRows(): Promise<string[][]> {
    const rows = await this.page.locator('tbody tr').all();
    const rowData: string[][] = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      rowData.push(cells);
    }
    
    return rowData;
  }

  /**
   * Click table cell
   */
  async clickTableCell(rowIndex: number, columnIndex: number): Promise<void> {
    await this.page.locator(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`).click();
  }

  /**
   * Sort table by column
   */
  async sortTableByColumn(columnIndex: number): Promise<void> {
    await this.page.locator(`thead th:nth-child(${columnIndex + 1})`).click();
    await this.page.waitForTimeout(500); // Wait for sort animation
  }
}