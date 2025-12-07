import * as vscode from "vscode";
import { getWebviewContent } from "./utils/webviewUtils";
import { PrometheusApi } from "./api";
import { getUsageStats } from "./telemetry/usageStats";

export class VitalsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vitals.dashboardView";
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "webview", "build"),
      ],
    };

    webviewView.webview.html = getWebviewContent(
      webviewView.webview,
      this._extensionUri
    );

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "getPrometheusUrl": {
          // Send Prometheus URL and demo mode status to webview
          const config = vscode.workspace.getConfiguration("vitals");
          const prometheusUrl =
            config.get<string>("prometheusUrl") || "http://localhost:9090";
          const defaultUrl = config.inspect("prometheusUrl")
            ?.defaultValue as string;
          const isDemoMode = prometheusUrl === defaultUrl;

          webviewView.webview.postMessage({
            command: "prometheusUrl",
            url: prometheusUrl,
            isDemoMode: isDemoMode,
          });
          break;
        }

        case "configurePrometheus":
          // Trigger the configure Prometheus command
          vscode.commands.executeCommand("vitals.configurePrometheus");
          break;

        case "fetchMetrics":
          // Track metrics feature usage
          getUsageStats(this._context).trackFeature("metrics");

          try {
            const config = vscode.workspace.getConfiguration("vitals");
            const prometheusUrl =
              config.get<string>("prometheusUrl") || "http://localhost:9090";
            const api = new PrometheusApi(prometheusUrl);

            const data = await api.query(message.query);
            webviewView.webview.postMessage({
              command: "updateMetrics",
              data,
            });
          } catch (error: any) {
            getUsageStats(this._context).trackError(
              "prometheus_metrics_fetch_failed"
            );

            console.log(`Prometheus fetch error: ${error.message}`);
            webviewView.webview.postMessage({
              command: "error",
              message: error.message,
            });
          }
          break;

        case "fetchAlerts":
          // Track alerts feature usage
          getUsageStats(this._context).trackFeature("alerts");

          try {
            const config = vscode.workspace.getConfiguration("vitals");
            const prometheusUrl =
              config.get<string>("prometheusUrl") || "http://localhost:9090";
            const api = new PrometheusApi(prometheusUrl);

            const data = await api.getAlerts();
            webviewView.webview.postMessage({
              command: "updateAlerts",
              data,
            });
          } catch (error: any) {
            getUsageStats(this._context).trackError(
              "prometheus_alerts_fetch_failed"
            );
            console.log(`Failed to fetch alerts: ${error.message}`);
            webviewView.webview.postMessage({
              command: "alertError",
              message: error.message,
            });
          }
          break;

        case "fetchLogs": {
          // Track logs feature usage
          getUsageStats(this._context).trackFeature("logs");

          // Mock log data for now as Prometheus doesn't have a standard logs endpoint
          // In a real scenario, this would connect to Loki or another log source
          const mockLogs = [
            `[INFO] Application started at ${new Date().toISOString()}`,
            `[INFO] Connected to database`,
            `[WARN] High memory usage detected`,
            `[INFO] Request processed in 45ms`,
          ];
          webviewView.webview.postMessage({
            command: "updateLogs",
            data: mockLogs,
          });
          break;
        }
      }
    });
  }
  
  public show() {
      if (this._view) {
          this._view.show?.(true);
      }
  }
}
