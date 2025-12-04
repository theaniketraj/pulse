# GitHub Authentication Setup for Vitals

This document explains how to configure GitHub authentication for the Vitals extension.

## Implementation Overview

The extension now requires GitHub authentication as the entry point. Users must sign in with their GitHub account before accessing any Vitals features.

### Features Implemented

1. **GitHub OAuth Sign-In**: Uses VS Code's built-in `vscode.authentication` API
2. **Session Management**: Persistent authentication across VS Code sessions
3. **User Profile**: Fetches and displays GitHub user information
4. **Commands**:
   - `Vitals: Open Vitals Dashboard` - Opens dashboard (prompts for auth if needed)
   - `Vitals: Sign Out from GitHub` - Sign out instruction
   - `Vitals: Show Authentication Status` - Display current user

## Configuration Steps

### Option 1: Use VS Code's Built-in GitHub Authentication (Recommended)

**No additional configuration needed!** The extension uses VS Code's native GitHub authentication provider, which works out of the box.

#### How it works

1. When a user first runs `Vitals: Open Vitals Dashboard`, they'll be prompted to sign in with GitHub
2. VS Code handles the OAuth flow using Microsoft's default GitHub App
3. The extension requests only `user:email` scope (minimal permissions)
4. Authentication persists across VS Code sessions

#### Testing

```bash
# Build the extension
npm run build

# Press F5 in VS Code to launch Extension Development Host
# Run command: "Vitals: Open Vitals Dashboard"
# Follow GitHub sign-in prompt
```

---

### Option 2: Create Your Own GitHub App (Advanced)

If you want to use a custom GitHub App with your own branding:

#### Step 1: Create GitHub OAuth App

1. Go to <https://github.com/settings/developers>
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `Vitals - VS Code Extension`
   - **Homepage URL**: `https://github.com/theaniketraj/vitals`
   - **Authorization callback URL**: `vscode://vscode.github-authentication/did-authenticate`
   - **Description**: `Vitals monitoring extension for VS Code`

4. Click **"Register application"**
5. Note down:
   - **Client ID**: `your_client_id_here`
   - **Client Secret**: Generate and save securely

#### Step 2: Configure Custom GitHub App (Optional)

If using a custom app, you would need to:

1. Create a custom authentication provider in the extension
2. Update `src/auth/githubAuth.ts` to use custom OAuth flow
3. Store client credentials securely (use VS Code's secret storage)

**Note**: This is more complex and requires maintaining OAuth infrastructure. The built-in provider (Option 1) is recommended.

---

## User Experience Flow

### First-Time Users

1. Install Vitals extension
2. See activation message: *"Vitals is active! Sign in with GitHub to access features."*
3. Click **"Sign In"** or run `Vitals: Open Vitals Dashboard`
4. VS Code prompts: *"The extension 'Vitals' wants to sign in using GitHub"*
5. Click **"Allow"**
6. Browser opens for GitHub authorization
7. Authorize the application
8. Return to VS Code - dashboard opens automatically
9. See welcome message: *"Welcome, [Name]! 🎉"*

### Returning Users

1. Open VS Code
2. Extension activates with message: *"Vitals is active! Signed in as [username] ✅"*
3. Run `Vitals: Open Vitals Dashboard` - opens immediately (no auth prompt)

### Sign Out

1. Run `Vitals: Sign Out from GitHub`
2. Follow instruction to sign out via VS Code Accounts menu (bottom-left corner)
3. Click account icon → Select GitHub account → Click "Sign Out"

---

## Security Considerations

### Permissions Requested

- **user:email** - Read user email addresses (minimal scope)

### Data Storage

- **Access tokens**: Stored securely by VS Code in system keychain
- **Session data**: Managed by VS Code's authentication API
- **No credentials stored** by the extension itself

### Best Practices

✅ Uses VS Code's secure authentication API
✅ Minimal permission scope
✅ Tokens never exposed in code
✅ No custom OAuth implementation (reduces security risk)
✅ Leverages VS Code's built-in token refresh

---

## Troubleshooting

### "GitHub authentication failed"

**Solution**:

1. Check internet connection
2. Ensure GitHub.com is accessible
3. Try signing out from VS Code Accounts menu and sign in again
4. Check VS Code output panel for errors

### "Not signed in to Vitals"

**Solution**:
Run `Vitals: Show Authentication Status` to verify auth state
If not signed in, run `Vitals: Open Vitals Dashboard` to trigger sign-in flow

### Session expired

**Solution**:
VS Code automatically refreshes tokens. If issues persist:

1. Sign out from VS Code Accounts menu
2. Restart VS Code
3. Sign in again when prompted

---

## Development Notes

### File Structure

```
src/
  auth/
    githubAuth.ts          # GitHub authentication provider
  extension.ts             # Main extension with auth checks
```

### Key Code Components

**GitHubAuthProvider** (`src/auth/githubAuth.ts`):

- `signIn()` - Initiate GitHub OAuth flow
- `isSignedIn()` - Check authentication status
- `getSession()` - Retrieve current session
- `getCurrentUser()` - Fetch GitHub user profile
- `signOut()` - Sign out instruction

**Extension Activation** (`src/extension.ts`):

- Checks auth status on activation
- Shows appropriate welcome message
- Registers auth-protected commands

### Testing Checklist

- [ ] Fresh install prompts for GitHub sign-in
- [ ] Sign-in flow completes successfully
- [ ] User info fetched and displayed
- [ ] Dashboard opens after successful auth
- [ ] Session persists across VS Code restarts
- [ ] Commands work for authenticated users
- [ ] Non-authenticated users see auth prompt
- [ ] Sign-out instruction works
- [ ] Status command shows correct user info

---

## Next Steps

### Before Publishing

1. ✅ Test authentication flow thoroughly
2. ✅ Update README.md with authentication requirements
3. ✅ Add authentication section to GETTING_STARTED.md
4. ⏳ Test with multiple GitHub accounts
5. ⏳ Test authentication in VS Code Web (vscode.dev)
6. ⏳ Add telemetry for auth success/failure rates (optional)
7. ⏳ Consider adding "Remember me" preference

### Optional Enhancements

- Add user avatar to dashboard header
- Show user stats (repos, followers, etc.)
- Add team/organization support
- Implement role-based access for premium features
- Add analytics for authenticated users

---

## FAQ

**Q: Why GitHub authentication?**
A: Provides secure identity verification, enables user-specific features, and prepares for premium tier with user accounts.

**Q: Can users use Vitals without signing in?**
A: No, authentication is required. This is intentional for security and feature access.

**Q: What happens if GitHub is down?**
A: Users with existing sessions can continue using the extension. New sign-ins will fail until GitHub is accessible.

**Q: Is this GDPR compliant?**
A: The extension only requests minimal user data (email) and doesn't store it persistently. Full GDPR compliance requires proper privacy policy and data handling documentation.

**Q: Can I use this with GitHub Enterprise?**
A: Currently configured for github.com. GitHub Enterprise support would require custom authentication provider configuration.

---

## Resources

- [VS Code Authentication API](https://code.visualstudio.com/api/references/vscode-api#authentication)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
