/**
 * Data Transformation Utilities
 * Transform and manipulate test data
 */
class DataTransformer {
    /**
     * Transform data object with mapping rules
     * @param {Object} data - Source data
     * @param {Object} mapping - Field mapping rules
     * @returns {Object} Transformed data
     */
    static transformWithMapping(data, mapping) {
        const transformed = {};
        
        Object.entries(mapping).forEach(([targetField, sourceField]) => {
            if (typeof sourceField === 'string') {
                // Direct field mapping
                transformed[targetField] = this.getNestedValue(data, sourceField);
            } else if (typeof sourceField === 'function') {
                // Function-based transformation
                transformed[targetField] = sourceField(data);
            } else if (typeof sourceField === 'object' && sourceField !== null) {
                // Complex transformation
                transformed[targetField] = this.applyComplexTransform(data, sourceField);
            }
        });
        
        return transformed;
    }

    /**
     * Get nested value from object using dot notation
     * @param {Object} obj - Source object
     * @param {string} path - Dot notation path
     * @returns {*} Nested value
     */
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * Apply complex transformation rules
     * @param {Object} data - Source data
     * @param {Object} rules - Transformation rules
     * @returns {*} Transformed value
     */
    static applyComplexTransform(data, rules) {
        const {
            mapFrom,
            transform,
            defaultValue,
            required = false
        } = rules;

        let value = this.getNestedValue(data, mapFrom);
        
        if (value === null || value === undefined) {
            if (required) {
                throw new Error(`Required field '${mapFrom}' is missing`);
            }
            return defaultValue || null;
        }

        if (transform) {
            if (Array.isArray(transform)) {
                // Chain transformations
                return transform.reduce((val, transformFn) => {
                    return typeof transformFn === 'function' ? transformFn(val) : val;
                }, value);
            } else if (typeof transform === 'function') {
                return transform(value);
            }
        }

        return value;
    }

    /**
     * Flatten nested object
     * @param {Object} obj - Nested object
     * @param {string} separator - Separator for flattened keys
     * @returns {Object} Flattened object
     */
    static flattenObject(obj, separator = '.') {
        const flattened = {};
        
        function flatten(current, prefix = '') {
            Object.entries(current).forEach(([key, value]) => {
                const newKey = prefix ? `${prefix}${separator}${key}` : key;
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    flatten(value, newKey);
                } else {
                    flattened[newKey] = value;
                }
            });
        }
        
