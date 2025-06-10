import * as vscode from 'vscode';
import { sendMessageToWebview, MessageTypes } from '../api';

// Processes metrics and triggers alerts if thresholds are exceeded
export function processAlerts(metrics: any, webview: vscode.Webview) {
  // Example: Trigger alert if error rate > 5%
  const errorRate = metrics?.data?.result?.[0]?.value?.[1] || 0;
  if (errorRate > 5) {
    vscode.window.showWarningMessage('High error rate detected!');
    sendMessageToWebview(webview, {
      command: MessageTypes.TRIGGER_ALERT,
      data: { message: 'High error rate detected', value: errorRate }
    });
  }
}