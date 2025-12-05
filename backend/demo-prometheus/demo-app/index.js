const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3001;

// Create a Registry to register metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "vitals-demo",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 500, 1000, 2000, 5000],
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeConnections = new client.Gauge({
  name: "active_connections",
  help: "Number of active connections",
});

const cacheHits = new client.Counter({
  name: "cache_hits_total",
  help: "Total number of cache hits",
});

const cacheMisses = new client.Counter({
  name: "cache_misses_total",
  help: "Total number of cache misses",
});

const errorRate = new client.Counter({
  name: "errors_total",
  help: "Total number of errors",
  labelNames: ["type"],
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeConnections);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(errorRate);

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    httpRequestDuration
      .labels(req.method, req.path, res.statusCode)
      .observe(duration);
    httpRequestsTotal.labels(req.method, req.path, res.statusCode).inc();
  });

  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Demo endpoints that generate realistic traffic
app.get("/api/users", (req, res) => {
  // Simulate cache behavior
  if (Math.random() > 0.3) {
    cacheHits.inc();
    res.json({ users: [], cached: true });
  } else {
    cacheMisses.inc();
    res.json({ users: [], cached: false });
  }
});

app.get("/api/data", (req, res) => {
  // Simulate occasional errors
  if (Math.random() > 0.95) {
    errorRate.labels("server_error").inc();
    res.status(500).json({ error: "Internal server error" });
  } else {
    res.json({ data: { items: Math.floor(Math.random() * 100) } });
  }
});

app.post("/api/process", (req, res) => {
  // Simulate processing delay
  const delay = Math.random() * 500;
  setTimeout(() => {
    res.json({ processed: true, delay });
  }, delay);
});

// Simulate background activity
setInterval(() => {
  // Random active connections
  activeConnections.set(Math.floor(Math.random() * 50) + 10);

  // Simulate some background requests
  const endpoints = ["/api/users", "/api/data", "/api/process"];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  httpRequestsTotal.labels("GET", endpoint, 200).inc();
}, 5000);

// Simulate occasional errors
setInterval(() => {
  if (Math.random() > 0.7) {
    errorRate.labels("validation_error").inc();
  }
}, 10000);

app.listen(PORT, () => {
  console.log(`Demo app listening on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
