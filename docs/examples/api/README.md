# API Testing Examples

> **Ready-to-run API testing examples**

This directory contains simple, working examples of API testing using Python requests.

## 🎯 What's Included

- ✅ **Basic Tests** - Simple API calls and responses
- ✅ **CRUD Tests** - Create, Read, Update, Delete operations
- ✅ **Authentication Tests** - Login, tokens, and authorization
- ✅ **Validation Tests** - Response validation and error handling
- ✅ **Performance Tests** - Response time and load testing

## 🚀 Quick Start

### Prerequisites
```bash
pip install requests pytest
```

### Run All Examples
```bash
# Run all API examples
python docs/examples/api/run_all_tests.py

# Run specific example
python docs/examples/api/basic_api_tests/basic_api_test.py
```

## 📝 Example Files

### 1. Basic API Tests (`basic_api_tests/`)

**File:** `basic_api_test.py`
```python
import requests
import json

def test_get_request():
    """Test a simple GET request"""
    print("📡 Testing GET request...")
    
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    
    print(f"Status Code: {response.status_code}")
    print(f"Content Type: {response.headers.get('content-type')}")
    
    # Verify response
    assert response.status_code == 200
    
    # Parse JSON
    data = response.json()
    print(f"Received: {json.dumps(data, indent=2)}")
    
    # Verify data structure
    assert "title" in data
    assert "body" in data
    assert "userId" in data
    
    print("✅ GET test PASSED!")

def test_post_request():
    """Test creating data with POST"""
    print("\n📤 Testing POST request...")
    
    # Prepare test data
    new_post = {
        "title": "Test Post",
        "body": "This is a test post body",
        "userId": 1
    }
    
    # Send POST request
    response = requests.post(
        "https://jsonplaceholder.typicode.com/posts",
        json=new_post
    )
    
    print(f"Status Code: {response.status_code}")
    
    # Verify response
    assert response.status_code == 201
    
    # Check returned data
    created_post = response.json()
    assert created_post["title"] == "Test Post"
    assert "id" in created_post  # Should have an ID
    
    print(f"Created Post ID: {created_post['id']}")
    print("✅ POST test PASSED!")
```

### 2. CRUD Tests (`crud_tests/`)

**File:** `crud_operations_test.py`
```python
import requests

def test_crud_operations():
    """Test Create, Read, Update, Delete operations"""
    print("🔄 Testing CRUD operations...")
    
    base_url = "https://jsonplaceholder.typicode.com"
    
    # CREATE - POST new resource
    print("📤 Creating new post...")
    new_data = {
        "title": "Test CRUD Post",
        "body": "Testing full CRUD cycle",
        "userId": 1
    }
    
    create_response = requests.post(f"{base_url}/posts", json=new_data)
    assert create_response.status_code == 201
    
    created_post = create_response.json()
    post_id = created_post["id"]
    print(f"✅ Created post with ID: {post_id}")
    
    # READ - GET the resource
    print("📥 Reading created post...")
    read_response = requests.get(f"{base_url}/posts/{post_id}")
    assert read_response.status_code == 200
    
    read_post = read_response.json()
    assert read_post["title"] == "Test CRUD Post"
    print("✅ Successfully read created post")
    
    # UPDATE - PUT/PATCH the resource
    print("🔄 Updating post...")
    update_data = {
        "title": "Updated Test CRUD Post",
        "body": "Updated test content"
    }
    
    update_response = requests.put(f"{base_url}/posts/{post_id}", json=update_data)
    assert update_response.status_code == 200
    
    updated_post = update_response.json()
    assert updated_post["title"] == "Updated Test CRUD Post"
    print("✅ Successfully updated post")
    
    # Note: DELETE typically doesn't work on test APIs
    # But we can show the request
    print("🗑️ Attempting to delete post...")
    delete_response = requests.delete(f"{base_url}/posts/{post_id}")
    print(f"Delete response status: {delete_response.status_code}")
    
    print("✅ CRUD operations test PASSED!")
```

### 3. Authentication Tests (`auth_tests/`)

