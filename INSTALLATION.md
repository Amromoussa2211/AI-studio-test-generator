# Installation Guide

> **Get your testing environment set up in under 5 minutes**

## 📋 Prerequisites

### Required Software
- **Python 3.7 or higher** - [Download Python](https://python.org/downloads/)
- **Git** (optional, for cloning)

### Check Your Setup
```bash
# Check Python version (should be 3.7+)
python --version
# or
python3 --version

# Check pip is available
pip --version
# or
pip3 --version
```

## 🎯 Choose Your Testing Path

Select the testing types you want to use:

| Testing Type | Install Time | Best For |
|--------------|--------------|----------|
| **Web Testing** | 2 minutes | Websites, web apps |
| **API Testing** | 1 minute | REST APIs, web services |
| **Mobile Testing** | 10 minutes | Android/iOS apps |
| **All Types** | 15 minutes | Complete testing suite |

## 🌐 Web Testing Setup

### 1. Install Dependencies

**Option A: Quick Install (Recommended)**
```bash
pip install selenium webdriver-manager
```

**Option B: Detailed Install**
```bash
# Install Selenium for browser automation
pip install selenium

# Install WebDriver Manager (handles browser drivers automatically)
pip install webdriver-manager

# Optional: Install Playwright (alternative to Selenium)
pip install playwright
```

### 2. Install Browsers

**Chrome (Most Popular)**
- Download [Chrome](https://google.com/chrome)
- No additional setup needed

**Firefox (Alternative)**
- Download [Firefox](https://firefox.com)
- No additional setup needed

### 3. Test Your Setup

Create `test_web_setup.py`:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

def test_web_setup():
    # Setup Chrome driver with automatic management
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    try:
        # Test basic functionality
        driver.get("https://example.com")
        print(f"✅ Web testing setup successful!")
        print(f"📄 Page title: {driver.title}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_web_setup()
```

Run it:
```bash
python test_web_setup.py
```

**Expected Output:**
```
✅ Web testing setup successful!
📄 Page title: Example Domain
```

## 📡 API Testing Setup

### 1. Install Dependencies

```bash
# Install requests for HTTP operations
pip install requests

# Install testing framework
pip install pytest

# Optional: Install additional validation libraries
pip install jsonschema cerberus
```

### 2. Test Your Setup

Create `test_api_setup.py`:

```python
import requests
import json

def test_api_setup():
    # Test with a public API
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    
    print(f"✅ API testing setup successful!")
    print(f"📡 Status Code: {response.status_code}")
    print(f"📄 Response Type: {response.headers['content-type']}")
    
    # Verify we got valid JSON
    data = response.json()
    print(f"📋 Data Keys: {list(data.keys())}")

if __name__ == "__main__":
    test_api_setup()
```

Run it:
```bash
python test_api_setup.py
```

**Expected Output:**
```
✅ API testing setup successful!
📡 Status Code: 200
📄 Response Type: application/json; charset=utf-8
📋 Data Keys: ['userId', 'id', 'title', 'body']
```

## 📱 Mobile Testing Setup

### 1. Install Dependencies

```bash
# Install Appium Python client
pip install Appium-Python-Client

# Install additional mobile testing utilities
pip install selenium
```

### 2. Install Appium Server

**Option A: Install Node.js and Appium (Recommended)**
```bash
# Install Node.js from https://nodejs.org/
# Then install Appium
npm install -g appium

# Verify installation
appium --version
```

**Option B: Use Appium Desktop (GUI)**
1. Download [Appium Desktop](https://github.com/appium/appium-desktop)
2. Install and launch the application
3. Start the Appium server

### 3. Install Platform Tools

**For Android Testing:**
```bash
# Install Android SDK tools
# Download Android Studio or just the SDK tools
# Add ANDROID_HOME environment variable

# Verify Android tools
adb --version
```

**For iOS Testing (macOS only):**
```bash
# Install Xcode from App Store
# Install iOS development tools
xcode-select --install
```

### 4. Test Your Setup

Create `test_mobile_setup.py`:

```python
from appium import webdriver
from appium.options.android import UiAutomator2Options

def test_mobile_setup():
    # Configure Android options
    options = UiAutomator2Options()
    options.platform_name = "Android"
    options.device_name = "Android Emulator"
    
    try:
        # Try to connect to Appium server
        driver = webdriver.Remote("http://localhost:4723", options=options)
        print("✅ Mobile testing setup successful!")
        print(f"📱 Platform: {driver.platform_name}")
        print(f"🔧 Session ID: {driver.session_id}")
        
    except Exception as e:
        print(f"⚠️  Mobile setup issue (this is normal if no device is connected):")
        print(f"   Error: {str(e)}")
        print(f"💡 Make sure:")
        print(f"   1. Appium server is running (appium &)")
        print(f"   2. Android emulator is started")
        print(f"   3. USB debugging is enabled (for real devices)")
        
    finally:
        try:
            driver.quit()
        except:
            pass

if __name__ == "__main__":
    test_mobile_setup()
```

Run it:
```bash
python test_mobile_setup.py
```

## 📊 Complete Installation (All Testing Types)

### 1. Install All Dependencies

```bash
# Core testing libraries
pip install selenium webdriver-manager requests pytest

# Mobile testing
pip install Appium-Python-Client

# Data handling
pip install pandas openpyxl

# Additional utilities
pip install jsonschema faker

# Optional: Playwright for modern web testing
pip install playwright
```

### 2. Verify Complete Setup

Create `test_all_setup.py`:

```python
def test_complete_setup():
    print("🔍 Testing all components...")
    
    # Test web testing
    try:
        from selenium import webdriver
        from webdriver_manager.chrome import ChromeDriverManager
        print("✅ Web testing: OK")
    except ImportError:
        print("❌ Web testing: Missing dependencies")
    
    # Test API testing
    try:
        import requests
        import pytest
        print("✅ API testing: OK")
    except ImportError:
        print("❌ API testing: Missing dependencies")
    
    # Test mobile testing
    try:
        from appium import webdriver
        print("✅ Mobile testing: OK")
    except ImportError:
        print("❌ Mobile testing: Missing dependencies")
    
    # Test data handling
    try:
        import pandas
        from faker import Faker
        print("✅ Data handling: OK")
    except ImportError:
        print("❌ Data handling: Missing dependencies")
    
    print("\n🎉 Setup verification complete!")

if __name__ == "__main__":
    test_complete_setup()
```

Run it:
```bash
python test_all_setup.py
```

## 🐍 Virtual Environment Setup (Recommended)

### Why Use Virtual Environment?
- Isolates your testing dependencies
- Prevents conflicts with other projects
- Keeps your system Python clean

### 1. Create Virtual Environment

```bash
# Create virtual environment
python -m venv testing_env

# Activate virtual environment
# On Windows:
testing_env\Scripts\activate

# On macOS/Linux:
source testing_env/bin/activate
```

### 2. Install Dependencies in Virtual Environment

```bash
# Install all testing dependencies
pip install selenium webdriver-manager requests pytest

# Verify installation
pip list
```

### 3. Save Dependencies for Later

```bash
# Save your setup
pip freeze > requirements.txt

# Later, restore environment
pip install -r requirements.txt
```

## 🔧 Environment Configuration

### Windows Setup

**Add to Environment Variables:**
```bash
# Create .env file in your project
PYTHONPATH=C:\Python39;C:\Python39\Scripts
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

### macOS Setup

**Add to ~/.bash_profile or ~/.zshrc:**
```bash
export ANDROID_HOME=/Users/yourname/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Linux Setup

**Add to ~/.bashrc:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## 🆘 Common Installation Issues

### Issue 1: Python Not Found

**Problem:** `'python' is not recognized as an internal or external command`

**Solution:**
```bash
# Try python3 instead of python
python3 --version

# Or create an alias
alias python=python3
```

### Issue 2: Pip Not Found

**Problem:** `'pip' is not recognized as an internal or external command`

**Solution:**
```bash
# Try pip3 instead of pip
pip3 install selenium

# Or use python -m pip
python -m pip install selenium
```

### Issue 3: ChromeDriver Issues

**Problem:** WebDriver executable needs to be in PATH

**Solution:**
```python
# Use WebDriver Manager (automatic)
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
```

### Issue 4: Permission Errors

**Problem:** Permission denied when installing packages

**Solution:**
```bash
# Use user installation
pip install --user selenium

# Or use virtual environment (recommended)
python -m venv myenv
source myenv/bin/activate
pip install selenium
```

### Issue 5: Appium Connection Failed

**Problem:** `Connection refused` when connecting to Appium

**Solution:**
```bash
# Start Appium server
appium --address 127.0.0.1 --port 4723

# Or use Appium Desktop to start the server
```

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] Python 3.7+ installed
- [ ] pip available and working
- [ ] Web testing: Basic Selenium test runs
- [ ] API testing: Basic requests test runs
- [ ] Mobile testing: Appium server connects (optional)
- [ ] Virtual environment created (optional but recommended)

## 🎯 Next Steps

After successful installation:

1. **Web Testing:** Try [Web Testing Examples](docs/examples/web/)
2. **API Testing:** Try [API Testing Examples](docs/examples/api/)
3. **Mobile Testing:** Try [Mobile Testing Examples](docs/examples/mobile/)
4. **Complete Guide:** Read [Quick Start Guide](QUICKSTART.md)

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting Guide](docs/troubleshooting/)
2. Verify your Python version: `python --version`
3. Ensure pip is updated: `pip install --upgrade pip`
4. Try creating a fresh virtual environment

---

**Installation Complete!** 🎉

You now have a fully configured testing environment. Choose your testing type and start writing tests!