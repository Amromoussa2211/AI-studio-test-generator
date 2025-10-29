/**
 * Data-Driven Test Executor
 * Executes tests with data from data providers
 */
const fs = require('fs').promises;
const path = require('path');

class TestExecutor {
    constructor(config = {}) {
        this.config = config;
        this.testResults = [];
        this.currentTest = null;
        this.listeners = {
            testStart: [],
            testEnd: [],
            testSuccess: [],
            testFailure: []
        };
    }

    /**
     * Execute data-driven test
     * @param {Function} testFn - Test function to execute
     * @param {Object} dataProvider - Data provider instance
     * @param {Object} options - Test options
     * @returns {Promise<TestResult>} Test execution result
     */
    async execute(testFn, dataProvider, options = {}) {
        const {
            testName = 'Data-Driven Test',
            dataIndex = null,
            parallel = false,
            maxRetries = 0,
            timeout = 30000,
            beforeEach = null,
            afterEach = null
        } = options;

        console.log(`\n🚀 Starting Data-Driven Test: ${testName}`);
        
        if (!dataProvider.isDataLoaded()) {
            throw new Error('Data must be loaded before executing test');
        }

        const testData = dataProvider.getAllData();
        const results = [];

        if (dataIndex !== null) {
            // Execute single test case
            const result = await this.executeSingleTest(
                testFn, 
                testData[dataIndex], 
                dataIndex, 
                testName,
                { maxRetries, timeout, beforeEach, afterEach }
            );
            results.push(result);
        } else {
            // Execute all test cases
            console.log(`📊 Running ${testData.length} test cases`);
            
            if (parallel) {
                const promises = testData.map((data, index) =>
                    this.executeSingleTest(
                        testFn, 
                        data, 
                        index, 
                        `${testName} - Case ${index + 1}`,
                        { maxRetries, timeout, beforeEach, afterEach }
                    )
                );
                results.push(...await Promise.all(promises));
            } else {
                for (let i = 0; i < testData.length; i++) {
                    const result = await this.executeSingleTest(
                        testFn, 
                        testData[i], 
                        i, 
                        `${testName} - Case ${i + 1}`,
                        { maxRetries, timeout, beforeEach, afterEach }
                    );
                    results.push(result);
                }
            }
        }

        const finalResult = this.summarizeResults(results);
        this.testResults.push(finalResult);
        
        console.log(`\n${finalResult.passed === finalResult.total ? '✅' : '❌'} ${testName}: ${finalResult.passed}/${finalResult.total} passed`);
        
        return finalResult;
    }

