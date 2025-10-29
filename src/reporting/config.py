"""
Configuration for Simple Testing Framework Reporting

This file contains configuration settings for:
- Email notifications
- Slack/Teams integration
- Webhook notifications
- Report generation settings
- AI test generation settings
"""

# Email Configuration
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'username': 'your-email@gmail.com',
    'password': 'your-app-password',
    'to_email': 'team@company.com',
    'from_name': 'Test Automation Framework'
}

# Slack Configuration
SLACK_CONFIG = {
    'webhook_url': 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
    'channel': '#test-results',
    'username': 'TestBot',
    'icon_emoji': ':test_tube:'
}

# Microsoft Teams Configuration
TEAMS_CONFIG = {
    'webhook_url': 'https://outlook.office.com/webhook/YOUR/TEAMS/WEBHOOK',
    'theme_color': '0076D7'
}

# Generic Webhook Configuration
WEBHOOK_CONFIG = {
    'url': 'https://your-webhook-endpoint.com/test-results',
    'headers': {
        'Authorization': 'Bearer your-token-here',
        'Content-Type': 'application/json'
    }
}

# Report Generation Settings
REPORT_CONFIG = {
    'output_directory': 'reports',
    'template_style': 'modern',  # modern, classic, minimal
    'include_charts': True,
    'include_performance_data': True,
    'max_tests_per_report': 1000,
    'date_format': '%Y-%m-%d %H:%M:%S'
}

# AI Test Generation Settings
AI_CONFIG = {
    'confidence_threshold': 0.7,
    'max_tests_per_story': 10,
    'supported_story_types': ['functional', 'api', 'ui', 'mobile', 'integration'],
    'test_frameworks': ['pytest', 'unittest', 'jest', 'mocha'],
    'output_format': 'json'  # json, yaml, python
}

# Notification Rules
NOTIFICATION_RULES = [
    {
        'name': 'Critical Failures',
        'channel': 'email',
        'priority_threshold': 'high',
        'trigger_conditions': {
            'failure_rate_threshold': 0.15,  # 15% failure rate
            'min_failures': 3
        },
        'template': 'failure_alert',
        'enabled': True,
        'rate_limit_minutes': 30
    },
    {
        'name': 'Success Notification',
        'channel': 'console',
        'priority_threshold': 'low',
        'trigger_conditions': {
            'pass_rate_threshold': 100.0  # 100% pass rate
        },
        'template': 'success_notification',
        'enabled': True,
        'rate_limit_minutes': 60
    },
    {
        'name': 'Performance Issues',
        'channel': 'slack',
        'priority_threshold': 'medium',
        'trigger_conditions': {
            'slow_test_threshold': 30.0,  # 30 seconds
            'min_slow_tests': 2
        },
        'template': 'performance_alert',
        'enabled': True,
        'rate_limit_minutes': 120
    }
]

# Analytics Settings
ANALYTICS_CONFIG = {
    'enable_predictive_analytics': True,
    'trend_analysis_periods': ['daily', 'weekly', 'monthly'],
    'performance_thresholds': {
        'fast': 5.0,      # seconds
        'normal': 15.0,   # seconds
        'slow': 30.0      # seconds
    },
    'quality_thresholds': {
        'excellent': 95,  # pass rate %
        'good': 85,       # pass rate %
        'acceptable': 75  # pass rate %
    }
}

# Test Result Aggregation Settings
AGGREGATION_CONFIG = {
    'supported_file_formats': ['json', 'csv', 'xml'],
    'max_file_size_mb': 100,
    'batch_processing': True,
    'cache_results': True,
    'cache_duration_hours': 24
}

# Metrics Calculation Settings
METRICS_CONFIG = {
    'kpi_weights': {
        'test_pass_rate': 0.3,
        'test_reliability': 0.25,
        'test_performance': 0.2,
        'test_coverage': 0.15,
        'execution_efficiency': 0.1
    },
    'benchmark_comparisons': {
        'industry_standard': True,
        'historical_comparison': True,
        'target_achievement': True
    }
}

# Logging Configuration
LOGGING_CONFIG = {
    'level': 'INFO',
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'file': 'logs/reporting.log',
    'max_file_size': '10MB',
    'backup_count': 5
}

# Example usage configurations
EXAMPLE_CONFIGS = {
    'minimal': {
        'description': 'Basic configuration for small projects',
        'channels': ['console'],
        'features': ['basic_reporting']
    },
    'standard': {
        'description': 'Standard configuration for medium projects',
        'channels': ['console', 'email', 'file'],
        'features': ['reporting', 'analytics', 'notifications']
    },
    'enterprise': {
        'description': 'Full configuration for enterprise projects',
        'channels': ['email', 'slack', 'teams', 'webhook'],
        'features': ['reporting', 'analytics', 'notifications', 'ai_generation']
    }
}
