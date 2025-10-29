"""
Simple Form Test

Tests basic form interactions:
1. Fill out form fields
2. Submit the form
3. Verify the result

Run this test:
    python simple_form_test.py
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_simple_form_submission():
    """Test filling and submitting a simple form"""
    print("📝 Starting simple form test...")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Go to a test form page
        print("📍 Opening form page...")
        driver.get("https://httpbin.org/forms/post")
        
        # Fill out the form fields
        print("✏️ Filling form fields...")
        driver.find_element(By.NAME, "custname").send_keys("John Doe")
        driver.find_element(By.NAME, "custtel").send_keys("555-123-4567")
        driver.find_element(By.NAME, "custemail").send_keys("john@example.com")
        
        # Select from dropdown
        print("📋 Selecting dropdown options...")
        from selenium.webdriver.support.ui import Select
        size_dropdown = Select(driver.find_element(By.NAME, "size"))
        size_dropdown.select_by_visible_text("large")
        
        topping_dropdown = Select(driver.find_element(By.NAME, "topping"))
        topping_dropdown.select_by_visible_text("cheese")
        
        # Submit the form
        print("🚀 Submitting form...")
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verify the result
        print("✅ Verifying submission result...")
        
        # Check that we're on the response page
        assert "httpbin.org/forms/post" not in driver.current_url
        print(f"📍 Redirected to: {driver.current_url}")
        
        # Check that we can see the submitted data
        page_content = driver.page_source
        assert "John Doe" in page_content
        assert "john@example.com" in page_content
        assert "555-123-4567" in page_content
        
        print("✅ Form submission test PASSED!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        driver.quit()

def test_form_validation():
    """Test form validation with invalid data"""
    print("\n🚫 Starting form validation test...")
    
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://httpbin.org/forms/post")
        
        # Fill with invalid email
        print("✏️ Filling form with invalid data...")
        driver.find_element(By.NAME, "custname").send_keys("Test User")
        driver.find_element(By.NAME, "custtel").send_keys("not-a-phone")
        driver.find_element(By.NAME, "custemail").send_keys("invalid-email")
        
        # Submit
        print("🚀 Submitting form...")
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verify the form was submitted anyway (httpbin.org doesn't validate)
        print("✅ Form validation test completed (httpbin.org doesn't validate)")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        driver.quit()

def test_partial_form():
    """Test form with only required fields"""
    print("\n📋 Starting partial form test...")
    
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://httpbin.org/forms/post")
        
        # Fill only some fields
        print("✏️ Filling partial form...")
        driver.find_element(By.NAME, "custname").send_keys("Partial Test")
        driver.find_element(By.NAME, "custemail").send_keys("partial@test.com")
        
        # Submit
        print("🚀 Submitting partial form...")
        submit_button = driver.find_element(By.CSS_SELECTOR, "input[type='submit']")
        submit_button.click()
        
        # Verify submission
        assert "Partial Test" in driver.page_source
        assert "partial@test.com" in driver.page_source
        
        print("✅ Partial form test PASSED!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=" * 60)
    print("📝 Running Simple Form Tests")
    print("=" * 60)
    
    try:
        test_simple_form_submission()
        test_form_validation()
        test_partial_form()
        
        print("\n" + "=" * 60)
        print("🎉 All form tests PASSED!")
        print("=" * 60)
        
    except Exception as e:
        print("\n" + "=" * 60)
        print(f"❌ Tests FAILED: {e}")
        print("=" * 60)
        exit(1)
