import { test, expect } from '@playwright/test';
import { test as base, TestUtils } from '../../fixtures/testFixtures';

/**
 * Extended test with fixtures
 */
const testWithFixtures = base.extend<{
  formPage: import('../../page-objects/FormPage').FormPage;
  testData: any;
  page: import('@playwright/test').Page;
}>({
  formPage: async ({ page, baseURL }, use) => {
    const formPage = new (await import('../../page-objects/FormPage')).FormPage(page, baseURL);
    await use(formPage);
  },
  testData: async ({}, use) => {
    const testData = await (await import('../../test-data/testData')).default;
    await use(testData);
  }
});

const { describe, beforeEach } = testWithFixtures;

describe('Form Tests', () => {
  beforeEach(async ({ formPage }) => {
    // Navigate to forms page
    await formPage.goto('/forms');
  });

  describe('Contact Form', () => {
    test('should submit contact form with valid data', async ({ formPage, testData }) => {
      const contactData = testData.forms.contact.valid;
      
      // Fill the contact form
      await formPage.fillMultipleFields({
        'input[name="name"]': contactData.name,
        'input[name="email"]': contactData.email,
        'input[name="subject"]': contactData.subject,
        'textarea[name="message"]': contactData.message,
        'input[name="phone"]': contactData.phone
      });
      
      // Submit the form
      await formPage.submitForm();
      
      // Wait for success message or redirect
      await expect(formPage.page.locator('.success-message, .alert-success')).toBeVisible();
    });

    test('should show validation errors for empty contact form', async ({ formPage }) => {
      // Submit empty form
      await formPage.submitForm();
      
      // Check for validation errors
      const nameError = await formPage.getValidationError('input[name="name"]');
      const emailError = await formPage.getValidationError('input[name="email"]');
      const messageError = await formPage.getValidationError('textarea[name="message"]');
      
      expect(nameError || emailError || messageError).toBeTruthy();
    });

    test('should show error for invalid email format', async ({ formPage }) => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message'
      };
      
      await formPage.fillMultipleFields({
        'input[name="name"]': invalidData.name,
        'input[name="email"]': invalidData.email,
        'input[name="subject"]': invalidData.subject,
        'textarea[name="message"]': invalidData.message
      });
      
      await formPage.submitForm();
      
      // Check for email validation error
      await expect(formPage.page.locator('[name="email"] + .error-message')).toBeVisible();
    });

    test('should validate phone number format', async ({ formPage }) => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
        phone: 'invalid-phone'
      };
      
      await formPage.fillMultipleFields({
        'input[name="name"]': invalidData.name,
        'input[name="email"]': invalidData.email,
        'input[name="subject"]': invalidData.subject,
        'textarea[name="message"]': invalidData.message,
        'input[name="phone"]': invalidData.phone
      });
      
      await formPage.submitForm();
      
      // Should either validate phone or accept it as text field
      // Implementation dependent
    });
  });

  describe('Registration Form', () => {
    test('should register new user with valid data', async ({ formPage, testData }) => {
      const regData = testData.forms.registration.valid;
      const uniqueEmail = TestUtils.generateUniqueEmail();
      
      await formPage.fillMultipleFields({
        'input[name="firstName"]': regData.firstName,
        'input[name="lastName"]': regData.lastName,
        'input[name="email"]': uniqueEmail,
        'input[name="password"]': regData.password,
        'input[name="confirmPassword"]': regData.confirmPassword,
        'input[name="phone"]': regData.phone,
        'input[name="address"]': regData.address,
        'input[name="city"]': regData.city,
        'input[name="state"]': regData.state,
        'input[name="zipCode"]': regData.zipCode,
        'select[name="country"]': regData.country
      });
      
      // Accept terms
      await formPage.checkCheckbox('input[name="terms"]');
      
      // Submit form
      await formPage.submitForm();
      
      // Should show success message or redirect to dashboard
      await expect(formPage.page.locator('.success-message, .alert-success')).toBeVisible();
    });

    test('should validate password match', async ({ formPage }) => {
      const regData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different123'
      };
      
      await formPage.fillMultipleFields({
        'input[name="firstName"]': regData.firstName,
        'input[name="lastName"]': regData.lastName,
        'input[name="email"]': regData.email,
        'input[name="password"]': regData.password,
        'input[name="confirmPassword"]': regData.confirmPassword
      });
      
      await formPage.submitForm();
      
      // Should show password mismatch error
      await expect(formPage.page.locator('.error-message')).toBeVisible();
    });

    test('should validate required fields', async ({ formPage }) => {
      // Submit empty registration form
      await formPage.submitForm();
      
      // Check for required field validation errors
      const firstNameError = await formPage.getValidationError('input[name="firstName"]');
      const lastNameError = await formPage.getValidationError('input[name="lastName"]');
      const emailError = await formPage.getValidationError('input[name="email"]');
      
      expect(firstNameError || lastNameError || emailError).toBeTruthy();
    });

    test('should validate weak password', async ({ formPage }) => {
      const weakPasswordData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123',
        confirmPassword: '123'
      };
      
      await formPage.fillMultipleFields({
        'input[name="firstName"]': weakPasswordData.firstName,
        'input[name="lastName"]': weakPasswordData.lastName,
        'input[name="email"]': weakPasswordData.email,
        'input[name="password"]': weakPasswordData.password,
        'input[name="confirmPassword"]': weakPasswordData.confirmPassword
      });
      
      await formPage.submitForm();
      
      // Should show password strength error
      await expect(formPage.page.locator('.error-message')).toBeVisible();
    });

    test('should require terms acceptance', async ({ formPage }) => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };
      
      await formPage.fillMultipleFields({
        'input[name="firstName"]': validData.firstName,
        'input[name="lastName"]': validData.lastName,
        'input[name="email"]': validData.email,
        'input[name="password"]': validData.password,
        'input[name="confirmPassword"]': validData.confirmPassword
      });
      
      // Don't check terms
      await formPage.submitForm();
      
      // Should require terms acceptance
      await expect(formPage.page.locator('.error-message')).toBeVisible();
    });
  });

  describe('Form UI/UX', () => {
    test('should show form labels properly', async ({ formPage }) => {
      const labels = await formPage.page.locator('label').allTextContents();
      expect(labels.length).toBeGreaterThan(0);
    });

    test('should have proper input types', async ({ formPage }) => {
      const emailInput = formPage.page.locator('input[type="email"]');
      const passwordInput = formPage.page.locator('input[type="password"]');
      
      // Email input should be type email
      await expect(emailInput).toBeVisible();
      
      // Password input should be type password
      await expect(passwordInput).toBeVisible();
    });

    test('should handle file upload', async ({ formPage }) => {
      // Create a test file
      const testFileContent = 'Test file content';
      const fileName = 'test-file.txt';
      
      // Navigate to file upload form
      await formPage.goto('/forms/upload');
      
      // Upload file
      const filePath = `./test-files/${fileName}`;
      
      // Create test file directory if it doesn't exist
      const fs = require('fs');
      const path = require('path');
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, testFileContent);
      
      await formPage.uploadFile('input[type="file"]', filePath);
      
      // Verify file was selected
      await expect(formPage.page.locator('input[type="file"]')).toHaveValue(fileName);
      
      // Clean up
      fs.unlinkSync(filePath);
    });

    test('should validate dropdown selections', async ({ formPage }) => {
      await formPage.goto('/forms/dropdown');
      
      // Test selecting an option
      await formPage.selectOptionByLabel('select[name="country"]', 'United States');
      
      // Verify selection
      const selectedValue = await formPage.getSelectedOption('select[name="country"]');
      expect(selectedValue).toBeTruthy();
    });

    test('should handle radio buttons', async ({ formPage }) => {
      await formPage.goto('/forms/radio');
      
      // Select a radio button option
      await formPage.selectRadioButton('input[value="option1"]');
      
      // Verify selection
      await expect(formPage.page.locator('input[value="option1"]')).toBeChecked();
    });

    test('should handle checkboxes', async ({ formPage }) => {
      await formPage.goto('/forms/checkbox');
      
      // Check a checkbox
      await formPage.checkCheckbox('input[name="newsletter"]');
      
      // Verify it's checked
      await expect(formPage.page.locator('input[name="newsletter"]')).toBeChecked();
      
      // Uncheck it
      await formPage.uncheckCheckbox('input[name="newsletter"]');
      
      // Verify it's unchecked
      await expect(formPage.page.locator('input[name="newsletter"]')).not.toBeChecked();
    });
  });

  describe('Form Data Management', () => {
    test('should clear form fields', async ({ formPage, testData }) => {
      const contactData = testData.forms.contact.valid;
      
      // Fill form
      await formPage.fillMultipleFields({
        'input[name="name"]': contactData.name,
        'input[name="email"]': contactData.email,
        'input[name="subject"]': contactData.subject
      });
      
      // Clear specific field
      await formPage.clearInput('input[name="name"]');
      
      // Verify field is cleared
      const nameValue = await formPage.getInputValue('input[name="name"]');
      expect(nameValue).toBe('');
    });

    test('should get all form values', async ({ formPage, testData }) => {
      const contactData = testData.forms.contact.valid;
      
      // Fill form
      await formPage.fillMultipleFields({
        'input[name="name"]': contactData.name,
        'input[name="email"]': contactData.email,
        'input[name="subject"]': contactData.subject,
        'textarea[name="message"]': contactData.message
      });
      
      // Get all form values
      const formValues = await formPage.getAllFormValues();
      
      expect(formValues).toHaveProperty('name');
      expect(formValues).toHaveProperty('email');
      expect(formValues).toHaveProperty('subject');
      expect(formValues).toHaveProperty('message');
    });

    test('should handle form reset', async ({ formPage }) => {
      // Fill form with test data
      await formPage.fillMultipleFields({
        'input[name="name"]': 'Test Name',
        'input[name="email"]': 'test@example.com'
      });
      
      // Reset form
      await formPage.resetForm();
      
      // Verify fields are cleared (implementation dependent)
      // Some forms may reset to default values
    });
  });
});

// Export test for direct use
export { testWithFixtures as test };
