// Main entry point for the VS Code extension
import * as vscode from 'vscode';
import { PulseView } from './pulseView';

// Called when the extension is activated (e.g., when a command is executed)
export function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log('Pulse Dashboard extension activated');

  // Register the command to open the Pulse dashboard
  const openDashboard = vscode.commands.registerCommand('pulse.openDashboard', () => {
    // Create a new webview panel for the dashboard
    PulseView.createOrShow(context);
  });

  // Add the command to the extension's context subscriptions
  context.subscriptions.push(openDashboard);
}

// Called when the extension is deactivated
export function deactivate() {
  console.log('Pulse Dashboard extension deactivated');
}