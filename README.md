# Simple Playwright Testing Framework

A comprehensive, easy-to-understand Playwright testing suite for web, mobile, and API testing. This framework provides everything you need to get started with automated testing quickly and efficiently.

## 🚀 Features

- **Web Testing**: Complete web application testing with page object models
- **Mobile Testing**: Device emulation for iPhone, Android, and tablets
- **API Testing**: Full CRUD operations with authentication
- **Page Object Models**: Reusable, maintainable page object patterns
- **Test Utilities**: Screenshot capture, data management, assertions
- **Test Fixtures**: Easy setup and teardown with data management
- **Comprehensive Examples**: Ready-to-use test examples

## 📁 Project Structure

```
simple-testing-framework/
├── src/
│   ├── page-objects/          # Page Object Models
│   │   ├── BasePage.ts        # Base page with common functionality
│   │   ├── LoginPage.ts       # Login functionality
│   │   ├── FormPage.ts        # Form handling
│   │   ├── NavigationPage.ts  # Menu and navigation
│   │   └── EcommercePage.ts   # Shopping cart & e-commerce
│   ├── tests/                 # Test suites
│   │   ├── web/              # Web application tests
│   │   │   ├── login.spec.ts
│   │   │   ├── forms.spec.ts
│   │   │   ├── navigation.spec.ts
│   │   │   └── ecommerce.spec.ts
│   │   ├── mobile/           # Mobile testing
│   │   │   └── mobile.spec.ts
│   │   └── api/              # API testing
│   │       └── api.spec.ts
│   ├── utils/                # Test utilities
│   │   └── TestUtils.ts      # Screenshot, data, assertions
│   ├── fixtures/             # Test fixtures
│   │   └── testFixtures.ts   # Setup/teardown & data management
│   ├── test-data/            # Test data and mocks
│   │   └── testData.json     # Sample data
│   └── config/               # Configuration files
├── playwright.config.ts      # Playwright configuration
├── package.json              # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Installation

1. **Clone or copy the framework files**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

## 📋 Available Scripts

- `npm test` - Run all tests
- `npm run test:web` - Run web tests only
- `npm run test:mobile` - Run mobile tests only
- `npm run test:api` - Run API tests only
- `npm run test:headed` - Run tests in headed mode
- `npm run test:debug` - Debug tests
- `npm run test:report` - Show test report

## 📝 Usage Examples

### 1. Web Testing

```typescript
import { test, expect } from '@playwright/test';
import { test as base } from './src/fixtures/testFixtures';

const testWithFixtures = base.extend<{
  loginPage: import('./src/page-objects/LoginPage').LoginPage;
}>({
  loginPage: async ({ page, baseURL }, use) => {
    const loginPage = new LoginPage(page, baseURL);
    await use(loginPage);
  }
});

const { describe, beforeEach } = testWithFixtures;

