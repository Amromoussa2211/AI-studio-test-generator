"""
Comprehensive Example: Simple Testing Framework Reporting

This example demonstrates all features of the reporting module:
1. HTML report generation
2. AI test generation from user stories
3. Test result aggregation
4. Analytics and insights
5. Notification system
6. Metrics calculation

Run this example to see the complete reporting system in action.
"""

import sys
import os
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from reporting import (
    HTMLReportGenerator,
    AITestGenerator,
    TestAggregator,
    AnalyticsEngine,
    NotificationSystem,
    MetricsCalculator
)
from reporting.notification_system import NotificationChannel, NotificationRule, NotificationPriority


def generate_sample_test_results():
    """Generate sample test results for demonstration"""
    import random
    
    # Sample test data
    test_suites = ['Authentication', 'User Management', 'Payment', 'Search', 'API Integration']
    test_categories = ['functional', 'ui', 'api', 'integration', 'security', 'performance']
    test_names = [
        'test_user_login', 'test_user_registration', 'test_password_reset',
        'test_payment_processing', 'test_search_functionality', 'test_api_endpoint',
        'test_data_validation', 'test_error_handling', 'test_ui_responsiveness',
        'test_database_connectivity', 'test_file_upload', 'test_email_notification',
        'test_user_permissions', 'test_session_management', 'test_data_encryption'
    ]
    
    results = []
    
    for i in range(50):  # Generate 50 sample test results
        # Simulate test execution with realistic distribution
        status_weights = [0.85, 0.10, 0.04, 0.01]  # PASSED, FAILED, SKIPPED, ERROR
        status = random.choices(['PASSED', 'FAILED', 'SKIPPED', 'ERROR'], weights=status_weights)[0]
        
        # Generate realistic duration (some tests are slower)
        if status == 'FAILED':
            duration = random.uniform(1, 25)  # Failed tests might run longer
        elif status == 'PASSED':
            duration = random.uniform(0.5, 15)  # Passed tests vary in speed
        else:
            duration = random.uniform(0.1, 5)  # Skipped/error tests are usually fast
        
        result = {
            'id': f'TEST_{i+1:03d}',
            'name': random.choice(test_names),
            'suite': random.choice(test_suites),
            'category': random.choice(test_categories),
            'status': status,
            'duration': round(duration, 2),
            'timestamp': (datetime.now() - timedelta(hours=random.randint(0, 72))).isoformat(),
            'message': 'Test completed successfully' if status == 'PASSED' else 'Test failed with assertion error',
            'error_details': 'Connection timeout' if status == 'FAILED' and random.random() > 0.5 else '',
            'tags': [random.choice(['smoke', 'regression', 'critical', 'optional'])],
            'priority': random.choice(['high', 'medium', 'low']),
            'browser': random.choice(['chrome', 'firefox', 'safari']),
            'os': random.choice(['windows', 'macos', 'linux']),
            'test_type': random.choice(['functional', 'ui', 'api'])
        }
        results.append(result)
    
    return results


def demonstrate_html_reporting():
    """Demonstrate HTML report generation"""
    print("=" * 60)
    print("HTML REPORT GENERATION DEMO")
    print("=" * 60)
    
    # Generate sample results
    test_results = generate_sample_test_results()
    
    # Create report generator
    report_gen = HTMLReportGenerator(output_dir="reports")
    
    # Generate HTML report
    html_file = report_gen.generate_report(
        test_results=test_results,
        title="Q4 2024 Test Execution Report",
        description="Comprehensive test execution results for quarterly release"
    )
    
    print(f"✅ HTML Report generated: {html_file}")
    
    # Export to other formats
    json_file = report_gen.export_to_json(test_results)
    csv_file = report_gen.export_to_csv(test_results)
    
    print(f"✅ JSON export: {json_file}")
    print(f"✅ CSV export: {csv_file}")
    print()


