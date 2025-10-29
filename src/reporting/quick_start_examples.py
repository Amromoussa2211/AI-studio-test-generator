"""
Quick Start Examples for Simple Testing Framework Reporting

This module provides simple, easy-to-understand examples for each feature:
1. Basic HTML report generation
2. Simple AI test generation
3. Basic test aggregation
4. Simple analytics
5. Basic notifications
6. Quick metrics calculation

Perfect for getting started quickly!
"""

import sys
from pathlib import Path
from datetime import datetime

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


def example_1_basic_html_report():
    """Example 1: Generate a basic HTML report"""
    print("📊 Example 1: Basic HTML Report Generation")
    print("-" * 50)
    
    # Sample test results
    test_results = [
        {
            'name': 'test_user_login',
            'suite': 'Authentication',
            'category': 'functional',
            'status': 'PASSED',
            'duration': 2.5,
            'timestamp': datetime.now().isoformat()
        },
        {
            'name': 'test_payment_processing',
            'suite': 'Payment',
            'category': 'integration',
            'status': 'FAILED',
            'duration': 5.2,
            'timestamp': datetime.now().isoformat(),
            'message': 'Payment gateway timeout'
        },
        {
            'name': 'test_ui_responsiveness',
            'suite': 'UI',
            'category': 'ui',
            'status': 'PASSED',
            'duration': 1.8,
            'timestamp': datetime.now().isoformat()
        }
    ]
    
    # Create report generator and generate report
    report_gen = HTMLReportGenerator()
    html_file = report_gen.generate_report(test_results, "Sample Test Report")
    
    print(f"✅ Generated HTML report: {html_file}")
    print(f"📂 Open the file in your browser to see the report!\n")


def example_2_ai_test_generation():
    """Example 2: Generate tests from user stories using AI"""
    print("🧪 Example 2: AI Test Generation from User Stories")
    print("-" * 50)
    
    # Simple user stories
    user_stories = [
        "As a user, I want to login so that I can access my account",
        "As a customer, I want to search for products so that I can find what I need"
    ]
    
    # Create AI test generator
    ai_generator = AITestGenerator()
    
    # Generate tests from user stories
    test_suite = ai_generator.generate_tests(user_stories)
    
    print(f"📝 Generated {test_suite['total_tests_generated']} tests from {len(user_stories)} user stories")
    print(f"⚡ Confidence score: {test_suite['test_suite']['metadata']['confidence_score']:.2f}")
    
    # Show sample generated test
    if test_suite['test_suite']['tests']:
        sample_test = test_suite['test_suite']['tests'][0]
        print(f"\n📋 Sample generated test:")
        print(f"   Name: {sample_test['name']}")
        print(f"   Type: {sample_test['type']}")
        print(f"   Steps: {len(sample_test['test_steps'])} steps")
    
    # Save generated tests
    save_file = ai_generator.save_generated_tests()
    print(f"💾 Saved to: {save_file}\n")


def example_3_test_aggregation():
    """Example 3: Aggregate test results from multiple sources"""
    print("🔄 Example 3: Test Result Aggregation")
    print("-" * 50)
    
    # Create aggregator
    aggregator = TestAggregator()
    
    # Add sample test results
    test_results = [
        {
            'name': 'test_api_endpoint',
            'suite': 'API',
            'category': 'functional',
            'status': 'PASSED',
            'duration': 1.2,
            'timestamp': datetime.now().isoformat()
        },
        {
            'name': 'test_database_connection',
            'suite': 'Database',
            'category': 'integration',
            'status': 'FAILED',
            'duration': 3.5,
            'timestamp': datetime.now().isoformat()
        }
    ]
    
    aggregator.add_results(test_results)
    
    # Get summary
    summary = aggregator.get_summary()
    
    print(f"📊 Aggregated {summary['total']} test results")
    print(f"✅ Pass rate: {summary['pass_rate']:.1f}%")
    print(f"⏱️ Total duration: {summary['total_duration']:.2f}s")
    
    # Show failed tests
    failed_tests = aggregator.get_failed_tests()
    print(f"❌ Failed tests: {len(failed_tests)}")
    
    # Export consolidated results
    export_file = aggregator.export_consolidated_results()
    print(f"💾 Exported to: {export_file}\n")


def example_4_simple_analytics():
    """Example 4: Basic analytics and insights"""
    print("📈 Example 4: Simple Analytics and Insights")
    print("-" * 50)
    
    # Sample test results with various statuses
    test_results = [
        {'name': 'test_fast', 'status': 'PASSED', 'duration': 1.0, 'suite': 'FastTests'},
        {'name': 'test_slow', 'status': 'PASSED', 'duration': 15.0, 'suite': 'SlowTests'},
        {'name': 'test_flaky', 'status': 'FAILED', 'duration': 5.0, 'suite': 'FlakyTests'},
        {'name': 'test_very_slow', 'status': 'PASSED', 'duration': 25.0, 'suite': 'SlowTests'},
        {'name': 'test_error', 'status': 'ERROR', 'duration': 2.0, 'suite': 'ErrorTests'}
    ]
    
    # Create analytics engine
    analytics = AnalyticsEngine(test_results)
    
    # Get basic insights
    insights = analytics.generate_insights()
    
    print("💡 Key insights:")
    for finding in insights['key_findings']:
        print(f"   • {finding}")
    
    # Get performance analysis
    performance = analytics.analyze_performance()
    duration_stats = performance['duration_stats']
    
    print(f"\n🏃 Performance metrics:")
    print(f"   Average duration: {duration_stats['avg']:.2f}s")
    print(f"   Min/Max duration: {duration_stats['min']:.2f}s / {duration_stats['max']:.2f}s")
    
    # Get quality metrics
    quality = analytics.analyze_test_quality()
    print(f"\n📊 Quality score: {quality['overall_quality_score']:.1f}/100")
    print(f"🎯 Reliability: {quality['reliability_score']:.1f}/100\n")


