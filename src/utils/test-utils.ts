import { Page, BrowserContext } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test data and configuration utilities
 */
export class TestConfig {
  static readonly baseURL = process.env.BASE_URL || 'http://localhost:3000';
  static readonly apiBaseURL = process.env.API_BASE_URL || 'http://localhost:8080/api';
  static readonly apiKey = process.env.API_KEY || '';
  static readonly apiSecret = process.env.API_SECRET || '';
  static readonly defaultTimeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000');
  static readonly headless = process.env.HEADLESS === 'true';
  static readonly retryCount = parseInt(process.env.RETRY_COUNT || '0');
  
  /**
   * Get mobile device viewport
   */
  static getMobileViewport() {
    return {
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    };
  }
  
  /**
   * Get tablet device viewport
   */
  static getTabletViewport() {
    return {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2
    };
  }
  
  /**
   * Get desktop viewport
   */
  static getDesktopViewport() {
    return {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    };
  }
}

/**
 * Browser utilities
 */
export class BrowserUtils {
  /**
   * Navigate to a page with retry logic
   */
  static async navigateWithRetry(
    page: Page,
    url: string,
    retries: number = 3,
    timeout?: number
  ): Promise<void> {
    const navigationTimeout = timeout || TestConfig.defaultTimeout;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.goto(url, { timeout: navigationTimeout });
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await page.waitForTimeout(1000 * attempt); // Exponential backoff
      }
    }
  }
  
  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `test-results/screenshots/${name}_${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }
  
  /**
   * Get element by selector with retry
   */
  static async getElementWithRetry(
    page: Page,
    selector: string,
    timeout?: number
  ) {
    const elementTimeout = timeout || TestConfig.defaultTimeout;
    return await page.waitForSelector(selector, { timeout: elementTimeout });
  }
}

/**
 * API utilities
 */
export class APIUtils {
  private static baseURL = TestConfig.apiBaseURL;
  private static apiKey = TestConfig.apiKey;
  private static apiSecret = TestConfig.apiSecret;
  
  /**
   * Make authenticated API request
   */
  static async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * GET request
   */
  static async get(endpoint: string, params?: Record<string, string>): Promise<any> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return this.makeRequest(url.pathname + url.search);
  }
  
  /**
   * POST request
   */
  static async post(endpoint: string, data?: any): Promise<any> {
    return this.makeRequest(endpoint, 'POST', data);
  }
  
  /**
   * PUT request
   */
  static async put(endpoint: string, data?: any): Promise<any> {
    return this.makeRequest(endpoint, 'PUT', data);
  }
  
  /**
   * DELETE request
   */
  static async delete(endpoint: string): Promise<any> {
    return this.makeRequest(endpoint, 'DELETE');
  }
}

/**
 * Mobile utilities
 */
export class MobileUtils {
  /**
   * Set mobile viewport
   */
  static async setMobileViewport(context: BrowserContext, deviceName?: string): Promise<Page> {
    const page = await context.newPage();
    
    if (deviceName) {
      const device = devices[deviceName as keyof typeof devices];
      if (device) {
        await page.setViewportSize(device.viewport!);
      }
    } else {
      await page.setViewportSize(TestConfig.getMobileViewport());
    }
    
    return page;
  }
  
  /**
   * Simulate touch interactions
   */
  static async tap(page: Page, selector: string): Promise<void> {
    await page.tap(selector);
  }
  
  /**
   * Simulate swipe gesture
   */
  static async swipe(
    page: Page,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Promise<void> {
    await page.touchscreen.tap(startX, startY);
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
  }
}

/**
 * File utilities for test data
 */
export class FileUtils {
  /**
   * Read JSON test data
   */
  static async readJSONData<T>(filename: string): Promise<T> {
    const fs = await import('fs-extra');
    const path = await import('path');
    
    const filePath = path.join(__dirname, '../data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }
  
  /**
   * Write test results to file
   */
  static async writeTestResults(filename: string, data: any): Promise<void> {
    const fs = await import('fs-extra');
    const path = await import('path');
    
    const filePath = path.join(__dirname, '../../test-results', filename);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
}