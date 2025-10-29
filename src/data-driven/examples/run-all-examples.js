/**
 * Run All Data-Driven Testing Examples
 * Simple script to demonstrate all framework features
 */
const DataDrivenFrameworkDemo = require('./demo');
const { WebExamples } = require('./index');
const { MobileExamples } = require('./index');
const { ApiExamples } = require('./index');

class ExamplesRunner {
    constructor() {
        this.results = [];
    }

    async runBasicDemo() {
        console.log('\n🎯 Running Basic Framework Demo...\n');
        const demo = new DataDrivenFrameworkDemo();
        const result = await demo.runCompleteDemo();
        this.results.push({ name: 'Basic Demo', result });
        return result;
    }

    async runWebExamples() {
        console.log('\n🌐 Running Web Testing Examples...\n');
        const webExamples = new WebExamples();
        const results = await webExamples.runAllExamples();
        this.results.push({ name: 'Web Examples', results });
        return results;
    }

    async runMobileExamples() {
        console.log('\n📱 Running Mobile Testing Examples...\n');
        const mobileExamples = new MobileExamples();
        const results = await mobileExamples.runAllExamples();
        this.results.push({ name: 'Mobile Examples', results });
        return results;
    }

    async runApiExamples() {
        console.log('\n🔌 Running API Testing Examples...\n');
        const apiExamples = new ApiExamples();
        const results = await apiExamples.runAllExamples();
        this.results.push({ name: 'API Examples', results });
        return results;
    }

    async runAllExamples() {
        console.log('🚀'.repeat(70));
        console.log('🚀 Data-Driven Testing Framework - All Examples Runner 🚀');
        console.log('🚀'.repeat(70));

        const startTime = Date.now();

        try {
            // Run individual example sets
            await this.runBasicDemo();
            await this.runWebExamples();
            await this.runMobileExamples();
            await this.runApiExamples();

            // Print summary
            const totalTime = Date.now() - startTime;
            
            console.log('\n' + '='.repeat(70));
            console.log('📊 FINAL SUMMARY');
            console.log('='.repeat(70));
            
            this.results.forEach(({ name, result }) => {
                const success = result && (result.success !== false);
                const status = success ? '✅' : '❌';
                console.log(`${status} ${name}: ${success ? 'COMPLETED' : 'FAILED'}`);
            });

            console.log(`\n⏱️ Total Execution Time: ${(totalTime / 1000).toFixed(2)} seconds`);
            console.log('🎉 All examples completed!');
            console.log('='.repeat(70));

            return {
                success: true,
                results: this.results,
                executionTime: totalTime
            };

        } catch (error) {
            console.error('\n❌ Examples runner failed:', error.message);
            
            const totalTime = Date.now() - startTime;
            console.log(`⏱️ Time before failure: ${(totalTime / 1000).toFixed(2)} seconds`);

            return {
                success: false,
                error: error.message,
                executionTime: totalTime,
                results: this.results
            };
        }
    }
}

// Run if executed directly
if (require.main === module) {
    const runner = new ExamplesRunner();
    runner.runAllExamples()
        .then(result => {
            console.log('\n🎯 Examples runner finished:', result.success ? 'SUCCESS' : 'FAILURE');
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Examples runner crashed:', error);
            process.exit(1);
        });
}

module.exports = ExamplesRunner;
