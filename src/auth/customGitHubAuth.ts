import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { SecureStorage } from './secureStorage';
import { vitalsApi } from '../api/vitalsApi';

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export class CustomGitHubAuth {
  private static readonly TOKEN_KEY = 'vitals.github.accessToken';
  private static readonly USER_KEY = 'vitals.github.user';
  private static readonly REDIRECT_URI = 'http://127.0.0.1:3000/callback';
  private static readonly SCOPES = ['user:email', 'read:user'];
  
  private static server: any;
  private static currentUser: GitHubUser | undefined;

  /**
   * Initialize OAuth flow with custom GitHub App
   */
  static async signIn(context: vscode.ExtensionContext): Promise<GitHubUser | undefined> {
    try {
      // Check if credentials are configured
      const credentials = await SecureStorage.getCredentials(context);
      if (!credentials) {
        const configure = await vscode.window.showErrorMessage(
          'GitHub OAuth credentials not configured. Configure now?',
          'Configure',
          'Cancel'
        );
        
        if (configure === 'Configure') {
          await this.configureCredentials(context);
          return this.signIn(context); // Retry after configuration
        }
        return undefined;
      }

      // Generate state for CSRF protection
      const state = crypto.randomBytes(32).toString('hex');
      await context.globalState.update('oauth.state', state);

      // Build authorization URL
      const authUrl = this.buildAuthUrl(credentials.clientId, state);

      // Start local server to handle callback
      const accessToken = await this.startOAuthFlow(authUrl, state, credentials, context);
      
      if (!accessToken) {
        return undefined;
      }

      // Store access token securely
      await context.secrets.store(this.TOKEN_KEY, accessToken);
      
      // Clear OAuth state to prevent re-authentication loop
      await context.globalState.update('oauth.state', undefined);

      // Fetch user details
      const user = await this.fetchUserDetails(accessToken);
      
      if (user) {
        this.currentUser = user;
        await context.globalState.update(this.USER_KEY, user);
        
        // Mark authentication as completed (prevents re-prompt)
        await context.globalState.update('vitals.authWall.completed', true);
        
        // Sync user to backend
        try {
          const githubId = String(user.id);
          console.log('Syncing user to backend:', githubId, user.login);
          await vitalsApi.createUser(
            githubId,
            user.login,
            user.email
          );
          console.log('✅ User synced to backend');
        } catch (error) {
          console.error('Failed to sync user to backend:', error);
        }
        
        vscode.window.showInformationMessage(`Welcome, ${user.name || user.login}! 🎉`);
      }

      return user;
    } catch (error) {
      vscode.window.showErrorMessage(`GitHub sign-in failed: ${error}`);
      console.error('Sign-in error:', error);
      return undefined;
    }
  }

  /**
   * Configure GitHub OAuth credentials
   */
  static async configureCredentials(context: vscode.ExtensionContext): Promise<boolean> {
    // Prompt for Client ID
    const clientId = await vscode.window.showInputBox({
      prompt: 'Enter your GitHub OAuth App Client ID',
      placeHolder: 'Iv1.1234567890abcdef',
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Client ID is required';
        }
        return null;
      }
    });

    if (!clientId) {
      return false;
    }

    // Prompt for Client Secret
    const clientSecret = await vscode.window.showInputBox({
      prompt: 'Enter your GitHub OAuth App Client Secret',
      placeHolder: 'Enter secret (input will be hidden)',
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Client Secret is required';
        }
        return null;
      }
    });

    if (!clientSecret) {
      return false;
    }

    // Store credentials
    await SecureStorage.storeCredentials(context, {
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim()
    });

    return true;
  }

  /**
   * Build GitHub authorization URL
   */
  private static buildAuthUrl(clientId: string, state: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      // redirect_uri: this.REDIRECT_URI, // Let GitHub use the configured callback URL
      scope: this.SCOPES.join(' '),
      state: state,
      allow_signup: 'true'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Start OAuth flow with local server
   */
  private static async startOAuthFlow(
    authUrl: string,
    expectedState: string,
    credentials: { clientId: string; clientSecret: string },
    context: vscode.ExtensionContext
  ): Promise<string | undefined> {
    return new Promise(async (resolve) => {
      const http = require('http');
      
      // Create temporary server
      this.server = http.createServer(async (req: any, res: any) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        
        if (url.pathname === '/callback') {
          const code = url.searchParams.get('code');
          const state = url.searchParams.get('state');
          const error = url.searchParams.get('error');

          if (error) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body>
                  <h1>❌ Authentication Failed</h1>
                  <p>Error: ${error}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            this.server.close();
            resolve(undefined);
            return;
          }

          // Verify state (CSRF protection)
          if (state !== expectedState) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>Invalid state parameter</h1></body></html>');
            this.server.close();
            resolve(undefined);
            return;
          }

          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>No authorization code received</h1></body></html>');
            this.server.close();
            resolve(undefined);
            return;
          }

          // Exchange code for access token
          try {
            const accessToken = await this.exchangeCodeForToken(code, credentials);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
              <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 50px;">
                  <h1 style="color: #28a745;">✅ Authentication Successful!</h1>
                  <p>You can close this window and return to VS Code.</p>
                  <script>setTimeout(() => window.close(), 3000);</script>
                </body>
              </html>
            `);
            
            this.server.close();
            resolve(accessToken);
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<html><body><h1>Token exchange failed: ${error}</h1></body></html>`);
            this.server.close();
            resolve(undefined);
          }
        }
      });

      this.server.listen(3000, '127.0.0.1', () => {
        console.log('OAuth callback server started on port 3000');
        
        // Open authorization URL in browser
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
        
        vscode.window.showInformationMessage(
          'Opening GitHub authorization page in your browser...',
          'Cancel'
        ).then(selection => {
          if (selection === 'Cancel') {
            this.server.close();
            resolve(undefined);
          }
        });
      });

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.server) {
          this.server.close();
          vscode.window.showWarningMessage('GitHub authentication timed out');
          resolve(undefined);
        }
      }, 300000);
    });
  }

  /**
   * Exchange authorization code for access token
   */
  private static async exchangeCodeForToken(
    code: string,
    credentials: { clientId: string; clientSecret: string }
  ): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: code
        // redirect_uri: this.REDIRECT_URI // Optional, must match authorize request if provided
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data: OAuthTokenResponse = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token in response');
    }

    return data.access_token;
  }

  /**
   * Fetch user details from GitHub API
   */
  private static async fetchUserDetails(accessToken: string): Promise<GitHubUser | undefined> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'VSCode-Vitals-Extension'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        login: data.login,
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url
      };
    } catch (error) {
      console.error('Failed to fetch GitHub user details:', error);
      return undefined;
    }
  }

  /**
   * Check if user is signed in
   */
  static async isSignedIn(context: vscode.ExtensionContext): Promise<boolean> {
    const token = await context.secrets.get(this.TOKEN_KEY);
    return !!token;
  }

  /**
   * Get current session token
   */
  static async getAccessToken(context: vscode.ExtensionContext): Promise<string | undefined> {
    return await context.secrets.get(this.TOKEN_KEY);
  }

  /**
   * Get current user
   */
  static async getCurrentUser(context: vscode.ExtensionContext): Promise<GitHubUser | undefined> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from storage
    const storedUser = context.globalState.get<GitHubUser>(this.USER_KEY);
    if (storedUser) {
      this.currentUser = storedUser;
      return storedUser;
    }

    // Fetch fresh data
    const token = await this.getAccessToken(context);
    if (!token) {
      return undefined;
    }

    const user = await this.fetchUserDetails(token);
    if (user) {
      this.currentUser = user;
      await context.globalState.update(this.USER_KEY, user);
    }

    return user;
  }

  /**
   * Sign out
   */
  static async signOut(context: vscode.ExtensionContext): Promise<void> {
    await context.secrets.delete(this.TOKEN_KEY);
    await context.globalState.update(this.USER_KEY, undefined);
    this.currentUser = undefined;
    
    vscode.window.showInformationMessage('Signed out from GitHub successfully');
  }
}
