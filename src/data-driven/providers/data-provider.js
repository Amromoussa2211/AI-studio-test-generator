/**
 * Base Data Provider Class
 * All data providers should extend this class
 */
class DataProvider {
    constructor(config = {}) {
        this.config = config;
        this.data = null;
        this.isLoaded = false;
    }

    /**
     * Load data from source
     * @param {string} source - Data source path or URL
     * @returns {Promise<Object>} Loaded data
     */
    async load(source) {
        throw new Error('load method must be implemented by subclass');
    }

    /**
     * Get loaded data
     * @returns {Object} The loaded data
     */
    getData() {
        if (!this.isLoaded) {
            throw new Error('Data must be loaded before accessing');
        }
        return this.data;
    }

    /**
     * Get data by index
     * @param {number} index - Index of data item
     * @returns {Object} Data item at specified index
     */
    getDataByIndex(index) {
        const data = this.getData();
        if (Array.isArray(data)) {
            return data[index];
        }
        return data;
    }

    /**
     * Get all data items
     * @returns {Array} All data items
     */
    getAllData() {
        const data = this.getData();
        return Array.isArray(data) ? data : [data];
    }

    /**
     * Filter data based on criteria
     * @param {Function} filterFn - Filter function
     * @returns {Array} Filtered data
     */
    filter(filterFn) {
        const data = this.getAllData();
        return data.filter(filterFn);
    }

    /**
     * Transform data using mapper function
     * @param {Function} mapperFn - Transformation function
     * @returns {Array} Transformed data
     */
    map(mapperFn) {
        const data = this.getAllData();
        return data.map(mapperFn);
    }

    /**
     * Get count of data items
     * @returns {number} Number of data items
     */
    count() {
        return this.getAllData().length;
    }

    /**
     * Check if data is loaded
     * @returns {boolean} True if data is loaded
     */
    isDataLoaded() {
        return this.isLoaded;
    }
}

module.exports = DataProvider;
