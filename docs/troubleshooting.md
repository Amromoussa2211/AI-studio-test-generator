# Troubleshooting Guide

> **Fix common issues quickly**

This guide helps you solve the most common problems you might encounter when using this testing framework.

## 📋 Quick Diagnosis

| Symptom | Quick Fix |
|---------|-----------|
| **Import Error** | `pip install --upgrade <package>` |
| **WebDriver not found** | Use `webdriver_manager` |
| **Browser won't open** | Check Chrome/Firefox installation |
| **API test fails** | Check internet connection and URL |
| **Mobile test won't connect** | Start Appium server first |
| **Element not found** | Add explicit waits |
| **Test is slow** | Use headless mode for CI/CD |

## 🌐 Web Testing Issues

### Issue: Import Error for Selenium

**Error:**
```
ModuleNotFoundError: No module named 'selenium'
```

**Solution:**
```bash
# Install Selenium
pip install selenium

# Or install all dependencies
pip install -r requirements.txt

# If using virtual environment, activate it first
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

### Issue: WebDriver Executable Not Found

**Error:**
```
selenium.common.exceptions.WebDriverException: Message: 'chromedriver' executable needs to be in PATH
```

**Solution:**
```python
# Use WebDriver Manager (Recommended)
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# Or install ChromeDriver manually
# Download from: https://chromedriver.chromium.org/
# Add to PATH or specify full path
```

**Alternative - Firefox:**
```python
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.service import Service

service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service)
```

### Issue: Browser Won't Open

**Error:**
- Browser doesn't start
- "ChromeDriver crashed" message

**Solution:**
```python
# Check Chrome installation
import subprocess
result = subprocess.run(['google-chrome', '--version'], capture_output=True)
print(result.stdout)

# Update ChromeDriver
from webdriver_manager.core.utils import ChromeType
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType

# Clean and reinstall
from webdriver_manager.chrome import ChromeDriverManager
ChromeDriverManager().clear()
```

**For Headless Testing (CI/CD):**
```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)
```

### Issue: Element Not Found

**Error:**
```
selenium.common.exceptions.NoSuchElementException: Message: no such element
```

**Solution 1: Use Explicit Waits**
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Wait for element to be present
wait = WebDriverWait(driver, 10)
element = wait.until(EC.presence_of_element_located((By.ID, "element-id")))

# Wait for element to be clickable
element = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "class-name")))
```

**Solution 2: Check Element Selectors**
```python
# Multiple ways to find the same element
# ID (most reliable)
driver.find_element(By.ID, "unique-id")

# CSS Selector
driver.find_element(By.CSS_SELECTOR, ".class-name")

# XPath
driver.find_element(By.XPATH, "//div[@class='class-name']")

# Class name
driver.find_element(By.CLASS_NAME, "class-name")

# Tag name
driver.find_element(By.TAG_NAME, "tag-name")

# Link text
driver.find_element(By.LINK_TEXT, "Click here")
```

**Solution 3: Handle Dynamic Content**
```python
# Wait for page to load completely
driver.implicitly_wait(10)  # Wait for up to 10 seconds

# Wait for specific condition
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Wait for AJAX to complete
WebDriverWait(driver, 10).until(
    lambda driver: driver.execute_script("return jQuery.active") == 0
)

# Wait for new content to appear
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "new-content"))
)
```

### Issue: Test Timeout

**Error:**
```
selenium.common.exceptions.TimeoutException
```

**Solution:**
```python
# Increase timeout
driver.set_page_load_timeout(30)  # 30 seconds
driver.implicitly_wait(15)  # 15 seconds for element searches

# Or handle timeout gracefully
from selenium.common.exceptions import TimeoutException

try:
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "element-id"))
    )
except TimeoutException:
    print("Element not found within timeout")
    # Handle the timeout case
```

### Issue: Browser Closed Unexpectedly

**Error:**
- Browser closes during test
- "Browser disconnected" message

