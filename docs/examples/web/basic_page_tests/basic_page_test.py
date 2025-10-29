#!/usr/bin/env python3
"""
Basic Web Page Test

A simple example showing how to:
1. Open a website
2. Find page elements
3. Verify page content
4. Close the browser

Run this test:
    python basic_page_test.py
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def test_page_title():
    """Test that example.com has the expected title"""
    print("🌐 Starting basic page test...")
    
    # Setup Chrome driver with automatic management
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Step 1: Navigate to the website
        print("📍 Opening https://example.com...")
        driver.get("https://example.com")
        
        # Step 2: Find the main heading
        print("🔍 Looking for page heading...")
        heading = driver.find_element(By.TAG_NAME, "h1")
        
        # Step 3: Verify the content
        print("✅ Checking page content...")
        assert "Example Domain" in heading.text, f"Expected 'Example Domain' but got: {heading.text}"
        
        print(f"✅ Page heading found: '{heading.text}'")
        print("✅ Basic page test PASSED!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        # Always close the browser
        driver.quit()
        print("🔚 Browser closed.")

def test_page_elements():
    """Test finding multiple elements on a page"""
    print("\n🔍 Starting element finding test...")
    
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://example.com")
        
        # Find all links
        links = driver.find_elements(By.TAG_NAME, "a")
        print(f"📎 Found {len(links)} links")
        
        # Find all paragraphs
        paragraphs = driver.find_elements(By.TAG_NAME, "p")
        print(f"📄 Found {len(paragraphs)} paragraphs")
        
        # Find the main heading
        headings = driver.find_elements(By.TAG_NAME, "h1")
        print(f"📋 Found {len(headings)} headings")
        
        # Verify we found expected elements
        assert len(links) >= 1, "Should have at least one link"
        assert len(paragraphs) >= 1, "Should have at least one paragraph"
        assert len(headings) == 1, "Should have exactly one h1 heading"
        
        print("✅ Element finding test PASSED!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        driver.quit()

def test_page_properties():
    """Test getting page properties"""
    print("\n📊 Starting page properties test...")
    
    driver = webdriver.Chrome(ChromeDriverManager().install())
    
    try:
        driver.get("https://example.com")
        
        # Get page title
        title = driver.title
        print(f"📄 Page title: '{title}'")
        
        # Get current URL
        url = driver.current_url
        print(f"🔗 Current URL: '{url}'")
        
        # Get page source length
        source_length = len(driver.page_source)
        print(f"📏 Page source length: {source_length} characters")
        
        # Verify properties
        assert title == "Example Domain", f"Expected 'Example Domain' but got '{title}'"
        assert "example.com" in url, f"URL should contain 'example.com' but got '{url}'"
        assert source_length > 100, "Page source should be substantial"
        
        print("✅ Page properties test PASSED!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        raise
        
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=" * 50)
    print("🧪 Running Basic Web Page Tests")
    print("=" * 50)
    
    try:
        # Run all tests
        test_page_title()
        test_page_elements()
        test_page_properties()
        
        print("\n" + "=" * 50)
        print("🎉 All basic page tests PASSED!")
        print("=" * 50)
        
    except Exception as e:
        print("\n" + "=" * 50)
        print(f"❌ Tests FAILED: {e}")
        print("=" * 50)
        exit(1)
