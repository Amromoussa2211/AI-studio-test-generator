#!/usr/bin/env python3
"""
Basic API Test

A simple example showing how to:
1. Make GET requests
2. Make POST requests
3. Validate responses
4. Handle errors

Run this test:
    python basic_api_test.py
"""

import requests
import json
import time

def test_get_request():
    """Test a simple GET request"""
    print("📡 Testing GET request...")
    
    try:
        # Make GET request
        response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
        
        # Display response info
        print(f"Status Code: {response.status_code}")
        print(f"Content Type: {response.headers.get('content-type', 'Unknown')}")
        print(f"Response Time: {response.elapsed.total_seconds():.3f}s")
        
        # Verify response status
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        # Parse JSON response
        data = response.json()
        print(f"Response Data:")
        print(json.dumps(data, indent=2))
        
        # Verify data structure
        required_fields = ["id", "title", "body", "userId"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        # Verify data types
        assert isinstance(data["id"], int), "ID should be an integer"
        assert isinstance(data["title"], str), "Title should be a string"
        assert isinstance(data["body"], str), "Body should be a string"
        assert isinstance(data["userId"], int), "UserId should be an integer"
        
        print("✅ GET request test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ GET test failed: {e}")
        return False

def test_post_request():
    """Test creating data with POST"""
    print("\n📤 Testing POST request...")
    
    try:
        # Prepare test data
        new_post = {
            "title": "Test Post from Python",
            "body": "This is a test post created by our Python test script",
            "userId": 1
        }
        
        print(f"Sending data: {json.dumps(new_post, indent=2)}")
        
        # Make POST request
        response = requests.post(
            "https://jsonplaceholder.typicode.com/posts",
            json=new_post,
            headers={"Content-Type": "application/json"}
        )
        
        # Display response info
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {response.elapsed.total_seconds():.3f}s")
        
        # Verify response status
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        
        # Parse response
        created_post = response.json()
        print(f"Created Post:")
        print(json.dumps(created_post, indent=2))
        
        # Verify created data
        assert created_post["title"] == new_post["title"]
        assert created_post["body"] == new_post["body"]
        assert created_post["userId"] == new_post["userId"]
        
        # Verify server added ID
        assert "id" in created_post, "Server should assign an ID"
        assert isinstance(created_post["id"], int), "ID should be an integer"
        
        print(f"✅ Created post with ID: {created_post['id']}")
        print("✅ POST request test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ POST test failed: {e}")
        return False

def test_put_request():
    """Test updating data with PUT"""
    print("\n🔄 Testing PUT request...")
    
    try:
        # First, get existing post
        response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
        original_post = response.json()
        print(f"Original post ID: {original_post['id']}")
        
        # Prepare update data
        update_data = {
            "title": "Updated Title",
            "body": "Updated body content",
            "userId": original_post["userId"]
        }
        
        # Make PUT request
        response = requests.put(
            f"https://jsonplaceholder.typicode.com/posts/{original_post['id']}",
            json=update_data
        )
        
        print(f"Status Code: {response.status_code}")
        assert response.status_code == 200
        
        # Verify updated data
        updated_post = response.json()
        assert updated_post["title"] == "Updated Title"
        assert updated_post["body"] == "Updated body content"
        
        print("✅ PUT request test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ PUT test failed: {e}")
        return False

def test_delete_request():
    """Test deleting data with DELETE"""
    print("\n🗑️ Testing DELETE request...")
    
    try:
        # Make DELETE request
        response = requests.delete("https://jsonplaceholder.typicode.com/posts/1")
        
        print(f"Status Code: {response.status_code}")
        
        # Note: jsonplaceholder returns 200 for DELETE (not 204)
        # This is a test API behavior, not typical REST API
        assert response.status_code in [200, 204]
        
        print("✅ DELETE request test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ DELETE test failed: {e}")
        return False

def test_error_handling():
    """Test error handling"""
    print("\n🚫 Testing error handling...")
    
    try:
        # Test 404 Not Found
        response = requests.get("https://jsonplaceholder.typicode.com/posts/99999")
        print(f"404 Test - Status Code: {response.status_code}")
        assert response.status_code == 404
        
        # Test invalid endpoint
        response = requests.get("https://jsonplaceholder.typicode.com/invalid")
        print(f"Invalid Endpoint Test - Status Code: {response.status_code}")
        assert response.status_code == 404
        
        print("✅ Error handling test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def test_response_headers():
    """Test response headers"""
    print("\n📋 Testing response headers...")
    
    try:
        response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
        
        # Check important headers
        content_type = response.headers.get("content-type", "")
        print(f"Content-Type: {content_type}")
        assert "application/json" in content_type
        
        # Check custom headers if any
        server = response.headers.get("server", "Not specified")
        print(f"Server: {server}")
        
        print("✅ Response headers test PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Response headers test failed: {e}")
        return False

def benchmark_api():
    """Benchmark API response time"""
    print("\n⏱️ Benchmarking API performance...")
    
    try:
        iterations = 10
        times = []
        
        for i in range(iterations):
            start_time = time.time()
            response = requests.get("https://jsonplaceholder.typicode.com/posts/1")
            end_time = time.time()
            
            response_time = end_time - start_time
            times.append(response_time)
            
            assert response.status_code == 200
        
        # Calculate statistics
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"Performed {iterations} requests")
        print(f"Average response time: {avg_time:.3f}s")
        print(f"Minimum response time: {min_time:.3f}s")
        print(f"Maximum response time: {max_time:.3f}s")
        
        # Assert reasonable response time (under 5 seconds)
        assert avg_time < 5.0, f"Average response time too slow: {avg_time:.3f}s"
        
        print("✅ Performance benchmark PASSED!")
        return True
        
    except Exception as e:
        print(f"❌ Performance benchmark failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 Running Basic API Tests")
    print("=" * 60)
    
    tests = [
        test_get_request,
        test_post_request,
        test_put_request,
        test_delete_request,
        test_error_handling,
        test_response_headers,
        benchmark_api
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            result = test()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ {test.__name__} crashed: {e}")
            failed += 1
        
        print("-" * 40)
    
    print(f"\n📊 Test Results:")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
    
    if failed == 0:
        print("\n🎉 All API tests PASSED!")
        print("=" * 60)
    else:
        print(f"\n❌ {failed} tests FAILED!")
        print("=" * 60)
        exit(1)