**Solution:**
```python
# Use try-finally to ensure cleanup
def test_example():
    driver = webdriver.Chrome()
    
    try:
        # Your test code here
        driver.get("https://example.com")
        # ...
        
    except Exception as e:
        print(f"Test failed: {e}")
        # Take screenshot for debugging
        driver.save_screenshot("error.png")
        
    finally:
        # Always close browser
        driver.quit()

# Alternative: Use context manager (if available)
from contextlib import contextmanager

@contextmanager
def get_driver():
    driver = webdriver.Chrome()
    try:
        yield driver
    finally:
        driver.quit()

# Use it
with get_driver() as driver:
    driver.get("https://example.com")
    # Test code here
```

## 📡 API Testing Issues

### Issue: Connection Error

**Error:**
```
requests.exceptions.ConnectionError
```

**Solution:**
```python
# Check internet connection
import requests

try:
    response = requests.get("https://google.com", timeout=5)
    print("Internet connection OK")
except requests.exceptions.ConnectionError:
    print("No internet connection")

# Check specific API endpoint
try:
    response = requests.get("https://your-api.com/health")
    print(f"API status: {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"API connection error: {e}")
```

### Issue: SSL Certificate Error

**Error:**
```
requests.exceptions.SSLError
```

**Solution:**
```python
# Option 1: Disable SSL verification (not recommended for production)
response = requests.get(url, verify=False)

# Option 2: Provide CA bundle
response = requests.get(url, verify="/path/to/ca-bundle.crt")

# Option 3: Use custom session
session = requests.Session()
session.verify = False
response = session.get(url)
```

### Issue: Timeout Error

**Error:**
```
requests.exceptions.Timeout
```

**Solution:**
```python
# Increase timeout
response = requests.get(url, timeout=30)  # 30 seconds

# Or handle timeout
from requests.exceptions import Timeout

try:
    response = requests.get(url, timeout=5)
except Timeout:
    print("Request timed out")
    # Handle timeout case
```

### Issue: HTTP Error

**Error:**
```
requests.exceptions.HTTPError: 404 Client Error
```

**Solution:**
```python
# Check status code before accessing response
response = requests.get(url)

# Good practice
if response.status_code == 200:
    data = response.json()
elif response.status_code == 404:
    print("Resource not found")
else:
    print(f"HTTP error: {response.status_code}")

# Raise for status
response.raise_for_status()  # Raises HTTPError for bad status codes

# Handle specific errors
try:
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    if response.status_code == 404:
        print("Resource not found")
    elif response.status_code == 401:
        print("Unauthorized")
    elif response.status_code == 500:
        print("Server error")
```

### Issue: JSON Decode Error

**Error:**
```
requests.exceptions.JSONDecodeError
```

**Solution:**
```python
# Check content type first
response = requests.get(url)

if response.headers.get("content-type", "").startswith("application/json"):
    try:
        data = response.json()
    except requests.exceptions.JSONDecodeError:
        print("Response is not valid JSON")
        print(f"Response content: {response.text}")
else:
    print(f"Response is not JSON: {response.headers.get('content-type')}")
    print(f"Response text: {response.text}")

# Safe JSON parsing
import json

def safe_json_parse(response):
    try:
        return response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Failed to parse JSON. Response: {response.text}")
        return None
```

## 📱 Mobile Testing Issues

### Issue: Appium Server Not Running

**Error:**
```
ConnectionRefusedError: [WinError 10061] No connection could be made
```

**Solution:**
```bash
# Start Appium server
appium --address 127.0.0.1 --port 4723

# Or with logging
appium --address 127.0.0.1 --port 4723 --log-level info

# Verify server is running
curl http://localhost:4723/status

# Expected response:
{
  "value": {
    "ready": true,
    "message": "The server is ready to accept new connections"
  }
}
```

### Issue: Device Not Found

**Error:**
```
selenium.common.exceptions.SessionNotCreatedException: A new session could not be created
```

**Solution:**
```bash
# Check Android devices
adb devices

# Should show something like:
# List of devices attached
# emulator-5554   device

# Check iOS devices
instruments -s devices  # macOS only

# Restart ADB if needed
adb kill-server
adb start-server
adb devices
```

### Issue: App Path Not Found

**Error:**
```
selenium.common.exceptions.SessionNotCreatedException: App not installed
```

