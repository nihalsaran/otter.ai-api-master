# 🎯 Updated Otter.ai API - Credentials as Payload

Your API now accepts Otter.ai credentials in the request payload, making it flexible for multiple users!

## 🔄 What Changed

- ✅ **Credentials in payload** - Send email/password in request body
- ✅ **Multiple user support** - Different users can use the same API
- ✅ **Caching per user** - Each user's authentication is cached separately
- ✅ **Flexible authentication** - Supports body, headers, or environment variables
- ✅ **All POST endpoints** - Changed from GET to POST to support request bodies

## 📋 API Endpoints (Updated)

### Authentication Methods
Your API now supports **3 ways** to provide credentials:

#### 1. Request Body (Recommended)
```json
{
  "email": "your@email.com",
  "password": "yourpassword",
  "query": "optional-search-term"
}
```

#### 2. Headers
```http
x-otter-email: your@email.com
x-otter-password: yourpassword
```

#### 3. Environment Variables (Fallback)
```bash
OTTER_EMAIL=your@email.com
OTTER_PASSWORD=yourpassword
```

## 🌐 API Endpoints

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-26T01:30:00.000Z",
  "cacheSize": 2
}
```

### Get All Speeches
```http
POST /api/speeches
```
**Request Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "user": "your@email.com",
  "data": [...]
}
```

### Get Specific Speech
```http
POST /api/speeches/:speechId
```
**Request Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

### Search Speeches
```http
POST /api/search
```
**Request Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword",
  "query": "meeting"
}
```

**Alternative with query parameter:**
```http
POST /api/search?q=meeting
```
**Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

### Get Transcript
```http
POST /api/speeches/:speechId/transcript
```
**Request Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

### Clear Cache
```http
POST /api/auth/clear-cache
```
**Request Body:**
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

## 🧪 Testing Your API

### JavaScript/Fetch Example
```javascript
const API_URL = 'https://your-project.vercel.app';
const credentials = {
  email: 'your@email.com',
  password: 'yourpassword'
};

// Get all speeches
const response = await fetch(`${API_URL}/api/speeches`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(credentials)
});

const data = await response.json();
console.log(`Found ${data.count} speeches for ${data.user}`);

// Search speeches
const searchResponse = await fetch(`${API_URL}/api/search`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ...credentials,
    query: 'meeting'
  })
});

const searchData = await searchResponse.json();
console.log(`Found ${searchData.count} results`);
```

### Python Example
```python
import requests

API_URL = 'https://your-project.vercel.app'
credentials = {
    'email': 'your@email.com',
    'password': 'yourpassword'
}

# Get all speeches
response = requests.post(f'{API_URL}/api/speeches', json=credentials)
data = response.json()
print(f"Found {data['count']} speeches for {data['user']}")

# Search speeches
search_payload = {**credentials, 'query': 'meeting'}
search_response = requests.post(f'{API_URL}/api/search', json=search_payload)
search_data = search_response.json()
print(f"Search found {search_data['count']} results")

# Get specific speech
speech_id = data['data'][0]['id']
speech_response = requests.post(f'{API_URL}/api/speeches/{speech_id}', json=credentials)
speech_data = speech_response.json()
print(f"Speech: {speech_data['data']['title']}")
```

### cURL Examples
```bash
# Set your API URL and credentials
API_URL="https://your-project.vercel.app"
EMAIL="your@email.com"
PASSWORD="yourpassword"

# Get all speeches
curl -X POST "$API_URL/api/speeches" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

# Search speeches
curl -X POST "$API_URL/api/search" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"query\":\"meeting\"}"

# Get specific speech (replace SPEECH_ID)
curl -X POST "$API_URL/api/speeches/SPEECH_ID" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

# Using headers instead of body
curl -X POST "$API_URL/api/speeches" \
  -H "x-otter-email: $EMAIL" \
  -H "x-otter-password: $PASSWORD" \
  -H "Content-Type: application/json" \
  -d "{}"
```

## 🧪 Local Testing

Test your API locally:
```bash
# Start the server
npm start

# Run the test script
npm run test-api
```

## 🔧 Features

### Multi-User Support
- Each user's authentication is cached separately
- Users don't interfere with each other
- Secure credential isolation

### Authentication Caching
- Credentials cached for 30 minutes per user
- Improves performance by avoiding repeated logins
- Automatic cache expiration and cleanup

### Flexible Authentication
1. **Request Body** (most common)
2. **Headers** (for apps that can't modify body)
3. **Environment Variables** (backward compatibility)

### Error Handling
- `400` - Missing credentials
- `401` - Invalid credentials
- `404` - Resource not found
- `500` - Server error

## 🚀 Deploy to Vercel

Your API is ready to deploy! The credentials will be sent with each request:

```bash
# Build and deploy
npm run build
vercel --prod
```

**No environment variables needed** - credentials come from requests!

## 🔒 Security Considerations

- Credentials are sent with each request (ensure HTTPS)
- Consider implementing API key authentication for production
- Cache timeout prevents long-lived sessions
- Each user's cache is isolated

Your API now supports multiple users and flexible credential handling! 🎉
