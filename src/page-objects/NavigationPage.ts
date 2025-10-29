import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for navigation elements
 */
export class NavigationPage extends BasePage {
  private selectors = {
    menuItems: 'nav a, nav button, .menu-item',
    primaryNav: 'nav.primary-nav',
    secondaryNav: 'nav.secondary-nav',
    breadcrumb: '.breadcrumb',
    breadcrumbItems: '.breadcrumb-item',
    sidebarMenu: '.sidebar-menu',
    dropdownMenu: '.dropdown-menu',
    dropdownToggle: '.dropdown-toggle',
    hamburgerMenu: '.hamburger-menu',
    navLinks: 'nav a',
    logo: 'nav .logo, header .logo'
  };

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
  }

  /**
   * Click on a menu item by text
   */
  async clickMenuItem(text: string): Promise<void> {
    await this.page.getByText(text).click();
  }

  /**
   * Click on a link by href
   */
  async clickLinkByHref(href: string): Promise<void> {
    await this.page.click(`a[href="${href}"]`);
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string): Promise<void> {
    await this.goto(path);
  }

  /**
   * Get all menu items text
   */
  async getMenuItems(): Promise<string[]> {
    const menuItems = await this.page.locator(this.selectors.menuItems).allTextContents();
    return menuItems.filter(item => item.trim() !== '');
  }

  /**
   * Check if menu item exists
   */
  async isMenuItemVisible(text: string): Promise<boolean> {
    return await this.page.getByText(text).isVisible();
  }

  /**
   * Toggle dropdown menu
   */
  async toggleDropdown(selector: string): Promise<void> {
    await this.clickElement(selector);
  }

  /**
   * Select dropdown option
   */
  async selectDropdownOption(dropdownSelector: string, optionText: string): Promise<void> {
    await this.clickElement(dropdownSelector);
    await this.page.getByText(optionText).click();
  }

  /**
   * Open hamburger menu (mobile)
   */
  async openHamburgerMenu(): Promise<void> {
    if (await this.isElementVisible(this.selectors.hamburgerMenu)) {
      await this.clickElement(this.selectors.hamburgerMenu);
    }
  }

  /**
   * Close hamburger menu (mobile)
   */
  async closeHamburgerMenu(): Promise<void> {
    // Usually clicking outside or ESC key closes the menu
    await this.page.keyboard.press('Escape');
  }

  /**
   * Navigate through breadcrumbs
   */
  async getBreadcrumbPath(): Promise<string[]> {
    const breadcrumbItems = await this.page.locator(this.selectors.breadcrumbItems).allTextContents();
    return breadcrumbItems.filter(item => item.trim() !== '');
  }

  /**
   * Click on breadcrumb item by index
   */
  async clickBreadcrumb(index: number): Promise<void> {
    await this.page.locator(this.selectors.breadcrumbItems).nth(index).click();
  }

  /**
   * Navigate to homepage
   */
  async goToHome(): Promise<void> {
    await this.clickLinkByHref('/');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to about page
   */
  async goToAbout(): Promise<void> {
    await this.clickLinkByHref('/about');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to contact page
   */
  async goToContact(): Promise<void> {
    await this.clickLinkByHref('/contact');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to products/services page
   */
  async goToProducts(): Promise<void> {
    await this.clickLinkByHref('/products');
    await this.waitForPageLoad();
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    const profileMenu = await this.page.locator('.profile-menu, .user-menu').isVisible();
    return profileMenu;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (await this.isElementVisible('.logout, .sign-out')) {
      await this.clickElement('.logout, .sign-out');
    } else if (await this.isElementVisible('.profile-menu')) {
      await this.clickElement('.profile-menu');
      await this.clickElement('text=Logout');
    }
    await this.waitForPageLoad();
  }

  /**
   * Get current page from navigation
   */
  async getCurrentPage(): Promise<string> {
    const activeLink = await this.page.locator('nav a.active, .menu-item.active').textContent();
    return activeLink?.trim() || '';
  }

  /**
   * Check if navigation is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.primaryNav);
  }

  /**
   * Get all nav links and their URLs
   */
  async getNavLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = await this.page.locator(this.selectors.navLinks).all();
    const navLinks = [];
    
    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      if (text && href) {
        navLinks.push({ text: text.trim(), href });
      }
    }
    
    return navLinks;
  }

  /**
   * Click logo to go home
   */
  async clickLogo(): Promise<void> {
    await this.clickElement(this.selectors.logo);
  }

  /**
   * Scroll to navigation
   */
  async scrollToNavigation(): Promise<void> {
    await this.scrollToElement(this.selectors.primaryNav);
  }

  /**
   * Check if mobile menu is open
   */
  async isMobileMenuOpen(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.sidebarMenu);
  }

  /**
   * Navigate to search page
   */
  async goToSearch(): Promise<void> {
    if (await this.isElementVisible('a[href="/search"]')) {
      await this.clickLinkByHref('/search');
    } else if (await this.isElementVisible('.search-link')) {
      await this.clickElement('.search-link');
    }
    await this.waitForPageLoad();
  }

  /**
   * Navigate to cart page
   */
  async goToCart(): Promise<void> {
    if (await this.isElementVisible('a[href="/cart"]')) {
      await this.clickLinkByHref('/cart');
    } else if (await this.isElementVisible('.cart-link')) {
      await this.clickElement('.cart-link');
    }
    await this.waitForPageLoad();
  }

  /**
   * Navigate to user profile
   */
  async goToProfile(): Promise<void> {
    if (await this.isElementVisible('.profile-link')) {
      await this.clickElement('.profile-link');
    } else if (await this.isElementVisible('.user-menu')) {
      await this.clickElement('.user-menu');
      await this.clickElement('text=Profile');
    }
    await this.waitForPageLoad();
  }
}
