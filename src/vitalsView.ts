import * as vscode from "vscode";
import * as path from "path";
import { getWebviewContent } from "./utils/webviewUtils";
import { PrometheusApi } from "./api";
import { getUsageStats } from "./telemetry/usageStats";

// Class to manage the Webview panel for the Vitals dashboard
export class VitalsView {
  public static currentPanel: VitalsView | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private readonly _context: vscode.ExtensionContext;
  private _disposables: vscode.Disposable[] = [];

  // Constructor to initialize the Webview panel
  private constructor(panel: vscode.WebviewPanel, extensionPath: string, context: vscode.ExtensionContext) {
    this._panel = panel;
    this._extensionPath = extensionPath;
    this._context = context;

    // Set the Webview content (HTML with React bundle)
    this._panel.webview.html = getWebviewContent(
      this._panel.webview,
      vscode.Uri.file(extensionPath)
    );

    // Handle messages from the Webview (e.g., fetch metrics)
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "getPrometheusUrl": {
            // Send Prometheus URL and demo mode status to webview
            const config = vscode.workspace.getConfiguration("vitals");
            const prometheusUrl = config.get<string>("prometheusUrl") || "http://localhost:9090";
            const defaultUrl = config.inspect('prometheusUrl')?.defaultValue as string;
            const isDemoMode = prometheusUrl === defaultUrl;
            
            this._panel.webview.postMessage({
              command: "prometheusUrl",
              url: prometheusUrl,
              isDemoMode: isDemoMode
            });
            break;
          }

          case "configurePrometheus":
            // Trigger the configure Prometheus command
            vscode.commands.executeCommand('vitals.configurePrometheus');
            break;

          case "fetchMetrics":
            // Track metrics feature usage
            getUsageStats(this._context).trackFeature('metrics');
            
            try {
              const config = vscode.workspace.getConfiguration("vitals");
              const prometheusUrl =
                config.get<string>("prometheusUrl") || "http://localhost:9090";
              const api = new PrometheusApi(prometheusUrl);

              const data = await api.query(message.query);
              this._panel.webview.postMessage({
                command: "updateMetrics",
                data,
              });
            } catch (error: any) {
              getUsageStats(this._context).trackError('prometheus_metrics_fetch_failed');
              
              console.log(`Prometheus fetch error: ${error.message}`);
              this._panel.webview.postMessage({
                command: "error",
                message: error.message,
              });
            }
            break;

          case "fetchAlerts":
            // Track alerts feature usage
            getUsageStats(this._context).trackFeature('alerts');
            
            try {
              const config = vscode.workspace.getConfiguration("vitals");
              const prometheusUrl =
                config.get<string>("prometheusUrl") || "http://localhost:9090";
              const api = new PrometheusApi(prometheusUrl);

              const data = await api.getAlerts();
              this._panel.webview.postMessage({
                command: "updateAlerts",
                data,
              });
            } catch (error: any) {
              getUsageStats(this._context).trackError('prometheus_alerts_fetch_failed');
              console.log(`Failed to fetch alerts: ${error.message}`);
              this._panel.webview.postMessage({
                command: "alertError",
                message: error.message,
              });
            }
            break;

          case "fetchLogs": {
            // Track logs feature usage
            getUsageStats(this._context).trackFeature('logs');
            
            // Mock log data for now as Prometheus doesn't have a standard logs endpoint
            // In a real scenario, this would connect to Loki or another log source
            const mockLogs = [
              `[INFO] Application started at ${new Date().toISOString()}`,
              `[INFO] Connected to database`,
              `[WARN] High memory usage detected`,
              `[INFO] Request processed in 45ms`,
            ];
            this._panel.webview.postMessage({
              command: "updateLogs",
              data: mockLogs,
            });
            break;
          }
        }
      },
      undefined,
      this._disposables
    );

    // Dispose the panel when closed
    this._panel.onDidDispose(
      () => this.dispose(),
      undefined,
      this._disposables
    );
  }

  // Create or show the Webview panel
  public static createOrShow(context: vscode.ExtensionContext) {
    console.log('🎨 VitalsView.createOrShow() called');
    
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    // Reuse existing panel if it exists
    if (VitalsView.currentPanel) {
      console.log('♻️ Reusing existing panel');
      VitalsView.currentPanel._panel.reveal(column);
      return;
    }

    console.log('🆕 Creating new webview panel');
    
    // Create a new Webview panel
    const panel = vscode.window.createWebviewPanel(
      "vitalsDashboard",
      "Vitals Dashboard",
      column,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "webview", "build")),
        ],
      }
    );

    console.log('✅ Webview panel created, initializing VitalsView');
    
    // Initialize the panel
    VitalsView.currentPanel = new VitalsView(panel, context.extensionPath, context);
    
    console.log('✅ VitalsView initialized');
  }

  // Dispose the panel and clean up resources
  public dispose() {
    // Track dashboard close
    getUsageStats(this._context).trackDashboardClose();
    
    VitalsView.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
