# API Reference

## Extension Commands

### `pulse.openDashboard`

Opens the Pulse in a new webview panel.

**Usage:**

```bash
Command Palette → "Open Pulse"
```

or programmatically:

```typescript
vscode.commands.executeCommand('pulse.openDashboard');
```

## Configuration Settings

### `pulse.prometheusUrl`

- **Type**: `string`
- **Default**: `http://localhost:9090`
- **Description**: URL of the Prometheus server to connect to

**Example:**

```json
{
  "pulse.prometheusUrl": "http://prometheus.example.com:9090"
}
```

## Prometheus API Integration

### PrometheusApi Class

Located in `src/api.ts`

#### Methods

##### `getAlerts(): Promise<any>`

Fetches active alerts from Prometheus.

**Returns**: Alert data in Prometheus API response format

**Throws**: `Error` if network fails or Prometheus returns error status

**Example:**

```typescript
const api = new PrometheusApi('http://localhost:9090');
const alerts = await api.getAlerts();
```

##### `query(query: string): Promise<any>`

Executes a PromQL query against Prometheus.

**Parameters**:

- `query` (string): PromQL query string

**Returns**: Metrics data in Prometheus API response format

**Throws**: `Error` if query is empty, network fails, or Prometheus returns error status

**Example:**

```typescript
const api = new PrometheusApi('http://localhost:9090');
const data = await api.query('up{job="prometheus"}');
```

## IPC Message Protocol

Communication between extension and webview uses VS Code's IPC mechanism.

### Extension → Webview Messages

#### `updateMetrics`

Sends metric query results to webview.

```javascript
{
  command: 'updateMetrics',
  data: {
    status: 'success',
    data: {
      resultType: 'vector',
      result: [
        {
          metric: { __name__: 'up', job: 'prometheus' },
          value: [timestamp, '1']
        }
      ]
    }
  }
}
```

#### `updateAlerts`

Sends active alerts to webview.

```javascript
{
  command: 'updateAlerts',
  data: {
    status: 'success',
    data: {
      alerts: [
        {
          status: 'firing',
          labels: { alertname: 'HighErrorRate' },
          annotations: { description: 'High error rate detected' }
        }
      ]
    }
  }
}
```

#### `updateLogs`

Sends log entries to webview (currently mock data).

```javascript
{
  command: 'updateLogs',
  data: [
    '[INFO] Application started at 2025-12-03T22:27:17Z',
    '[INFO] Connected to database',
    '[WARN] High memory usage detected'
  ]
}
```

#### `error`

Sends error information to webview.

```javascript
{
  command: 'error',
  message: 'Network error: Connection refused'
}
```

### Webview → Extension Messages

#### `fetchMetrics`

Requests metric data for a specific query.

```javascript
{
  command: 'fetchMetrics',
  query: 'up{job="prometheus"}'
}
```

#### `fetchAlerts`

Requests list of active alerts.

```javascript
{
  command: 'fetchAlerts'
}
```

#### `fetchLogs`

Requests log entries.

```javascript
{
  command: 'fetchLogs'
}
```

## Data Models

### Alert

```typescript
interface Alert {
  status: 'firing' | 'resolved';
  labels: Record<string, string>;
  annotations: Record<string, string>;
  startsAt: string;
  endsAt: string;
}
```

### Metric

Prometheus metric vector result:

```typescript
interface MetricResult {
  metric: Record<string, string>;
  value: [number, string]; // [timestamp, value]
}
```

### LogEntry

```typescript
type LogEntry = string;
```

## Error Handling

All API calls include error handling with user-facing messages via `vscode.window.showErrorMessage()`.

**Common Errors**:

- `Network error: ...` - HTTP/connection failure
- `Prometheus API error: ...` - Prometheus returned error status
- `Query cannot be empty` - Empty PromQL query provided

## React Hooks

### `usePulseData(vscode)`

Custom hook for fetching metrics and logs.

**Returns**:

```typescript
{
  metrics: any,
  logs: string[],
  loading: boolean,
  error: string | null
}
```

### `useAlerts(vscode)`

Custom hook for fetching and monitoring alerts.

**Returns**:

```typescript
{
  alerts: Alert[],
  loading: boolean,
  error: string | null
}
```
