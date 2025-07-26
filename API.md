# Otter.ai REST API Server

A REST API server that wraps the Otter.ai API functionality, allowing you to interact with Otter.ai programmatically via HTTP requests.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run prepublish
```

### 3. Start the Server
```bash
npm start
```

The server will start on port 3000 (or the port specified in `PORT` environment variable).

## 📋 API Endpoints

### Health Check
```http
GET /health
```
Returns server status and authentication state.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-26T10:30:00.000Z",
  "authenticated": true
}
```

### Get All Speeches
```http
GET /api/speeches
```
Returns a list of all speeches in your Otter.ai account.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "77NXWSPLSSXQ56JU",
      "title": "Team Meeting",
      "duration": 1847,
      "created_at": 1174447006,
      "summary": "meeting, discussion, project",
      "owner": {...},
      "process_finished": true
    }
  ]
}
```

### Get Specific Speech
```http
GET /api/speeches/:speechId
```
Returns detailed information about a specific speech.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "77NXWSPLSSXQ56JU",
    "title": "Team Meeting",
    "duration": 1847,
    "created_at": 1174447006,
    "summary": "meeting, discussion, project",
    "transcript": [...],
    "speakers": [...],
    "owner": {...}
  }
}
```

### Get Transcript
```http
GET /api/speeches/:speechId/transcript
```
Returns the transcript for a specific speech.

**Response:**
```json
{
  "success": true,
  "speech_id": "77NXWSPLSSXQ56JU",
  "title": "Team Meeting",
  "transcript": {
    "text": "Hello everyone, welcome to today's meeting...",
    "detailed": [
      {
        "transcript": "Hello everyone",
        "start_time": 0.5,
        "end_time": 2.1,
        "speaker": "Speaker 1"
      }
    ]
  }
}
```

### Search Speeches
```http
GET /api/search?q=meeting
```
Search through your speeches using a query string.

**Response:**
```json
{
  "success": true,
  "query": "meeting",
  "count": 3,
  "data": [...]
}
```

### Re-authenticate
```http
POST /api/auth/refresh
```
Forces re-authentication with Otter.ai (useful if sessions expire).

**Response:**
```json
{
  "success": true,
  "message": "Successfully re-authenticated with Otter.ai"
}
```

## 🔧 Configuration

### Environment Variables
```bash
PORT=3000                    # Server port (default: 3000)
OTTER_EMAIL=your@email.com   # Your Otter.ai email
OTTER_PASSWORD=yourpassword  # Your Otter.ai password
```

### Config File
Create `config.js`:
```javascript
module.exports = {
  email: 'your@email.com',
  password: 'yourpassword'
};
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Build project
npm run prepublish

# Deploy
vercel

# Set environment variables
vercel env add OTTER_EMAIL
vercel env add OTTER_PASSWORD
vercel --prod
```

### Deploy to Heroku
```bash
# Install Heroku CLI, then:
heroku create your-otter-api
heroku config:set OTTER_EMAIL=your@email.com
heroku config:set OTTER_PASSWORD=yourpassword
git push heroku main
```

### Deploy to Railway
```bash
# Install Railway CLI, then:
railway login
railway init
railway add
railway up
```

## 📝 Example Usage

### Using curl
```bash
# Get all speeches
curl http://localhost:3000/api/speeches

# Get specific speech
curl http://localhost:3000/api/speeches/77NXWSPLSSXQ56JU

# Search speeches
curl "http://localhost:3000/api/search?q=meeting"

# Get transcript
curl http://localhost:3000/api/speeches/77NXWSPLSSXQ56JU/transcript
```

### Using JavaScript/Fetch
```javascript
// Get all speeches
const response = await fetch('http://localhost:3000/api/speeches');
const data = await response.json();
console.log(`Found ${data.count} speeches`);

// Get specific speech
const speech = await fetch('http://localhost:3000/api/speeches/SPEECH_ID');
const speechData = await speech.json();
console.log(speechData.data.title);
```

### Using Python
```python
import requests

# Get all speeches
response = requests.get('http://localhost:3000/api/speeches')
data = response.json()
print(f"Found {data['count']} speeches")

# Search speeches
search = requests.get('http://localhost:3000/api/search?q=meeting')
results = search.json()
print(f"Search found {results['count']} results")
```

## 🛠 Development

### Start in Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run demo` - Test the OtterApi locally
- `npm run prepublish` - Build the project
- `npm test` - Run tests

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (missing parameters)
- `401` - Authentication failed
- `404` - Resource not found
- `500` - Internal server error

## 🔒 Security Notes

- Store credentials as environment variables in production
- Consider implementing API key authentication
- Use HTTPS in production
- Rate limiting recommended for public APIs
- Keep your Otter.ai credentials secure
