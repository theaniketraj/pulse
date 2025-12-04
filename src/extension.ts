// Main entry point for the VS Code extension
import * as vscode from "vscode";
import { VitalsView } from "./vitalsView";
import { CustomGitHubAuth } from "./auth/customGitHubAuth";
import { AuthWall } from "./auth/authWall";
import { vitalsApi } from "./api/vitalsApi";
import { getUsageStats } from "./telemetry/usageStats";

// Called when the extension is activated (e.g., when a command is executed)
export async function activate(context: vscode.ExtensionContext) {
  // Log activation for debugging
  console.log("🚀 Vitals extension activated");

  // Initialize usage statistics collector
  const usageStats = getUsageStats(context);

  // Check authentication status
  const authStatus = await AuthWall.checkStatus(context);
  
  if (authStatus.isSignedIn && authStatus.authCompleted) {
    // Returning user - show brief confirmation
    console.log(`✅ Signed in as: ${authStatus.user?.login}`);
    
    // Log extension activation for signed-in users
    if (authStatus.user) {
      vitalsApi.logEvent(
        authStatus.user.id.toString(),
        'extension_activated'
      ).catch(err => console.error('Failed to log event:', err));
    }
  } else {
    // New user or not authenticated - show auth wall after a brief delay
    setTimeout(() => {
      AuthWall.showAuthWall(context);
    }, 1000);
  }

  // Register the command to open the Vitals dashboard
  const openDashboard = vscode.commands.registerCommand(
    "vitals.openDashboard",
    async () => {
      console.log("📊 Opening Vitals...");
      
      // Track command execution
      usageStats.trackCommand('vitals.openDashboard');
      
      // Enforce authentication wall
      const isAuthenticated = await AuthWall.enforce(context);
      
      if (!isAuthenticated) {
        return;
      }
      
      // Log dashboard opened event
      const user = await CustomGitHubAuth.getCurrentUser(context);
      if (user) {
        vitalsApi.logEvent(
          user.id.toString(),
          'dashboard_opened'
        ).catch(err => console.error('Failed to log event:', err));
      }
      
      // Create a new webview panel for the dashboard
      VitalsView.createOrShow(context);
    }
  );  

  // Register sign-out command
  const signOut = vscode.commands.registerCommand(
    "vitals.signOut",
    async () => {
      usageStats.trackCommand('vitals.signOut');
      
      const confirm = await vscode.window.showWarningMessage(
        'Are you sure you want to sign out? You will need to authenticate again to use Vitals.',
        { modal: true },
        'Sign Out',
        'Cancel'
      );
      
      if (confirm === 'Sign Out') {
        // Save stats before signing out
        await usageStats.saveStats();
        await AuthWall.reset(context);
        vscode.window.showInformationMessage('Successfully signed out from Vitals');
      }
    }
  );

  // Register status command to show current user
  const showStatus = vscode.commands.registerCommand(
    "vitals.showStatus",
    async () => {
      usageStats.trackCommand('vitals.showStatus');
      
      const status = await AuthWall.checkStatus(context);
      
      if (status.isSignedIn && status.user) {
        vscode.window.showInformationMessage(
          `✅ Signed in as: ${status.user.name || status.user.login} (@${status.user.login})`,
          'Open Dashboard',
          'Sign Out'
        ).then(selection => {
          if (selection === 'Open Dashboard') {
            vscode.commands.executeCommand('vitals.openDashboard');
          } else if (selection === 'Sign Out') {
            vscode.commands.executeCommand('vitals.signOut');
          }
        });
      } else {
        vscode.window.showInformationMessage(
          '❌ Not signed in to Vitals',
          'Sign In'
        ).then(selection => {
          if (selection === 'Sign In') {
            vscode.commands.executeCommand('vitals.openDashboard');
          }
        });
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

  // Register sign in command (for returning users who signed out)
  const signIn = vscode.commands.registerCommand(
    "vitals.signIn",
    async () => {
      const isAuthenticated = await AuthWall.showAuthWall(context);
      if (isAuthenticated) {
        vscode.window.showInformationMessage(
          'Successfully signed in! What would you like to do?',
          'Open Dashboard',
          'View Status'
        ).then(selection => {
          if (selection === 'Open Dashboard') {
            vscode.commands.executeCommand('vitals.openDashboard');
          } else if (selection === 'View Status') {
            vscode.commands.executeCommand('vitals.showStatus');
          }
        });
      }
    }
  );

  // Add the commands to the extension's context subscriptions
  context.subscriptions.push(openDashboard, signOut, showStatus, configureCredentials, signIn);

  console.log('✅ Commands registered successfully');
}

// Called when the extension is deactivated
export function deactivate() {
  console.log("Vitals extension deactivated");
}
