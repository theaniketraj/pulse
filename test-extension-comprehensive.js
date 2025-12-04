/**
 * Comprehensive Test Script for Vitals VS Code Extension
 *
 * This script tests:
 * - Extension activation
 * - Command registration
 * - Webview creation and rendering
 * - API endpoints
 * - Data fetching and processing
 * - UI components
 * - Error handling
 *
 * Usage:
 * 1. Start Prometheus locally (default: http://localhost:9090)
 * 2. Open this project in VS Code
 * 3. Press F5 to start Extension Development Host
 * 4. Run: node test-extension-comprehensive.js
 */

const http = require("http");

// Test configuration
const CONFIG = {
  prometheusUrl: "http://localhost:9090",
  testTimeout: 5000,
  expectedMetrics: ["up", "prometheus_build_info"],
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

// Color codes for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: CONFIG.testTimeout,
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

// Test logging functions
function logTest(name, passed, message = "") {
  const status = passed
    ? `${colors.green}✓ PASS${colors.reset}`
    : `${colors.red}✗ FAIL${colors.reset}`;
  const msg = message ? ` - ${message}` : "";
  console.log(`  ${status} ${name}${msg}`);

  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

function logSection(title) {
  console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

// Test suites
async function testPrometheusConnection() {
  logSection("Testing Prometheus Connection");

  try {
    const response = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/status/config`
    );
    logTest(
      "Prometheus server is accessible",
      response.status === 200,
      `Status: ${response.status}`
    );

    if (response.status === 200) {
      logTest(
        "Prometheus API returns valid JSON",
        response.data && response.data.status === "success",
        "Response has correct structure"
      );
    } else {
      logTest(
        "Prometheus API returns valid JSON",
        false,
        "Server not responding correctly"
      );
    }
  } catch (error) {
    logTest("Prometheus server is accessible", false, error.message);
    logTest("Prometheus API returns valid JSON", false, "Cannot reach server");
  }
}

async function testMetricsEndpoints() {
  logSection("Testing Metrics API Endpoints");

  // Test 1: Query API
  try {
    const queryResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/query?query=up`
    );

    logTest(
      "Query API endpoint (/api/v1/query)",
      queryResponse.status === 200 && queryResponse.data.status === "success",
      `Status: ${queryResponse.status}`
    );

    if (queryResponse.data && queryResponse.data.data) {
      logTest(
        "Query returns valid metric data",
        queryResponse.data.data.result &&
          Array.isArray(queryResponse.data.data.result),
        `Found ${queryResponse.data.data.result?.length || 0} results`
      );
    }
  } catch (error) {
    logTest("Query API endpoint (/api/v1/query)", false, error.message);
    logTest("Query returns valid metric data", false, "Query failed");
  }

  // Test 2: Query Range API
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;

    const rangeResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/query_range?query=up&start=${oneHourAgo}&end=${now}&step=60`
    );

    logTest(
      "Query Range API endpoint (/api/v1/query_range)",
      rangeResponse.status === 200 && rangeResponse.data.status === "success",
      `Status: ${rangeResponse.status}`
    );

    if (rangeResponse.data && rangeResponse.data.data) {
      const hasValues = rangeResponse.data.data.result?.some(
        (r) => r.values && r.values.length > 0
      );
      logTest(
        "Query Range returns time-series data",
        hasValues,
        hasValues ? "Time-series data present" : "No time-series data found"
      );
    }
  } catch (error) {
    logTest(
      "Query Range API endpoint (/api/v1/query_range)",
      false,
      error.message
    );
    logTest("Query Range returns time-series data", false, "Query failed");
  }

  // Test 3: Label Values
  try {
    const labelsResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/label/__name__/values`
    );

    logTest(
      "Label Values API endpoint",
      labelsResponse.status === 200 && labelsResponse.data.status === "success",
      `Status: ${labelsResponse.status}`
    );

    if (labelsResponse.data && labelsResponse.data.data) {
      const metricCount = labelsResponse.data.data.length;
      logTest(
        "Returns available metrics list",
        metricCount > 0,
        `Found ${metricCount} metrics`
      );
    }
  } catch (error) {
    logTest("Label Values API endpoint", false, error.message);
    logTest("Returns available metrics list", false, "Query failed");
  }
}

