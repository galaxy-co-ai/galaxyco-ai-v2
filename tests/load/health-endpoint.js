/**
 * GalaxyCo.ai API Load Test - Health Endpoint
 * 
 * Tests the production API health endpoint under sustained load
 * to validate production readiness.
 * 
 * Usage: k6 run tests/load/health-endpoint.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '2m', target: 50 },    // Increase to 50 users
    { duration: '2m', target: 50 },    // Stay at 50 users (peak load)
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // 95% of requests must complete below 500ms
    'http_req_failed': ['rate<0.05'],    // Error rate must be less than 5%
    'errors': ['rate<0.05'],             // Custom error rate < 5%
  },
};

const BASE_URL = 'https://api.galaxyco.ai';

export default function () {
  // Test health endpoint
  const res = http.get(`${BASE_URL}/health`);
  
  // Check response
  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has status field': (r) => r.json('status') === 'ok',
    'has service field': (r) => r.json('service') === 'galaxyco-api',
    'has timestamp': (r) => r.json('timestamp') !== undefined,
  });
  
  // Record errors
  errorRate.add(!checkRes);
  
  // Simulate realistic user behavior (small pause between requests)
  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = '\n';
  summary += indent + '='.repeat(60) + '\n';
  summary += indent + 'LOAD TEST SUMMARY - Health Endpoint\n';
  summary += indent + '='.repeat(60) + '\n\n';
  
  // Requests
  const requests = data.metrics.http_reqs.values.count;
  const duration = data.state.testRunDurationMs / 1000;
  summary += indent + `Total Requests: ${requests}\n`;
  summary += indent + `Test Duration: ${duration.toFixed(2)}s\n`;
  summary += indent + `Requests/sec: ${(requests / duration).toFixed(2)}\n\n`;
  
  // Response Times
  summary += indent + 'Response Times:\n';
  summary += indent + `  Average: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  summary += indent + `  Median (p50): ${data.metrics.http_req_duration.values['p(50)'].toFixed(2)}ms\n`;
  summary += indent + `  p95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  summary += indent + `  p99: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n`;
  summary += indent + `  Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms\n\n`;
  
  // Success/Failure Rate
  const successRate = (1 - data.metrics.http_req_failed.values.rate) * 100;
  summary += indent + `Success Rate: ${successRate.toFixed(2)}%\n`;
  summary += indent + `Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%\n\n`;
  
  // Thresholds
  summary += indent + 'Threshold Results:\n';
  Object.keys(data.metrics).forEach(metricName => {
    const metric = data.metrics[metricName];
    if (metric.thresholds) {
      Object.keys(metric.thresholds).forEach(thresholdName => {
        const threshold = metric.thresholds[thresholdName];
        const passed = threshold.ok ? '✓ PASS' : '✗ FAIL';
        summary += indent + `  ${passed}: ${thresholdName}\n`;
      });
    }
  });
  
  summary += '\n' + indent + '='.repeat(60) + '\n\n';
  
  return summary;
}
