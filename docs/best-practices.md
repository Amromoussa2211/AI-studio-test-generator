# Best Practices

> **Write better, more reliable tests**

This guide covers best practices for writing maintainable, reliable, and efficient tests using this framework.

## 📋 Quick Reference

| Area | Key Principles |
|------|----------------|
| **Web Testing** | Use Page Object Model, explicit waits, proper selectors |
| **API Testing** | Validate responses, handle errors, use sessions |
| **Mobile Testing** | Robust element finding, gesture handling, device management |
| **Data-Driven** | Clean data management, parameterization, validation |
| **General** | Good structure, error handling, documentation |

---

## 🌐 Web Testing Best Practices

### 1. Use Page Object Model (POM)

**✅ Good: Organize tests using POM**

```python
# pages/login_page.py
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    # Locators as class constants
    USERNAME_FIELD = (By.ID, "username")
    PASSWORD_FIELD = (By.ID, "password")
    LOGIN_BUTTON = (By.ID, "login-button")
    ERROR_MESSAGE = (By.CLASS_NAME, "error-message")
    
    def login(self, username, password):
        """Perform login with given credentials"""
        self.type_username(username)
        self.type_password(password)
        self.click_login()
    
    def type_username(self, username):
        element = self.wait.until(EC.element_to_be_clickable(self.USERNAME_FIELD))
        element.clear()
        element.send_keys(username)
    
    def type_password(self, password):
        element = self.wait.until(EC.element_to_be_clickable(self.PASSWORD_FIELD))
        element.clear()
        element.send_keys(password)
    
    def click_login(self):
        self.wait.until(EC.element_to_be_clickable(self.LOGIN_BUTTON)).click()
    
    def get_error_message(self):
        return self.wait.until(EC.presence_of_element_located(self.ERROR_MESSAGE)).text
    
    def is_login_successful(self):
        """Check if login was successful"""
        try:
            # Wait for redirect to dashboard
            self.wait.until(EC.url_contains("dashboard"))
            return True
        except:
            return False

# tests/test_login.py
from pages.login_page import LoginPage

def test_valid_login(driver):
    login_page = LoginPage(driver)
    login_page.login("user@example.com", "password123")
    
    assert login_page.is_login_successful()

def test_invalid_login(driver):
    login_page = LoginPage(driver)
    login_page.login("wrong@example.com", "wrongpassword")
    
    error_msg = login_page.get_error_message()
    assert "Invalid credentials" in error_msg
```

**❌ Bad: Direct element access in tests**

```python
# Don't do this in your tests
def test_login(driver):
    driver.get("https://example.com/login")
    
    # Finding elements directly in test - hard to maintain
    driver.find_element(By.ID, "username").send_keys("user@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.ID, "login-button").click()
    
    assert "dashboard" in driver.current_url
```

### 2. Use Explicit Waits

**✅ Good: Explicit waits with conditions**

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_with_explicit_waits(driver):
    driver.get("https://example.com")
    
    # Wait for element to be present
    wait = WebDriverWait(driver, 10)
    
    # Wait for element to be clickable
    button = wait.until(
        EC.element_to_be_clickable((By.ID, "submit-button"))
    )
    button.click()
    
    # Wait for URL to change
    wait.until(EC.url_contains("success"))
    
    # Wait for text to appear
    success_message = wait.until(
        EC.presence_of_element_located((By.CLASS_NAME, "success"))
    )
    assert "Success" in success_message.text
```

**❌ Bad: Fixed sleeps and implicit waits**

```python
# Avoid fixed sleeps
import time

def test_with_sleeps(driver):
    driver.get("https://example.com")
    driver.find_element(By.ID, "submit-button").click()
    
    time.sleep(5)  # Don't do this - fragile and slow
    
    assert "success" in driver.current_url
```

### 3. Choose Robust Element Selectors

**Priority Order (Best to Worst):**
1. ID (most reliable)
2. Name attribute
3. Class name (if unique)
4. CSS selector (specific)
5. XPath (last resort)

**✅ Good: Prefer ID and Name**

```python
# Best - ID selector
login_button = driver.find_element(By.ID, "login-button")

# Good - Name attribute
username_field = driver.find_element(By.NAME, "username")

