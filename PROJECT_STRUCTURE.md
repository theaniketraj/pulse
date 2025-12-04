# Project Structure

This document provides an overview of the file structure for the Vitals project to help new contributors navigate the codebase.

```bash
vitals/
├── .vscode/                # VS Code workspace configuration
├── docs/                   # Documentation files
├── src/                    # Extension Source Code (Node.js)
│   ├── data/               # Data processing logic
│   │   ├── alertProcessor.ts  # Alert threshold evaluation
│   │   └── fetchMetrics.ts    # Metric fetching logic
│   ├── test/               # Extension unit tests
│   ├── utils/              # Utility functions
│   ├── api.ts              # Prometheus API client
│   ├── extension.ts        # Extension entry point (activates extension)
│   └── vitalsView.ts        # Webview panel manager (IPC handling)
├── webview/                # Webview Source Code (React)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   │   ├── AlertPanel.tsx   # Displays active alerts
│   │   │   ├── dashboard.tsx    # Main dashboard layout
│   │   │   ├── LogViewer.tsx    # Log stream viewer
│   │   │   └── MetricChart.tsx  # Metric visualization chart
│   │   ├── hooks/          # Custom React Hooks
│   │   │   ├── useAlerts.ts     # Manages alert state
│   │   │   └── useVitalsData.ts  # Manages metrics and logs state
│   │   ├── App.css         # Global styles and design system
│   │   ├── App.tsx         # Root React component
│   │   └── index.tsx       # React entry point
│   └── tsconfig.json       # Webview TypeScript config
├── CONTRIBUTING.md         # Contribution guidelines
├── README.md               # Main project documentation
├── SECURITY.md             # Security policy
├── package.json            # Project metadata and scripts
├── webpack.config.js       # Webpack config for Extension
└── webpack.config.webview.js # Webpack config for Webview
```

## Key Directories

### `src/` (Extension)

Contains the "backend" logic of the VS Code extension. It runs in the Node.js extension host environment.

- **`extension.ts`**: The starting point. Registers commands and providers.
- **`vitalsView.ts`**: The bridge between VS Code and the React UI. It handles message passing (IPC).
- **`api.ts`**: Handles all HTTP communication with the Prometheus server.

### `webview/` (Frontend)

Contains the "frontend" UI logic. It runs in a secure browser context (iframe) within VS Code.

- **`components/`**: Reusable UI parts. `MetricChart` uses `@observablehq/plot` for rendering.
- **`hooks/`**: Encapsulates data fetching and state management logic.
- **`App.css`**: Contains the CSS variables and styles for the premium UI look.

### `docs/`

Contains detailed documentation for specific aspects of the project (Architecture, API, Testing, etc.).
