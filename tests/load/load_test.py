#!/usr/bin/env python3
"""
GalaxyCo.ai Load Test

Simple concurrent load test for API endpoints.
Measures response times, success rate, and throughput.
"""

import time
import statistics
import concurrent.futures
import argparse
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError
import json

def make_request(url, request_id):
    """Make a single HTTP request and measure response time"""
    start = time.time()
    try:
        req = Request(url, headers={'User-Agent': 'GalaxyCo-LoadTest/1.0'})
        with urlopen(req, timeout=10) as response:
            status_code = response.status
            body = response.read()
            duration = (time.time() - start) * 1000  # Convert to ms
            
            # Try to parse JSON response
            try:
                data = json.loads(body)
                has_status = 'status' in data
                has_service = 'service' in data
            except:
                has_status = False
                has_service = False
            
            return {
                'id': request_id,
                'status': status_code,
                'duration': duration,
                'success': status_code == 200,
                'has_status': has_status,
                'has_service': has_service,
            }
    except (HTTPError, URLError) as e:
        duration = (time.time() - start) * 1000
        return {
            'id': request_id,
            'status': getattr(e, 'code', 0),
            'duration': duration,
            'success': False,
            'error': str(e),
        }
    except Exception as e:
        duration = (time.time() - start) * 1000
        return {
            'id': request_id,
            'status': 0,
            'duration': duration,
            'success': False,
            'error': str(e),
        }

def run_load_test(url, total_requests=100, num_concurrent=10):
    """Run load test with concurrent workers"""
    print("=" * 60)
    print("GalaxyCo.ai Load Test")
    print("=" * 60)
    print(f"Target: {url}")
    print(f"Total Requests: {total_requests}")
    print(f"Concurrent: {num_concurrent}")
    print("=" * 60)
    print()
    
    print("Starting load test...")
    
    start_time = time.time()
    results = []
    
    # Run requests concurrently
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_concurrent) as executor:
        futures = [executor.submit(make_request, url, i) for i in range(1, total_requests + 1)]
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())
    
    end_time = time.time()
    total_duration = end_time - start_time
    
    print()
    print("Load test complete!")
    print()
    
    # Calculate statistics
    success_results = [r for r in results if r['success']]
    error_results = [r for r in results if not r['success']]
    
    durations = [r['duration'] for r in results]
    success_durations = [r['duration'] for r in success_results]
    
    # Print results
    print("=" * 60)
    print("LOAD TEST RESULTS")
    print("=" * 60)
    print()
    print(f"Total Requests: {len(results)}")
    print(f"Test Duration: {total_duration:.2f}s")
    print(f"Requests/sec: {len(results) / total_duration:.2f}")
    print()
    
    success_rate = (len(success_results) / len(results)) * 100
    print(f"Success Rate: {success_rate:.2f}%")
    print(f"Successful: {len(success_results)}")
    print(f"Failed: {len(error_results)}")
    print()
    
    if durations:
        print("Response Times (ms):")
        print(f"  Min: {min(durations):.2f}")
        print(f"  Average: {statistics.mean(durations):.2f}")
        print(f"  Median (p50): {statistics.median(durations):.2f}")
        
        sorted_durations = sorted(durations)
        p95_idx = int(len(sorted_durations) * 0.95)
        p99_idx = int(len(sorted_durations) * 0.99)
        print(f"  p95: {sorted_durations[p95_idx]:.2f}")
        print(f"  p99: {sorted_durations[p99_idx]:.2f}")
        print(f"  Max: {max(durations):.2f}")
    print()
    print("=" * 60)
    print()
    
    # Threshold checks
    print("Threshold Checks:")
    
    # Success rate check
    if success_rate == 100:
        print("  ✓ PASS: 100% success rate")
    elif success_rate >= 95:
        print(f"  ✓ PASS: Success rate ({success_rate:.2f}%) >= 95%")
    else:
        print(f"  ✗ FAIL: Success rate ({success_rate:.2f}%) < 95%")
    
    # p95 latency check
    if durations:
        p95 = sorted_durations[p95_idx]
        if p95 < 500:
            print(f"  ✓ PASS: p95 ({p95:.2f} ms) < 500ms")
        else:
            print(f"  ✗ FAIL: p95 ({p95:.2f} ms) >= 500ms")
    
    # Average latency check
    if durations:
        avg = statistics.mean(durations)
        if avg < 300:
            print(f"  ✓ PASS: Average ({avg:.2f} ms) < 300ms")
        else:
            print(f"  ⚠ WARNING: Average ({avg:.2f} ms) >= 300ms")
    
    print()
    print("=" * 60)
    
    # Show errors if any
    if error_results:
        print()
        print("Error Details:")
        error_counts = {}
        for r in error_results:
            error_msg = r.get('error', f"HTTP {r['status']}")
            error_counts[error_msg] = error_counts.get(error_msg, 0) + 1
        
        for error, count in error_counts.items():
            print(f"  {error}: {count} occurrences")
        print()
    
    return {
        'total_requests': len(results),
        'success_count': len(success_results),
        'error_count': len(error_results),
        'success_rate': success_rate,
        'duration': total_duration,
        'stats': {
            'min': min(durations) if durations else 0,
            'avg': statistics.mean(durations) if durations else 0,
            'median': statistics.median(durations) if durations else 0,
            'p95': sorted_durations[p95_idx] if durations else 0,
            'p99': sorted_durations[p99_idx] if durations else 0,
            'max': max(durations) if durations else 0,
        }
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Load test for GalaxyCo.ai API')
    parser.add_argument('url', nargs='?', default='https://api.galaxyco.ai/health',
                        help='URL to test (default: https://api.galaxyco.ai/health)')
    parser.add_argument('-n', '--requests', type=int, default=100,
                        help='Total number of requests (default: 100)')
    parser.add_argument('-c', '--concurrent', type=int, default=10,
                        help='Number of concurrent requests (default: 10)')
    
    args = parser.parse_args()
    
    run_load_test(args.url, args.requests, args.concurrent)
