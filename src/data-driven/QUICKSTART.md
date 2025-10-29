# Quick Start Guide

Get up and running with the Data-Driven Testing Framework in 5 minutes!

## 📋 Prerequisites

- Node.js 12.0 or higher
- Basic JavaScript knowledge

## 🚀 5-Minute Setup

### Step 1: Create Test Data File

Create `test-data.json`:
```json
{
  "loginTests": [
    {
      "username": "validuser",
      "password": "validpass123",
      "expectedResult": "success"
    },
    {
      "username": "invaliduser",
      "password": "wrongpass",
      "expectedResult": "failure"
    },
    {
      "username": "",
      "password": "",
      "expectedResult": "validation_error"
    }
  ]
}
```

### Step 2: Write Your First Test

Create `my-first-test.js`:
```javascript
const { JsonProvider, TestExecutor, DataValidator } = require('./data-driven');

async function runLoginTests() {
    // 1. Load test data
    const dataProvider = new JsonProvider();
    await dataProvider.load('./test-data.json');
    
    // 2. Create test executor
    const executor = new TestExecutor();
    
    // 3. Define test function
    const testFunction = async (testData, index) => {
        console.log(`\n🧪 Test ${index + 1}: ${testData.username}`);
        
        // Validate test data
        DataValidator.hasRequiredProperties(testData, ['username', 'password', 'expectedResult']);
        
        // Simulate login test
        const loginResult = await simulateLogin(testData.username, testData.password);
        
        console.log(`   Expected: ${testData.expectedResult}`);
        console.log(`   Actual: ${loginResult}`);
        
        if (loginResult !== testData.expectedResult) {
            throw new Error(`Mismatch: expected ${testData.expectedResult}, got ${loginResult}`);
        }
    };
    
    // 4. Execute tests
    const result = await executor.execute(testFunction, dataProvider, {
        testName: 'Login Functionality Test'
    });
    
    // 5. Show results
    console.log(`\n📊 Test Results:`);
    console.log(`   Total: ${result.total}`);
    console.log(`   Passed: ${result.passed}`);
    console.log(`   Failed: ${result.failed}`);
    console.log(`   Success Rate: ${result.successRate}%`);
    
    // 6. Generate report
    await executor.generateReport('html', 'test-report.html');
    console.log(`\n📄 Report saved to: test-report.html`);
}

// Simulate login function
async function simulateLogin(username, password) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
    
    if (!username || !password) {
        return 'validation_error';
    }
    
    if (username === 'validuser' && password === 'validpass123') {
        return 'success';
    }
    
    return 'failure';
}

// Run the tests
runLoginTests().catch(console.error);
```

### Step 3: Run Your Test

```bash
node my-first-test.js
```

Expected output:
```
🚀 Starting Data-Driven Test: Login Functionality Test
📊 Running 3 test cases

🧪 Test 1: validuser
   Expected: success
   Actual: success
✅ Test case 1 passed

🧪 Test 2: invaliduser
   Expected: failure
   Actual: failure
✅ Test case 2 passed

🧪 Test 3: 
   Expected: validation_error
   Actual: validation_error
✅ Test case 3 passed

✅ Login Functionality Test: 3/3 passed

📊 Test Results:
   Total: 3
   Passed: 3
   Failed: 0
   Success Rate: 100.00%

📄 Report saved to: test-report.html
```

## 📝 Common Patterns

### Pattern 1: CSV Data Testing

```javascript
const { CsvProvider, TestExecutor } = require('./data-driven');

const csvData = `testcase,input,expected
add,2+3,5
subtract,10-4,6
multiply,3*7,21`;

const provider = new CsvProvider();
provider.loadFromString(csvData);

const executor = new TestExecutor();

const testFunction = async (testData) => {
    const result = eval(testData.input); // Simple calculator test
    if (result.toString() !== testData.expected) {
        throw new Error(`Expected ${testData.expected}, got ${result}`);
    }
};

await executor.execute(testFunction, provider, {
    testName: 'Calculator Tests'
});
```

### Pattern 2: Data Generation

```javascript
const { DataGenerator } = require('./data-driven');

const generator = new DataGenerator(42);

// Generate test users
const users = DataGenerator.generateDataset(() => ({
    name: generator.randomFullName(),
    email: generator.randomEmail(),
    age: generator.randomInt(18, 80),
    phone: generator.randomPhone()
}), 5);

console.log('Generated users:', users);
```

### Pattern 3: Test Data Management

```javascript
const { DataManager } = require('./data-driven');

const manager = new DataManager({ testIsolation: true });

// Create isolated test data
const testData = manager.createTestData('user_test_001', {
    username: 'testuser',
    email: 'test@example.com'
});

// Use in test
console.log('Test data:', testData);

// Cleanup
manager.cleanupTestData('user_test_001');
```

### Pattern 4: Validation

```javascript
const { DataValidator } = require('./data-driven');

const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
};

// Validate user data
DataValidator.hasRequiredProperties(userData, ['name', 'email']);
DataValidator.isValidEmail(userData.email);
DataValidator.isInRange(userData.age, 18, 120, 'age');

console.log('✅ User data is valid');
```

### Pattern 5: Web Testing Example

```javascript
const { WebExamples } = require('./data-driven');

const webExamples = new WebExamples();

// Run login form test
await webExamples.loginFormTest();

// Or run all web examples
await webExamples.runAllExamples();
```

### Pattern 6: API Testing Example

```javascript
const { ApiExamples } = require('./data-driven');

const apiExamples = new ApiExamples();

// Run authentication tests
await apiExamples.userAuthenticationTest();
```

## 🎯 Next Steps

1. **Explore Examples**: Run `node demo.js` for full demo
2. **Read Documentation**: Check `README.md` for detailed docs
3. **Customize**: Adapt examples for your specific needs
4. **Integrate**: Add to your existing test suite

## 📁 File Structure

After creating your files:
```
your-project/
├── test-data.json          # Your test data
├── my-first-test.js        # Your test file
└── node_modules/           # Dependencies (if any)
    └── data-driven/        # Framework files
```

## 🔧 Troubleshooting

### Issue: "Cannot find module './data-driven'"
**Solution**: Ensure you're running from the correct directory
```bash
node my-first-test.js
```

### Issue: Test data not loading
**Solution**: Check file path and JSON format
```bash
# Verify JSON is valid
node -e "console.log(JSON.parse(require('fs').readFileSync('test-data.json')))"
```

### Issue: Tests timing out
**Solution**: Increase timeout or check test logic
```javascript
const result = await executor.execute(testFunction, dataProvider, {
    testName: 'My Test',
    timeout: 60000 // 60 seconds
});
```

## 💡 Tips

1. **Start Small**: Begin with simple test cases
2. **Validate Data**: Always validate test data before use
3. **Use Isolation**: Enable test data isolation for clean tests
4. **Generate Reports**: Use HTML reports for better visualization
5. **Parallel Execution**: Use parallel tests for faster execution

## 🎉 You're Ready!

You now have a working data-driven testing setup. Try:
- Running the full demo: `node demo.js`
- Exploring web examples: Create your own web tests
- Testing APIs: Add your API endpoints
- Generating reports: Check the HTML output

Happy Testing! 🎯
