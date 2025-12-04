# Prometheus Setup for Vitals

Vitals uses Prometheus to collect and display system metrics. Follow this guide to set up Prometheus locally.

## Quick Start (Windows)

### 1. Download Prometheus

```bash
# Download the latest Windows version
curl -L https://github.com/prometheus/prometheus/releases/download/v2.50.1/prometheus-2.50.1.windows-amd64.zip -o prometheus.zip

# Extract
unzip prometheus.zip
cd prometheus-2.50.1.windows-amd64
```

### 2. Configure Prometheus

The extension includes a basic `prometheus.yml` configuration. Copy it to your Prometheus directory:

```bash
cp d:/ceie/pulse/tmp/prometheus.yml ./prometheus.yml
```

Or use this minimal configuration:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### 3. Start Prometheus

```bash
# Run Prometheus
./prometheus.exe --config.file=prometheus.yml

# Or run in background
start prometheus.exe --config.file=prometheus.yml
```

Prometheus will start on `http://localhost:9090` by default.

### 4. Verify Installation

Open your browser and visit: `http://localhost:9090`

You should see the Prometheus web UI.

## Configure Custom URL

If you want to use a different Prometheus URL:

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "Vitals: Prometheus URL"
3. Update the URL (e.g., `http://localhost:9090`)

## Docker Alternative

If you prefer Docker:

```bash
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v d:/ceie/pulse/tmp/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

## Troubleshooting

### "Cannot connect to Prometheus" error in dashboard

- Ensure Prometheus is running: Check if `http://localhost:9090` is accessible
- Check the configured URL in VS Code settings
- Verify firewall isn't blocking port 9090

### No metrics showing

- Make sure you have exporters configured (node_exporter for system metrics)
- Check Prometheus targets: `http://localhost:9090/targets`

## Adding Node Exporter (System Metrics)

To collect system metrics like CPU, memory, and disk usage:

### Windows

```bash
# Download node_exporter for Windows
curl -L https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.windows-amd64.zip -o node_exporter.zip

# Extract and run
unzip node_exporter.zip
cd node_exporter-1.7.0.windows-amd64
./node_exporter.exe
```

### Docker

```bash
docker run -d \
  --name node-exporter \
  -p 9100:9100 \
  prom/node-exporter
```

Then add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

Restart Prometheus to apply changes.

## Next Steps

Once Prometheus is running:

1. Reload the Vitals extension (`Developer: Reload Window`)
2. Open the Vitals dashboard (`Vitals: Open Dashboard`)
3. System metrics should now load successfully! 🎉

## Learn More

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Node Exporter Guide](https://prometheus.io/docs/guides/node-exporter/)
- [Query Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
