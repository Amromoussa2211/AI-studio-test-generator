# 🤖 AI Studio Test Generator

A comprehensive Playwright testing framework with **AI-powered test generation** from plain text user stories. Write tests faster, smarter, and more efficiently.

## ⚡ Quick Navigation

| I want to... | Go to... |
|--------------|----------|
| 🚀 **Get started quickly** | [Installation](#-installation) → [Run Tests](#-how-to-run) |
| 🤖 **Generate tests with AI** | [AI Generator Quick Guide](docs/QUICK-AI-GENERATOR.md) |
| 📊 **Use data-driven testing** | [Data-Driven Guide](docs/DATA-DRIVEN-GUIDE.md) |
| 📁 **Understand project structure** | [Project Structure](docs/PROJECT-STRUCTURE.md) |
| 🐛 **Fix problems** | [Troubleshooting](docs/troubleshooting.md) |
| 📚 **Learn best practices** | [Best Practices](docs/best-practices.md) |

## 🌟 Key Features

- 🤖 **AI Test Generation**: Convert user stories to executable tests instantly
- 🌐 **Web Testing**: Complete browser automation with page object models
- 📱 **Mobile Testing**: Device emulation for iPhone, Android, tablets
- 🔌 **API Testing**: Full REST API testing with authentication
- 📊 **Data-Driven**: Run tests with multiple data sets from CSV/JSON
- 📈 **Rich Reports**: HTML reports with screenshots and videos
- 🎯 **Page Object Pattern**: Maintainable, reusable test code

## 📁 Project Structure

```
AI-studio-test-generator/
├── README.md                     # You are here!
├── docs/                         # 📚 All documentation
│   ├── PROJECT-STRUCTURE.md     # Complete structure guide
│   ├── QUICK-AI-GENERATOR.md    # AI generator quick start
│   ├── AI-GENERATOR-GUIDE.md    # Complete AI guide with examples
│   ├── DATA-DRIVEN-GUIDE.md     # Data-driven testing guide
│   └── troubleshooting.md       # Common issues & solutions
├── src/
│   ├── cli/                     # 🤖 AI test generator CLI
│   ├── core/                    # Core framework
│   │   ├── page-objects/        # Page Object Models
│   │   ├── fixtures/            # Test fixtures
│   │   └── utils/               # Utilities
│   ├── data-driven/             # 📊 Data-driven testing module
│   │   ├── providers/           # CSV/JSON/Database providers
│   │   ├── generators/          # Test data generators
│   │   └── examples/            # Working examples
│   ├── tests/                   # ✅ All test files
│   │   ├── web/                 # Web tests
│   │   ├── api/                 # API tests
│   │   ├── mobile/              # Mobile tests
│   │   └── generated/           # AI-generated tests
│   └── reporting/               # Analytics & AI logic
├── test-data/                   # Test data files (JSON/CSV)
└── test-results/                # Generated reports (gitignored)
```

**📖 For detailed structure explanation:** [docs/PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amromoussa2211/AI-studio-test-generator.git
   cd AI-studio-test-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 📚 Complete Documentation

All guides are in the [`docs/`](docs/) folder:

| Documentation | Description |
|---------------|-------------|
| [**PROJECT-STRUCTURE.md**](docs/PROJECT-STRUCTURE.md) | Complete guide to project organization |
| [**QUICK-AI-GENERATOR.md**](docs/QUICK-AI-GENERATOR.md) | Quick start: Generate tests with AI |
| [**AI-GENERATOR-GUIDE.md**](docs/AI-GENERATOR-GUIDE.md) | Complete AI generator guide with examples |
| [**DATA-DRIVEN-GUIDE.md**](docs/DATA-DRIVEN-GUIDE.md) | Data-driven testing with CSV/JSON |
| [**best-practices.md**](docs/best-practices.md) | Testing best practices |
| [**troubleshooting.md**](docs/troubleshooting.md) | Common issues & solutions |

## 🚀 How to Run

### Step 1: Clone the Repository
```bash
git clone https://github.com/Amromoussa2211/AI-studio-test-generator.git
cd AI-studio-test-generator
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers (Chrome, Firefox, Safari)
npx playwright install
```

### Step 3: Run Tests

#### Run All Tests
```bash
npm test
```

#### Run Specific Test Suites
```bash
# Web tests only
npm run test:web

# Mobile tests only
npm run test:mobile

# API tests only
npm run test:api
```

#### Run Tests in Different Modes
```bash
# Headed mode (see browser window)
npm run test:headed

# Debug mode (step-by-step debugging)
npm run test:debug

# View test report
npm run test:report
```

### Step 4: View Results
After running tests, you can view:
- **HTML Report**: Run `npm run test:report` to open interactive report
- **Screenshots**: Check `test-results/` folder for failure screenshots
- **Videos**: Check `test-results/` folder for test recordings

## 🤖 AI Test Generation - Sample Usage

The framework includes an AI-powered test generator that can convert plain text user stories into executable test scripts!

### How to Use AI Test Generation

#### Step 1: Run the AI Generator
```bash
npm run ai-generate
```

#### Step 2: Input Your User Story (Plain Text)
Enter your test scenario in natural language. Here's an example:

**Input:**
```
User Story: Login with valid credentials

As a registered user
I want to log into the application
So that I can access my dashboard

Acceptance Criteria:
- User navigates to login page
- User enters email: test@example.com
- User enters password: Test@123
- User clicks login button
- User should be redirected to dashboard
- Dashboard should display welcome message
```

#### Step 3: Generated Test Code
The AI will automatically generate a Playwright test:

```typescript
// Generated Test: Login with valid credentials
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

test.describe('Login with valid credentials', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page, 'http://localhost:3000');
    await loginPage.goto();
  });

  test('should allow user to login with valid credentials', async ({ page }) => {
    // User enters email
    await loginPage.fillEmail('test@example.com');
    
    // User enters password
    await loginPage.fillPassword('Test@123');
    
    // User clicks login button
    await loginPage.clickLoginButton();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify welcome message is displayed
    await expect(page.locator('.welcome-message')).toBeVisible();
    await expect(page.locator('.welcome-message')).toContainText('Welcome');
  });
});
```

### More AI Generation Examples

#### Example 1: E-commerce Shopping Cart
**Input:**
```
User Story: Add product to shopping cart

As a customer
I want to add products to my cart
So that I can purchase them later

Steps:
1. Navigate to products page
2. Click on first product
3. Select quantity: 2
4. Click "Add to Cart" button
5. Verify cart icon shows count: 2
6. Verify success message appears
```

**Generated Output:**
```typescript
test('should add product to shopping cart', async ({ page }) => {
  const ecommercePage = new EcommercePage(page, baseURL);
  
  // Navigate to products page
  await ecommercePage.goto('/products');
  
  // Click on first product
  await ecommercePage.clickProduct(0);
  
  // Select quantity
  await ecommercePage.selectQuantity(2);
  
  // Add to cart
  await ecommercePage.clickAddToCart();
  
  // Verify cart count
  await expect(page.locator('.cart-count')).toHaveText('2');
  
  // Verify success message
  await expect(page.locator('.success-message')).toBeVisible();
});
```

#### Example 2: API Testing
**Input:**
```
API Test: Create new user via API

Test Scenario:
- Send POST request to /api/users
- Body: { "name": "John Doe", "email": "john@example.com", "role": "user" }
- Verify response status is 201
- Verify response contains user ID
- Verify email matches request
```

**Generated Output:**
```typescript
test('should create new user via API', async ({ request }) => {
  const newUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };
  
  const response = await request.post('/api/users', {
    data: newUser
  });
  
  expect(response.status()).toBe(201);
  
  const userData = await response.json();
  expect(userData).toHaveProperty('id');
  expect(userData.email).toBe(newUser.email);
});
```

#### Example 3: Mobile Testing
**Input:**
```
Mobile Test: Hamburger menu navigation

Device: iPhone 12
Steps:
1. Open homepage on mobile
2. Tap hamburger menu icon
3. Verify menu slides in from left
4. Tap "Products" link
5. Verify navigation to products page
```

**Generated Output:**
```typescript
test('should navigate using hamburger menu on mobile', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['iPhone 12']
  });
  const page = await context.newPage();
  
  await page.goto('/');
  
  // Tap hamburger menu
  await page.tap('.hamburger-menu');
  
  // Verify menu visible
  await expect(page.locator('.mobile-menu')).toBeVisible();
  
  // Tap Products link
  await page.tap('text=Products');
  
  // Verify navigation
  await expect(page).toHaveURL(/.*products/);
  
  await context.close();
});
```

### Running AI-Generated Tests

1. **Save the generated code** to a `.spec.ts` file in `src/tests/`
2. **Run the test:**
   ```bash
   npm test -- path/to/your-generated-test.spec.ts
   ```

### Benefits of AI Test Generation

✅ **Save Time**: Convert user stories to tests in seconds  
✅ **Consistent Code**: Follow framework patterns automatically  
✅ **Learn by Example**: Great for new team members  
✅ **Rapid Prototyping**: Quickly create test skeletons  
✅ **Best Practices**: Generated code uses page objects and proper assertions

## 📋 Available Scripts

- `npm test` - Run all tests
- `npm run test:web` - Run web tests only
- `npm run test:mobile` - Run mobile tests only
- `npm run test:api` - Run API tests only
- `npm run test:headed` - Run tests in headed mode
- `npm run test:debug` - Debug tests
- `npm run test:report` - Show test report
- `npm run ai-generate` - Generate test cases from user stories (AI-powered)

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
