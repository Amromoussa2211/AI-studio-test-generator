"""
Analytics Engine

Advanced analytics and insights from test results:
- Performance analysis and trends
- Failure pattern analysis
- Test coverage metrics
- Predictive analytics
- Quality metrics and KPIs
- Comparative analysis
"""

import json
import statistics
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import re


class AnalyticsEngine:
    """Advanced analytics engine for test results"""
    
    def __init__(self, test_results: List[Dict[str, Any]]):
        self.test_results = test_results
        self.analysis_cache = {}
    
    def analyze_performance(self) -> Dict[str, Any]:
        """Analyze test performance metrics and trends"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Calculate performance metrics
        durations = [result.get('duration', 0) for result in self.test_results]
        
        performance_metrics = {
            'duration_stats': {
                'min': min(durations) if durations else 0,
                'max': max(durations) if durations else 0,
                'avg': statistics.mean(durations) if durations else 0,
                'median': statistics.median(durations) if durations else 0,
                'std_dev': statistics.stdev(durations) if len(durations) > 1 else 0,
                'total': sum(durations)
            },
            'slowest_tests': self._get_slowest_tests(10),
            'fastest_tests': self._get_fastest_tests(10),
            'performance_distribution': self._analyze_duration_distribution(),
            'performance_trends': self._analyze_performance_trends()
        }
        
        return performance_metrics
    
    def analyze_failure_patterns(self) -> Dict[str, Any]:
        """Analyze patterns in test failures"""
        failed_tests = [result for result in self.test_results if result.get('status') == 'FAILED']
        
        if not failed_tests:
            return {'message': 'No failed tests to analyze'}
        
        failure_analysis = {
            'total_failures': len(failed_tests),
            'failure_rate': len(failed_tests) / len(self.test_results) * 100,
            'common_failures': self._find_common_failures(failed_tests),
            'failure_by_suite': self._group_failures_by_suite(failed_tests),
            'failure_by_category': self._group_failures_by_category(failed_tests),
            'failure_keywords': self._extract_failure_keywords(failed_tests),
            'recurring_failures': self._find_recurring_failures(failed_tests),
            'failure_timeline': self._analyze_failure_timeline(failed_tests)
        }
        
        return failure_analysis
    
    def analyze_test_quality(self) -> Dict[str, Any]:
        """Analyze overall test quality metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        failed_tests = len([r for r in self.test_results if r.get('status') == 'FAILED'])
        skipped_tests = len([r for r in self.test_results if r.get('status') == 'SKIPPED'])
        
        quality_metrics = {
            'overall_quality_score': self._calculate_quality_score(),
            'reliability_score': self._calculate_reliability_score(),
            'test_effectiveness': self._calculate_test_effectiveness(),
            'quality_by_category': self._analyze_quality_by_category(),
            'quality_trends': self._analyze_quality_trends(),
            'recommendations': self._generate_quality_recommendations(),
            'test_coverage_analysis': self._analyze_test_coverage()
        }
        
        return quality_metrics
    
    def analyze_trends(self, time_period: str = '7d') -> Dict[str, Any]:
        """Analyze trends over time periods"""
        if not self.test_results:
            return {'error': 'No test results available for trend analysis'}
        
        # Filter results by time period
        filtered_results = self._filter_by_time_period(time_period)
        
        if not filtered_results:
            return {'message': 'No results in specified time period'}
        
        trend_analysis = {
            'period': time_period,
            'total_executions': len(filtered_results),
            'pass_rate_trend': self._analyze_pass_rate_trend(filtered_results),
            'performance_trend': self._analyze_performance_trend(filtered_results),
            'stability_analysis': self._analyze_stability(filtered_results),
            'improvement_areas': self._identify_improvement_areas(filtered_results),
            'peak_failure_times': self._identify_peak_failure_times(filtered_results)
        }
        
        return trend_analysis
    
    def generate_insights(self) -> Dict[str, Any]:
        """Generate actionable insights from test data"""
        insights = {
            'key_findings': self._generate_key_findings(),
            'critical_issues': self._identify_critical_issues(),
            'optimization_opportunities': self._identify_optimization_opportunities(),
            'risk_assessment': self._assess_risks(),
            'action_items': self._generate_action_items(),
            'executive_summary': self._generate_executive_summary()
        }
        
        return insights
    
    def _get_slowest_tests(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get slowest performing tests"""
        sorted_tests = sorted(self.test_results, key=lambda x: x.get('duration', 0), reverse=True)
        return [
            {
                'name': test.get('name', ''),
                'duration': test.get('duration', 0),
                'suite': test.get('suite', ''),
                'status': test.get('status', '')
            }
            for test in sorted_tests[:limit]
        ]
    
    def _get_fastest_tests(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get fastest performing tests"""
        sorted_tests = sorted(self.test_results, key=lambda x: x.get('duration', 0))
        return [
            {
                'name': test.get('name', ''),
                'duration': test.get('duration', 0),
                'suite': test.get('suite', ''),
                'status': test.get('status', '')
            }
            for test in sorted_tests[:limit]
        ]
    
    def _analyze_duration_distribution(self) -> Dict[str, Any]:
        """Analyze distribution of test durations"""
        durations = [result.get('duration', 0) for result in self.test_results]
        
        if not durations:
            return {}
        
        # Create duration buckets
        buckets = {
            '0-1s': 0,
            '1-5s': 0,
            '5-10s': 0,
            '10-30s': 0,
            '30-60s': 0,
            '60s+': 0
        }
        
        for duration in durations:
            if duration <= 1:
                buckets['0-1s'] += 1
            elif duration <= 5:
                buckets['1-5s'] += 1
            elif duration <= 10:
                buckets['5-10s'] += 1
            elif duration <= 30:
                buckets['10-30s'] += 1
            elif duration <= 60:
                buckets['30-60s'] += 1
            else:
                buckets['60s+'] += 1
        
        return {
            'distribution': buckets,
            'total_tests': len(durations)
        }
    
    def _analyze_performance_trends(self) -> Dict[str, Any]:
        """Analyze performance trends over time"""
        # Sort tests by timestamp
        sorted_tests = sorted(self.test_results, key=lambda x: x.get('timestamp', ''))
        
        if len(sorted_tests) < 2:
            return {'trend': 'insufficient_data'}
        
        # Calculate moving average of durations
        window_size = min(10, len(sorted_tests) // 2)
        moving_averages = []
        
        for i in range(window_size, len(sorted_tests)):
            window = [test.get('duration', 0) for test in sorted_tests[i-window_size:i]]
            avg_duration = sum(window) / len(window)
            moving_averages.append({
                'timestamp': sorted_tests[i].get('timestamp', ''),
                'avg_duration': avg_duration
            })
        
        # Determine trend direction
        if len(moving_averages) >= 2:
            first_avg = moving_averages[0]['avg_duration']
            last_avg = moving_averages[-1]['avg_duration']
            
            if last_avg > first_avg * 1.1:
                trend = 'degrading'
            elif last_avg < first_avg * 0.9:
                trend = 'improving'
            else:
                trend = 'stable'
        else:
            trend = 'insufficient_data'
        
        return {
            'trend': trend,
            'moving_averages': moving_averages[-10:],  # Last 10 data points
            'performance_change_percent': self._calculate_performance_change(moving_averages)
        }
    
    def _calculate_performance_change(self, moving_averages: List[Dict]) -> float:
        """Calculate percentage change in performance"""
        if len(moving_averages) < 2:
            return 0.0
        
        first = moving_averages[0]['avg_duration']
        last = moving_averages[-1]['avg_duration']
        
        if first == 0:
            return 0.0
        
        return ((last - first) / first) * 100
    
    def _find_common_failures(self, failed_tests: List[Dict]) -> List[Dict[str, Any]]:
        """Find most common failure patterns"""
        failure_messages = [test.get('error_details', '') or test.get('message', '') for test in failed_tests]
        
        # Extract key phrases from failure messages
        key_phrases = []
        for message in failure_messages:
            # Simple keyword extraction
            words = re.findall(r'\b\w{4,}\b', message.lower())
            key_phrases.extend(words)
        
        # Count phrase frequency
        phrase_counts = Counter(key_phrases)
        
        return [
            {'phrase': phrase, 'count': count}
            for phrase, count in phrase_counts.most_common(10)
            if count > 1  # Only include phrases that appear multiple times
        ]
    
    def _group_failures_by_suite(self, failed_tests: List[Dict]) -> Dict[str, int]:
        """Group failures by test suite"""
        suite_failures = Counter(test.get('suite', 'Unknown') for test in failed_tests)
        return dict(suite_failures)
    
    def _group_failures_by_category(self, failed_tests: List[Dict]) -> Dict[str, int]:
        """Group failures by test category"""
        category_failures = Counter(test.get('category', 'Unknown') for test in failed_tests)
        return dict(category_failures)
    
    def _extract_failure_keywords(self, failed_tests: List[Dict]) -> List[Dict[str, Any]]:
        """Extract keywords from failure messages"""
        all_text = ' '.join([
            test.get('error_details', '') or test.get('message', '') 
            for test in failed_tests
        ]).lower()
        
        # Common failure-related keywords
        failure_keywords = [
            'timeout', 'connection', 'error', 'exception', 'failed', 'not found',
            'assertion', 'validation', 'permission', 'authentication', 'network'
        ]
        
        keyword_counts = {}
        for keyword in failure_keywords:
            count = all_text.count(keyword)
            if count > 0:
                keyword_counts[keyword] = count
        
        return [
            {'keyword': keyword, 'frequency': count}
            for keyword, count in sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)
        ]
    
    def _find_recurring_failures(self, failed_tests: List[Dict]) -> List[Dict[str, Any]]:
        """Find tests that fail repeatedly"""
        test_failures = defaultdict(int)
        
        for test in failed_tests:
            test_name = test.get('name', '')
            if test_name:
                test_failures[test_name] += 1
        
        # Return tests that failed more than once
        recurring = [
            {'test_name': test_name, 'failure_count': count}
            for test_name, count in test_failures.items()
            if count > 1
        ]
        
        return sorted(recurring, key=lambda x: x['failure_count'], reverse=True)
    
    def _analyze_failure_timeline(self, failed_tests: List[Dict]) -> List[Dict[str, Any]]:
        """Analyze failure patterns over time"""
        # Group failures by day
        daily_failures = defaultdict(int)
        
        for test in failed_tests:
            timestamp = test.get('timestamp', '')
            try:
                if timestamp:
                    date = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).date()
                    daily_failures[date.isoformat()] += 1
            except (ValueError, TypeError):
                continue
        
        return [
            {'date': date, 'failure_count': count}
            for date, count in sorted(daily_failures.items())
        ]
    
    def _calculate_quality_score(self) -> float:
        """Calculate overall quality score (0-100)"""
        if not self.test_results:
            return 0.0
        
        total = len(self.test_results)
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        
        # Base score on pass rate
        base_score = (passed / total) * 100
        
        # Adjust based on test execution consistency
        consistency_bonus = self._calculate_consistency_bonus()
        
        return min(100, base_score + consistency_bonus)
    
    def _calculate_reliability_score(self) -> float:
        """Calculate test reliability score"""
        if not self.test_results:
            return 0.0
        
        # Count stable tests (same result across multiple runs if available)
        # For now, use pass rate as reliability indicator
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        total = len(self.test_results)
        
        return (passed / total * 100) if total > 0 else 0.0
    
    def _calculate_test_effectiveness(self) -> float:
        """Calculate test effectiveness score"""
        if not self.test_results:
            return 0.0
        
        # Consider tests that actually found defects
        # This is a simplified calculation
        failed_tests = len([r for r in self.test_results if r.get('status') == 'FAILED'])
        total_tests = len(self.test_results)
        
        # Higher failure rate might indicate effective testing (finding issues)
        # but too high suggests poor quality
        if total_tests == 0:
            return 0.0
        
        failure_rate = failed_tests / total_tests
        
        # Optimal failure rate between 5-15%
        if 0.05 <= failure_rate <= 0.15:
            effectiveness = 100
        elif failure_rate < 0.05:
            effectiveness = 70 + (failure_rate / 0.05) * 30  # Scale up to 100
        else:
            effectiveness = max(0, 100 - (failure_rate - 0.15) * 200)  # Scale down
        
        return min(100, effectiveness)
    
    def _calculate_consistency_bonus(self) -> float:
        """Calculate consistency bonus for quality score"""
        # Simple implementation - can be enhanced
        return 5.0  # Default bonus
    
    def _analyze_quality_by_category(self) -> Dict[str, Dict[str, Any]]:
        """Analyze quality metrics by test category"""
        categories = {}
        
        for result in self.test_results:
            category = result.get('category', 'Unknown')
            if category not in categories:
                categories[category] = {'total': 0, 'passed': 0, 'failed': 0}
            
            categories[category]['total'] += 1
            if result.get('status') == 'PASSED':
                categories[category]['passed'] += 1
            else:
                categories[category]['failed'] += 1
        
        # Calculate pass rates
        for category in categories:
            total = categories[category]['total']
            passed = categories[category]['passed']
            categories[category]['pass_rate'] = (passed / total * 100) if total > 0 else 0
        
        return categories
    
    def _analyze_quality_trends(self) -> Dict[str, Any]:
        """Analyze quality trends over time"""
        # Group by timestamp and calculate daily quality
        daily_quality = defaultdict(lambda: {'total': 0, 'passed': 0})
        
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    date = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).date()
                    daily_quality[date.isoformat()]['total'] += 1
                    if result.get('status') == 'PASSED':
                        daily_quality[date.isoformat()]['passed'] += 1
            except (ValueError, TypeError):
                continue
        
        # Calculate daily pass rates
        quality_trends = []
        for date, data in sorted(daily_quality.items()):
            pass_rate = (data['passed'] / data['total'] * 100) if data['total'] > 0 else 0
            quality_trends.append({
                'date': date,
                'pass_rate': pass_rate,
                'total_tests': data['total'],
                'passed_tests': data['passed']
            })
        
        return {'daily_trends': quality_trends}
    
    def _generate_quality_recommendations(self) -> List[str]:
        """Generate recommendations based on quality analysis"""
        recommendations = []
        
        if not self.test_results:
            return ['No test results available for analysis']
        
        total = len(self.test_results)
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        if pass_rate < 80:
            recommendations.append("Test quality is below acceptable threshold. Review failed tests and fix underlying issues.")
        
        if pass_rate > 95:
            recommendations.append("Test quality is excellent. Consider increasing test coverage or complexity.")
        
        # Check for performance issues
        slow_tests = [r for r in self.test_results if r.get('duration', 0) > 30]
        if slow_tests:
            recommendations.append(f"Found {len(slow_tests)} slow tests (>30s). Consider optimization.")
        
        # Check for flaky tests (simplified)
        failed_tests = [r for r in self.test_results if r.get('status') == 'FAILED']
        if len(failed_tests) > total * 0.2:
            recommendations.append("High failure rate detected. Review test environment and stability.")
        
        if not recommendations:
            recommendations.append("Test quality is good. Continue monitoring and maintaining test suite.")
        
        return recommendations
    
    def _analyze_test_coverage(self) -> Dict[str, Any]:
        """Analyze test coverage metrics"""
        # Analyze coverage by different dimensions
        coverage_analysis = {
            'by_category': self._calculate_coverage_by_category(),
            'by_suite': self._calculate_coverage_by_suite(),
            'by_priority': self._calculate_coverage_by_priority(),
            'coverage_gaps': self._identify_coverage_gaps()
        }
        
        return coverage_analysis
    
    def _calculate_coverage_by_category(self) -> Dict[str, int]:
        """Calculate test count by category"""
        return dict(Counter(result.get('category', 'Unknown') for result in self.test_results))
    
    def _calculate_coverage_by_suite(self) -> Dict[str, int]:
        """Calculate test count by suite"""
        return dict(Counter(result.get('suite', 'Unknown') for result in self.test_results))
    
    def _calculate_coverage_by_priority(self) -> Dict[str, int]:
        """Calculate test count by priority"""
        return dict(Counter(result.get('priority', 'medium') for result in self.test_results))
    
    def _identify_coverage_gaps(self) -> List[str]:
        """Identify potential coverage gaps"""
        gaps = []
        
        categories = set(result.get('category', 'Unknown') for result in self.test_results)
        if len(categories) < 3:
            gaps.append("Limited test categories detected. Consider broader coverage.")
        
        priorities = set(result.get('priority', 'medium') for result in self.test_results)
        if 'high' not in priorities:
            gaps.append("No high-priority tests found. Add critical path tests.")
        
        return gaps
    
    def _filter_by_time_period(self, time_period: str) -> List[Dict[str, Any]]:
        """Filter test results by time period"""
        if not self.test_results:
            return []
        
        now = datetime.now()
        
        if time_period == '1d':
            cutoff = now - timedelta(days=1)
        elif time_period == '7d':
            cutoff = now - timedelta(days=7)
        elif time_period == '30d':
            cutoff = now - timedelta(days=30)
        else:
            return self.test_results
        
        filtered = []
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    result_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    if result_time >= cutoff:
                        filtered.append(result)
            except (ValueError, TypeError):
                continue
        
        return filtered
    
    def _analyze_pass_rate_trend(self, filtered_results: List[Dict]) -> Dict[str, Any]:
        """Analyze pass rate trends"""
        if not filtered_results:
            return {}
        
        total = len(filtered_results)
        passed = len([r for r in filtered_results if r.get('status') == 'PASSED'])
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        return {
            'current_pass_rate': pass_rate,
            'trend': 'stable'  # Simplified - could be enhanced with historical data
        }
    
    def _analyze_performance_trend(self, filtered_results: List[Dict]) -> Dict[str, Any]:
        """Analyze performance trends"""
        durations = [r.get('duration', 0) for r in filtered_results]
        
        if not durations:
            return {}
        
        return {
            'avg_duration': statistics.mean(durations),
            'trend': 'stable'  # Simplified
        }
    
    def _analyze_stability(self, filtered_results: List[Dict]) -> Dict[str, Any]:
        """Analyze test execution stability"""
        failed_count = len([r for r in filtered_results if r.get('status') in ['FAILED', 'ERROR']])
        total_count = len(filtered_results)
        
        stability_score = ((total_count - failed_count) / total_count * 100) if total_count > 0 else 0
        
        return {
            'stability_score': stability_score,
            'stability_level': 'high' if stability_score > 90 else 'medium' if stability_score > 70 else 'low'
        }
    
    def _identify_improvement_areas(self, filtered_results: List[Dict]) -> List[str]:
        """Identify areas for improvement"""
        areas = []
        
        failed_tests = [r for r in filtered_results if r.get('status') in ['FAILED', 'ERROR']]
        if failed_tests:
            areas.append(f"Address {len(failed_tests)} failing tests")
        
        slow_tests = [r for r in filtered_results if r.get('duration', 0) > 20]
        if slow_tests:
            areas.append(f"Optimize {len(slow_tests)} slow tests")
        
        return areas
    
    def _identify_peak_failure_times(self, filtered_results: List[Dict]) -> List[Dict[str, Any]]:
        """Identify times with highest failure rates"""
        # Group failures by hour
        hourly_failures = defaultdict(int)
        
        for result in filtered_results:
            if result.get('status') in ['FAILED', 'ERROR']:
                timestamp = result.get('timestamp', '')
                try:
                    if timestamp:
                        hour = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).hour
                        hourly_failures[hour] += 1
                except (ValueError, TypeError):
                    continue
        
        # Return top 3 hours with most failures
        sorted_hours = sorted(hourly_failures.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return [
            {'hour': hour, 'failure_count': count}
            for hour, count in sorted_hours
        ]
    
    def _generate_key_findings(self) -> List[str]:
        """Generate key findings from test data"""
        findings = []
        
        if not self.test_results:
            return ['No test results available for analysis']
        
        total = len(self.test_results)
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        findings.append(f"Overall pass rate: {pass_rate:.1f}%")
        
        if pass_rate < 80:
            findings.append("Test quality needs improvement")
        elif pass_rate > 95:
            findings.append("Test quality is excellent")
        
        # Find most problematic suite
        suite_performance = defaultdict(list)
        for result in self.test_results:
            suite = result.get('suite', 'Unknown')
            suite_performance[suite].append(result.get('status') == 'PASSED')
        
        worst_suite = None
        worst_rate = 100
        for suite, statuses in suite_performance.items():
            rate = sum(statuses) / len(statuses) * 100
            if rate < worst_rate:
                worst_rate = rate
                worst_suite = suite
        
        if worst_suite and worst_rate < 80:
            findings.append(f"'{worst_suite}' suite has lowest pass rate ({worst_rate:.1f}%)")
        
        return findings
    
    def _identify_critical_issues(self) -> List[str]:
        """Identify critical issues in test results"""
        issues = []
        
        # Check for high failure rate
        total = len(self.test_results)
        failed = len([r for r in self.test_results if r.get('status') in ['FAILED', 'ERROR']])
        
        if total > 0 and failed / total > 0.3:
            issues.append(f"High failure rate: {failed}/{total} tests failed")
        
        # Check for very slow tests
        slow_tests = [r for r in self.test_results if r.get('duration', 0) > 60]
        if slow_tests:
            issues.append(f"Found {len(slow_tests)} tests taking longer than 60 seconds")
        
        # Check for flaky tests (simplified)
        test_names = [r.get('name', '') for r in self.test_results]
        name_counts = Counter(test_names)
        flaky_tests = [name for name, count in name_counts.items() if count > 1]
        if flaky_tests:
            issues.append(f"Detected {len(flaky_tests)} potentially flaky tests")
        
        return issues
    
    def _identify_optimization_opportunities(self) -> List[str]:
        """Identify optimization opportunities"""
        opportunities = []
        
        # Performance optimization
        avg_duration = statistics.mean([r.get('duration', 0) for r in self.test_results])
        if avg_duration > 10:
            opportunities.append(f"Average test duration is {avg_duration:.1f}s - consider optimization")
        
        # Test organization
        categories = set(r.get('category', 'Unknown') for r in self.test_results)
        if len(categories) > 10:
            opportunities.append("Large number of test categories - consider reorganization")
        
        # Parallel execution potential
        if len(self.test_results) > 50:
            opportunities.append("Large test suite - consider parallel execution")
        
        return opportunities
    
    def _assess_risks(self) -> Dict[str, str]:
        """Assess risks based on test results"""
        risks = {'overall': 'low', 'performance': 'low', 'quality': 'low', 'stability': 'low'}
        
        if not self.test_results:
            risks['overall'] = 'unknown'
            return risks
        
        total = len(self.test_results)
        failed = len([r for r in self.test_results if r.get('status') in ['FAILED', 'ERROR']])
        failure_rate = failed / total if total > 0 else 0
        
        avg_duration = statistics.mean([r.get('duration', 0) for r in self.test_results])
        
        # Overall risk assessment
        if failure_rate > 0.3:
            risks['overall'] = 'high'
            risks['quality'] = 'high'
        elif failure_rate > 0.1:
            risks['overall'] = 'medium'
            risks['quality'] = 'medium'
        
        # Performance risk
        if avg_duration > 30:
            risks['performance'] = 'high'
        elif avg_duration > 10:
            risks['performance'] = 'medium'
        
        # Stability risk
        if failure_rate > 0.2:
            risks['stability'] = 'high'
        elif failure_rate > 0.1:
            risks['stability'] = 'medium'
        
        return risks
    
    def _generate_action_items(self) -> List[Dict[str, Any]]:
        """Generate actionable items based on analysis"""
        action_items = []
        
        if not self.test_results:
            return [{'priority': 'high', 'action': 'Run tests to get baseline metrics', 'category': 'setup'}]
        
        failed_tests = [r for r in self.test_results if r.get('status') in ['FAILED', 'ERROR']]
        slow_tests = [r for r in self.test_results if r.get('duration', 0) > 20]
        
        if failed_tests:
            action_items.append({
                'priority': 'high',
                'action': f'Fix {len(failed_tests)} failing tests',
                'category': 'quality',
                'details': 'Address failed tests to improve pass rate'
            })
        
        if slow_tests:
            action_items.append({
                'priority': 'medium',
                'action': f'Optimize {len(slow_tests)} slow tests',
                'category': 'performance',
                'details': 'Reduce execution time for slow tests'
            })
        
        # Add general maintenance items
        action_items.append({
            'priority': 'low',
            'action': 'Review and update test documentation',
            'category': 'maintenance',
            'details': 'Keep test documentation current and accurate'
        })
        
        return action_items
    
    def _generate_executive_summary(self) -> str:
        """Generate executive summary of test analysis"""
        if not self.test_results:
            return "No test results available for analysis."
        
        total = len(self.test_results)
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        pass_rate = (passed / total * 100) if total > 0 else 0
        avg_duration = statistics.mean([r.get('duration', 0) for r in self.test_results])
        
        summary = f"""
        Test Execution Summary:
        - Total Tests: {total}
        - Pass Rate: {pass_rate:.1f}%
        - Average Duration: {avg_duration:.1f}s
        
        Quality Assessment: {'Good' if pass_rate > 90 else 'Needs Improvement' if pass_rate > 70 else 'Poor'}
        Performance: {'Good' if avg_duration < 5 else 'Needs Optimization' if avg_duration < 15 else 'Poor'}
        """
        
        return summary.strip()
