# 📊 Data-Driven Testing Guide

Complete guide to using the data-driven testing module in the AI Studio Test Generator framework.

## 🎯 What is Data-Driven Testing?

Data-driven testing allows you to run the same test multiple times with different input data. Instead of hardcoding test values, you load them from external sources (CSV, JSON, databases).

**Benefits:**
- ✅ Run hundreds of test scenarios with one test script
- ✅ Separate test logic from test data
- ✅ Easy to maintain and update test cases
- ✅ Non-technical users can add test data
- ✅ Reduce code duplication

---

## 📁 Module Location

```
src/data-driven/
├── providers/         # Load data from different sources
├── generators/        # Generate test data
├── core/             # Core execution logic
├── examples/         # Working examples
└── utils/            # Helper functions
```

---

## 🚀 Quick Start

### 1. **Prepare Test Data**

**Create:** `test-data/users.json`
```json
[
  {
    "email": "user1@example.com",
    "password": "Password123",
    "expectedResult": "success"
  },
  {
    "email": "user2@example.com",
    "password": "WrongPassword",
    "expectedResult": "error"
  },
  {
    "email": "",
    "password": "",
    "expectedResult": "error"
  }
]
```

### 2. **Load Data in Your Test**

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const testData = JSON.parse(
  fs.readFileSync('test-data/users.json', 'utf-8')
);

testData.forEach((data) => {
  test(`Login with ${data.email}`, async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', data.email);
    await page.fill('#password', data.password);
    await page.click('button[type="submit"]');

    if (data.expectedResult === 'success') {
      await expect(page).toHaveURL('/dashboard');
    } else {
      await expect(page.locator('.error')).toBeVisible();
    }
  });
});
```

### 3. **Run Tests**

```bash
npm test
```

This will run 3 separate tests - one for each data row!

---

## 📦 Data Providers

### JSON Provider

**File:** `src/data-driven/providers/json-provider.js`

```javascript
const { loadJSONData } = require('../providers/json-provider');

// Load JSON data
const users = await loadJSONData('test-data/users.json');

// Use in tests
users.forEach(user => {
  test(`Test for ${user.name}`, async ({ page }) => {
    // Your test logic
  });
});
```

**JSON Format:**
```json
[
  { "name": "Test User 1", "email": "test1@example.com", "age": 25 },
  { "name": "Test User 2", "email": "test2@example.com", "age": 30 }
]
```

---

### CSV Provider

**File:** `src/data-driven/providers/csv-provider.js`

```javascript
const { loadCSVData } = require('../providers/csv-provider');

// Load CSV data
const testCases = await loadCSVData('test-data/scenarios.csv');

// Use in tests
testCases.forEach(testCase => {
  test(testCase.scenario, async ({ page }) => {
    await page.fill('#input', testCase.input);
    await expect(page.locator('#output')).toHaveText(testCase.expected);
  });
});
```

**CSV Format:**
```csv
scenario,input,expected
Valid Email,test@example.com,Valid
Invalid Email,notanemail,Invalid
Empty Input,,Required field
```

---

### Database Provider

**File:** `src/data-driven/providers/database-provider.js`

```javascript
const { loadFromDatabase } = require('../providers/database-provider');

// Load from database
const users = await loadFromDatabase({
  host: 'localhost',
  database: 'testdb',
  query: 'SELECT * FROM users WHERE role = "tester"'
});

// Use in tests
users.forEach(user => {
  test(`Test for ${user.username}`, async ({ page }) => {
    // Your test logic
  });
});
```

---

## 🎲 Data Generators

### Random Data Generation

**File:** `src/data-driven/generators/data-generator.js`

```javascript
const { generateRandomUser, generateRandomEmail } = require('../generators/data-generator');

test('Register new user', async ({ page }) => {
  // Generate random user data
  const user = generateRandomUser();
  // user = { name: 'Random Name', email: 'random@example.com', password: 'Pass@123' }

  await page.goto('/register');
  await page.fill('#name', user.name);
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.success')).toBeVisible();
});
```

**Available Generators:**
- `generateRandomUser()` - Complete user object
- `generateRandomEmail()` - Random email address
- `generateRandomPassword()` - Secure password
- `generateRandomPhone()` - Phone number
- `generateRandomDate()` - Random date

---

## 📝 Complete Examples

### Example 1: Login Tests with JSON

**Test File:** `src/tests/web/data-driven-login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Load test data
const loginData = JSON.parse(
  fs.readFileSync('test-data/login-scenarios.json', 'utf-8')
);

