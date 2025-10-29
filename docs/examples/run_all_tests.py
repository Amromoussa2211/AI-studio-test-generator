#!/usr/bin/env python3
"""
Test Runner Script

This script runs all the example tests in the framework to verify everything works correctly.

Usage:
    python run_all_tests.py              # Run all tests
    python run_all_tests.py --web        # Run only web tests
    python run_all_tests.py --api        # Run only API tests
    python run_all_tests.py --mobile     # Run only mobile tests
    python run_all_tests.py --help       # Show help
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

class TestRunner:
    def __init__(self):
        self.results = {
            'web': {'passed': 0, 'failed': 0, 'tests': []},
            'api': {'passed': 0, 'failed': 0, 'tests': []},
            'mobile': {'passed': 0, 'failed': 0, 'tests': []}
        }
    
    def print_header(self, title):
        """Print formatted header"""
        print("\n" + "=" * 70)
        print(f"🚀 {title}")
        print("=" * 70)
    
    def print_section(self, title):
        """Print formatted section"""
        print(f"\n📋 {title}")
        print("-" * 50)
    
    def run_command(self, command, description):
        """Run a command and capture results"""
        print(f"  🔄 {description}...")
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                print(f"  ✅ {description} - PASSED")
                return True, result.stdout
            else:
                print(f"  ❌ {description} - FAILED")
                print(f"     Error: {result.stderr}")
                return False, result.stderr
                
        except subprocess.TimeoutExpired:
            print(f"  ⏰ {description} - TIMEOUT")
            return False, "Test execution timed out"
        except Exception as e:
            print(f"  💥 {description} - ERROR: {e}")
            return False, str(e)
    
    def run_web_tests(self):
        """Run web testing examples"""
        self.print_section("Web Testing Examples")
        
        # Check if dependencies are installed
        try:
            import selenium
            from webdriver_manager.chrome import ChromeDriverManager
        except ImportError as e:
            print(f"  ⚠️  Web testing dependencies not installed: {e}")
            print("     Install with: pip install selenium webdriver-manager")
            return False
        
        # Find and run web test files
        web_dir = Path(__file__).parent / "web"
        
        # Run basic page test
        test_file = web_dir / "basic_page_tests" / "basic_page_test.py"
        if test_file.exists():
            success, output = self.run_command(
                f"python {test_file}",
                "Basic Page Test"
            )
            self.results['web']['tests'].append(('Basic Page Test', success))
            if success:
                self.results['web']['passed'] += 1
            else:
                self.results['web']['failed'] += 1
        
        # Run form test
        test_file = web_dir / "form_tests" / "simple_form_test.py"
        if test_file.exists():
            success, output = self.run_command(
                f"python {test_file}",
                "Simple Form Test"
            )
            self.results['web']['tests'].append(('Simple Form Test', success))
            if success:
                self.results['web']['passed'] += 1
            else:
                self.results['web']['failed'] += 1
        
        return self.results['web']['failed'] == 0
    
    def run_api_tests(self):
        """Run API testing examples"""
        self.print_section("API Testing Examples")
        
        # Check if dependencies are installed
        try:
            import requests
        except ImportError as e:
            print(f"  ⚠️  API testing dependencies not installed: {e}")
            print("     Install with: pip install requests")
            return False
        
        # Find and run API test files
        api_dir = Path(__file__).parent / "api"
        
        # Run basic API test
        test_file = api_dir / "basic_api_tests" / "basic_api_test.py"
        if test_file.exists():
            success, output = self.run_command(
                f"python {test_file}",
                "Basic API Test"
            )
            self.results['api']['tests'].append(('Basic API Test', success))
            if success:
                self.results['api']['passed'] += 1
            else:
                self.results['api']['failed'] += 1
        
        return self.results['api']['failed'] == 0
    
    def run_mobile_tests(self):
        """Run mobile testing examples"""
        self.print_section("Mobile Testing Examples")
        
        # Check if dependencies are installed
        try:
            from appium import webdriver
        except ImportError as e:
            print(f"  ⚠️  Mobile testing dependencies not installed: {e}")
            print("     Install with: pip install Appium-Python-Client")
            return False
        
        # For mobile tests, we'll run a connection test
        # Full mobile tests require a running Appium server and device
        mobile_dir = Path(__file__).parent / "mobile"
        
        # Check if we can connect to Appium
        print("  🔍 Checking Appium server connection...")
        try:
            # Try to import and check if Appium server is accessible
            import requests
            response = requests.get("http://localhost:4723/status", timeout=2)
            
            if response.status_code == 200:
                print("  ✅ Appium server is running")
                
                # Run connection test
                test_file = mobile_dir / "basic_tests" / "connection_test.py"
                if test_file.exists():
                    success, output = self.run_command(
                        f"python {test_file}",
                        "Mobile Connection Test"
                    )
                    self.results['mobile']['tests'].append(('Mobile Connection Test', success))
                    if success:
                        self.results['mobile']['passed'] += 1
                    else:
                        self.results['mobile']['failed'] += 1
            else:
                print("  ⚠️  Appium server is not accessible")
                print("     Mobile tests skipped - Appium server not running")
                print("     Start with: appium --address 127.0.0.1 --port 4723")
                
        except requests.exceptions.RequestException:
            print("  ⚠️  Appium server is not running")
            print("     Mobile tests skipped - Appium server not running")
            print("     Start with: appium --address 127.0.0.1 --port 4723")
            return False
        
        return self.results['mobile']['failed'] == 0
    
    def run_syntax_check(self):
        """Run syntax check on all example files"""
        self.print_section("Syntax Check")
        
        example_dirs = [
            Path(__file__).parent / "web",
            Path(__file__).parent / "api",
            Path(__file__).parent / "mobile"
        ]
        
        python_files = []
        for example_dir in example_dirs:
            if example_dir.exists():
                python_files.extend(example_dir.rglob("*.py"))
        
        all_good = True
        for py_file in python_files:
            try:
                # Check syntax by compiling
                with open(py_file, 'r') as f:
                    code = f.read()
                
                compile(code, str(py_file), 'exec')
                print(f"  ✅ {py_file.relative_to(Path(__file__).parent)}")
                
            except SyntaxError as e:
                print(f"  ❌ {py_file.relative_to(Path(__file__).parent)} - Syntax Error")
                print(f"     Line {e.lineno}: {e.msg}")
                all_good = False
            except Exception as e:
                print(f"  ❌ {py_file.relative_to(Path(__file__).parent)} - Error: {e}")
                all_good = False
        
        return all_good
    
    def generate_summary(self):
        """Generate test summary"""
        self.print_section("Test Summary")
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.results.items():
            if results['tests']:
                print(f"\n📊 {category.upper()} Tests:")
                passed = 0
                failed = 0
                
                for test_name, success in results['tests']:
                    status = "✅ PASSED" if success else "❌ FAILED"
                    print(f"   {status} - {test_name}")
                    
                    if success:
                        passed += 1
                    else:
                        failed += 1
                
                total_passed += passed
                total_failed += failed
                
                success_rate = (passed / (passed + failed)) * 100 if (passed + failed) > 0 else 0
                print(f"   📈 Success Rate: {success_rate:.1f}% ({passed}/{passed + failed})")
        
        # Overall summary
        total_tests = total_passed + total_failed
        overall_success_rate = (total_passed / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"\n🎯 Overall Results:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {total_passed}")
        print(f"   Failed: {total_failed}")
        print(f"   Success Rate: {overall_success_rate:.1f}%")
        
        if total_failed == 0 and total_tests > 0:
            print("\n🎉 All tests PASSED! Framework is working correctly.")
        elif total_failed < total_tests:
            print(f"\n⚠️  {total_failed} tests failed. Check the output above for details.")
        else:
            print("\n💥 No tests were executed. Check dependency installation.")
        
        return total_failed == 0 and total_tests > 0
    
    def check_dependencies(self):
        """Check if required dependencies are installed"""
        self.print_section("Dependency Check")
        
        dependencies = {
            'selenium': 'Web testing (Selenium)',
            'webdriver-manager': 'Automatic WebDriver management',
            'requests': 'API testing (Requests)',
            'Appium-Python-Client': 'Mobile testing (Appium)'
        }
        
        missing_deps = []
        
        for dep, description in dependencies.items():
            try:
                __import__(dep.replace('-', '_'))
                print(f"  ✅ {dep} - {description}")
            except ImportError:
                print(f"  ❌ {dep} - {description} (NOT INSTALLED)")
                missing_deps.append(dep)
        
        if missing_deps:
            print(f"\n📦 Missing dependencies: {', '.join(missing_deps)}")
            print("   Install with: pip install " + " ".join(missing_deps))
            return False
        
        print("\n✅ All dependencies are installed!")
        return True
    
    def run_all(self, test_types=None):
        """Run all tests"""
        self.print_header("Testing Framework - Example Test Runner")
        
        # Check dependencies
        if not self.check_dependencies():
            return False
        
        # Run syntax check
        self.run_syntax_check()
        
        # Determine which tests to run
        if test_types is None:
            test_types = ['web', 'api', 'mobile']
        
        # Run selected tests
        success = True
        
        if 'web' in test_types:
            web_success = self.run_web_tests()
            success = success and web_success
        
        if 'api' in test_types:
            api_success = self.run_api_tests()
            success = success and api_success
        
        if 'mobile' in test_types:
            mobile_success = self.run_mobile_tests()
            success = success and mobile_success
        
        # Generate summary
        self.generate_summary()
        
        return success

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Run all example tests for the Simple Testing Framework"
    )
    
    parser.add_argument(
        '--web', 
        action='store_true',
        help='Run only web testing examples'
    )
    
    parser.add_argument(
        '--api', 
        action='store_true',
        help='Run only API testing examples'
    )
    
    parser.add_argument(
        '--mobile', 
        action='store_true',
        help='Run only mobile testing examples'
    )
    
    parser.add_argument(
        '--deps',
        action='store_true',
        help='Check dependencies only'
    )
    
    args = parser.parse_args()
    
    runner = TestRunner()
    
    # Determine test types
    test_types = None
    if args.web or args.api or args.mobile:
        test_types = []
        if args.web:
            test_types.append('web')
        if args.api:
            test_types.append('api')
        if args.mobile:
            test_types.append('mobile')
    
    if args.deps:
        # Just check dependencies
        runner.check_dependencies()
    else:
        # Run tests
        success = runner.run_all(test_types)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
