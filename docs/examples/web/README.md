# Web Testing Examples

> **Ready-to-run web testing examples**

This directory contains simple, working examples of web testing using Selenium.

## 🎯 What's Included

- ✅ **Basic Tests** - Simple page loading and verification
- ✅ **Form Tests** - Form filling and submission
- ✅ **Login Tests** - User authentication flows
- ✅ **Navigation Tests** - Page navigation and links
- ✅ **E-commerce Tests** - Shopping cart and checkout

## 🚀 Quick Start

### Prerequisites
```bash
pip install selenium webdriver-manager
```

### Run All Examples
```bash
# Run all web examples
python examples/web/run_all_tests.py

# Run specific example
python examples/web/basic_page_test.py
```

## 📝 Example Files

### 1. Basic Page Tests (`basic_page_tests/`)

**File:** `basic_page_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_page_title():
    """Test that example.com has the expected title"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        driver.get("https://example.com")
        title = driver.find_element(By.TAG_NAME, "h1")
        
        assert "Example Domain" in title.text
        print("✅ Basic page test passed!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_page_title()
```

**File:** `element_finding_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def test_find_multiple_elements():
    """Test finding multiple elements on a page"""
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://example.com")
        
        # Find all links
        links = driver.find_elements(By.TAG_NAME, "a")
        print(f"Found {len(links)} links")
        
        # Find paragraphs
        paragraphs = driver.find_elements(By.TAG_NAME, "p")
        print(f"Found {len(paragraphs)} paragraphs")
        
        # Verify we found expected elements
        assert len(links) >= 1
        assert len(paragraphs) >= 1
        
        print("✅ Element finding test passed!")
        
    finally:
        driver.quit()
```

### 2. Form Tests (`form_tests/`)

**File:** `simple_form_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_form_submission():
    """Test filling and submitting a form"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Go to a page with a form (using a test page)
        driver.get("https://httpbin.org/forms/post")
        
        # Fill form fields
        driver.find_element(By.NAME, "custname").send_keys("John Doe")
        driver.find_element(By.NAME, "custtel").send_keys("1234567890")
        driver.find_element(By.NAME, "custemail").send_keys("john@example.com")
        driver.find_element(By.NAME, "size").send_keys("large")
        driver.find_element(By.NAME, "topping").send_keys("cheese")
        
        # Submit form
        driver.find_element(By.CSS_SELECTOR, "input[type='submit']").click()
        
        # Verify we got redirected
        assert "forms/post" not in driver.current_url
        
        print("✅ Form submission test passed!")
        
    finally:
        driver.quit()

def test_form_validation():
    """Test form validation (required fields)"""
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://httpbin.org/forms/post")
        
        # Try to submit without filling required fields
        driver.find_element(By.CSS_SELECTOR, "input[type='submit']").click()
        
        # Check if we're still on the form page (validation prevented submission)
        assert "forms/post" in driver.current_url
        
        print("✅ Form validation test passed!")
        
    finally:
        driver.quit()
```

### 3. Login Tests (`login_tests/`)

**File:** `simple_login_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_login_flow():
    """Test basic login flow (using a test website)"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Go to a test login page
        driver.get("https://the-internet.herokuapp.com/login")
        
        # Fill login form
        driver.find_element(By.ID, "username").send_keys("tomsmith")
        driver.find_element(By.ID, "password").send_keys("SuperSecretPassword!")
        
        # Click login button
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Verify successful login
        flash_message = driver.find_element(By.CLASS_NAME, "flash")
        assert "You logged into a secure area!" in flash_message.text
        
        # Verify we're on the secure area page
        assert "/secure" in driver.current_url
        
        print("✅ Login test passed!")
        
    finally:
        driver.quit()

def test_logout_flow():
    """Test logout functionality"""
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        # First login
        driver.get("https://the-internet.herokuapp.com/login")
        driver.find_element(By.ID, "username").send_keys("tomsmith")
        driver.find_element(By.ID, "password").send_keys("SuperSecretPassword!")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Now logout
        driver.find_element(By.CSS_SELECTOR, ".button.secondary").click()
        
        # Verify we're logged out
        flash_message = driver.find_element(By.CLASS_NAME, "flash")
        assert "You logged out" in flash_message.text
        
        # Verify we're back on login page
        assert "/login" in driver.current_url
        
        print("✅ Logout test passed!")
        
    finally:
        driver.quit()
```

### 4. Navigation Tests (`navigation_tests/`)

