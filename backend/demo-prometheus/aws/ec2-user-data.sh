#!/bin/bash
set -e

# AWS EC2 User Data Script for Vitals Demo Prometheus
# This script runs on instance launch to set up Docker and deploy the demo

echo "===== Starting Vitals Demo Setup ====="

# Update system packages
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose V2
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install Git
sudo yum install -y git

# Create app directory
sudo mkdir -p /opt/vitals-demo
cd /opt/vitals-demo

# Clone repository (or copy files)
# Option 1: Clone from GitHub (requires public repo)
# git clone https://github.com/theaniketraj/vitals.git .
# cd backend/demo-prometheus

# Option 2: Download files directly (if repo is private)
sudo mkdir -p demo-app

# Create demo app files
cat > demo-app/package.json <<'EOF'
{
  "name": "vitals-demo-app",
  "version": "1.0.0",
  "description": "Demo application with Prometheus metrics for Vitals extension",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prom-client": "^15.1.0"
  }
}
EOF

cat > demo-app/index.js <<'EOF'
const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = 3001;

// Create a Registry to register metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'vitals-demo'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 500, 1000, 2000, 5000]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const cacheHits = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits'
});

const cacheMisses = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses'
});

const errorRate = new client.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type']
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
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);
    httpRequestsTotal.labels(req.method, req.path, res.statusCode).inc();
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Demo endpoints that generate realistic traffic
app.get('/api/users', (req, res) => {
  // Simulate cache behavior
  if (Math.random() > 0.3) {
    cacheHits.inc();
    res.json({ users: [], cached: true });
  } else {
    cacheMisses.inc();
    res.json({ users: [], cached: false });
  }
});

app.get('/api/data', (req, res) => {
  // Simulate occasional errors
  if (Math.random() > 0.95) {
    errorRate.labels('server_error').inc();
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.json({ data: { items: Math.floor(Math.random() * 100) } });
  }
});

app.post('/api/process', (req, res) => {
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
  const endpoints = ['/api/users', '/api/data', '/api/process'];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  httpRequestsTotal.labels('GET', endpoint, 200).inc();
}, 5000);

// Simulate occasional errors
setInterval(() => {
  if (Math.random() > 0.7) {
    errorRate.labels('validation_error').inc();
  }
}, 10000);

app.listen(PORT, () => {
  console.log(`Demo app listening on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
EOF

# Create Prometheus config
cat > prometheus.aws.yml <<'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'vitals-demo'
    environment: 'aws-production'

scrape_configs:
  # Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Demo Node.js application
  - job_name: 'demo-app'
    static_configs:
      - targets: ['demo-app:3001']
    metrics_path: '/metrics'
    scrape_interval: 10s
EOF

# Create Docker Compose file
cat > docker-compose.aws.yml <<'EOF'
version: "3.8"

services:
  # Prometheus server - minimal config for AWS
  prometheus:
    image: prom/prometheus:latest
    container_name: vitals-prometheus
    volumes:
      - ./prometheus.aws.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=7d"
      - "--web.enable-lifecycle"
      - "--web.enable-admin-api"
    restart: unless-stopped
    networks:
      - vitals-network

  # Node.js demo app with metrics
  demo-app:
    image: node:18-alpine
    container_name: vitals-demo-app
    working_dir: /app
    volumes:
      - ./demo-app:/app
    ports:
      - "3001:3001"
    command: sh -c "npm install --production && node index.js"
    restart: unless-stopped
    networks:
      - vitals-network
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  vitals-network:
    driver: bridge

volumes:
  prometheus-data:
    driver: local
EOF

# Create Nginx reverse proxy config
sudo yum install -y nginx
sudo tee /etc/nginx/conf.d/vitals-demo.conf > /dev/null <<'EOF'
upstream prometheus {
    server localhost:9090;
}

server {
    listen 80;
    server_name _;

    # Prometheus proxy
    location / {
        proxy_pass http://prometheus;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Start Nginx
sudo service nginx start
sudo chkconfig nginx on

# Pull Docker images
sudo docker pull prom/prometheus:latest
sudo docker pull node:18-alpine

# Start services
sudo docker compose -f docker-compose.aws.yml up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Verify services are running
sudo docker compose -f docker-compose.aws.yml ps

# Test endpoints
echo "Testing Prometheus..."
curl -f http://localhost:9090/-/healthy || echo "Prometheus not ready yet"

echo "Testing demo app..."
curl -f http://localhost:3001/health || echo "Demo app not ready yet"

# Set up auto-start on reboot
cat > /etc/systemd/system/vitals-demo.service <<'EOF'
[Unit]
Description=Vitals Demo Prometheus Stack
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/vitals-demo
ExecStart=/usr/local/bin/docker compose -f docker-compose.aws.yml up -d
ExecStop=/usr/local/bin/docker compose -f docker-compose.aws.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable vitals-demo.service

echo "===== Vitals Demo Setup Complete ====="
echo "Prometheus: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):9090"
echo "Demo App: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001/metrics"
echo ""
echo "To check status: sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml ps"
echo "To view logs: sudo docker compose -f /opt/vitals-demo/docker-compose.aws.yml logs -f"
