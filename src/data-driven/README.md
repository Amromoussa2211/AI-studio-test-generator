# JavaScript Data-Driven Testing Framework

A comprehensive, easy-to-use data-driven testing framework for JavaScript that supports web, mobile, and API testing.

## 🚀 Features

- **Multiple Data Providers**: JSON, CSV, and custom data sources
- **Parameterized Testing**: Execute tests with different data sets
- **Data Validation**: Built-in validation utilities
- **Data Transformation**: Flexible data mapping and transformation
- **Test Data Generation**: Generate realistic test data
- **Test Isolation**: Manage test data lifecycle
- **Multi-Platform Support**: Web, Mobile, and API testing examples
- **Reporting**: Generate HTML, JSON, and CSV reports
- **Simple API**: Easy to learn and implement

## 📦 Installation

```bash
# Clone or copy the framework files
cp -r simple-testing-framework/src/data-driven ./your-project/

# No additional dependencies required (uses Node.js built-in modules)
```

## 🏗️ Architecture

```
src/data-driven/
├── index.js              # Main entry point
├── core/
│   └── test-executor.js  # Test execution engine
├── providers/
│   ├── data-provider.js  # Base data provider
│   ├── json-provider.js  # JSON data loader
│   └── csv-provider.js   # CSV data loader
├── utils/
│   ├── data-validator.js # Data validation utilities
│   └── data-transformer.js # Data transformation utilities
├── generators/
│   └── data-generator.js # Test data generation
├── managers/
│   └── data-manager.js   # Test data management
└── examples/
    ├── web-examples.js   # Web testing examples
    ├── mobile-examples.js # Mobile testing examples
    ├── api-examples.js   # API testing examples
    └── demo.js           # Complete demo
```

## 🎯 Quick Start

### 1. Basic Setup

```javascript
const {
    JsonProvider,
    TestExecutor,
    DataValidator,
    DataTransformer
} = require('./data-driven');

// Create test executor
const executor = new TestExecutor();

// Load test data
const jsonProvider = new JsonProvider();
await jsonProvider.load('./test-data.json');

// Define test function
const testFunction = async (testData, index) => {
    // Validate data
    DataValidator.isNotEmpty(testData.username, 'username');
    DataValidator.isValidEmail(testData.email, 'email');
    
    // Execute test logic
    console.log(`Testing user: ${testData.username}`);
    
    // Your test assertions here
    if (!testData.email.includes('@')) {
        throw new Error('Invalid email format');
    }
};

// Execute tests
const result = await executor.execute(testFunction, jsonProvider, {
    testName: 'User Validation Test',
    parallel: false
});

console.log(`✅ Passed: ${result.passed}/${result.total}`);
```

### 2. CSV Data Example

```javascript
const { CsvProvider, TestExecutor } = require('./data-driven');

const csvData = `username,password,expectedResult
user1,pass123,success
user2,pass456,failure
user3,pass789,success`;

const csvProvider = new CsvProvider();
csvProvider.loadFromString(csvData);

const testFunction = async (testData) => {
    console.log(`Testing login for: ${testData.username}`);
    
    // Your login test logic here
    const loginSuccess = testData.expectedResult === 'success';
    
    if (!loginSuccess) {
        throw new Error(`Expected ${testData.expectedResult} but got different result`);
    }
};

const result = await executor.execute(testFunction, csvProvider, {
    testName: 'Login Test'
});
```

### 3. Data Generation

```javascript
const { DataGenerator } = require('./data-driven');

const generator = new DataGenerator(42); // Seed for reproducible tests

// Generate users
const users = DataGenerator.generateDataset(() => ({
    name: generator.randomFullName(),
    email: generator.randomEmail(),
    age: generator.randomInt(18, 80)
}), 10);

// Generate products
const products = DataGenerator.generateDataset(() => ({
    id: generator.randomUUID(),
    name: generator.randomProduct().name,
    price: generator.randomFloat(10, 1000, 2)
}), 5);

console.log('Generated users:', users);
console.log('Generated products:', products);
```

## 📋 Core Components

### Data Providers

#### JsonProvider
```javascript
const provider = new JsonProvider();

// Load from file
await provider.load('./data.json');

// Load from string
await provider.loadFromString('{"users": [...]}');

// Load from URL
await provider.loadFromUrl('https://api.example.com/data');

// Multiple files
await provider.loadMultiple(['data1.json', 'data2.json']);
```