    /**
     * Execute a single test case
     * @param {Function} testFn - Test function
     * @param {Object} testData - Test data
     * @param {number} index - Test index
     * @param {string} testName - Test name
     * @param {Object} options - Execution options
     * @returns {Promise<TestResult>} Individual test result
     */
    async executeSingleTest(testFn, testData, index, testName, options) {
        const { maxRetries, timeout, beforeEach, afterEach } = options;
        
        this.notifyListeners('testStart', { testName, index, data: testData });
        
        const result = {
            testName,
            index,
            data: testData,
            passed: false,
            error: null,
            duration: 0,
            attempts: 0,
            timestamp: new Date().toISOString()
        };

        let lastError = null;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            result.attempts = attempt + 1;
            const startTime = Date.now();
            
            try {
                // Execute beforeEach hook
                if (beforeEach && attempt === 0) {
                    await beforeEach(testData);
                }

                // Execute test with timeout
                const testPromise = testFn(testData, index);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout);
                });
                
                await Promise.race([testPromise, timeoutPromise]);
                
                result.duration = Date.now() - startTime;
                result.passed = true;
                
                // Execute afterEach hook
                if (afterEach) {
                    await afterEach(testData);
                }
                
                this.notifyListeners('testSuccess', result);
                break;
                
            } catch (error) {
                lastError = error;
                result.error = error.message;
                result.duration = Date.now() - startTime;
                
                this.notifyListeners('testFailure', result);
                
                if (attempt === maxRetries) {
                    console.log(`❌ Test case ${index + 1} failed: ${error.message}`);
                }
            }
        }

        return result;
    }

    /**
     * Execute parameterized test for different test types
     * @param {string} testType - Type of test ('web', 'mobile', 'api')
     * @param {Function} testFn - Test function
     * @param {Object} dataProvider - Data provider
     * @param {Object} options - Test options
     * @returns {Promise<TestResult>} Test result
     */
    async executeParameterized(testType, testFn, dataProvider, options = {}) {
        const baseOptions = {
            ...options,
            beforeEach: async (data) => {
                console.log(`🔧 Setting up ${testType} test with data:`, JSON.stringify(data, null, 2));
                
                if (options.beforeEach) {
                    await options.beforeEach(data);
                }
            }
        };

        return this.execute(testFn, dataProvider, baseOptions);
    }

    /**
     * Execute web tests
     * @param {Function} testFn - Web test function
     * @param {Object} dataProvider - Data provider
     * @param {Object} options - Test options
     * @returns {Promise<TestResult>} Test result
     */
    async executeWebTest(testFn, dataProvider, options = {}) {
        return this.executeParameterized('web', testFn, dataProvider, options);
    }

    /**
     * Execute mobile tests
     * @param {Function} testFn - Mobile test function
     * @param {Object} dataProvider - Data provider
     * @param {Object} options - Test options
     * @returns {Promise<TestResult>} Test result
     */
    async executeMobileTest(testFn, dataProvider, options = {}) {
        return this.executeParameterized('mobile', testFn, dataProvider, options);
    }

    /**
     * Execute API tests
     * @param {Function} testFn - API test function
     * @param {Object} dataProvider - Data provider
     * @param {Object} options - Test options
     * @returns {Promise<TestResult>} Test result
     */
    async executeApiTest(testFn, dataProvider, options = {}) {
        return this.executeParameterized('api', testFn, dataProvider, options);
    }

    /**
     * Summarize test results
     * @param {Array} results - Individual test results
     * @returns {Object} Summary
     */
    summarizeResults(results) {
        const passed = results.filter(r => r.passed).length;
        const failed = results.filter(r => !r.passed).length;
        const total = results.length;
        
        return {
            testName: results[0]?.testName || 'Unknown Test',
            total,
            passed,
            failed,
            successRate: total > 0 ? (passed / total * 100).toFixed(2) : 0,
            duration: results.reduce((sum, r) => sum + r.duration, 0),
            results,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * Notify event listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    /**
     * Get test results
     * @returns {Array} All test results
     */
    getResults() {
        return this.testResults;
    }

    /**
     * Generate test report
     * @param {string} format - Report format ('json', 'html', 'csv')
     * @param {string} outputPath - Output file path
     * @returns {Promise<string>} Report content
     */
    async generateReport(format = 'json', outputPath = null) {
        let report = '';
        
        switch (format.toLowerCase()) {
            case 'json':
                report = JSON.stringify(this.testResults, null, 2);
                break;
                
            case 'html':
                report = this.generateHtmlReport();
                break;
                
            case 'csv':
                report = this.generateCsvReport();
                break;
                
            default:
                throw new Error(`Unsupported report format: ${format}`);
        }
        
        if (outputPath) {
            await fs.writeFile(outputPath, report);
            console.log(`📄 Report saved to: ${outputPath}`);
        }
        
        return report;
    }

    /**
     * Generate HTML report
     * @returns {string} HTML report
     */
    generateHtmlReport() {
        const totalTests = this.testResults.reduce((sum, r) => sum + r.total, 0);
        const totalPassed = this.testResults.reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = this.testResults.reduce((sum, r) => sum + r.failed, 0);
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Data-Driven Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .test-result { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .pass { border-left: 5px solid #4CAF50; }
        .fail { border-left: 5px solid #f44336; }
        .test-name { font-weight: bold; font-size: 18px; }
        .metrics { margin: 10px 0; }
        .metric { display: inline-block; margin-right: 20px; }
    </style>
</head>
<body>
    <h1>Data-Driven Test Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> ${totalTests}</p>
        <p><strong>Passed:</strong> ${totalPassed}</p>
        <p><strong>Failed:</strong> ${totalFailed}</p>
        <p><strong>Success Rate:</strong> ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0}%</p>
    </div>
    
    ${this.testResults.map(test => `
        <div class="test-result ${test.failed === 0 ? 'pass' : 'fail'}">
            <div class="test-name">${test.testName}</div>
            <div class="metrics">
                <span class="metric"><strong>Total:</strong> ${test.total}</span>
                <span class="metric"><strong>Passed:</strong> ${test.passed}</span>
                <span class="metric"><strong>Failed:</strong> ${test.failed}</span>
                <span class="metric"><strong>Duration:</strong> ${test.duration}ms</span>
            </div>
            ${test.results.filter(r => !r.passed).map(r => `
                <div style="color: red; margin: 5px 0;">
                    ❌ Case ${r.index + 1}: ${r.error}
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>`;
    }

    /**
     * Generate CSV report
     * @returns {string} CSV report
     */
    generateCsvReport() {
        const headers = ['Test Name', 'Test Case', 'Status', 'Error', 'Duration', 'Attempts', 'Timestamp'];
        const rows = [headers.join(',')];
        
        this.testResults.forEach(test => {
            test.results.forEach(result => {
                const row = [
                    `"${test.testName}"`,
                    result.index + 1,
                    result.passed ? 'PASS' : 'FAIL',
                    `"${result.error || ''}"`,
                    result.duration,
                    result.attempts,
                    `"${result.timestamp}"`
                ];
                rows.push(row.join(','));
            });
        });
        
        return rows.join('\n');
    }

    /**
     * Clear test results
     */
    clearResults() {
        this.testResults = [];
    }
}

module.exports = TestExecutor;
