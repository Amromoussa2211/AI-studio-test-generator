# 🤖 AI Test Generator - Complete Guide

The AI Test Generator converts plain text user stories into executable Playwright test code automatically.

## 🚀 Quick Start

### Step 1: Run the Generator
```bash
npm run ai-generate
```

### Step 2: Enter Your User Story
The CLI will prompt you to enter your user story. You can type multiple lines. When done, type `DONE` on a new line.

### Step 3: Review Generated Test
The generator creates a test file in `src/tests/generated/` with TODO markers for you to complete.

---

## 📝 Example 1: Login Test

### Input:
```bash
npm run ai-generate
```

**Your user story:**
```
As a registered user
I want to log into the application
So that I can access my dashboard

Steps:
1. Navigate to login page
2. Enter email: test@example.com
3. Enter password: Test@123
4. Click login button
5. Verify redirect to dashboard

DONE
```

### Generated Output:
**File:** `src/tests/generated/as-a-registered-user-2025-10-29.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

/**
 * Generated from User Story:
 * As a registered user
 * I want to log into the application
 * So that I can access my dashboard
 */

test.describe('log into the application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should log into the application', async ({ page }) => {
    // Step 1: login
    await page.goto('/login');
    
    // Step 2: fill email
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Step 3: fill password
    await page.fill('input[name="password"]', 'Test@123');
    
    // Step 4: click login button
    await page.click('button[type="submit"]');
    
    // Assertions
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.welcome-message')).toBeVisible();
    
    console.log('✓ Test completed: log into the application');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Negative test case
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
    
    console.log('✓ Error handling test completed');
  });
});
```

### Run the Generated Test:
```bash
npm test src/tests/generated/as-a-registered-user-2025-10-29.spec.ts
```

---

## 📝 Example 2: API Test

### Input:
```
API Test: Create new user

Scenario:
- Send POST request to /api/users
- Body: name, email, role
- Verify 201 status code
- Verify response contains user ID

DONE
```

### Generated Output:
```typescript
import { test, expect } from '@playwright/test';

test.describe('API: Create new user', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://your-api.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    });
  });

  test('should create new user via API', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };
    
    const response = await apiContext.post('/api/users', {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    
    const userData = await response.json();
    expect(userData).toHaveProperty('id');
    expect(userData.email).toBe(newUser.email);
    
    console.log('✓ API test completed');
  });
});
```

---

## 📝 Example 3: Mobile Test

### Input:
```
Mobile Test: Shopping on iPhone

Device: iPhone 12
Steps:
1. Open product page
2. Tap "Add to Cart"
3. Open cart via bottom nav
4. Verify product is in cart
5. Tap checkout button

DONE
```

### Generated Output:
```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile: Shopping on iPhone', () => {
  test('should complete shopping flow on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      viewport: { width: 375, height: 812 }
    });

    const page = await context.newPage();
    await page.goto('/products');
    
    // Tap "Add to Cart"
    await page.tap('button.add-to-cart');
    
    // Open cart
    await page.tap('.bottom-nav .cart-icon');
    
    // Verify product in cart
    await expect(page.locator('.cart-item')).toBeVisible();
    
    // Tap checkout
    await page.tap('button.checkout');
    await expect(page).toHaveURL(/.*checkout/);
    
    await context.close();
    console.log('✓ Mobile test completed');
  });
});
```

---

## 📝 Example 4: E-commerce Flow

### Input:
```
Test: Complete purchase flow

User Journey:
1. Search for "laptop"
2. Filter by price: $500-$1000
3. Select first product
4. Add to cart (quantity: 2)
5. Proceed to checkout
6. Fill shipping information
7. Verify order summary
8. Complete payment

DONE
```

### Generated Output:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Complete purchase flow', () => {
  test('should complete full purchase', async ({ page }) => {
    // Search
    await page.goto('/');
    await page.fill('input[name="search"]', 'laptop');
    await page.click('button[type="submit"]');
    
    // Filter
    await page.click('input[value="500-1000"]');
    await page.waitForSelector('.product-card');
    
    // Select product
    await page.click('.product-card:first-child');
    
    // Add to cart
    await page.selectOption('select[name="quantity"]', '2');
    await page.click('button.add-to-cart');
    await expect(page.locator('.cart-count')).toHaveText('2');
    
    // Checkout
    await page.click('a.checkout');
    
    // Shipping info
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'San Francisco');
    await page.fill('input[name="zip"]', '94102');
    
    // Verify summary
    await expect(page.locator('.order-total')).toBeVisible();
    
    // Complete (in test environment, use test payment)
    await page.click('button.place-order');
    await expect(page.locator('.success-message')).toBeVisible();
    
    console.log('✓ Purchase flow completed');
  });
});
```

---

## 🎯 User Story Formats

The AI generator supports multiple formats:

### Format 1: Standard User Story
```
As a [role]
I want to [action]
So that [benefit]

