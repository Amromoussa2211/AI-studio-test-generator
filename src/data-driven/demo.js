/**
 * Data-Driven Testing Framework Demo
 * Comprehensive demonstration of all features
 */
const {
    JsonProvider,
    CsvProvider,
    TestExecutor,
    DataValidator,
    DataTransformer,
    DataGenerator,
    DataManager,
    WebExamples,
    MobileExamples,
    ApiExamples
} = require('./index');

class DataDrivenFrameworkDemo {
    constructor() {
        this.dataManager = new DataManager({ testIsolation: true });
        this.generator = new DataGenerator(42); // Seed for reproducible tests
        this.executor = new TestExecutor();
    }

    /**
     * Demo 1: Basic data loading and validation
     */
    async basicDataOperations() {
        console.log('\n📊 Demo 1: Basic Data Operations\n');
        console.log('='.repeat(50));

        // 1. Load JSON data
        console.log('\n1️⃣ Loading JSON data...');
        const jsonData = {
            users: [
                { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(jsonData));
        console.log(`✅ Loaded ${jsonProvider.count()} users from JSON`);

        // 2. Load CSV data
        console.log('\n2️⃣ Loading CSV data...');
        const csvData = `product,price,category,in_stock
Laptop,999.99,Electronics,true
Mouse,29.99,Electronics,true
Keyboard,79.99,Electronics,false
Monitor,299.99,Electronics,true`;

        const csvProvider = new CsvProvider();
        csvProvider.loadFromString(csvData);
        console.log(`✅ Loaded ${csvProvider.count()} products from CSV`);

        // 3. Validate data
        console.log('\n3️⃣ Validating data...');
        const users = jsonProvider.getAllData();
        const validationResult = DataValidator.validateDataSet(users, {
            requiredFields: ['id', 'name', 'email'],
            fieldTypes: {
                id: 'number',
                name: 'string',
                email: 'string',
                age: 'number'
            },
            fieldConstraints: {
                age: { min: 18, max: 100 }
            }
        });

        console.log(`📋 Validation result: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
        if (validationResult.errors.length > 0) {
            console.log(`❌ Errors: ${validationResult.errors.join(', ')}`);
        }

        // 4. Transform data
        console.log('\n4️⃣ Transforming data...');
        const transformedUsers = DataTransformer.transformDataset(users, {
            fieldMapping: {
                'fullName': 'name',
                'userEmail': 'email',
                'yearsOld': (data) => data.age
            }
        });

        console.log(`🔄 Transformed ${transformedUsers.length} user records`);
        console.log('   Sample transformed user:', JSON.stringify(transformedUsers[0], null, 2));

        return { jsonProvider, csvProvider, validationResult, transformedUsers };
    }

    /**
     * Demo 2: Data generation
     */
    async dataGenerationDemo() {
        console.log('\n🎲 Demo 2: Data Generation\n');
        console.log('='.repeat(50));

        // 1. Generate test users
        console.log('\n1️⃣ Generating test users...');
        const users = DataGenerator.generateDataset(() => ({
            firstName: this.generator.randomFirstName(),
            lastName: this.generator.randomLastName(),
            email: this.generator.randomEmail(),
            phone: this.generator.randomPhone(),
            age: this.generator.randomInt(18, 80)
        }), 5);

        users.forEach(user => {
            console.log(`👤 ${user.firstName} ${user.lastName} - ${user.email}`);
        });

        // 2. Generate products
        console.log('\n2️⃣ Generating products...');
        const products = DataGenerator.generateDataset(() => ({
            name: this.generator.randomString(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            price: this.generator.randomFloat(10, 1000, 2),
            sku: this.generator.randomAlphaNumeric(8).toUpperCase(),
            stock: this.generator.randomInt(0, 100)
        }), 3);

        products.forEach(product => {
            console.log(`📦 ${product.name} - $${product.price} (SKU: ${product.sku})`);
        });

        // 3. Generate addresses
        console.log('\n3️⃣ Generating addresses...');
        const addresses = DataGenerator.generateDataset(() => this.generator.randomAddress(), 3);
        addresses.forEach((addr, index) => {
            console.log(`🏠 Address ${index + 1}: ${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`);
        });

        return { users, products, addresses };
    }

    /**
     * Demo 3: Test data management
     */
    async testDataManagementDemo() {
        console.log('\n📦 Demo 3: Test Data Management\n');
        console.log('='.repeat(50));

        // 1. Create isolated test data
        console.log('\n1️⃣ Creating isolated test data...');
        const testData1 = this.dataManager.createTestData('test_001', {
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        }, { autoIncrement: false });

        console.log(`✅ Created test data:`, testData1);

        const testData2 = this.dataManager.createTestData('test_002', {
            username: 'adminuser',
            email: 'admin@example.com',
            role: 'admin'
        });

        console.log(`✅ Created test data:`, testData2);

        // 2. Clone test data
        console.log('\n2️⃣ Cloning test data...');
        const clones = this.dataManager.cloneTestData('test_001', 3, (cloneData, index) => ({
            username: `${cloneData.username}_clone_${index}`,
            cloneIndex: index
        }));

        console.log(`📋 Created ${clones.length} clones:`);
        clones.forEach((clone, index) => {
            console.log(`   Clone ${index}: ${clone.username} (${clone.testId})`);
        });

        // 3. Create dataset
        console.log('\n3️⃣ Creating dataset...');
        const dataset = this.dataManager.createDataset('product_catalog', () => ({
            id: this.generator.randomUUID(),
            name: this.generator.randomProduct().name,
            category: 'Test Category',
            price: this.generator.randomFloat(10, 100, 2)
        }), 5);

        console.log(`📊 Created dataset with ${dataset.length} products`);

        // 4. Get statistics
        console.log('\n4️⃣ Data manager statistics...');
        const stats = this.dataManager.getStats();
        console.log('📈 Stats:', stats);

        return { testData1, testData2, clones, dataset, stats };
    }

    /**
     * Demo 4: Simple data-driven test
     */
    async simpleDataDrivenTest() {
        console.log('\n🧪 Demo 4: Simple Data-Driven Test\n');
        console.log('='.repeat(50));

        // Create test data
        const calculatorTests = {
            tests: [
                { operation: 'add', a: 2, b: 3, expected: 5 },
                { operation: 'subtract', a: 10, b: 4, expected: 6 },
                { operation: 'multiply', a: 3, b: 7, expected: 21 },
                { operation: 'divide', a: 15, b: 3, expected: 5 },
                { operation: 'add', a: -1, b: 1, expected: 0 }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(calculatorTests));

        // Define test function
        const testFunction = async (testData, index) => {
            console.log(`\n🧮 Test ${index + 1}: ${testData.a} ${testData.operation} ${testData.b}`);

            // Validate test data
            DataValidator.hasRequiredProperties(testData, ['operation', 'a', 'b', 'expected']);

            // Execute calculation
            const result = this.performCalculation(testData);
            console.log(`   Result: ${result} (Expected: ${testData.expected})`);

            if (result !== testData.expected) {
                throw new Error(`Calculation failed: expected ${testData.expected}, got ${result}`);
            }
        };

        // Execute test
        const result = await this.executor.execute(testFunction, jsonProvider, {
            testName: 'Calculator Test',
            parallel: false
        });

        console.log(`\n📊 Test Summary:`);
        console.log(`   Total: ${result.total}`);
        console.log(`   Passed: ${result.passed}`);
        console.log(`   Failed: ${result.failed}`);
        console.log(`   Success Rate: ${result.successRate}%`);

        return result;
    }

    /**
     * Demo 5: Web testing example
     */
    async webTestingDemo() {
        console.log('\n🌐 Demo 5: Web Testing Example\n');
        console.log('='.repeat(50));

        const webExamples = new WebExamples();
        
        try {
            const result = await webExamples.loginFormTest();
            console.log('\n✅ Web testing demo completed successfully');
            return result;
        } catch (error) {
            console.log(`\n❌ Web testing demo failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Demo 6: Mobile testing example
     */
    async mobileTestingDemo() {
        console.log('\n📱 Demo 6: Mobile Testing Example\n');
        console.log('='.repeat(50));

        const mobileExamples = new MobileExamples();
        
        try {
            const result = await mobileExamples.appLoginTest();
            console.log('\n✅ Mobile testing demo completed successfully');
            return result;
        } catch (error) {
            console.log(`\n❌ Mobile testing demo failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Demo 7: API testing example
     */
    async apiTestingDemo() {
        console.log('\n🔌 Demo 7: API Testing Example\n');
        console.log('='.repeat(50));

        const apiExamples = new ApiExamples();
        
        try {
            const result = await apiExamples.userAuthenticationTest();
            console.log('\n✅ API testing demo completed successfully');
            return result;
        } catch (error) {
            console.log(`\n❌ API testing demo failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Demo 8: Complete workflow
     */
    async completeWorkflowDemo() {
        console.log('\n🔄 Demo 8: Complete Workflow\n');
        console.log('='.repeat(50));

        // 1. Generate user data
        console.log('\n1️⃣ Generating user registration data...');
        const userData = this.dataManager.createTestData('workflow_user_001', {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-123-4567'
        });

        // 2. Validate user data
        console.log('\n2️⃣ Validating user data...');
        const validation = {
            email: this.isValidEmail(userData.email),
            phone: this.isValidPhone(userData.phone),
            requiredFields: DataValidator.hasRequiredProperties(userData, ['firstName', 'lastName', 'email'])
        };
        
        console.log('✅ Validation results:', validation);

        // 3. Transform data for different systems
        console.log('\n3️⃣ Transforming data for different systems...');
        const webData = DataTransformer.transformWithMapping(userData, {
            'fullName': 'firstName',
            'userEmail': 'email',
            'contactPhone': 'phone'
        });

        const apiData = DataTransformer.transformWithMapping(userData, {
            'username': 'email',
            'displayName': 'firstName',
            'phoneNumber': 'phone'
        });

        console.log('🌐 Web format:', webData);
        console.log('🔌 API format:', apiData);

        // 4. Simulate test execution
        console.log('\n4️⃣ Simulating test execution...');
        const testSteps = [
            { system: 'web', action: 'register', data: webData, expected: 'success' },
            { system: 'api', action: 'create_user', data: apiData, expected: 'created' },
            { system: 'web', action: 'login', data: { email: webData.userEmail }, expected: 'authenticated' }
        ];

        for (const [index, step] of testSteps.entries()) {
            console.log(`   Step ${index + 1}: ${step.system} ${step.action}`);
            await this.simulateStep(step);
        }

        // 5. Cleanup
        console.log('\n5️⃣ Cleaning up test data...');
        this.dataManager.cleanupTestData('workflow_user_001');
        console.log('🧹 Test data cleaned up');

        return { userData, validation, webData, apiData, testSteps };
    }

    // Helper methods

    performCalculation(testData) {
        switch (testData.operation) {
            case 'add':
                return testData.a + testData.b;
            case 'subtract':
                return testData.a - testData.b;
            case 'multiply':
                return testData.a * testData.b;
            case 'divide':
                if (testData.b === 0) throw new Error('Division by zero');
                return testData.a / testData.b;
            default:
                throw new Error(`Unknown operation: ${testData.operation}`);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return /^\+?[1-9]\d{1,14}$/.test(cleanPhone);
    }

    async simulateStep(step) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`   ✅ ${step.system} ${step.action} completed`);
    }

    /**
     * Run complete demo
     */
    async runCompleteDemo() {
        console.log('🚀'.repeat(60));
        console.log('🚀 Data-Driven Testing Framework - Complete Demo 🚀');
        console.log('🚀'.repeat(60));

        const startTime = Date.now();
        const results = {};

        try {
            // Run all demos
            results.basicData = await this.basicDataOperations();
            results.dataGeneration = await this.dataGenerationDemo();
            results.dataManagement = await this.testDataManagementDemo();
            results.simpleTest = await this.simpleDataDrivenTest();
            results.webDemo = await this.webTestingDemo();
            results.mobileDemo = await this.mobileTestingDemo();
            results.apiDemo = await this.apiTestingDemo();
            results.workflow = await this.completeWorkflowDemo();

            // Generate final report
            console.log('\n📄 Generating final report...');
            const report = await this.executor.generateReport('html', 'complete_demo_report.html');
            
            const totalTime = Date.now() - startTime;
            
            console.log('\n' + '='.repeat(60));
            console.log('🎉 Demo completed successfully!');
            console.log(`⏱️ Total time: ${(totalTime / 1000).toFixed(2)} seconds`);
            console.log('📄 Report generated: complete_demo_report.html');
            console.log('='.repeat(60));

            // Cleanup
            this.dataManager.reset();

            return {
                success: true,
                results,
                executionTime: totalTime,
                reportGenerated: true
            };

        } catch (error) {
            console.error('\n❌ Demo failed:', error.message);
            
            const totalTime = Date.now() - startTime;
            console.log(`⏱️ Time before failure: ${(totalTime / 1000).toFixed(2)} seconds`);

            return {
                success: false,
                error: error.message,
                executionTime: totalTime
            };
        }
    }
}

// Export for use in other files
module.exports = DataDrivenFrameworkDemo;

// Run demo if executed directly
if (require.main === module) {
    const demo = new DataDrivenFrameworkDemo();
    demo.runCompleteDemo()
        .then(result => {
            console.log('\n🎯 Demo finished with result:', result.success ? 'SUCCESS' : 'FAILURE');
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Demo crashed:', error);
            process.exit(1);
        });
}
