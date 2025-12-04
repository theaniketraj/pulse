# Privacy Policy - Vitals Extension

## Data Collection

Vitals collects anonymous usage statistics to improve the extension and understand how users interact with features. We are committed to protecting your privacy.

## What We Collect

### Anonymous Usage Statistics

- **Session Information**: Session ID (random), session duration, start time
- **Extension Usage**: Commands executed (counts only), dashboard open/close times
- **Feature Usage**: Number of times you view metrics, logs, or alerts
- **System Information**: OS platform, VS Code version, extension version
- **Error Tracking**: Types and counts of errors encountered

### User Information

- **GitHub Profile**: GitHub ID, username, email (from OAuth)
- **Authentication**: Stored securely in VS Code's Secret Storage

## What We DO NOT Collect

- ❌ Your code or file contents
- ❌ Project names or file paths
- ❌ Prometheus query results or metric values
- ❌ Log contents or sensitive data
- ❌ Personal browsing history
- ❌ Keystroke data

## Data Anonymization

All command execution data is anonymized before transmission:

- Individual commands are aggregated into counts per command type
- No timestamps or sequences that could identify user behavior patterns
- Session IDs are randomly generated and cannot be traced to individuals

## Data Storage

- Usage statistics are stored in AWS DynamoDB (US-East-1 region)
- Data is associated with your GitHub ID for aggregation purposes
- We retain usage data for up to 90 days for analytics

## Data Usage

We use collected data to:

- Understand which features are most valuable
- Identify and fix bugs and performance issues
- Improve user experience and feature development
- Generate aggregate statistics about extension usage

## Opting Out

You can disable usage statistics collection at any time:

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "Vitals: Enable Telemetry"
3. Uncheck the option

When disabled, no usage statistics will be collected or sent to our servers.

## Data Access and Deletion

You have the right to:

- **Access**: View your usage statistics by contacting us
- **Delete**: Request deletion of your data at any time
- **Export**: Request a copy of your collected data

To exercise these rights, open an issue at: <https://github.com/theaniketraj/vitals/issues>

## Security

- All data transmission uses HTTPS encryption
- GitHub OAuth tokens are stored in VS Code Secret Storage (encrypted)
- Access tokens are never logged or transmitted except for GitHub API calls
- Backend API is secured with AWS IAM and API Gateway

## Changes to Privacy Policy

We may update this privacy policy from time to time. Changes will be noted in the extension's changelog and require an extension update.

## Contact

For privacy concerns or questions:

- GitHub Issues: <https://github.com/theaniketraj/vitals/issues>
- Email: [Your contact email]

Last updated: December 5, 2025
