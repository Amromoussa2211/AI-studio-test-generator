/**
 * Playwright Test Configuration
 */
export const playwrightConfig = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  retries: parseInt(process.env.RETRY_COUNT || '0'),
  workers: parseInt(process.env.PARALLEL_WORKERS || '4'),
  headless: process.env.HEADLESS === 'true',
  screenshotOnFailure: true,
  videoOnFailure: true,
  traceOnRetry: true,
  
  // Browser configurations
  browsers: {
    chromium: {
      name: 'chromium',
      headless: process.env.HEADLESS !== 'false'
    },
    firefox: {
      name: 'firefox',
      headless: process.env.HEADLESS !== 'false'
    },
    webkit: {
      name: 'webkit',
      headless: process.env.HEADLESS !== 'false'
    }
  },
  
  // Device configurations
  devices: {
    mobile: ['Pixel 5', 'iPhone 12', 'Galaxy S21'],
    tablet: ['iPad', 'Galaxy Tab'],
    desktop: ['Desktop Chrome', 'Desktop Firefox', 'Desktop Safari']
  }
};

/**
 * Test Environment Configuration
 */
export const testEnvironment = {
  name: process.env.NODE_ENV || 'development',
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
  databaseURL: process.env.DATABASE_URL || '',
  
  // Timeouts
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    api: parseInt(process.env.API_TIMEOUT || '10000'),
    pageLoad: parseInt(process.env.PAGE_LOAD_TIMEOUT || '30000'),
    element: parseInt(process.env.ELEMENT_TIMEOUT || '5000')
  },
  
  // Retry configuration
  retry: {
    count: parseInt(process.env.RETRY_COUNT || '0'),
    strategy: process.env.RETRY_STRATEGY || 'on-failure' // 'always', 'on-failure', 'never'
  }
};

/**
 * Reporting Configuration
 */
export const reportingConfig = {
  outputDir: 'test-results',
  screenshotsDir: 'test-results/screenshots',
  videosDir: 'test-results/videos',
  tracesDir: 'test-results/traces',
  
  // Reporters
  reporters: [
    {
      type: 'html',
      output: 'playwright-report'
    },
    {
      type: 'json',
      output: 'test-results/results.json'
    },
    {
      type: 'junit',
      output: 'test-results/results.xml'
    }
  ],
  
  // Test results retention
  retention: {
    keepFailedTests: true,
    keepSuccessfulTests: false,
    maxReports: 10
  }
};

/**
 * API Testing Configuration
 */
export const apiConfig = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
  
  // Authentication
  auth: {
    type: process.env.API_AUTH_TYPE || 'bearer', // 'bearer', 'basic', 'api-key'
    token: process.env.API_TOKEN || '',
    apiKey: process.env.API_KEY || '',
    username: process.env.API_USERNAME || '',
    password: process.env.API_PASSWORD || ''
  },
  
  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Playwright-Test-Framework/1.0'
  },
  
  // Rate limiting
  rateLimit: {
    requests: parseInt(process.env.API_RATE_LIMIT || '100'),
    windowMs: parseInt(process.env.API_RATE_WINDOW || '60000') // 1 minute
  }
};

/**
 * Database Configuration (for tests that need it)
 */
export const databaseConfig = {
  type: process.env.DB_TYPE || 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  name: process.env.DB_NAME || 'test_db',
  user: process.env.DB_USER || 'test_user',
  password: process.env.DB_PASSWORD || 'test_password',
  
  // Connection pool
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10')
  },
  
  // Test data cleanup
  cleanup: {
    beforeTest: process.env.DB_CLEANUP_BEFORE === 'true',
    afterTest: process.env.DB_CLEANUP_AFTER === 'true',
    strategy: process.env.DB_CLEANUP_STRATEGY || 'truncate' // 'truncate', 'delete', 'drop-create'
  }
};

/**
 * Mobile Testing Configuration
 */
export const mobileConfig = {
  // Default device settings
  defaultDevice: 'iPhone 12',
  
  // Viewport settings
  viewports: {
    small: { width: 320, height: 568 },
    medium: { width: 768, height: 1024 },
    large: { width: 1024, height: 768 },
    extraLarge: { width: 1920, height: 1080 }
  },
  
  // Touch interaction settings
  touch: {
    enabled: true,
    tapTimeout: 100,
    swipeTimeout: 500,
    longPressTimeout: 1000
  },
  
  // Network throttling for mobile testing
  network: {
    slow3G: {
      download: 500 * 1024 / 8, // 500 Kbps
      upload: 500 * 1024 / 8,   // 500 Kbps
      latency: 400              // 400ms
    },
    fast3G: {
      download: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      upload: 750 * 1024 / 8,           // 750 Kbps
      latency: 150                      // 150ms
    }
  }
};

/**
 * Performance Testing Configuration
 */
export const performanceConfig = {
  // Load time thresholds (milliseconds)
  thresholds: {
    pageLoad: parseInt(process.env.PAGE_LOAD_THRESHOLD || '3000'),
    apiResponse: parseInt(process.env.API_RESPONSE_THRESHOLD || '1000'),
    elementInteraction: parseInt(process.env.ELEMENT_INTERACTION_THRESHOLD || '500')
  },
  
  // Metrics to collect
  metrics: {
    pageLoadTime: true,
    firstContentfulPaint: true,
    largestContentfulPaint: true,
    cumulativeLayoutShift: true,
    firstInputDelay: true
  },
  
  // Memory monitoring
  memory: {
    enabled: process.env.MEMORY_MONITORING === 'true',
    threshold: parseInt(process.env.MEMORY_THRESHOLD || '100') // MB
  }
};

/**
 * Security Testing Configuration
 */
export const securityConfig = {
  // XSS testing
  xss: {
    enabled: process.env.XSS_TESTING === 'true',
    payloads: [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')">'
    ]
  },
  
  // SQL injection testing
  sqlInjection: {
    enabled: process.env.SQL_INJECTION_TESTING === 'true',
    payloads: [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --"
    ]
  },
  
  // Authentication testing
  auth: {
    testInvalidCredentials: true,
    testSessionManagement: true,
    testPasswordStrength: true
  }
};

export default {
  playwright: playwrightConfig,
  environment: testEnvironment,
  reporting: reportingConfig,
  api: apiConfig,
  database: databaseConfig,
  mobile: mobileConfig,
  performance: performanceConfig,
  security: securityConfig
};