**Solution:**
```python
# Use absolute path
import os

# Get absolute path
app_path = os.path.abspath("path/to/your/app.apk")
print(f"App path: {app_path}")

# Verify file exists
if os.path.exists(app_path):
    print("App file exists")
else:
    print(f"App file not found at: {app_path}")

# Set in capabilities
options.app = app_path

# Check file permissions
print(f"File readable: {os.access(app_path, os.R_OK)}")
```

### Issue: Element Not Found in Mobile App

**Error:**
```
selenium.common.exceptions.NoSuchElementException
```

**Solution:**
```python
# Use multiple selector strategies
from appium.webdriver.common.appiumby import AppiumBy

# Try different selectors
selectors = [
    (AppiumBy.ID, "element_id"),
    (AppiumBy.CLASS_NAME, "class_name"),
    (AppiumBy.XPATH, "//android.widget.TextView[@text='Element Text']"),
    (AppiumBy.ACCESSIBILITY_ID, "accessibility_id"),
    (AppiumBy.XPATH, "//*[contains(@text, 'Element Text')]")
]

for strategy, value in selectors:
    try:
        element = driver.find_element(strategy, value)
        print(f"Found element using: {strategy} = {value}")
        break
    except:
        continue

# Use explicit wait
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_element_located((AppiumBy.ID, "element_id"))
)
```

### Issue: Gesture Not Working

**Error:**
```
- Swipe doesn't work
- Tap coordinates not accurate
```

**Solution:**
```python
# Check device screen size
screen_size = driver.get_window_size()
print(f"Screen size: {screen_size}")

# Calculate coordinates as percentages
width = screen_size['width']
height = screen_size['height']

# Tap at center of screen
center_x = width // 2
center_y = height // 2
driver.tap([(center_x, center_y)])

# Swipe from 80% to 20% of screen height
start_x = width // 2
start_y = int(height * 0.8)
end_y = int(height * 0.2)
driver.swipe(start_x, start_y, start_x, end_y, 1000)

# Use touch action for complex gestures
from appium.webdriver.common.touch_action import TouchAction

action = TouchAction(driver)
action.tap(element).perform()
```

## 🔧 General Testing Issues

### Issue: Test Too Slow

**Problem:**
- Tests take too long to run
- CI/CD pipeline timeout

**Solution:**

**For Web Testing:**
```python
# Use headless mode
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

# Disable images for faster loading
options.add_experimental_option("prefs", {
    "profile.managed_default_content_settings.images": 2
})

# Reduce wait times (use with caution)
driver.implicitly_wait(5)  # Instead of default 10
```

**For API Testing:**
```python
# Use connection pooling
import requests

session = requests.Session()
adapter = requests.adapters.HTTPAdapter(
    pool_connections=10,
    pool_maxsize=20,
    pool_block=True
)
session.mount('http://', adapter)
session.mount('https://', adapter)

# Use the session for multiple requests
response1 = session.get(url1)
response2 = session.get(url2)
```

**For Mobile Testing:**
```python
# Use no reset for faster startup
options = UiAutomator2Options()
options.no_reset = True  # Don't reset app state
options.full_reset = False  # Don't reinstall app

# Reduce command timeout
options.new_command_timeout = 60  # 1 minute instead of default 60
```

### Issue: Flaky Tests

**Problem:**
- Test passes sometimes, fails other times
- Inconsistent results

**Solution:**

**Add Proper Waits:**
```python
# Always use explicit waits
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(EC.element_to_be_clickable((By.ID, "element")))

# Wait for page load
wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
```

**Handle Dynamic Content:**
```python
# Wait for loading indicators to disappear
wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "loading")))

# Wait for new content to appear
wait.until(EC.presence_of_element_located((By.CLASS_NAME, "new-content")))
```

**Retry Mechanism:**
```python
import time
from functools import wraps

def retry_on_failure(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    print(f"Attempt {attempt + 1} failed: {e}")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry_on_failure(max_attempts=3, delay=2)
def test_flaky_element():
    # Your test code
    driver.find_element(By.ID, "flaky-element").click()
```

### Issue: Memory Issues

**Problem:**
- Out of memory errors
- Browser crashes
- Slow performance

**Solution:**

**Browser Cleanup:**
```python
# Always quit browser
driver.quit()

# Clear browser data
driver.delete_all_cookies()

# Clear local storage
driver.execute_script("localStorage.clear();")
driver.execute_script("sessionStorage.clear();")

# Use try-finally
try:
    # Test code
    pass
finally:
    driver.quit()
```