# Acceptable - CSS selector
user_avatar = driver.find_element(By.CSS_SELECTOR, ".user-avatar")

# Last resort - XPath (only if no other option)
# Dynamic content might need this
dynamic_element = driver.find_element(
    By.XPATH, 
    "//div[contains(@class, 'dynamic-content') and text()='Expected Text']"
)
```

**❌ Bad: Fragile selectors**

```python
# Avoid - too generic, might match multiple elements
submit_button = driver.find_element(By.CSS_SELECTOR, "button")

# Avoid - positional selectors (fragile)
first_button = driver.find_element(By.XPATH, "(//button)[1]")

# Avoid - full XPath (very fragile)
long_xpath = driver.find_element(
    By.XPATH, 
    "/html/body/div[1]/div[2]/div[3]/button"
)
```

### 4. Handle Dynamic Content

**✅ Good: Wait for dynamic content**

```python
def test_dynamic_content(driver):
    driver.get("https://example.com")
    
    wait = WebDriverWait(driver, 15)
    
    # Wait for loading indicator to disappear
    wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "loading")))
    
    # Wait for new content to appear
    new_content = wait.until(
        EC.presence_of_element_located((By.CLASS_NAME, "new-content"))
    )
    
    # Wait for AJAX to complete
    wait.until(lambda d: d.execute_script("return jQuery.active") == 0)
    
    # Verify dynamic content
    assert new_content.text == "Loaded dynamically"
```

### 5. Clean Up Resources

**✅ Good: Proper cleanup**

```python
import pytest

@pytest.fixture(scope="function")
def driver():
    """Create driver and cleanup after test"""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    yield driver
    
    # Cleanup
    driver.quit()

def test_with_cleanup(driver):
    # Your test code
    driver.get("https://example.com")
    # Test logic here
    pass
```

**❌ Bad: No cleanup**

```python
def test_without_cleanup(driver):
    driver.get("https://example.com")
    # Test code
    # Browser never closed - memory leak!
```

---

## 📡 API Testing Best Practices

### 1. Validate Responses Thoroughly

**✅ Good: Comprehensive validation**

```python
def test_api_response_validation():
    response = requests.get("https://api.example.com/users/123")
    
    # Validate status code
    assert response.status_code == 200
    
    # Validate content type
    assert response.headers.get("content-type", "").startswith("application/json")
    
    # Validate JSON structure
    data = response.json()
    assert "id" in data
    assert "name" in data
    assert "email" in data
    assert "created_at" in data
    
    # Validate data types
    assert isinstance(data["id"], int)
    assert isinstance(data["name"], str)
    assert isinstance(data["email"], str)
    assert isinstance(data["created_at"], str)
    
    # Validate business rules
    assert len(data["name"]) > 0
    assert "@" in data["email"]
    assert data["id"] > 0