        flatten(obj);
        return flattened;
    }

    /**
     * Unflatten object
     * @param {Object} obj - Flattened object
     * @param {string} separator - Separator used in flattened keys
     * @returns {Object} Nested object
     */
    static unflattenObject(obj, separator = '.') {
        const result = {};
        
        Object.entries(obj).forEach(([key, value]) => {
            const keys = key.split(separator);
            let current = result;
            
            keys.forEach((k, index) => {
                if (index === keys.length - 1) {
                    current[k] = value;
                } else {
                    if (!current[k] || typeof current[k] !== 'object') {
                        current[k] = {};
                    }
                    current = current[k];
                }
            });
        });
        
        return result;
    }

    /**
     * Merge multiple objects
     * @param {...Object} objects - Objects to merge
     * @returns {Object} Merged object
     */
    static merge(...objects) {
        return objects.reduce((merged, obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                if (merged[key] && typeof merged[key] === 'object' && typeof value === 'object') {
                    merged[key] = this.merge(merged[key], value);
                } else {
                    merged[key] = value;
                }
            });
            return merged;
        }, {});
    }

    /**
     * Rename object keys
     * @param {Object} obj - Source object
     * @param {Object} keyMap - Key mapping { oldKey: newKey }
     * @returns {Object} Object with renamed keys
     */
    static renameKeys(obj, keyMap) {
        const renamed = {};
        
        Object.entries(obj).forEach(([key, value]) => {
            const newKey = keyMap[key] || key;
            renamed[newKey] = value;
        });
        
        return renamed;
    }

    /**
     * Pick specific fields from object
     * @param {Object} obj - Source object
     * @param {Array} fields - Fields to pick
     * @returns {Object} Object with only specified fields
     */
    static pick(obj, fields) {
        const picked = {};
        fields.forEach(field => {
            if (field in obj) {
                picked[field] = obj[field];
            }
        });
        return picked;
    }

    /**
     * Omit specific fields from object
     * @param {Object} obj - Source object
     * @param {Array} fields - Fields to omit
     * @returns {Object} Object without specified fields
     */
    static omit(obj, fields) {
        const omitted = { ...obj };
        fields.forEach(field => {
            delete omitted[field];
        });
        return omitted;
    }

    /**
     * Filter array of objects
     * @param {Array} array - Array to filter
     * @param {Function} filterFn - Filter function
     * @returns {Array} Filtered array
     */
    static filter(array, filterFn) {
        return array.filter(filterFn);
    }

    /**
     * Sort array of objects
     * @param {Array} array - Array to sort
     * @param {string|Function} sortBy - Field to sort by or sort function
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array} Sorted array
     */
    static sort(array, sortBy, order = 'asc') {
        return [...array].sort((a, b) => {
            if (typeof sortBy === 'function') {
                return order === 'desc' ? sortBy(b, a) : sortBy(a, b);
            }
            
            const aVal = typeof a === 'object' ? a[sortBy] : a;
            const bVal = typeof b === 'object' ? b[sortBy] : b;
            
            if (order === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    }

    /**
     * Group array of objects by field
     * @param {Array} array - Array to group
     * @param {string} field - Field to group by
     * @returns {Object} Grouped object
     */
    static groupBy(array, field) {
        return array.reduce((groups, item) => {
            const key = typeof item === 'object' ? item[field] : item;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }

    /**
     * Unique array by field
     * @param {Array} array - Array to make unique
     * @param {string} field - Field to check uniqueness (optional)
     * @returns {Array} Unique array
     */
    static unique(array, field = null) {
        if (!field) {
            return [...new Set(array)];
        }
        
        const seen = new Set();
        return array.filter(item => {
            const key = typeof item === 'object' ? item[field] : item;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    /**
     * Chunk array into smaller arrays
     * @param {Array} array - Array to chunk
     * @param {number} size - Chunk size
     * @returns {Array} Array of chunks
     */
    static chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Convert CSV data to objects
     * @param {Array} csvData - CSV data as arrays
     * @param {Array} headers - Column headers
     * @returns {Array} Array of objects
     */
    static csvToObjects(csvData, headers) {
        return csvData.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
    }

    /**
     * Convert objects to CSV format
     * @param {Array} objects - Array of objects
     * @param {Array} columns - Columns to include
     * @returns {Object} { headers: Array, rows: Array }
     */
    static objectsToCsv(objects, columns = null) {
        if (objects.length === 0) {
            return { headers: [], rows: [] };
        }
        
        const headers = columns || Object.keys(objects[0]);
        const rows = objects.map(obj => headers.map(header => obj[header] || ''));
        
        return { headers, rows };
    }

    /**
     * Templating - replace placeholders in string
     * @param {string} template - Template string with placeholders
     * @param {Object} data - Data to replace placeholders
     * @returns {string} Processed string
     */
    static template(template, data) {
        return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
            return this.getNestedValue(data, path.trim()) || match;
        });
    }

    /**
     * Apply transformations to entire dataset
     * @param {Array} data - Array of data objects
     * @param {Object} transforms - Transformation rules
     * @returns {Array} Transformed data array
     */
    static transformDataset(data, transforms = {}) {
        const {
            fieldMapping = {},
            filters = [],
            sorts = [],
            groups = {}
        } = transforms;

        let transformed = data;

        // Apply field mapping
        if (Object.keys(fieldMapping).length > 0) {
            transformed = transformed.map(item => this.transformWithMapping(item, fieldMapping));
        }

        // Apply filters
        filters.forEach(filter => {
            transformed = this.filter(transformed, filter);
        });

        // Apply sorts
        sorts.forEach(sort => {
            transformed = this.sort(transformed, sort.field, sort.order);
        });

        // Apply grouping if specified
        if (groups.by) {
            transformed = this.groupBy(transformed, groups.by);
        }

        return transformed;
    }
}

module.exports = DataTransformer;
