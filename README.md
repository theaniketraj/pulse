# Pulse Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/visual-studio-marketplace/v/theaniketraj.pulse-dashboard)](https://marketplace.visualstudio.com/items?itemName=theaniketraj.pulse-dashboard)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/theaniketraj.pulse-dashboard)](https://marketplace.visualstudio.com/items?itemName=theaniketraj.pulse-dashboard)

**Pulse Dashboard** is a powerful Visual Studio Code extension that brings real-time application observability directly into your editor. Integrated seamlessly with Prometheus, it allows developers to monitor metrics, view logs, and track alerts without ever leaving their coding environment.

<!-- ![Pulse Dashboard Demo](https://raw.githubusercontent.com/theaniketraj/pulse/main/docs/images/demo.gif) -->

## Key Features

- **Real-Time Metrics**: Visualize critical system and application metrics (CPU, Memory, Request Latency) with dynamic, auto-updating charts.
- **Live Log Stream**: View application logs in a terminal-like interface with syntax highlighting and filtering.
- **Active Alerts**: Stay informed with a dedicated panel for firing and pending Prometheus alerts.
- **Seamless Integration**: Works out-of-the-box with any Prometheus-compatible data source.
- **Modern UI**: A premium, responsive design that adapts to your VS Code theme and layout.

## Installation

### From VS Code Marketplace

1. Open **VS Code**.
2. Go to the **Extensions** view (`Ctrl+Shift+X`).
3. Search for **"Pulse Dashboard"**.
4. Click **Install**.

### From Source

```bash
git clone https://github.com/theaniketraj/pulse.git
cd pulse
npm install
npm run build
```

## Configuration

Pulse Dashboard connects to a Prometheus server to fetch data. By default, it looks for a local instance.

1. Open **Settings** (`Ctrl+,`).
2. Search for `pulse.prometheusUrl`.
3. Set your Prometheus URL:

   ```json
   {
     "pulse.prometheusUrl": "http://localhost:9090"
   }
   ```

## Usage

1. Open the **Command Palette** (`Ctrl+Shift+P`).
2. Run the command: `Open Pulse Dashboard`.
3. The dashboard will open in a new panel, displaying your configured metrics and logs.

## Architecture

Pulse Dashboard is built with a modular architecture separating the VS Code extension host from the React-based webview.

- **Extension Host**: Handles configuration, commands, and API communication (Node.js).
- **Webview**: Renders the UI using React, Recharts/Observable Plot, and custom hooks.
- **Data Flow**: The extension polls Prometheus and sends data to the webview via IPC.

For a deep dive, check out [SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md).

## Development

We welcome contributions! To get started with local development:

1. **Clone the repo**:

   ```bash
   git clone https://github.com/theaniketraj/pulse.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run in Watch Mode**:

   ```bash
   npm run watch
   ```

4. **Launch Extension**:
   Press `F5` in VS Code to open the Extension Development Host.

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed instructions.

## Contributing

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

For security concerns, please refer to [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ by [Aniket Raj](https://theaniketraj.netlify.app)_
