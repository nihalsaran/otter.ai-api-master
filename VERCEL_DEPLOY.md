# 🚀 Deploy Otter.ai API to Vercel

This guide will help you deploy your Otter.ai API server to Vercel.

## 📋 Prerequisites

- Node.js installed locally
- Vercel account (free tier works)
- Your Otter.ai credentials

## 🛠 Setup Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Build the Project
```bash
npm run prepublish
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (accept default or choose custom)
# - Directory? ./
# - Override settings? No
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Deploy

### 4. Set Environment Variables

After deployment, set your Otter.ai credentials:

```bash
# Using Vercel CLI
vercel env add OTTER_EMAIL
# Enter: your-email@example.com

vercel env add OTTER_PASSWORD  
# Enter: your-password

# Redeploy to apply changes
vercel --prod
```

Or via Vercel Dashboard:
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - `OTTER_EMAIL`: your-email@example.com
   - `OTTER_PASSWORD`: your-password

## 🌐 Your API Endpoints

After deployment, your API will be available at:
```
https://your-project-name.vercel.app
```

### Available Endpoints:
- `GET /health` - Health check
- `GET /api/speeches` - Get all speeches
- `GET /api/speeches/:id` - Get specific speech
- `GET /api/speeches/:id/transcript` - Get transcript
- `GET /api/search?q=query` - Search speeches
- `POST /api/auth/refresh` - Re-authenticate

## 🧪 Testing Your Deployment

```bash
# Test health endpoint
curl https://your-project-name.vercel.app/health

# Test speeches endpoint
curl https://your-project-name.vercel.app/api/speeches

# Test search
curl "https://your-project-name.vercel.app/api/search?q=meeting"
```

## 📝 Example Usage

### JavaScript/Fetch
```javascript
const API_URL = 'https://your-project-name.vercel.app';

// Get all speeches
const response = await fetch(`${API_URL}/api/speeches`);
const data = await response.json();
console.log(`Found ${data.count} speeches`);

// Search speeches
const search = await fetch(`${API_URL}/api/search?q=meeting`);
const results = await search.json();
console.log(results.data);
```

### Python
```python
import requests

API_URL = 'https://your-project-name.vercel.app'

# Get all speeches
response = requests.get(f'{API_URL}/api/speeches')
data = response.json()
print(f"Found {data['count']} speeches")

# Get specific speech
speech_id = data['data'][0]['id']
speech = requests.get(f'{API_URL}/api/speeches/{speech_id}')
print(speech.json()['data']['title'])
```

### cURL
```bash
# Set your API URL
API_URL="https://your-project-name.vercel.app"

# Get all speeches
curl "$API_URL/api/speeches"

# Get specific speech (replace SPEECH_ID)
curl "$API_URL/api/speeches/SPEECH_ID"

# Search speeches
curl "$API_URL/api/search?q=meeting"

# Get transcript
curl "$API_URL/api/speeches/SPEECH_ID/transcript"
```

## ⚡ Vercel-Specific Features

### Automatic HTTPS
Your API automatically gets HTTPS encryption.

### Global CDN
Your API is served from Vercel's global edge network.

### Serverless Functions
Each request runs in an isolated serverless function.

### Custom Domains
You can add custom domains in the Vercel dashboard.

## 🔧 Configuration Files

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## 🚨 Important Notes

### Environment Variables
- **Never** commit credentials to your repository
- Always use environment variables for sensitive data
- Set `OTTER_EMAIL` and `OTTER_PASSWORD` in Vercel dashboard

### Function Limits
- Vercel free tier has 10-second execution limit
- Pro tier has 60-second limit
- Configured for 30-second timeout in `vercel.json`

### Cold Starts
- Serverless functions may have cold start delays
- Authentication is cached for 30 minutes to improve performance

## 🔍 Troubleshooting

### "Authentication failed"
- Check your environment variables in Vercel dashboard
- Verify your Otter.ai credentials are correct

### "Function timeout"
- Large speech files may take time to process
- Consider upgrading to Vercel Pro for longer timeouts

### "Module not found"
- Make sure you ran `npm run prepublish` before deploying
- Check that all dependencies are in `package.json`

## 📈 Monitoring

View logs and analytics in your Vercel dashboard:
1. Go to your project
2. Click on "Functions" tab
3. View real-time logs and performance metrics

## 🔄 Updates

To update your deployment:
```bash
# Make your changes, then:
vercel --prod
```

Or push to your connected GitHub repository for automatic deployment.
