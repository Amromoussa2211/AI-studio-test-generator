"""
AI Test Generator

Mock AI service that generates test cases from user stories:
- User story parsing and analysis
- Test case generation for different types (API, UI, Integration)
- Test data generation
- Test scenario creation
- Mock AI responses for testing purposes
"""

import json
import random
from typing import List, Dict, Any, Optional
from datetime import datetime
import re


class MockAIService:
    """Mock AI service for test generation"""
    
    def __init__(self):
        self.test_patterns = {
            'login': {
                'positive': ['valid credentials', 'remember me enabled', 'correct captcha'],
                'negative': ['invalid username', 'wrong password', 'empty fields', 'sql injection']
            },
            'api': {
                'positive': ['valid request', 'correct parameters', 'successful response'],
                'negative': ['invalid parameters', 'unauthorized access', 'server error']
            },
            'ui': {
                'positive': ['valid form submission', 'proper navigation', 'correct display'],
                'negative': ['invalid input', 'broken links', 'missing elements']
            },
            'search': {
                'positive': ['valid search term', 'results found', 'correct filtering'],
                'negative': ['no results', 'special characters', 'empty search']
            }
        }
    
    def generate_tests_from_story(self, user_story: str, story_type: str = 'general') -> Dict[str, Any]:
        """Generate test cases from user story using AI patterns"""
        
        # Parse user story components
        story_parts = self._parse_user_story(user_story)
        
        # Generate test cases
        test_cases = self._generate_test_cases(story_parts, story_type)
        
        return {
            'user_story': user_story,
            'parsed_story': story_parts,
            'generated_tests': test_cases,
            'generated_at': datetime.now().isoformat(),
            'test_count': len(test_cases),
            'confidence_score': random.uniform(0.7, 0.95)
        }
    
    def _parse_user_story(self, user_story: str) -> Dict[str, Any]:
        """Parse user story into components"""
        
        # Extract persona, action, benefit
        patterns = {
            'persona': r'(?:As an?|As a?)\s+([^,]+)',
            'action': r'(?:I want to|I need to|I should be able to)\s+([^.]+)',
            'benefit': r'(?:So that|In order to|To)\s+([^.]+)'
        }
        
        components = {}
        for component, pattern in patterns.items():
            match = re.search(pattern, user_story, re.IGNORECASE)
            if match:
                components[component] = match.group(1).strip()
        
        # Extract keywords and action words
        keywords = re.findall(r'\b\w+\b', user_story.lower())
        action_words = ['login', 'register', 'search', 'create', 'update', 'delete', 'view', 'edit']
        
        detected_actions = [word for word in keywords if word in action_words]
        
        return {
            'persona': components.get('persona', 'Unknown User'),
            'action': components.get('action', 'Perform action'),
            'benefit': components.get('benefit', 'Achieve goal'),
            'detected_actions': detected_actions,
            'keywords': keywords
        }
    
    def _generate_test_cases(self, story_parts: Dict, story_type: str) -> List[Dict[str, Any]]:
        """Generate test cases based on parsed story"""
        
        test_cases = []
        action = story_parts.get('detected_actions', ['general'])[0] if story_parts.get('detected_actions') else 'general'
        
        # Generate different types of tests
        test_cases.extend(self._generate_functional_tests(story_parts, action))
        test_cases.extend(self._generate_ui_tests(story_parts, action))
        test_cases.extend(self._generate_api_tests(story_parts, action))
        test_cases.extend(self._generate_integration_tests(story_parts, action))
        test_cases.extend(self._generate_security_tests(story_parts, action))
        
        return test_cases
    
    def _generate_functional_tests(self, story_parts: Dict, action: str) -> List[Dict[str, Any]]:
        """Generate functional test cases"""
        tests = []
        
        # Positive test cases
        positive_scenarios = self.test_patterns.get(action, {'positive': ['valid scenario']})['positive']
        for scenario in positive_scenarios[:2]:  # Limit to 2 scenarios
            test_case = {
                'id': f'FUNC_{len(tests) + 1:03d}',
                'name': f'Positive: {scenario.title()}',
                'description': f'Verify that {action} works correctly when {scenario}',
                'type': 'functional',
                'priority': 'high',
                'category': 'positive',
                'preconditions': ['User is logged in', 'Application is accessible'],
                'test_steps': self._generate_test_steps(action, scenario, 'positive'),
                'expected_result': f'{action.title()} succeeds with {scenario}',
                'estimated_duration': 2,
                'tags': [action, 'functional', 'positive']
            }
            tests.append(test_case)
        
        # Negative test cases
        negative_scenarios = self.test_patterns.get(action, {'negative': ['invalid scenario']})['negative']
        for scenario in negative_scenarios[:2]:  # Limit to 2 scenarios
            test_case = {
                'id': f'FUNC_{len(tests) + 1:03d}',
                'name': f'Negative: {scenario.title()}',
                'description': f'Verify proper error handling when {scenario}',
                'type': 'functional',
                'priority': 'medium',
                'category': 'negative',
                'preconditions': ['User is logged in', 'Application is accessible'],
                'test_steps': self._generate_test_steps(action, scenario, 'negative'),
                'expected_result': f'Appropriate error message displayed for {scenario}',
                'estimated_duration': 3,
                'tags': [action, 'functional', 'negative', 'error-handling']
            }
            tests.append(test_case)
        
        return tests
    
    def _generate_ui_tests(self, story_parts: Dict, action: str) -> List[Dict[str, Any]]:
        """Generate UI/UX test cases"""
        tests = []
        
        ui_test_cases = [
            {
                'name': f'UI: {action.title()} Page Layout',
                'description': f'Verify UI elements are properly displayed for {action}',
                'test_steps': [
                    f'Navigate to {action} page',
                    'Verify all UI elements are visible',
                    'Check responsive design on different screen sizes',
                    'Validate proper styling and formatting'
                ]
            },
            {
                'name': f'UI: {action.title()} Accessibility',
                'description': f'Verify {action} functionality meets accessibility standards',
                'test_steps': [
                    f'Access {action} page using keyboard navigation',
                    'Verify all form elements have proper labels',
                    'Check color contrast ratios',
                    'Test with screen reader'
                ]
            }
        ]
        
        for i, test_case in enumerate(ui_test_cases):
            test = {
                'id': f'UI_{len(tests) + 1:03d}',
                'name': test_case['name'],
                'description': test_case['description'],
                'type': 'ui',
                'priority': 'medium',
                'category': 'ui-validation',
                'preconditions': ['Browser is launched', 'Application is accessible'],
                'test_steps': test_case['test_steps'],
                'expected_result': f'UI meets design requirements for {action}',
                'estimated_duration': 5,
                'tags': [action, 'ui', 'accessibility']
            }
            tests.append(test)
        
        return tests
    
    def _generate_api_tests(self, story_parts: Dict, action: str) -> List[Dict[str, Any]]:
        """Generate API test cases"""
        tests = []
        
        api_test_cases = [
            {
                'name': f'API: {action.title()} Endpoint Response',
                'description': f'Test {action} API endpoint returns correct response',
                'test_steps': [
                    f'Send GET/POST request to /api/{action}',
                    'Verify response status code (200/201)',
                    'Validate response JSON structure',
                    'Check response time < 2 seconds'
                ]
            },
            {
                'name': f'API: {action.title()} Error Handling',
                'description': f'Test {action} API handles invalid requests properly',
                'test_steps': [
                    f'Send invalid request to /api/{action}',
                    'Verify 4xx/5xx error status code',
                    'Validate error message format',
                    'Check error response structure'
                ]
            }
        ]
        
        for test_case in api_test_cases:
            test = {
                'id': f'API_{len(tests) + 1:03d}',
                'name': test_case['name'],
                'description': test_case['description'],
                'type': 'api',
                'priority': 'high',
                'category': 'api-validation',
                'preconditions': ['API server is running', 'Valid API credentials'],
                'test_steps': test_case['test_steps'],
                'expected_result': f'API responds correctly for {action} operations',
                'estimated_duration': 3,
                'tags': [action, 'api', 'validation']
            }
            tests.append(test)
        
        return tests
    
    def _generate_integration_tests(self, story_parts: Dict, action: str) -> List[Dict[str, Any]]:
        """Generate integration test cases"""
        tests = []
        
        integration_test = {
            'id': f'INT_{len(tests) + 1:03d}',
            'name': f'Integration: {action.title()} with External Systems',
            'description': f'Test {action} functionality integrates properly with external services',
            'type': 'integration',
            'priority': 'medium',
            'category': 'system-integration',
            'preconditions': ['All systems are up and running', 'Network connectivity available'],
            'test_steps': [
                f'Execute {action} workflow',
                'Verify data flows between systems',
                'Check external service integration',
                'Validate end-to-end process completion'
            ],
            'expected_result': f'{action.title()} works seamlessly across all integrated systems',
            'estimated_duration': 10,
            'tags': [action, 'integration', 'end-to-end']
        }
        
        tests.append(integration_test)
        return tests
    
    def _generate_security_tests(self, story_parts: Dict, action: str) -> List[Dict[str, Any]]:
        """Generate security test cases"""
        tests = []
        
        security_tests = [
            {
                'name': f'Security: {action.title()} Authorization',
                'description': f'Verify proper authorization for {action} operations',
                'test_steps': [
                    f'Attempt {action} without proper permissions',
                    'Verify 403/401 error response',
                    'Test with different user roles',
                    'Validate access control enforcement'
                ]
            },
            {
                'name': f'Security: {action.title()} Input Validation',
                'description': f'Test {action} input validation prevents security issues',
                'test_steps': [
                    f'Provide malicious input to {action} function',
                    'Test for SQL injection vulnerabilities',
                    'Check XSS prevention',
                    'Validate input sanitization'
                ]
            }
        ]
        
        for test_case in security_tests:
            test = {
                'id': f'SEC_{len(tests) + 1:03d}',
                'name': test_case['name'],
                'description': test_case['description'],
                'type': 'security',
                'priority': 'high',
                'category': 'security-validation',
                'preconditions': ['Security testing environment setup'],
                'test_steps': test_case['test_steps'],
                'expected_result': f'{action.title()} maintains security standards',
                'estimated_duration': 8,
                'tags': [action, 'security', 'validation']
            }
            tests.append(test)
        
        return tests
    
    def _generate_test_steps(self, action: str, scenario: str, test_type: str) -> List[str]:
        """Generate test steps based on action and scenario"""
        
        if test_type == 'positive':
            return [
                f'Navigate to {action} page',
                f'Perform {action} with valid data',
                'Submit the form/request',
                'Verify successful completion',
                'Validate expected results'
            ]
        else:  # negative
            return [
                f'Navigate to {action} page',
                f'Attempt {action} with {scenario}',
                'Submit the form/request',
                'Verify appropriate error handling',
                'Ensure no system corruption'
            ]


