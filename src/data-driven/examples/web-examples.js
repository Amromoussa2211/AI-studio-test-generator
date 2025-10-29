/**
 * Web Testing Examples
 * Demonstrates data-driven testing for web applications
 */
const { JsonProvider, CsvProvider, TestExecutor, DataValidator, DataTransformer } = require('../index');

class WebExamples {
    constructor() {
        this.executor = new TestExecutor();
    }

    /**
     * Example 1: Login form testing with CSV data
     */
    async loginFormTest() {
        console.log('🌐 Example 1: Login Form Testing with CSV Data\n');

        // Create CSV test data
        const csvData = `username,password,expectedResult,errorMessage
validuser,validpass123,success,Invalid login
invaliduser,wrongpass,failure,Invalid username or password
emptyuser,,failure,Username is required
,emptypass,failure,Password is required
admin,admin123,success,Access denied
testuser,testpass,failure,Account locked`;

        const csvProvider = new CsvProvider();
        csvProvider.loadFromString(csvData);

        // Test function
        const testFunction = async (testData, index) => {
            console.log(`\n🔍 Testing login case ${index + 1}:`, testData);

            // Validate test data
            DataValidator.hasValidLength(testData.username, 0, 50, 'username');
            
            // Simulate login test
            await this.simulateLogin(testData.username, testData.password, testData.expectedResult);
            
            console.log(`✅ Login test completed for case ${index + 1}`);
        };

        // Execute tests
        const result = await this.executor.executeWebTest(testFunction, csvProvider, {
            testName: 'Login Form Test',
            parallel: false
        });

        return result;
    }

