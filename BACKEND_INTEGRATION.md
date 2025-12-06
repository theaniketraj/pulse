# Backend Integration Summary

## ✅ What's Integrated

### API Client (`src/api/vitalsApi.ts`)

- TypeScript client for Vitals backend API
- Automatic error handling and retries
- Telemetry events fail silently (non-blocking)

### Authentication Flow

1. User signs in with GitHub OAuth
2. Extension calls `vitalsApi.createUser()` to sync user to DynamoDB
3. User profile stored in backend with GitHub ID, username, email

### Telemetry Events

The extension now automatically logs:

| Event | Trigger | Data |
|-------|---------|------|
| `user_signed_in` | When user completes OAuth | username |
| `extension_activated` | When extension loads (signed-in users only) | - |
| `dashboard_opened` | When user opens Vitals dashboard | - |

### Backend API

**Base URL**: `https://g0l5lmjg3f.execute-api.us-east-1.amazonaws.com/dev`

**Endpoints**:

- `POST /users` - Create/update user profile
- `GET /users/{githubId}` - Get user profile  
- `POST /events` - Log telemetry event
- `GET /events/{githubId}` - Get user event history
- `GET /health` - Health check

## 🧪 Testing

### Test the integration

1. **Clear extension state** (to simulate new user):

   ```bash
   # Delete VS Code extension storage
   rm -rf ~/.vscode/extensions/theaniketraj.vitals-*
   ```

2. **Launch Extension Development Host** (F5 in VS Code)

3. **Sign in with GitHub** when prompted

4. **Check backend** to verify user was created:

   ```bash
   curl https://g0l5lmjg3f.execute-api.us-east-1.amazonaws.com/dev/users/YOUR_GITHUB_ID
   ```

5. **Open Vitals Dashboard** and verify event logged:

   ```bash
   curl https://g0l5lmjg3f.execute-api.us-east-1.amazonaws.com/dev/events/YOUR_GITHUB_ID
   ```

## 📊 Data Flow

```bash
User Signs In
    ↓
GitHub OAuth ✅
    ↓
Extension calls vitalsApi.createUser()
    ↓
DynamoDB stores user profile
    ↓
User opens dashboard
    ↓
Extension calls vitalsApi.logEvent('dashboard_opened')
    ↓
DynamoDB stores telemetry event
```

## 🔄 Future Enhancements

Potential additions:

- Track alert firing events
- Monitor Prometheus query performance
- User preferences storage
- Usage analytics dashboard
- Error reporting

## 💰 Cost Monitoring

Current usage is **well within free tier**:

- DynamoDB: < 1GB storage (25GB free)
- Lambda: < 1K requests/day (1M free/month)
- API Gateway: < 1K requests/day (1M free/month)

**Estimated cost: $0.00/month** ✅
