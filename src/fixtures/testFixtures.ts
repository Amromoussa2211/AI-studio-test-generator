import { test as base, Page, Browser, BrowserContext, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { FormPage } from '../page-objects/FormPage';
import { NavigationPage } from '../page-objects/NavigationPage';
import { EcommercePage } from '../page-objects/EcommercePage';
import { TestUtils } from '../utils/TestUtils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test fixtures for different page types
 */
export interface TestFixtures {
  loginPage: LoginPage;
  formPage: FormPage;
  navigationPage: NavigationPage;
  ecommercePage: EcommercePage;
  testData: any;
  authenticatedPage: Page;
  apiContext: APIRequestContext;
  mobilePage: Page;
}

/**
 * Extended test type with fixtures
 */
export const test = base.extend<TestFixtures>({
  // Login page fixture
  loginPage: async ({ page, baseURL }, use) => {
    const loginPage = new LoginPage(page, baseURL);
    await use(loginPage);
  },

  // Form page fixture
  formPage: async ({ page, baseURL }, use) => {
    const formPage = new FormPage(page, baseURL);
    await use(formPage);
  },

  // Navigation page fixture
  navigationPage: async ({ page, baseURL }, use) => {
    const navigationPage = new NavigationPage(page, baseURL);
    await use(navigationPage);
  },

  // E-commerce page fixture
  ecommercePage: async ({ page, baseURL }, use) => {
    const ecommercePage = new EcommercePage(page, baseURL);
    await use(ecommercePage);
  },

  // Test data fixture
  testData: async ({}, use) => {
    const testDataDir = path.join(process.cwd(), 'src', 'test-data');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }

    // Load or create test data
    let testData = TestUtils.loadTestData('default');
    
    if (!testData) {
      testData = {
        users: [
          {
            id: 1,
            email: 'admin@example.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          },
          {
            id: 2,
            email: 'user@example.com',
            password: 'user123',
            firstName: 'Regular',
            lastName: 'User',
            role: 'user'
          },
          {
            id: 3,
            email: 'test@example.com',
            password: 'test123',
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
          }
        ],
        products: [
          {
            id: 1,
            name: 'Test Product 1',
            price: 29.99,
            category: 'Electronics',
            description: 'Test product description'
          },
          {
            id: 2,
            name: 'Test Product 2',
            price: 49.99,
            category: 'Books',
            description: 'Another test product'
          },
          {
            id: 3,
            name: 'Test Product 3',
            price: 19.99,
            category: 'Clothing',
            description: 'Third test product'
          }
        ],
        forms: {
          contact: {
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
          },
          registration: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            confirmPassword: 'password123'
          },
          payment: {
            cardNumber: '4111111111111111',
            expiryDate: '12/25',
            cvv: '123',
            cardholderName: 'John Doe'
          }
        },
        api: {
          baseUrl: 'https://jsonplaceholder.typicode.com',
          endpoints: {
            posts: '/posts',
            users: '/users',
            comments: '/comments',
            albums: '/albums'
          }
        },
        mobile: {
          devices: ['iPhone 12', 'Pixel 5', 'Galaxy S21']
        }
      };

      // Save test data
      TestUtils.saveTestData(testData, 'default');
    }

    await use(testData);
  },

  // Authenticated page fixture
  authenticatedPage: async ({ page, loginPage, testData }, use) => {
    // Login as admin user
    const adminUser = testData.users.find((user: any) => user.role === 'admin');
    if (adminUser) {
      await loginPage.goto();
      await loginPage.login(adminUser.email, adminUser.password);
    }
    
    await use(page);
  },

  // API context fixture
  apiContext: async ({ request }, use) => {
    await use(request);
  },

  // Mobile page fixture
  mobilePage: async ({ browser }, use) => {
    // Create mobile context
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 }, // iPhone 12 dimensions
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });

    const mobilePage = await mobileContext.newPage();
    await use(mobilePage);

    await mobileContext.close();
  }
});

/**
 * Global setup function
 */
