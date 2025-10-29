"""
Notification System

Simple notification system for test results:
- Email notifications
- Slack/Teams integration
- Webhook notifications
- Console notifications
- Configurable notification rules
- Rate limiting and batching
"""

import json
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any, Optional, Union
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum


class NotificationPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationChannel(Enum):
    EMAIL = "email"
    SLACK = "slack"
    TEAMS = "teams"
    WEBHOOK = "webhook"
    CONSOLE = "console"
    FILE = "file"


@dataclass
class NotificationRule:
    """Notification rule configuration"""
    name: str
    channel: NotificationChannel
    priority_threshold: NotificationPriority
    trigger_conditions: Dict[str, Any]
    template: str
    enabled: bool = True
    rate_limit_minutes: int = 60  # Minimum time between notifications


@dataclass
class NotificationResult:
    """Result of notification attempt"""
    success: bool
    channel: str
    message: str
    timestamp: datetime
    error_details: Optional[str] = None


class NotificationTemplate:
    """Manages notification templates"""
    
    @staticmethod
    def test_summary_template(results_summary: Dict[str, Any]) -> str:
        """Generate test summary notification"""
        return f"""
📊 Test Execution Summary

Total Tests: {results_summary.get('total', 0)}
✅ Passed: {results_summary.get('passed', 0)}
❌ Failed: {results_summary.get('failed', 0)}
⏭️ Skipped: {results_summary.get('skipped', 0)}
📈 Pass Rate: {results_summary.get('pass_rate', 0):.1f}%
⏱️ Total Duration: {results_summary.get('total_duration', 0):.2f}s

Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        """.strip()
    
    @staticmethod
    def failure_alert_template(failed_tests: List[Dict], summary: Dict[str, Any]) -> str:
        """Generate failure alert notification"""
        failure_count = len(failed_tests)
        
        message = f"""
🚨 Test Failure Alert

{failure_count} test(s) failed!
Current Pass Rate: {summary.get('pass_rate', 0):.1f}%

Failed Tests:
"""
        
        for i, test in enumerate(failed_tests[:10], 1):  # Show max 10 failures
            message += f"{i}. {test.get('name', 'Unknown')} ({test.get('suite', 'Unknown')})\n"
        
        if failure_count > 10:
            message += f"... and {failure_count - 10} more failures\n"
        
        message += f"\nTimestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return message
    
    @staticmethod
    def success_notification_template(summary: Dict[str, Any]) -> str:
        """Generate success notification"""
        return f"""
🎉 All Tests Passed!

✅ {summary.get('passed', 0)} tests successful
📈 Pass Rate: {summary.get('pass_rate', 0):.1f}%
⏱️ Total Time: {summary.get('total_duration', 0):.2f}s

Great work! ✨
Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """.strip()
    
    @staticmethod
    def performance_alert_template(slow_tests: List[Dict]) -> str:
        """Generate performance alert notification"""
        message = f"""
🐌 Performance Alert

{len(slow_tests)} test(s) are running slowly:

"""
        
        for test in slow_tests[:5]:  # Show top 5 slowest
            message += f"⏰ {test.get('name', 'Unknown')}: {test.get('duration', 0):.2f}s\n"
        
        if len(slow_tests) > 5:
            message += f"... and {len(slow_tests) - 5} more slow tests\n"
        
        message += f"\nConsider optimization 🔧\nTimestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        return message
    
    @staticmethod
    def custom_template(template: str, context: Dict[str, Any]) -> str:
        """Render custom template with context variables"""
        try:
            return template.format(**context)
        except KeyError as e:
            return f"Template error: Missing variable {e}. Available variables: {list(context.keys())}"


