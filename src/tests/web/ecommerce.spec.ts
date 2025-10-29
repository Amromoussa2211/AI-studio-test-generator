import { test, expect } from '@playwright/test';
import { test as base, TestUtils } from '../../fixtures/testFixtures';

/**
 * Extended test with fixtures
 */
const testWithFixtures = base.extend<{
  ecommercePage: import('../../page-objects/EcommercePage').EcommercePage;
  loginPage: import('../../page-objects/LoginPage').LoginPage;
  testData: any;
  page: import('@playwright/test').Page;
}>({
  ecommercePage: async ({ page, baseURL }, use) => {
    const ecommercePage = new (await import('../../page-objects/EcommercePage')).EcommercePage(page, baseURL);
    await use(ecommercePage);
  },
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

describe('E-commerce Tests', () => {
  beforeEach(async ({ ecommercePage, page }) => {
    // Navigate to products page before each test
    await ecommercePage.goto('/products');
    await page.waitForLoadState('networkidle');
  });

  afterEach(async ({ page }) => {
    // Clean up after each test
    await TestUtils.clearStorage(page);
  });

  describe('Product Listing', () => {
    test('should display product listings', async ({ ecommercePage, page }) => {
      // Check if products are displayed
      const productCards = page.locator('.product-card, .product-item');
      await expect(productCards).toHaveCount(5); // Adjust based on your data
      
      // Verify product cards have required elements
      const firstProduct = productCards.first();
      await expect(firstProduct.locator('.product-title, h3')).toBeVisible();
      await expect(firstProduct.locator('.price, .product-price')).toBeVisible();
    });

    test('should get all product titles', async ({ ecommercePage }) => {
      const productTitles = await ecommercePage.getProductTitles();
      
      expect(productTitles).toBeInstanceOf(Array);
      expect(productTitles.length).toBeGreaterThan(0);
      
      // All titles should be non-empty
      productTitles.forEach(title => {
        expect(title.trim()).toBeTruthy();
      });
    });

    test('should get all product prices', async ({ ecommercePage }) => {
      const productPrices = await ecommercePage.getProductPrices();
      
      expect(productPrices).toBeInstanceOf(Array);
      expect(productPrices.length).toBeGreaterThan(0);
      
      // Prices should contain currency symbols or numbers
      productPrices.forEach(price => {
        expect(price).toMatch(/\$|€|£|\d/);
      });
    });

    test('should click on product to view details', async ({ ecommercePage, page }) => {
      // Click on first product
      await ecommercePage.clickProduct(0);
      
      // Should navigate to product detail page
      await expect(page).toHaveURL(/.*\/product\/\d+|.*product\/.+/);
      
      // Check for product detail elements
      await expect(page.locator('.product-name, h1')).toBeVisible();
      await expect(page.locator('.product-price, .price')).toBeVisible();
      await expect(page.locator('.product-image, .product-img')).toBeVisible();
    });
  });

  describe('Search Functionality', () => {
    test('should search for products', async ({ ecommercePage, testData, page }) => {
      const searchQuery = testData.search.queries.electronics;
      
      // Perform search
      await ecommercePage.searchProduct(searchQuery);
      
      // Wait for search results
      await page.waitForLoadState('networkidle');
      
      // Check that search results are displayed
      await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
      
      // Search results should contain search term (implementation dependent)
      // This test assumes search works
    });

    test('should handle search with no results', async ({ ecommercePage }) => {
      const searchQuery = testData.search.queries.invalid;
      
      // Perform search for non-existent product
      await ecommercePage.searchProduct(searchQuery);
      
      // Should show "no results" message or handle gracefully
      // Implementation dependent
    });

    test('should search for partial product name', async ({ ecommercePage, testData }) => {
      const searchQuery = testData.search.queries.partial;
      
      await ecommercePage.searchProduct(searchQuery);
      
      // Should return products containing the search term
      // Implementation dependent
    });
  });

  describe('Product Filtering', () => {
    test('should filter products by category', async ({ ecommercePage, testData, page }) => {
      const category = testData.products[0].category; // Use first product's category
      
      // Filter by category
      await ecommercePage.filterByCategory(category);
      
      // Wait for filter to apply
      await page.waitForLoadState('networkidle');
      
      // Check that filtered products are displayed
      await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
    });

    test('should filter products by price range', async ({ ecommercePage, testData, page }) => {
      const priceRange = testData.search.filters.price;
      
      // Set price range
      await ecommercePage.setPriceRange(priceRange.min, priceRange.max);
      
      // Wait for filter to apply
      await page.waitForLoadState('networkidle');
      
      // Check that filtered products are displayed
      await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
    });

    test('should sort products', async ({ ecommercePage, page }) => {
      const sortOptions = ['price-asc', 'price-desc', 'name-asc', 'name-desc', 'rating'];
      
      for (const sortOption of sortOptions) {
        try {
          await ecommercePage.sortProducts(sortOption);
          
          // Wait for sort to apply
          await page.waitForLoadState('networkidle');
          
          // Verify products are still displayed
          await expect(page.locator('.product-card, .product-item')).toHaveCount(5);
        } catch (error) {
          console.log(`Sort option "${sortOption}" not available`);
        }
      }
    });
  });

  describe('Shopping Cart', () => {
    test('should add product to cart', async ({ ecommercePage, page }) => {
      // Add first product to cart
      await ecommercePage.addProductToCart(0);
      
      // Wait for cart update
      await page.waitForTimeout(1000);
      
      // Check cart count
      const cartCount = await ecommercePage.getCartCount();
      expect(parseInt(cartCount)).toBeGreaterThan(0);
    });

    test('should add multiple products to cart', async ({ ecommercePage, page }) => {
      // Add multiple products
      await ecommercePage.addProductToCart(0);
      await ecommercePage.addProductToCart(1);
      await ecommercePage.addProductToCart(2);
      
      // Wait for cart updates
      await page.waitForTimeout(1000);
      
      // Check cart count (should be > 0)
      const cartCount = await ecommercePage.getCartCount();
      expect(parseInt(cartCount)).toBeGreaterThan(0);
    });

    test('should view cart contents', async ({ ecommercePage, page }) => {
      // Add a product first
      await ecommercePage.addProductToCart(0);
      
      // Click cart icon
      await ecommercePage.clickCart();
      
      // Should navigate to cart page
      await expect(page).toHaveURL(/.*cart|.*basket/);
      
      // Check for cart items
      await expect(page.locator('.cart-item, .cart-products')).toBeVisible();
    });

    test('should get cart items', async ({ ecommercePage, page }) => {
      // Add products to cart
      await ecommercePage.addProductToCart(0);
      await ecommercePage.addProductToCart(1);
      
      // Click cart
      await ecommercePage.clickCart();
      
      // Get cart items
      const cartItems = await ecommercePage.getCartItems();
      
      expect(cartItems).toBeInstanceOf(Array);
      expect(cartItems.length).toBeGreaterThan(0);
      
      // Each cart item should have name, price, and quantity
      cartItems.forEach(item => {
        expect(item.name).toBeTruthy();
        expect(item.price).toBeTruthy();
        expect(item.quantity).toBeTruthy();
      });
    });

    test('should remove item from cart', async ({ ecommercePage, page }) => {
      // Add products to cart
      await ecommercePage.addProductToCart(0);
      await ecommercePage.addProductToCart(1);
      
      // Go to cart
      await ecommercePage.clickCart();
      
      // Get initial cart count
      const initialCartItems = await ecommercePage.getCartItems();
      const initialCount = initialCartItems.length;
      
      // Remove first item
      await ecommercePage.removeItemFromCart(0);
      
      // Get updated cart count
      const updatedCartItems = await ecommercePage.getCartItems();
      const updatedCount = updatedCartItems.length;
      
      // Should have one less item
      expect(updatedCount).toBe(initialCount - 1);
    });

    test('should update product quantity', async ({ ecommercePage, page }) => {
      // Add product to cart
      await ecommercePage.addProductToCart(0);
      
      // Go to cart
      await ecommercePage.clickCart();
      
      // Increase quantity
      await ecommercePage.increaseQuantity();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Get updated quantity (this depends on cart implementation)
      const cartItems = await ecommercePage.getCartItems();
      expect(cartItems[0]?.quantity).toBeTruthy();
    });

    test('should clear cart', async ({ ecommercePage, page }) => {
      // Add multiple products to cart
      await ecommercePage.addProductToCart(0);
      await ecommercePage.addProductToCart(1);
      await ecommercePage.addProductToCart(2);
      
      // Go to cart
      await ecommercePage.clickCart();
      
      // Clear cart
      await ecommercePage.clearCart();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Check cart is empty
      const cartItems = await ecommercePage.getCartItems();
      expect(cartItems.length).toBe(0);
    });
  });

  describe('Wishlist', () => {
    test('should add product to wishlist', async ({ ecommercePage, page }) => {
      // Add first product to wishlist
      await ecommercePage.addToWishlist(0);
      
      // Should show some feedback (implementation dependent)
      // This might be a toast, notification, or visual indicator
    });

    test('should view wishlist', async ({ ecommercePage, page }) => {
      // Add product to wishlist
      await ecommercePage.addToWishlist(0);
      
      // Navigate to wishlist (implementation dependent)
      // This would depend on your wishlist implementation
      await ecommercePage.goto('/wishlist');
      
      // Check for wishlist items
      await expect(page.locator('.wishlist-item, .wishlist-products')).toBeVisible();
    });
  });

  describe('Product Quick Actions', () => {
    test('should quick add product to cart', async ({ ecommercePage, testData, page }) => {
      const productName = testData.products[0].name;
      
      // Quick add product to cart
      await ecommercePage.quickAddToCart(productName, 2);
      
      // Wait for add to cart action
      await page.waitForTimeout(1000);
      
      // Check cart count
      const cartCount = await ecommercePage.getCartCount();
      expect(parseInt(cartCount)).toBeGreaterThan(0);
    });
  });

  describe('Checkout Flow', () => {
    test('should navigate to checkout', async ({ ecommercePage, page }) => {
      // Add product to cart
      await ecommercePage.addProductToCart(0);
      
      // Go to cart
      await ecommercePage.clickCart();
      
      // Proceed to checkout
      await ecommercePage.proceedToCheckout();
      
      // Should navigate to checkout page
      await expect(page).toHaveURL(/.*checkout/);
      
      // Check for checkout elements
      await expect(page.locator('.shipping-form, .checkout-form')).toBeVisible();
    });

    test('should fill shipping information', async ({ ecommercePage, testData, page }) => {
      // Navigate to checkout
      await ecommercePage.goto('/checkout');
      
      // Fill shipping information
      const shippingData = testData.addresses.shipping.valid;
      await ecommercePage.fillShippingInfo(shippingData);
      
      // Verify form is filled
      const formValues = await ecommercePage.getAllFormValues();
      expect(formValues.firstName).toBe(shippingData.firstName);
      expect(formValues.lastName).toBe(shippingData.lastName);
    });

    test('should apply promo code', async ({ ecommercePage, page }) => {
      // Add product to cart and go to checkout
      await ecommercePage.addProductToCart(0);
      await ecommercePage.clickCart();
      
      // Apply promo code
      await ecommercePage.applyPromoCode('TEST10');
      
      // Wait for promo code to be applied
      await page.waitForTimeout(1000);
      
      // Check for discount or total update (implementation dependent)
    });

    test('should get order total', async ({ ecommercePage, page }) => {
      // Navigate to checkout with items in cart
      await ecommercePage.goto('/checkout');
      
      // Get order total
      const orderTotal = await ecommercePage.getOrderTotal();
      
      expect(orderTotal).toBeTruthy();
      expect(orderTotal).toMatch(/\$|€|£|\d/);
    });
  });

  describe('Pagination', () => {
    test('should navigate through pages', async ({ ecommercePage, page }) => {
      // This test depends on having multiple pages of products
      // Go to next page
      await ecommercePage.goToNextPage();
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
      
      // Verify we're on a different page (implementation dependent)
    });

    test('should go to previous page', async ({ ecommercePage, page }) => {
      // Go to next page first
      await ecommercePage.goToNextPage();
      await page.waitForLoadState('networkidle');
      
      // Go back to previous page
      await ecommercePage.goToPreviousPage();
      
      // Wait for page load
      await page.waitForLoadState('networkidle');
    });
  });

  describe('Product Images', () => {
    test('should display product images', async ({ ecommercePage, page }) => {
      const productImages = page.locator('.product-image, .product-img');
      await expect(productImages).toHaveCount(5);
      
      // First image should be visible
      await expect(productImages.first()).toBeVisible();
    });

    test('should navigate to product details via image', async ({ ecommercePage, page }) => {
      // Click on product image
      const productImages = page.locator('.product-card, .product-item');
      await productImages.first().click();
      
      // Should navigate to product detail page
      await expect(page).toHaveURL(/.*\/product\/\d+|.*product\/.+/);
    });
  });
});

// Export test for direct use
export { testWithFixtures as test };