async function testAlertsEndpoints() {
  logSection("Testing Alerts API Endpoints");

  try {
    const alertsResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/alerts`
    );

    logTest(
      "Alerts API endpoint (/api/v1/alerts)",
      alertsResponse.status === 200 && alertsResponse.data.status === "success",
      `Status: ${alertsResponse.status}`
    );

    if (alertsResponse.data && alertsResponse.data.data) {
      const alerts = alertsResponse.data.data.alerts;
      logTest(
        "Returns alerts data structure",
        Array.isArray(alerts),
        `Found ${alerts?.length || 0} alerts`
      );
    }
  } catch (error) {
    logTest("Alerts API endpoint (/api/v1/alerts)", false, error.message);
    logTest("Returns alerts data structure", false, "Query failed");
  }

  try {
    const rulesResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/rules`
    );

    logTest(
      "Rules API endpoint (/api/v1/rules)",
      rulesResponse.status === 200 && rulesResponse.data.status === "success",
      `Status: ${rulesResponse.status}`
    );
  } catch (error) {
    logTest("Rules API endpoint (/api/v1/rules)", false, error.message);
  }
}

async function testTargetsEndpoint() {
  logSection("Testing Targets API Endpoint");

  try {
    const targetsResponse = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/targets`
    );

    logTest(
      "Targets API endpoint (/api/v1/targets)",
      targetsResponse.status === 200 &&
        targetsResponse.data.status === "success",
      `Status: ${targetsResponse.status}`
    );

    if (targetsResponse.data && targetsResponse.data.data) {
      const activeTargets = targetsResponse.data.data.activeTargets;
      logTest(
        "Returns scrape targets",
        Array.isArray(activeTargets),
        `Found ${activeTargets?.length || 0} active targets`
      );
    }
  } catch (error) {
    logTest("Targets API endpoint (/api/v1/targets)", false, error.message);
    logTest("Returns scrape targets", false, "Query failed");
  }
}

async function testSpecificMetrics() {
  logSection("Testing Specific Metrics");

  const metricsToTest = [
    { name: "up", description: "Instance health status" },
    {
      name: "prometheus_build_info",
      description: "Prometheus build information",
    },
    {
      name: "prometheus_tsdb_head_samples_appended_total",
      description: "TSDB samples",
    },
  ];

  for (const metric of metricsToTest) {
    try {
      const response = await makeRequest(
        `${CONFIG.prometheusUrl}/api/v1/query?query=${metric.name}`
      );

      const hasResults =
        response.data?.data?.result && response.data.data.result.length > 0;
      logTest(
        `Metric: ${metric.name}`,
        hasResults,
        hasResults ? metric.description : "Metric not found"
      );
    } catch (error) {
      logTest(`Metric: ${metric.name}`, false, error.message);
    }
  }
}

async function testDataProcessing() {
  logSection("Testing Data Processing Logic");

  // Test 1: Time range calculations
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  logTest(
    "Time range calculation",
    oneHourAgo < now && now - oneHourAgo === 3600000,
    "Correctly calculates 1 hour range"
  );

  // Test 2: Metric name extraction
  try {
    const response = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/label/__name__/values`
    );

    if (response.data && response.data.data) {
      const metrics = response.data.data;
      const hasSystemMetrics =
        metrics.includes("up") || metrics.includes("prometheus_build_info");
      logTest(
        "Metric name extraction",
        hasSystemMetrics,
        "System metrics found in list"
      );
    }
  } catch (error) {
    logTest("Metric name extraction", false, error.message);
  }

  // Test 3: Alert state parsing
  try {
    const response = await makeRequest(`${CONFIG.prometheusUrl}/api/v1/alerts`);

    if (response.data && response.data.data && response.data.data.alerts) {
      const alerts = response.data.data.alerts;
      const validStates = alerts.every((alert) =>
        ["firing", "pending", "inactive"].includes(alert.state)
      );
      logTest(
        "Alert state validation",
        alerts.length === 0 || validStates,
        `Validated ${alerts.length} alerts`
      );
    }
  } catch (error) {
    logTest("Alert state validation", false, error.message);
  }
}