#### CsvProvider
```javascript
const provider = new CsvProvider({
    delimiter: ',',
    headers: true,
    trim: true
});

// Load from string
provider.loadFromString(`name,email,age
John,john@example.com,30
Jane,jane@example.com,25`);

// Get data as objects (when headers=true)
const objects = provider.getAsObjects();

// Filter by column
const filtered = provider.filterByColumn('age', 30);
```

### Test Executor

```javascript
const executor = new TestExecutor();

// Basic execution
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'My Test',
    parallel: false,
    maxRetries: 1,
    timeout: 30000
});

// Platform-specific execution
await executor.executeWebTest(testFunction, dataProvider, options);
await executor.executeMobileTest(testFunction, dataProvider, options);
await executor.executeApiTest(testFunction, dataProvider, options);

// Event listeners
executor.on('testStart', (data) => console.log('Test started:', data.testName));
executor.on('testSuccess', (data) => console.log('Test passed:', data.testName));
executor.on('testFailure', (data) => console.log('Test failed:', data.error));
```

### Data Validation

```javascript
const { DataValidator } = require('./data-driven');

// Basic validations
DataValidator.isNotNull(value, 'fieldName');
DataValidator.isNotEmpty(value, 'fieldName');
DataValidator.isValidEmail(email, 'email');
DataValidator.isValidUrl(url, 'url');
DataValidator.isInRange(number, 0, 100, 'number');
DataValidator.hasValidLength(string, 1, 50, 'string');
DataValidator.hasMinimumItems(array, 1, 'array');

// Complex validations
const result = DataValidator.validateDataSet(dataArray, {
    requiredFields: ['id', 'name'],
    fieldTypes: {
        id: 'number',
        name: 'string'
    },
    fieldConstraints: {
        age: { min: 18, max: 100 }
    }
});
```

### Data Transformation

```javascript
const { DataTransformer } = require('./data-driven');

// Field mapping
const mapped = DataTransformer.transformWithMapping(data, {
    'fullName': 'name',
    'userEmail': 'email',
    'age': (data) => data.age
});

// Flatten/unflatten
const flattened = DataTransformer.flattenObject(nestedData);
const unflattened = DataTransformer.unflattenObject(flattened);

// Sorting and filtering
const filtered = DataTransformer.filter(array, item => item.age > 18);
const sorted = DataTransformer.sort(array, 'name', 'asc');

// Grouping
const grouped = DataTransformer.groupBy(array, 'category');

// Dataset transformations
const transformed = DataTransformer.transformDataset(data, {
    fieldMapping: { ... },
    filters: [ ... ],
    sorts: [ ... ]
});
```

### Data Management

```javascript
const { DataManager } = require('./data-driven');

const manager = new DataManager({ testIsolation: true });

// Create isolated test data
const testData = manager.createTestData('test_001', {
    username: 'testuser',
    email: 'test@example.com'
}, {
    autoIncrement: false,
    timestamp: true
});

// Clone test data
const clones = manager.cloneTestData('test_001', 5, (cloneData, index) => ({
    username: `testuser_${index}`
}));

// Create dataset
const dataset = manager.createDataset('users', () => ({
    id: generator.randomUUID(),
    name: generator.randomFullName()
}), 10);

// Get data
const data = manager.getTestData('test_001');
const userDataset = manager.getDataset('users');

// Cleanup
manager.cleanupTestData('test_001');
manager.cleanupAll(); // Clean all data
```

## 🔧 Configuration Options

### Data Provider Options

```javascript
// JsonProvider
const jsonProvider = new JsonProvider({
    encoding: 'utf8',
    validateSchema: true,
    schema: jsonSchema
});

// CsvProvider
const csvProvider = new CsvProvider({
    delimiter: ',',
    headers: true,
    trim: true,
    skipEmptyLines: true,
    encoding: 'utf8'
});
```

### Test Executor Options

```javascript
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'Test Name',
    dataIndex: null, // Execute specific index or all
    parallel: false,
    maxRetries: 0,
    timeout: 30000,
    beforeEach: async (data) => { /* setup */ },
    afterEach: async (data) => { /* cleanup */ }
});
```

### Data Manager Options

```javascript
const manager = new DataManager({
    testIsolation: true,    // Enable test isolation
    autoCleanup: true       // Auto cleanup after tests
});
```

