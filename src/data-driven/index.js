/**
 * Data-Driven Testing Framework
 * A simple, flexible framework for data-driven testing in JavaScript
 */

// Core components
const DataProvider = require('./providers/data-provider');
const TestExecutor = require('./core/test-executor');
const DataValidator = require('./utils/data-validator');
const DataTransformer = require('./utils/data-transformer');
const DataGenerator = require('./generators/data-generator');
const DataManager = require('./managers/data-manager');

// Providers
const JsonProvider = require('./providers/json-provider');
const CsvProvider = require('./providers/csv-provider');

// Examples
const WebExamples = require('./examples/web-examples');
const MobileExamples = require('./examples/mobile-examples');
const ApiExamples = require('./examples/api-examples');

// Export everything
module.exports = {
    // Core framework
    DataProvider,
    TestExecutor,
    DataValidator,
    DataTransformer,
    DataGenerator,
    DataManager,
    
    // Data providers
    JsonProvider,
    CsvProvider,
    
    // Examples
    WebExamples,
    MobileExamples,
    ApiExamples,
    
    // Quick utilities
    providers: {
        json: JsonProvider,
        csv: CsvProvider
    },
    
    utils: {
        validate: DataValidator,
        transform: DataTransformer,
        generate: DataGenerator,
        manage: DataManager
    }
};

// Export default for convenience
module.exports.default = module.exports;