```

### 2. Handle Authentication Properly

**✅ Good: Proper auth management**

```python
import requests

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
    
    def authenticate(self, username, password):
        """Login and store token"""
        response = self.session.post(
            f"{self.base_url}/auth/login",
            json={"username": username, "password": password}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            self.session.headers.update({
                "Authorization": f"Bearer {token_data['access_token']}"
            })
            return True
        return False
    
    def get_user_profile(self):
        """Get user profile with authentication"""
        response = self.session.get(f"{self.base_url}/users/profile")
        response.raise_for_status()  # Raise exception for HTTP errors
        return response.json()
    
    def create_user(self, user_data):
        """Create new user"""
        response = self.session.post(
            f"{self.base_url}/users",
            json=user_data
        )
        response.raise_for_status()
        return response.json()

# Usage
api_client = APIClient("https://api.example.com")
api_client.authenticate("testuser", "testpass")
user = api_client.get_user_profile()
```

### 3. Use Sessions for Connection Pooling

**✅ Good: Use sessions**

```python
def test_with_session():
    # Create session for connection pooling
    session = requests.Session()
    
    # Set common headers
    session.headers.update({
        "Content-Type": "application/json",
        "User-Agent": "Test-Client/1.0"
    })
    
    # Multiple requests using same session
    response1 = session.get("https://api.example.com/users/1")
    response2 = session.get("https://api.example.com/users/2")
    response3 = session.get("https://api.example.com/users/3")
    
    # Session handles connection reuse automatically
```

### 4. Handle Errors Gracefully

**✅ Good: Proper error handling**

```python
from requests.exceptions import RequestException, Timeout, ConnectionError

def robust_api_call(url):
    """API call with comprehensive error handling"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise for HTTP errors
        
        # Validate response
        if response.headers.get("content-type", "").startswith("application/json"):
            return response.json()
        else:
            raise ValueError(f"Unexpected content type: {response.headers.get('content-type')}")
            
    except Timeout:
        print(f"Request to {url} timed out")
        raise
        
    except ConnectionError:
        print(f"Could not connect to {url}")
        raise
        
    except RequestException as e:
        print(f"Request failed: {e}")
        raise
        
    except ValueError as e:
        print(f"Invalid response: {e}")
        raise
```

### 5. Test API Contract

**✅ Good: Validate API contract**

```python
import jsonschema

def test_api_contract():
    # Define expected schema
    user_schema = {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string", "minLength": 1},
            "email": {"type": "string", "format": "email"},
            "created_at": {"type": "string", "format": "date-time"}
        },
        "required": ["id", "name", "email"]
    }
    
    response = requests.get("https://api.example.com/users/1")
    data = response.json()
    
    # Validate against schema
    try:
        jsonschema.validate(data, user_schema)
        print("✅ API contract validation passed")
    except jsonschema.ValidationError as e:
        print(f"❌ API contract validation failed: {e}")
        raise
```

---

## 📱 Mobile Testing Best Practices

### 1. Use Multiple Element Strategies

**✅ Good: Try multiple selectors**

```python
from appium.webdriver.common.appiumby import AppiumBy

def find_element_robustly(driver, element_descriptions):
    """Try multiple strategies to find element"""
    
    for description in element_descriptions:
        try:
            strategy, value = description
            element = driver.find_element(strategy, value)
            return element
        except:
            continue
    
    raise Exception(f"Could not find element with any of: {element_descriptions}")

# Usage
login_button = find_element_robustly(driver, [
    (AppiumBy.ID, "login_button"),
    (AppiumBy.CLASS_NAME, "android.widget.Button"),
    (AppiumBy.XPATH, "//android.widget.Button[@text='Login']"),
    (AppiumBy.ACCESSIBILITY_ID, "Login Button")
])
```

### 2. Handle Gestures Properly

**✅ Good: Proper gesture implementation**

```python
from appium.webdriver.common.touch_action import TouchAction

def swipe_down(driver, element=None):
    """Swipe down with proper coordinates"""
    if element:
        # Swipe on specific element
        action = TouchAction(driver)
        action.press(element).move_to(x=0, y=-200).release().perform()
    else:
        # Swipe on screen
        driver.swipe(500, 1500, 500, 500, 1000)

def tap_with_retry(driver, locator, max_attempts=3):
    """Tap element with retry logic"""
    for attempt in range(max_attempts):
        try:
            element = driver.find_element(locator)
            element.click()
            return True
        except:
            if attempt < max_attempts - 1:
                time.sleep(1)  # Wait before retry
            else:
                raise Exception(f"Could not tap element after {max_attempts} attempts")
```

### 3. Wait for App State Changes

**✅ Good: Wait for app state changes**

```python
def wait_for_app_state(driver, package_name, expected_state, timeout=10):
    """Wait for app to reach specific state"""
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        current_state = driver.app_state(package_name)
        if current_state == expected_state:
            return True
        time.sleep(0.5)
    
    raise TimeoutError(f"App did not reach state {expected_state}")

def test_app_launch_and_close():
    driver.launch_app()
    
    # Wait for app to be running in foreground
    wait_for_app_state(driver, "com.example.app", 4)
    
    driver.close_app()
    
    # Wait for app to be closed
    wait_for_app_state(driver, "com.example.app", 1)
```

### 4. Handle Device Rotation

**✅ Good: Handle device rotation**

```python
def test_screen_rotation():
    driver = webdriver.Remote("http://localhost:4723", options)
    
    # Get initial orientation
    initial_orientation = driver.orientation
    print(f"Initial orientation: {initial_orientation}")
    
    # Rotate to landscape
    driver.orientation = "LANDSCAPE"
    time.sleep(2)  # Wait for rotation animation
    
    # Verify rotation
    current_orientation = driver.orientation
    assert current_orientation == "LANDSCAPE"
    
    # Rotate back to portrait
    driver.orientation = "PORTRAIT"
    time.sleep(2)
    
    # Verify rotation back
    assert driver.orientation == "PORTRAIT"
```

---

## 📊 Data-Driven Testing Best Practices

### 1. Organize Test Data

**✅ Good: Clean data organization**

```python
# test_data/users.json
{
  "valid_users": [
    {"username": "user1", "email": "user1@example.com", "password": "pass123"},
    {"username": "user2", "email": "user2@example.com", "password": "pass456"}
  ],
  "invalid_users": [
    {"username": "", "email": "invalid@example.com"},
    {"username": "user", "email": "not-an-email"}
  ]
}

# test_data/users.csv
username,email,password,expected_result
user1,user1@example.com,pass123,success
user2,user2@example.com,pass456,success
invalid,,pass123,failure
user3,user3@example.com,,failure
```

### 2. Validate Test Data

**✅ Good: Validate before use**

```python
import pandas as pd
import json

def validate_test_data(data_source):
    """Validate test data before using"""
    
    if data_source.endswith('.json'):
        with open(data_source) as f:
            data = json.load(f)
    
    elif data_source.endswith('.csv'):
        data = pd.read_csv(data_source)
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    
    if isinstance(data, dict):
        for category, records in data.items():
            for record in records:
                for field in required_fields:
                    if field not in record:
                        raise ValueError(f"Missing required field '{field}' in {category}")
    
    elif isinstance(data, pd.DataFrame):
        for field in required_fields:
            if field not in data.columns:
                raise ValueError(f"Missing required column '{field}'")
    
    print("✅ Test data validation passed")
    return data

# Usage
test_data = validate_test_data("test_data/users.json")
```

### 3. Use Parameterized Tests

**✅ Good: Proper parameterization**

```python
import pytest

@pytest.mark.parametrize("user_data", [
    {"username": "user1", "email": "user1@example.com", "password": "pass123"},
    {"username": "user2", "email": "user2@example.com", "password": "pass456"},
    {"username": "user3", "email": "user3@example.com", "password": "pass789"}
])
def test_user_login(user_data, driver):
    """Test login with multiple user credentials"""
    
    login_page = LoginPage(driver)
    login_page.login(user_data["username"], user_data["password"])
    
    assert login_page.is_login_successful()

# Load from file
@pytest.mark.parametrize("user_data", load_test_data("test_data/users.csv"))
def test_user_login_from_file(user_data, driver):
    """Test login with data from file"""
    
    login_page = LoginPage(driver)
    login_page.login(user_data["username"], user_data["password"])
    
    if user_data["expected_result"] == "success":
        assert login_page.is_login_successful()
    else:
        error_msg = login_page.get_error_message()
        assert "Invalid" in error_msg
```

---

## 🔧 General Best Practices

### 1. Use Pytest for Test Organization

**✅ Good: Pytest structure**

```python
# test_login.py
import pytest

class TestLogin:
    """Login test suite"""
    
    @pytest.fixture
    def login_page(self, driver):
        return LoginPage(driver)
    
    def test_valid_login(self, login_page):
        """Test successful login with valid credentials"""
        login_page.login("user@example.com", "password123")
        assert login_page.is_login_successful()
    
    def test_invalid_username(self, login_page):
        """Test login fails with invalid username"""
        login_page.login("invalid@example.com", "password123")
        
        error_msg = login_page.get_error_message()
        assert "Invalid credentials" in error_msg
    
    def test_invalid_password(self, login_page):
        """Test login fails with invalid password"""
        login_page.login("user@example.com", "wrongpassword")
        
        error_msg = login_page.get_error_message()
        assert "Invalid credentials" in error_msg

# Run specific test
# pytest test_login.py::TestLogin::test_valid_login -v
```

### 2. Configuration Management

**✅ Good: Centralized configuration**

```python
# conftest.py
import pytest
from dataclasses import dataclass

@dataclass
class TestConfig:
    base_url: str
    browser: str
    headless: bool
    timeout: int
    api_base_url: str

@pytest.fixture(scope="session")
def config():
    """Load test configuration"""
    return TestConfig(
        base_url="https://example.com",
        browser="chrome",
        headless=False,
        timeout=10,
        api_base_url="https://api.example.com"
    )

@pytest.fixture
def driver(config):
    """Create browser driver with config"""
    if config.browser == "chrome":
        options = Options()
        if config.headless:
            options.add_argument("--headless")
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    else:
        raise ValueError(f"Unsupported browser: {config.browser}")
    
    driver.implicitly_wait(config.timeout)
    
    yield driver
    
    driver.quit()
```

### 3. Error Handling and Reporting

**✅ Good: Comprehensive error handling**

```python
def test_with_error_handling(driver):
    """Test with proper error handling and reporting"""
    
    try:
        # Your test code
        login_page = LoginPage(driver)
        login_page.login("user@example.com", "password123")
        assert login_page.is_login_successful()
        
    except AssertionError as e:
        # Take screenshot for debugging
        driver.save_screenshot("test_failure.png")
        
        # Log error details
        print(f"Test assertion failed: {e}")
        
        # Get page source for debugging
        page_source = driver.page_source
        print(f"Page source length: {len(page_source)}")
        
        raise
        
    except Exception as e:
        # Handle unexpected errors
        driver.save_screenshot("unexpected_error.png")
        
        print(f"Unexpected error: {e}")
        print(f"Current URL: {driver.current_url}")
        print(f"Page title: {driver.title}")
        
        raise

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Custom test report generation"""
    outcome = yield
    report = outcome.get_result()
    
    if report.failed:
        # Add custom information to failed tests
        if "driver" in item.fixturenames:
            driver = item.funcargs["driver"]
            driver.save_screenshot(f"failure_{item.name}.png")
```

### 4. Test Documentation

**✅ Good: Well-documented tests**

```python
def test_user_can_login_with_valid_credentials(driver):
    """
    Test that users can successfully log in with valid credentials.
    
    Test Steps:
    1. Navigate to login page
    2. Enter valid username
    3. Enter valid password
    4. Click login button
    5. Verify redirect to dashboard
    
    Expected Results:
    - User is redirected to dashboard page
    - No error messages are displayed
    - User session is established
    
    Test Data:
    - Valid username: user@example.com
    - Valid password: password123
    
    Tags:
    - login
    - authentication
    - critical
    """
    # Implementation here
    pass

class TestShoppingCart:
    """
    Test suite for shopping cart functionality.
    
    These tests verify that users can:
    - Add items to cart
    - Remove items from cart
    - Update item quantities
    - Complete checkout process
    """
    
    def test_add_single_item_to_cart(self, driver):
        """Add a single item to the shopping cart."""
        # Test implementation
        pass
    
    def test_add_multiple_items_to_cart(self, driver):
        """Add multiple items to the shopping cart."""
        # Test implementation
        pass
```

### 5. Test Independence

**✅ Good: Independent tests**

```python
def test_user_registration(driver):
    """Test user registration - should be independent"""
    
    # Each test should setup its own data
    unique_email = f"test_{int(time.time())}@example.com"
    
    register_page = RegisterPage(driver)
    register_page.go_to_registration()
    register_page.fill_registration_form(
        username="testuser",
        email=unique_email,
        password="password123"
    )
    register_page.submit_registration()
    
    assert register_page.is_registration_successful()

def test_login_after_registration(driver):
    """Test login with newly registered user"""
    # Should work independently - doesn't depend on test_user_registration
    # Uses its own test data
    pass

# ❌ Bad: Tests that depend on each other
def test_user_registration(driver):
    # Creates user
    pass

def test_login_with_created_user(driver):
    # ❌ This depends on previous test - fragile!
    pass
```

### 6. Performance Considerations

**✅ Good: Optimized for performance**

```python
# Use headless mode for CI/CD
def test_performance_optimized():
    if os.getenv("CI"):
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(options=options)
    else:
        driver = webdriver.Chrome()

# Disable images for faster loading
def test_faster_loading():
    options = Options()
    prefs = {
        "profile.managed_default_content_settings.images": 2,
        "profile.default_content_setting_values.notifications": 2
    }
    options.add_experimental_option("prefs", prefs)
    
    driver = webdriver.Chrome(options=options)

# Reuse sessions for API tests
def test_api_performance():
    session = requests.Session()
    
    # Make multiple requests with same session
    for i in range(100):
        response = session.get(f"https://api.example.com/users/{i}")
        assert response.status_code == 200
```

---

## 🎯 Test Design Principles

### 1. AAA Pattern (Arrange, Act, Assert)

**✅ Good: Clear test structure**

```python
def test_user_login():
    """Test user login following AAA pattern"""
    
    # Arrange - Setup
    driver = webdriver.Chrome()
    login_page = LoginPage(driver)
    
    # Act - Perform action
    login_page.login("user@example.com", "password123")
    
    # Assert - Verify result
    assert login_page.is_login_successful()
    
    driver.quit()
```

### 2. Given-When-Then Pattern

**✅ Good: Behavior-driven tests**

```python
def test_given_user_is_on_login_page_when_they_enter_valid_credentials_then_they_are_logged_in():
    """
    Given a user is on the login page
    When they enter valid credentials
    Then they are logged in and redirected to the dashboard
    """
    
    # Given
    driver = webdriver.Chrome()
    login_page = LoginPage(driver)
    login_page.go_to_login()
    
    # When
    login_page.login("user@example.com", "password123")
    
    # Then
    assert login_page.is_login_successful()
    assert "/dashboard" in driver.current_url
    
    driver.quit()
```

### 3. Test Pyramid

```
                 /\
                /  \
               / E2E \
              /      \
             / UI Tests \
            /__________\
           /   API      \
          /   Tests     \
         /______________\
        /  Unit Tests   \
       /________________\
```

**✅ Good: Test at appropriate levels**

```python
# Unit tests - Fast, isolated
def test_validate_email_format():
    assert validate_email("user@example.com") == True
    assert validate_email("invalid-email") == False

# API tests - Medium speed, integration
def test_create_user_api():
    response = requests.post("/users", json={
        "name": "John",
        "email": "john@example.com"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "John"

# UI tests - Slower, end-to-end
def test_complete_user_registration_flow(driver):
    # Test entire user registration flow
    pass
```

---

## 📊 Metrics and Monitoring

### Test Metrics to Track

```python
def calculate_test_metrics(test_results):
    """Calculate test metrics for reporting"""
    
    total_tests = len(test_results)
    passed_tests = sum(1 for r in test_results if r.passed)
    failed_tests = total_tests - passed_tests
    
    success_rate = (passed_tests / total_tests) * 100
    
    # Calculate execution times
    execution_times = [r.duration for r in test_results]
    avg_time = sum(execution_times) / len(execution_times)
    max_time = max(execution_times)
    min_time = min(execution_times)
    
    return {
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "success_rate": success_rate,
        "avg_execution_time": avg_time,
        "max_execution_time": max_time,
        "min_execution_time": min_time
    }
```

---

## 🎉 Summary Checklist

### Before Writing Tests
- [ ] Plan your test strategy
- [ ] Identify test levels (unit, integration, E2E)
- [ ] Choose appropriate tools and frameworks
- [ ] Set up test environment

### While Writing Tests
- [ ] Use Page Object Model for UI tests
- [ ] Add explicit waits instead of fixed sleeps
- [ ] Validate responses thoroughly for API tests
- [ ] Handle errors gracefully
- [ ] Document test purpose and expected results
- [ ] Make tests independent
- [ ] Follow AAA or Given-When-Then pattern

### After Writing Tests
- [ ] Run tests and verify they pass
- [ ] Check test execution time
- [ ] Review test coverage
- [ ] Optimize slow tests
- [ ] Add error handling and reporting
- [ ] Document how to run tests

---

**Remember:** Good tests are:
- **Reliable** - Pass consistently
- **Readable** - Easy to understand
- **Maintainable** - Easy to update
- **Fast** - Execute quickly
- **Independent** - Don't depend on other tests

These practices will help you create a robust, maintainable test suite that grows with your application!