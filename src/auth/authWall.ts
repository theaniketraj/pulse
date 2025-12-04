import * as vscode from 'vscode';
import { CustomGitHubAuth } from './customGitHubAuth';

export class AuthWall {
  private static readonly AUTH_WALL_KEY = 'vitals.authWall.completed';

  /**
   * Check if user has completed authentication
   */
  static async isAuthenticated(context: vscode.ExtensionContext): Promise<boolean> {
    const isSignedIn = await CustomGitHubAuth.isSignedIn(context);
    const authCompleted = context.globalState.get<boolean>(this.AUTH_WALL_KEY, false);
    
    return isSignedIn && authCompleted;
  }

  /**
   * Show authentication wall for new users
   * Returns true if authentication successful, false otherwise
   */
  static async showAuthWall(context: vscode.ExtensionContext): Promise<boolean> {
    // Check if already authenticated
    if (await this.isAuthenticated(context)) {
      return true;
    }

    // Show welcome message with authentication requirement
    const selection = await vscode.window.showInformationMessage(
      'Welcome to Vitals! To get started, please sign in with your GitHub account.',
      { modal: true },
      'Sign In with GitHub',
      'Learn More'
    );

    if (selection === 'Learn More') {
      vscode.env.openExternal(vscode.Uri.parse('https://github.com/theaniketraj/vitals#readme'));
      // Show the prompt again after they come back
      return this.showAuthWall(context);
    }

    if (selection !== 'Sign In with GitHub') {
      vscode.window.showWarningMessage(
        'Vitals requires GitHub authentication to continue. You can sign in anytime using the command: "Vitals: Sign In with GitHub"'
      );
      return false;
    }

    // Start authentication flow
    const user = await CustomGitHubAuth.signIn(context);

    if (!user) {
      const retry = await vscode.window.showErrorMessage(
        'GitHub authentication failed. Would you like to try again?',
        'Retry',
        'Configure OAuth First',
        'Cancel'
      );

      if (retry === 'Retry') {
        return this.showAuthWall(context);
      } else if (retry === 'Configure OAuth First') {
        await vscode.commands.executeCommand('vitals.configureCredentials');
        return this.showAuthWall(context);
      }

      return false;
    }

    // Mark authentication as completed
    await context.globalState.update(this.AUTH_WALL_KEY, true);

    // Show success message
    await vscode.window.showInformationMessage(
      `Successfully signed in as ${user.name || user.login}! You can now use Vitals.`,
      'Open Dashboard'
    ).then(selection => {
      if (selection === 'Open Dashboard') {
        vscode.commands.executeCommand('vitals.openDashboard');
      }
    });

    return true;
  }

  /**
   * Enforce authentication wall - blocks until user authenticates
   */
  static async enforce(context: vscode.ExtensionContext): Promise<boolean> {
    // Check if already authenticated
    if (await this.isAuthenticated(context)) {
      return true;
    }

    // Show auth wall
    return this.showAuthWall(context);
  }

  /**
   * Reset authentication wall (for testing or sign out)
   */
  static async reset(context: vscode.ExtensionContext): Promise<void> {
    await context.globalState.update(this.AUTH_WALL_KEY, false);
    await CustomGitHubAuth.signOut(context);
  }

  /**
   * Check authentication status silently (no prompts)
   */
  static async checkStatus(context: vscode.ExtensionContext): Promise<{
    isSignedIn: boolean;
    authCompleted: boolean;
    user?: any;
  }> {
    const isSignedIn = await CustomGitHubAuth.isSignedIn(context);
    const authCompleted = context.globalState.get<boolean>(this.AUTH_WALL_KEY, false);
    let user = undefined;

    if (isSignedIn) {
      user = await CustomGitHubAuth.getCurrentUser(context);
    }

    return {
      isSignedIn,
      authCompleted,
      user
    };
  }
}
