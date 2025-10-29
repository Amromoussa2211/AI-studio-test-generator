/**
 * Data Validation Utilities
 * Validates and checks test data integrity
 */
class DataValidator {
    /**
     * Validate if value is not null/undefined
     * @param {*} value - Value to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isNotNull(value, fieldName = 'field') {
        if (value === null || value === undefined) {
            throw new Error(`${fieldName} cannot be null or undefined`);
        }
        return true;
    }

    /**
     * Validate string is not empty
     * @param {string} value - String to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isNotEmpty(value, fieldName = 'field') {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error(`${fieldName} cannot be empty`);
        }
        return true;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isValidEmail(email, fieldName = 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error(`${fieldName} is not a valid email address`);
        }
        return true;
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isValidUrl(url, fieldName = 'url') {
        try {
            new URL(url);
            return true;
        } catch {
            throw new Error(`${fieldName} is not a valid URL`);
        }
    }

    /**
     * Validate number is within range
     * @param {number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isInRange(value, min, max, fieldName = 'number') {
        if (typeof value !== 'number' || value < min || value > max) {
            throw new Error(`${fieldName} must be between ${min} and ${max}`);
        }
        return true;
    }

    /**
     * Validate string length
     * @param {string} value - String to validate
     * @param {number} min - Minimum length
     * @param {number} max - Maximum length
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static hasValidLength(value, min, max, fieldName = 'string') {
        if (typeof value !== 'string') {
            throw new Error(`${fieldName} must be a string`);
        }
        if (value.length < min || value.length > max) {
            throw new Error(`${fieldName} length must be between ${min} and ${max} characters`);
        }
        return true;
    }

    /**
     * Validate array has minimum length
     * @param {Array} array - Array to validate
     * @param {number} min - Minimum length
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static hasMinimumItems(array, min, fieldName = 'array') {
        if (!Array.isArray(array) || array.length < min) {
            throw new Error(`${fieldName} must have at least ${min} items`);
        }
        return true;
    }

    /**
     * Validate object has required properties
     * @param {Object} obj - Object to validate
     * @param {Array} requiredProps - Required property names
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static hasRequiredProperties(obj, requiredProps, fieldName = 'object') {
        if (typeof obj !== 'object' || obj === null) {
            throw new Error(`${fieldName} must be an object`);
        }

        const missingProps = requiredProps.filter(prop => !(prop in obj));
        if (missingProps.length > 0) {
            throw new Error(`${fieldName} is missing required properties: ${missingProps.join(', ')}`);
        }
        return true;
    }

    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isValidPhone(phone, fieldName = 'phone') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        if (!phoneRegex.test(cleanPhone)) {
            throw new Error(`${fieldName} is not a valid phone number`);
        }
        return true;
    }

    /**
     * Validate date format
     * @param {string|Date} date - Date to validate
     * @param {string} format - Expected format ('YYYY-MM-DD', 'MM/DD/YYYY', etc.)
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isValidDate(date, format = 'YYYY-MM-DD', fieldName = 'date') {
        const dateObj = new Date(date);
        
        if (isNaN(dateObj.getTime())) {
            throw new Error(`${fieldName} is not a valid date`);
        }

        // Additional format validation
        const dateStr = dateObj.toISOString().split('T')[0];
        if (format === 'YYYY-MM-DD' && dateStr !== date) {
            throw new Error(`${fieldName} does not match expected format ${format}`);
        }

        return true;
    }

    /**
     * Validate credit card number (basic Luhn check)
     * @param {string} cardNumber - Credit card number
     * @param {string} fieldName - Field name for error reporting
     * @returns {boolean} True if valid
     */
    static isValidCreditCard(cardNumber, fieldName = 'credit card') {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        
        if (!/^\d+$/.test(cleanNumber)) {
            throw new Error(`${fieldName} must contain only digits`);
        }

        // Luhn algorithm
        let sum = 0;
        let alternate = false;
        
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i), 10);
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        if (sum % 10 !== 0) {
            throw new Error(`${fieldName} is not a valid credit card number`);
        }
        
        return true;
    }

    /**
     * Validate data set consistency
     * @param {Array} data - Array of data objects
     * @param {Object} rules - Validation rules
     * @returns {ValidationResult} Validation result
     */
    static validateDataSet(data, rules = {}) {
        const {
            requiredFields = [],
            fieldTypes = {},
            fieldConstraints = {}
        } = rules;

        const result = {
            isValid: true,
            errors: [],
            warnings: [],
            totalItems: data.length,
            validItems: 0
        };

        data.forEach((item, index) => {
            try {
                // Check required fields
                if (requiredFields.length > 0) {
                    this.hasRequiredProperties(item, requiredFields, `Item ${index}`);
                }

                // Check field types
                Object.entries(fieldTypes).forEach(([field, expectedType]) => {
                    if (field in item && typeof item[field] !== expectedType) {
                        throw new Error(`Item ${index}: Field '${field}' should be of type ${expectedType}`);
                    }
                });

                // Check field constraints
                Object.entries(fieldConstraints).forEach(([field, constraints]) => {
                    if (field in item) {
                        const value = item[field];
                        
                        if (constraints.min !== undefined && value < constraints.min) {
                            throw new Error(`Item ${index}: Field '${field}' is below minimum value ${constraints.min}`);
                        }
                        
                        if (constraints.max !== undefined && value > constraints.max) {
                            throw new Error(`Item ${index}: Field '${field}' exceeds maximum value ${constraints.max}`);
                        }
                        
                        if (constraints.minLength !== undefined && value.length < constraints.minLength) {
                            throw new Error(`Item ${index}: Field '${field}' is below minimum length ${constraints.minLength}`);
                        }
                        
                        if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
                            throw new Error(`Item ${index}: Field '${field}' exceeds maximum length ${constraints.maxLength}`);
                        }
                        
                        if (constraints.pattern && !constraints.pattern.test(value)) {
                            throw new Error(`Item ${index}: Field '${field}' does not match required pattern`);
                        }
                    }
                });

                result.validItems++;
            } catch (error) {
                result.isValid = false;
                result.errors.push(error.message);
            }
        });

        return result;
    }

    /**
     * Create validation schema for complex objects
     * @param {Object} schema - Validation schema
     * @returns {Function} Validation function
     */
    static createSchema(schema) {
        return (data) => {
            const errors = [];
            
            if (schema.required && !DataValidator.hasRequiredProperties(data, schema.required)) {
                errors.push('Missing required properties');
            }

            if (schema.types) {
                Object.entries(schema.types).forEach(([field, expectedType]) => {
                    if (field in data && typeof data[field] !== expectedType) {
                        errors.push(`Field '${field}' should be of type ${expectedType}`);
                    }
                });
            }

            if (errors.length > 0) {
                throw new Error(`Validation failed: ${errors.join(', ')}`);
            }

            return true;
        };
    }

    /**
     * Sanitize data by removing null/undefined values
     * @param {Object} data - Data to sanitize
     * @returns {Object} Sanitized data
     */
    static sanitize(data) {
        if (Array.isArray(data)) {
            return data.map(item => this.sanitize(item)).filter(item => item !== null);
        }
        
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            Object.entries(data).forEach(([key, value]) => {
                const sanitizedValue = this.sanitize(value);
                if (sanitizedValue !== null && sanitizedValue !== undefined) {
                    sanitized[key] = sanitizedValue;
                }
            });
            return sanitized;
        }
        
        return data;
    }
}

module.exports = DataValidator;
