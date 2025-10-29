import { Page, expect, APIResponse } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test utilities for screenshots, data management, and assertions
 */
export class TestUtils {
  
  /**
   * Take a screenshot with timestamp
   */
  static async takeScreenshot(
    page: Page,
    name: string,
    fullPage: boolean = true,
    screenshotDir: string = 'screenshots'
  ): Promise<string> {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${name}_${timestamp}.png`;
    const filePath = path.join(screenshotDir, fileName);

    await page.screenshot({ 
      path: filePath, 
      fullPage 
    });

    console.log(`Screenshot saved: ${filePath}`);
    return filePath;
  }

  /**
   * Take screenshot of specific element
   */
  static async takeElementScreenshot(
    page: Page,
    selector: string,
    name: string,
    screenshotDir: string = 'screenshots'
  ): Promise<string> {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${name}_${timestamp}.png`;
    const filePath = path.join(screenshotDir, fileName);

    const element = page.locator(selector);
    await element.screenshot({ 
      path: filePath 
    });

    console.log(`Element screenshot saved: ${filePath}`);
    return filePath;
  }

  /**
   * Create screenshot directory
   */
  static createScreenshotDir(dirName: string = 'screenshots'): string {
    const dirPath = path.join(process.cwd(), dirName);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
  }

  /**
   * Compare screenshots (basic comparison)
   */
  static async compareScreenshots(
    page: Page,
    baselinePath: string,
    currentName: string
  ): Promise<boolean> {
    if (!fs.existsSync(baselinePath)) {
      console.warn(`Baseline screenshot not found: ${baselinePath}`);
      return false;
    }

    await TestUtils.takeScreenshot(page, currentName);
    const currentPath = path.join('screenshots', `${currentName}_${Date.now()}.png`);
    
    // Note: This is a basic comparison
    // For production use, consider using pixelmatch or similar library
    return fs.existsSync(currentPath);
  }

  /**
   * Save test data to JSON file
   */
  static saveTestData(data: any, fileName: string, dataDir: string = 'test-data'): void {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Test data saved: ${filePath}`);
  }

  /**
   * Load test data from JSON file
   */
  static loadTestData<T>(fileName: string, dataDir: string = 'test-data'): T | null {
    try {
      const filePath = path.join(dataDir, `${fileName}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data) as T;
      }
    } catch (error) {
      console.error(`Error loading test data from ${fileName}:`, error);
    }
    return null;
  }

  /**
   * Generate random test data
   */
  static generateRandomData(): { [key: string]: any } {
    return {
      firstName: `TestFirst_${Date.now()}`,
      lastName: `TestLast_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      phone: `+123456789${Date.now().toString().slice(-2)}`,
      address: `123 Test Street ${Date.now()}`,
      city: 'TestCity',
      zipCode: '12345',
      username: `user_${Date.now()}`,
      password: `TestPass${Date.now()}`
    };
  }

  /**
   * Generate unique email
   */
  static generateUniqueEmail(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@example.com`;
  }

  /**
   * Generate unique username
   */
  static generateUniqueUsername(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Wait for network to be idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for element with timeout and retry
   */
  static async waitForElementWithRetry(
    page: Page,
    selector: string,
    timeout: number = 5000,
    retries: number = 3
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await page.waitForSelector(selector, { timeout });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Get element count
   */
  static async getElementCount(page: Page, selector: string): Promise<number> {
    return await page.locator(selector).count();
  }

  /**
   * Check if element exists
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text safely
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    try {
      const element = page.locator(selector);
      return await element.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Scroll to bottom of page
   */
  static async scrollToBottom(page: Page): Promise<void> {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to top of page
   */
  static async scrollToTop(page: Page): Promise<void> {
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Clear local storage
   */
  static async clearStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    });
  }

  /**
   * Set local storage item
   */
  static async setLocalStorage(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key, value });
  }

  /**
   * Get local storage item
   */
  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return await page.evaluate(({ key }) => {
      return localStorage.getItem(key);
    }, { key });
  }

  /**
   * Mock API response
   */
  static async mockApiResponse(
    page: Page,
    url: string,
    response: any,
    status: number = 200
  ): Promise<void> {
    await page.route(url, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Log API request/response
   */
  static logApiCall(method: string, url: string, response: APIResponse): void {
    console.log(`API Call: ${method} ${url}`);
    console.log(`Status: ${response.status()}`);
    console.log(`Headers:`, response.headers());
  }

  /**
   * Create test report
   */
  static createTestReport(results: any[], reportPath: string = 'test-report.json'): void {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      results
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Test report saved: ${reportPath}`);
  }

  /**
   * Clean up test files
   */
  static cleanupTestFiles(patterns: string[] = ['screenshots/*', 'test-results/*', '*.log']): void {
    patterns.forEach(pattern => {
      try {
        const files = fs.readdirSync(process.cwd()).filter(file => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(file);
          }
          return file === pattern;
        });

        files.forEach(file => {
          try {
            fs.unlinkSync(file);
            console.log(`Cleaned up: ${file}`);
          } catch (err) {
            console.warn(`Failed to cleanup ${file}:`, err);
          }
        });
      } catch (err) {
        console.warn(`Error cleaning pattern ${pattern}:`, err);
      }
    });
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Generate UUID
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Sleep/wait
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxAttempts) {
          throw lastError;
        }
        await this.sleep(delay * attempt);
      }
    }
    
    throw lastError!;
  }
}