describe('Login Tests', () => {
  beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully', async ({ loginPage, testData }) => {
    const user = testData.users.find(u => u.role === 'user');
    await loginPage.login(user.email, user.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

### 2. Mobile Testing

```typescript
import { test, expect, devices } from '@playwright/test';

test('Mobile Navigation', async ({ browser }) => {
  // Create iPhone context
  const mobileContext = await browser.newContext({
    ...devices['iPhone 12'],
    viewport: { width: 375, height: 812 }
  });

  const mobilePage = await mobileContext.newPage();
  
  await mobilePage.goto('/');
  await expect(mobilePage.locator('.hamburger-menu')).toBeVisible();
  
  // Test mobile-specific functionality
  await mobilePage.tap('.hamburger-menu');
  await expect(mobilePage.locator('.mobile-menu')).toBeVisible();
});
```

### 3. API Testing

```typescript
import { test, expect, APIRequestContext } from '@playwright/test';
import { test as base } from './src/fixtures/testFixtures';

const testWithFixtures = base.extend<{
  apiContext: APIRequestContext;
}>({
  apiContext: async ({ request }, use) => {
    await use(request);
  }
});

const { describe } = testWithFixtures;

describe('API Tests', () => {
  test('should get posts', async ({ apiContext }) => {
    const response = await apiContext.get('/posts');
    
    expect(response.status()).toBe(200);
    const posts = await response.json();
    expect(Array.isArray(posts)).toBe(true);
  });

  test('should create post', async ({ apiContext }) => {
    const newPost = { title: 'Test', body: 'Content', userId: 1 };
    const response = await apiContext.post('/posts', { data: newPost });
    
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.title).toBe(newPost.title);
  });
});
```

## 🔧 Page Object Models

### Base Page
```typescript
export abstract class BasePage {
  async goto(path: string = ''): Promise<void>
  async waitForPageLoad(): Promise<void>
  async takeScreenshot(name?: string): Promise<void>
  async clickElement(selector: string): Promise<void>
  async fillInput(selector: string, value: string): Promise<void>
  // ... more methods
}
```

### Login Page
```typescript
export class LoginPage extends BasePage {
  async fillEmail(email: string): Promise<void>
  async fillPassword(password: string): Promise<void>
  async login(email: string, password: string): Promise<void>
  async loginAsAdmin(): Promise<void>
  async loginAsUser(): Promise<void>
}
```

## 🧪 Test Data Management

### Loading Test Data
```typescript
// In your test
test('my test', async ({ testData }) => {
  const user = testData.users.find(u => u.role === 'admin');
  const product = testData.products[0];
  
  // Use test data
  await loginPage.login(user.email, user.password);
});
```

### Generating Test Data
```typescript
import { TestUtils } from './src/utils/TestUtils';

// Generate unique data
const uniqueEmail = TestUtils.generateUniqueEmail();
const uniqueData = TestUtils.generateRandomData();

// Save/load test data
TestUtils.saveTestData(myData, 'my-test-data');
const loadedData = TestUtils.loadTestData('my-test-data');
```

## 📱 Mobile Testing

### Device Emulation
```typescript
// Supported devices
const devices = [
  'iPhone 12',
  'Samsung Galaxy S21', 
  'iPad',
  'Pixel 5'
];

// Usage in tests
test.use({ ...devices['iPhone 12'] });

test('Mobile test', async ({ page }) => {
  // Your mobile test code
});
```

### Mobile-Specific Features
- Touch gesture testing
- Responsive design validation
- Mobile navigation testing
- Orientation changes
- Performance testing

## 🌐 API Testing

### CRUD Operations
```typescript
// GET - Read
const response = await apiContext.get('/posts/1');

// POST - Create
const newPost = await apiContext.post('/posts', {
  data: { title: 'New Post', body: 'Content', userId: 1 }
});

// PUT - Update
const updated = await apiContext.put('/posts/1', {
  data: { title: 'Updated Title' }
});

// DELETE - Delete
await apiContext.delete('/posts/1');
```

### Authentication
```typescript
// With authentication
const response = await apiContext.get('/protected-endpoint', {
  headers: { 'Authorization': 'Bearer token123' }
});
```

## 🎯 Test Utilities

### Screenshots
```typescript
// Take screenshot
await TestUtils.takeScreenshot(page, 'login-page');

// Element screenshot
await TestUtils.takeElementScreenshot(page, '.login-form', 'login-form');
```

### Assertions
```typescript
// Common assertions
await expect(page.locator('.success-message')).toBeVisible();
await expect(page.locator('.error-message')).toHaveText('Invalid credentials');
await expect(page).toHaveURL('/dashboard');
```

### Data Management
```typescript
// Clean storage
await TestUtils.clearStorage(page);

// Local storage
await TestUtils.setLocalStorage(page, 'userToken', 'abc123');
const token = await TestUtils.getLocalStorage(page, 'userToken');

// Retry operations
const result = await TestUtils.retry(async () => {
  return await page.click('.element');
}, 3, 1000);
```

## 🔧 Configuration

### Playwright Config
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
});
```

### Environment Variables
```bash
# .env file
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
TEST_TIMEOUT=30000
```

## 📊 Test Reports

Test reports are automatically generated in HTML format. View them with:
```bash
npm run test:report
```

Reports include:
- Test results (passed/failed/skipped)
- Screenshots on failure
- Video recordings
- Trace viewer
- Performance metrics

## 🚀 Quick Start Guide

1. **Setup:**
   ```bash
   npm install
   npm run install:browsers
   ```

2. **Create your first test:**
   ```typescript
   // src/tests/my-first-test.spec.ts
   import { test, expect } from '@playwright/test';
   
   test('my first test', async ({ page }) => {
     await page.goto('/');
     await expect(page.locator('h1')).toContainText('Welcome');
   });
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

## 📚 Examples Included

### Web Tests
- **Login Tests**: Authentication, validation, error handling
- **Form Tests**: Contact forms, registration, validation
- **Navigation Tests**: Menu, breadcrumbs, user flow
- **E-commerce Tests**: Products, cart, checkout, wishlist

### Mobile Tests
- **Mobile Navigation**: Touch gestures, hamburger menu
- **Mobile Forms**: Touch-friendly inputs, keyboard handling
- **Responsive Design**: Layout adaptation, orientation changes
- **Performance**: Loading times, optimization

### API Tests
- **CRUD Operations**: Create, Read, Update, Delete
- **Authentication**: Token handling, authorization
- **Error Handling**: 404, 400, 500 status codes
- **Response Validation**: Structure, types, constraints

## 🎓 Best Practices

1. **Use Page Object Models**: Keep selectors and actions in page objects
2. **Organize Tests**: Group related tests in describe blocks
3. **Use Test Data**: Leverage the test data management system
4. **Clean Up**: Use fixtures for setup and teardown
5. **Screenshot on Failure**: Enable automatic screenshots
6. **Follow Naming Conventions**: Use descriptive test names
7. **Handle Flakiness**: Use explicit waits and retry mechanisms

## 🛡️ Error Handling

The framework includes comprehensive error handling:
- Element not found scenarios
- Network timeout handling
- API error responses
- Invalid data handling
- Permission errors

## 📈 Performance Testing

Built-in performance features:
- Response time validation
- Load time measurements
- Network request monitoring
- Mobile performance optimization

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Headed Mode
```bash
npm run test:headed
```

## 🤝 Contributing

To extend the framework:

1. **Add new page objects** in `src/page-objects/`
2. **Create new test suites** in `src/tests/`
3. **Add utilities** in `src/utils/`
4. **Update test data** in `src/test-data/`
5. **Configure** in `playwright.config.ts`

## 📄 License

MIT License - feel free to use and modify for your projects.

## 🆘 Support

For questions or issues:
1. Check the example tests for patterns
2. Review the TestUtils class for utility methods
3. Examine the page object models for best practices
4. Use the test data JSON for data structures

---

Happy Testing! 🎉