## 📊 Examples by Test Type

### Web Testing

```javascript
const { WebExamples } = require('./data-driven');

const webExamples = new WebExamples();

// Run all web examples
const results = await webExamples.runAllExamples();

// Or run specific examples
await webExamples.loginFormTest();
await webExamples.checkoutProcessTest();
await webExamples.searchFunctionalityTest();
```

### Mobile Testing

```javascript
const { MobileExamples } = require('./data-driven');

const mobileExamples = new MobileExamples();

await mobileExamples.appLoginTest();
await mobileExamples.userRegistrationTest();
await mobileExamples.shoppingCartTest();
await mobileExamples.pushNotificationTest();
```

### API Testing

```javascript
const { ApiExamples } = require('./data-driven');

const apiExamples = new ApiExamples();

await apiExamples.userAuthenticationTest();
await apiExamples.productCatalogTest();
await apiExamples.dataValidationTest();
await apiExamples.performanceTest();
```

## 📈 Reporting

### Generate Reports

```javascript
// Generate different report formats
const htmlReport = await executor.generateReport('html', 'test-report.html');
const jsonReport = await executor.generateReport('json', 'test-report.json');
const csvReport = await executor.generateReport('csv', 'test-report.csv');

// Export data manager data
const dataExport = dataManager.exportData('json');
```

### Report Structure

- **Summary**: Total tests, passed, failed, success rate
- **Test Details**: Individual test results with errors
- **Performance Metrics**: Execution time, retry counts
- **Data Coverage**: Data provider statistics

## 🎯 Best Practices

### 1. Test Data Management

```javascript
// Use data isolation
const manager = new DataManager({ testIsolation: true });

// Create test-specific data
const testData = manager.createTestData('user_creation_test', {
    username: 'testuser',
    email: 'test@example.com'
});

// Cleanup after test
try {
    // Run test
    await runUserCreationTest(testData);
} finally {
    manager.cleanupTestData('user_creation_test');
}
```

### 2. Data Validation

```javascript
// Always validate input data
const testFunction = async (data, index) => {
    // Validate required fields
    DataValidator.hasRequiredProperties(data, ['username', 'email']);
    
    // Validate field types
    DataValidator.isValidEmail(data.email);
    
    // Validate business rules
    if (data.age && (data.age < 18 || data.age > 120)) {
        throw new Error('Invalid age');
    }
    
    // Run test
    await performUserTest(data);
};
```

### 3. Error Handling

```javascript
// Use retry logic for flaky tests
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'Flaky API Test',
    maxRetries: 2,
    beforeEach: async (data) => {
        // Reset state before each attempt
        await resetTestEnvironment();
    }
});

// Add event listeners for monitoring
executor.on('testFailure', (result) => {
    console.error(`Test failed: ${result.testName}`, result.error);
});
```

### 4. Performance Considerations

```javascript
// Use parallel execution for independent tests
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'Independent Tests',
    parallel: true,
    maxParallel: 5
});

// Use sequential execution for shared resources
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'Shared Database Tests',
    parallel: false
});
```

## 🧪 Demo

Run the complete demo to see all features:

```bash
node demo.js
```

This will demonstrate:
- Data loading and validation
- Data generation
- Test execution
- Reporting
- All example test types

## 📝 Sample Test Data

### JSON Format
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ]
}
```

### CSV Format
```csv
id,name,email,role
1,John Doe,john@example.com,admin
2,Jane Smith,jane@example.com,user
3,Bob Johnson,bob@example.com,user
```

## 🔍 Troubleshooting

### Common Issues

1. **Data not loaded**
   - Ensure `await provider.load()` is called
   - Check file paths and permissions

2. **Validation errors**
   - Verify data structure matches expectations
   - Check required fields are present

3. **Test timeouts**
   - Increase timeout value in options
   - Check for infinite loops in test logic

4. **Memory issues with large datasets**
   - Use pagination or chunking
   - Process data in smaller batches

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🎉 Getting Started Checklist

- [ ] Copy framework files to your project
- [ ] Create your test data files (JSON/CSV)
- [ ] Define test functions
- [ ] Set up test executor
- [ ] Run your first data-driven test
- [ ] Generate test reports
- [ ] Implement data management
- [ ] Add validation rules
- [ ] Set up CI/CD integration

---

**Happy Testing! 🎯**
