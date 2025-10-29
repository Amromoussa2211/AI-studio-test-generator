/**
 * CSV Data Provider
 * Loads test data from CSV files
 */
const fs = require('fs').promises;
const path = require('path');
const DataProvider = require('./data-provider');

class CsvProvider extends DataProvider {
    constructor(config = {}) {
        super(config);
        this.delimiter = config.delimiter || ',';
        this.headers = config.headers !== false; // Default to true
        this.trim = config.trim !== false; // Default to true
        this.skipEmptyLines = config.skipEmptyLines !== false; // Default to true
        this.encoding = config.encoding || 'utf8';
    }

    /**
     * Load CSV data from file
     * @param {string} source - Path to CSV file
     * @returns {Promise<Array>} Parsed CSV data
     */
    async load(source) {
        try {
            const filePath = path.resolve(source);
            const fileContent = await fs.readFile(filePath, this.encoding);
            
            const rows = this.parseCsvContent(fileContent);
            
            this.data = rows;
            this.isLoaded = true;
            
            console.log(`✓ CSV data loaded from: ${filePath} (${this.count()} rows)`);
            return this.data;
            
        } catch (error) {
            console.error(`✗ Failed to load CSV data from ${source}:`, error.message);
            throw new Error(`CSV loading failed: ${error.message}`);
        }
    }

    /**
     * Parse CSV content string
     * @param {string} content - CSV content string
     * @returns {Array} Parsed rows
     */
    parseCsvContent(content) {
        const lines = content.split('\n').filter(line => {
            return this.skipEmptyLines ? line.trim() !== '' : true;
        });

        if (lines.length === 0) {
            return [];
        }

        // Parse header if enabled
        let headerRow = null;
        let dataStartIndex = 0;

        if (this.headers) {
            headerRow = this.parseCsvLine(lines[0]);
            dataStartIndex = 1;
        }

        // Parse data rows
        const data = [];
        for (let i = dataStartIndex; i < lines.length; i++) {
            const row = this.parseCsvLine(lines[i]);
            
            if (row.length === 1 && row[0] === '') {
                continue; // Skip empty lines
            }

            if (this.headers && headerRow) {
                // Create object with header keys
                const obj = {};
                for (let j = 0; j < Math.min(row.length, headerRow.length); j++) {
                    obj[headerRow[j]] = this.processValue(row[j]);
                }
                data.push(obj);
            } else {
                // Return as array
                data.push(row.map(value => this.processValue(value)));
            }
        }

        return data;
    }

    /**
     * Parse a single CSV line handling quoted fields
     * @param {string} line - CSV line to parse
     * @returns {Array} Parsed fields
     */
    parseCsvLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let i = 0;

        while (i < line.length) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i += 2;
                    continue;
                }
                inQuotes = !inQuotes;
            } else if (char === this.delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }

            i++;
        }

        result.push(current);
        return result;
    }

    /**
     * Process individual value
     * @param {string} value - Raw value
     * @returns {*} Processed value
     */
    processValue(value) {
        let processed = value;
        
        if (this.trim) {
            processed = processed.trim();
        }

        // Type conversion
        if (processed === 'true') return true;
        if (processed === 'false') return false;
        if (processed === 'null') return null;
        if (processed === 'undefined') return undefined;

        // Try to parse as number
        if (!isNaN(processed) && processed !== '') {
            return Number(processed);
        }

        // Try to parse as JSON
        if (processed.startsWith('[') || processed.startsWith('{')) {
            try {
                return JSON.parse(processed);
            } catch (e) {
                // Not valid JSON, return as string
            }
        }

        return processed;
    }

    /**
     * Load CSV data from string
     * @param {string} csvString - CSV content as string
     * @returns {Array} Parsed data
     */
    loadFromString(csvString) {
        this.data = this.parseCsvContent(csvString);
        this.isLoaded = true;
        
        console.log(`✓ CSV data loaded from string (${this.count()} rows)`);
        return this.data;
    }

    /**
     * Get data as objects with headers
     * @returns {Array} Data as object array
     */
    getAsObjects() {
        const data = this.getData();
        
        if (!this.headers) {
            throw new Error('Cannot get as objects - CSV was loaded without headers');
        }

        if (Array.isArray(data)) {
            return data.filter(item => typeof item === 'object');
        }

        return [];
    }

    /**
     * Get data as arrays
     * @returns {Array} Data as array of arrays
     */
    getAsArrays() {
        const data = this.getData();
        
        if (Array.isArray(data)) {
            return data.filter(item => Array.isArray(item));
        }

        return [];
    }

    /**
     * Get unique values for a column
     * @param {string} columnName - Column name or index
     * @returns {Array} Unique values
     */
    getUniqueValues(columnName) {
        const data = this.getAllData();
        const values = [];

        for (const row of data) {
            const value = typeof row === 'object' ? row[columnName] : row[columnName];
            if (!values.includes(value)) {
                values.push(value);
            }
        }

        return values;
    }

    /**
     * Filter data by column value
     * @param {string} columnName - Column name or index
     * @param {*} value - Value to match
     * @returns {Array} Filtered data
     */
    filterByColumn(columnName, value) {
        const data = this.getAllData();
        return data.filter(row => {
            if (typeof row === 'object') {
                return row[columnName] === value;
            }
            return row[columnName] === value;
        });
    }

    /**
     * Sort data by column
     * @param {string} columnName - Column name or index
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array} Sorted data
     */
    sortByColumn(columnName, order = 'asc') {
        const data = this.getAllData();
        return data.sort((a, b) => {
            const valA = typeof a === 'object' ? a[columnName] : a[columnName];
            const valB = typeof b === 'object' ? b[columnName] : b[columnName];

            if (order === 'desc') {
                return valB > valA ? 1 : -1;
            }
            return valA > valB ? 1 : -1;
        });
    }
}

module.exports = CsvProvider;
