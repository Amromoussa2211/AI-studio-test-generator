import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for e-commerce functionality
 */
export class EcommercePage extends BasePage {
  private selectors = {
    productCards: '.product-card, .product-item',
    productTitle: '.product-title, h3',
    productPrice: '.price, .product-price',
    addToCartButton: '.add-to-cart, .btn-add-cart',
    cartIcon: '.cart-icon, .shopping-cart',
    cartCount: '.cart-count, .cart-items-count',
    cartItems: '.cart-item',
    checkoutButton: '.checkout, .btn-checkout',
    productSearch: '.search-input, #search',
    categoryFilter: '.category-filter, .filter-category',
    priceRange: '.price-range, .filter-price',
    sortDropdown: '.sort-dropdown, .sort-by',
    pagination: '.pagination, .page-nav',
    wishlistButton: '.wishlist, .add-to-wishlist',
    productImage: '.product-image, .product-img',
    productDetails: '.product-details',
    quantityInput: '.quantity-input, input[type="number"]',
    removeFromCart: '.remove-from-cart, .cart-remove',
    continueShopping: '.continue-shopping, .btn-continue',
    shippingForm: '.shipping-form',
    paymentForm: '.payment-form',
    orderSummary: '.order-summary'
  };

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
  }

  /**
   * Search for a product
   */
  async searchProduct(productName: string): Promise<void> {
    await this.fillInput(this.selectors.productSearch, productName);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  /**
   * Get all product titles
   */
  async getProductTitles(): Promise<string[]> {
    const titles = await this.page.locator(this.selectors.productTitle).allTextContents();
    return titles.map(title => title.trim());
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<string[]> {
    const prices = await this.page.locator(this.selectors.productPrice).allTextContents();
    return prices.map(price => price.trim());
  }

  /**
   * Click on a product by index
   */
  async clickProduct(index: number): Promise<void> {
    await this.page.locator(this.selectors.productCards).nth(index).click();
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(index: number): Promise<void> {
    const addToCartButtons = this.page.locator(this.selectors.addToCartButton);
    await addToCartButtons.nth(index).click();
  }

  /**
   * Add specific product to cart
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const productCard = this.page.locator(this.selectors.productCards).filter({ hasText: productName });
    const addButton = productCard.locator(this.selectors.addToCartButton);
    await addButton.click();
  }

  /**
   * Get cart item count
   */
  async getCartCount(): Promise<string> {
    const countElement = this.page.locator(this.selectors.cartCount);
    if (await countElement.isVisible()) {
      return await countElement.textContent() || '0';
    }
    return '0';
  }

  /**
   * Click cart icon
   */
  async clickCart(): Promise<void> {
    await this.clickElement(this.selectors.cartIcon);
    await this.waitForPageLoad();
  }

  /**
   * Filter by category
   */
  async filterByCategory(category: string): Promise<void> {
    await this.clickElement(`${this.selectors.categoryFilter}[data-category="${category}"]`);
    await this.waitForPageLoad();
  }

  /**
   * Set price range
   */
  async setPriceRange(min: number, max: number): Promise<void> {
    await this.page.fill('input[name="minPrice"]', min.toString());
    await this.page.fill('input[name="maxPrice"]', max.toString());
    await this.page.click('.apply-price-filter');
    await this.waitForPageLoad();
  }

  /**
   * Sort products
   */
  async sortProducts(sortOption: string): Promise<void> {
    await this.page.selectOption(this.selectors.sortDropdown, sortOption);
    await this.waitForPageLoad();
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productIndex: number): Promise<void> {
    const wishlistButtons = this.page.locator(this.selectors.wishlistButton);
    await wishlistButtons.nth(productIndex).click();
  }

  /**
   * Go to product details
   */
  async goToProductDetails(index: number): Promise<void> {
    const productImages = this.page.locator(this.selectors.productCards);
    await productImages.nth(index).click();
  }

  /**
   * Set product quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.page.fill(this.selectors.quantityInput, quantity.toString());
  }

  /**
   * Increase quantity
   */
  async increaseQuantity(): Promise<void> {
    await this.page.click('.quantity-increase, .btn-plus');
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity(): Promise<void> {
    await this.page.click('.quantity-decrease, .btn-minus');
  }

  /**
   * Remove item from cart
   */
  async removeItemFromCart(index: number): Promise<void> {
    const removeButtons = this.page.locator(this.selectors.removeFromCart);
    await removeButtons.nth(index).click();
    await this.waitForPageLoad();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.selectors.checkoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.clickElement(this.selectors.continueShopping);
    await this.waitForPageLoad();
  }

  /**
   * Fill shipping information
   */
  async fillShippingInfo(shippingData: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  }): Promise<void> {
    await this.fillMultipleFields({
      'input[name="firstName"]': shippingData.firstName,
      'input[name="lastName"]': shippingData.lastName,
      'input[name="address"]': shippingData.address,
      'input[name="city"]': shippingData.city,
      'input[name="zipCode"]': shippingData.zipCode,
      'select[name="country"]': shippingData.country
    });
  }

  /**
   * Fill payment information
   */
  async fillPaymentInfo(paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }): Promise<void> {
    await this.fillMultipleFields({
      'input[name="cardNumber"]': paymentData.cardNumber,
      'input[name="expiryDate"]': paymentData.expiryDate,
      'input[name="cvv"]': paymentData.cvv,
      'input[name="cardholderName"]': paymentData.cardholderName
    });
  }

  /**
   * Get order total
   */
  async getOrderTotal(): Promise<string> {
    const totalElement = this.page.locator('.order-total, .total-price, .grand-total');
    if (await totalElement.isVisible()) {
      return await totalElement.textContent() || '';
    }
    return '';
  }

  /**
   * Get cart items
   */
  async getCartItems(): Promise<Array<{ name: string; price: string; quantity: string }>> {
    const items = await this.page.locator(this.selectors.cartItems).all();
    const cartItems = [];
    
    for (const item of items) {
      const name = await item.locator('.item-name, .product-name').textContent();
      const price = await item.locator('.item-price, .price').textContent();
      const quantity = await item.locator('.quantity, .item-quantity').textContent();
      
      if (name && price && quantity) {
        cartItems.push({
          name: name.trim(),
          price: price.trim(),
          quantity: quantity.trim()
        });
      }
    }
    
    return cartItems;
  }

  /**
   * Apply promo code
   */
  async applyPromoCode(code: string): Promise<void> {
    await this.page.fill('.promo-code-input, input[name="promoCode"]', code);
    await this.page.click('.apply-promo, .btn-apply');
    await this.waitForPageLoad();
  }

  /**
   * Click next page
   */
  async goToNextPage(): Promise<void> {
    await this.page.click('.next-page, .page-next, [aria-label="Next"]');
    await this.waitForPageLoad();
  }

  /**
   * Click previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.page.click('.prev-page, .page-prev, [aria-label="Previous"]');
    await this.waitForPageLoad();
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const removeButtons = await this.page.locator(this.selectors.removeFromCart).count();
    for (let i = 0; i < removeButtons; i++) {
      await this.removeItemFromCart(0);
    }
  }

  /**
   * Quick add product to cart from search results
   */
  async quickAddToCart(productName: string, quantity: number = 1): Promise<void> {
    const productCard = this.page.locator(this.selectors.productCards).filter({ hasText: productName });
    await productCard.locator(this.selectors.addToCartButton).click();
    
    if (quantity > 1) {
      await this.page.locator(this.selectors.quantityInput).fill(quantity.toString());
    }
  }
}
