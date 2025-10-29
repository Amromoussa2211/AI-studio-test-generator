# 🎯 Quick Answer: Where to Put User Story

## Step 1: Run the Command
```bash
npm run ai-generate
```

## Step 2: You'll See This Interactive Interface

```
╔════════════════════════════════════════════════════════════╗
║        🤖 AI Test Generator - User Story to Test          ║
╚════════════════════════════════════════════════════════════╝

Enter your user story below.
You can use the format:
  As a [user type]
  I want to [action]
  So that [benefit]

Or describe your test scenario in plain text.
Type 'DONE' on a new line when finished, or press Ctrl+C to cancel.

Your user story:
▌ <-- Type here
```

## Step 3: Type Your User Story

**Example:**
```
npm run ai-generate

Your user story:
As a registered user
I want to log into the application  
So that I can access my dashboard

Steps:
1. Navigate to login page
2. Enter email: test@example.com
3. Enter password: Test@123
4. Click login button
5. Verify redirect to dashboard
DONE  <-- Type this when finished
```

## Step 4: Generator Creates Your Test!

After typing `DONE`, you'll see:

```
✓ User story received!

Generating test code...

✓ Test Generated Successfully!

📊 Analysis:
  Test Type: web
  Actions Detected: login, navigate, click
  Persona: registered user

📁 Output File:
  src/tests/generated/as-a-registered-user-2025-10-29.spec.ts

📝 Generated Test Code Preview:
────────────────────────────────────────────────────────────
import { test, expect } from '@playwright/test';

/**
 * Generated from User Story:
 * As a registered user
 * I want to log into the application
...

🚀 Next Steps:
  1. Review the generated test
  2. Fill in TODO sections with actual test logic
  3. Run the test: npm test src/tests/generated/...

Happy Testing! 🎉
```

---

## 💡 Quick Tips

### ✅ DO:
- Type multiple lines
- Be specific with steps
- Include sample data (emails, names, etc.)
- Type `DONE` when finished

### ❌ DON'T:
- Press Enter expecting immediate result (it waits for DONE)
- Close terminal before typing DONE
- Worry about perfect formatting (AI understands natural language)

---

## 🎬 Real Example Session

```bash
$ npm run ai-generate

Your user story:
Test login with wrong password

Steps:
- Go to /login
- Enter email: test@example.com
- Enter wrong password: wrongpass
- Click submit
- Should see error message "Invalid credentials"
DONE

✓ Test Generated Successfully!
📁 Output File: src/tests/generated/test-login-with-wrong-password-2025-10-29.spec.ts

Run it: npm test src/tests/generated/test-login-with-wrong-password-2025-10-29.spec.ts
```

---

## 📚 More Examples

See the complete guide with 4 detailed examples:
- [AI Generator Guide](AI-GENERATOR-GUIDE.md)

---

## 🆘 Common Issues

**Q: I typed my story but nothing happened?**  
A: Type `DONE` on a new line to finish.

**Q: Can I generate multiple tests?**  
A: Yes! Run `npm run ai-generate` multiple times.

**Q: Where are my generated tests?**  
A: Check `src/tests/generated/` folder.

**Q: Do I need to edit the generated code?**  
A: Yes, fill in TODO sections with your actual selectors and logic.

---

That's it! Just run `npm run ai-generate` and start typing! 🚀
