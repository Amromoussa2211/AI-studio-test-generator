import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for form handling
 */
export class FormPage extends BasePage {
  private selectors = {
    form: 'form',
    input: 'input',
    select: 'select',
    textarea: 'textarea',
    button: 'button',
    submitButton: 'button[type="submit"]',
    resetButton: 'button[type="reset"]',
    errorMessage: '.error-message',
    successMessage: '.success-message',
    validationError: '.validation-error',
    requiredField: '[required]'
  };

  constructor(page: Page, baseUrl?: string) {
    super(page, baseUrl);
  }

  /**
   * Fill a text input field
   */
  async fillInputField(selector: string, value: string): Promise<void> {
    await this.fillInput(selector, value);
  }

  /**
   * Fill a textarea
   */
  async fillTextarea(selector: string, value: string): Promise<void> {
    await this.fillInput(selector, value);
  }

  /**
   * Select an option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Select option by label
   */
  async selectOptionByLabel(selector: string, label: string): Promise<void> {
    await this.page.selectOption(selector, { label });
  }

  /**
   * Check a checkbox
   */
  async checkCheckbox(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Uncheck a checkbox
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  /**
   * Check if checkbox is checked
   */
  async isCheckboxChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  /**
   * Select radio button
   */
  async selectRadioButton(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await this.clickElement(this.selectors.submitButton);
  }

  /**
   * Reset the form
   */
  async resetForm(): Promise<void> {
    await this.clickElement(this.selectors.resetButton);
  }

  /**
   * Get value from input field
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  /**
   * Get selected option value from dropdown
   */
  async getSelectedOption(selector: string): Promise<string> {
    const selectedOption = await this.page.evaluate(
      (sel) => (document.querySelector(sel) as HTMLSelectElement)?.value,
      selector
    );
    return selectedOption || '';
  }

  /**
   * Get text from textarea
   */
  async getTextareaValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  /**
   * Check if form has validation errors
   */
  async hasValidationErrors(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.validationError);
  }

  /**
   * Get validation error message
   */
  async getValidationError(selector: string): Promise<string> {
    const errorElement = this.page.locator(`${selector} + ${this.selectors.validationError}`);
    return await errorElement.textContent() || '';
  }

  /**
   * Check if required field is highlighted
   */
  async isRequiredField(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.getAttribute('required') !== null;
  }

  /**
   * Fill multiple fields at once
   */
  async fillMultipleFields(fieldData: { [key: string]: string }): Promise<void> {
    for (const [selector, value] of Object.entries(fieldData)) {
      await this.fillInput(selector, value);
    }
  }

  /**
   * Select multiple options
   */
  async selectMultipleOptions(selector: string, values: string[]): Promise<void> {
    await this.page.selectOption(selector, values);
  }

  /**
   * Check if form is displayed
   */
  async isFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.form);
  }

  /**
   * Clear input field
   */
  async clearInput(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  /**
   * Get all form input values
   */
  async getAllFormValues(): Promise<{ [key: string]: string }> {
    const inputs = await this.page.locator(this.selectors.input).all();
    const values: { [key: string]: string } = {};
    
    for (const input of inputs) {
      const id = await input.getAttribute('id') || await input.getAttribute('name');
      const value = await input.inputValue();
      if (id) values[id] = value;
    }
    
    return values;
  }

  /**
   * Fill contact form example
   */
  async fillContactForm(name: string, email: string, message: string): Promise<void> {
    await this.fillMultipleFields({
      'input[name="name"]': name,
      'input[name="email"]': email,
      'textarea[name="message"]': message
    });
  }

  /**
   * Fill registration form example
   */
  async fillRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    await this.fillMultipleFields({
      'input[name="firstName"]': firstName,
      'input[name="lastName"]': lastName,
      'input[name="email"]': email,
      'input[name="password"]': password
    });
  }
}