Acceptance Criteria:
- Criteria 1
- Criteria 2
```

### Format 2: Test Scenario
```
Test: [Test Name]

Scenario:
- Step 1
- Step 2
- Step 3

Expected: [outcome]
```

### Format 3: Plain English
```
Test login functionality. User should be able to
login with email and password. After login, redirect
to dashboard and show welcome message.
```

### Format 4: BDD Style (Gherkin-like)
```
Feature: User Login

Given I am on the login page
When I enter valid credentials
And I click the login button
Then I should be redirected to dashboard
And I should see a welcome message
```

---

## 🔧 Generated Test Structure

All generated tests include:

1. **Test Description** - From your user story
2. **Setup** - beforeEach/beforeAll hooks
3. **Test Steps** - Main test logic with TODO markers
4. **Assertions** - Verification points
5. **Error Handling** - Negative test cases
6. **Console Logs** - For debugging

---

## ✏️ Customizing Generated Tests

After generation, you should:

1. **Update Selectors**: Replace generic selectors with your actual DOM selectors
2. **Add Wait Conditions**: Add explicit waits for dynamic content
3. **Configure URLs**: Update base URLs and endpoints
4. **Add Test Data**: Replace placeholder data with real test data
5. **Enhance Assertions**: Add more specific assertions
6. **Handle Authentication**: Add login/session management if needed

---

## 📂 Output Location

Generated tests are saved to:
```
src/tests/generated/[test-name]-[date].spec.ts
```

Example:
```
src/tests/generated/
├── login-test-2025-10-29.spec.ts
├── api-create-user-2025-10-29.spec.ts
└── mobile-shopping-2025-10-29.spec.ts
```

---

## 🎨 CLI Features

The interactive CLI provides:

- ✅ **Colored Output** - Easy-to-read interface
- ✅ **Multi-line Input** - Enter complex user stories
- ✅ **Smart Parsing** - Detects test type (web/api/mobile)
- ✅ **Action Detection** - Identifies key actions automatically
- ✅ **File Generation** - Creates properly named test files
- ✅ **Preview** - Shows code preview in terminal
- ✅ **Next Steps** - Provides clear instructions

---

## 💡 Tips for Best Results

1. **Be Specific**: Include concrete steps and expected outcomes
2. **Use Keywords**: Words like "login", "click", "fill" help detection
3. **Specify Test Type**: Mention "API", "mobile", or device names
4. **Include Data**: Add sample data (emails, names, etc.)
5. **Define Success**: Clearly state what success looks like
6. **Add Validation**: Mention what should be verified

---

## 🐛 Troubleshooting

### Issue: CLI doesn't start
**Solution**: Ensure Node.js is installed and run:
```bash
npm install
npm run ai-generate
```

### Issue: Generated test has errors
**Solution**: Generated tests are templates. Fill in the TODO sections with your actual test logic.

### Issue: Test file not created
**Solution**: Check that `src/tests/generated/` directory exists or will be created automatically.

---

## 🚀 Advanced Usage

### Batch Generation
You can run the generator multiple times to create a full test suite:

```bash
npm run ai-generate  # Generate test 1
npm run ai-generate  # Generate test 2
npm run ai-generate  # Generate test 3
```

### Integration with CI/CD
Generated tests work with your existing CI/CD pipeline:

```yaml
# .github/workflows/test.yml
- name: Run generated tests
  run: npm test src/tests/generated/
```

---

## 📚 Related Documentation

- [README.md](../README.md) - Framework overview
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [API-TESTING.md](API-TESTING.md) - API testing guide

---

## 🎉 Happy Testing!

The AI Test Generator helps you:
- ⚡ **Speed up** test creation
- 📝 **Standardize** test patterns
- 🎯 **Focus** on test logic, not boilerplate
- 🚀 **Accelerate** your testing workflow

Start generating tests now:
```bash
npm run ai-generate
```
