/**
 * JSON Data Provider
 * Loads test data from JSON files
 */
const fs = require('fs').promises;
const path = require('path');
const DataProvider = require('./data-provider');

class JsonProvider extends DataProvider {
    constructor(config = {}) {
        super(config);
        this.encoding = config.encoding || 'utf8';
        this.validateSchema = config.validateSchema || false;
        this.schema = config.schema || null;
    }

    /**
     * Load JSON data from file
     * @param {string} source - Path to JSON file
     * @returns {Promise<Object>} Parsed JSON data
     */
    async load(source) {
        try {
            const filePath = path.resolve(source);
            const fileContent = await fs.readFile(filePath, this.encoding);
            
            // Handle JSON array or object
            const data = JSON.parse(fileContent);
            
            if (this.validateSchema && this.schema) {
                await this.validateData(data);
            }
            
            this.data = data;
            this.isLoaded = true;
            
            console.log(`✓ JSON data loaded from: ${filePath} (${this.count()} items)`);
            return this.data;
            
        } catch (error) {
            console.error(`✗ Failed to load JSON data from ${source}:`, error.message);
            throw new Error(`JSON loading failed: ${error.message}`);
        }
    }

    /**
     * Load JSON data from URL
     * @param {string} url - URL to JSON endpoint
     * @returns {Promise<Object>} Parsed JSON data
     */
    async loadFromUrl(url) {
        try {
            const https = require('https');
            const http = require('http');
            
            const client = url.startsWith('https:') ? https : http;
            
            return new Promise((resolve, reject) => {
                client.get(url, (response) => {
                    let data = '';
                    
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    response.on('end', async () => {
                        try {
                            const parsedData = JSON.parse(data);
                            
                            if (this.validateSchema && this.schema) {
                                await this.validateData(parsedData);
                            }
                            
                            this.data = parsedData;
                            this.isLoaded = true;
                            
                            console.log(`✓ JSON data loaded from URL: ${url} (${this.count()} items)`);
                            resolve(this.data);
                            
                        } catch (error) {
                            reject(new Error(`JSON parsing failed: ${error.message}`));
                        }
                    });
                    
                }).on('error', (error) => {
                    reject(new Error(`HTTP request failed: ${error.message}`));
                });
            });
            
        } catch (error) {
            console.error(`✗ Failed to load JSON from URL ${url}:`, error.message);
            throw error;
        }
    }

    /**
     * Validate data against schema
     * @param {Object} data - Data to validate
     */
    async validateData(data) {
        if (!this.schema) return;
        
        const { validate } = require('jsonschema');
        const validationResult = validate(data, this.schema);
        
        if (!validationResult.valid) {
            throw new Error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
        }
    }

    /**
     * Load multiple JSON files
     * @param {Array<string>} filePaths - Array of file paths
     * @returns {Promise<Array>} Combined data from all files
     */
    async loadMultiple(filePaths) {
        const results = await Promise.all(filePaths.map(filePath => this.load(filePath)));
        
        // Combine all data into single array
        this.data = results.flat();
        this.isLoaded = true;
        
        console.log(`✓ Loaded ${filePaths.length} JSON files (${this.count()} total items)`);
        return this.data;
    }

    /**
     * Get data with environment variable substitution
     * @returns {Object} Data with env vars replaced
     */
    getDataWithEnvVars() {
        const data = this.getData();
        
        if (typeof data === 'string') {
            return this.replaceEnvVars(data);
        }
        
        if (Array.isArray(data)) {
            return data.map(item => this.replaceEnvVarsInObject(item));
        }
        
        if (typeof data === 'object') {
            return this.replaceEnvVarsInObject(data);
        }
        
        return data;
    }

    /**
     * Replace environment variables in string
     * @param {string} str - String to process
     * @returns {String} String with env vars replaced
     */
    replaceEnvVars(str) {
        return str.replace(/\${([^}]+)}/g, (match, envVar) => {
            return process.env[envVar] || match;
        });
    }

    /**
     * Replace environment variables in object
     * @param {Object} obj - Object to process
     * @returns {Object} Object with env vars replaced
     */
    replaceEnvVarsInObject(obj) {
        const result = {};
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                result[key] = this.replaceEnvVars(value);
            } else if (Array.isArray(value)) {
                result[key] = value.map(item => 
                    typeof item === 'string' ? this.replaceEnvVars(item) : item
                );
            } else {
                result[key] = value;
            }
        }
        
        return result;
    }
}

module.exports = JsonProvider;