def example_5_notifications():
    """Example 5: Send notifications about test results"""
    print("🔔 Example 5: Test Result Notifications")
    print("-" * 50)
    
    # Sample test results
    test_results = [
        {'name': 'test_critical_feature', 'status': 'FAILED', 'duration': 3.0},
        {'name': 'test_important_function', 'status': 'PASSED', 'duration': 2.0},
        {'name': 'test_optional_feature', 'status': 'SKIPPED', 'duration': 1.0}
    ]
    
    # Create notification system
    notification_system = NotificationSystem()
    
    # Send notification about test results
    results = notification_system.send_test_results_notification(test_results)
    
    print(f"📢 Sent {len(results)} notifications:")
    for result in results:
        status = "✅" if result.success else "❌"
        print(f"   {status} {result.channel}: {result.message}")
    
    # Send custom notification
    print(f"\n📝 Sending custom notification...")
    from reporting.notification_system import NotificationChannel
    custom_result = notification_system.send_custom_notification(
        channel=NotificationChannel.CONSOLE,  # Use enum instead of string
        message="🎉 All critical tests are now passing! Great work team!"
    )
    
    status = "✅" if custom_result.success else "❌"
    print(f"   {status} Custom notification: {custom_result.message}\n")


def example_6_quick_metrics():
    """Example 6: Calculate basic test metrics"""
    print("📊 Example 6: Quick Metrics Calculation")
    print("-" * 50)
    
    # Sample test results
    test_results = [
        {'name': 'test_login', 'status': 'PASSED', 'duration': 2.1, 'priority': 'high'},
        {'name': 'test_search', 'status': 'PASSED', 'duration': 1.5, 'priority': 'medium'},
        {'name': 'test_payment', 'status': 'FAILED', 'duration': 8.2, 'priority': 'high'},
        {'name': 'test_profile', 'status': 'PASSED', 'duration': 1.8, 'priority': 'low'}
    ]
    
    # Create metrics calculator
    metrics_calc = MetricsCalculator(test_results)
    
    # Calculate basic KPIs
    execution_metrics = metrics_calc.calculate_execution_metrics()
    quality_metrics = metrics_calc.calculate_quality_metrics()
    
    print("📈 Execution Metrics:")
    print(f"   Total tests: {execution_metrics['total_tests']}")
    print(f"   Pass rate: {execution_metrics['pass_rate']:.1f}%")
    print(f"   Average duration: {execution_metrics['avg_duration']:.2f}s")
    
    print("\n🎯 Quality Metrics:")
    print(f"   Quality score: {quality_metrics['overall_quality_score']:.1f}/100")
    print(f"   Reliability: {quality_metrics['reliability_score']:.1f}/100")
    print(f"   Effectiveness: {quality_metrics['effectiveness_score']:.1f}/100")
    
    # Calculate KPI summary
    kpi_summary = metrics_calc.calculate_kpi_summary()
    print(f"\n🏆 Overall Health Score: {kpi_summary['overall_health_score']:.1f}/100")
    
    # Show top recommendations
    if kpi_summary['recommendations']:
        print(f"\n💡 Top recommendation:")
        print(f"   {kpi_summary['recommendations'][0]}\n")


def run_all_examples():
    """Run all quick start examples"""
    print("🚀 QUICK START EXAMPLES - Simple Testing Framework Reporting")
    print("=" * 70)
    print("These examples show how to use each feature quickly and easily!")
    print("=" * 70 + "\n")
    
    try:
        example_1_basic_html_report()
        example_2_ai_test_generation()
        example_3_test_aggregation()
        example_4_simple_analytics()
        example_5_notifications()
        example_6_quick_metrics()
        
        print("=" * 70)
        print("🎉 ALL EXAMPLES COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print("\nWhat you learned:")
        print("✅ How to generate beautiful HTML reports")
        print("✅ How to generate tests from user stories using AI")
        print("✅ How to aggregate and analyze test results")
        print("✅ How to get insights and analytics from test data")
        print("✅ How to send notifications about test results")
        print("✅ How to calculate important test metrics")
        print("\nNext steps:")
        print("🔧 Customize the examples for your specific needs")
        print("🔗 Integrate these tools into your testing workflow")
        print("📚 Check out the comprehensive demo for advanced features")
        print("\nHappy testing! 🚀")
        
    except Exception as e:
        print(f"❌ Example failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    run_all_examples()
