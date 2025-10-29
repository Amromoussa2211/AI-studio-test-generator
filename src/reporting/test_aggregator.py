"""
Test Result Aggregator

Aggregates test results from multiple sources:
- Consolidates results from different test runs
- Provides unified test result interface
- Handles test result normalization
- Supports various input formats (JSON, CSV, XML)
- Generates aggregated statistics and metrics
"""

import json
import csv
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional, Union
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict, Counter


class TestResult:
    """Standardized test result representation"""
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('id', '')
        self.name = kwargs.get('name', '')
        self.suite = kwargs.get('suite', '')
        self.category = kwargs.get('category', '')
        self.status = kwargs.get('status', 'UNKNOWN')  # PASSED, FAILED, SKIPPED, ERROR
        self.duration = kwargs.get('duration', 0.0)
        self.timestamp = kwargs.get('timestamp', datetime.now().isoformat())
        self.message = kwargs.get('message', '')
        self.error_details = kwargs.get('error_details', '')
        self.tags = kwargs.get('tags', [])
        self.priority = kwargs.get('priority', 'medium')
        self.browser = kwargs.get('browser', '')
        self.os = kwargs.get('os', '')
        self.test_type = kwargs.get('test_type', 'functional')
        self.retry_count = kwargs.get('retry_count', 0)
        self.custom_fields = kwargs.get('custom_fields', {})
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation"""
        return {
            'id': self.id,
            'name': self.name,
            'suite': self.suite,
            'category': self.category,
            'status': self.status,
            'duration': self.duration,
            'timestamp': self.timestamp,
            'message': self.message,
            'error_details': self.error_details,
            'tags': self.tags,
            'priority': self.priority,
            'browser': self.browser,
            'os': self.os,
            'test_type': self.test_type,
            'retry_count': self.retry_count,
            'custom_fields': self.custom_fields
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'TestResult':
        """Create TestResult from dictionary"""
        return cls(**data)


class TestAggregator:
    """Aggregates and consolidates test results from multiple sources"""
    
    def __init__(self):
        self.results = []
        self.source_files = []
        self.aggregation_metadata = {}
    
    def add_results(self, results: Union[List[Dict], List[TestResult], str]) -> None:
        """
        Add test results from various sources
        
        Args:
            results: List of test results (dicts, TestResult objects) or file path
        """
        if isinstance(results, str):
            # It's a file path
            self._load_from_file(results)
        elif isinstance(results, list):
            # It's a list of results
            for result in results:
                if isinstance(result, dict):
                    self.results.append(TestResult.from_dict(result))
                elif isinstance(result, TestResult):
                    self.results.append(result)
                else:
                    raise ValueError(f"Unsupported result type: {type(result)}")
        else:
            raise ValueError(f"Unsupported input type: {type(results)}")
    
    def _load_from_file(self, file_path: str) -> None:
        """Load test results from various file formats"""
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        self.source_files.append(str(file_path))
        
        if file_path.suffix.lower() == '.json':
            self._load_from_json(file_path)
        elif file_path.suffix.lower() == '.csv':
            self._load_from_csv(file_path)
        elif file_path.suffix.lower() == '.xml':
            self._load_from_xml(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_path.suffix}")
    
    def _load_from_json(self, file_path: Path) -> None:
        """Load test results from JSON file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle different JSON structures
        if isinstance(data, list):
            results_list = data
        elif isinstance(data, dict):
            if 'test_results' in data:
                results_list = data['test_results']
            elif 'results' in data:
                results_list = data['results']
            elif 'tests' in data:
                results_list = data['tests']
            else:
                results_list = [data]  # Single result
        else:
            raise ValueError("Invalid JSON structure")
        
        for result_data in results_list:
            try:
                self.results.append(TestResult.from_dict(result_data))
            except Exception as e:
                print(f"Warning: Could not parse result: {e}")
    
    def _load_from_csv(self, file_path: Path) -> None:
        """Load test results from CSV file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    # Convert duration to float if possible
                    if 'duration' in row:
                        try:
                            row['duration'] = float(row['duration'])
                        except (ValueError, TypeError):
                            row['duration'] = 0.0
                    
                    self.results.append(TestResult.from_dict(row))
                except Exception as e:
                    print(f"Warning: Could not parse CSV row: {e}")
    
    def _load_from_xml(self, file_path: Path) -> None:
        """Load test results from XML file (JUnit XML format)"""
        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
            
            # Handle different XML formats
            for testcase in root.findall('.//testcase'):
                result_data = {
                    'id': testcase.get('name', ''),
                    'name': testcase.get('name', ''),
                    'suite': testcase.get('classname', ''),
                    'duration': float(testcase.get('time', 0)),
                    'status': 'PASSED'  # Default, will be updated if failure found
                }
                
                # Check for failure/error
                failure = testcase.find('failure')
                if failure is not None:
                    result_data['status'] = 'FAILED'
                    result_data['error_details'] = failure.text
                else:
                    error = testcase.find('error')
                    if error is not None:
                        result_data['status'] = 'ERROR'
                        result_data['error_details'] = error.text
                
                # Check for skipped
                skipped = testcase.find('skipped')
                if skipped is not None:
                    result_data['status'] = 'SKIPPED'
                    result_data['message'] = skipped.get('message', '')
                
                try:
                    self.results.append(TestResult.from_dict(result_data))
                except Exception as e:
                    print(f"Warning: Could not parse XML test case: {e}")
        
        except Exception as e:
            raise ValueError(f"Failed to parse XML file: {e}")
    
    def get_summary(self) -> Dict[str, Any]:
        """Get aggregated summary of all test results"""
        if not self.results:
            return {
                'total': 0,
                'passed': 0,
                'failed': 0,
                'skipped': 0,
                'errors': 0,
                'pass_rate': 0.0,
                'total_duration': 0.0,
                'avg_duration': 0.0
            }
        
        # Count statuses
        status_counts = Counter(result.status for result in self.results)
        
        total = len(self.results)
        passed = status_counts.get('PASSED', 0)
        failed = status_counts.get('FAILED', 0)
        skipped = status_counts.get('SKIPPED', 0)
        errors = status_counts.get('ERROR', 0)
        
        # Calculate metrics
        total_duration = sum(result.duration for result in self.results)
        avg_duration = total_duration / total if total > 0 else 0
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        # Suites breakdown
        suite_counts = Counter(result.suite for result in self.results)
        
        # Categories breakdown
        category_counts = Counter(result.category for result in self.results)
        
        # Recent trends (last 24 hours)
        recent_results = self._get_recent_results()
        
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'skipped': skipped,
            'errors': errors,
            'pass_rate': pass_rate,
            'total_duration': total_duration,
            'avg_duration': avg_duration,
            'suite_breakdown': dict(suite_counts),
            'category_breakdown': dict(category_counts),
            'status_breakdown': dict(status_counts),
            'recent_trends': self._calculate_trends(recent_results),
            'source_files': self.source_files,
            'last_updated': datetime.now().isoformat()
        }
    
    def _get_recent_results(self, hours: int = 24) -> List[TestResult]:
        """Get test results from the last N hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        recent_results = []
        for result in self.results:
            try:
                result_time = datetime.fromisoformat(result.timestamp.replace('Z', '+00:00'))
                if result_time >= cutoff_time:
                    recent_results.append(result)
            except (ValueError, TypeError):
                # If timestamp parsing fails, include the result
                recent_results.append(result)
        
        return recent_results
    
    def _calculate_trends(self, recent_results: List[TestResult]) -> Dict[str, Any]:
        """Calculate recent trends"""
        if not recent_results:
            return {'trend': 'no_data', 'change_percent': 0}
        
        status_counts = Counter(result.status for result in recent_results)
        total_recent = len(recent_results)
        pass_rate_recent = (status_counts.get('PASSED', 0) / total_recent * 100) if total_recent > 0 else 0
        
        return {
            'total_recent': total_recent,
            'pass_rate_recent': pass_rate_recent,
            'recent_status_breakdown': dict(status_counts)
        }
    
    def get_tests_by_status(self, status: str) -> List[TestResult]:
        """Get all tests with specific status"""
        return [result for result in self.results if result.status.upper() == status.upper()]
    
    def get_tests_by_suite(self, suite: str) -> List[TestResult]:
        """Get all tests from specific test suite"""
        return [result for result in self.results if result.suite.lower() == suite.lower()]
    
    def get_tests_by_category(self, category: str) -> List[TestResult]:
        """Get all tests from specific category"""
        return [result for result in self.results if result.category.lower() == category.lower()]
    
    def get_failed_tests(self) -> List[TestResult]:
        """Get all failed and error tests"""
        failed_statuses = ['FAILED', 'ERROR']
        return [result for result in self.results if result.status in failed_statuses]
    
    def get_slowest_tests(self, limit: int = 10) -> List[TestResult]:
        """Get slowest performing tests"""
        return sorted(self.results, key=lambda x: x.duration, reverse=True)[:limit]
    
    def get_test_duration_stats(self) -> Dict[str, float]:
        """Get test duration statistics"""
        if not self.results:
            return {'min': 0, 'max': 0, 'avg': 0, 'median': 0, 'total': 0}
        
        durations = [result.duration for result in self.results]
        durations.sort()
        
        total = sum(durations)
        avg = total / len(durations)
        minimum = min(durations)
        maximum = max(durations)
        median = durations[len(durations) // 2]
        
        return {
            'min': minimum,
            'max': maximum,
            'avg': avg,
            'median': median,
            'total': total
        }
    
    def get_trends_over_time(self, period: str = 'daily') -> Dict[str, Any]:
        """
        Get test execution trends over time
        
        Args:
            period: 'hourly', 'daily', 'weekly'
        """
        if not self.results:
            return {}
        
        # Group results by time period
        period_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0, 'skipped': 0})
        
        for result in self.results:
            try:
                result_time = datetime.fromisoformat(result.timestamp.replace('Z', '+00:00'))
                
                if period == 'hourly':
                    key = result_time.strftime('%Y-%m-%d %H:00')
                elif period == 'daily':
                    key = result_time.strftime('%Y-%m-%d')
                elif period == 'weekly':
                    # Get Monday of the week
                    monday = result_time - timedelta(days=result_time.weekday())
                    key = monday.strftime('%Y-%m-%d')
                else:
                    key = result_time.strftime('%Y-%m-%d')
                
                period_data[key]['total'] += 1
                if result.status == 'PASSED':
                    period_data[key]['passed'] += 1
                elif result.status == 'FAILED':
                    period_data[key]['failed'] += 1
                elif result.status == 'SKIPPED':
                    period_data[key]['skipped'] += 1
            
            except (ValueError, TypeError):
                # Skip results with invalid timestamps
                continue
        
        # Convert to sorted list
        sorted_periods = sorted(period_data.keys())
        trends = []
        
        for period_key in sorted_periods:
            data = period_data[period_key]
            pass_rate = (data['passed'] / data['total'] * 100) if data['total'] > 0 else 0
            
            trends.append({
                'period': period_key,
                'total': data['total'],
                'passed': data['passed'],
                'failed': data['failed'],
                'skipped': data['skipped'],
                'pass_rate': pass_rate
            })
        
        return {
            'period': period,
            'trends': trends,
            'summary': {
                'periods_analyzed': len(trends),
                'total_executions': sum(t['total'] for t in trends),
                'overall_pass_rate': sum(t['passed'] for t in trends) / sum(t['total'] for t in trends) * 100 if sum(t['total'] for t in trends) > 0 else 0
            }
        }
    
    def export_consolidated_results(self, output_file: str = None) -> str:
        """Export consolidated test results to JSON file"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"consolidated_results_{timestamp}.json"
        
        export_data = {
            'metadata': {
                'aggregation_timestamp': datetime.now().isoformat(),
                'total_results': len(self.results),
                'source_files': self.source_files,
                'aggregation_tool': 'TestAggregator v1.0'
            },
            'summary': self.get_summary(),
            'test_results': [result.to_dict() for result in self.results]
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2)
        
        return output_file
    
    def clear_results(self) -> None:
        """Clear all aggregated results"""
        self.results.clear()
        self.source_files.clear()
        self.aggregation_metadata.clear()
