import { test, expect } from '@playwright/test';
import { HomePage, LoginPage, DashboardPage, ProductsPage } from '../pages/example-pages';

test.describe('Web Testing Suite', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    productsPage = new ProductsPage(page);
  });

  test.describe('Home Page Tests', () => {
    test('should display home page correctly', async ({ page }) => {
      await homePage.navigate();
      
      // Check page loaded
      await expect(page).toHaveTitle(/Home/);
      expect(await homePage.isPageLoaded()).toBe(true);
    });

    test('should navigate to login page', async ({ page }) => {
      await homePage.navigate();
      await homePage.clickLogin();
      
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should perform search', async ({ page }) => {
      await homePage.navigate();
      await homePage.search('test product');
      
      await expect(page).toHaveURL(/.*\/search.*test\+product/);
    });

    test('should display navigation menu items', async ({ page }) => {
      await homePage.navigate();
      const menuItems = await homePage.getNavigationItems();
      
      expect(menuItems).toContain('Home');
      expect(menuItems).toContain('Products');
      expect(menuItems).toContain('About');
    });
  });

  test.describe('Login Page Tests', () => {
    test('should login with valid credentials', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login('test@example.com', 'password123');
      
      // Check if redirected to dashboard or login was successful
      expect(await loginPage.isLoginSuccessful()).toBe(true);
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login('invalid@example.com', 'wrongpassword');
      
      expect(await loginPage.isErrorDisplayed()).toBe(true);
      expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
    });

    test('should validate required fields', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login('', '');
      
      // Check for validation errors
      await expect(page.locator('[data-testid="email-input"]:invalid')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"]:invalid')).toBeVisible();
    });
  });

  test.describe('Dashboard Tests', () => {
    test('should display dashboard with user data', async ({ page }) => {
      // First login
      await loginPage.navigate();
      await loginPage.login('test@example.com', 'password123');
      
      // Navigate to dashboard
      await dashboardPage.navigate();
      
      // Check dashboard elements
      expect(await dashboardPage.isElementVisible('[data-testid="user-menu"]')).toBe(true);
      expect(await dashboardPage.isElementVisible('[data-testid="stats-cards"]')).toBe(true);
    });

    test('should display user menu options', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login('test@example.com', 'password123');
      await dashboardPage.navigate();
      
      const menuItems = await dashboardPage.getUserMenuItems();
      expect(menuItems).toContain('Profile');
      expect(menuItems).toContain('Settings');
      expect(menuItems).toContain('Logout');
    });

    test('should display stats cards', async ({ page }) => {
      await loginPage.navigate();
      await loginPage.login('test@example.com', 'password123');
      await dashboardPage.navigate();
      
      const stats = await dashboardPage.getStatsData();
      expect(Object.keys(stats).length).toBeGreaterThan(0);
    });
  });

  test.describe('Products Page Tests', () => {
    test('should display products grid', async ({ page }) => {
      await productsPage.navigate();
      
      const products = await productsPage.getProducts();
      expect(products.length).toBeGreaterThan(0);
      
      // Check first product structure
      const firstProduct = products[0];
      expect(firstProduct.name).toBeTruthy();
      expect(firstProduct.price).toBeTruthy();
    });

    test('should filter products by category', async ({ page }) => {
      await productsPage.navigate();
      await productsPage.filterByCategory('Electronics');
      
      // Products should be filtered
      await expect(page).toHaveURL(/.*category=Electronics/);
    });

    test('should search for products', async ({ page }) => {
      await productsPage.navigate();
      await productsPage.searchProducts('laptop');
      
      await expect(page).toHaveURL(/.*search=laptop/);
    });

    test('should sort products', async ({ page }) => {
      await productsPage.navigate();
      await productsPage.sortProducts('price-low-high');
      
      const products = await productsPage.getProducts();
      // Verify sorting (prices should be in ascending order)
      const prices = products.map(p => parseFloat(p.price?.replace(/[$,]/g, '') || '0'));
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });
});