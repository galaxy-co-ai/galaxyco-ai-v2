#!/bin/bash
##############################################################################
# GalaxyCo.ai Simple Load Test
# 
# Tests API health endpoint with concurrent requests
# Collects metrics: response times, success rate, throughput
##############################################################################

set -e

API_URL="${1:-https://api.galaxyco.ai/health}"
TOTAL_REQUESTS="${2:-300}"
CONCURRENT="${3:-10}"

echo "============================================================"
echo "GalaxyCo.ai Load Test"
echo "============================================================"
echo "Target: $API_URL"
echo "Total Requests: $TOTAL_REQUESTS"
echo "Concurrent: $CONCURRENT"
echo "============================================================"
echo ""

# Create temp directory for results
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Function to make a single request
make_request() {
    local id=$1
    local start=$(date +%s%3N)
    
    response=$(curl -s -w "\n%{http_code}\n%{time_total}" -o /dev/null "$API_URL" 2>/dev/null)
    
    local end=$(date +%s%3N)
    local duration=$((end - start))
    
    # Parse response
    http_code=$(echo "$response" | tail -2 | head -1)
    curl_time=$(echo "$response" | tail -1)
    
    # Write result
    echo "$id,$http_code,$duration,$curl_time" >> "$TEMP_DIR/results.csv"
}

export -f make_request
export API_URL
export TEMP_DIR

echo "Starting load test..."
echo "Request ID,HTTP Code,Duration (ms),Curl Time (s)" > "$TEMP_DIR/results.csv"

# Start time
start_time=$(date +%s)

# Run requests in parallel
seq 1 $TOTAL_REQUESTS | xargs -P $CONCURRENT -I {} bash -c 'make_request {}'

# End time
end_time=$(date +%s)
total_duration=$((end_time - start_time))

echo ""
echo "Load test complete!"
echo ""

# Calculate statistics
total_requests=$(wc -l < "$TEMP_DIR/results.csv")
total_requests=$((total_requests - 1))  # Subtract header

success_count=$(awk -F',' '$2 == 200 {count++} END {print count+0}' "$TEMP_DIR/results.csv")
error_count=$((total_requests - success_count))

avg_duration=$(awk -F',' 'NR>1 {sum+=$3; count++} END {if(count>0) print sum/count; else print 0}' "$TEMP_DIR/results.csv")
min_duration=$(awk -F',' 'NR>1 {if(min==""|$3<min) min=$3} END {print min+0}' "$TEMP_DIR/results.csv")
max_duration=$(awk -F',' 'NR>1 {if($3>max) max=$3} END {print max+0}' "$TEMP_DIR/results.csv")

# Calculate percentiles
sorted_durations="$TEMP_DIR/sorted.txt"
awk -F',' 'NR>1 {print $3}' "$TEMP_DIR/results.csv" | sort -n > "$sorted_durations"

p50_line=$((total_requests * 50 / 100))
p95_line=$((total_requests * 95 / 100))
p99_line=$((total_requests * 99 / 100))

p50=$(sed -n "${p50_line}p" "$sorted_durations")
p95=$(sed -n "${p95_line}p" "$sorted_durations")
p99=$(sed -n "${p99_line}p" "$sorted_durations")

# Calculate throughput
requests_per_sec=$(awk "BEGIN {printf \"%.2f\", $total_requests / $total_duration}")

# Print summary
echo "============================================================"
echo "LOAD TEST RESULTS"
echo "============================================================"
echo ""
echo "Total Requests: $total_requests"
echo "Test Duration: ${total_duration}s"
echo "Requests/sec: $requests_per_sec"
echo ""
echo "Success Rate: $(awk "BEGIN {printf \"%.2f%%\", ($success_count / $total_requests) * 100}")"
echo "Successful: $success_count"
echo "Failed: $error_count"
echo ""
echo "Response Times (ms):"
echo "  Min: $min_duration"
echo "  Average: $(printf "%.2f" "$avg_duration")"
echo "  Median (p50): ${p50:-N/A}"
echo "  p95: ${p95:-N/A}"
echo "  p99: ${p99:-N/A}"
echo "  Max: $max_duration"
echo ""
echo "============================================================"
echo ""

# Check thresholds
echo "Threshold Checks:"
if [ "$success_count" -eq "$total_requests" ]; then
    echo "  ✓ PASS: 100% success rate"
else
    error_rate=$(awk "BEGIN {printf \"%.2f\", ($error_count / $total_requests) * 100}")
    if (( $(echo "$error_rate < 5" | bc -l) )); then
        echo "  ✓ PASS: Error rate ($error_rate%) < 5%"
    else
        echo "  ✗ FAIL: Error rate ($error_rate%) >= 5%"
    fi
fi

if [ -n "$p95" ] && [ "$p95" -lt 500 ]; then
    echo "  ✓ PASS: p95 ($p95 ms) < 500ms"
else
    echo "  ✗ FAIL: p95 (${p95:-N/A} ms) >= 500ms"
fi

echo ""
echo "============================================================"