test.describe('Data-Driven Login Tests', () => {
  loginData.forEach((scenario) => {
    test(`Login: ${scenario.description}`, async ({ page }) => {
      // Navigate to login
      await page.goto('/login');
      
      // Fill credentials
      if (scenario.email) {
        await page.fill('input[name="email"]', scenario.email);
      }
      if (scenario.password) {
        await page.fill('input[name="password"]', scenario.password);
      }
      
      // Submit
      await page.click('button[type="submit"]');
      
      // Verify result
      if (scenario.shouldSucceed) {
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('.welcome-message')).toBeVisible();
      } else {
        await expect(page.locator('.error-message')).toBeVisible();
        await expect(page.locator('.error-message')).toContainText(
          scenario.expectedError
        );
      }
    });
  });
});
```

**Data File:** `test-data/login-scenarios.json`

```json
[
  {
    "description": "Valid credentials",
    "email": "test@example.com",
    "password": "Test@123",
    "shouldSucceed": true
  },
  {
    "description": "Invalid email",
    "email": "invalid@example.com",
    "password": "Test@123",
    "shouldSucceed": false,
    "expectedError": "Invalid credentials"
  },
  {
    "description": "Wrong password",
    "email": "test@example.com",
    "password": "WrongPassword",
    "shouldSucceed": false,
    "expectedError": "Invalid credentials"
  },
  {
    "description": "Empty email",
    "email": "",
    "password": "Test@123",
    "shouldSucceed": false,
    "expectedError": "Email is required"
  },
  {
    "description": "Empty password",
    "email": "test@example.com",
    "password": "",
    "shouldSucceed": false,
    "expectedError": "Password is required"
  }
]
```

**Run:**
```bash
npm test data-driven-login.spec.ts
```

**Result:** 5 separate tests executed!

---

### Example 2: Form Validation with CSV

**Test File:** `src/tests/web/form-validation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as papa from 'papaparse';

// Load CSV data
const csvContent = fs.readFileSync('test-data/form-validation.csv', 'utf-8');
const { data: testCases } = papa.parse(csvContent, { header: true });

test.describe('Form Validation Tests', () => {
  testCases.forEach((testCase) => {
    test(`Validate: ${testCase.field} with ${testCase.input}`, async ({ page }) => {
      await page.goto('/form');
      
      // Fill field
      await page.fill(`input[name="${testCase.field}"]`, testCase.input);
      await page.blur(`input[name="${testCase.field}"]`); // Trigger validation
      
      // Check validation
      const validationMessage = page.locator(`.error-${testCase.field}`);
      
      if (testCase.valid === 'true') {
        await expect(validationMessage).not.toBeVisible();
      } else {
        await expect(validationMessage).toBeVisible();
        await expect(validationMessage).toContainText(testCase.expectedMessage);
      }
    });
  });
});
```

**Data File:** `test-data/form-validation.csv`

```csv
field,input,valid,expectedMessage
email,test@example.com,true,
email,invalid-email,false,Invalid email format
email,,false,Email is required
phone,1234567890,true,
phone,123,false,Phone must be 10 digits
name,John Doe,true,
name,J,false,Name must be at least 2 characters
age,25,true,
age,150,false,Age must be between 1 and 120
age,-5,false,Age must be positive
```

**Run:**
```bash
npm test form-validation.spec.ts
```

---

### Example 3: API Testing with Multiple Endpoints

**Test File:** `src/tests/api/api-endpoints.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const apiEndpoints = JSON.parse(
  fs.readFileSync('test-data/api-endpoints.json', 'utf-8')
);

test.describe('API Endpoint Tests', () => {
  apiEndpoints.forEach((endpoint) => {
    test(`${endpoint.method} ${endpoint.path}`, async ({ request }) => {
      const response = await request[endpoint.method.toLowerCase()](
        endpoint.path,
        {
          data: endpoint.requestBody,
          headers: endpoint.headers
        }
      );

      // Verify status code
      expect(response.status()).toBe(endpoint.expectedStatus);

      // Verify response body
      if (endpoint.expectedResponse) {
        const body = await response.json();
        expect(body).toMatchObject(endpoint.expectedResponse);
      }
    });
  });
});
```

**Data File:** `test-data/api-endpoints.json`

```json
[
  {
    "method": "GET",
    "path": "/api/users",
    "expectedStatus": 200,
    "expectedResponse": {
      "users": []
    }
  },
  {
    "method": "POST",
    "path": "/api/users",
    "requestBody": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "expectedStatus": 201,
    "expectedResponse": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com"
    }
  },
  {
    "method": "GET",
    "path": "/api/users/1",
    "expectedStatus": 200
  },
  {
    "method": "DELETE",
    "path": "/api/users/1",
    "expectedStatus": 204
  }
]
```

---

## 🎯 Advanced Patterns

### Pattern 1: Data Transformation

```javascript
const rawData = await loadJSONData('raw-data.json');

// Transform data before using
const transformedData = rawData.map(item => ({
  ...item,
  fullName: `${item.firstName} ${item.lastName}`,
  age: parseInt(item.age),
  createdAt: new Date(item.dateString)
}));

