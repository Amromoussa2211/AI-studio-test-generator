/**
 * API Testing Examples
 * Demonstrates data-driven testing for REST APIs
 */
const { JsonProvider, CsvProvider, TestExecutor, DataValidator, DataTransformer } = require('../index');
const https = require('https');
const http = require('http');

class ApiExamples {
    constructor() {
        this.executor = new TestExecutor();
        this.baseUrl = 'https://api.example.com';
        this.authToken = 'mock-auth-token';
    }

    /**
     * Example 1: User authentication API tests
     */
    async userAuthenticationTest() {
        console.log('🔐 Example 1: User Authentication API Test\n');

        const authTests = {
            testCases: [
                {
                    endpoint: "/api/auth/login",
                    method: "POST",
                    payload: {
                        username: "testuser",
                        password: "validpassword123"
                    },
                    expectedStatus: 200,
                    expectedResponse: {
                        success: true,
                        token: "jwt_token_here"
                    }
                },
                {
                    endpoint: "/api/auth/login",
                    method: "POST",
                    payload: {
                        username: "invaliduser",
                        password: "wrongpassword"
                    },
                    expectedStatus: 401,
                    expectedResponse: {
                        success: false,
                        error: "Invalid credentials"
                    }
                },
                {
                    endpoint: "/api/auth/login",
                    method: "POST",
                    payload: {
                        username: "",
                        password: ""
                    },
                    expectedStatus: 400,
                    expectedResponse: {
                        success: false,
                        error: "Username and password required"
                    }
                },
                {
                    endpoint: "/api/auth/register",
                    method: "POST",
                    payload: {
                        username: "newuser",
                        email: "newuser@example.com",
                        password: "securepassword123"
                    },
                    expectedStatus: 201,
                    expectedResponse: {
                        success: true,
                        userId: "user_123"
                    }
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(authTests));

        const testFunction = async (authTest, index) => {
            console.log(`\n🔍 Testing ${authTest.method} ${authTest.endpoint}`);

            // Validate test data
            DataValidator.hasRequiredProperties(authTest, ['endpoint', 'method', 'payload']);
            DataValidator.isInRange(authTest.expectedStatus, 100, 599, 'status code');

            // Make API request
            const response = await this.makeApiRequest(authTest.endpoint, {
                method: authTest.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(authTest.payload)
            });

            console.log(`📡 Response status: ${response.status} (expected: ${authTest.expectedStatus})`);
            
            // Validate response status
            if (response.status !== authTest.expectedStatus) {
                throw new Error(`Status code mismatch: expected ${authTest.expectedStatus}, got ${response.status}`);
            }

            // Validate response content
            const validationResult = this.validateApiResponse(response.data, authTest.expectedResponse);
            if (!validationResult.valid) {
                throw new Error(`Response validation failed: ${validationResult.errors.join(', ')}`);
            }

            console.log(`✅ API test passed for ${authTest.endpoint}`);
        };

        const result = await this.executor.executeApiTest(testFunction, jsonProvider, {
            testName: 'User Authentication API Test',
            parallel: true,
            timeout: 10000
        });

        return result;
    }

    /**
     * Example 2: Product catalog API tests
     */
    async productCatalogTest() {
        console.log('\n📦 Example 2: Product Catalog API Test\n');

        const productTests = {
            endpoints: [
                {
                    endpoint: "/api/products",
                    method: "GET",
                    queryParams: {
                        category: "electronics",
                        limit: 10,
                        sort: "price_asc"
                    },
                    expectedStatus: 200,
                    expectedSchema: {
                        type: "object",
                        properties: {
                            products: { type: "array" },
                            total: { type: "number" },
                            page: { type: "number" }
                        }
                    }
                },
                {
                    endpoint: "/api/products/search",
                    method: "GET",
                    queryParams: {
                        q: "laptop",
                        category: "computers",
                        minPrice: 500,
                        maxPrice: 2000
                    },
                    expectedStatus: 200,
                    expectedMinResults: 1
                },
                {
                    endpoint: "/api/products",
                    method: "POST",
                    payload: {
                        name: "Test Product",
                        description: "A test product for validation",
                        price: 99.99,
                        category: "test",
                        inStock: true,
                        tags: ["test", "validation"]
                    },
                    expectedStatus: 201,
                    expectedResponse: {
                        success: true,
                        productId: "*"
                    }
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(productTests));

        const testFunction = async (productTest, index) => {
            console.log(`\n📦 Testing ${productTest.method} ${productTest.endpoint}`);

            // Build query string
            let url = productTest.endpoint;
            if (productTest.queryParams) {
                const queryString = new URLSearchParams(productTest.queryParams).toString();
                url += `?${queryString}`;
            }

            // Make API request
            const response = await this.makeApiRequest(url, {
                method: productTest.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: productTest.payload ? JSON.stringify(productTest.payload) : undefined
            });

            console.log(`📡 Response status: ${response.status} (expected: ${productTest.expectedStatus})`);
            
            // Validate status
            if (response.status !== productTest.expectedStatus) {
                throw new Error(`Status code mismatch: expected ${productTest.expectedStatus}, got ${response.status}`);
            }

            // Validate minimum results for search
            if (productTest.expectedMinResults && response.data.products) {
                if (response.data.products.length < productTest.expectedMinResults) {
                    throw new Error(`Insufficient results: got ${response.data.products.length}, expected at least ${productTest.expectedMinResults}`);
                }
            }

            // Validate schema if provided
            if (productTest.expectedSchema) {
                const schemaValidation = this.validateJsonSchema(response.data, productTest.expectedSchema);
                if (!schemaValidation.valid) {
                    throw new Error(`Schema validation failed: ${schemaValidation.errors.join(', ')}`);
                }
            }

            console.log(`✅ Product API test passed`);
        };

        const result = await this.executor.executeApiTest(testFunction, jsonProvider, {
            testName: 'Product Catalog API Test'
        });

        return result;
    }

    /**
     * Example 3: Data validation with CSV
     */
    async dataValidationTest() {
        console.log('\n✅ Example 3: Data Validation API Test\n');

        const validationData = `endpoint,method,payload,expectedStatus,validationRules
/api/users/validate,POST,{"email":"test@example.com","phone":"+1234567890","age":25},200,"email,phone,age"
/api/users/validate,POST,{"email":"invalid-email","phone":"123","age":150},422,"email,phone,age"
/api/users/validate,POST,{"email":"user@test.com","phone":"+1-555-123-4567","age":30},200,"email,phone,age"
/api/orders/submit,POST,{"items":[{"productId":"PROD001","quantity":2}],"shipping":{"address":"123 Main St"}},201,"items,shipping"
/api/orders/submit,POST,{"items":[],"shipping":{"address":""}},400,"items,shipping"`;

        const csvProvider = new CsvProvider();
        csvProvider.loadFromString(validationData);

        const testFunction = async (validationTest, index) => {
            console.log(`\n✅ Testing validation: ${validationTest.endpoint}`);

            // Parse payload
            let payload = {};
            try {
                payload = JSON.parse(validationTest.payload.replace(/'/g, '"'));
            } catch (error) {
                throw new Error(`Invalid payload JSON: ${error.message}`);
            }

            // Parse validation rules
            const validationRules = validationTest.validationRules.split(',');

            // Make API request
            const response = await this.makeApiRequest(validationTest.endpoint, {
                method: validationTest.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(payload)
            });

            console.log(`📡 Response status: ${response.status} (expected: ${validationTest.expectedStatus})`);
            
            // Validate status
            if (response.status !== parseInt(validationTest.expectedStatus)) {
                throw new Error(`Status code mismatch: expected ${validationTest.expectedStatus}, got ${response.status}`);
            }

            // Validate specific fields
            for (const field of validationRules) {
                this.validateField(field.trim(), payload, response.data);
            }

            console.log(`✅ Data validation test passed`);
        };

        const result = await this.executor.executeApiTest(testFunction, csvProvider, {
            testName: 'Data Validation API Test'
        });

        return result;
    }

    /**
     * Example 4: Performance and load testing
     */
    async performanceTest() {
        console.log('\n⚡ Example 4: Performance and Load Test\n');

        const loadTests = {
            scenarios: [
                {
                    endpoint: "/api/products",
                    method: "GET",
                    concurrentUsers: 5,
                    requestsPerUser: 3,
                    expectedMaxResponseTime: 2000,
                    expectedSuccessRate: 95
                },
                {
                    endpoint: "/api/orders",
                    method: "POST",
                    concurrentUsers: 3,
                    requestsPerUser: 2,
                    expectedMaxResponseTime: 3000,
                    expectedSuccessRate: 90
                },
                {
                    endpoint: "/api/search",
                    method: "GET",
                    concurrentUsers: 10,
                    requestsPerUser: 5,
                    expectedMaxResponseTime: 5000,
                    expectedSuccessRate: 85
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(loadTests));

        const testFunction = async (loadTest, index) => {
            console.log(`\n⚡ Running load test: ${loadTest.endpoint} with ${loadTest.concurrentUsers} users`);

            const totalRequests = loadTest.concurrentUsers * loadTest.requestsPerUser;
            const startTime = Date.now();
            
            // Execute load test
            const results = await this.executeLoadTest(loadTest);
            
            const totalTime = Date.now() - startTime;
            const successRate = (results.successCount / totalRequests) * 100;
            const avgResponseTime = results.totalResponseTime / totalRequests;

            console.log(`📊 Load Test Results:`);
            console.log(`   Total Requests: ${totalRequests}`);
            console.log(`   Success Rate: ${successRate.toFixed(2)}% (expected: ${loadTest.expectedSuccessRate}%)`);
            console.log(`   Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
            console.log(`   Max Response Time: ${results.maxResponseTime}ms (expected: ${loadTest.expectedMaxResponseTime}ms)`);
            
            // Validate performance metrics
            if (successRate < loadTest.expectedSuccessRate) {
                throw new Error(`Success rate below threshold: ${successRate.toFixed(2)}% < ${loadTest.expectedSuccessRate}%`);
            }
            
            if (results.maxResponseTime > loadTest.expectedMaxResponseTime) {
                throw new Error(`Response time exceeded threshold: ${results.maxResponseTime}ms > ${loadTest.expectedMaxResponseTime}ms`);
            }

            console.log(`✅ Load test passed for ${loadTest.endpoint}`);
        };

        const result = await this.executor.executeApiTest(testFunction, jsonProvider, {
            testName: 'Performance and Load Test',
            parallel: true
        });

        return result;
    }

    /**
     * Example 5: End-to-end workflow testing
     */
    async workflowTest() {
        console.log('\n🔄 Example 5: End-to-End Workflow Test\n');

        const workflows = {
            testCases: [
                {
                    name: "User Purchase Workflow",
                    steps: [
                        {
                            action: "login",
                            endpoint: "/api/auth/login",
                            method: "POST",
                            payload: { username: "testuser", password: "testpass" },
                            expectedStatus: 200
                        },
                        {
                            action: "browse_products",
                            endpoint: "/api/products",
                            method: "GET",
                            expectedStatus: 200
                        },
                        {
                            action: "add_to_cart",
                            endpoint: "/api/cart",
                            method: "POST",
                            payload: { productId: "PROD001", quantity: 1 },
                            expectedStatus: 201
                        },
                        {
                            action: "checkout",
                            endpoint: "/api/orders",
                            method: "POST",
                            payload: {
                                items: [{ productId: "PROD001", quantity: 1 }],
                                shippingAddress: { street: "123 Test St" }
                            },
                            expectedStatus: 201
                        }
                    ]
                },
                {
                    name: "User Registration Workflow",
                    steps: [
                        {
                            action: "register",
                            endpoint: "/api/auth/register",
                            method: "POST",
                            payload: {
                                username: "newuser",
                                email: "newuser@example.com",
                                password: "securepass"
                            },
                            expectedStatus: 201
                        },
                        {
                            action: "verify_email",
                            endpoint: "/api/auth/verify",
                            method: "POST",
                            payload: { email: "newuser@example.com", code: "123456" },
                            expectedStatus: 200
                        },
                        {
                            action: "complete_profile",
                            endpoint: "/api/users/profile",
                            method: "PUT",
                            payload: { firstName: "New", lastName: "User" },
                            expectedStatus: 200
                        }
                    ]
                }
            ]
        };

        const jsonProvider = new JsonProvider();
        await jsonProvider.loadFromString(JSON.stringify(workflows));

        const testFunction = async (workflow, index) => {
            console.log(`\n🔄 Executing workflow: ${workflow.name}`);

            let authToken = null;
            let userId = null;

            for (const [stepIndex, step] of workflow.steps.entries()) {
                console.log(`  Step ${stepIndex + 1}: ${step.action}`);

                // Add auth header if we have a token
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                // Make API request
                const response = await this.makeApiRequest(step.endpoint, {
                    method: step.method,
                    headers,
                    body: step.payload ? JSON.stringify(step.payload) : undefined
                });

                // Validate status
                if (response.status !== step.expectedStatus) {
                    throw new Error(`Step ${stepIndex + 1} failed: expected ${step.expectedStatus}, got ${response.status}`);
                }

                // Extract auth token if this is a login step
                if (step.action === 'login' && response.data.token) {
                    authToken = response.data.token;
                }

                // Extract user ID if available
                if (response.data.userId) {
                    userId = response.data.userId;
                }

                console.log(`    ✅ ${step.action} completed successfully`);
            }

            console.log(`✅ Workflow completed: ${workflow.name}`);
        };

        const result = await this.executor.executeApiTest(testFunction, jsonProvider, {
            testName: 'End-to-End Workflow Test'
        });

        return result;
    }

    // Helper methods

    makeApiRequest(endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}${endpoint}`;
            const urlObj = new URL(url);
            const client = urlObj.protocol === 'https:' ? https : http;

            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: {
                    'User-Agent': 'Data-Driven-Test-Framework/1.0',
                    ...options.headers
                }
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const responseData = data ? JSON.parse(data) : {};
                        resolve({
                            status: res.statusCode,
                            data: responseData,
                            headers: res.headers
                        });
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            data: data,
                            headers: res.headers
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.body) {
                req.write(options.body);
            }

            req.end();
        });
    }

    validateApiResponse(actual, expected) {
        const errors = [];
        
        if (typeof expected === 'object' && expected !== null) {
            Object.entries(expected).forEach(([key, value]) => {
                if (value === '*') {
                    // Wildcard - just check existence
                    if (!(key in actual)) {
                        errors.push(`Missing expected field: ${key}`);
                    }
                } else if (typeof value === 'object' && value !== null) {
                    const validation = this.validateApiResponse(actual[key], value);
                    if (!validation.valid) {
                        errors.push(...validation.errors.map(err => `${key}.${err}`));
                    }
                } else {
                    if (actual[key] !== value) {
                        errors.push(`Field ${key}: expected ${value}, got ${actual[key]}`);
                    }
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    validateJsonSchema(data, schema) {
        // Simple schema validation (in real implementation, use a library like ajv)
        const errors = [];

        if (schema.type && typeof data !== schema.type) {
            errors.push(`Type mismatch: expected ${schema.type}, got ${typeof data}`);
        }

        if (schema.properties && typeof data === 'object') {
            Object.entries(schema.properties).forEach(([key, propSchema]) => {
                if (key in data) {
                    const propValidation = this.validateJsonSchema(data[key], propSchema);
                    if (!propValidation.valid) {
                        errors.push(...propValidation.errors.map(err => `${key}.${err}`));
                    }
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    validateField(fieldName, requestData, responseData) {
        switch (fieldName) {
            case 'email':
                if (requestData.email && !requestData.email.includes('@')) {
                    throw new Error('Invalid email format');
                }
                break;
            case 'phone':
                if (requestData.phone && requestData.phone.replace(/\D/g, '').length < 10) {
                    throw new Error('Phone number too short');
                }
                break;
            case 'age':
                if (requestData.age && (requestData.age < 1 || requestData.age > 150)) {
                    throw new Error('Invalid age value');
                }
                break;
        }
    }

    async executeLoadTest(loadTest) {
        const promises = [];
        const results = {
            successCount: 0,
            errorCount: 0,
            totalResponseTime: 0,
            maxResponseTime: 0
        };

        // Create concurrent requests
        for (let user = 0; user < loadTest.concurrentUsers; user++) {
            for (let request = 0; request < loadTest.requestsPerUser; request++) {
                const promise = this.singleLoadTestRequest(loadTest)
                    .then(responseTime => {
                        results.successCount++;
                        results.totalResponseTime += responseTime;
                        results.maxResponseTime = Math.max(results.maxResponseTime, responseTime);
                    })
                    .catch(() => {
                        results.errorCount++;
                    });
                
                promises.push(promise);
            }
        }

        await Promise.all(promises);
        return results;
    }

    async singleLoadTestRequest(loadTest) {
        const startTime = Date.now();
        try {
            await this.makeApiRequest(loadTest.endpoint, {
                method: loadTest.method,
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            return Date.now() - startTime;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Run all API examples
     */
    async runAllExamples() {
        console.log('🚀 Starting All API Testing Examples\n');
        
        const results = [];
        
        try {
            results.push(await this.userAuthenticationTest());
            results.push(await this.productCatalogTest());
            results.push(await this.dataValidationTest());
            results.push(await this.performanceTest());
            results.push(await this.workflowTest());
            
            // Generate final report
            const report = await this.executor.generateReport('html', 'api_test_report.html');
            console.log('\n📄 API test report generated: api_test_report.html');
            
        } catch (error) {
            console.error('❌ API examples failed:', error.message);
        }
        
        return results;
    }
}

module.exports = ApiExamples;
