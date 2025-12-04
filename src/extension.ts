// Main entry point for the VS Code extension
import * as vscode from "vscode";
import { VitalsView } from "./vitalsView";
import { CustomGitHubAuth } from "./auth/customGitHubAuth";

// Called when the extension is activated (e.g., when a command is executed)
export async function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log("🚀 Vitals extension activated");

  // Show a message to confirm activation (only if signed in)
  const isInitialSignedIn = await CustomGitHubAuth.isSignedIn(context);
  if (isInitialSignedIn) {
    const user = await CustomGitHubAuth.getCurrentUser(context);
    vscode.window.showInformationMessage(`Vitals is active! Signed in as ${user?.login} ✅`);
  } else {
    vscode.window.showInformationMessage(
      'Vitals is active! Configure GitHub OAuth and sign in to access features.',
      'Configure',
      'Sign In'
    ).then(selection => {
      if (selection === 'Configure') {
        vscode.commands.executeCommand('vitals.configureCredentials');
      } else if (selection === 'Sign In') {
        vscode.commands.executeCommand('vitals.openDashboard');
      }
    });
  }

  // Register the command to open the Vitals dashboard
  const openDashboard = vscode.commands.registerCommand(
    "vitals.openDashboard",
    async () => {
      console.log("📊 Opening Vitals...");
      
      // Check if user is signed in
      const isSignedIn = await CustomGitHubAuth.isSignedIn(context);
      
      if (!isSignedIn) {
        // Prompt for GitHub sign-in
        const user = await CustomGitHubAuth.signIn(context);
        
        if (!user) {
          vscode.window.showWarningMessage(
            'GitHub authentication is required to use Vitals'
          );
          return;
        }
      }
      
      // Create a new webview panel for the dashboard
      VitalsView.createOrShow(context);
    }
  );

  // Register sign-out command
  const signOut = vscode.commands.registerCommand(
    "vitals.signOut",
    async () => {
      await CustomGitHubAuth.signOut(context);
    }
  );

  // Register status command to show current user
  const showStatus = vscode.commands.registerCommand(
    "vitals.showStatus",
    async () => {
      const user = await CustomGitHubAuth.getCurrentUser(context);
      if (user) {
        vscode.window.showInformationMessage(
          `Signed in as: ${user.name || user.login} (@${user.login})`
        );
      } else {
        vscode.window.showInformationMessage('Not signed in to Vitals');
      }
    }
  );

  // Register configure credentials command
  const configureCredentials = vscode.commands.registerCommand(
    "vitals.configureCredentials",
    async () => {
      await CustomGitHubAuth.configureCredentials(context);
    }
  );

  // Add the commands to the extension's context subscriptions
  context.subscriptions.push(openDashboard, signOut, showStatus, configureCredentials);

  console.log('✅ Commands registered successfully');
  
  // Check authentication status on activation
  const isSignedIn = await CustomGitHubAuth.isSignedIn(context);
  if (isSignedIn) {
    const user = await CustomGitHubAuth.getCurrentUser(context);
    console.log(`✅ Signed in as: ${user?.login}`);
  } else {
    console.log('ℹ️ Not signed in. Authentication required to use Vitals.');
  }
}

// Called when the extension is deactivated
export function deactivate() {
  console.log("Vitals extension deactivated");
}