// Use transformed data
transformedData.forEach(user => {
  test(`Test for ${user.fullName}`, async ({ page }) => {
    // Your test
  });
});
```

### Pattern 2: Filtering Data

```javascript
const allUsers = await loadJSONData('users.json');

// Test only active users
const activeUsers = allUsers.filter(user => user.status === 'active');

activeUsers.forEach(user => {
  test(`Test active user: ${user.name}`, async ({ page }) => {
    // Your test
  });
});
```

### Pattern 3: Combining Multiple Data Sources

```javascript
const users = await loadJSONData('users.json');
const products = await loadJSONData('products.json');

// Create combinations
users.forEach(user => {
  products.forEach(product => {
    test(`${user.name} buys ${product.name}`, async ({ page }) => {
      // Login as user
      await loginAs(user);
      
      // Add product to cart
      await addToCart(product);
      
      // Checkout
      await checkout();
    });
  });
});
```

---

## 🛠️ Utility Functions

### Load and Cache Data

```javascript
let cachedData = null;

function loadTestData() {
  if (!cachedData) {
    cachedData = JSON.parse(
      fs.readFileSync('test-data/data.json', 'utf-8')
    );
  }
  return cachedData;
}

test.describe('Tests', () => {
  const data = loadTestData(); // Loaded once, reused
  
  data.forEach(item => {
    test(`Test ${item.id}`, async ({ page }) => {
      // Your test
    });
  });
});
```

### Data Validation

```javascript
function validateTestData(data) {
  const requiredFields = ['email', 'password', 'expectedResult'];
  
  return data.every(item => 
    requiredFields.every(field => field in item)
  );
}

const testData = loadJSONData('data.json');

if (!validateTestData(testData)) {
  throw new Error('Test data is invalid!');
}
```

---

## 📊 Best Practices

### 1. **Organize Data Files**

```
test-data/
├── users/
│   ├── valid-users.json
│   ├── invalid-users.json
│   └── edge-cases.json
├── products/
│   └── products.json
└── scenarios/
    ├── login-scenarios.csv
    └── checkout-scenarios.csv
```

### 2. **Use Descriptive Test Names**

```javascript
// ✅ Good
test(`Login with ${user.email} - expect ${user.expectedResult}`, ...)

// ❌ Bad
test(`Test ${index}`, ...)
```

### 3. **Include All Necessary Fields**

```json
[
  {
    "testId": "TC001",
    "description": "Valid login",
    "email": "test@example.com",
    "password": "Test@123",
    "expectedResult": "success",
    "expectedUrl": "/dashboard",
    "tags": ["smoke", "login"]
  }
]
```

### 4. **Handle Missing Data**

```javascript
testData.forEach((data) => {
  test(`Test: ${data.description || 'Unnamed test'}`, async ({ page }) => {
    const email = data.email || '';
    const password = data.password || '';
    
    // Your test logic
  });
});
```

### 5. **Use Test Fixtures**

```typescript
// Create reusable fixtures
import { test as base } from '@playwright/test';

const test = base.extend({
  testData: async ({}, use) => {
    const data = JSON.parse(
      fs.readFileSync('test-data/data.json', 'utf-8')
    );
    await use(data);
  }
});

// Use in tests
test('My test', async ({ page, testData }) => {
  testData.forEach(item => {
    // Your logic
  });
});
```

---

## 🚀 Running Data-Driven Tests

```bash
# Run all tests (includes data-driven)
npm test

# Run specific data-driven test
npm test data-driven-login.spec.ts

# Run with specific data file (via environment variable)
DATA_FILE=test-data/users-prod.json npm test

# Run in parallel
npm test -- --workers=4
```

---

## 🐛 Troubleshooting

### Issue: Data file not found
**Solution:**
```javascript
const path = require('path');
const dataPath = path.resolve(__dirname, '../../test-data/users.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
```

### Issue: CSV parsing errors
**Solution:** Install and use papaparse
```bash
npm install papaparse
```

```javascript
import * as papa from 'papaparse';
const { data } = papa.parse(csvContent, { 
  header: true,
  skipEmptyLines: true 
});
```

### Issue: Too many tests generated
**Solution:** Filter data or use test.describe.configure
```javascript
// Limit to first 10
const limitedData = testData.slice(0, 10);

// Or use parallel execution
test.describe.configure({ mode: 'parallel' });
```

---

## 📚 Related Documentation

- [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) - Understand project layout
- [README.md](../README.md) - Main documentation
- [troubleshooting.md](troubleshooting.md) - Common issues

---

## 💡 Tips

- ✅ Keep test data separate from test logic
- ✅ Use meaningful data file names
- ✅ Include both positive and negative test cases
- ✅ Document data file format
- ✅ Version control your test data
- ✅ Use data generators for dynamic tests
- ✅ Cache loaded data to improve performance

---

**Happy Data-Driven Testing!** 🎉