export async function globalSetup() {
  console.log('🚀 Starting global test setup...');

  // Create necessary directories
  const dirs = ['screenshots', 'test-results', 'test-data', 'reports'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Load and validate environment variables
  const requiredEnvVars = ['BASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0 && !process.env.BASE_URL?.includes('localhost')) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Generate test data if needed
  const testData = {
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'test'
  };

  TestUtils.saveTestData(testData, 'setup-info');
  console.log('✅ Global setup completed');
}

/**
 * Global teardown function
 */
export async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');

  // Clean up screenshots if not in debug mode
  if (process.env.CLEANUP_SCREENSHOTS !== 'false') {
    TestUtils.cleanupTestFiles(['screenshots/*.png']);
  }

  // Create final test report
  const report = {
    timestamp: new Date().toISOString(),
    summary: 'Test suite execution completed',
    nextSteps: 'Review test results and reports'
  };

  TestUtils.saveTestData(report, 'final-report');
  console.log('✅ Global teardown completed');
}

/**
 * Test data management functions
 */
export class TestDataManager {
  private static testDataCache: Map<string, any> = new Map();

  /**
   * Get test user by role
   */
  static getTestUser(testData: any, role: string = 'user') {
    return testData.users.find((user: any) => user.role === role);
  }

  /**
   * Get random product
   */
  static getRandomProduct(testData: any) {
    const products = testData.products;
    return products[Math.floor(Math.random() * products.length)];
  }

  /**
   * Generate unique test data
   */
  static generateUniqueData(prefix: string = 'test'): any {
    const timestamp = Date.now();
    return {
      email: `${prefix}_${timestamp}@example.com`,
      username: `${prefix}_${timestamp}`,
      orderNumber: `ORD-${timestamp}`,
      invoiceNumber: `INV-${timestamp}`
    };
  }

  /**
   * Load test data from file
   */
  static loadTestData<T>(fileName: string): T | null {
    return TestUtils.loadTestData<T>(fileName);
  }

  /**
   * Save test data to file
   */
  static saveTestData(data: any, fileName: string): void {
    TestUtils.saveTestData(data, fileName);
  }

  /**
   * Cache test data
   */
  static cacheData(key: string, data: any): void {
    this.testDataCache.set(key, data);
  }

  /**
   * Get cached test data
   */
  static getCachedData(key: string): any {
    return this.testDataCache.get(key);
  }

  /**
   * Clear test data cache
   */
  static clearCache(): void {
    this.testDataCache.clear();
  }
}

/**
 * Page context manager
 */
export class PageContextManager {
  private static contexts: Map<string, BrowserContext> = new Map();

  /**
   * Create a new page context
   */
  static async createContext(browser: Browser, name: string, options?: any): Promise<BrowserContext> {
    const context = await browser.newContext(options);
    this.contexts.set(name, context);
    return context;
  }

  /**
   * Get page context by name
   */
  static getContext(name: string): BrowserContext | undefined {
    return this.contexts.get(name);
  }

  /**
   * Close all contexts
   */
  static async closeAllContexts(): Promise<void> {
    const closePromises = Array.from(this.contexts.values()).map(context => context.close());
    await Promise.all(closePromises);
    this.contexts.clear();
  }

  /**
   * Close specific context
   */
  static async closeContext(name: string): Promise<void> {
    const context = this.contexts.get(name);
    if (context) {
      await context.close();
      this.contexts.delete(name);
    }
  }
}

/**
 * Common test assertions
 */
export class TestAssertions {
  /**
   * Assert element is visible
   */
  static async assertElementVisible(page: Page, selector: string, timeout?: number): Promise<void> {
    await expect(page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Assert element is not visible
   */
  static async assertElementNotVisible(page: Page, selector: string, timeout?: number): Promise<void> {
    await expect(page.locator(selector)).toBeHidden({ timeout });
  }

  /**
   * Assert element contains text
   */
  static async assertElementContainsText(page: Page, selector: string, text: string): Promise<void> {
    await expect(page.locator(selector)).toContainText(text);
  }

  /**
   * Assert element has exact text
   */
  static async assertElementHasText(page: Page, selector: string, text: string): Promise<void> {
    await expect(page.locator(selector)).toHaveText(text);
  }

  /**
   * Assert URL contains path
   */
  static async assertUrlContains(page: Page, path: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(`.*${path}.*`));
  }

  /**
   * Assert page title
   */
  static async assertPageTitle(page: Page, title: string): Promise<void> {
    await expect(page).toHaveTitle(title);
  }

  /**
   * Assert form field value
   */
  static async assertFormFieldValue(page: Page, selector: string, value: string): Promise<void> {
    await expect(page.locator(selector)).toHaveValue(value);
  }

  /**
   * Assert checkbox is checked
   */
  static async assertCheckboxChecked(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).toBeChecked();
  }

  /**
   * Assert checkbox is not checked
   */
  static async assertCheckboxNotChecked(page: Page, selector: string): Promise<void> {
    await expect(page.locator(selector)).not.toBeChecked();
  }
}

export { expect } from '@playwright/test';
