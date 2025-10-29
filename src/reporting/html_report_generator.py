"""
HTML Report Generator

Simple HTML report generator for test results with:
- Clean, professional styling
- Test summary statistics
- Detailed test case results
- Charts and visualizations
- Export to various formats
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path


class HTMLReportGenerator:
    """Generates beautiful HTML reports from test results"""
    
    def __init__(self, output_dir: str = "reports"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.template_cache = {}
    
    def generate_report(self, test_results: List[Dict], title: str = "Test Report", 
                       description: str = "Automated test execution report") -> str:
        """
        Generate HTML report from test results
        
        Args:
            test_results: List of test result dictionaries
            title: Report title
            description: Report description
            
        Returns:
            Path to generated HTML file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"test_report_{timestamp}.html"
        filepath = self.output_dir / filename
        
        # Calculate metrics
        metrics = self._calculate_metrics(test_results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Generate HTML content
        html_content = self._generate_html_content(test_results, metrics, title, description, timestamp)
        
        # Write file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return str(filepath)
    
    def _calculate_metrics(self, test_results: List[Dict]) -> Dict[str, Any]:
        """Calculate test metrics and statistics"""
        total = len(test_results)
        passed = sum(1 for result in test_results if result.get('status') == 'PASSED')
        failed = sum(1 for result in test_results if result.get('status') == 'FAILED')
        skipped = sum(1 for result in test_results if result.get('status') == 'SKIPPED')
        
        duration = sum(result.get('duration', 0) for result in test_results)
        avg_duration = duration / total if total > 0 else 0
        
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        return {
            'total': total,
            'passed': passed,
            'failed': failed,
            'skipped': skipped,
            'pass_rate': pass_rate,
            'total_duration': duration,
            'avg_duration': avg_duration,
            'success_rate': pass_rate
        }
    
    def _generate_html_content(self, test_results: List[Dict], metrics: Dict, 
                             title: str, description: str, timestamp: str) -> str:
        """Generate complete HTML content with embedded CSS and JS"""
        
        # Generate test results table rows
        table_rows = ""
        for i, result in enumerate(test_results, 1):
            status_class = result.get('status', 'UNKNOWN').lower()
            status_icon = self._get_status_icon(result.get('status', 'UNKNOWN'))
            
            table_rows += f"""
            <tr class="test-row">
                <td class="test-number">{i}</td>
                <td class="test-name">{result.get('name', 'Unknown Test')}</td>
                <td class="test-suite">{result.get('suite', 'Unknown Suite')}</td>
                <td class="test-category">{result.get('category', 'Uncategorized')}</td>
                <td class="test-status {status_class}">
                    <span class="status-icon">{status_icon}</span>
                    {result.get('status', 'UNKNOWN')}
                </td>
                <td class="test-duration">{result.get('duration', 0):.2f}s</td>
                <td class="test-timestamp">{result.get('timestamp', 'N/A')}</td>
            </tr>
            """
        
        html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }}
        
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        
        .metrics {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }}
        
        .metric-card {{
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }}
        
        .metric-card:hover {{
            transform: translateY(-5px);
        }}
        
        .metric-value {{
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }}
        
        .metric-label {{
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .passed {{ color: #28a745; }}
        .failed {{ color: #dc3545; }}
        .skipped {{ color: #ffc107; }}
        .total {{ color: #007bff; }}
        
        .content {{
            padding: 30px;
        }}
        
        .chart-container {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }}
        
        .chart-title {{
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #333;
        }}
        
        .test-table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }}
        
        .test-table th {{
            background: #007bff;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }}
        
        .test-table td {{
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }}
        
        .test-table tr:hover {{
            background: #f8f9fa;
        }}
        
        .test-status {{
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }}
        
        .test-status.passed {{
            background: #d4edda;
            color: #155724;
        }}
        
        .test-status.failed {{
            background: #f8d7da;
            color: #721c24;
        }}
        
        .test-status.skipped {{
            background: #fff3cd;
            color: #856404;
        }}
        
        .status-icon {{
            font-size: 1.2em;
        }}
        
        .footer {{
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
        }}
        
        .progress-bar {{
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }}
        
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }}
        
        @media (max-width: 768px) {{
            .metrics {{
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                padding: 20px;
            }}
            
            .header h1 {{
                font-size: 2em;
            }}
            
            .test-table {{
                font-size: 0.9em;
            }}
            
            .test-table th,
            .test-table td {{
                padding: 8px 10px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{title}</h1>
            <p>{description}</p>
            <p>Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value total">{metrics['total']}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric-card">
                <div class="metric-value passed">{metrics['passed']}</div>
                <div class="metric-label">Passed</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {metrics['pass_rate']}%"></div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-value failed">{metrics['failed']}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value skipped">{metrics['skipped']}</div>
                <div class="metric-label">Skipped</div>
            </div>
            <div class="metric-card">
                <div class="metric-value passed">{metrics['pass_rate']:.1f}%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value total">{metrics['total_duration']:.2f}s</div>
                <div class="metric-label">Total Duration</div>
            </div>
        </div>
        
        <div class="content">
            <div class="chart-container">
                <h3 class="chart-title">📊 Test Results Overview</h3>
                <div style="text-align: center; padding: 20px;">
                    <canvas id="resultsChart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <h3 style="margin-bottom: 20px; color: #333;">📋 Test Results Details</h3>
            <div style="overflow-x: auto;">
                <table class="test-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Test Name</th>
                            <th>Test Suite</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table_rows}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by Simple Testing Framework - Reporting Module</p>
            <p>Report ID: {timestamp}</p>
        </div>
    </div>
    
    <script>
        // Simple chart visualization
        const canvas = document.getElementById('resultsChart');
        const ctx = canvas.getContext('2d');
        
        const passed = {metrics['passed']};
        const failed = {metrics['failed']};
        const skipped = {metrics['skipped']};
        
        // Draw simple bar chart
        ctx.fillStyle = '#28a745';
        ctx.fillRect(50, 150 - passed * 2, 50, passed * 2);
        ctx.fillStyle = '#dc3545';
        ctx.fillRect(150, 150 - failed * 2, 50, failed * 2);
        ctx.fillStyle = '#ffc107';
        ctx.fillRect(250, 150 - skipped * 2, 50, skipped * 2);
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('Passed', 55, 170);
        ctx.fillText('Failed', 155, 170);
        ctx.fillText('Skipped', 245, 170);
        
        // Values
        ctx.font = 'bold 14px Arial';
        ctx.fillText(passed.toString(), 70, 145 - passed * 2);
        ctx.fillText(failed.toString(), 170, 145 - failed * 2);
        ctx.fillText(skipped.toString(), 270, 145 - skipped * 2);
    </script>
</body>
</html>
        """
        
        return html_template
    
    def _get_status_icon(self, status: str) -> str:
        """Get appropriate icon for test status"""
        icons = {
            'PASSED': '✅',
            'FAILED': '❌',
            'SKIPPED': '⏭️',
            'UNKNOWN': '❓'
        }
        return icons.get(status, '❓')
    
    def export_to_json(self, test_results: List[Dict], filename: str = None) -> str:
        """Export test results to JSON format"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"test_results_{timestamp}.json"
        
        filepath = self.output_dir / filename
        
        export_data = {
            'generated_at': datetime.now().isoformat(),
            'total_tests': len(test_results),
            'test_results': test_results,
            'summary': self._calculate_metrics(test_results)
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2)
        
        return str(filepath)
    
    def export_to_csv(self, test_results: List[Dict], filename: str = None) -> str:
        """Export test results to CSV format"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"test_results_{timestamp}.csv"
        
        filepath = self.output_dir / filename
        
        import csv
        
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            if test_results:
                fieldnames = test_results[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(test_results)
        
        return str(filepath)
