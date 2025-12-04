# Vitals Backend Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Deploy to AWS

```bash
npm run deploy
```

This will:

- ✅ Create a DynamoDB table (`vitals-dev`)
- ✅ Deploy Lambda function
- ✅ Set up API Gateway
- ✅ Output the API URL

### 3. Test the API

After deployment, you'll see an output like:

```
endpoints:
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
```

Test the health endpoint:

```bash
curl https://YOUR_API_URL/dev/health
```

## 📊 DynamoDB Schema

### Single Table Design

| Entity | PK | SK | Attributes |
|--------|----|----|------------|
| User Profile | `USER#<githubId>` | `PROFILE` | username, email, lastLogin |
| User Event | `USER#<githubId>` | `EVENT#<timestamp>` | eventName, properties |
| Anonymous Event | `ANONYMOUS` | `EVENT#<timestamp>` | eventName, properties |

### Global Secondary Index (GSI1)

- **Purpose**: Query by event type or username
- **Keys**: GSI1PK (hash), GSI1SK (range)

## 🔌 API Endpoints

### 1. Create/Update User

```bash
POST /users
Content-Type: application/json

{
  "githubId": "12345",
  "username": "john_doe",
  "email": "john@example.com"
}
```

### 2. Get User Profile

```bash
GET /users/{githubId}
```

### 3. Log Telemetry Event

```bash
POST /events
Content-Type: application/json

{
  "githubId": "12345",
  "eventName": "dashboard_opened",
  "properties": {
    "source": "command_palette"
  }
}
```

### 4. Get User Events

```bash
GET /events/{githubId}
```

### 5. Health Check

```bash
GET /health
```

## 💰 Cost Estimation

### Free Tier Limits (per month)

- **Lambda**: 1M requests, 400,000 GB-seconds ✅
- **API Gateway**: 1M requests ✅
- **DynamoDB**: 25 GB storage, 25 WCU/RCU ✅

**Expected cost for this project: $0.00/month** (well within free tier)

## 🧪 Local Development

Run locally with serverless-offline:

```bash
npm run local
```

API will be available at `http://localhost:3001`

## 🗑️ Remove Deployment

To delete all AWS resources:

```bash
npm run remove
```

## 📝 Logs

View Lambda logs:

```bash
npm run logs
```

## 🔒 Security Notes

- CORS is enabled for all origins (adjust in production)
- No authentication yet (GitHub auth will be added next)
- API is public (will secure with API keys later)