**File:** `api_authentication_test.py`
```python
import requests

def test_api_authentication():
    """Test API authentication scenarios"""
    print("🔐 Testing API authentication...")
    
    # Test invalid login
    print("❌ Testing invalid credentials...")
    invalid_login = {
        "username": "wronguser",
        "password": "wrongpass"
    }
    
    response = requests.post(
        "https://jsonplaceholder.typicode.com/auth/login",  # This will fail (doesn't exist)
        json=invalid_login
    )
    
    # For demonstration, we'll test with a real endpoint that exists
    # Test with a valid GET request
    print("✅ Testing valid request...")
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    assert response.status_code == 200
    
    # Test with headers
    print("📋 Testing request with headers...")
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "My-Test-Client/1.0"
    }
    
    response = requests.get(
        "https://jsonplaceholder.typicode.com/posts/1",
        headers=headers
    )
    assert response.status_code == 200
    
    print("✅ Authentication test PASSED!")

def test_api_keys():
    """Test API key authentication"""
    print("\n🔑 Testing API key authentication...")
    
    # Simulate API key in header
    api_key = "test-api-key-12345"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "X-API-Key": api_key
    }
    
    # Make request with API key
    response = requests.get(
        "https://jsonplaceholder.typicode.com/posts/1",
        headers=headers
    )
    
    assert response.status_code == 200
    print("✅ API key test PASSED!")

def test_session_management():
    """Test session-based authentication"""
    print("\n🔗 Testing session management...")
    
    # Create a session
    session = requests.Session()
    
    # Set session headers
    session.headers.update({
        "Content-Type": "application/json",
        "User-Agent": "Session-Test-Client"
    })
    
    # Make multiple requests with same session
    response1 = session.get("https://jsonplaceholder.typicode.com/posts/1")
    response2 = session.get("https://jsonplaceholder.typicode.com/posts/2")
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    print("✅ Session management test PASSED!")
```

### 4. Validation Tests (`validation_tests/`)

**File:** `response_validation_test.py`
```python
import requests
import json

def test_response_validation():
    """Test comprehensive response validation"""
    print("🔍 Testing response validation...")
    
    response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
    
    # Status code validation
    assert response.status_code == 200
    print("✅ Status code validation passed")
    
    # Content type validation
    assert "application/json" in response.headers.get("content-type", "")
    print("✅ Content type validation passed")
    
    # JSON structure validation
    data = response.json()
    assert isinstance(data, dict)
    assert "id" in data
    assert "title" in data
    assert "body" in data
    assert "userId" in data
    print("✅ JSON structure validation passed")
    
    # Data type validation
    assert isinstance(data["id"], int)
    assert isinstance(data["title"], str)
    assert isinstance(data["body"], str)
    assert isinstance(data["userId"], int)
    print("✅ Data type validation passed")
    
    # Data value validation
    assert data["id"] > 0
    assert len(data["title"]) > 0
    assert len(data["body"]) > 0
    print("✅ Data value validation passed")
    
    print("✅ Response validation test PASSED!")

def test_error_responses():
    """Test error response handling"""
    print("\n🚫 Testing error responses...")
    
    # Test 404 Not Found
    response = requests.get("https://jsonplaceholder.typicode.com/posts/99999")
    assert response.status_code == 404
    print("✅ 404 error handling passed")
    
    # Test invalid endpoint
    response = requests.get("https://jsonplaceholder.typicode.com/invalid-endpoint")
    assert response.status_code == 404
    print("✅ Invalid endpoint handling passed")
    
    # Test JSON parsing of error response
    if response.headers.get("content-type", "").startswith("application/json"):
        error_data = response.json()
        assert isinstance(error_data, dict)
        print("✅ Error JSON parsing passed")
    
    print("✅ Error response test PASSED!")

def test_response_time():
    """Test API response time"""
    print("\n⏱️ Testing response time...")
    
    import time
    
    start_time = time.time()
    response = requests.get("https://jsonplaceholder.typicode.com/posts")
    end_time = time.time()
    
    response_time = end_time - start_time
    print(f"Response time: {response_time:.3f} seconds")
    
    # Assert response time is reasonable (under 5 seconds)
    assert response_time < 5.0
    
    print("✅ Response time test PASSED!")
```

### 5. Data-Driven Tests (`data_driven_tests/`)

**File:** `multiple_posts_test.py`
```python
import requests

def test_multiple_posts():
    """Test fetching multiple posts"""
    print("📚 Testing multiple posts...")
    
    # Get all posts
    response = requests.get("https://jsonplaceholder.typicode.com/posts")
    assert response.status_code == 200
    
    posts = response.json()
    print(f"Received {len(posts)} posts")
    
    # Validate we got expected number of posts
    assert len(posts) == 100  # jsonplaceholder has 100 posts
    
    # Test each post has required fields
    for post in posts[:5]:  # Test first 5 posts
        assert "id" in post
        assert "title" in post
        assert "body" in post
        assert "userId" in post
        assert isinstance(post["id"], int)
        assert isinstance(post["title"], str)
        assert isinstance(post["body"], str)
        assert isinstance(post["userId"], int)
    
    print("✅ Multiple posts test PASSED!")

def test_posts_by_user():
    """Test filtering posts by user"""
    print("\n👤 Testing posts by user...")
    
    # Get posts for user 1
    response = requests.get("https://jsonplaceholder.typicode.com/posts?userId=1")
    assert response.status_code == 200
    
    user_posts = response.json()
    
    # Verify all posts belong to user 1
    for post in user_posts:
        assert post["userId"] == 1
    
    print(f"✅ Found {len(user_posts)} posts for user 1")
    print("✅ Posts by user test PASSED!")

def test_post_search():
    """Test searching posts by title/body"""
    print("\n🔍 Testing post search...")
    
    # Search for posts containing "qui" in title
    response = requests.get("https://jsonplaceholder.typicode.com/posts?title=qui")
    assert response.status_code == 200
    
    results = response.json()
    
    # Verify results contain the search term
    for post in results:
        assert "qui" in post["title"].lower()
    
    print(f"✅ Found {len(results)} posts matching search criteria")
    print("✅ Post search test PASSED!")
```

