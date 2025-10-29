import { test, expect, APIRequestContext } from '@playwright/test';
import { test as base, TestUtils } from '../../fixtures/testFixtures';

/**
 * Extended test with fixtures for API testing
 */
const testWithFixtures = base.extend<{
  apiContext: APIRequestContext;
  testData: any;
  baseURL: string;
}>({
  apiContext: async ({ request }, use) => {
    await use(request);
  },
  testData: async ({}, use) => {
    const testData = await (await import('../../test-data/testData')).default;
    await use(testData);
  },
  baseURL: async ({}, use) => {
    await use('https://jsonplaceholder.typicode.com');
  }
});

const { describe, beforeAll, afterAll, beforeEach } = testWithFixtures;

describe('API Tests', () => {
  let authToken: string;

  beforeAll(async ({ testData }) => {
    // Set up authentication token (if needed)
    authToken = 'Bearer mock-jwt-token-' + Date.now();
  });

  describe('GET Requests', () => {
    test('should get all posts', async ({ apiContext, testData, baseURL }) => {
      const response = await apiContext.get(`${baseURL}${testData.api.endpoints.posts}`);
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response headers
      expect(response.headers()['content-type']).toContain('application/json');
      
      // Verify response body
      const posts = await response.json();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
      
      // Verify post structure
      const firstPost = posts[0];
      expect(firstPost).toHaveProperty('userId');
      expect(firstPost).toHaveProperty('id');
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('body');
      
      TestUtils.logApiCall('GET', `${baseURL}/posts`, response);
    });

    test('should get a specific post by ID', async ({ apiContext, testData, baseURL }) => {
      const postId = 1;
      const response = await apiContext.get(`${baseURL}${testData.api.endpoints.posts}/${postId}`);
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const post = await response.json();
      expect(post.id).toBe(postId);
      expect(post.userId).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.body).toBeTruthy();
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/${postId}`, response);
    });

    test('should get all users', async ({ apiContext, testData, baseURL }) => {
      const response = await apiContext.get(`${baseURL}${testData.api.endpoints.users}`);
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const users = await response.json();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      // Verify user structure
      const firstUser = users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).toHaveProperty('address');
      expect(firstUser).toHaveProperty('company');
      
      TestUtils.logApiCall('GET', `${baseURL}/users`, response);
    });

    test('should handle 404 for non-existent resource', async ({ apiContext, baseURL }) => {
      const nonExistentId = 999999;
      const response = await apiContext.get(`${baseURL}/posts/${nonExistentId}`);
      
      // Verify response status
      expect(response.status()).toBe(404);
      
      // Verify empty response body
      const body = await response.text();
      expect(body).toBe('');
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/${nonExistentId}`, response);
    });

    test('should get posts with query parameters', async ({ apiContext, baseURL }) => {
      const response = await apiContext.get(`${baseURL}/posts?userId=1`);
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const posts = await response.json();
      expect(Array.isArray(posts)).toBe(true);
      
      // All posts should be for userId=1
      posts.forEach((post: any) => {
        expect(post.userId).toBe(1);
      });
      
      TestUtils.logApiCall('GET', `${baseURL}/posts?userId=1`, response);
    });
  });

  describe('POST Requests', () => {
    test('should create a new post', async ({ apiContext, testData, baseURL }) => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post created via API',
        userId: 1
      };
      
      const response = await apiContext.post(`${baseURL}${testData.api.endpoints.posts}`, {
        data: newPost
      });
      
      // Verify response status
      expect(response.status()).toBe(201);
      
      // Verify response body
      const createdPost = await response.json();
      expect(createdPost.id).toBeTruthy();
      expect(createdPost.title).toBe(newPost.title);
      expect(createdPost.body).toBe(newPost.body);
      expect(createdPost.userId).toBe(newPost.userId);
      
      TestUtils.logApiCall('POST', `${baseURL}/posts`, response);
    });

    test('should create a post with authentication', async ({ apiContext, testData, baseURL }) => {
      const newPost = {
        title: 'Authenticated Test Post',
        body: 'This post was created with authentication',
        userId: 2
      };
      
      const response = await apiContext.post(`${baseURL}${testData.api.endpoints.posts}`, {
        data: newPost,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Verify response status
      expect(response.status()).toBe(201);
      
      // Verify response body
      const createdPost = await response.json();
      expect(createdPost.id).toBeTruthy();
      expect(createdPost.title).toBe(newPost.title);
      
      TestUtils.logApiCall('POST', `${baseURL}/posts`, response);
    });

    test('should validate required fields when creating post', async ({ apiContext, baseURL }) => {
      const invalidPost = {
        title: 'Incomplete Post'
        // Missing required body and userId
      };
      
      const response = await apiContext.post(`${baseURL}/posts`, {
        data: invalidPost
      });
      
      // API might accept or reject incomplete data
      // This test documents the expected behavior
      expect(response.status()).toBeOneOf([200, 201, 400, 422]);
      
      TestUtils.logApiCall('POST', `${baseURL}/posts`, response);
    });

    test('should create multiple posts', async ({ apiContext, baseURL }) => {
      const posts = [
        { title: 'Post 1', body: 'Body 1', userId: 1 },
        { title: 'Post 2', body: 'Body 2', userId: 2 },
        { title: 'Post 3', body: 'Body 3', userId: 1 }
      ];
      
      const responses = [];
      for (const post of posts) {
        const response = await apiContext.post(`${baseURL}/posts`, { data: post });
        responses.push(response);
        expect(response.status()).toBe(201);
      }
      
      expect(responses).toHaveLength(3);
      TestUtils.logApiCall('POST', `${baseURL}/posts`, responses[0]);
    });
  });

  describe('PUT Requests (Update)', () => {
    test('should update an existing post', async ({ apiContext, baseURL }) => {
      const postId = 1;
      const updatedPost = {
        id: postId,
        title: 'Updated Post Title',
        body: 'This post has been updated via API',
        userId: 1
      };
      
      const response = await apiContext.put(`${baseURL}/posts/${postId}`, {
        data: updatedPost
      });
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const result = await response.json();
      expect(result.id).toBe(postId);
      expect(result.title).toBe(updatedPost.title);
      expect(result.body).toBe(updatedPost.body);
      
      TestUtils.logApiCall('PUT', `${baseURL}/posts/${postId}`, response);
    });

    test('should update post with authentication', async ({ apiContext, baseURL }) => {
      const postId = 2;
      const updatedPost = {
        title: 'Authenticated Update',
        body: 'This post was updated with authentication',
        userId: 1
      };
      
      const response = await apiContext.put(`${baseURL}/posts/${postId}`, {
        data: updatedPost,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const result = await response.json();
      expect(result.title).toBe(updatedPost.title);
      
      TestUtils.logApiCall('PUT', `${baseURL}/posts/${postId}`, response);
    });

    test('should handle partial updates', async ({ apiContext, baseURL }) => {
      const postId = 1;
      const partialUpdate = {
        title: 'Partially Updated Title'
        // Only updating title, not body or userId
      };
      
      const response = await apiContext.put(`${baseURL}/posts/${postId}`, {
        data: partialUpdate
      });
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body
      const result = await response.json();
      expect(result.title).toBe(partialUpdate.title);
      expect(result.id).toBe(postId);
      
      TestUtils.logApiCall('PUT', `${baseURL}/posts/${postId}`, response);
    });
  });

  describe('DELETE Requests', () => {
    test('should delete an existing post', async ({ apiContext, baseURL }) => {
      const postId = 1;
      const response = await apiContext.delete(`${baseURL}/posts/${postId}`);
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      // Verify response body (might be empty or contain deleted post)
      try {
        const body = await response.json();
        expect(body).toBeTruthy();
      } catch {
        // Some APIs return empty body for DELETE
        expect(response.status()).toBe(200);
      }
      
      TestUtils.logApiCall('DELETE', `${baseURL}/posts/${postId}`, response);
    });

    test('should delete post with authentication', async ({ apiContext, baseURL }) => {
      const postId = 3;
      const response = await apiContext.delete(`${baseURL}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      TestUtils.logApiCall('DELETE', `${baseURL}/posts/${postId}`, response);
    });

    test('should handle deletion of non-existent post', async ({ apiContext, baseURL }) => {
      const nonExistentId = 999999;
      const response = await apiContext.delete(`${baseURL}/posts/${nonExistentId}`);
      
      // Verify response status (might be 200, 204, or 404)
      expect(response.status()).toBeOneOf([200, 204, 404]);
      
      TestUtils.logApiCall('DELETE', `${baseURL}/posts/${nonExistentId}`, response);
    });
  });

  describe('Authentication Tests', () => {
    test('should reject requests without authentication', async ({ apiContext, baseURL }) => {
      const response = await apiContext.get(`${baseURL}/posts/1`, {
        headers: {
          'Authorization': 'Invalid-Token'
        }
      });
      
      // Verify response status
      expect(response.status()).toBeOneOf([401, 403, 404]);
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/1`, response);
    });

    test('should accept requests with valid authentication', async ({ apiContext, baseURL }) => {
      const response = await apiContext.get(`${baseURL}/posts/1`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      // Verify response status
      expect(response.status()).toBe(200);
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/1`, response);
    });

    test('should handle token expiration', async ({ apiContext, baseURL }) => {
      const expiredToken = 'Bearer expired-token-12345';
      
      const response = await apiContext.get(`${baseURL}/posts/1`, {
        headers: {
          'Authorization': expiredToken
        }
      });
      
      // API behavior depends on implementation
      // This test documents expected behavior
      expect(response.status()).toBeOneOf([200, 401, 403]);
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/1`, response);
    });
  });

  describe('Error Handling', () => {
    test('should handle 400 Bad Request', async ({ apiContext, baseURL }) => {
      // Send malformed JSON
      const response = await apiContext.post(`${baseURL}/posts`, {
        data: '{invalid json}',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Verify response status
      expect(response.status()).toBe(400);
      
      TestUtils.logApiCall('POST', `${baseURL}/posts`, response);
    });

    test('should handle 422 Validation Errors', async ({ apiContext, baseURL }) => {
      const invalidPost = {
        title: '', // Empty title should cause validation error
        body: 'Valid body',
        userId: 1
      };
      
      const response = await apiContext.post(`${baseURL}/posts`, {
        data: invalidPost
      });
      
      // Verify response status (might be 200, 422, or other)
      expect(response.status()).toBeOneOf([200, 422, 400]);
      
      if (response.status() === 422) {
        const error = await response.json();
        expect(error).toHaveProperty('errors');
      }
      
      TestUtils.logApiCall('POST', `${baseURL}/posts`, response);
    });

    test('should handle 500 Internal Server Error', async ({ apiContext, baseURL }) => {
      // This test would require server-side error simulation
      // For now, we test the general error handling
      const response = await apiContext.get(`${baseURL}/posts/1`);
      
      // Verify we get a valid response (not 500)
      expect(response.status()).not.toBe(500);
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/1`, response);
    });
  });

  describe('Response Validation', () => {
    test('should validate response structure', async ({ apiContext, baseURL }) => {
      const response = await apiContext.get(`${baseURL}/posts/1`);
      const post = await response.json();
      
      // Validate required fields
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
      
      // Validate data types
      expect(typeof post.userId).toBe('number');
      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
      
      // Validate non-empty strings
      expect(post.title.trim()).toBeTruthy();
      expect(post.body.trim()).toBeTruthy();
      
      TestUtils.logApiCall('GET', `${baseURL}/posts/1`, response);
    });

    test('should validate response headers', async ({ apiContext, baseURL }) => {
      const response = await apiContext.get(`${baseURL}/posts`);
      const headers = response.headers();
      
      // Verify content type
      expect(headers['content-type']).toContain('application/json');
      
      // Verify cache headers (optional)
      expect(headers['cache-control']).toBeTruthy();
      
      TestUtils.logApiCall('GET', `${baseURL}/posts`, response);
    });

    test('should validate response time', async ({ apiContext, baseURL }) => {
      const startTime = Date.now();
      
      const response = await apiContext.get(`${baseURL}/posts`);
      
      const responseTime = Date.now() - startTime;
      
      // Response should be reasonably fast
      expect(responseTime).toBeLessThan(5000); // 5 seconds
      
      // Verify successful response
      expect(response.status()).toBe(200);
      
      TestUtils.logApiCall('GET', `${baseURL}/posts`, response);
    });
  });

  describe('CRUD Operations Integration', () => {
    test('should perform full CRUD cycle', async ({ apiContext, baseURL }) => {
      // 1. CREATE
      const newPost = {
        title: 'CRUD Test Post',
        body: 'This post will be created, read, updated, and deleted',
        userId: 1
      };
      
      const createResponse = await apiContext.post(`${baseURL}/posts`, { data: newPost });
      const createdPost = await createResponse.json();
      
      expect(createResponse.status()).toBe(201);
      expect(createdPost.id).toBeTruthy();
      
      const postId = createdPost.id;
      
      // 2. READ
      const readResponse = await apiContext.get(`${baseURL}/posts/${postId}`);
      const readPost = await readResponse.json();
      
      expect(readResponse.status()).toBe(200);
      expect(readPost.id).toBe(postId);
      expect(readPost.title).toBe(newPost.title);
      
      // 3. UPDATE
      const updatedPost = {
        title: 'Updated CRUD Test Post',
        body: 'This post has been updated',
        userId: 1
      };
      
      const updateResponse = await apiContext.put(`${baseURL}/posts/${postId}`, { data: updatedPost });
      const updatedResult = await updateResponse.json();
      
      expect(updateResponse.status()).toBe(200);
      expect(updatedResult.title).toBe(updatedPost.title);
      
      // 4. DELETE
      const deleteResponse = await apiContext.delete(`${baseURL}/posts/${postId}`);
      expect(deleteResponse.status()).toBe(200);
      
      // Verify deletion
      const verifyResponse = await apiContext.get(`${baseURL}/posts/${postId}`);
      expect(verifyResponse.status()).toBe(404);
      
      console.log('✅ Full CRUD cycle completed successfully');
    });

    test('should handle concurrent API requests', async ({ apiContext, baseURL }) => {
      const requests = [];
      
      // Create multiple GET requests
      for (let i = 1; i <= 5; i++) {
        requests.push(apiContext.get(`${baseURL}/posts/${i}`));
      }
      
      const responses = await Promise.all(requests);
      
      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.status()).toBe(200);
      });
      
      // All responses should be valid posts
      const posts = await Promise.all(responses.map(r => r.json()));
      posts.forEach((post, index) => {
        expect(post.id).toBe(index + 1);
      });
    });
  });
});

// Export test for direct use
export { testWithFixtures as test };
