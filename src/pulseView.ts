import * as vscode from 'vscode';
import * as path from 'path';
import { getWebviewContent } from './utils/webviewUtils';
import { PrometheusApi } from './api';

// Class to manage the Webview panel for the Pulse dashboard
export class PulseView {
  public static currentPanel: PulseView | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  // Constructor to initialize the Webview panel
  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    // Set the Webview content (HTML with React bundle)
    this._panel.webview.html = getWebviewContent(this._panel.webview, vscode.Uri.file(extensionPath));

    // Handle messages from the Webview (e.g., fetch metrics)
    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'fetchMetrics':
            try {
              const config = vscode.workspace.getConfiguration('pulse');
              const prometheusUrl = config.get<string>('prometheusUrl') || 'http://localhost:9090';
              const api = new PrometheusApi(prometheusUrl);

              const data = await api.query(message.query);
              this._panel.webview.postMessage({ command: 'updateMetrics', data });
            } catch (error: any) {
              vscode.window.showErrorMessage(`Pulse: Failed to fetch metrics. ${error.message}`);
              console.error(error);
            }
            break;
        }
      },
      undefined,
      this._disposables
    );

    // Dispose the panel when closed
    this._panel.onDidDispose(() => this.dispose(), undefined, this._disposables);
  }

  // Create or show the Webview panel
  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;

    // Reuse existing panel if it exists
    if (PulseView.currentPanel) {
      PulseView.currentPanel._panel.reveal(column);
      return;
    }

    // Create a new Webview panel
    const panel = vscode.window.createWebviewPanel(
      'pulseDashboard',
      'pulse Dashboard',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'webview', 'build'))]
      }
    );

    // Initialize the panel
    PulseView.currentPanel = new PulseView(panel, context.extensionPath);
  }

  // Dispose the panel and clean up resources
  public dispose() {
    PulseView.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}