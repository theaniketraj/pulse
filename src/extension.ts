// Main entry point for the VS Code extension
import * as vscode from "vscode";
import { VitalsView } from "./vitalsView";

// Called when the extension is activated (e.g., when a command is executed)
export function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log("🚀 Vitals extension activated");

  // Show a message to confirm activation
  vscode.window.showInformationMessage("Vitals extension is now active!");

  // Register the command to open the Vitals dashboard
  const openDashboard = vscode.commands.registerCommand(
    "vitals.openDashboard",
    () => {
      console.log("📊 Opening Vitals...");
      // Create a new webview panel for the dashboard
      VitalsView.createOrShow(context);
    }
  );

  // Add the command to the extension's context subscriptions
  context.subscriptions.push(openDashboard);

  console.log('✅ Command "vitals.openDashboard" registered successfully');
}

// Called when the extension is deactivated
export function deactivate() {
  console.log("Vitals extension deactivated");
}