def demonstrate_ai_test_generation():
    """Demonstrate AI test generation from user stories"""
    print("=" * 60)
    print("AI TEST GENERATION DEMO")
    print("=" * 60)
    
    # Sample user stories
    user_stories = [
        "As a customer, I want to login to my account so that I can access my personalized dashboard",
        "As a shopper, I want to search for products so that I can find items I want to buy",
        "As a user, I want to pay for my order securely so that my financial information is protected",
        "As an admin, I want to manage user accounts so that I can control access to the system",
        "As a customer, I want to track my order status so that I know when my items will arrive"
    ]
    
    # Create AI test generator
    ai_generator = AITestGenerator()
    
    # Generate tests from user stories
    test_suite = ai_generator.generate_tests(user_stories, story_type='web_application')
    
    print(f"📝 Processed {len(user_stories)} user stories")
    print(f"🧪 Generated {test_suite['total_tests_generated']} test cases")
    print(f"⚡ Average confidence score: {test_suite['test_suite']['metadata']['confidence_score']:.2f}")
    print(f"⏱️ Estimated total duration: {test_suite['test_suite']['metadata']['estimated_total_duration']} minutes")
    
    # Show test distribution
    tests_by_type = test_suite['tests_by_type']
    print("\nTest distribution by type:")
    for test_type, tests in tests_by_type.items():
        print(f"  • {test_type.title()}: {len(tests)} tests")
    
    # Save generated tests
    json_file = ai_generator.save_generated_tests("generated_tests/generated_test_suite.json")
    print(f"\n✅ Generated test suite saved: {json_file}")
    
    # Export test scripts
    script_files = ai_generator.export_test_scripts("generated_tests")
    print(f"✅ Exported {len(script_files)} test scripts:")
    for script_file in script_files:
        print(f"  • {script_file}")
    
    print()


def demonstrate_test_aggregation():
    """Demonstrate test result aggregation"""
    print("=" * 60)
    print("TEST AGGREGATION DEMO")
    print("=" * 60)
    
    # Create test aggregator
    aggregator = TestAggregator()
    
    # Add results from multiple sources
    test_results = generate_sample_test_results()
    aggregator.add_results(test_results)
    
    # Add some additional results to simulate multiple runs
    additional_results = generate_sample_test_results()
    aggregator.add_results(additional_results)
    
    # Get summary
    summary = aggregator.get_summary()
    print(f"📊 Aggregated {summary['total']} test results")
    print(f"✅ Passed: {summary['passed']} ({summary['pass_rate']:.1f}%)")
    print(f"❌ Failed: {summary['failed']}")
    print(f"⏭️ Skipped: {summary['skipped']}")
    print(f"⏱️ Total duration: {summary['total_duration']:.2f}s")
    
    # Show breakdown by suite
    print("\nResults by test suite:")
    for suite, count in summary['suite_breakdown'].items():
        print(f"  • {suite}: {count} tests")
    
    # Get failed tests
    failed_tests = aggregator.get_failed_tests()
    print(f"\n🚨 Found {len(failed_tests)} failed tests:")
    for test in failed_tests[:5]:  # Show first 5
        print(f"  • {test.name} ({test.suite}) - {test.status}")
    
    # Get slowest tests
    slowest_tests = aggregator.get_slowest_tests(5)
    print(f"\n🐌 Top 5 slowest tests:")
    for test in slowest_tests:
        print(f"  • {test.name}: {test.duration:.2f}s")
    
    # Get trends
    trends = aggregator.get_trends_over_time('daily')
    print(f"\n📈 Analyzed trends over {len(trends['trends'])} time periods")
    
    # Export consolidated results
    export_file = aggregator.export_consolidated_results()
    print(f"✅ Consolidated results exported: {export_file}")
    
    print()


def demonstrate_analytics():
    """Demonstrate analytics engine"""
    print("=" * 60)
    print("ANALYTICS ENGINE DEMO")
    print("=" * 60)
    
    # Generate sample results
    test_results = generate_sample_test_results()
    
    # Create analytics engine
    analytics = AnalyticsEngine(test_results)
    
    # Performance analysis
    print("🏃 PERFORMANCE ANALYSIS")
    performance = analytics.analyze_performance()
    duration_stats = performance['duration_stats']
    print(f"  • Average duration: {duration_stats['avg']:.2f}s")
    print(f"  • Min/Max duration: {duration_stats['min']:.2f}s / {duration_stats['max']:.2f}s")
    print(f"  • Total execution time: {duration_stats['total']:.2f}s")
    
    # Failure pattern analysis
    print("\n❌ FAILURE PATTERN ANALYSIS")
    failures = analytics.analyze_failure_patterns()
    print(f"  • Total failures: {failures['total_failures']}")
    print(f"  • Failure rate: {failures['failure_rate']:.1f}%")
    
    if failures['common_failures']:
        print("  • Most common failures:")
        for failure in failures['common_failures'][:3]:
            print(f"    - '{failure['phrase']}': {failure['count']} occurrences")
    
    # Quality analysis
    print("\n📊 QUALITY ANALYSIS")
    quality = analytics.analyze_test_quality()
    print(f"  • Overall quality score: {quality['overall_quality_score']:.1f}/100")
    print(f"  • Reliability score: {quality['reliability_score']:.1f}/100")
    print(f"  • Test effectiveness: {quality['test_effectiveness']:.1f}/100")
    
    # Generate insights
    print("\n💡 KEY INSIGHTS")
    insights = analytics.generate_insights()
    print("  • Key findings:")
    for finding in insights['key_findings'][:3]:
        print(f"    - {finding}")
    
    if insights['critical_issues']:
        print("  • Critical issues:")
        for issue in insights['critical_issues'][:3]:
            print(f"    - {issue}")
    
    # Recommendations
    print("  • Recommendations:")
    for rec in quality['recommendations'][:3]:
        print(f"    - {rec}")
    
    print()


