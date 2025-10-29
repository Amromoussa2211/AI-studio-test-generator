#!/usr/bin/env node

/**
 * AI Test Generator CLI
 * Interactive command-line interface for generating tests from user stories
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class AITestGeneratorCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.clear();
    this.printHeader();
    await this.collectUserStory();
  }

  printHeader() {
    console.log(`${colors.cyan}${colors.bright}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        🤖 AI Test Generator - User Story to Test          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}\n`);
  }

  async collectUserStory() {
    console.log(`${colors.green}Enter your user story below.${colors.reset}`);
    console.log(`${colors.yellow}You can use the format:${colors.reset}`);
    console.log(`  ${colors.cyan}As a [user type]${colors.reset}`);
    console.log(`  ${colors.cyan}I want to [action]${colors.reset}`);
    console.log(`  ${colors.cyan}So that [benefit]${colors.reset}\n`);
    
    console.log(`${colors.yellow}Or describe your test scenario in plain text.${colors.reset}`);
    console.log(`${colors.magenta}Type 'DONE' on a new line when finished, or press Ctrl+C to cancel.${colors.reset}\n`);
    console.log(`${colors.bright}Your user story:${colors.reset}`);

    let userStoryLines = [];
    
    const processLine = (line) => {
      if (line.trim().toUpperCase() === 'DONE') {
        this.rl.close();
        const userStory = userStoryLines.join('\n');
        this.generateTests(userStory);
      } else {
        userStoryLines.push(line);
        this.rl.prompt();
      }
    };

    this.rl.on('line', processLine);
    this.rl.prompt();
  }

  generateTests(userStory) {
    if (!userStory.trim()) {
      console.log(`\n${colors.yellow}⚠ No user story provided. Exiting...${colors.reset}`);
      process.exit(0);
    }

    console.log(`\n${colors.green}✓ User story received!${colors.reset}\n`);
    console.log(`${colors.bright}Generating test code...${colors.reset}\n`);

    // Parse and generate tests
    const parsedStory = this.parseUserStory(userStory);
    const testCode = this.generatePlaywrightTest(userStory, parsedStory);
    
    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const testName = this.extractTestName(userStory);
    const fileName = `${testName}-${timestamp}.spec.ts`;
    const outputPath = path.join(process.cwd(), 'src', 'tests', 'generated', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, testCode);

    // Display results
    this.displayResults(userStory, parsedStory, outputPath, testCode);
  }

  parseUserStory(userStory) {
    const story = userStory.toLowerCase();
    
    // Detect test type
    let testType = 'web';
    if (story.includes('api') || story.includes('endpoint') || story.includes('post') || story.includes('get ')) {
      testType = 'api';
    } else if (story.includes('mobile') || story.includes('iphone') || story.includes('android')) {
      testType = 'mobile';
    }

    // Extract actions
    const actions = [];
    const actionKeywords = ['login', 'click', 'fill', 'submit', 'navigate', 'search', 'add', 'delete', 'update', 'create'];
    actionKeywords.forEach(keyword => {
      if (story.includes(keyword)) {
        actions.push(keyword);
      }
    });

    // Extract persona
    const personaMatch = userStory.match(/(?:As an?|As a?)\s+([^,\n]+)/i);
    const persona = personaMatch ? personaMatch[1].trim() : 'user';

    // Extract action/goal
    const actionMatch = userStory.match(/(?:I want to|I need to|should)\s+([^.\n]+)/i);
    const goal = actionMatch ? actionMatch[1].trim() : 'perform action';

    return {
      testType,
      actions,
      persona,
      goal,
      originalStory: userStory
    };
  }

  extractTestName(userStory) {
    // Create a safe filename from user story
    const firstLine = userStory.split('\n')[0];
    let name = firstLine
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    if (!name) {
      name = 'generated-test';
    }
    
    return name;
  }

  generatePlaywrightTest(userStory, parsedStory) {
    const { testType, actions, goal } = parsedStory;

    if (testType === 'api') {
      return this.generateAPITest(userStory, parsedStory);
    } else if (testType === 'mobile') {
      return this.generateMobileTest(userStory, parsedStory);
    } else {
      return this.generateWebTest(userStory, parsedStory);
    }
  }

  generateWebTest(userStory, parsedStory) {
    const { goal, actions } = parsedStory;
    const testName = goal.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 60);

    return `import { test, expect } from '@playwright/test';

/**
 * Generated from User Story:
 * ${userStory.split('\n').map(line => ` * ${line}`).join('\n')}
 */