**File:** `page_navigation_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_menu_navigation():
    """Test main menu navigation"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Go to test site with navigation
        driver.get("https://the-internet.herokuapp.com/")
        
        # Navigate to different sections
        driver.find_element(By.LINK_TEXT, "Add/Remove Elements").click()
        assert "add_remove_elements" in driver.current_url
        
        driver.find_element(By.LINK_TEXT, "Dropdown").click()
        assert "dropdown" in driver.current_url
        
        driver.find_element(By.LINK_TEXT, "Dynamic Content").click()
        assert "dynamic_content" in driver.current_url
        
        # Go back to home
        driver.find_element(By.LINK_TEXT, "The Internet").click()
        assert driver.current_url.endswith("/")
        
        print("✅ Menu navigation test passed!")
        
    finally:
        driver.quit()

def test_browser_navigation():
    """Test browser back/forward navigation"""
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        # Visit page 1
        driver.get("https://example.com")
        assert driver.title == "Example Domain"
        
        # Visit page 2
        driver.get("https://httpbin.org/")
        assert "httpbin" in driver.current_url
        
        # Go back
        driver.back()
        assert driver.title == "Example Domain"
        
        # Go forward
        driver.forward()
        assert "httpbin" in driver.current_url
        
        print("✅ Browser navigation test passed!")
        
    finally:
        driver.quit()
```

### 5. Advanced Tests (`advanced_tests/`)

**File:** `screenshot_test.py`
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_screenshot_capture():
    """Test taking screenshots"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        driver.get("https://example.com")
        
        # Take full page screenshot
        driver.save_screenshot("full_page_screenshot.png")
        print("📸 Full page screenshot saved")
        
        # Take element screenshot
        heading = driver.find_element(By.TAG_NAME, "h1")
        heading.screenshot("heading_screenshot.png")
        print("📸 Element screenshot saved")
        
        print("✅ Screenshot test passed!")
        
    finally:
        driver.quit()

def test_javascript_execution():
    """Test executing JavaScript"""
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://example.com")
        
        # Execute JavaScript to get page title
        title = driver.execute_script("return document.title;")
        assert title == "Example Domain"
        
        # Execute JavaScript to click element
        driver.execute_script("document.querySelector('h1').click();")
        
        # Get page URL via JavaScript
        url = driver.execute_script("return window.location.href;")
        assert "example.com" in url
        
        print("✅ JavaScript execution test passed!")
        
    finally:
        driver.quit()
```

## 🎮 Try These Examples

### 1. Run a Single Test
```bash
python docs/examples/web/basic_page_tests/basic_page_test.py
```

### 2. Run All Tests
```bash
python docs/examples/web/run_all_tests.py
```

### 3. Modify and Experiment

Try these modifications:

**Change the website:**
```python
# In basic_page_test.py, change:
driver.get("https://google.com")  # Instead of example.com
title = driver.find_element(By.TAG_NAME, "title")
print(f"Page: {title.text}")
```

**Add your own elements:**
```python
# Find different elements
images = driver.find_elements(By.TAG_NAME, "img")
buttons = driver.find_elements(By.TAG_NAME, "button")
inputs = driver.find_elements(By.TAG_NAME, "input")

print(f"Found {len(images)} images")
print(f"Found {len(buttons)} buttons")
print(f"Found {len(inputs)} inputs")
```

## 🔧 Customization

### Test Different Websites

Replace the URLs in any example:

```python
# Test any website
driver.get("https://your-favorite-site.com")

# Find elements specific to that site
header = driver.find_element(By.TAG_NAME, "h1")
navigation = driver.find_element(By.CLASS_NAME, "nav")
```

### Add More Assertions

Add your own verification logic:

```python
# Verify page content
content = driver.find_element(By.TAG_NAME, "body").text
assert len(content) > 0
assert "expected text" in content

# Verify element properties
element = driver.find_element(By.ID, "my-element")
assert element.is_displayed()
assert element.is_enabled()
```

### Handle Different Browsers

```python
# Firefox
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager

driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))

# Edge
from selenium.webdriver.edge.service import Service
from webdriver_manager.microsoft import EdgeChromiumDriverManager

driver = webdriver.Edge(service=Service(EdgeChromiumDriverManager().install()))
```

## 🚨 Common Issues & Solutions

### Issue: WebDriver not found
```python
# Solution: Use WebDriver Manager
from webdriver_manager.chrome import ChromeDriverManager
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
```

### Issue: Element not found
```python
# Solution: Add explicit waits
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(EC.presence_of_element_located((By.ID, "my-element")))
```

### Issue: Page loads slowly
```python
# Solution: Add implicit waits
driver.implicitly_wait(10)  # Wait up to 10 seconds for elements
```

## 📚 Learn More

- [Selenium Documentation](https://selenium-python.readthedocs.io/)
- [Selenium WebDriver API](https://selenium-python.readthedocs.io/api.html)
- [Web Testing Best Practices](../best-practices/)

---

**Next Steps:**
- Try all the examples
- Modify them for your own websites
- Read the [Best Practices Guide](../best-practices/)
- Explore [API Testing Examples](../api/)