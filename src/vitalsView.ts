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

    // Listen for configuration changes
    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("vitals.prometheusUrl")) {
        this.sendPrometheusConfig(webviewView.webview);
      }
    });

    webviewView.onDidDispose(() => {
      configListener.dispose();
    });

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "getPrometheusUrl": {
          this.sendPrometheusConfig(webviewView.webview);
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
              config.get<string>("prometheusUrl") || "http://localhost:9090/query";
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

        case "fetchKPIs":
          try {
            const config = vscode.workspace.getConfiguration("vitals");
            const prometheusUrl =
              config.get<string>("prometheusUrl") || "https://prometheus.demo.do.prometheus.io:9090";
            const api = new PrometheusApi(prometheusUrl);

            // Fetch KPIs in parallel
            // Note: These queries are generic and might need adjustment for specific environments
            // For demo (RobustPerception), we use prometheus_http_requests_total
            const [reqRate, errRate, latency] = await Promise.all([
              api.query('rate(prometheus_http_requests_total[5m])'),
              api.query('rate(prometheus_http_requests_total{code=~"5.."}[5m]) / rate(prometheus_http_requests_total[5m])'),
              api.query('rate(prometheus_http_request_duration_seconds_sum[5m]) / rate(prometheus_http_request_duration_seconds_count[5m])')
            ]);

            // Helper to extract scalar value
            const getValue = (result: any, decimals = 2) => {
                try {
                    const val = result?.data?.result?.[0]?.value?.[1];
                    return val ? Number.parseFloat(val).toFixed(decimals) : "0";
                } catch {
                    return "0";
                }
            };

            // Calculate aggregate values (summing up for rate)
            const getSumValue = (result: any, decimals = 2) => {
                try {
                    if (!result?.data?.result) return "0";
                    const sum = result.data.result.reduce((acc: number, curr: any) => {
                        return acc + (Number.parseFloat(curr?.value?.[1]) || 0);
                    }, 0);
                    return sum.toFixed(decimals);
                } catch {
                    return "0";
                }
            };

            webviewView.webview.postMessage({
              command: "updateKPIs",
              data: {
                requestRate: `${getSumValue(reqRate)}/s`,
                errorRate: `${(Number.parseFloat(getValue(errRate)) * 100).toFixed(2)}%`,
                avgLatency: `${(Number.parseFloat(getValue(latency)) * 1000).toFixed(0)}ms`
              },
            });
          } catch (error: any) {
            console.log(`Failed to fetch KPIs: ${error.message}`);
            // Don't show error to user for KPIs to avoid clutter, just log it
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

  private sendPrometheusConfig(webview: vscode.Webview) {
    const config = vscode.workspace.getConfiguration("vitals");
    const prometheusUrl =
      config.get<string>("prometheusUrl") || "http://localhost:9090";
    const defaultUrl = config.inspect("prometheusUrl")
      ?.defaultValue as string;
    const isDemoMode = prometheusUrl === defaultUrl;

    webview.postMessage({
      command: "prometheusUrl",
      url: prometheusUrl,
      isDemoMode: isDemoMode,
    });
  }
}
