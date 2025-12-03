# Getting Started with Pulse Dashboard

Welcome to Pulse Dashboard! This guide will take you from installation to monitoring your first application in minutes.

## Prerequisites

Before you begin, ensure you have:

1. **Visual Studio Code** (v1.94.0 or higher)
2. **Prometheus** (running locally or accessible via network)

   - _Don't have Prometheus?_ Run it quickly with Docker:

     ```bash
     docker run -p 9090:9090 prom/prometheus
     ```

## Installation

### Option A: Install from Marketplace

1. Open VS Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Search for `Pulse Dashboard`.
4. Click **Install**.

### Option B: Build from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/theaniketraj/pulse.git
   cd pulse
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Press `F5` to launch the extension in debug mode.

## Configuration

By default, Pulse tries to connect to `http://localhost:9090`. If your Prometheus server is elsewhere:

1. Open **Settings** (`Ctrl+,`).
2. Search for `Pulse`.
3. Edit **Pulse: Prometheus Url** to match your server (e.g., `http://my-server:9090`).

## 🎮 Your First Dashboard

1. **Open the Dashboard**:

   - Press `Ctrl+Shift+P` to open the Command Palette.
   - Type `Pulse: Open Pulse Dashboard` and press Enter.

2. **Explore the UI**:

   - **Top Bar**: Shows the "Live" status indicator.
   - **KPI Cards**: Quick stats on Request Rate, Error Rate, and Latency.
   - **Main Chart**: A real-time area chart visualizing your metrics.
   - **Log Stream**: A terminal-like view of your application logs.
   - **Alerts Panel**: A list of active firing or pending alerts.

3. **Interact**:
   - Hover over the chart to see precise values.
   - Resize the VS Code panel to see the responsive layout adapt.

## Troubleshooting Common Issues

- **"Connection Refused"**: Ensure your Prometheus server is running and the URL in settings is correct.
- **Empty Charts**: Check if your Prometheus instance is actually scraping data. You can verify this by visiting `http://localhost:9090/targets`.

# Getting Started with Pulse Dashboard

Welcome to Pulse Dashboard! This guide will take you from installation to monitoring your first application in minutes.

## Prerequisites

Before you begin, ensure you have:

1. **Visual Studio Code** (v1.94.0 or higher)
2. **Prometheus** (running locally or accessible via network)

   - _Don't have Prometheus?_ Run it quickly with Docker:

     ```bash
     docker run -p 9090:9090 prom/prometheus
     ```

## Installation

### Option A: Install from Marketplace

1. Open VS Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Search for `Pulse Dashboard`.
4. Click **Install**.

### Option B: Build from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/theaniketraj/pulse.git
   cd pulse
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Press `F5` to launch the extension in debug mode.

## Configuration

By default, Pulse tries to connect to `http://localhost:9090`. If your Prometheus server is elsewhere:

1. Open **Settings** (`Ctrl+,`).
2. Search for `Pulse`.
3. Edit **Pulse: Prometheus Url** to match your server (e.g., `http://my-server:9090`).

## 🎮 Your First Dashboard

1. **Open the Dashboard**:

   - Press `Ctrl+Shift+P` to open the Command Palette.
   - Type `Pulse: Open Pulse Dashboard` and press Enter.

2. **Explore the UI**:

   - **Top Bar**: Shows the "Live" status indicator.
   - **KPI Cards**: Quick stats on Request Rate, Error Rate, and Latency.
   - **Main Chart**: A real-time area chart visualizing your metrics.
   - **Log Stream**: A terminal-like view of your application logs.
   - **Alerts Panel**: A list of active firing or pending alerts.

3. **Interact**:
   - Hover over the chart to see precise values.
   - Resize the VS Code panel to see the responsive layout adapt.

## Troubleshooting Common Issues

- **"Connection Refused"**: Ensure your Prometheus server is running and the URL in settings is correct.
- **Empty Charts**: Check if your Prometheus instance is actually scraping data. You can verify this by visiting `http://localhost:9090/targets`.
- **Extension Not Loading**: Check the "Developer Tools" in VS Code (`Help > Toggle Developer Tools`) for any console errors.

## 📚 Next Steps

- Customize your metrics in `src/data/fetchMetrics.ts`.
- Set up custom alert rules in your Prometheus configuration.
- Read the [Architecture Guide](SYSTEM_ARCHITECTURE.md) to understand how it works under the hood.
