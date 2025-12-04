const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

// Helper: Create response
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});

// Main handler
exports.main = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, path, body } = event;
  const parsedBody = body ? JSON.parse(body) : {};

  try {
    // Route: POST /users - Create or update user
    if (httpMethod === 'POST' && path === '/users') {
      return await createUser(parsedBody);
    }

    // Route: GET /users/{githubId} - Get user profile
    if (httpMethod === 'GET' && path.startsWith('/users/')) {
      const githubId = path.split('/')[2];
      return await getUser(githubId);
    }

    // Route: POST /events - Log telemetry event
    if (httpMethod === 'POST' && path === '/events') {
      return await logEvent(parsedBody);
    }

    // Route: GET /events/{githubId} - Get user events
    if (httpMethod === 'GET' && path.startsWith('/events/')) {
      const githubId = path.split('/')[2];
      return await getUserEvents(githubId);
    }

    // Route: GET /health - Health check
    if (httpMethod === 'GET' && path === '/health') {
      return response(200, { status: 'healthy', timestamp: new Date().toISOString() });
    }

    // 404 - Not Found
    return response(404, { error: 'Route not found' });

  } catch (error) {
    console.error('Error:', error);
    return response(500, { error: error.message });
  }
};

// Create or update user
async function createUser(data) {
  const { githubId, username, email } = data;

  if (!githubId || !username) {
    return response(400, { error: 'githubId and username are required' });
  }

  const item = {
    PK: `USER#${githubId}`,
    SK: 'PROFILE',
    githubId,
    username,
    email: email || null,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    GSI1PK: 'USER',
    GSI1SK: `USERNAME#${username}`,
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return response(200, { message: 'User created/updated', user: item });
}

// Get user profile
async function getUser(githubId) {
  const result = await dynamo.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${githubId}`,
      SK: 'PROFILE',
    },
  }));

  if (!result.Item) {
    return response(404, { error: 'User not found' });
  }

  return response(200, result.Item);
}

// Log telemetry event
async function logEvent(data) {
  const { githubId, eventName, properties } = data;

  if (!eventName) {
    return response(400, { error: 'eventName is required' });
  }

  const timestamp = new Date().toISOString();
  const item = {
    PK: githubId ? `USER#${githubId}` : 'ANONYMOUS',
    SK: `EVENT#${timestamp}`,
    eventName,
    properties: properties || {},
    timestamp,
    GSI1PK: `EVENT#${eventName}`,
    GSI1SK: timestamp,
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return response(200, { message: 'Event logged', event: item });
}

// Get user events
async function getUserEvents(githubId) {
  const result = await dynamo.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${githubId}`,
      ':sk': 'EVENT#',
    },
    ScanIndexForward: false, // Most recent first
    Limit: 100,
  }));

  return response(200, {
    events: result.Items || [],
    count: result.Count,
  });
}
