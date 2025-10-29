/**
 * Data Management Utilities
 * Handles test data lifecycle and isolation
 */
class DataManager {
    constructor(config = {}) {
        this.config = config;
        this.dataStore = new Map();
        this.testIsolation = config.testIsolation !== false; // Default to true
        this.autoCleanup = config.autoCleanup !== false; // Default to true
        this.cleanupQueue = [];
    }

    /**
     * Create isolated test data
     * @param {string} testId - Unique test identifier
     * @param {Object} template - Data template
     * @param {Object} options - Creation options
     * @returns {Object} Isolated data
     */
    createTestData(testId, template, options = {}) {
        const {
            autoIncrement = false,
            prefix = 'test',
            timestamp = true,
            random = true
        } = options;

        let isolatedData = { ...template };

        // Add test identifier
        if (this.testIsolation) {
            isolatedData.testId = testId;
            isolatedData.testPrefix = prefix;
        }

        // Add timestamp
        if (timestamp) {
            isolatedData.createdAt = new Date().toISOString();
            isolatedData.timestamp = Date.now();
        }

        // Add random identifier for uniqueness
        if (random) {
            isolatedData.randomId = this.generateRandomId();
        }

        // Auto-increment fields
        if (autoIncrement) {
            const counter = this.getTestCounter(testId);
            Object.keys(autoIncrement).forEach(field => {
                if (field in isolatedData) {
                    isolatedData[field] = isolatedData[field] + counter;
                } else {
                    isolatedData[field] = counter;
                }
            });
        }

        // Store in data store
        this.dataStore.set(testId, {
            original: template,
            isolated: isolatedData,
            createdAt: new Date().toISOString(),
            metadata: options.metadata || {}
        });

        console.log(`📦 Created test data for: ${testId}`);
        return isolatedData;
    }

    /**
     * Get isolated test data
     * @param {string} testId - Test identifier
     * @returns {Object} Isolated data or null
     */
    getTestData(testId) {
        const stored = this.dataStore.get(testId);
        return stored ? stored.isolated : null;
    }

    /**
     * Update test data
     * @param {string} testId - Test identifier
     * @param {Object} updates - Updates to apply
     */
    updateTestData(testId, updates) {
        const stored = this.dataStore.get(testId);
        if (!stored) {
            throw new Error(`No test data found for testId: ${testId}`);
        }

        stored.isolated = { ...stored.isolated, ...updates };
        stored.updatedAt = new Date().toISOString();
        
        this.dataStore.set(testId, stored);
        console.log(`🔄 Updated test data for: ${testId}`);
    }

    /**
     * Clone test data for multiple test cases
     * @param {string} parentTestId - Parent test identifier
     * @param {number} count - Number of clones to create
     * @param {Object} modifications - Modifications for each clone
     * @returns {Array} Array of cloned test data
     */
    cloneTestData(parentTestId, count = 1, modifications = {}) {
        const parentData = this.getTestData(parentTestId);
        if (!parentData) {
            throw new Error(`No test data found for parent testId: ${parentTestId}`);
        }

        const clones = [];
        for (let i = 0; i < count; i++) {
            const cloneId = `${parentTestId}_clone_${i}`;
            const cloneData = { 
                ...parentData, 
                cloneId,
                cloneIndex: i,
                clonedAt: new Date().toISOString()
            };

            // Apply modifications
            if (modifications.array && Array.isArray(modifications.array)) {
                const modification = modifications.array[i] || {};
                Object.assign(cloneData, modification);
            } else if (typeof modifications === 'function') {
                Object.assign(cloneData, modifications(cloneData, i));
            }

            // Store clone
            this.dataStore.set(cloneId, {
                original: parentData,
                isolated: cloneData,
                createdAt: new Date().toISOString(),
                metadata: { parentId: parentTestId, isClone: true }
            });

            clones.push(cloneData);
        }

        console.log(`📋 Created ${count} clones for: ${parentTestId}`);
        return clones;
    }

    /**
     * Create test data set
     * @param {string} datasetName - Dataset name
     * @param {Function} generatorFn - Data generator function
     * @param {number} count - Number of items to generate
     * @param {Object} options - Generation options
     * @returns {Array} Generated dataset
     */
    createDataset(datasetName, generatorFn, count = 10, options = {}) {
        const dataset = [];
        for (let i = 0; i < count; i++) {
            const testId = `${datasetName}_item_${i}`;
            const item = generatorFn();
            
            const isolatedData = this.createTestData(testId, item, {
                ...options,
                metadata: { dataset: datasetName, index: i }
            });
            
            dataset.push(isolatedData);
        }

        // Store dataset reference
        this.dataStore.set(datasetName, {
            type: 'dataset',
            data: dataset,
            createdAt: new Date().toISOString(),
            metadata: options.metadata || {}
        });

        console.log(`📊 Created dataset '${datasetName}' with ${count} items`);
        return dataset;
    }

    /**
     * Get dataset
     * @param {string} datasetName - Dataset name
     * @returns {Array} Dataset or null
     */
    getDataset(datasetName) {
        const stored = this.dataStore.get(datasetName);
        return stored && stored.type === 'dataset' ? stored.data : null;
    }

