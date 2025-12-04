// Main entry point for the VS Code extension
import * as vscode from "vscode";
import { VitalsView } from "./vitalsView";
import { GitHubAuthProvider } from "./auth/githubAuth";

// Called when the extension is activated (e.g., when a command is executed)
export async function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log("🚀 Vitals extension activated");

  // Show a message to confirm activation (only if signed in)
  const isInitialSignedIn = await GitHubAuthProvider.isSignedIn();
  if (isInitialSignedIn) {
    const user = await GitHubAuthProvider.getCurrentUser();
    vscode.window.showInformationMessage(`Vitals is active! Signed in as ${user?.login} ✅`);
  } else {
    vscode.window.showInformationMessage(
      'Vitals is active! Sign in with GitHub to access features.',
      'Sign In'
    ).then(selection => {
      if (selection === 'Sign In') {
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
      const isSignedIn = await GitHubAuthProvider.isSignedIn();
      
      if (!isSignedIn) {
        // Prompt for GitHub sign-in
        const user = await GitHubAuthProvider.signIn();
        
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
      await GitHubAuthProvider.signOut();
    }
  );

  // Register status command to show current user
  const showStatus = vscode.commands.registerCommand(
    "vitals.showStatus",
    async () => {
      const user = await GitHubAuthProvider.getCurrentUser();
      if (user) {
        vscode.window.showInformationMessage(
          `Signed in as: ${user.name || user.login} (@${user.login})`
        );
      } else {
        vscode.window.showInformationMessage('Not signed in to Vitals');
      }
    }
  );

  // Add the commands to the extension's context subscriptions
  context.subscriptions.push(openDashboard, signOut, showStatus);

  console.log('✅ Commands registered successfully');
  
  // Check authentication status on activation
  const isSignedIn = await GitHubAuthProvider.isSignedIn();
  if (isSignedIn) {
    const user = await GitHubAuthProvider.getCurrentUser();
    console.log(`✅ Signed in as: ${user?.login}`);
  } else {
    console.log('ℹ️ Not signed in. Authentication required to use Vitals.');
  }
}

// Called when the extension is deactivated
export function deactivate() {
  console.log("Vitals extension deactivated");
}