def demonstrate_notification_system():
    """Demonstrate notification system"""
    print("=" * 60)
    print("NOTIFICATION SYSTEM DEMO")
    print("=" * 60)
    
    # Generate test results
    test_results = generate_sample_test_results()
    
    # Create notification system
    notification_system = NotificationSystem()
    
    # Send test results notification
    results = notification_system.send_test_results_notification(test_results)
    
    print(f"📢 Sent {len(results)} notifications:")
    for result in results:
        status = "✅" if result.success else "❌"
        print(f"  {status} {result.channel}: {result.message}")
        if result.error_details:
            print(f"    Error: {result.error_details}")
    
    # Demonstrate custom notification
    print("\n🎯 CUSTOM NOTIFICATION")
    custom_result = notification_system.send_custom_notification(
        channel=NotificationChannel.CONSOLE,
        message="🚀 Custom notification: All systems are running smoothly!"
    )
    
    status = "✅" if custom_result.success else "❌"
    print(f"  {status} Custom notification: {custom_result.message}")
    
    print()


def demonstrate_metrics_calculation():
    """Demonstrate metrics calculation"""
    print("=" * 60)
    print("METRICS CALCULATION DEMO")
    print("=" * 60)
    
    # Generate test results
    test_results = generate_sample_test_results()
    
    # Create metrics calculator
    metrics_calc = MetricsCalculator(test_results)
    
    # Calculate all metrics
    all_metrics = metrics_calc.calculate_all_metrics()
    
    # Display KPI summary
    print("📊 KEY PERFORMANCE INDICATORS")
    kpis = all_metrics['kpi_summary']['kpis']
    for kpi, value in kpis.items():
        print(f"  • {kpi.replace('_', ' ').title()}: {value:.1f}")
    
    # Display status assessment
    print("\n🎯 STATUS ASSESSMENT")
    status = all_metrics['kpi_summary']['status_assessment']
    for kpi, kpi_status in status.items():
        print(f"  • {kpi.replace('_', ' ').title()}: {kpi_status.upper()}")
    
    # Display recommendations
    print("\n💡 RECOMMENDATIONS")
    recommendations = all_metrics['kpi_summary']['recommendations']
    for rec in recommendations[:3]:
        print(f"  • {rec}")
    
    # Display priority actions
    print("\n🚀 PRIORITY ACTIONS")
    actions = all_metrics['kpi_summary']['priority_actions']
    for action in actions[:3]:
        print(f"  • [{action['priority'].upper()}] {action['action']}")
    
    # Display overall health score
    health_score = all_metrics['kpi_summary']['overall_health_score']
    print(f"\n🏥 OVERALL HEALTH SCORE: {health_score:.1f}/100")
    
    print()


def create_comprehensive_demo():
    """Create a comprehensive demonstration of all features"""
    print("\n" + "="*80)
    print("🚀 SIMPLE TESTING FRAMEWORK - COMPREHENSIVE REPORTING DEMO")
    print("="*80)
    print("This demo showcases all reporting and AI generation capabilities:")
    print("• HTML Report Generation with beautiful visualizations")
    print("• AI-Powered Test Generation from User Stories")
    print("• Test Result Aggregation from Multiple Sources")
    print("• Advanced Analytics and Insights Engine")
    print("• Multi-Channel Notification System")
    print("• Comprehensive Metrics and KPIs")
    print("="*80 + "\n")
    
    # Create output directories
    os.makedirs("reports", exist_ok=True)
    os.makedirs("generated_tests", exist_ok=True)
    
    # Run all demonstrations
    try:
        demonstrate_html_reporting()
        demonstrate_ai_test_generation()
        demonstrate_test_aggregation()
        demonstrate_analytics()
        demonstrate_notification_system()
        demonstrate_metrics_calculation()
        
        print("=" * 80)
        print("🎉 DEMO COMPLETED SUCCESSFULLY!")
        print("=" * 80)
        print("\nGenerated files:")
        print("📊 reports/ - HTML, JSON, and CSV test reports")
        print("🧪 generated_tests/ - AI-generated test suites and scripts")
        print("\nNext steps:")
        print("1. Open the HTML report in your browser to see beautiful test visualizations")
        print("2. Review the generated test scripts and customize them for your needs")
        print("3. Use the notification system to get alerts about test results")
        print("4. Integrate these tools into your CI/CD pipeline")
        print("\nHappy testing! 🚀")
        
    except Exception as e:
        print(f"❌ Demo failed with error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    create_comprehensive_demo()