**Limit Resources:**
```python
# Disable unnecessary features
options = Options()
options.add_argument("--disable-extensions")
options.add_argument("--disable-plugins")
options.add_argument("--disable-images")  # For faster loading
options.add_argument("--disable-javascript")  # If not needed
```

### Issue: Environment-Specific Issues

**Problem:**
- Tests work in dev but fail in prod
- Different behavior on different machines

**Solution:**

**Environment Configuration:**
```python
import os

class Config:
    BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
    BROWSER = os.getenv("BROWSER", "chrome")
    HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"
    TIMEOUT = int(os.getenv("TIMEOUT", "10"))

# Use configuration
if Config.HEADLESS:
    options.add_argument("--headless")
```

**Environment Detection:**
```python
import platform

def get_browser_options():
    system = platform.system()
    
    if system == "Windows":
        # Windows-specific options
        return some_windows_options
    elif system == "Darwin":  # macOS
        # macOS-specific options
        return some_mac_options
    else:  # Linux
        # Linux-specific options
        return some_linux_options
```

## 🆘 Getting Help

### Debug Information to Collect

When asking for help, include:

1. **Python Version:**
```bash
python --version
```

2. **Installed Packages:**
```bash
pip list
```

3. **Error Traceback:**
```python
import traceback

try:
    # Your test code
    pass
except Exception as e:
    print("Full traceback:")
    traceback.print_exc()
```

4. **Browser/OS Information:**
```python
from selenium import webdriver

# Get browser info
driver = webdriver.Chrome()
print(f"Browser version: {driver.capabilities['browserVersion']}")
print(f"Platform: {driver.capabilities['platformName']}")
driver.quit()
```

### Self-Help Checklist

Before asking for help:

- [ ] Restart your computer
- [ ] Update all packages: `pip install --upgrade <package>`
- [ ] Clear cache: `pip cache purge`
- [ ] Recreate virtual environment
- [ ] Check internet connection
- [ ] Try the simplest possible test case
- [ ] Check the documentation for your version
- [ ] Search for similar issues online

### Community Resources

- [Selenium Documentation](https://selenium-python.readthedocs.io/)
- [Requests Documentation](https://docs.python-requests.org/)
- [Appium Documentation](http://appium.io/docs/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/selenium)
- [GitHub Issues](https://github.com/SeleniumHQ/selenium/issues)

---

## 📚 Common Code Patterns

### Robust Web Test Template
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

def robust_web_test():
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    # Add options as needed
    
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        driver.implicitly_wait(10)
        
        # Use explicit waits
        wait = WebDriverWait(driver, 10)
        
        # Your test code here
        driver.get("https://example.com")
        element = wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
        
        # Take screenshot on success
        driver.save_screenshot("success.png")
        
    except Exception as e:
        # Take screenshot on failure
        driver.save_screenshot("error.png")
        print(f"Test failed: {e}")
        raise
        
    finally:
        driver.quit()
```

### Robust API Test Template
```python
import requests
from requests.exceptions import RequestException, Timeout

def robust_api_test():
    session = requests.Session()
    session.headers.update({"User-Agent": "Test-Client/1.0"})
    
    try:
        response = session.get("https://api.example.com/endpoint", timeout=10)
        response.raise_for_status()
        
        if response.headers.get("content-type", "").startswith("application/json"):
            data = response.json()
            return data
        else:
            raise ValueError("Response is not JSON")
            
    except Timeout:
        print("Request timed out")
        raise
    except RequestException as e:
        print(f"Request failed: {e}")
        raise
```

### Robust Mobile Test Template
```python
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def robust_mobile_test():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    options.new_command_timeout = 300
    
    driver = None
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        wait = WebDriverWait(driver, 10)
        
        # Your test code here
        # Use robust element finding
        element = wait.until(
            EC.presence_of_element_located((AppiumBy.ID, "element_id"))
        )
        
    except Exception as e:
        print(f"Mobile test failed: {e}")
        raise
        
    finally:
        if driver:
            driver.quit()
```

---

**Remember:** Most issues can be resolved by adding proper waits, handling exceptions, and ensuring proper cleanup!