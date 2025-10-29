# 📁 Project Structure

Complete guide to understanding the AI Studio Test Generator framework structure.

## 📂 Root Directory

```
AI-studio-test-generator/
├── README.md                 # Main documentation (start here!)
├── package.json              # NPM dependencies & scripts
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── docs/                    # All documentation
├── src/                     # Source code
├── test-data/               # Test data files
└── test-results/            # Generated reports (gitignored)
```

---

## 📚 Documentation (`/docs`)

All guides and documentation in one place:

```
docs/
├── PROJECT-STRUCTURE.md        # This file - explains project layout
├── QUICK-AI-GENERATOR.md       # Quick guide to AI test generator
├── AI-GENERATOR-GUIDE.md       # Complete AI generator documentation
├── DATA-DRIVEN-GUIDE.md        # Data-driven testing guide
├── architecture.md             # Framework architecture
├── best-practices.md           # Testing best practices
├── test-types.md              # Guide to test types
└── troubleshooting.md         # Common issues & solutions
```

**Navigation:**
- New user? → Start with [README.md](../README.md)
- Want AI generation? → [QUICK-AI-GENERATOR.md](QUICK-AI-GENERATOR.md)
- Data-driven tests? → [DATA-DRIVEN-GUIDE.md](DATA-DRIVEN-GUIDE.md)
- Issues? → [troubleshooting.md](troubleshooting.md)

---

## 🔧 Source Code (`/src`)

### Overview

```
src/
├── cli/                    # Command-line tools
├── core/                   # Core framework code
├── data-driven/           # Data-driven testing module
├── tests/                 # All test files
├── config/                # Configuration files
└── reporting/             # AI & analytics modules
```

### Detailed Structure

#### 1. **CLI Tools** (`src/cli/`)

```
cli/
└── ai-generator.js        # Interactive AI test generator
```

**Usage:**
```bash
npm run ai-generate
```

Generates test code from plain text user stories.

---

#### 2. **Core Framework** (`src/core/`)

```
core/
├── page-objects/          # Page Object Models
│   ├── BasePage.ts       # Base page class
│   ├── LoginPage.ts      # Login functionality
│   ├── FormPage.ts       # Form handling
│   ├── NavigationPage.ts # Navigation
│   └── EcommercePage.ts  # E-commerce features
│
├── fixtures/              # Test fixtures
│   └── testFixtures.ts   # Setup/teardown logic
│
└── utils/                 # Utility functions
    ├── TestUtils.ts      # Main utilities
    └── test-utils.ts     # Helper functions
```

**Page Object Model Pattern:**
- **BasePage**: Common functionality (navigation, waiting, screenshots)
- **Specific Pages**: Login, Forms, Navigation, E-commerce
- **Usage**: Import and use in tests for maintainable code

**Example:**
```typescript
import { LoginPage } from '@/core/page-objects/LoginPage';

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('test@example.com', 'password');
});
```

---

#### 3. **Data-Driven Testing** (`src/data-driven/`)

```
data-driven/
├── providers/             # Data providers
│   ├── csv-provider.js   # Load data from CSV
│   ├── json-provider.js  # Load data from JSON
│   └── database-provider.js # Database integration
│
├── generators/            # Data generators
│   └── data-generator.js # Generate test data
│
├── core/                  # Core data-driven logic
│   ├── test-executor.js  # Execute parameterized tests
│   └── data-manager.js   # Manage test data
│
├── managers/              # Data management
│   └── data-manager.js
│
├── utils/                 # Data utilities
│   └── data-utils.js
│
└── examples/              # Example tests
    ├── basic-example.js
    ├── csv-example.js
    └── json-example.js
```

**Key Features:**
- ✅ Load data from CSV, JSON, or databases
- ✅ Generate random test data
- ✅ Parameterized test execution
- ✅ Data validation & transformation

**Usage:**
```javascript
// Load data from JSON
const data = await loadJSONData('users.json');

// Run test for each data row
data.forEach(user => {
  test(`Login as ${user.email}`, async ({ page }) => {
    await loginPage.login(user.email, user.password);
  });
});
```

See [DATA-DRIVEN-GUIDE.md](DATA-DRIVEN-GUIDE.md) for complete guide.

---

#### 4. **Tests** (`src/tests/`)

```
tests/
├── web/                   # Web application tests
│   ├── login.spec.ts     # Login tests
│   ├── forms.spec.ts     # Form tests
│   ├── navigation.spec.ts # Navigation tests
│   └── ecommerce.spec.ts # E-commerce tests
│
├── api/                   # API tests
│   └── api.spec.ts       # REST API tests
│
├── mobile/                # Mobile tests
│   └── mobile.spec.ts    # Mobile device tests
│
└── generated/             # AI-generated tests
    └── [auto-generated files]
```

