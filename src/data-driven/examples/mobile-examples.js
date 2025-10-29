/**
 * Mobile Testing Examples
 * Demonstrates data-driven testing for mobile applications
 */
const { JsonProvider, CsvProvider, TestExecutor, DataValidator, DataTransformer } = require('../index');

class MobileExamples {
    constructor() {
        this.executor = new TestExecutor();
    }

    /**
     * Example 1: App login across different device types
     */
    async appLoginTest() {
        console.log('📱 Example 1: App Login Test Across Devices\n');

        const deviceTests = {
            testCases: [
                {
                    deviceType: "iOS",
                    deviceName: "iPhone 12",
                    osVersion: "14.5",
                    appVersion: "2.1.0",
                    userCredentials: {
                        username: "testuser1",
                        password: "testpass123"
                    },
                    loginScenario: "successful"
                },
                {
                    deviceType: "Android",
                    deviceName: "Samsung Galaxy S21",
                    osVersion: "11.0",
                    appVersion: "2.1.0",
                    userCredentials: {
                        username: "testuser2",
                        password: "wrongpassword"
                    },
                    loginScenario: "failed"
                },
                {
                    deviceType: "iOS",
                    deviceName: "iPad Pro",
                    osVersion: "14.5",
                    appVersion: "2.1.0",
                    userCredentials: {
                        username: "admin",
                        password: "admin123"
                    },
                    loginScenario: "successful"
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(deviceTests));

        const testFunction = async (deviceData, index) => {
            console.log(`\n📱 Testing login on ${deviceData.deviceName} (${deviceData.osVersion})`);

            // Validate device data
            DataValidator.hasRequiredProperties(deviceData, ['deviceType', 'deviceName', 'userCredentials']);
            DataValidator.hasRequiredProperties(deviceData.userCredentials, ['username', 'password']);

            // Setup device environment
            await this.setupDevice(deviceData);

            // Execute login test
            const loginResult = await this.performMobileLogin(deviceData.userCredentials);

            console.log(`🔐 Login result: ${loginResult.success ? 'SUCCESS' : 'FAILED'}`);
            
            // Validate expected vs actual scenario
            if (loginResult.success !== (deviceData.loginScenario === 'successful')) {
                throw new Error(`Login scenario mismatch: expected ${deviceData.loginScenario}, got ${loginResult.success ? 'success' : 'failed'}`);
            }
        };

        const result = await this.executor.executeMobileTest(testFunction, jsonProvider, {
            testName: 'Mobile App Login Test',
            beforeEach: async (data) => {
                console.log(`🔧 Setting up test for ${data.deviceType} device`);
            }
        });

        return result;
    }

    /**
     * Example 2: User registration with form validation
     */
    async userRegistrationTest() {
        console.log('\n👤 Example 2: User Registration Test\n');

        const registrationData = {
            registrations: [
                {
                    userType: "Individual",
                    device: "iPhone",
                    formData: {
                        email: "john.doe@email.com",
                        password: "SecurePass123",
                        confirmPassword: "SecurePass123",
                        firstName: "John",
                        lastName: "Doe",
                        phoneNumber: "+1-555-123-4567",
                        dateOfBirth: "1990-05-15"
                    },
                    expectedResult: "success"
                },
                {
                    userType: "Business",
                    device: "Android",
                    formData: {
                        email: "business@company.com",
                        password: "BusinessPass456",
                        confirmPassword: "BusinessPass456",
                        companyName: "Tech Solutions Inc",
                        taxId: "123-45-6789",
                        businessType: "Technology"
                    },
                    expectedResult: "success"
                },
                {
                    userType: "Individual",
                    device: "iPhone",
                    formData: {
                        email: "invalid-email",
                        password: "123",
                        confirmPassword: "456",
                        firstName: "",
                        lastName: "Test",
                        phoneNumber: "123",
                        dateOfBirth: "2025-01-01"
                    },
                    expectedResult: "validation_error"
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(registrationData));

        const testFunction = async (regData, index) => {
            console.log(`\n📝 Testing ${regData.userType} registration on ${regData.device}`);

            // Validate registration data
            DataValidator.hasRequiredProperties(regData, ['userType', 'device', 'formData']);
            DataValidator.hasRequiredProperties(regData.formData, ['email', 'password']);

            // Open registration form
            await this.openRegistrationForm(regData.device);

            // Fill and submit form
            const formResult = await this.fillAndSubmitRegistrationForm(regData.formData);

            console.log(`📋 Form submission result: ${formResult.status}`);
            
            if (formResult.status !== regData.expectedResult) {
                throw new Error(`Registration result mismatch: expected ${regData.expectedResult}, got ${formResult.status}`);
            }

            // Cleanup
            await this.cleanupRegistrationForm();
        };

        const result = await this.executor.executeMobileTest(testFunction, jsonProvider, {
            testName: 'User Registration Test'
        });

        return result;
    }

    /**
     * Example 3: Shopping cart functionality
     */
    async shoppingCartTest() {
        console.log('\n🛒 Example 3: Shopping Cart Test\n');

        const cartScenarios = {
            tests: [
                {
                    device: "iPhone",
                    scenario: "Add single item",
                    products: [
                        { id: "PROD001", name: "Wireless Headphones", price: 99.99, quantity: 1 }
                    ]
                },
                {
                    device: "Android",
                    scenario: "Add multiple items",
                    products: [
                        { id: "PROD002", name: "Smart Watch", price: 299.99, quantity: 1 },
                        { id: "PROD003", name: "Phone Case", price: 29.99, quantity: 2 },
                        { id: "PROD004", name: "Screen Protector", price: 15.99, quantity: 1 }
                    ]
                },
                {
                    device: "iPad",
                    scenario: "Update quantities",
                    products: [
                        { id: "PROD005", name: "Tablet Stand", price: 49.99, quantity: 3 }
                    ],
                    updates: [
                        { productId: "PROD005", newQuantity: 1 }
                    ]
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(cartScenarios));

        const testFunction = async (cartData, index) => {
            console.log(`\n🛒 Testing cart scenario: ${cartData.scenario} on ${cartData.device}`);

            // Validate cart data
            DataValidator.hasMinimumItems(cartData.products, 1, 'cart products');
            DataValidator.hasRequiredProperties(cartData, ['device', 'scenario', 'products']);

            // Navigate to shopping section
            await this.navigateToShopping(cartData.device);

            // Add products to cart
            let cartTotal = 0;
            for (const product of cartData.products) {
                await this.addProductToCart(product);
                cartTotal += product.price * product.quantity;
                console.log(`  ➕ Added ${product.quantity}x ${product.name} ($${product.price})`);
            }

            // Apply updates if any
            if (cartData.updates) {
                for (const update of cartData.updates) {
                    await this.updateCartItem(update.productId, update.newQuantity);
                }
            }

            // Verify cart
            const cartVerification = await this.verifyCart(cartData.products, cartData.updates);
            console.log(`✅ Cart verification: ${cartVerification.verified ? 'PASSED' : 'FAILED'}`);

            if (!cartVerification.verified) {
                throw new Error(`Cart verification failed: ${cartVerification.errors.join(', ')}`);
            }
        };

        const result = await this.executor.executeMobileTest(testFunction, jsonProvider, {
            testName: 'Shopping Cart Test'
        });

        return result;
    }

    /**
     * Example 4: Push notification handling
     */
    async pushNotificationTest() {
        console.log('\n🔔 Example 4: Push Notification Test\n');

        const notificationTests = {
            scenarios: [
                {
                    device: "iPhone",
                    appState: "foreground",
                    notificationType: "promotional",
                    content: {
                        title: "Special Offer!",
                        body: "Get 50% off on all items",
                        action: "open_promotions"
                    },
                    expectedBehavior: "display_inline"
                },
                {
                    device: "Android",
                    appState: "background",
                    notificationType: "message",
                    content: {
                        title: "New Message",
                        body: "You have a new message from John",
                        action: "open_messages"
                    },
                    expectedBehavior: "banner_display"
                },
                {
                    device: "iPhone",
                    appState: "killed",
                    notificationType: "alert",
                    content: {
                        title: "Security Alert",
                        body: "New login detected from your account",
                        action: "security_settings"
                    },
                    expectedBehavior: "deep_link"
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(notificationTests));

        const testFunction = async (notificationData, index) => {
            console.log(`\n🔔 Testing ${notificationData.notificationType} notification on ${notificationData.device}`);

            // Validate notification data
            DataValidator.hasRequiredProperties(notificationData, ['device', 'appState', 'content']);
            DataValidator.hasRequiredProperties(notificationData.content, ['title', 'body']);

            // Setup app state
            await this.setupAppState(notificationData.appState, notificationData.device);

            // Send push notification
            const notificationResult = await this.sendPushNotification(notificationData.content);

            console.log(`📱 Notification sent: ${notificationResult.success ? 'SUCCESS' : 'FAILED'}`);

            // Verify notification behavior
            const behaviorResult = await this.verifyNotificationBehavior(
                notificationData.expectedBehavior,
                notificationData.content
            );

            console.log(`🎯 Expected behavior: ${notificationData.expectedBehavior}`);
            console.log(`✅ Actual behavior: ${behaviorResult.actual}`);

            if (behaviorResult.actual !== notificationData.expectedBehavior) {
                throw new Error(`Notification behavior mismatch: expected ${notificationData.expectedBehavior}, got ${behaviorResult.actual}`);
            }
        };

        const result = await this.executor.executeMobileTest(testFunction, jsonProvider, {
            testName: 'Push Notification Test'
        });

        return result;
    }

    /**
     * Example 5: Offline functionality
     */
    async offlineFunctionalityTest() {
        console.log('\n📴 Example 5: Offline Functionality Test\n');

        const offlineTests = {
            scenarios: [
                {
                    device: "iPhone",
                    feature: "view_cached_products",
                    networkState: "offline",
                    dataToCache: ["product_1", "product_2", "product_3"],
                    expectedResult: "cached_data_accessible"
                },
                {
                    device: "Android",
                    feature: "submit_form_offline",
                    networkState: "offline",
                    formData: {
                        name: "Test User",
                        email: "test@example.com",
                        message: "This is a test message"
                    },
                    expectedResult: "queued_for_sync"
                },
                {
                    device: "iPad",
                    feature: "sync_on_reconnection",
                    networkState: "offline_then_online",
                    syncData: [
                        { type: "user_profile", id: "user_123" },
                        { type: "cart_item", id: "cart_456" }
                    ],
                    expectedResult: "successful_sync"
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(offlineTests));

        const testFunction = async (offlineData, index) => {
            console.log(`\n📴 Testing offline ${offlineData.feature} on ${offlineData.device}`);

            // Validate offline test data
            DataValidator.hasRequiredProperties(offlineData, ['device', 'feature', 'networkState']);

            // Switch to offline mode
            await this.simulateNetworkState(offlineData.networkState, offlineData.device);

            // Execute feature test
            const testResult = await this.executeOfflineFeature(offlineData);

            console.log(`📡 Network state: ${offlineData.networkState}`);
            console.log(`⚙️ Feature tested: ${offlineData.feature}`);
            console.log(`✅ Result: ${testResult.status}`);

            if (testResult.status !== offlineData.expectedResult) {
                throw new Error(`Offline test failed: expected ${offlineData.expectedResult}, got ${testResult.status}`);
            }

            // Restore network state
            await this.simulateNetworkState('online', offlineData.device);
        };

        const result = await this.executor.executeMobileTest(testFunction, jsonProvider, {
            testName: 'Offline Functionality Test'
        });

        return result;
    }

    // Simulation methods (replace with actual Appium/Detox implementations)

    async setupDevice(deviceData) {
        console.log(`  🔧 Setting up ${deviceData.deviceName} with OS ${deviceData.osVersion}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async performMobileLogin(credentials) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            success: credentials.password !== 'wrongpassword' && credentials.username !== '',
            token: 'mock-jwt-token'
        };
    }

    async openRegistrationForm(device) {
        console.log(`  📱 Opening registration form on ${device}`);
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    async fillAndSubmitRegistrationForm(formData) {
        console.log(`  📝 Filling registration form with ${Object.keys(formData).length} fields`);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulate validation
        const errors = [];
        if (!formData.email.includes('@')) errors.push('Invalid email');
        if (formData.password.length < 6) errors.push('Password too short');
        
        return {
            status: errors.length > 0 ? 'validation_error' : 'success',
            errors
        };
    }

    async cleanupRegistrationForm() {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`  🧹 Cleaned up registration form`);
    }

    async navigateToShopping(device) {
        console.log(`  🛍️ Navigating to shopping section on ${device}`);
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    async addProductToCart(product) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`    ➕ Added ${product.name} to cart`);
    }

    async updateCartItem(productId, newQuantity) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`    🔄 Updated ${productId} quantity to ${newQuantity}`);
    }

    async verifyCart(products, updates) {
        await new Promise(resolve => setTimeout(resolve, 150));
        return {
            verified: true,
            errors: []
        };
    }

    async setupAppState(appState, device) {
        console.log(`  📱 Setting app state to ${appState} on ${device}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async sendPushNotification(content) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            success: true,
            notificationId: 'mock-notification-id'
        };
    }

    async verifyNotificationBehavior(expectedBehavior, content) {
        await new Promise(resolve => setTimeout(resolve, 150));
        return {
            actual: expectedBehavior,
            displayed: true
        };
    }

    async simulateNetworkState(state, device) {
        console.log(`  📡 Setting network state to ${state} on ${device}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async executeOfflineFeature(offlineData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const statusMap = {
            'cached_data_accessible': 'cached_data_accessible',
            'queued_for_sync': 'queued_for_sync',
            'successful_sync': 'successful_sync'
        };
        
        return {
            status: statusMap[offlineData.expectedResult] || 'completed'
        };
    }

    /**
     * Run all mobile examples
     */
    async runAllExamples() {
        console.log('🚀 Starting All Mobile Testing Examples\n');
        
        const results = [];
        
        try {
            results.push(await this.appLoginTest());
            results.push(await this.userRegistrationTest());
            results.push(await this.shoppingCartTest());
            results.push(await this.pushNotificationTest());
            results.push(await this.offlineFunctionalityTest());
            
            // Generate final report
            const report = await this.executor.generateReport('html', 'mobile_test_report.html');
            console.log('\n📄 Mobile test report generated: mobile_test_report.html');
            
        } catch (error) {
            console.error('❌ Mobile examples failed:', error.message);
        }
        
        return results;
    }
}

module.exports = MobileExamples;
