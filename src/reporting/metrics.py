"""
Metrics Calculator

Calculate various test metrics and KPIs:
- Test execution metrics
- Quality metrics
- Performance metrics
- Coverage metrics
- Trend analysis
- Comparative metrics
"""

import statistics
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter


class MetricsCalculator:
    """Calculate comprehensive test metrics"""
    
    def __init__(self, test_results: List[Dict[str, Any]]):
        self.test_results = test_results
        self.metrics_cache = {}
    
    def calculate_all_metrics(self) -> Dict[str, Any]:
        """Calculate all available metrics"""
        return {
            'execution_metrics': self.calculate_execution_metrics(),
            'quality_metrics': self.calculate_quality_metrics(),
            'performance_metrics': self.calculate_performance_metrics(),
            'coverage_metrics': self.calculate_coverage_metrics(),
            'trend_metrics': self.calculate_trend_metrics(),
            'comparative_metrics': self.calculate_comparative_metrics(),
            'kpi_summary': self.calculate_kpi_summary()
        }
    
    def calculate_execution_metrics(self) -> Dict[str, Any]:
        """Calculate test execution metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Basic counts
        total_tests = len(self.test_results)
        passed_tests = [r for r in self.test_results if r.get('status') == 'PASSED']
        failed_tests = [r for r in self.test_results if r.get('status') == 'FAILED']
        skipped_tests = [r for r in self.test_results if r.get('status') == 'SKIPPED']
        error_tests = [r for r in self.test_results if r.get('status') == 'ERROR']
        
        # Calculate percentages
        pass_rate = len(passed_tests) / total_tests * 100 if total_tests > 0 else 0
        failure_rate = len(failed_tests) / total_tests * 100 if total_tests > 0 else 0
        skip_rate = len(skipped_tests) / total_tests * 100 if total_tests > 0 else 0
        error_rate = len(error_tests) / total_tests * 100 if total_tests > 0 else 0
        
        # Time metrics
        durations = [r.get('duration', 0) for r in self.test_results]
        total_duration = sum(durations)
        avg_duration = statistics.mean(durations) if durations else 0
        
        # Execution breakdown by time
        execution_timeline = self._analyze_execution_timeline()
        
        return {
            'total_tests': total_tests,
            'passed_tests': len(passed_tests),
            'failed_tests': len(failed_tests),
            'skipped_tests': len(skipped_tests),
            'error_tests': len(error_tests),
            'pass_rate': round(pass_rate, 2),
            'failure_rate': round(failure_rate, 2),
            'skip_rate': round(skip_rate, 2),
            'error_rate': round(error_rate, 2),
            'total_duration': round(total_duration, 2),
            'avg_duration': round(avg_duration, 2),
            'execution_timeline': execution_timeline,
            'execution_efficiency': self._calculate_execution_efficiency(durations)
        }
    
    def calculate_quality_metrics(self) -> Dict[str, Any]:
        """Calculate test quality metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Quality indicators
        reliability_score = self._calculate_reliability_score()
        maintainability_score = self._calculate_maintainability_score()
        effectiveness_score = self._calculate_effectiveness_score()
        
        # Quality by dimensions
        quality_by_category = self._analyze_quality_by_category()
        quality_by_suite = self._analyze_quality_by_suite()
        quality_by_priority = self._analyze_quality_by_priority()
        
        # Quality trends
        quality_trends = self._analyze_quality_trends()
        
        # Defect detection metrics
        defect_metrics = self._calculate_defect_metrics()
        
        return {
            'overall_quality_score': round(reliability_score, 2),
            'reliability_score': round(reliability_score, 2),
            'maintainability_score': round(maintainability_score, 2),
            'effectiveness_score': round(effectiveness_score, 2),
            'quality_by_category': quality_by_category,
            'quality_by_suite': quality_by_suite,
            'quality_by_priority': quality_by_priority,
            'quality_trends': quality_trends,
            'defect_metrics': defect_metrics,
            'test_stability': self._calculate_test_stability()
        }
    
    def calculate_performance_metrics(self) -> Dict[str, Any]:
        """Calculate test performance metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        durations = [r.get('duration', 0) for r in self.test_results]
        
        # Duration statistics
        duration_stats = {
            'min': round(min(durations), 2) if durations else 0,
            'max': round(max(durations), 2) if durations else 0,
            'mean': round(statistics.mean(durations), 2) if durations else 0,
            'median': round(statistics.median(durations), 2) if durations else 0,
            'std_dev': round(statistics.stdev(durations), 2) if len(durations) > 1 else 0,
            'variance': round(statistics.variance(durations), 2) if len(durations) > 1 else 0
        }
        
        # Performance distribution
        performance_distribution = self._analyze_performance_distribution(durations)
        
        # Slowest and fastest tests
        performance_outliers = self._identify_performance_outliers()
        
        # Performance trends
        performance_trends = self._analyze_performance_trends()
        
        # Resource utilization (estimated)
        resource_metrics = self._estimate_resource_utilization(durations)
        
        return {
            'duration_statistics': duration_stats,
            'performance_distribution': performance_distribution,
            'performance_outliers': performance_outliers,
            'performance_trends': performance_trends,
            'resource_metrics': resource_metrics,
            'bottleneck_analysis': self._analyze_bottlenecks()
        }
    
    def calculate_coverage_metrics(self) -> Dict[str, Any]:
        """Calculate test coverage metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Coverage by dimensions
        coverage_by_category = self._analyze_coverage_by_dimension('category')
        coverage_by_suite = self._analyze_coverage_by_dimension('suite')
        coverage_by_priority = self._analyze_coverage_by_dimension('priority')
        coverage_by_type = self._analyze_coverage_by_dimension('test_type')
        
        # Coverage gaps
        coverage_gaps = self._identify_coverage_gaps()
        
        # Coverage depth
        coverage_depth = self._analyze_coverage_depth()
        
        # Feature coverage (if applicable)
        feature_coverage = self._analyze_feature_coverage()
        
        return {
            'coverage_by_category': coverage_by_category,
            'coverage_by_suite': coverage_by_suite,
            'coverage_by_priority': coverage_by_priority,
            'coverage_by_type': coverage_by_type,
            'coverage_gaps': coverage_gaps,
            'coverage_depth': coverage_depth,
            'feature_coverage': feature_coverage,
            'overall_coverage_score': self._calculate_overall_coverage_score()
        }
    
    def calculate_trend_metrics(self) -> Dict[str, Any]:
        """Calculate trend analysis metrics"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Time-based grouping
        daily_trends = self._analyze_daily_trends()
        weekly_trends = self._analyze_weekly_trends()
        hourly_trends = self._analyze_hourly_trends()
        
        # Trend analysis
        pass_rate_trend = self._analyze_pass_rate_trend()
        performance_trend = self._analyze_performance_trend()
        stability_trend = self._analyze_stability_trend()
        
        # Predictive metrics
        predictive_metrics = self._calculate_predictive_metrics()
        
        # Seasonal patterns
        seasonal_patterns = self._analyze_seasonal_patterns()
        
        return {
            'daily_trends': daily_trends,
            'weekly_trends': weekly_trends,
            'hourly_trends': hourly_trends,
            'pass_rate_trend': pass_rate_trend,
            'performance_trend': performance_trend,
            'stability_trend': stability_trend,
            'predictive_metrics': predictive_metrics,
            'seasonal_patterns': seasonal_patterns
        }
    
    def calculate_comparative_metrics(self) -> Dict[str, Any]:
        """Calculate comparative metrics (benchmarks)"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        # Industry benchmarks
        industry_benchmarks = self._compare_to_industry_benchmarks()
        
        # Historical comparison (if date available)
        historical_comparison = self._compare_to_historical_data()
        
        # Environment comparison
        environment_comparison = self._compare_across_environments()
        
        # Test type comparison
        test_type_comparison = self._compare_test_types()
        
        return {
            'industry_benchmarks': industry_benchmarks,
            'historical_comparison': historical_comparison,
            'environment_comparison': environment_comparison,
            'test_type_comparison': test_type_comparison,
            'benchmark_scores': self._calculate_benchmark_scores()
        }
    
    def calculate_kpi_summary(self) -> Dict[str, Any]:
        """Calculate key performance indicators summary"""
        if not self.test_results:
            return {'error': 'No test results available'}
        
        execution_metrics = self.calculate_execution_metrics()
        quality_metrics = self.calculate_quality_metrics()
        performance_metrics = self.calculate_performance_metrics()
        
        # Key KPIs
        kpis = {
            'test_pass_rate': execution_metrics.get('pass_rate', 0),
            'test_reliability': quality_metrics.get('reliability_score', 0),
            'test_performance': performance_metrics.get('duration_statistics', {}).get('mean', 0),
            'test_coverage': self.calculate_coverage_metrics().get('overall_coverage_score', 0),
            'execution_efficiency': execution_metrics.get('execution_efficiency', 0)
        }
        
        # Status assessment
        status_assessment = self._assess_kpi_status(kpis)
        
        # Action recommendations
        recommendations = self._generate_recommendations(kpis, status_assessment)
        
        return {
            'kpis': kpis,
            'status_assessment': status_assessment,
            'recommendations': recommendations,
            'overall_health_score': self._calculate_overall_health_score(kpis),
            'priority_actions': self._identify_priority_actions(kpis, status_assessment)
        }
    
    def _analyze_execution_timeline(self) -> Dict[str, Any]:
        """Analyze execution timeline patterns"""
        timeline_data = defaultdict(int)
        
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    hour_key = dt.strftime('%H:00')
                    timeline_data[hour_key] += 1
            except (ValueError, TypeError):
                continue
        
        return {
            'peak_hours': dict(sorted(timeline_data.items(), key=lambda x: x[1], reverse=True)[:5]),
            'timeline_distribution': dict(timeline_data)
        }
    
    def _calculate_execution_efficiency(self, durations: List[float]) -> float:
        """Calculate execution efficiency score"""
        if not durations:
            return 0.0
        
        # Efficiency based on average duration and consistency
        avg_duration = statistics.mean(durations)
        std_dev = statistics.stdev(durations) if len(durations) > 1 else 0
        
        # Lower duration and lower variance = higher efficiency
        duration_score = max(0, 100 - avg_duration * 2)  # Penalize long durations
        consistency_score = max(0, 100 - std_dev * 5)    # Penalize high variance
        
        return round((duration_score + consistency_score) / 2, 2)
    
    def _calculate_reliability_score(self) -> float:
        """Calculate test reliability score"""
        if not self.test_results:
            return 0.0
        
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        total = len(self.test_results)
        
        # Base reliability on pass rate
        base_score = (passed / total * 100) if total > 0 else 0
        
        # Adjust for test stability (simplified)
        # In a real implementation, you'd track multiple runs of same tests
        stability_bonus = 5  # Assume reasonable stability for now
        
        return min(100, base_score + stability_bonus)
    
    def _calculate_maintainability_score(self) -> float:
        """Calculate test maintainability score"""
        if not self.test_results:
            return 0.0
        
        # Factors affecting maintainability:
        # 1. Test organization (categories, suites)
        # 2. Test naming consistency
        # 3. Documentation (implicit from structure)
        
        categories = set(r.get('category', '') for r in self.test_results)
        suites = set(r.get('suite', '') for r in self.test_results)
        
        # Score based on organization
        org_score = min(100, (len(categories) + len(suites)) * 10)
        
        # Naming consistency (simplified)
        names = [r.get('name', '') for r in self.test_results]
        avg_name_length = statistics.mean([len(name) for name in names if name])
        naming_score = min(100, avg_name_length * 2)
        
        return round((org_score + naming_score) / 2, 2)
    
    def _calculate_effectiveness_score(self) -> float:
        """Calculate test effectiveness score"""
        if not self.test_results:
            return 0.0
        
        failed_tests = len([r for r in self.test_results if r.get('status') == 'FAILED'])
        total_tests = len(self.test_results)
        
        if total_tests == 0:
            return 0.0
        
        failure_rate = failed_tests / total_tests
        
        # Optimal failure rate is between 5-15% (tests should find some issues)
        if 0.05 <= failure_rate <= 0.15:
            effectiveness = 100
        elif failure_rate < 0.05:
            effectiveness = 70 + (failure_rate / 0.05) * 30
        else:
            effectiveness = max(0, 100 - (failure_rate - 0.15) * 200)
        
        return round(effectiveness, 2)
    
    def _analyze_quality_by_category(self) -> Dict[str, Dict[str, Any]]:
        """Analyze quality metrics by category"""
        category_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0})
        
        for result in self.test_results:
            category = result.get('category', 'Unknown')
            category_data[category]['total'] += 1
            if result.get('status') == 'PASSED':
                category_data[category]['passed'] += 1
            else:
                category_data[category]['failed'] += 1
        
        # Calculate pass rates
        for category in category_data:
            total = category_data[category]['total']
            passed = category_data[category]['passed']
            category_data[category]['pass_rate'] = round(passed / total * 100, 2) if total > 0 else 0
        
        return dict(category_data)
    
    def _analyze_quality_by_suite(self) -> Dict[str, Dict[str, Any]]:
        """Analyze quality metrics by test suite"""
        suite_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0})
        
        for result in self.test_results:
            suite = result.get('suite', 'Unknown')
            suite_data[suite]['total'] += 1
            if result.get('status') == 'PASSED':
                suite_data[suite]['passed'] += 1
            else:
                suite_data[suite]['failed'] += 1
        
        # Calculate pass rates
        for suite in suite_data:
            total = suite_data[suite]['total']
            passed = suite_data[suite]['passed']
            suite_data[suite]['pass_rate'] = round(passed / total * 100, 2) if total > 0 else 0
        
        return dict(suite_data)
    
    def _analyze_quality_by_priority(self) -> Dict[str, Dict[str, Any]]:
        """Analyze quality metrics by test priority"""
        priority_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0})
        
        for result in self.test_results:
            priority = result.get('priority', 'medium')
            priority_data[priority]['total'] += 1
            if result.get('status') == 'PASSED':
                priority_data[priority]['passed'] += 1
            else:
                priority_data[priority]['failed'] += 1
        
        # Calculate pass rates
        for priority in priority_data:
            total = priority_data[priority]['total']
            passed = priority_data[priority]['passed']
            priority_data[priority]['pass_rate'] = round(passed / total * 100, 2) if total > 0 else 0
        
        return dict(priority_data)
    
    def _analyze_quality_trends(self) -> Dict[str, Any]:
        """Analyze quality trends over time"""
        # This is a simplified version - would need historical data for real trends
        current_quality = self._calculate_reliability_score()
        
        return {
            'current_quality_score': current_quality,
            'trend_direction': 'stable',  # Would need historical data
            'quality_score_change': 0  # Would need baseline for comparison
        }
    
    def _calculate_defect_metrics(self) -> Dict[str, Any]:
        """Calculate defect detection metrics"""
        failed_tests = [r for r in self.test_results if r.get('status') == 'FAILED']
        
        if not failed_tests:
            return {
                'defects_found': 0,
                'defect_detection_rate': 0,
                'defect_density': 0,
                'defect_types': {}
            }
        
        # Analyze defect types (simplified)
        defect_types = {}
        for test in failed_tests:
            error_msg = test.get('error_details', '') or test.get('message', '')
            
            # Simple categorization
            if 'timeout' in error_msg.lower():
                defect_types['timeout'] = defect_types.get('timeout', 0) + 1
            elif 'assertion' in error_msg.lower():
                defect_types['assertion'] = defect_types.get('assertion', 0) + 1
            elif 'connection' in error_msg.lower():
                defect_types['connection'] = defect_types.get('connection', 0) + 1
            else:
                defect_types['other'] = defect_types.get('other', 0) + 1
        
        total_tests = len(self.test_results)
        
        return {
            'defects_found': len(failed_tests),
            'defect_detection_rate': round(len(failed_tests) / total_tests * 100, 2),
            'defect_density': round(len(failed_tests) / total_tests, 3),
            'defect_types': defect_types
        }
    
    def _calculate_test_stability(self) -> float:
        """Calculate test stability score"""
        # Simplified stability calculation
        # In reality, would track multiple runs of same tests
        
        total_tests = len(self.test_results)
        failed_tests = len([r for r in self.test_results if r.get('status') in ['FAILED', 'ERROR']])
        
        if total_tests == 0:
            return 0.0
        
        stability = (total_tests - failed_tests) / total_tests * 100
        return round(stability, 2)
    
    def _analyze_performance_distribution(self, durations: List[float]) -> Dict[str, int]:
        """Analyze performance distribution"""
        if not durations:
            return {}
        
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
        
        return buckets
    
    def _identify_performance_outliers(self) -> Dict[str, List[Dict[str, Any]]]:
        """Identify performance outliers"""
        if not self.test_results:
            return {'slow_tests': [], 'fast_tests': []}
        
        durations = [r.get('duration', 0) for r in self.test_results]
        mean_duration = statistics.mean(durations)
        std_dev = statistics.stdev(durations) if len(durations) > 1 else 0
        
        threshold = mean_duration + (2 * std_dev) if std_dev > 0 else mean_duration * 2
        
        slow_tests = []
        fast_tests = []
        
        for result in self.test_results:
            duration = result.get('duration', 0)
            test_info = {
                'name': result.get('name', ''),
                'duration': duration,
                'suite': result.get('suite', ''),
                'deviation': round(duration - mean_duration, 2)
            }
            
            if duration > threshold:
                slow_tests.append(test_info)
            elif duration < mean_duration * 0.1:  # Very fast tests
                fast_tests.append(test_info)
        
        return {
            'slow_tests': sorted(slow_tests, key=lambda x: x['duration'], reverse=True)[:10],
            'fast_tests': sorted(fast_tests, key=lambda x: x['duration'])[:10]
        }
    
    def _analyze_performance_trends(self) -> Dict[str, Any]:
        """Analyze performance trends"""
        # Simplified - would need historical data for real trends
        durations = [r.get('duration', 0) for r in self.test_results]
        
        if not durations:
            return {}
        
        return {
            'avg_duration_trend': 'stable',
            'performance_score': min(100, max(0, 100 - statistics.mean(durations))),
            'performance_change': 0  # Would need baseline
        }
    
    def _estimate_resource_utilization(self, durations: List[float]) -> Dict[str, Any]:
        """Estimate resource utilization metrics"""
        if not durations:
            return {}
        
        total_time = sum(durations)
        avg_time = statistics.mean(durations)
        
        # Estimated CPU utilization (simplified model)
        estimated_cpu_utilization = min(100, (total_time / len(durations)) * 10)
        
        # Estimated memory usage patterns
        memory_pattern = 'normal' if avg_time < 10 else 'high' if avg_time < 30 else 'very_high'
        
        return {
            'estimated_cpu_utilization': round(estimated_cpu_utilization, 2),
            'memory_usage_pattern': memory_pattern,
            'resource_efficiency': min(100, max(0, 100 - estimated_cpu_utilization))
        }
    
    def _analyze_bottlenecks(self) -> List[Dict[str, Any]]:
        """Analyze potential bottlenecks"""
        bottlenecks = []
        
        slow_tests = [r for r in self.test_results if r.get('duration', 0) > 30]
        
        for test in slow_tests:
            bottlenecks.append({
                'test_name': test.get('name', ''),
                'duration': test.get('duration', 0),
                'suite': test.get('suite', ''),
                'bottleneck_type': 'performance',
                'recommendation': 'Consider optimization or parallel execution'
            })
        
        return bottlenecks
    
    def _analyze_coverage_by_dimension(self, dimension: str) -> Dict[str, int]:
        """Analyze coverage by specified dimension"""
        return dict(Counter(result.get(dimension, 'Unknown') for result in self.test_results))
    
    def _identify_coverage_gaps(self) -> List[Dict[str, Any]]:
        """Identify coverage gaps"""
        gaps = []
        
        categories = set(r.get('category', '') for r in self.test_results)
        priorities = set(r.get('priority', 'medium') for r in self.test_results)
        
        if len(categories) < 3:
            gaps.append({
                'type': 'category_coverage',
                'description': 'Limited test categories',
                'current_count': len(categories),
                'recommendation': 'Expand test coverage to more categories'
            })
        
        if 'high' not in priorities:
            gaps.append({
                'type': 'priority_coverage',
                'description': 'No high priority tests',
                'recommendation': 'Add high priority tests for critical functionality'
            })
        
        return gaps
    
    def _analyze_coverage_depth(self) -> Dict[str, Any]:
        """Analyze test coverage depth"""
        # Simplified coverage depth analysis
        total_tests = len(self.test_results)
        
        # Calculate coverage depth score based on test organization
        categories = set(r.get('category', '') for r in self.test_results)
        suites = set(r.get('suite', '') for r in self.test_results)
        
        depth_score = min(100, (len(categories) + len(suites)) * 5)
        
        return {
            'coverage_depth_score': depth_score,
            'category_diversity': len(categories),
            'suite_diversity': len(suites),
            'depth_assessment': 'high' if depth_score > 80 else 'medium' if depth_score > 50 else 'low'
        }
    
    def _analyze_feature_coverage(self) -> Dict[str, Any]:
        """Analyze feature coverage (if applicable)"""
        # This would require mapping tests to features
        # Simplified implementation
        
        features_tested = set()
        for result in self.test_results:
            # Extract potential features from test names or categories
            name = result.get('name', '').lower()
            category = result.get('category', '').lower()
            
            if 'login' in name or 'auth' in category:
                features_tested.add('authentication')
            if 'search' in name or 'search' in category:
                features_tested.add('search')
            if 'payment' in name or 'payment' in category:
                features_tested.add('payment')
        
        return {
            'features_covered': list(features_tested),
            'coverage_count': len(features_tested),
            'estimated_coverage_percentage': min(100, len(features_tested) * 20)  # Rough estimate
        }
    
    def _calculate_overall_coverage_score(self) -> float:
        """Calculate overall coverage score"""
        total_tests = len(self.test_results)
        if total_tests == 0:
            return 0.0
        
        # Score based on diversity and organization
        categories = set(r.get('category', '') for r in self.test_results)
        priorities = set(r.get('priority', 'medium') for r in self.test_results)
        types = set(r.get('test_type', 'functional') for r in self.test_results)
        
        diversity_score = min(100, (len(categories) + len(priorities) + len(types)) * 10)
        organization_score = min(100, total_tests * 0.5)  # Reward having more tests
        
        return round((diversity_score + organization_score) / 2, 2)
    
    def _analyze_daily_trends(self) -> Dict[str, Any]:
        """Analyze daily execution trends"""
        daily_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0})
        
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    date = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).date().isoformat()
                    daily_data[date]['total'] += 1
                    if result.get('status') == 'PASSED':
                        daily_data[date]['passed'] += 1
                    else:
                        daily_data[date]['failed'] += 1
            except (ValueError, TypeError):
                continue
        
        # Calculate pass rates
        for date in daily_data:
            total = daily_data[date]['total']
            passed = daily_data[date]['passed']
            daily_data[date]['pass_rate'] = round(passed / total * 100, 2) if total > 0 else 0
        
        return dict(daily_data)
    
    def _analyze_weekly_trends(self) -> Dict[str, Any]:
        """Analyze weekly execution trends"""
        weekly_data = defaultdict(lambda: {'total': 0, 'passed': 0, 'failed': 0})
        
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    # Get Monday of the week
                    monday = dt - timedelta(days=dt.weekday())
                    week_key = monday.date().isoformat()
                    weekly_data[week_key]['total'] += 1
                    if result.get('status') == 'PASSED':
                        weekly_data[week_key]['passed'] += 1
                    else:
                        weekly_data[week_key]['failed'] += 1
            except (ValueError, TypeError):
                continue
        
        # Calculate pass rates
        for week in weekly_data:
            total = weekly_data[week]['total']
            passed = weekly_data[week]['passed']
            weekly_data[week]['pass_rate'] = round(passed / total * 100, 2) if total > 0 else 0
        
        return dict(weekly_data)
    
    def _analyze_hourly_trends(self) -> Dict[str, int]:
        """Analyze hourly execution patterns"""
        hourly_data = defaultdict(int)
        
        for result in self.test_results:
            timestamp = result.get('timestamp', '')
            try:
                if timestamp:
                    hour = datetime.fromisoformat(timestamp.replace('Z', '+00:00')).hour
                    hourly_data[hour] += 1
            except (ValueError, TypeError):
                continue
        
        return dict(hourly_data)
    
    def _analyze_pass_rate_trend(self) -> Dict[str, Any]:
        """Analyze pass rate trends"""
        # Simplified trend analysis
        passed = len([r for r in self.test_results if r.get('status') == 'PASSED'])
        total = len(self.test_results)
        current_pass_rate = (passed / total * 100) if total > 0 else 0
        
        return {
            'current_pass_rate': round(current_pass_rate, 2),
            'trend_direction': 'stable',  # Would need historical data
            'trend_strength': 'weak'  # Would need more data points
        }
    
    def _analyze_performance_trend(self) -> Dict[str, Any]:
        """Analyze performance trends"""
        durations = [r.get('duration', 0) for r in self.test_results]
        avg_duration = statistics.mean(durations) if durations else 0
        
        return {
            'current_avg_duration': round(avg_duration, 2),
            'trend_direction': 'stable',
            'performance_health': 'good' if avg_duration < 10 else 'needs_improvement'
        }
    
    def _analyze_stability_trend(self) -> Dict[str, Any]:
        """Analyze stability trends"""
        failed = len([r for r in self.test_results if r.get('status') in ['FAILED', 'ERROR']])
        total = len(self.test_results)
        stability = ((total - failed) / total * 100) if total > 0 else 0
        
        return {
            'current_stability': round(stability, 2),
            'trend_direction': 'stable',
            'stability_grade': 'A' if stability > 95 else 'B' if stability > 85 else 'C'
        }
    
    def _calculate_predictive_metrics(self) -> Dict[str, Any]:
        """Calculate predictive metrics"""
        # Simplified predictive analysis
        current_pass_rate = self.calculate_execution_metrics().get('pass_rate', 0)
        
        # Predict based on current trends (simplified)
        if current_pass_rate > 90:
            prediction = 'high_success_probability'
            confidence = 0.8
        elif current_pass_rate > 70:
            prediction = 'moderate_success_probability'
            confidence = 0.6
        else:
            prediction = 'low_success_probability'
            confidence = 0.4
        
        return {
            'success_prediction': prediction,
            'confidence_level': confidence,
            'risk_assessment': 'low' if current_pass_rate > 85 else 'medium' if current_pass_rate > 70 else 'high'
        }
    
    def _analyze_seasonal_patterns(self) -> Dict[str, Any]:
        """Analyze seasonal execution patterns"""
        # This would require extensive historical data
        return {
            'seasonal_patterns_detected': False,
            'pattern_strength': 'weak',
            'peak_performance_day': 'unknown',
            'lowest_performance_day': 'unknown'
        }
    
    def _compare_to_industry_benchmarks(self) -> Dict[str, Any]:
        """Compare metrics to industry benchmarks"""
        execution_metrics = self.calculate_execution_metrics()
        current_pass_rate = execution_metrics.get('pass_rate', 0)
        
        # Industry benchmarks (simplified)
        benchmarks = {
            'excellent': 95,
            'good': 85,
            'acceptable': 75,
            'needs_improvement': 60
        }
        
        rating = 'excellent' if current_pass_rate >= 95 else \
                'good' if current_pass_rate >= 85 else \
                'acceptable' if current_pass_rate >= 75 else \
                'needs_improvement'
        
        return {
            'current_pass_rate': current_pass_rate,
            'industry_benchmarks': benchmarks,
            'rating': rating,
            'gap_to_excellent': max(0, 95 - current_pass_rate)
        }
    
    def _compare_to_historical_data(self) -> Dict[str, Any]:
        """Compare to historical data"""
        # Would need access to historical test data
        return {
            'historical_comparison_available': False,
            'improvement_trend': 'unknown',
            'performance_change': 0
        }
    
    def _compare_across_environments(self) -> Dict[str, Any]:
        """Compare metrics across environments"""
        # Would need environment-specific test results
        return {
            'environment_comparison_available': False,
            'environment_gaps': []
        }
    
    def _compare_test_types(self) -> Dict[str, Any]:
        """Compare performance across test types"""
        test_types = defaultdict(list)
        
        for result in self.test_results:
            test_type = result.get('test_type', 'functional')
            test_types[test_type].append(result.get('status') == 'PASSED')
        
        type_comparison = {}
        for test_type, results in test_types.items():
            pass_rate = sum(results) / len(results) * 100 if results else 0
            type_comparison[test_type] = {
                'pass_rate': round(pass_rate, 2),
                'test_count': len(results)
            }
        
        return type_comparison
    
    def _calculate_benchmark_scores(self) -> Dict[str, float]:
        """Calculate benchmark scores"""
        return {
            'execution_score': self.calculate_execution_metrics().get('pass_rate', 0),
            'quality_score': self.calculate_quality_metrics().get('reliability_score', 0),
            'performance_score': min(100, max(0, 100 - self.calculate_performance_metrics().get('duration_statistics', {}).get('mean', 0))),
            'coverage_score': self.calculate_coverage_metrics().get('overall_coverage_score', 0)
        }
    
    def _assess_kpi_status(self, kpis: Dict[str, float]) -> Dict[str, str]:
        """Assess status of each KPI"""
        status = {}
        
        for kpi, value in kpis.items():
            if kpi == 'test_pass_rate':
                status[kpi] = 'excellent' if value >= 95 else 'good' if value >= 85 else 'needs_improvement' if value >= 70 else 'critical'
            elif kpi == 'test_reliability':
                status[kpi] = 'excellent' if value >= 90 else 'good' if value >= 80 else 'needs_improvement'
            elif kpi == 'test_performance':
                status[kpi] = 'excellent' if value <= 5 else 'good' if value <= 10 else 'needs_improvement' if value <= 20 else 'critical'
            elif kpi == 'test_coverage':
                status[kpi] = 'excellent' if value >= 80 else 'good' if value >= 60 else 'needs_improvement'
            else:
                status[kpi] = 'good'  # Default
        
        return status
    
    def _generate_recommendations(self, kpis: Dict[str, float], status: Dict[str, str]) -> List[str]:
        """Generate recommendations based on KPI assessment"""
        recommendations = []
        
        for kpi, kpi_status in status.items():
            if kpi_status == 'critical':
                if kpi == 'test_pass_rate':
                    recommendations.append("URGENT: Test pass rate is critically low. Investigate and fix failing tests immediately.")
                elif kpi == 'test_performance':
                    recommendations.append("URGENT: Test execution time is too high. Optimize slow tests and consider parallel execution.")
            elif kpi_status == 'needs_improvement':
                if kpi == 'test_pass_rate':
                    recommendations.append("Improve test quality by addressing failing tests and improving test design.")
                elif kpi == 'test_coverage':
                    recommendations.append("Increase test coverage by adding tests for uncovered areas.")
                elif kpi == 'test_performance':
                    recommendations.append("Optimize test execution time by improving test efficiency.")
        
        if not recommendations:
            recommendations.append("All KPIs are performing well. Continue monitoring and maintaining current standards.")
        
        return recommendations
    
    def _calculate_overall_health_score(self, kpis: Dict[str, float]) -> float:
        """Calculate overall health score"""
        # Weighted average of KPIs
        weights = {
            'test_pass_rate': 0.3,
            'test_reliability': 0.25,
            'test_performance': 0.2,
            'test_coverage': 0.15,
            'execution_efficiency': 0.1
        }
        
        weighted_sum = 0
        total_weight = 0
        
        for kpi, value in kpis.items():
            weight = weights.get(kpi, 0.1)
            # Normalize performance KPI (lower is better)
            if kpi == 'test_performance':
                normalized_value = max(0, 100 - value)  # Invert performance metric
            else:
                normalized_value = value
            
            weighted_sum += normalized_value * weight
            total_weight += weight
        
        return round(weighted_sum / total_weight if total_weight > 0 else 0, 2)
    
    def _identify_priority_actions(self, kpis: Dict[str, float], status: Dict[str, str]) -> List[Dict[str, Any]]:
        """Identify priority actions based on KPI status"""
        actions = []
        
        # High priority actions for critical KPIs
        for kpi, kpi_status in status.items():
            if kpi_status == 'critical':
                actions.append({
                    'priority': 'high',
                    'kpi': kpi,
                    'action': f"Address {kpi.replace('_', ' ')} issues immediately",
                    'impact': 'high'
                })
            elif kpi_status == 'needs_improvement':
                actions.append({
                    'priority': 'medium',
                    'kpi': kpi,
                    'action': f"Improve {kpi.replace('_', ' ')} performance",
                    'impact': 'medium'
                })
        
        # Sort by priority
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        actions.sort(key=lambda x: priority_order.get(x['priority'], 0), reverse=True)
        
        return actions[:5]  # Return top 5 actions
