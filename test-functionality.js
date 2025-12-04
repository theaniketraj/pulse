// Test script for core Vitals functionality
// Run this with: node test-functionality.js

const axios = require("axios");

async function testPrometheusConnection() {
  console.log("🔄 Testing Prometheus connection...");
  try {
    const response = await axios.get("http://localhost:9090/api/v1/query", {
      params: { query: "up" },
    });

    if (response.data.status === "success") {
      console.log("✅ Prometheus connection successful");
      console.log(
        "📊 Sample data:",
        JSON.stringify(response.data.data.result[0], null, 2)
      );
    } else {
      console.log("❌ Prometheus returned error status");
    }
  } catch (error) {
    console.log("❌ Failed to connect to Prometheus:", error.message);
    console.log("💡 Make sure the mock server is running: node test-server.js");
  }
}

async function testMetricQueries() {
  console.log("\n🔄 Testing various metric queries...");
  const queries = ["up", "cpu_usage", "error_rate", "memory_usage"];

  for (const query of queries) {
    try {
      const response = await axios.get("http://localhost:9090/api/v1/query", {
        params: { query },
      });

      const resultCount = response.data.data.result.length;
      console.log(`✅ Query "${query}": ${resultCount} results`);
    } catch (error) {
      console.log(`❌ Query "${query}" failed:`, error.message);
    }
  }
}

async function testAlertThresholds() {
  console.log("\n🔄 Testing alert threshold logic...");

  try {
    const response = await axios.get("http://localhost:9090/api/v1/query", {
      params: { query: "error_rate" },
    });

    const errorRate = parseFloat(response.data.data.result[0]?.value[1] || 0);
    console.log(`📊 Current error rate: ${errorRate}%`);

    if (errorRate > 5) {
      console.log("🚨 Alert condition met: Error rate > 5%");
    } else {
      console.log("✅ Error rate within acceptable limits");
    }
  } catch (error) {
    console.log("❌ Failed to test alert thresholds:", error.message);
  }
}

async function runTests() {
  console.log("🧪 Starting Vitals functionality tests...\n");

  await testPrometheusConnection();
  await testMetricQueries();
  await testAlertThresholds();

  console.log("\n✨ Tests completed!");
  console.log("\n📝 Next steps:");
  console.log("1. Open VS Code with: code --extensionDevelopmentPath=.");
  console.log('2. Press Ctrl+Shift+P and run "Open Vitals"');
  console.log("3. Check the developer console for any errors");
  console.log("4. Verify the dashboard loads and displays data");
}

runTests().catch(console.error);
