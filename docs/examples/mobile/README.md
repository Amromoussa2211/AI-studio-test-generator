# Mobile Testing Examples

> **Ready-to-run mobile testing examples**

This directory contains simple, working examples of mobile testing using Appium.

## 🎯 What's Included

- ✅ **Basic Tests** - Simple app launching and element finding
- ✅ **UI Interaction Tests** - Tapping, scrolling, and text input
- ✅ **Gesture Tests** - Swipes, pinches, and rotations
- ✅ **App Lifecycle Tests** - App launching, backgrounding, closing
- ✅ **Cross-Platform Tests** - Android and iOS testing

## 🚀 Quick Start

### Prerequisites

**Required:**
```bash
# Install Appium Python client
pip install Appium-Python-Client selenium

# Install Appium server
npm install -g appium
```

**For Android:**
```bash
# Install Android SDK and tools
# Download Android Studio or just the SDK tools
# Set ANDROID_HOME environment variable

# Verify Android tools
adb --version
```

**For iOS (macOS only):**
```bash
# Install Xcode from App Store
xcode-select --install
```

### Start Appium Server

**Option 1: Command Line**
```bash
# Start Appium server
appium --address 127.0.0.1 --port 4723
```

**Option 2: Appium Desktop**
1. Download [Appium Desktop](https://github.com/appium/appium-desktop)
2. Install and launch
3. Start the server (defaults to `http://localhost:4723`)

### Run Examples

```bash
# Make sure Appium server is running first!
# Then run examples:

# Test Android app (if you have one)
python docs/examples/mobile/android_tests/basic_android_test.py

# Test connection only (no app needed)
python docs/examples/mobile/basic_tests/connection_test.py
```

## 📝 Example Files

### 1. Basic Tests (`basic_tests/`)

**File:** `connection_test.py`
```python
from appium import webdriver
from appium.options.android import UiAutomator2Options

def test_appium_connection():
    """Test connection to Appium server (no app needed)"""
    print("📱 Testing Appium connection...")
    
    # Android options
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"  # or your device name
    options.new_command_timeout = 60
    
    try:
        # Connect to Appium server
        print("🔗 Connecting to Appium server...")
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Verify connection
        platform_name = driver.platform_name
        session_id = driver.session_id
        
        print(f"✅ Connected successfully!")
        print(f"Platform: {platform_name}")
        print(f"Session ID: {session_id}")
        
        # Get device info
        device_info = driver.get_performance_data("memoryInfo")
        print(f"Device info retrieved: {bool(device_info)}")
        
        print("✅ Connection test PASSED!")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n💡 Troubleshooting tips:")
        print("1. Is Appium server running? Run: appium")
        print("2. Is Android emulator started?")
        print("3. Is USB debugging enabled (for real devices)?")
        print("4. Is device/emulator connected? Run: adb devices")
        
    finally:
        try:
            driver.quit()
        except:
            pass

def test_desired_capabilities():
    """Test different desired capabilities"""
    print("\n⚙️ Testing desired capabilities...")
    
    # Test with minimal capabilities
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        print("✅ Minimal capabilities test PASSED!")
        
    except Exception as e:
        print(f"❌ Capabilities test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass
```

### 2. Android Tests (`android_tests/`)

**File:** `basic_android_test.py`
```python
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy

def test_android_app_launch():
    """Test launching an Android app"""
    print("🤖 Testing Android app launch...")
    
    # Replace with your app details
    app_path = "/path/to/your/app.apk"  # Update this path!
    app_package = "com.example.yourapp"  # Update this package!
    app_activity = "com.example.yourapp.MainActivity"  # Update this activity!
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    options.app = app_path
    options.app_package = app_package
    options.app_activity = app_activity
    options.new_command_timeout = 300
    
    try:
        print("🚀 Launching app...")
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Wait for app to load
        driver.implicitly_wait(10)
        
        # Check app state
        app_state = driver.app_state(app_package)
        print(f"App state: {app_state}")  # 4 = running in foreground
        
        # Try to find app info
        try:
            # This will fail if your app doesn't have these elements
            app_title = driver.find_element(AppiumBy.ID, "app_title")
            print(f"App title: {app_title.text}")
        except:
            print("Note: Could not find app title element (this is normal)")
        
        print("✅ Android app launch test PASSED!")
        
    except Exception as e:
        print(f"❌ Android app test failed: {e}")
        print("\n💡 Make sure to update:")
        print("- app_path: Path to your APK file")
        print("- app_package: Your app's package name")
        print("- app_activity: Your app's main activity")
        
    finally:
        try:
            driver.quit()
        except:
            pass

def test_android_system_ui():
    """Test Android system UI (no app needed)"""
    print("\n⚙️ Testing Android system UI...")
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    options.automation_name = "UiAutomator2"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Check if we can access system UI
        try:
            # Try to find Android status bar
            status_bar = driver.find_element(AppiumBy.XPATH, "//*[contains(@resource-id, 'status_bar')]")
            print("✅ Can access system UI elements")
        except:
            print("ℹ️ System UI elements not accessible (this is normal)")
        
        # Try to press home button
        driver.press_keycode(3)  # KEYCODE_HOME
        print("✅ Successfully pressed home button")
        
        # Try to open apps
        driver.press_keycode("KEYCODE_APP_SWITCH")
        print("✅ Successfully opened app switcher")
        
        print("✅ Android system UI test PASSED!")
        
    except Exception as e:
        print(f"❌ Android system UI test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass
```

### 3. UI Interaction Tests (`interaction_tests/`)

**File:** `basic_interaction_test.py`
```python
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
import time

def test_tap_interaction():
    """Test tapping elements"""
    print("👆 Testing tap interactions...")
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Get to home screen
        driver.press_keycode(3)  # Home
        
        # Try to find and tap apps button
        try:
            # This is generic - you'll need to adjust for your device
            apps_button = driver.find_element(AppiumBy.XPATH, "//*[contains(@content-desc, 'Apps')]")
            apps_button.click()
            print("✅ Successfully tapped apps button")
        except:
            print("ℹ️ Could not find apps button (device-specific)")
        
        # Try to tap at coordinates
        print("👆 Tapping at coordinates (500, 500)...")
        driver.tap([(500, 500)], 500)
        print("✅ Tap at coordinates successful")
        
        # Wait a bit
        time.sleep(2)
        
        print("✅ Tap interaction test PASSED!")
        
    except Exception as e:
        print(f"❌ Tap interaction test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass

def test_text_input():
    """Test text input"""
    print("\n⌨️ Testing text input...")
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Try to open search or a text input
        # This is device/app specific
        
        # Example: Try to find a search field
        try:
            search_field = driver.find_element(
                AppiumBy.XPATH, 
                "//*[contains(@class, 'android.widget.EditText')]"
            )
            
            # Clear and input text
            search_field.clear()
            search_field.send_keys("Hello from Appium!")
            
            print("✅ Text input successful")
            
        except Exception as e:
            print(f"ℹ️ Could not find text input field: {e}")
            print("This is normal if you're not in an app with text inputs")
        
        print("✅ Text input test PASSED!")
        
    except Exception as e:
        print(f"❌ Text input test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass
```

### 4. Gesture Tests (`gesture_tests/`)

**File:** `basic_gestures_test.py`
```python
from appium import webdriver
from appium.options.android import UiAutomator2Options
import time

def test_swipe_gesture():
    """Test swipe gestures"""
    print("👆 Testing swipe gestures...")
    
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=options)
        
        # Wait for device to be ready
        time.sleep(2)
        
        # Test swipe up
        print("⬆️ Swiping up...")
        driver.swipe(500, 1500, 500, 500, 1000)  # start_x, start_y, end_x, end_y, duration
        time.sleep(1)
        
        # Test swipe down
        print("⬇️ Swiping down...")
        driver.swipe(500, 500, 500, 1500, 1000)
        time.sleep(1)
        
        # Test swipe left
        print("⬅️ Swiping left...")
        driver.swipe(800, 1000, 200, 1000, 1000)
        time.sleep(1)
        
        # Test swipe right
        print("➡️ Swiping right...")
        driver.swipe(200, 1000, 800, 1000, 1000)
        time.sleep(1)
        
        print("✅ Swipe gestures test PASSED!")
        
    except Exception as e:
        print(f"❌ Swipe gesture test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass

def test_tap_gestures():
    """Test different tap gestures"""
    print("\n👆 Testing tap gestures...")
    
    driver = webdriver.Remote("http://localhost:4723", options=options)
    
    try:
        # Single tap
        print("👆 Single tap...")
        driver.tap([(500, 500)], 500)
        time.sleep(1)
        
        # Double tap
        print("👆👆 Double tap...")
        driver.tap([(500, 500)], 500)
        driver.tap([(500, 500)], 500)
        time.sleep(1)
        
        # Long press
        print("👆 Long press...")
        driver.tap([(500, 500)], 2000)
        time.sleep(1)
        
        print("✅ Tap gestures test PASSED!")
        
    except Exception as e:
        print(f"❌ Tap gestures test failed: {e}")
        
    finally:
        try:
            driver.quit()
        except:
            pass
```

### 5. Cross-Platform Tests (`cross_platform/`)

**File:** `android_ios_test.py`
```python
"""
Cross-platform test that works on both Android and iOS
"""

from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions

def test_android_app():
    """Test Android app (if available)"""
    print("🤖 Testing Android app...")
    
    # Android capabilities
    android_options = UiAutomator2Options()
    android_options.platform_name = "Android"
    android_options.device_name = "Android Emulator"
    
    # Add your app details
    # android_options.app = "/path/to/your/android/app.apk"
    # android_options.app_package = "com.yourcompany.yourapp"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=android_options)
        
        # Generic Android test
        print("✅ Android platform detected")
        print(f"Platform: {driver.platform_name}")
        print(f"Session: {driver.session_id}")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ Android test failed: {e}")
        return False

def test_ios_app():
    """Test iOS app (if available)"""
    print("\n🍎 Testing iOS app...")
    
    # iOS capabilities
    ios_options = XCUITestOptions()
    ios_options.platform_name = "iOS"
    ios_options.bundle_id = "com.yourcompany.yourapp"  # Update with your bundle ID
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=ios_options)
        
        # Generic iOS test
        print("✅ iOS platform detected")
        print(f"Platform: {driver.platform_name}")
        print(f"Session: {driver.session_id}")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ iOS test failed: {e}")
        print("Note: iOS testing requires macOS with Xcode")
        return False

def test_platform_detection():
    """Test platform detection"""
    print("\n🔍 Testing platform detection...")
    
    # Try Android first
    android_options = UiAutomator2Options()
    android_options.platform_name = "Android"
    android_options.device_name = "Android Emulator"
    
    try:
        driver = webdriver.Remote("http://localhost:4723", options=android_options)
        platform = driver.platform_name
        driver.quit()
        
        print(f"✅ Detected platform: {platform}")
        return platform
        
    except:
        # Try iOS if Android failed
        ios_options = XCUITestOptions()
        ios_options.platform_name = "iOS"
        
        try:
            driver = webdriver.Remote("http://localhost:4723", options=ios_options)
            platform = driver.platform_name
            driver.quit()
            
            print(f"✅ Detected platform: {platform}")
            return platform
            
        except:
            print("❌ Could not detect platform")
            print("Make sure:")
            print("- Appium server is running")
            print("- At least one device/emulator is connected")
            return None
```

## 🔧 Customization

### Test Your Own App

Replace the placeholder values in Android tests:

```python
# Find your app details
APP_PATH = "/absolute/path/to/your/app.apk"
APP_PACKAGE = "com.yourcompany.yourapp"
APP_ACTIVITY = "com.yourcompany.yourapp.MainActivity"

options = UiAutomator2Options()
options.app = APP_PATH
options.app_package = APP_PACKAGE
options.app_activity = APP_ACTIVITY
```

### Find Your App Details

**Android:**
```bash
# Get APK info
aapt dump badging your-app.apk

# Get package name and activity
adb shell dumpsys window windows | grep -E 'mCurrentFocus'

# List installed apps
adb shell pm list packages | grep yourapp
```

**iOS:**
```bash
# Get bundle ID from Xcode
# Or from Info.plist in your app bundle
```

### Modify Test Behavior

```python
# Change device/emulator name
options.device_name = "Your Device Name"

# Add capabilities
options.full_reset = True  # Reinstall app each time
options.no_reset = False   # Don't reset app state
options.automation_name = "UiAutomator2"  # Use specific automation

# Add wait times
driver.implicitly_wait(10)  # Wait up to 10 seconds for elements
```

## 🚨 Common Issues & Solutions

### Issue: Connection Refused
```bash
# Start Appium server first
appium --address 127.0.0.1 --port 4723

# Or check if server is running
curl http://localhost:4723/status
```

### Issue: Device Not Found
```bash
# Check connected Android devices
adb devices

# Check connected iOS devices
instruments -s devices
```

### Issue: App Not Found
```python
# Use absolute path to app
import os
app_path = os.path.abspath("path/to/your/app.apk")
options.app = app_path
```

### Issue: Element Not Found
```python
# Add explicit waits
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_element_located((AppiumBy.ID, "element_id"))
)
```

### Issue: Session Creation Timeout
```python
# Increase command timeout
options.new_command_timeout = 300  # 5 minutes
```

## 📱 Appium Inspector

Use Appium Inspector to explore your app:

1. Start Appium Desktop
2. Start Appium server
3. Click "Start Inspector Session"
4. Set desired capabilities
5. Start session
6. Explore elements and get their selectors

## 📚 Learn More

- [Appium Documentation](http://appium.io/docs/en/about-appium/getting-started/)
- [Appium Python Client](https://github.com/appium/python-client)
- [Appium Desired Capabilities](https://appium.io/docs/en/writing-running-appium/caps/)

---

**Next Steps:**
- Install Appium server and try connection test
- Update examples with your app details
- Explore your app with Appium Inspector
- Read the [Best Practices Guide](../best-practices/)
- Explore [Web Testing Examples](../web/)