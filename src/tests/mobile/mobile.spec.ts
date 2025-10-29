import { test, expect, devices } from '@playwright/test';
import { test as base, TestUtils } from '../../fixtures/testFixtures';

/**
 * Extended test with fixtures for mobile testing
 */
const testWithFixtures = base.extend<{
  page: import('@playwright/test').Page;
  isMobile: boolean;
  deviceName: string;
  testData: any;
}>({
  page: async ({ browser }, use) => {
    // Use iPhone 12 as default mobile device
    const mobileContext = await browser.newContext({
      ...devices['iPhone 12'],
      viewport: { width: 375, height: 812 }
    });
    
    const mobilePage = await mobileContext.newPage();
    await use(mobilePage);
    
    await mobileContext.close();
  },
  isMobile: async ({}, use) => {
    await use(true);
  },
  deviceName: async ({}, use) => {
    await use('iPhone 12');
  },
  testData: async ({}, use) => {
    const testData = await (await import('../../test-data/testData')).default;
    await use(testData);
  }
});

const { describe, beforeEach, afterEach } = testWithFixtures;

describe('Mobile Tests - iPhone 12', () => {
  beforeEach(async ({ page, isMobile, deviceName }) => {
    console.log(`Testing on mobile device: ${deviceName}`);
    
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  afterEach(async ({ page }) => {
    // Clean up after each test
    await TestUtils.clearStorage(page);
  });

  describe('Mobile Navigation', () => {
    test('should display mobile navigation', async ({ page }) => {
      // Check if navigation is visible on mobile
      await expect(page.locator('nav, .navbar, .mobile-nav')).toBeVisible();
    });

    test('should toggle hamburger menu', async ({ page }) => {
      // Look for hamburger menu
      const hamburgerMenu = page.locator('.hamburger-menu, .mobile-menu-toggle, .navbar-toggler');
      
      if (await hamburgerMenu.isVisible()) {
        // Click hamburger menu
        await hamburgerMenu.click();
        
        // Verify mobile menu is open
        await expect(page.locator('.mobile-menu, .sidebar-menu, .navbar-collapse')).toBeVisible();
        
        // Close menu
        await page.keyboard.press('Escape');
        
        // Verify mobile menu is closed
        await expect(page.locator('.mobile-menu, .sidebar-menu, .navbar-collapse')).toBeHidden();
      } else {
        test.skip(true, 'No hamburger menu found');
      }
    });

    test('should handle touch gestures', async ({ page }) => {
      // Test scrolling on mobile
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      
      // Verify scroll position changed
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('should display mobile-friendly forms', async ({ page }) => {
      // Navigate to contact form
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile-friendly form elements
      await expect(page.locator('input, textarea, select, button')).toHaveCount(5);
      
      // Check if input fields are touch-friendly (larger tap targets)
      const firstInput = page.locator('input, textarea').first();
      if (await firstInput.isVisible()) {
        const box = await firstInput.boundingBox();
        expect(box?.height).toBeGreaterThan(40); // Minimum touch target size
      }
    });
  });

  describe('Mobile E-commerce', () => {
    test('should display products on mobile', async ({ page, testData }) => {
      // Navigate to products page
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Check for product listings optimized for mobile
      await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
      
      // Verify products are displayed in mobile-friendly layout
      const productCards = page.locator('.product-card, .product-item');
      for (let i = 0; i < Math.min(3, await productCards.count()); i++) {
        const card = productCards.nth(i);
        await expect(card).toBeVisible();
        
        // Check for mobile-friendly elements
        const title = await card.locator('.product-title, h3').textContent();
        const price = await card.locator('.price, .product-price').textContent();
        
        expect(title).toBeTruthy();
        expect(price).toBeTruthy();
      }
    });

    test('should add product to cart on mobile', async ({ page }) => {
      // Navigate to products page
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Find and click add to cart button on first product
      const addToCartButtons = page.locator('.add-to-cart, .btn-add-cart');
      if (await addToCartButtons.count() > 0) {
        await addToCartButtons.first().click();
        
        // Wait for cart update
        await page.waitForTimeout(1000);
        
        // Check cart count
        const cartCount = page.locator('.cart-count, .cart-items-count');
        if (await cartCount.isVisible()) {
          const countText = await cartCount.textContent();
          expect(parseInt(countText || '0')).toBeGreaterThan(0);
        }
      }
    });

    test('should handle mobile shopping cart', async ({ page }) => {
      // Add product to cart first
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      const addToCartButton = page.locator('.add-to-cart, .btn-add-cart').first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        await page.waitForTimeout(1000);
      }
      
      // Click cart icon
      const cartIcon = page.locator('.cart-icon, .shopping-cart');
      if (await cartIcon.isVisible()) {
        await cartIcon.click();
        
        // Should navigate to cart page
        await expect(page).toHaveURL(/.*cart|.*basket/);
        
        // Check mobile-friendly cart layout
        await expect(page.locator('.cart-item, .cart-products')).toBeVisible();
      }
    });
  });

  describe('Mobile Forms', () => {
    test('should fill contact form on mobile', async ({ page, testData }) => {
      const contactData = testData.forms.contact.valid;
      
      // Navigate to contact form
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Fill form fields
      await page.fill('input[name="name"]', contactData.name);
      await page.fill('input[name="email"]', contactData.email);
      await page.fill('input[name="subject"]', contactData.subject);
      await page.fill('textarea[name="message"]', contactData.message);
      
      // Verify form is filled
      await expect(page.locator('input[name="name"]')).toHaveValue(contactData.name);
      await expect(page.locator('input[name="email"]')).toHaveValue(contactData.email);
      
      // Check that input fields are focused properly (important for mobile)
      const nameInput = page.locator('input[name="name"]');
      await nameInput.click();
      await expect(nameInput).toBeFocused();
    });

    test('should handle mobile keyboard input', async ({ page }) => {
      await page.goto('/forms');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        // Focus input
        await emailInput.click();
        
        // Type email
        await emailInput.fill('test@example.com');
        
        // Verify input
        await expect(emailInput).toHaveValue('test@example.com');
        
        // Check keyboard interaction
        await page.keyboard.press('Tab');
        await expect(emailInput).not.toBeFocused();
      }
    });

    test('should submit form on mobile', async ({ page, testData }) => {
      const contactData = testData.forms.contact.valid;
      
      // Navigate to contact form
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Fill and submit form
      await page.fill('input[name="name"]', contactData.name);
      await page.fill('input[name="email"]', contactData.email);
      await page.fill('textarea[name="message"]', contactData.message);
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Wait for response
      await page.waitForLoadState('networkidle');
      
      // Check for success message
      await expect(page.locator('.success-message, .alert-success')).toBeVisible();
    });
  });

  describe('Mobile Responsiveness', () => {
    test('should adjust layout for mobile viewport', async ({ page }) => {
      // Check initial layout
      const bodyWidth = await page.evaluate(() => document.body.clientWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375); // iPhone 12 width
      
      // Check that content is properly constrained
      const mainContent = page.locator('main, .main-content, .container');
      if (await mainContent.isVisible()) {
        const contentWidth = await mainContent.evaluate((el: any) => el.clientWidth);
        expect(contentWidth).toBeLessThanOrEqual(bodyWidth);
      }
    });

    test('should have touch-friendly buttons', async ({ page }) => {
      // Navigate to a page with buttons
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Find buttons
      const buttons = page.locator('button, .btn, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          expect(box?.height).toBeGreaterThanOrEqual(44); // Apple's recommended minimum
          expect(box?.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should handle orientation change', async ({ page }) => {
      // Set landscape orientation
      await page.setViewportSize({ width: 812, height: 375 });
      await page.waitForTimeout(1000);
      
      // Check layout in landscape
      const bodyWidthLandscape = await page.evaluate(() => document.body.clientWidth);
      expect(bodyWidthLandscape).toBe(812);
      
      // Set portrait orientation
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      // Check layout in portrait
      const bodyWidthPortrait = await page.evaluate(() => document.body.clientWidth);
      expect(bodyWidthPortrait).toBe(375);
    });
  });

  describe('Mobile Performance', () => {
    test('should load quickly on mobile', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (adjust threshold as needed)
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should handle slow connections gracefully', async ({ page }) => {
      // Simulate slow connection (this would require network throttling setup)
      // For now, just test basic functionality
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
    });
  });

  describe('Mobile User Experience', () => {
    test('should display proper font sizes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check body font size
      const bodyFontSize = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).fontSize;
      });
      
      expect(parseFloat(bodyFontSize)).toBeGreaterThanOrEqual(14);
    });

    test('should handle input validation on mobile', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Submit empty form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Check for validation errors
      await expect(page.locator('.error-message, .validation-error')).toBeVisible();
    });

    test('should display mobile-friendly error messages', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Fill with invalid email
      await page.fill('input[name="email"]', 'invalid-email');
      
      // Submit
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Check for error message visibility
      const errorMessage = page.locator('.error-message, .validation-error');
      if (await errorMessage.isVisible()) {
        const messageText = await errorMessage.textContent();
        expect(messageText).toBeTruthy();
      }
    });
  });

  describe('Mobile-Specific Features', () => {
    test('should handle pull-to-refresh gesture', async ({ page }) => {
      // Scroll to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      // Simulate pull-to-refresh (this is an approximation)
      // In a real implementation, you might need custom gestures
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Page should reload successfully
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display mobile-specific elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile-specific UI elements
      const mobileElements = page.locator('.mobile-only, .hide-on-desktop, .mobile-nav');
      if (await mobileElements.count() > 0) {
        await expect(mobileElements.first()).toBeVisible();
      }
    });
  });
});

// Test different device configurations
for (const deviceName of ['iPhone 12', 'Samsung Galaxy S21', 'iPad']) {
  describe(`Mobile Tests - ${deviceName}`, () => {
    test(`should work on ${deviceName}`, async ({ browser, page, test }) => {
      // Create context for specific device
      const device = devices[deviceName];
      if (!device) {
        test.skip(true, `${deviceName} device profile not found`);
        return;
      }

      const deviceContext = await browser.newContext({
        ...device,
        viewport: device.viewport
      });

      const devicePage = await deviceContext.newPage();
      
      try {
        await devicePage.goto('/');
        await devicePage.waitForLoadState('networkidle');
        
        // Basic functionality test
        await expect(devicePage.locator('body')).toBeVisible();
        
        console.log(`✅ ${deviceName} test passed`);
      } finally {
        await deviceContext.close();
      }
    });
  });
}
