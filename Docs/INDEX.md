# Documentation Index

Welcome to Pulse Dashboard documentation. Here's what's available:

## 📚 Documentation Files

### Getting Started

- **[QUICKSTART.md](QUICKSTART.md)** - Start here! Installation, configuration, and basic usage
- **[VISION.md](VISION.md)** - Project vision and roadmap

### Technical Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and component overview
- **[COMPONENTS.md](COMPONENTS.md)** - React component reference and API
- **[API.md](API.md)** - Extension API, IPC protocol, and data models

### For Developers

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development setup, workflow, and testing
- **[TESTING.md](TESTING.md)** - Testing strategies and guidelines

### Support

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## 🎯 Quick Navigation

**I want to...**

- **Install and use Pulse** → [QUICKSTART.md](QUICKSTART.md)
- **Understand how it works** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **Set up development environment** → [DEVELOPMENT.md](DEVELOPMENT.md)
- **Look up component API** → [COMPONENTS.md](COMPONENTS.md) or [API.md](API.md)
- **Fix a problem** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Contribute or extend** → [DEVELOPMENT.md](DEVELOPMENT.md)
- **See what's planned** → [VISION.md](VISION.md)

## 📋 File Descriptions

### Quick Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| QUICKSTART.md | Installation & basic usage | Users |
| ARCHITECTURE.md | System design & layers | Developers |
| COMPONENTS.md | React component reference | Frontend developers |
| API.md | Extension API & protocols | Extension developers |
| DEVELOPMENT.md | Dev environment & workflow | Contributors |
| TESTING.md | Test strategies | QA & developers |
| TROUBLESHOOTING.md | Common issues & fixes | Users & developers |
| VISION.md | Project goals & roadmap | Everyone |

## 🏗️ Architecture Overview

```bash
Extension Layer (TypeScript/Node.js)
    ├── Extension Host (extension.ts)
    ├── Webview Manager (pulseView.ts)
    ├── Prometheus API Client (api.ts)
    └── Data Processors (data/*.ts)
            ↓
        IPC Bridge
            ↓
React Webview Layer (React/TypeScript)
    ├── App.tsx
    ├── Components (MetricChart, AlertPanel, LogViewer)
    └── Hooks (usePulseData, useAlerts)
            ↓
        Prometheus Server
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

## 🔧 Key APIs

### Commands

- `pulse.openDashboard` - Open the Pulse Dashboard

See [API.md](API.md#extension-commands)

### Configuration

- `pulse.prometheusUrl` - Prometheus server URL (default: `http://localhost:9090`)

See [API.md](API.md#configuration-settings)

### IPC Messages

Extension and webview communicate via IPC protocol:

```bash
Webview → Extension:
  { command: 'fetchMetrics', query: '...' }
  { command: 'fetchAlerts' }
  { command: 'fetchLogs' }

Extension → Webview:
  { command: 'updateMetrics', data: {...} }
  { command: 'updateAlerts', data: {...} }
  { command: 'error', message: '...' }
```

See [API.md](API.md#ipc-message-protocol)

## 📦 Project Structure

```bash
pulse/
├── Docs/                          # Documentation
│   ├── ARCHITECTURE.md           # System design
│   ├── API.md                    # API reference
│   ├── COMPONENTS.md             # Component docs
│   ├── DEVELOPMENT.md            # Dev guide
│   ├── QUICKSTART.md             # Getting started
│   ├── TESTING.md                # Testing guide
│   ├── TROUBLESHOOTING.md        # FAQ & fixes
│   ├── VISION.md                 # Roadmap
│   └── INDEX.md                  # This file
├── src/                          # Extension code
│   ├── extension.ts             # Entry point
│   ├── pulseView.ts             # Webview manager
│   ├── api.ts                   # Prometheus client
│   ├── data/                    # Data processing
│   ├── utils/                   # Utilities
│   └── test/                    # Unit tests
├── webview/                     # React frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.tsx
│   └── tsconfig.json
├── webpack.config.js            # Extension webpack config
├── webpack.config.webview.js    # Webview webpack config
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started Checklist

- [ ] Read [QUICKSTART.md](QUICKSTART.md)
- [ ] Install extension from marketplace or build from source
- [ ] Configure Prometheus URL in VS Code settings
- [ ] Open Pulse Dashboard (Command Palette)
- [ ] View metrics and alerts
- [ ] Explore [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues

## 💡 Contributing

Want to improve Pulse Dashboard?

1. Fork repository
2. Read [DEVELOPMENT.md](DEVELOPMENT.md)
3. Create feature branch
4. Make changes and test (see [TESTING.md](TESTING.md))
5. Submit pull request

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/theaniketraj/pulse/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/theaniketraj/pulse/discussions)
- **VS Code Marketplace**: [Reviews & ratings](https://marketplace.visualstudio.com/)

## 📄 Version

**Pulse Dashboard** v0.1.0

Current documentation is accurate for this version. Check [VISION.md](VISION.md) for planned features.

---

Last updated: December 2025