    /**
     * Example 2: E-commerce checkout with JSON data
     */
    async checkoutProcessTest() {
        console.log('\n🛒 Example 2: E-commerce Checkout Process Test\n');

        const jsonData = {
            orders: [
                {
                    customerId: "CUST_001",
                    items: [
                        { productId: "PROD_001", name: "Laptop", price: 999.99, quantity: 1 },
                        { productId: "PROD_002", name: "Mouse", price: 29.99, quantity: 2 }
                    ],
                    shippingAddress: {
                        street: "123 Main St",
                        city: "New York",
                        zipCode: "10001"
                    },
                    paymentMethod: "credit_card",
                    expectedTotal: 1059.97
                },
                {
                    customerId: "CUST_002",
                    items: [
                        { productId: "PROD_003", name: "Keyboard", price: 79.99, quantity: 1 }
                    ],
                    shippingAddress: {
                        street: "456 Oak Ave",
                        city: "Los Angeles",
                        zipCode: "90210"
                    },
                    paymentMethod: "paypal",
                    expectedTotal: 79.99
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(jsonData));

        const testFunction = async (orderData, index) => {
            console.log(`\n🛍️ Testing checkout for order ${index + 1}:`, orderData.customerId);

            // Validate order data
            DataValidator.hasRequiredProperties(orderData, ['customerId', 'items', 'shippingAddress']);
            DataValidator.hasMinimumItems(orderData.items, 1, 'order items');

            // Simulate checkout process
            const total = await this.simulateCheckout(orderData);
            
            console.log(`✅ Checkout completed. Total: $${total} (Expected: $${orderData.expectedTotal})`);
            
            if (Math.abs(total - orderData.expectedTotal) > 0.01) {
                throw new Error(`Total mismatch: got $${total}, expected $${orderData.expectedTotal}`);
            }
        };

        const result = await this.executor.executeWebTest(testFunction, jsonProvider, {
            testName: 'E-commerce Checkout Test',
            beforeEach: async (data) => {
                console.log(`🔧 Setting up checkout test for customer ${data.customerId}`);
            }
        });

        return result;
    }

    /**
     * Example 3: Search functionality with dynamic data
     */
    async searchFunctionalityTest() {
        console.log('\n🔍 Example 3: Search Functionality Test\n');

        // Generate search test data
        const searchQueries = [
            { query: "laptop", category: "Electronics", expectedResults: 15 },
            { query: "fiction books", category: "Books", expectedResults: 8 },
            { query: "running shoes", category: "Sports", expectedResults: 12 },
            { query: "kitchen utensils", category: "Home", expectedResults: 6 },
            { query: "smartphone", category: "Electronics", expectedResults: 20 }
        ];

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(searchQueries));

        const testFunction = async (searchData, index) => {
            console.log(`\n🔍 Testing search: "${searchData.query}" in ${searchData.category}`);

            // Validate search data
            DataValidator.isNotEmpty(searchData.query, 'search query');
            DataValidator.hasRequiredProperties(searchData, ['query', 'category', 'expectedResults']);

            // Simulate search
            const results = await this.simulateSearch(searchData.query, searchData.category);
            
            console.log(`📊 Search results: ${results.length} items found (expected: ${searchData.expectedResults})`);
            
            if (results.length < searchData.expectedResults) {
                throw new Error(`Insufficient search results: got ${results.length}, expected at least ${searchData.expectedResults}`);
            }
        };

        const result = await this.executor.executeWebTest(testFunction, jsonProvider, {
            testName: 'Search Functionality Test',
            parallel: true
        });

        return result;
    }

    /**
     * Example 4: Form validation with complex data
     */
    async formValidationTest() {
        console.log('\n📝 Example 4: Form Validation Test\n');

        const formData = {
            registrations: [
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "555-1234",
                    age: 25,
                    website: "https://johndoe.com",
                    valid: true
                },
                {
                    firstName: "Jane",
                    lastName: "",
                    email: "invalid-email",
                    phone: "123",
                    age: 150,
                    website: "not-a-url",
                    valid: false
                },
                {
                    firstName: "",
                    lastName: "Smith",
                    email: "jane.smith@test.com",
                    phone: "(555) 987-6543",
                    age: 30,
                    website: "https://test.org",
                    valid: true
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(formData));

        const testFunction = async (form, index) => {
            console.log(`\n📋 Testing registration form ${index + 1}:`, form.firstName, form.lastName);

            // Comprehensive validation
            const validationResult = await this.validateRegistrationForm(form);
            
            console.log(`✅ Form validation: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
            if (validationResult.isValid !== form.valid) {
                throw new Error(`Validation result mismatch: expected ${form.valid}, got ${validationResult.isValid}`);
            }

            if (!validationResult.isValid) {
                console.log(`⚠️ Validation errors: ${validationResult.errors.join(', ')}`);
            }
        };

        const result = await this.executor.executeWebTest(testFunction, jsonProvider, {
            testName: 'Form Validation Test'
        });

        return result;
    }

    /**
     * Example 5: Complete workflow test
     */
    async completeWorkflowTest() {
        console.log('\n🔄 Example 5: Complete User Workflow Test\n');

        const workflows = [
            {
                workflowName: "User Registration Flow",
                steps: [
                    { action: "navigate", url: "/register" },
                    { action: "fillForm", data: { firstName: "Alice", lastName: "Johnson" } },
                    { action: "submit" },
                    { action: "verify", expectedUrl: "/welcome" }
                ]
            },
            {
                workflowName: "Product Purchase Flow",
                steps: [
                    { action: "navigate", url: "/products" },
                    { action: "search", query: "laptop" },
                    { action: "selectProduct", index: 0 },
                    { action: "addToCart" },
                    { action: "checkout" },
                    { action: "verify", expectedUrl: "/confirmation" }
                ]
            }
        ];

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(workflows));

        const testFunction = async (workflow, index) => {
            console.log(`\n🔄 Executing workflow ${index + 1}: ${workflow.workflowName}`);

            // Execute workflow steps
            for (const [stepIndex, step] of workflow.steps.entries()) {
                console.log(`  Step ${stepIndex + 1}: ${step.action}`);
                await this.executeWorkflowStep(step);
            }

            console.log(`✅ Workflow completed: ${workflow.workflowName}`);
        };

        const result = await this.executor.executeWebTest(testFunction, jsonProvider, {
            testName: 'Complete Workflow Test'
        });

        return result;
    }

    // Simulation methods (replace with actual test implementations)

    async simulateLogin(username, password, expectedResult) {
        // Simulate login API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (username === 'validuser' && password === 'validpass123') {
            if (expectedResult !== 'success') {
                throw new Error('Expected success but got failure');
            }
        } else {
            if (expectedResult !== 'failure') {
                throw new Error('Expected failure but got success');
            }
        }
    }

    async simulateCheckout(orderData) {
        // Simulate checkout calculation
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const total = orderData.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        return total;
    }

    async simulateSearch(query, category) {
        // Simulate search API call
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Return mock results based on query
        return Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
            id: i + 1,
            title: `Result ${i + 1} for "${query}"`,
            category
        }));
    }

    async validateRegistrationForm(form) {
        const errors = [];
        
        if (!form.firstName || form.firstName.trim().length === 0) {
            errors.push('First name is required');
        }
        
        if (!form.lastName || form.lastName.trim().length === 0) {
            errors.push('Last name is required');
        }
        
        try {
            DataValidator.isValidEmail(form.email);
        } catch (error) {
            errors.push('Invalid email format');
        }
        
        if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
            errors.push('Phone number must be at least 10 digits');
        }
        
        if (form.age && (form.age < 18 || form.age > 120)) {
            errors.push('Age must be between 18 and 120');
        }
        
        if (form.website) {
            try {
                DataValidator.isValidUrl(form.website);
            } catch (error) {
                errors.push('Invalid website URL');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async executeWorkflowStep(step) {
        // Simulate step execution
        await new Promise(resolve => setTimeout(resolve, 100));
        
        switch (step.action) {
            case 'navigate':
                console.log(`    → Navigating to: ${step.url}`);
                break;
            case 'fillForm':
                console.log(`    → Filling form with:`, step.data);
                break;
            case 'submit':
                console.log(`    → Submitting form`);
                break;
            case 'verify':
                console.log(`    → Verifying URL: ${step.expectedUrl}`);
                break;
            default:
                console.log(`    → Executing: ${step.action}`);
        }
    }

    /**
     * Run all web examples
     */
    async runAllExamples() {
        console.log('🚀 Starting All Web Testing Examples\n');
        
        const results = [];
        
        try {
            results.push(await this.loginFormTest());
            results.push(await this.checkoutProcessTest());
            results.push(await this.searchFunctionalityTest());
            results.push(await this.formValidationTest());
            results.push(await this.completeWorkflowTest());
            
            // Generate final report
            const report = await this.executor.generateReport('html', 'web_test_report.html');
            console.log('\n📄 Web test report generated: web_test_report.html');
            
        } catch (error) {
            console.error('❌ Web examples failed:', error.message);
        }
        
        return results;
    }
}

module.exports = WebExamples;
