# Test Types Overview

> **Comprehensive guide to all testing capabilities**

This document covers all the different types of tests you can create with this framework, from simple web page checks to complex mobile app testing.

## 📋 Quick Reference

| Test Type | Use Case | Difficulty | Setup Time |
|-----------|----------|------------|------------|
| [Web Testing](#🌐-web-testing) | Test websites and web apps | ⭐ Easy | 2 min |
| [API Testing](#📡-api-testing) | Test REST APIs and services | ⭐ Easy | 1 min |
| [Mobile Testing](#📱-mobile-testing) | Test Android/iOS apps | ⭐⭐ Medium | 10 min |
| [Data-Driven Testing](#📊-data-driven-testing) | Test with multiple data sets | ⭐⭐ Medium | 5 min |
| [Integration Testing](#🔗-integration-testing) | Test component interactions | ⭐⭐⭐ Hard | 15 min |

---

## 🌐 Web Testing

Test websites, web applications, and browser-based functionality.

### What You Can Test

#### ✅ Basic Page Operations
- **Page Loading**: Verify pages load correctly
- **Title Verification**: Check page titles and headings
- **URL Navigation**: Test page routing and links
- **Element Presence**: Confirm elements exist on page

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

def test_page_loading():
    driver = webdriver.Chrome()
    
    # Load page
    driver.get("https://example.com")
    
    # Verify page loaded
    assert driver.title == "Example Domain"
    
    # Check element exists
    heading = driver.find_element(By.TAG_NAME, "h1")
    assert "Example Domain" in heading.text
    
    driver.quit()
```

#### ✅ User Interactions
- **Form Filling**: Input data into forms
- **Button Clicks**: Click buttons and links
- **Dropdown Selection**: Select options from dropdowns
- **File Uploads**: Upload files to web forms

```python
def test_form_interaction():
    driver = webdriver.Chrome()
    driver.get("https://your-form-page.com")
    
    # Fill form
    driver.find_element(By.NAME, "username").send_keys("testuser")
    driver.find_element(By.NAME, "email").send_keys("test@example.com")
    
    # Select dropdown
    from selenium.webdriver.support.ui import Select
    dropdown = Select(driver.find_element(By.NAME, "country"))
    dropdown.select_by_visible_text("USA")
    
    # Submit form
    driver.find_element(By.TYPE, "submit").click()
    
    # Verify success
    success_msg = driver.find_element(By.CLASS_NAME, "success")
    assert "Thank you" in success_msg.text
    
    driver.quit()
```

#### ✅ User Authentication
- **Login Testing**: Test login/logout flows
- **Session Management**: Verify user sessions
- **Password Validation**: Test password requirements
- **Access Control**: Test protected pages

```python
def test_user_login():
    driver = webdriver.Chrome()
    driver.get("https://your-app.com/login")
    
    # Login
    driver.find_element(By.NAME, "username").send_keys("testuser")
    driver.find_element(By.NAME, "password").send_keys("correctpassword")
    driver.find_element(By.NAME, "login").click()
    
    # Verify login success
    welcome_msg = driver.find_element(By.CLASS_NAME, "welcome")
    assert "Welcome" in welcome_msg.text
    
    # Verify we're on dashboard
    assert "/dashboard" in driver.current_url
    
    driver.quit()
```

#### ✅ E-commerce Testing
- **Product Browsing**: Test product catalogs
- **Shopping Cart**: Add/remove items
- **Checkout Process**: Test complete purchase flow
- **Payment Forms**: Test payment integration

```python
def test_shopping_cart():
    driver = webdriver.Chrome()
    driver.get("https://shop.example.com")
    
    # Browse products
    driver.find_element(By.LINK_TEXT, "Electronics").click()
    
    # Add product to cart
    product_link = driver.find_element(By.CSS_SELECTOR, ".product:first-child a")
    product_link.click()
    driver.find_element(By.CLASS_NAME, "add-to-cart").click()
    
    # Go to cart
    driver.find_element(By.CLASS_NAME, "cart-icon").click()
    
    # Verify product in cart
    cart_item = driver.find_element(By.CLASS_NAME, "cart-item")
    assert cart_item.is_displayed()
    
    driver.quit()
```

#### ✅ Navigation Testing
- **Menu Navigation**: Test main menu items
- **Breadcrumbs**: Verify breadcrumb navigation
- **Page Links**: Test all links on page
- **Back/Forward**: Test browser navigation

```python
def test_navigation():
    driver = webdriver.Chrome()
    driver.get("https://your-site.com")
    
    # Test main menu
    driver.find_element(By.LINK_TEXT, "About").click()
    assert driver.current_url.endswith("/about")
    
    # Test breadcrumbs
    home_link = driver.find_element(By.CSS_SELECTOR, ".breadcrumb a")
    home_link.click()
    assert driver.current_url == "https://your-site.com/"
    
    # Test internal links
    features_link = driver.find_element(By.LINK_TEXT, "Features")
    features_link.click()
    assert "/features" in driver.current_url
    
    driver.quit()
```

#### ✅ Responsive Design Testing
- **Mobile Views**: Test mobile layouts
- **Tablet Views**: Test tablet layouts
- **Desktop Views**: Test desktop layouts
- **Touch Interactions**: Test touch gestures

```python
def test_responsive_design():
    driver = webdriver.Chrome()
    
    # Test mobile view
    driver.set_window_size(375, 667)  # iPhone size
    driver.get("https://your-site.com")
    
    # Verify mobile menu exists
    mobile_menu = driver.find_element(By.CLASS_NAME, "mobile-menu")
    assert mobile_menu.is_displayed()
    
    # Test tablet view
    driver.set_window_size(768, 1024)  # iPad size
    driver.refresh()
    
    # Test desktop view
    driver.set_window_size(1920, 1080)  # Desktop size
    driver.refresh()
    
    driver.quit()
```

### Web Testing Examples

For complete working examples, see:
- [Basic Web Tests](examples/web/basic_tests/)
- [Form Testing](examples/web/form_tests/)
- [E-commerce Tests](examples/web/ecommerce_tests/)
- [Responsive Tests](examples/web/responsive_tests/)

---

## 📡 API Testing

Test REST APIs, web services, and backend functionality.

### What You Can Test

#### ✅ CRUD Operations
- **Create (POST)**: Test creating new resources
- **Read (GET)**: Test retrieving data
- **Update (PUT/PATCH)**: Test updating existing resources
- **Delete (DELETE)**: Test removing resources

```python
import requests

def test_api_crud():
    base_url = "https://api.example.com"
    
    # CREATE - POST new user
    user_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
    }
    response = requests.post(f"{base_url}/users", json=user_data)
    assert response.status_code == 201
    created_user = response.json()
    user_id = created_user["id"]
    
    # READ - GET user
    response = requests.get(f"{base_url}/users/{user_id}")
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == "John Doe"
    
    # UPDATE - PUT user
    updated_data = {"age": 31}
    response = requests.put(f"{base_url}/users/{user_id}", json=updated_data)
    assert response.status_code == 200
    
    # DELETE - DELETE user
    response = requests.delete(f"{base_url}/users/{user_id}")
    assert response.status_code == 204
    
    print("✅ CRUD test passed!")
```

#### ✅ Authentication Testing
- **Login**: Test user authentication
- **Token Validation**: Test JWT tokens
- **Authorization**: Test access permissions
- **Session Management**: Test user sessions

```python
def test_api_authentication():
    base_url = "https://api.example.com"
    
    # Test invalid login
    response = requests.post(f"{base_url}/auth/login", json={
        "username": "wronguser",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    
    # Test valid login
    response = requests.post(f"{base_url}/auth/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    token_data = response.json()
    token = token_data["access_token"]
    
    # Use token for authenticated request
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{base_url}/users/profile", headers=headers)
    assert response.status_code == 200
    
    print("✅ Authentication test passed!")
```

#### ✅ Data Validation
- **Schema Validation**: Verify response structure
- **Data Types**: Check data types
- **Required Fields**: Verify required fields present
- **Business Rules**: Test business logic

```python
def test_data_validation():
    base_url = "https://api.example.com"
    
    # Test with invalid data
    invalid_data = {
        "name": "",  # Empty name
        "email": "invalid-email",  # Invalid email
        "age": -5   # Negative age
    }
    
    response = requests.post(f"{base_url}/users", json=invalid_data)
    assert response.status_code == 400
    errors = response.json()["errors"]
    
    # Verify specific validation errors
    assert "name" in errors
    assert "email" in errors
    assert "age" in errors
    
    print("✅ Validation test passed!")
```

#### ✅ Error Handling
- **404 Errors**: Test non-existent resources
- **500 Errors**: Test server errors
- **Rate Limiting**: Test API rate limits
- **Timeout Handling**: Test request timeouts

```python
def test_error_handling():
    base_url = "https://api.example.com"
    
    # Test 404 - Not Found
    response = requests.get(f"{base_url}/users/99999")
    assert response.status_code == 404
    
    # Test 400 - Bad Request
    response = requests.post(f"{base_url}/users", json={"invalid": "data"})
    assert response.status_code == 400
    
    # Test 500 - Internal Server Error
    response = requests.post(f"{base_url}/broken-endpoint", json={"test": "data"})
    assert response.status_code in [500, 502, 503, 504]
    
    print("✅ Error handling test passed!")
```

#### ✅ Performance Testing
- **Response Time**: Measure API response times
- **Load Testing**: Test with multiple requests
- **Concurrent Users**: Test simultaneous requests
- **Throughput**: Measure requests per second

```python
import time
import concurrent.futures

def test_api_performance():
    base_url = "https://api.example.com"
    
    # Measure single request time
    start_time = time.time()
    response = requests.get(f"{base_url}/users")
    end_time = time.time()
    
    response_time = end_time - start_time
    assert response_time < 2.0  # Should respond in under 2 seconds
    print(f"Response time: {response_time:.2f}s")
    
    # Test concurrent requests
    def make_request():
        return requests.get(f"{base_url}/users/1")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(50)]
        responses = [f.result() for f in futures]
    
    # Verify all requests succeeded
    successful_responses = [r for r in responses if r.status_code == 200]
    assert len(successful_responses) == 50
    
    print("✅ Performance test passed!")
```

### API Testing Examples

For complete working examples, see:
- [Basic API Tests](examples/api/basic_tests/)
- [Authentication Tests](examples/api/auth_tests/)
- [CRUD Operations](examples/api/crud_tests/)
- [Performance Tests](examples/api/performance_tests/)

---

## 📱 Mobile Testing

Test Android and iOS applications using Appium.

### What You Can Test

#### ✅ App Installation & Launch
- **Installation**: Test app installation process
- **Launch**: Test app launching
- **Version**: Verify app version
- **Updates**: Test app update process

```python
from appium import webdriver
from appium.options.android import UiAutomator2Options

def test_app_installation():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.app = "/path/to/your/app.apk"
    options.app_package = "com.yourcompany.yourapp"
    options.app_activity = "com.yourcompany.yourapp.MainActivity"
    
    driver = webdriver.Remote("http://localhost:4723", options=options)
    
    try:
        # Verify app launched
        package_info = driver.get_performance_data("memoryInfo")
        assert driver.app_state("com.yourcompany.yourapp") == 4
        
        print("✅ App installation test passed!")
        
    finally:
        driver.quit()
```

#### ✅ User Interface Testing
- **Button Clicks**: Tap buttons and interactive elements
- **Text Input**: Enter text in input fields
- **Scrolling**: Scroll through content
- **Swiping**: Swipe gestures

```python
def test_ui_interactions():
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.app = "/path/to/your/app.apk"
    
    driver = webdriver.Remote("http://localhost:4723", options=options)
    
    try:
        # Wait for app to load
        driver.implicitly_wait(10)
        
        # Find and tap button
        login_button = driver.find_element("id", "login_button")
        login_button.click()
        
        # Fill text input
        username_field = driver.find_element("id", "username_input")
        username_field.send_keys("testuser")
        
        password_field = driver.find_element("id", "password_input")
        password_field.send_keys("password123")
        
        # Submit form
        submit_button = driver.find_element("id", "submit_button")
        submit_button.click()
        
        print("✅ UI interaction test passed!")
        
    finally:
        driver.quit()
```

#### ✅ Gestures & Touch
- **Tap**: Single tap, double tap, long press
- **Swipe**: Up, down, left, right
- **Pinch**: Pinch to zoom
- **Rotate**: Device rotation

```python
def test_gestures():
    driver = webdriver.Remote("http://localhost:4723", options=options)
    
    try:
        # Single tap
        driver.tap([(100, 200)])
        
        # Long press (2 seconds)
        driver.tap([(100, 200)], 2000)
        
        # Swipe up
        driver.swipe(500, 1000, 500, 500, 1000)
        
        # Swipe left
        driver.swipe(800, 500, 200, 500, 1000)
        
        # Double tap
        driver.tap([(100, 200)])
        driver.tap([(100, 200)])
        
        print("✅ Gesture test passed!")
        
    finally:
        driver.quit()
```

#### ✅ Navigation Testing
- **Screen Navigation**: Navigate between screens
- **Back Button**: Test device back button
- **Menu Navigation**: Test app menus
- **Tab Navigation**: Test tab switching

```python
def test_navigation():
    driver = webdriver.Remote("http://localhost:4723", options=options)
    
    try:
        # Navigate through app
        driver.find_element("id", "home_tab").click()
        assert "Home" in driver.find_element("id", "screen_title").text
        
        driver.find_element("id", "profile_tab").click()
        assert "Profile" in driver.find_element("id", "screen_title").text
        
        # Test back navigation
        driver.press_keycode(4)  # Android back button
        assert "Home" in driver.find_element("id", "screen_title").text
        
        print("✅ Navigation test passed!")
        
    finally:
        driver.quit()
```

#### ✅ Cross-Platform Testing
- **Android Testing**: Test on Android devices/emulators
- **iOS Testing**: Test on iOS devices/simulators
- **Platform Differences**: Handle platform-specific issues
- **Feature Parity**: Ensure features work on both platforms

```python
# Android testing
def test_android_app():
    android_options = UiAutomator2Options()
    android_options.platform_name = "Android"
    android_options.app = "/path/to/android/app.apk"
    
    driver = webdriver.Remote("http://localhost:4723", options=android_options)
    
    # Android-specific testing
    driver.find_element("id", "android_menu").click()
    
    driver.quit()

# iOS testing
def test_ios_app():
    from appium.options.ios import XCUITestOptions
    
    ios_options = XCUITestOptions()
    ios_options.platform_name = "iOS"
    ios_options.bundle_id = "com.yourcompany.yourapp"
    
    driver = webdriver.Remote("http://localhost:4723", options=ios_options)
    
    # iOS-specific testing
    driver.find_element("name", "iOS Menu").click()
    
    driver.quit()
```

### Mobile Testing Examples

For complete working examples, see:
- [Basic Mobile Tests](examples/mobile/basic_tests/)
- [App Interaction Tests](examples/mobile/interaction_tests/)
- [Gesture Tests](examples/mobile/gesture_tests/)
- [Cross-Platform Tests](examples/mobile/cross_platform/)

---

## 📊 Data-Driven Testing

Run the same test with multiple sets of data.

### What You Can Test

#### ✅ Parameterized Tests
- **Multiple Test Data**: Run tests with different inputs
- **Expected Results**: Test different expected outcomes
- **Data Validation**: Verify different data scenarios
- **Edge Cases**: Test boundary conditions

```python
# Load test data from CSV
import pandas as pd

def test_login_with_data():
    # Load test data
    test_data = pd.read_csv("test_data/login_data.csv")
    
    for index, row in test_data.iterrows():
        driver = webdriver.Chrome()
        
        try:
            # Test with each set of credentials
            driver.get("https://your-app.com/login")
            
            driver.find_element(By.NAME, "username").send_keys(row['username'])
            driver.find_element(By.NAME, "password").send_keys(row['password'])
            driver.find_element(By.NAME, "login").click()
            
            # Verify expected result
            if row['expected_result'] == 'success':
                assert driver.current_url.endswith('/dashboard')
                print(f"✅ Login test passed for {row['username']}")
            else:
                error_msg = driver.find_element(By.CLASS_NAME, "error")
                assert "Invalid" in error_msg.text
                print(f"✅ Error test passed for {row['username']}")
                
        finally:
            driver.quit()
```

#### ✅ File-Based Testing
- **CSV Files**: Load test data from CSV
- **JSON Files**: Load test data from JSON
- **Excel Files**: Load test data from Excel
- **Database**: Load test data from database

```python
# Load data from JSON
import json

def test_api_with_json_data():
    with open("test_data/api_test_data.json", "r") as f:
        test_cases = json.load(f)
    
    for test_case in test_cases:
        # Test each case
        response = requests.post(
            "https://api.example.com/users",
            json=test_case["input"]
        )
        
        assert response.status_code == test_case["expected_status"]
        
        if "expected_fields" in test_case:
            data = response.json()
            for field in test_case["expected_fields"]:
                assert field in data
        
        print(f"✅ Test case '{test_case['name']}' passed")
```

#### ✅ Dynamic Data Generation
- **Faker Library**: Generate realistic test data
- **Random Data**: Generate random test data
- **Synthetic Data**: Create synthetic test scenarios
- **Bulk Generation**: Generate large test datasets

```python
from faker import Faker

fake = Faker()

def test_with_generated_data():
    # Generate test users
    for i in range(10):
        user_data = {
            "name": fake.name(),
            "email": fake.email(),
            "phone": fake.phone_number(),
            "address": fake.address()
        }
        
        # Test API with generated data
        response = requests.post(
            "https://api.example.com/users",
            json=user_data
        )
        
        assert response.status_code == 201
        print(f"✅ Generated user test {i+1} passed")
```

### Data-Driven Testing Examples

For complete working examples, see:
- [CSV Data Tests](examples/data-driven/csv_tests/)
- [JSON Data Tests](examples/data-driven/json_tests/)
- [Database Tests](examples/data-driven/database_tests/)
- [Generated Data Tests](examples/data-driven/generated_tests/)

---

## 🔗 Integration Testing

Test how different components work together.

### What You Can Test

#### ✅ End-to-End Testing
- **Complete User Flows**: Test entire user journeys
- **Multi-Component**: Test interaction between components
- **Workflow Testing**: Test business process flows
- **Cross-System**: Test integration between systems

```python
def test_complete_user_flow():
    driver = webdriver.Chrome()
    
    try:
        # Step 1: User registration
        driver.get("https://your-app.com/register")
        driver.find_element(By.NAME, "email").send_keys("newuser@example.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.NAME, "register").click()
        
        # Step 2: Email verification (simulate)
        # In real scenario, you'd check email
        
        # Step 3: Login
        driver.get("https://your-app.com/login")
        driver.find_element(By.NAME, "email").send_keys("newuser@example.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.NAME, "login").click()
        
        # Step 4: Create order via API
        order_data = {
            "user_id": "newuser@example.com",
            "items": [
                {"product_id": "prod1", "quantity": 2},
                {"product_id": "prod2", "quantity": 1}
            ]
        }
        
        # Get auth token from browser session
        token = driver.get_cookie("auth_token")["value"]
        headers = {"Authorization": f"Bearer {token}"}
        
        api_response = requests.post(
            "https://api.your-app.com/orders",
            json=order_data,
            headers=headers
        )
        
        assert api_response.status_code == 201
        
        # Step 5: Verify order in UI
        driver.get("https://your-app.com/orders")
        order_element = driver.find_element(By.CLASS_NAME, "order-item")
        assert order_element.is_displayed()
        
        print("✅ End-to-end flow test passed!")
        
    finally:
        driver.quit()
```

#### ✅ Service Integration
- **API + Database**: Test API with database operations
- **External Services**: Test integration with third-party services
- **Message Queues**: Test message-based communication
- **File Systems**: Test file-based operations

```python
def test_api_database_integration():
    # Create user via API
    user_data = {"name": "Test User", "email": "test@example.com"}
    response = requests.post("https://api.example.com/users", json=user_data)
    user_id = response.json()["id"]
    
    # Verify user exists in database
    db_user = get_user_from_database(user_id)
    assert db_user["name"] == "Test User"
    assert db_user["email"] == "test@example.com"
    
    # Update user via API
    update_data = {"name": "Updated User"}
    requests.put(f"https://api.example.com/users/{user_id}", json=update_data)
    
    # Verify update in database
    updated_db_user = get_user_from_database(user_id)
    assert updated_db_user["name"] == "Updated User"
    
    print("✅ API-Database integration test passed!")
```

### Integration Testing Examples

For complete working examples, see:
- [End-to-End Tests](examples/integration/e2e_tests/)
- [API Integration Tests](examples/integration/api_tests/)
- [Service Integration Tests](examples/integration/service_tests/)

---

## 🎯 Choosing the Right Test Type

### Decision Matrix

| Scenario | Recommended Test Type | Example |
|----------|----------------------|---------|
| **Testing user login** | Web Testing | `test_user_login()` |
| **Testing REST API** | API Testing | `test_api_crud()` |
| **Testing mobile app** | Mobile Testing | `test_app_navigation()` |
| **Testing with multiple users** | Data-Driven Testing | `test_login_with_data()` |
| **Testing complete workflows** | Integration Testing | `test_complete_user_flow()` |

### Combining Test Types

You can combine different test types in a single test:

```python
def test_complete_ecommerce_flow():
    # API Testing: Create product via API
    product_data = {"name": "Test Product", "price": 29.99}
    api_response = requests.post("https://api.shop.com/products", json=product_data)
    product_id = api_response.json()["id"]
    
    # Web Testing: Purchase product via website
    driver = webdriver.Chrome()
    try:
        driver.get("https://shop.com")
        
        # Add to cart
        driver.find_element(By.LINK_TEXT, "Test Product").click()
        driver.find_element(By.CLASS_NAME, "add-to-cart").click()
        
        # Checkout
        driver.find_element(By.CLASS_NAME, "checkout").click()
        driver.find_element(By.NAME, "email").send_keys("customer@example.com")
        driver.find_element(By.NAME, "card_number").send_keys("1234567890")
        driver.find_element(By.CLASS_NAME, "complete-order").click()
        
        # Verify order success
        success_msg = driver.find_element(By.CLASS_NAME, "success")
        assert "Order confirmed" in success_msg.text
        
    finally:
        driver.quit()
    
    # API Testing: Verify order in system
    order_response = requests.get(f"https://api.shop.com/orders/latest")
    assert order_response.status_code == 200
    order = order_response.json()
    assert order["product_id"] == product_id
    
    print("✅ Combined test passed!")
```

---

## 📚 Next Steps

Now that you understand the test types:

1. **Start with Web Testing** - Easiest to learn and set up
2. **Explore API Testing** - Essential for backend testing
3. **Try Mobile Testing** - For comprehensive app testing
4. **Learn Data-Driven** - For scalable testing
5. **Master Integration Testing** - For complete workflows

**Continue with:**
- [Quick Start Guide](../QUICKSTART.md) for hands-on examples
- [Examples Directory](examples/) for complete test cases
- [Best Practices](best-practices/) for writing better tests