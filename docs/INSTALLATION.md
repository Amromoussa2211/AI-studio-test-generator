# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** version 16.0 or higher
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Quick Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all the necessary dependencies including:
- Playwright for web and mobile testing
- TypeScript for type safety
- ESLint and Prettier for code quality
- Additional utilities for API and data handling

### Step 2: Install Playwright Browsers

```bash
npx playwright install
```

This installs the required browser binaries:
- Chromium (Chrome)
- Firefox
- WebKit (Safari)

### Step 3: Set Up Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.development
```

Update the `.env.development` file with your specific configuration:

```bash
# Application URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080/api

# Test Settings
DEFAULT_TIMEOUT=30000
RETRY_COUNT=0
PARALLEL_WORKERS=4

# Browser Settings
HEADLESS=false
BROWSER_TIMEOUT=30000

# Dev Server
START_DEV_SERVER=true
DEV_SERVER_PORT=3000
```

## Verify Installation

Run a simple test to verify everything is working:

```bash
npm test
```

You should see test results in the terminal and generated HTML reports.

## Project Structure

After installation, your project structure should look like:

```
simple-testing-framework/
├── node_modules/          # Dependencies
├── src/
│   ├── tests/
│   │   ├── api/          # API tests
│   │   ├── web/          # Web tests
│   │   └── mobile/       # Mobile tests
│   ├── pages/            # Page Object Model
│   └── utils/            # Test utilities
├── data/                 # Test data files
├── config/               # Configuration files
├── test-results/         # Generated test results
└── docs/                 # Documentation
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Run tests with Playwright UI |
| `npm run test:headed` | Run tests with browsers visible |
| `npm run test:debug` | Run in debug mode |
| `npm run test:api` | Run only API tests |
| `npm run test:web` | Run only web tests |
| `npm run test:mobile` | Run only mobile tests |
| `npm run build` | Build TypeScript files |
| `npm run clean` | Clean build artifacts |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Configuration

### Environment Files

- `.env.example` - Template with all available options
- `.env.development` - Local development settings
- `.env` - Production or custom settings

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test projects (browser/device combinations)
- Timeout settings
- Retry behavior
- Reporter configuration

### TypeScript Configuration

The `tsconfig.json` file is pre-configured with:
- ES2020 target
- CommonJS module system
- Strict type checking enabled
- Path mapping for clean imports

## Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
If you encounter compatibility errors:
```bash
node --version  # Should be 16.0+
npm --version   # Should be 7.0+
```

#### 2. Playwright Installation Fails
Try installing specific browsers:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

#### 3. Permission Issues
On some systems, you may need to use `sudo` or configure npm differently:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### 4. Browser Download Issues
If browser downloads fail, you can manually download them:
```bash
npx playwright install-deps
```

#### 5. TypeScript Compilation Errors
Check TypeScript configuration:
```bash
npm run build
```

### Getting Help

If you encounter issues:

1. Check the main [README.md](README.md) for configuration examples
2. Review the [documentation](../docs/) for detailed guides
3. Look at example tests in the `src/tests/` directory
4. Check the troubleshooting section in the main README

## Next Steps

After successful installation:

1. **Read the Quick Start Guide** in the main README
2. **Explore Example Tests** in `src/tests/`
3. **Learn about Page Objects** in `src/pages/`
4. **Configure for Your Application** by updating test data and URLs
5. **Set up CI/CD** integration for automated testing

## Development Setup

For active development, consider installing additional tools:

```bash
# VS Code extensions (recommended)
# - Playwright Test for VSCode
# - TypeScript Importer
# - ESLint
# - Prettier

# Git hooks for code quality
npm install --save-dev husky lint-staged
npx husky install
```

## Building from Source

If you need to modify the framework:

1. Make your changes in TypeScript files
2. Run `npm run build` to compile
3. Run `npm test` to verify changes
4. Update documentation as needed

The framework is designed to be easily extensible and customizable for your specific testing needs.