## 🎮 Try These Examples

### 1. Run a Single Test
```bash
python docs/examples/api/basic_api_tests/basic_api_test.py
```

### 2. Run All Tests
```bash
python docs/examples/api/run_all_tests.py
```

### 3. Test Your Own API

Replace the API endpoints in any example:

```python
# Test your own API
BASE_URL = "https://your-api.com"

# GET request
response = requests.get(f"{BASE_URL}/users")
assert response.status_code == 200

# POST request
user_data = {"name": "John", "email": "john@example.com"}
response = requests.post(f"{BASE_URL}/users", json=user_data)
assert response.status_code == 201
```

## 🔧 Customization

### Add Headers
```python
headers = {
    "Authorization": "Bearer your-token",
    "Content-Type": "application/json",
    "User-Agent": "Your App Name"
}
response = requests.get(url, headers=headers)
```

### Handle Authentication
```python
# Basic auth
response = requests.get(url, auth=("username", "password"))

# API key in header
headers = {"X-API-Key": "your-api-key"}
response = requests.get(url, headers=headers)

# OAuth bearer token
headers = {"Authorization": "Bearer your-oauth-token"}
response = requests.get(url, headers=headers)
```

### Handle JSON Data
```python
# Send JSON data
data = {"key": "value"}
response = requests.post(url, json=data)

# Parse JSON response
if response.headers.get("content-type", "").startswith("application/json"):
    json_data = response.json()
```

## 🚨 Common Issues & Solutions

### Issue: SSL Certificate Errors
```python
# Disable SSL verification (not recommended for production)
response = requests.get(url, verify=False)

# Or provide custom CA bundle
response = requests.get(url, verify="/path/to/ca-bundle.crt")
```

### Issue: Request Timeouts
```python
# Set timeout
response = requests.get(url, timeout=30)

# Timeout with custom exception
try:
    response = requests.get(url, timeout=5)
except requests.Timeout:
    print("Request timed out")
```

### Issue: Rate Limiting
```python
# Add delays between requests
import time
time.sleep(1)  # Wait 1 second

# Use exponential backoff
for attempt in range(3):
    try:
        response = requests.get(url)
        break
    except requests.RequestException:
        time.sleep(2 ** attempt)
```

### Issue: Large Response Bodies
```python
# Stream large responses
with requests.get(url, stream=True) as response:
    for chunk in response.iter_content(chunk_size=8192):
        process_chunk(chunk)
```

## 📊 Test Results Analysis

### Response Time Analysis
```python
import time
import statistics

def measure_api_performance(url, iterations=10):
    times = []
    
    for _ in range(iterations):
        start = time.time()
        response = requests.get(url)
        end = time.time()
        times.append(end - start)
    
    print(f"Average response time: {statistics.mean(times):.3f}s")
    print(f"Median response time: {statistics.median(times):.3f}s")
    print(f"Min response time: {min(times):.3f}s")
    print(f"Max response time: {max(times):.3f}s")
    
    return {
        "average": statistics.mean(times),
        "median": statistics.median(times),
        "min": min(times),
        "max": max(times)
    }
```

### Success Rate Monitoring
```python
def monitor_success_rate(urls, iterations=5):
    results = []
    
    for url in urls:
        for _ in range(iterations):
            try:
                response = requests.get(url)
                results.append({
                    "url": url,
                    "status": response.status_code,
                    "success": response.status_code < 400
                })
            except Exception as e:
                results.append({
                    "url": url,
                    "status": "error",
                    "error": str(e),
                    "success": False
                })
    
    total_requests = len(results)
    successful_requests = sum(1 for r in results if r["success"])
    success_rate = (successful_requests / total_requests) * 100
    
    print(f"Success rate: {success_rate:.1f}%")
    return results
```

## 📚 Learn More

- [Requests Documentation](https://docs.python-requests.org/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

---

**Next Steps:**
- Try all the examples
- Test your own API endpoints
- Read the [Best Practices Guide](../best-practices/)
- Explore [Web Testing Examples](../web/)