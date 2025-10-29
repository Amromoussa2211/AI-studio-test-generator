// Main exports for the Simple Testing Framework

// Test utilities
export { 
  TestConfig, 
  BrowserUtils, 
  APIUtils, 
  MobileUtils, 
  FileUtils 
} from './utils/test-utils';

// Page objects
export { 
  BasePage, 
  FormElements, 
  TableElements 
} from './pages/base-page';

export { 
  HomePage, 
  LoginPage, 
  DashboardPage, 
  ProductsPage 
} from './pages/example-pages';

// Configuration
export { 
  playwrightConfig,
  testEnvironment,
  reportingConfig,
  apiConfig,
  databaseConfig,
  mobileConfig,
  performanceConfig,
  securityConfig
} from '../config/test-config';

export default {
  version: '1.0.0',
  description: 'Simple Testing Framework with Playwright and TypeScript'
};