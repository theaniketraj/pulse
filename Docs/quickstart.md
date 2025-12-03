# Quick Start Guide

## Installation

### From Source

```bash
git clone https://github.com/theaniketraj/pulse.git
cd pulse
npm install
npm run build
```

### In VS Code

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search for "Pulse Dashboard"
4. Click Install

Or install from GitHub releases (VSIX file)

## Configuration

Set Prometheus URL in VS Code settings:

**File → Preferences → Settings** (or `Ctrl+,`)

Search for `pulse.prometheusUrl`:

```json
{
  "pulse.prometheusUrl": "http://localhost:9090"
}
```

**Default**: `http://localhost:9090`

## First Run

### 1. Open Dashboard

- **Command Palette** (`Ctrl+Shift+P`)
- Type: `Open Pulse Dashboard`
- Press Enter

### 2. Wait for Data

Dashboard loads metrics and alerts from Prometheus automatically.

### 3. View Metrics

- **System Metrics** chart shows live data
- **Live Logs** section displays application logs
- **Active Alerts** shows triggered alerts

## Basic Usage

### View Metrics

1. Dashboard displays KPIs automatically:

   - Request Rate
   - Error Rate
   - Average Latency
   - Active Alerts count

2. System Metrics chart updates in real-time

### View Alerts

Active alerts appear in the "Active Alerts" panel with:

- Alert status (Firing/Resolved)
- Alert name and labels
- Description

### View Logs

Live log stream shows application logs in chronological order.

## Troubleshooting

### Dashboard is blank

**Check**:

1. Prometheus is running (`http://localhost:9090` in browser)
2. Settings show correct Prometheus URL
3. Prometheus has data (go to `http://localhost:9090/graph`)

### No metrics showing

1. Verify Prometheus connection in browser
2. Check PromQL queries in source code
3. Enable debug mode and check console logs

**Debug Console**:

- Press `Ctrl+Shift+Y` to view extension logs
- Look for error messages

### High error rate warning

Check `processAlerts()` in `src/data/alertProcessor.ts` for threshold rules.

## Common Queries

### Prometheus Uptime

```bash
up{job="prometheus"}
```

### System Metrics

```bash
node_cpu_seconds_total
node_memory_MemAvailable_bytes
```

### Application Metrics

```bash
http_requests_total
http_request_duration_seconds
```

## Next Steps

- Read [system_architecture.md](system_architecture.md) for technical details
- See [development.md](development.md) to contribute
- Check [api.md](api.md) for extension API reference
- Browse [components.md](components.md) for UI component docs

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/theaniketraj/pulse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theaniketraj/pulse/discussions)
- **Documentation**: See `/Docs` folder

## Performance Tips

1. **Limit metric queries** - Avoid querying too many time series
2. **Adjust refresh rate** - Modify polling intervals in hooks
3. **Filter logs** - Use log level filters to reduce volume
4. **Archive old alerts** - Prometheus automatically expires old data

## System Requirements

- VS Code 1.94.0 or later
- Node.js 16+ (for development)
- Prometheus 2.0+ (for metrics)
- 2GB RAM minimum
- Stable network connection to Prometheus

## Next: Development

To contribute or customize:

```bash
npm run watch      # Start development mode
npm run test       # Run tests
npm run build      # Production build
```

See [development.md](development.md) for details.