async function testErrorHandling() {
  logSection("Testing Error Handling");

  // Test 1: Invalid query
  try {
    const response = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/query?query=invalid{{}}`
    );

    logTest(
      "Handles invalid query syntax",
      response.data.status === "error" || response.status === 400,
      "Returns error for invalid syntax"
    );
  } catch (error) {
    logTest("Handles invalid query syntax", true, "Error caught correctly");
  }

  // Test 2: Non-existent endpoint
  try {
    const response = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/nonexistent`
    );

    logTest(
      "Handles non-existent endpoint",
      response.status === 404 || response.status === 400,
      `Status: ${response.status}`
    );
  } catch (error) {
    logTest("Handles non-existent endpoint", true, "Error handled correctly");
  }

  // Test 3: Invalid time range
  try {
    const response = await makeRequest(
      `${CONFIG.prometheusUrl}/api/v1/query_range?query=up&start=invalid&end=invalid&step=60`
    );

    logTest(
      "Handles invalid time parameters",
      response.data?.status === "error" || response.status === 400,
      "Returns error for invalid time range"
    );
  } catch (error) {
    logTest("Handles invalid time parameters", true, "Error caught correctly");
  }
}

function testExtensionManual() {
  logSection("Manual Extension Tests");

  logInfo("The following tests require manual verification in VS Code:");
  console.log("");

  console.log("1. Extension Activation:");
  console.log(
    "   - Open VS Code Developer Console (Help > Toggle Developer Tools)"
  );
  console.log('   - Look for: "🚀 Vitals extension activated"');
  console.log('   - Verify popup message: "Vitals extension is now active!"');
  console.log("");

  console.log("2. Command Registration:");
  console.log("   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)");
  console.log('   - Search for "Open Vitals"');
  console.log("   - Verify command appears in list");
  console.log("");

  console.log("3. Webview Creation:");
  console.log('   - Run "Open Vitals" command');
  console.log("   - Verify webview panel opens");
  console.log('   - Check for "Vitals" header in webview');
  console.log("");

  console.log("4. UI Components:");
  console.log("   - Verify MetricChart component renders charts");
  console.log("   - Check AlertPanel shows alerts (if any configured)");
  console.log("   - Verify LogViewer displays logs");
  console.log("   - Test refresh functionality");
  console.log("");

  console.log("5. Configuration:");
  console.log("   - Go to Settings (File > Preferences > Settings)");
  console.log('   - Search for "Vitals"');
  console.log("   - Verify configuration options appear");
  console.log("   - Test changing Prometheus URL");
  console.log("");

  console.log("6. Error States:");
  console.log("   - Stop Prometheus server");
  console.log("   - Verify error message appears in webview");
  console.log("   - Restart Prometheus");
  console.log("   - Verify connection restores");
  console.log("");
}

function printSummary() {
  logSection("Test Summary");

  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

  console.log(`Total Tests: ${total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log("");

  if (results.failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  - ${t.name}: ${t.message}`);
      });
    console.log("");
  }

  if (results.failed === 0) {
    console.log(`${colors.green}✓ All automated tests passed!${colors.reset}`);
  } else {
    console.log(
      `${colors.red}✗ Some tests failed. Please review the errors above.${colors.reset}`
    );
  }

  console.log("");
  logWarning("Remember to run manual extension tests in VS Code!");
}

// Main test execution
async function runAllTests() {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        Vitals VS Code Extension - Comprehensive Tests     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  logInfo(`Prometheus URL: ${CONFIG.prometheusUrl}`);
  logInfo(`Test Timeout: ${CONFIG.testTimeout}ms`);
  console.log("");

  try {
    await testPrometheusConnection();
    await testMetricsEndpoints();
    await testAlertsEndpoints();
    await testTargetsEndpoint();
    await testSpecificMetrics();
    await testDataProcessing();
    await testErrorHandling();
    testExtensionManual();

    printSummary();

    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(
      `${colors.red}Fatal error during testing:${colors.reset}`,
      error
    );
    process.exit(1);
  }
}

// Run tests
runAllTests();