class AITestGenerator:
    """Main AI Test Generator class"""
    
    def __init__(self):
        self.ai_service = MockAIService()
        self.generated_tests = []
    
    def generate_tests(self, user_stories: List[str], story_type: str = 'general') -> Dict[str, Any]:
        """
        Generate comprehensive test suite from user stories
        
        Args:
            user_stories: List of user story strings
            story_type: Type of stories (general, api, ui, mobile)
            
        Returns:
            Dictionary with generated test suite
        """
        all_tests = []
        story_results = []
        
        for story in user_stories:
            result = self.ai_service.generate_tests_from_story(story, story_type)
            story_results.append(result)
            all_tests.extend(result['generated_tests'])
        
        # Organize tests by type
        test_suite = {
            'stories_processed': len(user_stories),
            'total_tests_generated': len(all_tests),
            'generation_timestamp': datetime.now().isoformat(),
            'story_results': story_results,
            'tests_by_type': self._organize_tests_by_type(all_tests),
            'test_suite': {
                'name': f'Generated Test Suite - {story_type.title()}',
                'description': f'Auto-generated tests from {len(user_stories)} user stories',
                'tests': all_tests,
                'metadata': {
                    'confidence_score': sum(r['confidence_score'] for r in story_results) / len(story_results),
                    'estimated_total_duration': sum(test.get('estimated_duration', 0) for test in all_tests)
                }
            }
        }
        
        self.generated_tests = test_suite
        return test_suite
    
    def _organize_tests_by_type(self, tests: List[Dict]) -> Dict[str, List[Dict]]:
        """Organize tests by their type/category"""
        organized = {}
        for test in tests:
            test_type = test.get('type', 'general')
            if test_type not in organized:
                organized[test_type] = []
            organized[test_type].append(test)
        return organized
    
    def save_generated_tests(self, filepath: str = None) -> str:
        """Save generated tests to JSON file"""
        if not filepath:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filepath = f"generated_tests_{timestamp}.json"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.generated_tests, f, indent=2)
        
        return filepath
    
    def export_test_scripts(self, output_dir: str = "generated_tests") -> List[str]:
        """Export test cases as executable test scripts"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        exported_files = []
        
        if not self.generated_tests:
            return exported_files
        
        # Export functional tests as pytest scripts
        functional_tests = self.generated_tests.get('tests_by_type', {}).get('functional', [])
        if functional_tests:
            pytest_content = self._generate_pytest_script(functional_tests)
            pytest_file = os.path.join(output_dir, "test_functional_generated.py")
            with open(pytest_file, 'w') as f:
                f.write(pytest_content)
            exported_files.append(pytest_file)
        
        # Export API tests as pytest scripts
        api_tests = self.generated_tests.get('tests_by_type', {}).get('api', [])
        if api_tests:
            pytest_content = self._generate_api_pytest_script(api_tests)
            pytest_file = os.path.join(output_dir, "test_api_generated.py")
            with open(pytest_file, 'w') as f:
                f.write(pytest_content)
            exported_files.append(pytest_file)
        
        return exported_files
    
    def _generate_pytest_script(self, tests: List[Dict]) -> str:
        """Generate pytest script for functional tests"""
        content = '''"""