**Test Organization:**
- **web/**: Browser-based UI tests
- **api/**: REST API endpoint tests
- **mobile/**: Mobile device emulation tests
- **generated/**: Created by AI generator

**Run Tests:**
```bash
npm test                   # All tests
npm run test:web          # Web tests only
npm run test:api          # API tests only
npm run test:mobile       # Mobile tests only
```

---

#### 5. **Configuration** (`src/config/`)

```
config/
└── test-config.ts         # Test environment config
```

Environment-specific settings:
- Base URLs
- Timeouts
- Browser settings
- Test data paths

---

#### 6. **Reporting & AI** (`src/reporting/`)

```
reporting/
├── ai_test_generator.py       # AI test generation logic
├── analytics.py               # Test analytics
├── html_report_generator.py   # HTML report generation
├── metrics.py                 # Test metrics
├── test_aggregator.py         # Aggregate results
└── notification_system.py     # Notifications
```

**Python Modules:**
- **ai_test_generator.py**: Core AI logic for generating tests
- **analytics.py**: Analyze test results, generate insights
- **html_report_generator.py**: Create beautiful HTML reports
- **metrics.py**: Calculate test metrics (pass rate, duration, etc.)

**Note:** Python modules provide backend functionality for advanced features. The CLI (`src/cli/ai-generator.js`) provides user-friendly interface.

---

## 📊 Test Data (`/test-data`)

```
test-data/
├── users.json             # User test data
├── products.json          # Product data
├── test-scenarios.csv     # Test scenarios
└── testData.json         # General test data
```

**Data Format Examples:**

**users.json:**
```json
[
  {
    "email": "test@example.com",
    "password": "Test@123",
    "role": "user"
  },
  {
    "email": "admin@example.com",
    "password": "Admin@123",
    "role": "admin"
  }
]
```

**test-scenarios.csv:**
```csv
scenario,email,password,expected
valid_login,test@example.com,Test@123,success
invalid_password,test@example.com,wrong,error
empty_fields,,,error
```

---

## 📈 Test Results (`/test-results`)

```
test-results/               # Generated (gitignored)
├── reports/               # HTML reports
│   └── index.html        # Latest report
├── screenshots/           # Failure screenshots
├── videos/               # Test recordings
└── traces/               # Playwright traces
```

**Generated Automatically:**
- Run tests to create results
- View report: `npm run test:report`
- Screenshots/videos saved on failure

---

## 🎯 Key Files

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts |
| `playwright.config.ts` | Playwright settings (browsers, devices) |
| `tsconfig.json` | TypeScript compiler config |
| `.gitignore` | Files to ignore in git |

### Important Scripts

```json
{
  "test": "playwright test",
  "test:web": "playwright test src/tests/web",
  "test:api": "playwright test src/tests/api",
  "test:mobile": "playwright test src/tests/mobile",
  "test:report": "playwright show-report",
  "ai-generate": "node src/cli/ai-generator.js"
}
```

---

## 🚀 Quick Navigation

### I want to...

**→ Write a new test**
- Go to `src/tests/web/` (or api/mobile)
- Use page objects from `src/core/page-objects/`
- Run: `npm test`

**→ Generate test from user story**
- Run: `npm run ai-generate`
- Enter your story
- Find generated test in `src/tests/generated/`

**→ Use data-driven testing**
- Add data to `test-data/`
- Use providers from `src/data-driven/providers/`
- See examples in `src/data-driven/examples/`

**→ Create a page object**
- Add to `src/core/page-objects/`
- Extend `BasePage`
- Use in tests

**→ View test results**
- Run: `npm run test:report`
- Check: `test-results/reports/`

**→ Troubleshoot**
- Read: [docs/troubleshooting.md](troubleshooting.md)
- Check logs in `test-results/`

---

## 📝 Adding New Files

### Adding a Test

```typescript
// src/tests/web/my-new-test.spec.ts
import { test, expect } from '@playwright/test';
import { MyPage } from '@/core/page-objects/MyPage';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    const myPage = new MyPage(page);
    await myPage.doSomething();
    await expect(page).toHaveURL('/expected');
  });
});
```

### Adding a Page Object

```typescript
// src/core/page-objects/MyPage.ts
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  async doSomething() {
    await this.click('.my-button');
  }
}
```

### Adding Test Data

```json
// test-data/my-data.json
[
  { "field1": "value1", "field2": "value2" },
  { "field1": "value3", "field2": "value4" }
]
```

---

## 🔍 Understanding Module Relationships

```
User Story
    ↓
[AI Generator CLI] (src/cli/ai-generator.js)
    ↓
[AI Logic] (src/reporting/ai_test_generator.py)
    ↓
Generated Test (src/tests/generated/*.spec.ts)
    ↓
[Page Objects] (src/core/page-objects/)
    ↓
[Test Data] (test-data/)
    ↓
[Test Execution] (Playwright)
    ↓
[Reports] (test-results/reports/)
```

---

## 💡 Best Practices

1. **Tests**: Keep in `src/tests/` organized by type
2. **Page Objects**: One file per page in `src/core/page-objects/`
3. **Test Data**: Centralized in `test-data/`
4. **Documentation**: Add to `docs/` if creating guides
5. **Generated Files**: Never commit `test-results/`

---

## 🆘 Need Help?

- **Documentation**: Check `docs/` folder
- **Examples**: Look at existing tests in `src/tests/`
- **Data-driven**: See `src/data-driven/examples/`
- **Issues**: Read [troubleshooting.md](troubleshooting.md)

---

**Last Updated**: 2025-10-29  
**Version**: 1.0.0  
**Framework**: Playwright + TypeScript + Node.js