test.describe('${testName}', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto('/');
  });

  test('should ${goal}', async ({ page }) => {
    // TODO: Implement test steps based on your user story
    
${actions.map((action, i) => `    // Step ${i + 1}: ${action}
    // TODO: Add ${action} logic here
`).join('\n')}
    
    // Assertions - verify expected outcomes
    // TODO: Add your assertions here
    // Example: await expect(page.locator('.success-message')).toBeVisible();
    
    console.log('✓ Test completed: ${testName}');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Negative test case - verify error handling
    // TODO: Test error scenarios
    
    console.log('✓ Error handling test completed');
  });
});
`;
  }

  generateAPITest(userStory, parsedStory) {
    const { goal } = parsedStory;
    const testName = goal.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 60);

    return `import { test, expect } from '@playwright/test';

/**
 * Generated from User Story:
 * ${userStory.split('\n').map(line => ` * ${line}`).join('\n')}
 */

test.describe('API: ${testName}', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com', // TODO: Update with your API base URL
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // TODO: Add if needed
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('should ${goal}', async () => {
    // TODO: Implement API test based on your user story
    
    // Example: GET request
    const response = await apiContext.get('/posts/1');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // TODO: Add your API assertions here
    // Example: expect(data).toHaveProperty('id');
    
    console.log('✓ API test completed: ${testName}');
  });

  test('should handle API errors', async () => {
    // Negative test - verify error handling
    const response = await apiContext.get('/invalid-endpoint');
    expect(response.status()).toBeGreaterThanOrEqual(400);
    
    console.log('✓ API error handling test completed');
  });
});
`;
  }

  generateMobileTest(userStory, parsedStory) {
    const { goal, actions } = parsedStory;
    const testName = goal.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 60);

    return `import { test, expect, devices } from '@playwright/test';

/**
 * Generated from User Story:
 * ${userStory.split('\n').map(line => ` * ${line}`).join('\n')}
 */

test.describe('Mobile: ${testName}', () => {
  test('should ${goal} on iPhone', async ({ browser }) => {
    // Create mobile context
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      viewport: { width: 375, height: 812 }
    });

    const page = await context.newPage();
    
    // Navigate to application
    await page.goto('/');
    
${actions.map((action, i) => `    // Step ${i + 1}: ${action}
    // TODO: Add mobile ${action} logic here
    // Use page.tap() for touch interactions
`).join('\n')}
    
    // Assertions - verify expected outcomes
    // TODO: Add your mobile-specific assertions
    
    await context.close();
    console.log('✓ Mobile test completed: ${testName}');
  });

  test('should work on Android device', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5'],
    });

    const page = await context.newPage();
    await page.goto('/');
    
    // TODO: Implement Android-specific test logic
    
    await context.close();
    console.log('✓ Android test completed');
  });
});
`;
  }

  displayResults(userStory, parsedStory, outputPath, testCode) {
    console.log(`${colors.green}${colors.bright}✓ Test Generated Successfully!${colors.reset}\n`);
    
    console.log(`${colors.cyan}📊 Analysis:${colors.reset}`);
    console.log(`  Test Type: ${colors.yellow}${parsedStory.testType}${colors.reset}`);
    console.log(`  Actions Detected: ${colors.yellow}${parsedStory.actions.join(', ') || 'none'}${colors.reset}`);
    console.log(`  Persona: ${colors.yellow}${parsedStory.persona}${colors.reset}\n`);
    
    console.log(`${colors.cyan}📁 Output File:${colors.reset}`);
    console.log(`  ${colors.yellow}${outputPath}${colors.reset}\n`);
    
    console.log(`${colors.cyan}📝 Generated Test Code Preview:${colors.reset}`);
    console.log(`${colors.bright}${'─'.repeat(60)}${colors.reset}`);
    console.log(testCode.split('\n').slice(0, 15).join('\n'));
    console.log(`${colors.bright}... (see full code in file)${colors.reset}`);
    console.log(`${colors.bright}${'─'.repeat(60)}${colors.reset}\n`);
    
    console.log(`${colors.green}🚀 Next Steps:${colors.reset}`);
    console.log(`  1. Review the generated test: ${colors.cyan}${path.relative(process.cwd(), outputPath)}${colors.reset}`);
    console.log(`  2. Fill in TODO sections with actual test logic`);
    console.log(`  3. Run the test: ${colors.cyan}npm test ${path.relative(process.cwd(), outputPath)}${colors.reset}\n`);
    
    console.log(`${colors.magenta}${colors.bright}Happy Testing! 🎉${colors.reset}\n`);
  }
}

// Run CLI
const cli = new AITestGeneratorCLI();
cli.start().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
