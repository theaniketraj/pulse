// Main entry point for the VS Code extension
import * as vscode from 'vscode';
import { PulseView } from './pulseView';

// Called when the extension is activated (e.g., when a command is executed)
export function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log('🚀 Pulse Dashboard extension activated');
  
  // Show a message to confirm activation
  vscode.window.showInformationMessage('Pulse Dashboard extension is now active!');

  // Register the command to open the Pulse dashboard
  const openDashboard = vscode.commands.registerCommand('pulse.openDashboard', () => {
    console.log('📊 Opening Pulse Dashboard...');
    // Create a new webview panel for the dashboard
    PulseView.createOrShow(context);
  });

  // Add the command to the extension's context subscriptions
  context.subscriptions.push(openDashboard);
  
  console.log('✅ Command "pulse.openDashboard" registered successfully');
}

// Called when the extension is deactivated
export function deactivate() {
  console.log('Pulse Dashboard extension deactivated');
}