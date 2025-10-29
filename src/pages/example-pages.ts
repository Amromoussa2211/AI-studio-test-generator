import { Page } from '@playwright/test';
import { BasePage, FormElements, TableElements } from './base-page';

/**
 * Example Home Page Object
 */
export class HomePage extends BasePage {
  // Selectors
  private readonly searchBox = '[data-testid="search-box"]';
  private readonly navigationMenu = '[data-testid="navigation-menu"]';
  private readonly loginButton = '[data-testid="login-button"]';
  private readonly signupButton = '[data-testid="signup-button"]';
  private readonly heroSection = '[data-testid="hero-section"]';
  private readonly featuresSection = '[data-testid="features-section"]';

  constructor(page: Page) {
    super(page, '/');
  }

  /**
   * Navigate to home page
   */
  async navigate(): Promise<void> {
    await super.navigate();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search for a term
   */
  async search(term: string): Promise<void> {
    await this.page.locator(this.searchBox).fill(term);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.page.locator(this.loginButton).click();
  }

  /**
   * Click signup button
   */
  async clickSignup(): Promise<void> {
    await this.page.locator(this.signupButton).click();
  }

  /**
   * Check if page loaded successfully
   */
  async isPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.heroSection);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getText('h1');
  }

  /**
   * Get navigation items
   */
  async getNavigationItems(): Promise<string[]> {
    return await this.page.locator(this.navigationMenu + ' a').allTextContents();
  }
}

/**
 * Example Login Page Object
 */
export class LoginPage extends BasePage {
  private readonly emailInput = '[data-testid="email-input"]';
  private readonly passwordInput = '[data-testid="password-input"]';
  private readonly loginButton = '[data-testid="login-submit"]';
  private readonly errorMessage = '[data-testid="error-message"]';
  private readonly forgotPasswordLink = '[data-testid="forgot-password"]';

  constructor(page: Page) {
    super(page, '/login');
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.page.locator(this.emailInput).fill(email);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if login was successful
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Check if redirected to dashboard or if success message appears
    return await this.isElementVisible('[data-testid="dashboard"]') || 
           await this.isElementVisible('[data-testid="success-message"]');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }
}

/**
 * Example Dashboard Page Object
 */
export class DashboardPage extends BasePage {
  private readonly userMenu = '[data-testid="user-menu"]';
  private readonly sidebar = '[data-testid="sidebar"]';
  private readonly mainContent = '[data-testid="main-content"]';
  private readonly statsCards = '[data-testid="stats-cards"]';
  private readonly recentActivity = '[data-testid="recent-activity"]';

  constructor(page: Page) {
    super(page, '/dashboard');
  }

  /**
   * Get user menu items
   */
  async getUserMenuItems(): Promise<string[]> {
    await this.page.locator(this.userMenu).click();
    return await this.page.locator('[data-testid="user-menu-dropdown"] li').allTextContents();
  }

  /**
   * Click sidebar menu item
   */
  async clickSidebarMenuItem(itemName: string): Promise<void> {
    await this.page.locator(`${this.sidebar} [data-testid="menu-${itemName.toLowerCase()}"]`).click();
  }

  /**
   * Get stats data
   */
  async getStatsData(): Promise<Record<string, string>> {
    const stats: Record<string, string> = {};
    const cards = await this.page.locator(this.statsCards + ' .stat-card').all();
    
    for (const card of cards) {
      const title = await card.locator('.stat-title').textContent();
      const value = await card.locator('.stat-value').textContent();
      if (title && value) {
        stats[title.trim()] = value.trim();
      }
    }
    
    return stats;
  }

  /**
   * Get recent activity items
   */
  async getRecentActivity(): Promise<string[]> {
    return await this.page.locator(this.recentActivity + ' li').allTextContents();
  }
}

/**
 * Example Products Page Object
 */
export class ProductsPage extends BasePage {
  private readonly productGrid = '[data-testid="product-grid"]';
  private readonly productCard = '[data-testid="product-card"]';
  private readonly filterButton = '[data-testid="filter-button"]';
  private readonly sortDropdown = '[data-testid="sort-dropdown"]';
  private readonly searchInput = '[data-testid="product-search"]';

  constructor(page: Page) {
    super(page, '/products');
  }

  /**
   * Get all products
   */
  async getProducts(): Promise<any[]> {
    const products: any[] = [];
    const cards = await this.page.locator(this.productCard).all();
    
    for (const card of cards) {
      const product = {
        name: await card.locator('.product-name').textContent(),
        price: await card.locator('.product-price').textContent(),
        rating: await card.locator('.product-rating').textContent(),
        image: await card.locator('.product-image').getAttribute('src')
      };
      products.push(product);
    }
    
    return products;
  }

  /**
   * Click on a product
   */
  async clickProduct(index: number): Promise<void> {
    await this.page.locator(`${this.productCard}:nth-child(${index + 1})`).click();
  }

  /**
   * Filter products by category
   */
  async filterByCategory(category: string): Promise<void> {
    await this.page.locator(this.filterButton).click();
    await this.page.locator(`[data-value="${category}"]`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort products
   */
  async sortProducts(sortOption: string): Promise<void> {
    await this.page.locator(this.sortDropdown).selectOption(sortOption);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<void> {
    await this.page.locator(this.searchInput).fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }
}