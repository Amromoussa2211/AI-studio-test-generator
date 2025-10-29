import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Test directory
  testDir: './src/tests',
  
  // Test timeout settings
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['line']
  ],
  
  // Shared settings for all the projects
  use: {
    // Base URL to use in actions like await page.goto('/')
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },
  
  // Configure projects for different testing scenarios
  projects: [
    // Web Testing - Desktop Browsers
    {
      name: 'web-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'web-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'web-webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile Testing - Device Emulation
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'mobile-android',
      use: { ...devices['Galaxy S II'] },
    },
    
    // API Testing
    {
      name: 'api',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.api\.spec\.ts$/,
    },
  ],
  
  // Run local dev server before starting the tests
  webServer: process.env.START_DEV_SERVER === 'true' ? {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  } : undefined,
});
