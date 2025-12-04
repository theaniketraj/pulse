const http = require("http");
const url = require("url");

// Simple mock Prometheus server for testing
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (parsedUrl.pathname === "/api/v1/query") {
    const query = parsedUrl.query.query;
    console.log(`Received query: ${query}`);

    // Mock response based on query
    let mockData;
    if (query === "up") {
      mockData = {
        status: "success",
        data: {
          resultType: "vector",
          result: [
            {
              metric: {
                __name__: "up",
                instance: "localhost:9090",
                job: "prometheus",
              },
              value: [Date.now() / 1000, "1"],
            },
          ],
        },
      };
    } else if (query.includes("cpu")) {
      mockData = {
        status: "success",
        data: {
          resultType: "vector",
          result: [
            {
              metric: { __name__: "cpu_usage", instance: "localhost:8080" },
              value: [Date.now() / 1000, (Math.random() * 100).toFixed(2)],
            },
          ],
        },
      };
    } else if (query.includes("error_rate")) {
      mockData = {
        status: "success",
        data: {
          resultType: "vector",
          result: [
            {
              metric: { __name__: "error_rate", instance: "localhost:8080" },
              value: [Date.now() / 1000, (Math.random() * 10).toFixed(2)],
            },
          ],
        },
      };
    } else {
      mockData = {
        status: "success",
        data: {
          resultType: "vector",
          result: [],
        },
      };
    }

    res.writeHead(200);
    res.end(JSON.stringify(mockData));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const PORT = 9090;
server.listen(PORT, () => {
  console.log(`Mock Prometheus server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("- GET /api/v1/query?query=up");
  console.log("- GET /api/v1/query?query=cpu_usage");
  console.log("- GET /api/v1/query?query=error_rate");
});