    /**
     * Clean up test data
     * @param {string} testId - Test identifier to cleanup
     * @returns {boolean} Success status
     */
    cleanupTestData(testId) {
        const stored = this.dataStore.get(testId);
        if (!stored) {
            console.warn(`⚠️ No test data found for cleanup: ${testId}`);
            return false;
        }

        // Execute cleanup hooks if defined
        if (stored.metadata && stored.metadata.cleanup) {
            try {
                stored.metadata.cleanup(stored.isolated);
            } catch (error) {
                console.error(`❌ Cleanup failed for ${testId}:`, error.message);
            }
        }

        this.dataStore.delete(testId);
        console.log(`🧹 Cleaned up test data for: ${testId}`);
        return true;
    }

    /**
     * Clean up all test data
     * @param {Function} filterFn - Optional filter function
     * @returns {number} Number of items cleaned up
     */
    cleanupAll(filterFn = null) {
        let cleaned = 0;
        const keysToDelete = [];

        for (const [key, value] of this.dataStore.entries()) {
            if (!filterFn || filterFn(key, value)) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            this.cleanupTestData(key);
            cleaned++;
        });

        console.log(`🧹🧹🧹 Cleaned up ${cleaned} test data items`);
        return cleaned;
    }

    /**
     * Schedule cleanup for later
     * @param {string} testId - Test identifier
     * @param {number} delay - Delay in milliseconds
     */
    scheduleCleanup(testId, delay = 5000) {
        const timeoutId = setTimeout(() => {
            this.cleanupTestData(testId);
        }, delay);

        this.cleanupQueue.push({ testId, timeoutId });
        console.log(`⏰ Scheduled cleanup for: ${testId} in ${delay}ms`);
    }

    /**
     * Cancel scheduled cleanup
     * @param {string} testId - Test identifier
     */
    cancelScheduledCleanup(testId) {
        const index = this.cleanupQueue.findIndex(item => item.testId === testId);
        if (index !== -1) {
            clearTimeout(this.cleanupQueue[index].timeoutId);
            this.cleanupQueue.splice(index, 1);
            console.log(`❌ Cancelled scheduled cleanup for: ${testId}`);
        }
    }

    /**
     * Get data statistics
     * @returns {Object} Data store statistics
     */
    getStats() {
        const stats = {
            totalItems: this.dataStore.size,
            datasets: 0,
            testDataItems: 0,
            clones: 0
        };

        for (const [key, value] of this.dataStore.entries()) {
            if (value.type === 'dataset') {
                stats.datasets++;
            } else if (value.metadata && value.metadata.isClone) {
                stats.clones++;
            } else {
                stats.testDataItems++;
            }
        }

        return stats;
    }

    /**
     * Export data store
     * @param {string} format - Export format ('json', 'csv')
     * @returns {string} Exported data
     */
    exportData(format = 'json') {
        const data = {};
        for (const [key, value] of this.dataStore.entries()) {
            if (value.type === 'dataset') {
                data[key] = value.data;
            } else {
                data[key] = value.isolated;
            }
        }

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }

        if (format === 'csv') {
            return this.convertToCsv(data);
        }

        throw new Error(`Unsupported export format: ${format}`);
    }

    /**
     * Convert data to CSV format
     * @param {Object} data - Data to convert
     * @returns {string} CSV string
     */
    convertToCsv(data) {
        const allItems = [];
        const allFields = new Set();

        // Collect all fields and items
        Object.values(data).forEach(item => {
            if (Array.isArray(item)) {
                item.forEach(subItem => {
                    allItems.push(subItem);
                    Object.keys(subItem).forEach(field => allFields.add(field));
                });
            } else {
                allItems.push(item);
                Object.keys(item).forEach(field => allFields.add(field));
            }
        });

        // Create CSV
        const fields = Array.from(allFields);
        const headers = fields.join(',');
        const rows = allItems.map(item => {
            return fields.map(field => {
                const value = item[field];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',');
        });

        return [headers, ...rows].join('\n');
    }

    /**
     * Generate random ID
     * @returns {string} Random ID
     */
    generateRandomId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Get test counter for auto-increment
     * @param {string} testId - Test identifier
     * @returns {number} Counter value
     */
    getTestCounter(testId) {
        const stored = this.dataStore.get(testId);
        return stored ? (stored.counter || 0) + 1 : 1;
    }

    /**
     * Set up test environment data
     * @param {string} env - Environment name
     * @param {Object} data - Environment data
     */
    setupEnvironmentData(env, data) {
        const envKey = `env_${env}`;
        this.dataStore.set(envKey, {
            type: 'environment',
            data,
            createdAt: new Date().toISOString()
        });
        console.log(`🌍 Setup environment data for: ${env}`);
    }

    /**
     * Get environment data
     * @param {string} env - Environment name
     * @returns {Object} Environment data
     */
    getEnvironmentData(env) {
        const envKey = `env_${env}`;
        const stored = this.dataStore.get(envKey);
        return stored ? stored.data : null;
    }

    /**
     * Reset data manager
     */
    reset() {
        // Cancel all scheduled cleanups
        this.cleanupQueue.forEach(item => {
            clearTimeout(item.timeoutId);
        });
        this.cleanupQueue = [];

        // Clear data store
        this.dataStore.clear();
        
        console.log('🔄 Data manager reset');
    }
}

module.exports = DataManager;
