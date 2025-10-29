# Quick Start Guide

> **Write your first automated test in 5 minutes**

This guide will walk you through creating and running your first test, step by step. No prior testing experience required!

## 🎯 What You'll Build

By the end of this guide, you'll have:
- ✅ A working test that visits a website
- ✅ Your test verifying page content
- ✅ Confidence to write more tests
- ✅ Understanding of the testing workflow

## 🚀 Choose Your Starting Point

| Your Goal | Start Here |
|-----------|------------|
| **Test a website** | [Web Testing Path](#🌐-web-testing-path) |
| **Test an API** | [API Testing Path](#📡-api-testing-path) |
| **Test a mobile app** | [Mobile Testing Path](#📱-mobile-testing-path) |
| **I'm not sure** | [Web Testing Path](#🌐-web-testing-path) (easiest to start) |

---

## 🌐 Web Testing Path

### Step 1: Create Your First Test

Create a new file called `my_first_test.py`:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Setup - This runs before each test
def setup():
    # Install and setup Chrome driver automatically
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    return driver

# The actual test
def test_visit_example_website():
    # Start browser
    driver = setup()
    
    try:
        # Step 1: Visit a website
        print("🌐 Opening example.com...")
        driver.get("https://example.com")
        
        # Step 2: Find page title
        print("🔍 Finding page title...")
        title = driver.find_element(By.TAG_NAME, "h1")
        
        # Step 3: Verify content
        print("✅ Verifying content...")
        assert "Example Domain" in title.text
        
        print("🎉 Test passed! Website loaded correctly.")
        
    finally:
        # Cleanup - Always close browser
        driver.quit()
        print("🔚 Browser closed.")

# Run the test
if __name__ == "__main__":
    test_visit_example_website()
```

### Step 2: Run Your Test

```bash
python my_first_test.py
```

**Expected Output:**
```
🌐 Opening example.com...
🔍 Finding page title...
✅ Verifying content...
🎉 Test passed! Website loaded correctly.
🔚 Browser closed.
```

### Step 3: Modify and Experiment

Try these modifications:

**Change the website:**
```python
# Replace example.com with any website
driver.get("https://google.com")
title = driver.find_element(By.TAG_NAME, "title")
print(f"Page: {title.text}")
```

**Add more verifications:**
```python
# Check if page has links
links = driver.find_elements(By.TAG_NAME, "a")
print(f"Found {len(links)} links on the page")

# Check if image exists
images = driver.find_elements(By.TAG_NAME, "img")
print(f"Found {len(images)} images on the page")
```

**Test form interaction:**
```python
def test_google_search():
    driver = setup()
    
    try:
        # Go to Google
        driver.get("https://google.com")
        
        # Find search box
        search_box = driver.find_element(By.NAME, "q")
        
        # Type in search box
        search_box.send_keys("automated testing")
        
        # Press Enter
        search_box.submit()
        
        # Wait for results
        driver.implicitly_wait(3)
        
        # Check that we got results
        results = driver.find_elements(By.CSS_SELECTOR, "h3")
        assert len(results) > 0
        
        print("🎉 Search test passed!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_google_search()
```

---

## 📡 API Testing Path

### Step 1: Create Your First API Test

Create a new file called `my_first_api_test.py`:

```python
import requests
import json

def test_api_connection():
    print("📡 Testing API connection...")
    
    # Step 1: Make GET request to a test API
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    
    # Step 2: Check response status
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200
    
    # Step 3: Parse JSON response
    data = response.json()
    print(f"Received data: {json.dumps(data, indent=2)}")
    
    # Step 4: Verify data structure
    assert "title" in data
    assert "body" in data
    assert "userId" in data
    
    print("🎉 API test passed!")

def test_api_create_data():
    print("📤 Testing API data creation...")
    
    # Step 1: Prepare test data
    new_post = {
        "title": "Test Post",
        "body": "This is a test post",
        "userId": 1
    }
    
    # Step 2: POST data to API
    response = requests.post(
        "https://jsonplaceholder.typicode.com/posts", 
        json=new_post
    )
    
    # Step 3: Verify response
    print(f"Status code: {response.status_code}")
    assert response.status_code == 201
    
    # Step 4: Check returned data
    created_post = response.json()
    assert created_post["title"] == "Test Post"
    assert "id" in created_post
    
    print("🎉 Data creation test passed!")
    print(f"Created post with ID: {created_post['id']}")

# Run the tests
if __name__ == "__main__":
    test_api_connection()
    test_api_create_data()
```

### Step 2: Run Your API Test

```bash
python my_first_api_test.py
```

**Expected Output:**
```
📡 Testing API connection...
Status code: 200
Received data: {
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
🎉 API test passed!
📤 Testing API data creation...
Status code: 201
🎉 Data creation test passed!
Created post with ID: 101
```

### Step 3: Test Your Own API

Replace the test URL with your own API:

```python
def test_my_api():
    # Replace with your API endpoint
    base_url = "https://api.yourcompany.com"
    
    # Test GET request
    response = requests.get(f"{base_url}/users")
    assert response.status_code == 200
    
    # Test POST request with your data
    user_data = {
        "name": "John Doe",
        "email": "john@example.com"
    }
    
    response = requests.post(f"{base_url}/users", json=user_data)
    assert response.status_code in [200, 201]
    
    print("🎉 Your API test passed!")
```

---

## 📱 Mobile Testing Path

### Step 1: Start Appium Server

**Option A: Command Line**
```bash
# Start Appium server
appium --address 127.0.0.1 --port 4723
```

**Option B: Appium Desktop**
1. Open Appium Desktop
2. Click "Start Server"
3. Server should start on `http://localhost:4723`

### Step 2: Create Your First Mobile Test

Create a new file called `my_first_mobile_test.py`:

```python
from appium import webdriver
from appium.options.android import UiAutomator2Options

def test_mobile_connection():
    print("📱 Testing mobile connection...")
    
    # Setup Android options
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"  # or your device name
    
    try:
        # Connect to Appium server
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Verify connection
        print(f"Connected to: {driver.platform_name}")
        print(f"Session ID: {driver.session_id}")
        
        print("🎉 Mobile test passed!")
        
    except Exception as e:
        print(f"❌ Mobile connection failed: {e}")
        print("💡 Make sure:")
        print("   1. Appium server is running")
        print("   2. Android emulator is started (or device is connected)")
        print("   3. USB debugging is enabled (for real devices)")
        
    finally:
        try:
            driver.quit()
        except:
            pass

# Test with a real app (if you have one)
def test_app_interaction():
    print("🔍 Testing app interaction...")
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.app = "/path/to/your/app.apk"  # Replace with your app path
    options.app_package = "com.yourcompany.yourapp"
    options.app_activity = "com.yourcompany.yourapp.MainActivity"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Wait for app to load
        driver.implicitly_wait(10)
        
        # Find and interact with elements
        # Example: Find login button and tap it
        login_button = driver.find_element("id", "login_button")
        login_button.click()
        
        print("🎉 App interaction test passed!")
        
    except Exception as e:
        print(f"❌ App test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass

if __name__ == "__main__":
    test_mobile_connection()
    # test_app_interaction()  # Uncomment when you have an app to test
```

### Step 3: Run Your Mobile Test

```bash
python my_first_mobile_test.py
```

**Expected Output (with device/emulator connected):**
```
📱 Testing mobile connection...
Connected to: Android
Session ID: abc123-def456-ghi789
🎉 Mobile test passed!
```

**If no device is connected:**
```
📱 Testing mobile connection...
❌ Mobile connection failed: Connection refused
💡 Make sure:
   1. Appium server is running
   2. Android emulator is started (or device is connected)
   3. USB debugging is enabled (for real devices)
```

---

## 📝 Test Organization Best Practices

### Create a Test File Structure

```
my_test_project/
├── tests/
│   ├── web/
│   │   ├── test_login.py
│   │   ├── test_navigation.py
│   │   └── test_forms.py
│   ├── api/
│   │   ├── test_users.py
│   │   └── test_auth.py
│   └── mobile/
│       ├── test_app_install.py
│       └── test_user_interaction.py
├── utils/
│   ├── setup.py
│   └── helpers.py
└── requirements.txt
```

### Reusable Test Setup

Create `utils/setup.py`:

```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import requests

class TestSetup:
    @staticmethod
    def get_web_driver():
        """Get a Chrome web driver for testing"""
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service)
        driver.maximize_window()
        return driver
    
    @staticmethod
    def get_api_session():
        """Get a requests session for API testing"""
        session = requests.Session()
        session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Test Automation Script'
        })
        return session
    
    @staticmethod
    def close_driver(driver):
        """Clean up web driver"""
        if driver:
            driver.quit()

# Use it in your tests
def test_example():
    driver = TestSetup.get_web_driver()
    
    try:
        driver.get("https://example.com")
        # Your test code here
        assert "Example Domain" in driver.title
        
    finally:
        TestSetup.close_driver(driver)
```

---

## 🏆 Challenge: Create Your Own Test

Now that you've seen the basics, create your own test:

### Web Testing Challenge
```python
def test_your_website():
    driver = TestSetup.get_web_driver()
    
    try:
        # Visit your favorite website
        driver.get("https://your-favorite-site.com")
        
        # Find something interesting
        element = driver.find_element(By.TAG_NAME, "h1")
        
        # Verify it's there
        assert element.is_displayed()
        
        print(f"✅ Found: {element.text}")
        
    finally:
        TestSetup.close_driver(driver)
```

### API Testing Challenge
```python
def test_your_api():
    session = TestSetup.get_api_session()
    
    # Test your API endpoint
    response = session.get("https://your-api.com/endpoint")
    
    assert response.status_code == 200
    
    data = response.json()
    print(f"✅ API returned: {data}")
```

---

## 🎯 What's Next?

After completing this quick start:

1. **Explore Examples:**
   - [Web Testing Examples](docs/examples/web/)
   - [API Testing Examples](docs/examples/api/)
   - [Mobile Testing Examples](docs/examples/mobile/)

2. **Learn More:**
   - [Test Types Overview](docs/test-types.md)
   - [Best Practices](docs/best-practices/)
   - [Troubleshooting Guide](docs/troubleshooting/)

3. **Build Real Tests:**
   - Test your actual websites
   - Test your APIs
   - Test your mobile apps

---

## ✅ Success Checklist

After this guide, you should have:

- [ ] Written and run your first web test
- [ ] Written and run your first API test
- [ ] Understood the testing workflow
- [ ] Created reusable test setup
- [ ] Ready to explore more examples

## 🆘 Common Issues & Quick Fixes

### Issue: Browser doesn't open
```python
# Make sure you have Chrome installed
# Update ChromeDriver
from webdriver_manager.chrome import ChromeDriverManager
service = Service(ChromeDriverManager().install())
```

### Issue: API test fails
```python
# Check internet connection
# Verify API endpoint is correct
# Add error handling
try:
    response = requests.get(url)
    response.raise_for_status()  # This will raise an exception for HTTP errors
except requests.RequestException as e:
    print(f"API request failed: {e}")
```

### Issue: Mobile test can't connect
```bash
# Start Appium server first
appium --address 127.0.0.1 --port 4723

# Or check if emulator/device is running
adb devices  # For Android
```

---

**Congratulations!** 🎉

You've written your first automated tests and learned the core concepts. You're now ready to explore more advanced testing scenarios!

**Continue with:**
- [Web Testing Examples](docs/examples/web/) for more web tests
- [API Testing Examples](docs/examples/api/) for more API tests
- [Test Types](docs/test-types.md) to understand all capabilities