Auto-generated Functional Tests
Generated by AI Test Generator
"""
import pytest


class TestGeneratedFunctional:
    """Auto-generated functional test cases"""
    
'''
        
        for test in tests:
            test_name = test['name'].lower().replace(' ', '_').replace(':', '').replace('-', '_')
            content += f'''
    def test_{test_name}(self):
        """{test['description']}"""
        # {test['description']}
        
        # Preconditions: {', '.join(test.get('preconditions', []))}
        
        # Steps:
'''
            for i, step in enumerate(test['test_steps'], 1):
                content += f'        # Step {i}: {step}\n'
            
            content += f'''
        # Expected: {test['expected_result']}
        
        # Placeholder test - implement actual test logic
        assert True, "Test case: {test['name']}"
        
'''
        
        content += '''
if __name__ == "__main__":
    pytest.main([__file__])
'''
        
        return content
    
    def _generate_api_pytest_script(self, tests: List[Dict]) -> str:
        """Generate pytest script for API tests"""
        content = '''"""
Auto-generated API Tests
Generated by AI Test Generator
"""
import pytest
import requests


class TestGeneratedAPI:
    """Auto-generated API test cases"""
    
    def setup_method(self):
        """Setup for each test"""
        self.base_url = "http://localhost:8000"  # Configure base URL
        self.headers = {"Content-Type": "application/json"}
    
'''
        
        for test in tests:
            test_name = test['name'].lower().replace(' ', '_').replace(':', '').replace('-', '_')
            content += f'''
    def test_{test_name}(self):
        """{test['description']}"""
        # {test['description']}
        
        # Preconditions: {', '.join(test.get('preconditions', []))}
        
        try:
            # Placeholder API test logic
            # Replace with actual API call
            response = requests.get(f"{{self.base_url}}/health")
            
            assert response.status_code == 200, "API should be accessible"
            
        except Exception as e:
            pytest.fail(f"API test failed: {{str(e)}}")
        
'''
        
        content += '''
if __name__ == "__main__":
    pytest.main([__file__])
'''
        
        return content
