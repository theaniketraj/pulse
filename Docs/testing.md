# Testing Vitals Locally

This guide will help you test the Vitals extension with a real, local Prometheus instance.

## Prerequisites

- **Docker**: To easily run a Prometheus server.
- **Node.js & npm**: To build the extension.
- **VS Code**: To run the extension in debug mode.

## Step 1: Start a Local Prometheus Instance

The easiest way to run Prometheus is via Docker. We will also configure it to scrape itself so we have some metrics to view.

1. Create a file named `prometheus.yml` in a temporary directory (e.g., `tmp/prometheus.yml`) with the following content:

    ```yaml
    global:
      scrape_interval: 15s

    scrape_configs:
      - job_name: "prometheus"
        static_configs:
          - targets: ["localhost:9090"]
    ```

2. Run the Prometheus container:

    ```bash
    docker run -d -p 9090:9090 -v /path/to/your/tmp/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
    ```

    _(Replace `/path/to/your/tmp/prometheus.yml` with the absolute path to the file you created)._

    Alternatively, for a quick test without a custom config (it usually scrapes itself by default):

    ```bash
    docker run -d -p 9090:9090 prom/prometheus
    ```

3. Verify Prometheus is running by visiting `http://localhost:9090` in your browser.

## Step 2: Build and Run the Extension

1. Open the `pulse` project in VS Code.
2. Install dependencies (if you haven't already):

    ```bash
    npm install
    ```

3. Start the build watcher for both the extension and the webview:

    ```bash
    npm run watch
    ```

4. Press **F5** (or go to **Run and Debug** > **Run Extension**) to open a new VS Code window with the extension loaded.

## Step 3: Configure the Extension

In the new **Extension Development Host** window:

1. Open **Settings** (`Ctrl+,` or `Cmd+,`).
2. Search for `Vitals`.
3. Ensure `Vitals: Prometheus Url` is set to `http://localhost:9090`.

## Step 4: Open the Dashboard

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Run the command: `Vitals: Open Vitals`.
3. The dashboard should open in a new panel.

## Step 5: Verification

- **Metrics**: You should see a chart displaying the `up` metric (or whichever query is hardcoded in `usePulseData.ts`). It should show a value of `1`.
- **Alerts**: If you configured any alerts in Prometheus, they will appear in the Alert Panel.
- **Logs**: The Log Viewer will currently show mock data (as implemented).

## Troubleshooting

- **"Failed to fetch metrics"**:
  - Ensure Prometheus is running at `http://localhost:9090`.
  - Check if the extension host can access `localhost`.
- **Empty Chart**:
  - Wait a few seconds for Prometheus to scrape some data.
  - Verify the query in `usePulseData.ts` is valid (currently `up`).
