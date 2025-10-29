/**
 * Test Data Generator
 * Generates realistic test data for various scenarios
 */
class DataGenerator {
    constructor(seed = null) {
        this.seed = seed;
        this.random = this.createRandom(seed);
    }

    /**
     * Create random number generator with seed
     * @param {number} seed - Seed value
     * @returns {Function} Random function
     */
    createRandom(seed) {
        if (seed === null) {
            return Math.random;
        }
        
        // Simple seeded random number generator (Linear Congruential Generator)
        let state = seed;
        return function() {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }

    /**
     * Generate random integer between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random float between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {number} decimals - Number of decimal places
     * @returns {number} Random float
     */
    randomFloat(min, max, decimals = 2) {
        const value = this.random() * (max - min) + min;
        return parseFloat(value.toFixed(decimals));
    }

    /**
     * Generate random string
     * @param {number} length - String length
     * @param {string} chars - Character set to use
     * @returns {string} Random string
     */
    randomString(length = 10, chars = 'abcdefghijklmnopqrstuvwxyz') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(this.random() * chars.length));
        }
        return result;
    }

    /**
     * Generate random alphanumeric string
     * @param {number} length - String length
     * @returns {string} Random alphanumeric string
     */
    randomAlphaNumeric(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return this.randomString(length, chars);
    }

    /**
     * Generate random UUID
     * @returns {string} UUID
     */
    randomUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = this.randomInt(0, 15);
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Generate random first name
     * @returns {string} Random first name
     */
    randomFirstName() {
        const firstNames = [
            'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa',
            'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'William', 'Linda',
            'Richard', 'Elizabeth', 'Joseph', 'Barbara', 'Thomas', 'Susan', 'Charles', 'Jessica',
            'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty'
        ];
        return firstNames[this.randomInt(0, firstNames.length - 1)];
    }

    /**
     * Generate random last name
     * @returns {string} Random last name
     */
    randomLastName() {
        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
            'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
            'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
        ];
        return lastNames[this.randomInt(0, lastNames.length - 1)];
    }

    /**
     * Generate random full name
     * @returns {string} Random full name
     */
    randomFullName() {
        return `${this.randomFirstName()} ${this.randomLastName()}`;
    }

    /**
     * Generate random email
     * @param {string} domain - Email domain (optional)
     * @returns {string} Random email
     */
    randomEmail(domain = 'example.com') {
        const firstName = this.randomFirstName().toLowerCase();
        const lastName = this.randomLastName().toLowerCase();
        const number = this.randomInt(1, 999);
        return `${firstName}.${lastName}${number}@${domain}`;
    }

    /**
     * Generate random phone number
     * @param {string} format - Phone format
     * @returns {string} Random phone number
     */
    randomPhone(format = '(XXX) XXX-XXXX') {
        const digits = '0123456789';
        let result = '';
        
        for (const char of format) {
            if (char === 'X') {
                result += digits[this.randomInt(0, digits.length - 1)];
            } else {
                result += char;
            }
        }
        
        return result;
    }

    /**
     * Generate random company name
     * @returns {string} Random company name
     */
    randomCompany() {
        const prefixes = ['Tech', 'Digital', 'Global', 'Smart', 'Next', 'Prime', 'Elite', 'Advanced'];
        const suffixes = ['Solutions', 'Systems', 'Corp', 'Inc', 'LLC', 'Group', 'Labs', 'Works'];
        
        const prefix = prefixes[this.randomInt(0, prefixes.length - 1)];
        const suffix = suffixes[this.randomInt(0, suffixes.length - 1)];
        
        return `${prefix} ${suffix}`;
    }

    /**
     * Generate random address
     * @returns {Object} Random address object
     */
    randomAddress() {
        const streets = [
            'Main St', 'Oak Ave', 'First St', 'Second St', 'Elm St', 'Pine St', 
            'Cedar St', 'Maple St', 'Birch St', 'Willow St', 'Park Ave', 'High St'
        ];
        
        const cities = [
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
            'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville'
        ];
        
        const states = [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
            'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
            'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
            'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];

        return {
            street: `${this.randomInt(1, 9999)} ${streets[this.randomInt(0, streets.length - 1)]}`,
            city: cities[this.randomInt(0, cities.length - 1)],
            state: states[this.randomInt(0, states.length - 1)],
            zipCode: this.randomInt(10000, 99999).toString(),
            country: 'USA'
        };
    }

    /**
     * Generate random date
     * @param {Date} start - Start date
     * @param {Date} end - End date
     * @returns {Date} Random date
     */
    randomDate(start = new Date(2020, 0, 1), end = new Date()) {
        const startTime = start.getTime();
        const endTime = end.getTime();
        const randomTime = this.randomInt(startTime, endTime);
        return new Date(randomTime);
    }

    /**
     * Generate random credit card number
     * @param {string} type - Card type ('visa', 'mastercard', 'amex', 'discover')
     * @returns {string} Random credit card number
     */
    randomCreditCard(type = 'visa') {
        const prefixes = {
            visa: ['4'],
            mastercard: ['51', '52', '53', '54', '55'],
            amex: ['34', '37'],
            discover: ['6011', '65']
        };

        const length = type === 'amex' ? 15 : 16;
        const prefixList = prefixes[type] || prefixes.visa;
        const prefix = prefixList[this.randomInt(0, prefixList.length - 1)];
        
        let number = prefix;
        while (number.length < length - 1) {
            number += this.randomInt(0, 9).toString();
        }
        
        // Add check digit using Luhn algorithm
        const checkDigit = this.calculateLuhnCheckDigit(number);
        number += checkDigit;
        
        return number;
    }

    /**
     * Calculate Luhn check digit
     * @param {string} number - Partial card number
     * @returns {string} Check digit
     */
    calculateLuhnCheckDigit(number) {
        let sum = 0;
        let shouldDouble = true;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        const checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit.toString();
    }

    /**
     * Generate random IP address
     * @returns {string} Random IP address
     */
    randomIP() {
        return `${this.randomInt(1, 255)}.${this.randomInt(0, 255)}.${this.randomInt(0, 255)}.${this.randomInt(1, 255)}`;
    }

    /**
     * Generate random URL
     * @returns {string} Random URL
     */
    randomUrl() {
        const protocols = ['http', 'https'];
        const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];
        const paths = ['page', 'api', 'admin', 'user', 'data', 'service'];
        
        const protocol = protocols[this.randomInt(0, protocols.length - 1)];
        const domain = domains[this.randomInt(0, domains.length - 1)];
        const path = paths[this.randomInt(0, paths.length - 1)];
        
        return `${protocol}://${domain}/${path}`;
    }

    /**
     * Generate random product data
     * @returns {Object} Random product object
     */
    randomProduct() {
        const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];
        const adjectives = ['Premium', 'Deluxe', 'Classic', 'Modern', 'Essential', 'Professional'];
        const nouns = ['Pro', 'Max', 'Plus', 'Standard', 'Ultra', 'Advanced'];
        
        return {
            id: this.randomUUID(),
            name: `${adjectives[this.randomInt(0, adjectives.length - 1)]} Product`,
            category: categories[this.randomInt(0, categories.length - 1)],
            price: this.randomFloat(10, 1000, 2),
            sku: this.randomAlphaNumeric(8).toUpperCase(),
            description: `High-quality ${adjectives[this.randomInt(0, adjectives.length - 1)]} item for everyday use`,
            inStock: this.randomInt(0, 1) === 1,
            rating: this.randomFloat(1, 5, 1),
            tags: [categories[this.randomInt(0, categories.length - 1)].toLowerCase(), 'quality', 'popular']
        };
    }

    /**
     * Generate random user data
     * @returns {Object} Random user object
     */
    randomUser() {
        const address = this.randomAddress();
        
        return {
            id: this.randomUUID(),
            firstName: this.randomFirstName(),
            lastName: this.randomLastName(),
            fullName: '', // Will be set below
            email: this.randomEmail(),
            phone: this.randomPhone(),
            username: this.randomAlphaNumeric(8).toLowerCase(),
            password: this.randomAlphaNumeric(12),
            dateOfBirth: this.randomDate(new Date(1950, 0, 1), new Date(2000, 0, 1)),
            address,
            isActive: this.randomInt(0, 1) === 1,
            registrationDate: this.randomDate(new Date(2020, 0, 1)),
            lastLogin: this.randomDate(new Date(2024, 0, 1))
        };
    }

    /**
     * Generate dataset with variations
     * @param {Function} generatorFn - Function to generate single item
     * @param {number} count - Number of items to generate
     * @param {Object} variations - Variation rules
     * @returns {Array} Generated dataset
     */
    static generateDataset(generatorFn, count = 10, variations = {}) {
        const {
            uniqueFields = [],
            dataRanges = {},
            customModifiers = []
        } = variations;

        const dataset = [];
        const uniqueValues = {};
        
        // Initialize unique value tracking
        uniqueFields.forEach(field => {
            uniqueValues[field] = new Set();
        });

        for (let i = 0; i < count; i++) {
            let item = generatorFn();
            
            // Apply custom modifiers
            customModifiers.forEach(modifier => {
                item = modifier(item, i, dataset);
            });
            
            // Ensure unique values for specified fields
            uniqueFields.forEach(field => {
                let attempts = 0;
                while (uniqueValues[field].has(item[field]) && attempts < 10) {
                    item = generatorFn();
                    attempts++;
                }
                uniqueValues[field].add(item[field]);
            });
            
            // Apply data range constraints
            Object.entries(dataRanges).forEach(([field, range]) => {
                if (field in item) {
                    const value = item[field];
                    if (typeof value === 'number' && (range.min || range.max)) {
                        if (range.min && value < range.min) {
                            item[field] = range.min;
                        }
                        if (range.max && value > range.max) {
                            item[field] = range.max;
                        }
                    }
                }
            });
            
            dataset.push(item);
        }
        
        return dataset;
    }
}

module.exports = DataGenerator;
