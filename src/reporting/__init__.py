"""
Simple Testing Framework - Reporting Module

This module provides comprehensive reporting and AI test generation capabilities:
- HTML report generation with test results
- AI-powered test generation from user stories
- Test result aggregation and analytics
- Basic metrics and monitoring
- Simple notification system
"""

from .html_report_generator import HTMLReportGenerator
from .ai_test_generator import AITestGenerator
from .test_aggregator import TestAggregator
from .analytics import AnalyticsEngine
from .notification_system import NotificationSystem
from .metrics import MetricsCalculator

__version__ = "1.0.0"
__all__ = [
    "HTMLReportGenerator",
    "AITestGenerator", 
    "TestAggregator",
    "AnalyticsEngine",
    "NotificationSystem",
    "MetricsCalculator"
]