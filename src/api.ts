import * as vscode from 'vscode';
import * as path from 'path';
import { getWebviewContent } from './utils/webviewUtils';

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
      message => {
        switch (message.command) {
          case 'fetchMetrics':
            // TODO: Call data fetching logic
            this._panel.webview.postMessage({ command: 'updateMetrics', data: {} });
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

// Defines the message types for communication between extension and Webview
export interface WebviewMessage {
  command: string;
  data?: any;
}

// Example message types
export const MessageTypes = {
  FETCH_METRICS: 'fetchMetrics',
  UPDATE_METRICS: 'updateMetrics',
  TRIGGER_ALERT: 'triggerAlert'
};

// Function to send a message to the Webview
export function sendMessageToWebview(webview: vscode.Webview, message: WebviewMessage) {
  webview.postMessage(message);
}