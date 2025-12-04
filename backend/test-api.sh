# Test the deployed API

API_URL="https://g0l5lmjg3f.execute-api.us-east-1.amazonaws.com/dev"

echo "Testing API..."

# 1. Create a user
echo "\n1. Creating user..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "githubId": "12345",
    "username": "testuser",
    "email": "test@example.com"
  }'

# 2. Get the user
echo "\n\n2. Getting user..."
curl -X GET "$API_URL/users/12345"

# 3. Log a telemetry event
echo "\n\n3. Logging telemetry event..."
curl -X POST "$API_URL/events" \
  -H "Content-Type: application/json" \
  -d '{
    "githubId": "12345",
    "eventName": "dashboard_opened",
    "properties": {
      "version": "0.1.0",
      "timestamp": "2025-12-05T00:00:00Z"
    }
  }'

# 4. Get user telemetry
echo "\n\n4. Getting user telemetry..."
curl -X GET "$API_URL/events/12345"

echo "\n\nDone!"
