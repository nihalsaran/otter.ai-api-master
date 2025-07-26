const express = require('express');
const cors = require('cors');
const OtterApi = require('./dist/index.js').default;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load config
let config;
try {
  config = require('./config.js');
} catch (error) {
  config = {
    email: process.env.OTTER_EMAIL,
    password: process.env.OTTER_PASSWORD
  };
}

// Cache for OtterApi instances (keyed by user email)
const otterApiCache = new Map();
const AUTH_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Helper function to create authentication key
function getAuthKey(email, password) {
  return `${email}:${password}`;
}

// Helper function to get or create OtterApi instance
async function getOtterApiInstance(email, password) {
  const authKey = getAuthKey(email, password);
  const now = Date.now();
  
  // Check if we have a cached instance
  if (otterApiCache.has(authKey)) {
    const cached = otterApiCache.get(authKey);
    // If cache is still valid, return it
    if ((now - cached.lastAuthTime) < AUTH_TIMEOUT) {
      return cached.instance;
    }
    // Cache expired, remove it
    otterApiCache.delete(authKey);
  }
  
  // Create new instance and authenticate
  try {
    const otterApi = new OtterApi({ email, password });
    await otterApi.init();
    
    // Cache the authenticated instance
    otterApiCache.set(authKey, {
      instance: otterApi,
      lastAuthTime: now
    });
    
    console.log(`✅ Authenticated with Otter.ai for ${email}`);
    return otterApi;
  } catch (error) {
    console.error(`❌ Authentication failed for ${email}:`, error.message);
    throw error;
  }
}

// Authentication middleware - extracts credentials from request
async function extractAndValidateCredentials(req, res, next) {
  let email, password;
  
  // Try to get credentials from request body first
  if (req.body && req.body.email && req.body.password) {
    email = req.body.email;
    password = req.body.password;
  }
  // Fallback to headers
  else if (req.headers['x-otter-email'] && req.headers['x-otter-password']) {
    email = req.headers['x-otter-email'];
    password = req.headers['x-otter-password'];
  }
  // Fallback to environment variables (for backward compatibility)
  else if (config.email && config.password) {
    email = config.email;
    password = config.password;
  }
  else {
    return res.status(400).json({
      error: 'Missing credentials',
      message: 'Please provide email and password in request body, headers, or environment variables',
      examples: {
        body: { email: 'your@email.com', password: 'yourpassword' },
        headers: { 'x-otter-email': 'your@email.com', 'x-otter-password': 'yourpassword' }
      }
    });
  }
  
  try {
    const otterApi = await getOtterApiInstance(email, password);
    req.otterApi = otterApi;
    req.userEmail = email;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid email or password for Otter.ai'
    });
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    cacheSize: otterApiCache.size
  });
});

// Get all speeches
app.post('/api/speeches', extractAndValidateCredentials, async (req, res) => {
  try {
    const speeches = await req.otterApi.getSpeeches();
    res.json({
      success: true,
      count: speeches.length,
      user: req.userEmail,
      data: speeches.map(speech => ({
        id: speech.speech_id,
        title: speech.title,
        duration: speech.duration,
        created_at: speech.created_at,
        summary: speech.summary,
        owner: speech.owner,
        process_finished: speech.process_finished
      }))
    });
  } catch (error) {
    console.error('Error fetching speeches:', error.message);
    res.status(500).json({
      error: 'Failed to fetch speeches',
      message: error.message
    });
  }
});

// Get specific speech by ID
app.post('/api/speeches/:speechId', extractAndValidateCredentials, async (req, res) => {
  try {
    const { speechId } = req.params;
    const speech = await req.otterApi.getSpeech(speechId);
    
    res.json({
      success: true,
      user: req.userEmail,
      data: {
        id: speech.speech_id,
        title: speech.title,
        duration: speech.duration,
        created_at: speech.created_at,
        summary: speech.summary,
        transcript: speech.transcript,
        speakers: speech.speakers,
        owner: speech.owner
      }
    });
  } catch (error) {
    console.error('Error fetching speech:', error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({
        error: 'Speech not found',
        message: `Speech with ID ${req.params.speechId} not found`
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch speech',
        message: error.message
      });
    }
  }
});

// Search speeches
app.post('/api/search', extractAndValidateCredentials, async (req, res) => {
  try {
    const query = req.body.query || req.query.q;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing query parameter',
        message: 'Please provide a search query in request body as "query" or as URL parameter ?q=your-search-term'
      });
    }

    const results = await req.otterApi.searchSpeeches(query);
    
    res.json({
      success: true,
      user: req.userEmail,
      query: query,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching speeches:', error.message);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

// Get transcript for a specific speech
app.post('/api/speeches/:speechId/transcript', extractAndValidateCredentials, async (req, res) => {
  try {
    const { speechId } = req.params;
    const speech = await req.otterApi.getSpeech(speechId);
    
    if (!speech.transcript) {
      return res.status(404).json({
        error: 'Transcript not available',
        message: 'No transcript found for this speech'
      });
    }

    // Extract just the text from transcript
    const transcriptText = speech.transcript
      .map(item => item.transcript)
      .join(' ');

    res.json({
      success: true,
      user: req.userEmail,
      speech_id: speechId,
      title: speech.title,
      transcript: {
        text: transcriptText,
        detailed: speech.transcript
      }
    });
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    res.status(500).json({
      error: 'Failed to fetch transcript',
      message: error.message
    });
  }
});

// Clear cache endpoint
app.post('/api/auth/clear-cache', extractAndValidateCredentials, async (req, res) => {
  try {
    const authKey = getAuthKey(req.userEmail, req.body.password);
    otterApiCache.delete(authKey);
    
    res.json({
      success: true,
      message: 'Authentication cache cleared',
      user: req.userEmail
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Otter.ai API Server running on port ${PORT}`);
    console.log(`📋 Available endpoints (credentials in request body):`);
    console.log(`   GET  /health - Health check`);
    console.log(`   POST /api/speeches - Get all speeches`);
    console.log(`   POST /api/speeches/:id - Get specific speech`);
    console.log(`   POST /api/speeches/:id/transcript - Get transcript`);
    console.log(`   POST /api/search - Search speeches`);
    console.log(`   POST /api/auth/clear-cache - Clear authentication cache`);
    console.log(`\n💡 Example: curl -X POST http://localhost:${PORT}/api/speeches -H "Content-Type: application/json" -d '{"email":"your@email.com","password":"yourpass"}'`);
    console.log(`🧪 Test: npm run test-api`);
  });
}

module.exports = app;