class NotificationSystem:
    """Main notification system"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.rules: List[NotificationRule] = []
        self.notification_history: List[NotificationResult] = []
        self.last_notification_times: Dict[str, datetime] = {}
        
        # Load default configuration
        self._load_default_config()
    
    def _load_default_config(self):
        """Load default notification configuration"""
        default_rules = [
            NotificationRule(
                name="Critical Failures",
                channel=NotificationChannel.EMAIL,
                priority_threshold=NotificationPriority.HIGH,
                trigger_conditions={
                    'failure_rate_threshold': 0.1,  # 10% failure rate
                    'min_failures': 1
                },
                template="failure_alert"
            ),
            NotificationRule(
                name="Success Notification",
                channel=NotificationChannel.CONSOLE,
                priority_threshold=NotificationPriority.LOW,
                trigger_conditions={
                    'pass_rate_threshold': 100.0
                },
                template="success_notification"
            ),
            NotificationRule(
                name="Performance Issues",
                channel=NotificationChannel.CONSOLE,
                priority_threshold=NotificationPriority.MEDIUM,
                trigger_conditions={
                    'slow_test_threshold': 30.0,  # 30 seconds
                    'min_slow_tests': 1
                },
                template="performance_alert"
            )
        ]
        
        self.rules.extend(default_rules)
    
    def add_rule(self, rule: NotificationRule):
        """Add a custom notification rule"""
        self.rules.append(rule)
    
    def send_test_results_notification(self, test_results: List[Dict[str, Any]], 
                                     custom_rules: Optional[List[NotificationRule]] = None) -> List[NotificationResult]:
        """
        Send notifications based on test results
        
        Args:
            test_results: List of test result dictionaries
            custom_rules: Optional custom notification rules
            
        Returns:
            List of notification results
        """
        if not test_results:
            return []
        
        # Calculate summary statistics
        summary = self._calculate_summary(test_results)
        
        # Determine applicable rules
        rules_to_evaluate = custom_rules or self.rules
        applicable_rules = self._evaluate_rules(summary, test_results)
        
        # Send notifications
        results = []
        for rule in applicable_rules:
            if self._should_send_notification(rule):
                result = self._send_notification(rule, summary, test_results)
                results.append(result)
                
                if result.success:
                    self._record_notification(rule.name)
        
        return results
    
    def _calculate_summary(self, test_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate test results summary"""
        total = len(test_results)
        passed = sum(1 for r in test_results if r.get('status') == 'PASSED')
        failed = sum(1 for r in test_results if r.get('status') == 'FAILED')
        skipped = sum(1 for r in test_results if r.get('status') == 'SKIPPED')
        
        total_duration = sum(r.get('duration', 0) for r in test_results)
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        failed_tests = [r for r in test_results if r.get('status') == 'FAILED']
        slow_tests = [r for r in test_results if r.get('duration', 0) > 20]
        
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'skipped': skipped,
            'pass_rate': pass_rate,
            'total_duration': total_duration,
            'failure_rate': (failed / total * 100) if total > 0 else 0,
            'failed_tests': failed_tests,
            'slow_tests': slow_tests,
            'timestamp': datetime.now().isoformat()
        }
    
    def _evaluate_rules(self, summary: Dict[str, Any], test_results: List[Dict]) -> List[NotificationRule]:
        """Evaluate which rules should trigger notifications"""
        applicable_rules = []
        
        for rule in self.rules:
            if not rule.enabled:
                continue
            
            # Check priority threshold
            if self._priority_exceeds_threshold(summary, rule.priority_threshold):
                # Check trigger conditions
                if self._check_trigger_conditions(summary, rule.trigger_conditions):
                    applicable_rules.append(rule)
        
        return applicable_rules
    
    def _priority_exceeds_threshold(self, summary: Dict[str, Any], threshold: NotificationPriority) -> bool:
        """Check if test results exceed priority threshold"""
        failure_rate = summary.get('failure_rate', 0)
        pass_rate = summary.get('pass_rate', 0)
        
        if threshold == NotificationPriority.CRITICAL:
            return failure_rate > 30 or pass_rate < 50
        elif threshold == NotificationPriority.HIGH:
            return failure_rate > 20 or pass_rate < 70
        elif threshold == NotificationPriority.MEDIUM:
            return failure_rate > 10 or pass_rate < 85
        else:  # LOW
            return failure_rate > 5 or pass_rate < 95
    
    def _check_trigger_conditions(self, summary: Dict[str, Any], conditions: Dict[str, Any]) -> bool:
        """Check if trigger conditions are met"""
        for condition, threshold in conditions.items():
            actual_value = summary.get(condition)
            
            if actual_value is None:
                continue
            
            if condition.endswith('_threshold'):
                if actual_value < threshold:
                    return False
            elif condition.startswith('min_'):
                if actual_value < threshold:
                    return False
            elif condition.startswith('max_'):
                if actual_value > threshold:
                    return False
        
        return True
    
    def _should_send_notification(self, rule: NotificationRule) -> bool:
        """Check if notification should be sent (rate limiting)"""
        rule_key = rule.name
        current_time = datetime.now()
        
        if rule_key in self.last_notification_times:
            last_sent = self.last_notification_times[rule_key]
            time_diff = current_time - last_sent
            
            if time_diff < timedelta(minutes=rule.rate_limit_minutes):
                return False
        
        return True
    
    def _send_notification(self, rule: NotificationRule, summary: Dict[str, Any], 
                          test_results: List[Dict[str, Any]]) -> NotificationResult:
        """Send notification via specified channel"""
        try:
            # Generate message content
            message = self._generate_message(rule.template, summary, test_results)
            
            # Send via appropriate channel
            if rule.channel == NotificationChannel.EMAIL:
                success, error = self._send_email(message)
            elif rule.channel == NotificationChannel.SLACK:
                success, error = self._send_slack(message)
            elif rule.channel == NotificationChannel.TEAMS:
                success, error = self._send_teams(message)
            elif rule.channel == NotificationChannel.WEBHOOK:
                success, error = self._send_webhook(message)
            elif rule.channel == NotificationChannel.CONSOLE:
                success, error = self._send_console(message)
            elif rule.channel == NotificationChannel.FILE:
                success, error = self._send_file(message, rule.name)
            else:
                success, error = False, f"Unknown channel: {rule.channel}"
            
            return NotificationResult(
                success=success,
                channel=rule.channel.value,
                message="Notification sent successfully" if success else error,
                timestamp=datetime.now(),
                error_details=error if not success else None
            )
        
        except Exception as e:
            return NotificationResult(
                success=False,
                channel=rule.channel.value,
                message=str(e),
                timestamp=datetime.now(),
                error_details=str(e)
            )
    
    def _generate_message(self, template_name: str, summary: Dict[str, Any], test_results: List[Dict]) -> str:
        """Generate message using specified template"""
        if template_name == "test_summary":
            return NotificationTemplate.test_summary_template(summary)
        elif template_name == "failure_alert":
            return NotificationTemplate.failure_alert_template(summary.get('failed_tests', []), summary)
        elif template_name == "success_notification":
            return NotificationTemplate.success_notification_template(summary)
        elif template_name == "performance_alert":
            return NotificationTemplate.performance_alert_template(summary.get('slow_tests', []))
        else:
            # Custom template
            context = {
                'summary': summary,
                'total_tests': summary.get('total', 0),
                'passed_tests': summary.get('passed', 0),
                'failed_tests': summary.get('failed', 0),
                'pass_rate': summary.get('pass_rate', 0),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            return NotificationTemplate.custom_template(template_name, context)
    
    def _send_email(self, message: str) -> tuple[bool, Optional[str]]:
        """Send email notification"""
        try:
            email_config = self.config.get('email', {})
            
            if not all(key in email_config for key in ['smtp_server', 'smtp_port', 'username', 'password', 'to_email']):
                return False, "Email configuration incomplete"
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = email_config['username']
            msg['To'] = email_config['to_email']
            msg['Subject'] = f"Test Results - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            msg.attach(MIMEText(message, 'plain'))
            
            # Send email
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['username'], email_config['password'])
            server.send_message(msg)
            server.quit()
            
            return True, None
        
        except Exception as e:
            return False, str(e)
    
    def _send_slack(self, message: str) -> tuple[bool, Optional[str]]:
        """Send Slack notification"""
        try:
            slack_config = self.config.get('slack', {})
            webhook_url = slack_config.get('webhook_url')
            
            if not webhook_url:
                return False, "Slack webhook URL not configured"
            
            payload = {
                'text': message,
                'username': 'TestBot',
                'icon_emoji': ':test_tube:'
            }
            
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
            return True, None
        
        except Exception as e:
            return False, str(e)
    
    def _send_teams(self, message: str) -> tuple[bool, Optional[str]]:
        """Send Teams notification"""
        try:
            teams_config = self.config.get('teams', {})
            webhook_url = teams_config.get('webhook_url')
            
            if not webhook_url:
                return False, "Teams webhook URL not configured"
            
            payload = {
                '@type': 'MessageCard',
                '@context': 'https://schema.org/extensions',
                'themeColor': '0076D7',
                'summary': 'Test Results',
                'sections': [{
                    'activityTitle': 'Test Results Notification',
                    'text': message
                }]
            }
            
            response = requests.post(webhook_url, json=payload, timeout=10)
            response.raise_for_status()
            
            return True, None
        
        except Exception as e:
            return False, str(e)
    
    def _send_webhook(self, message: str) -> tuple[bool, Optional[str]]:
        """Send generic webhook notification"""
        try:
            webhook_config = self.config.get('webhook', {})
            webhook_url = webhook_config.get('url')
            
            if not webhook_url:
                return False, "Webhook URL not configured"
            
            payload = {
                'message': message,
                'timestamp': datetime.now().isoformat(),
                'source': 'SimpleTestingFramework'
            }
            
            headers = webhook_config.get('headers', {})
            response = requests.post(webhook_url, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            
            return True, None
        
        except Exception as e:
            return False, str(e)
    
    def _send_console(self, message: str) -> tuple[bool, Optional[str]]:
        """Send console notification (print to stdout)"""
        try:
            print("\n" + "="*50)
            print("NOTIFICATION")
            print("="*50)
            print(message)
            print("="*50 + "\n")
            return True, None
        except Exception as e:
            return False, str(e)
    
    def _send_file(self, message: str, rule_name: str) -> tuple[bool, Optional[str]]:
        """Save notification to file"""
        try:
            filename = f"notifications/notification_{rule_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            
            import os
            os.makedirs('notifications', exist_ok=True)
            
            with open(filename, 'w') as f:
                f.write(message)
                f.write(f"\n\nGenerated: {datetime.now().isoformat()}")
            
            return True, None
        
        except Exception as e:
            return False, str(e)
    
    def _record_notification(self, rule_name: str):
        """Record that a notification was sent"""
        self.last_notification_times[rule_name] = datetime.now()
    
    def send_custom_notification(self, channel: NotificationChannel, message: str, 
                                config_override: Optional[Dict[str, Any]] = None) -> NotificationResult:
        """Send custom notification via specified channel"""
        try:
            # Temporarily override config if provided
            old_config = None
            if config_override:
                old_config = self.config.copy()
                self.config.update(config_override)
            
            # Create temporary rule
            rule = NotificationRule(
                name="Custom",
                channel=channel,
                priority_threshold=NotificationPriority.LOW,
                trigger_conditions={},
                template="custom"
            )
            
            result = self._send_notification(rule, {'custom': True}, [])
            
            # Restore original config
            if old_config:
                self.config = old_config
            
            return result
        
        except Exception as e:
            return NotificationResult(
                success=False,
                channel=channel.value,
                message=str(e),
                timestamp=datetime.now(),
                error_details=str(e)
            )
    
    def get_notification_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get notification history"""
        return [
            {
                'success': result.success,
                'channel': result.channel,
                'message': result.message,
                'timestamp': result.timestamp.isoformat(),
                'error_details': result.error_details
            }
            for result in self.notification_history[-limit:]
        ]
    
    def clear_history(self):
        """Clear notification history"""
        self.notification_history.clear()
