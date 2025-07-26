const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000'; // Change to your Vercel URL after deployment
const CREDENTIALS = {
  email: 'your-email@example.com',    // Replace with your Otter.ai email
  password: 'your-password'           // Replace with your Otter.ai password
};

async function testAPI() {
  try {
    console.log('🚀 Testing Otter.ai API with credential payload...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);
    console.log();

    // Test 2: Get all speeches
    console.log('2. Getting all speeches...');
    const speechesResponse = await axios.post(`${API_URL}/api/speeches`, CREDENTIALS);
    const speeches = speechesResponse.data;
    console.log(`✅ Found ${speeches.count} speeches for ${speeches.user}`);
    
    if (speeches.data.length > 0) {
      console.log('First few speeches:');
      speeches.data.slice(0, 3).forEach((speech, i) => {
        console.log(`   ${i + 1}. "${speech.title}" - ${speech.duration}s`);
      });
    }
    console.log();

    // Test 3: Get specific speech (if we have speeches)
    if (speeches.data.length > 0) {
      const firstSpeechId = speeches.data[0].id;
      console.log(`3. Getting specific speech: ${firstSpeechId}...`);
      
      const speechResponse = await axios.post(`${API_URL}/api/speeches/${firstSpeechId}`, CREDENTIALS);
      const speech = speechResponse.data;
      console.log(`✅ Speech details for ${speech.user}:`);
      console.log(`   Title: ${speech.data.title}`);
      console.log(`   Duration: ${speech.data.duration}s`);
      console.log(`   Speakers: ${speech.data.speakers?.length || 0}`);
      console.log();

      // Test 4: Get transcript
      console.log(`4. Getting transcript for speech: ${firstSpeechId}...`);
      try {
        const transcriptResponse = await axios.post(`${API_URL}/api/speeches/${firstSpeechId}/transcript`, CREDENTIALS);
        const transcript = transcriptResponse.data;
        console.log(`✅ Transcript for ${transcript.user}:`);
        console.log(`   Title: ${transcript.title}`);
        console.log(`   Text preview: ${transcript.transcript.text.substring(0, 100)}...`);
      } catch (error) {
        console.log('⚠️  Transcript not available for this speech');
      }
      console.log();
    }

    // Test 5: Search speeches
    console.log('5. Searching speeches...');
    const searchResponse = await axios.post(`${API_URL}/api/search`, {
      ...CREDENTIALS,
      query: 'meeting'
    });
    const searchResults = searchResponse.data;
    console.log(`✅ Search results for "${searchResults.query}" (user: ${searchResults.user}):`);
    console.log(`   Found ${searchResults.count} matching speeches`);
    console.log();

    // Test 6: Clear cache
    console.log('6. Clearing authentication cache...');
    const clearResponse = await axios.post(`${API_URL}/api/auth/clear-cache`, CREDENTIALS);
    console.log(`✅ Cache cleared for ${clearResponse.data.user}`);
    console.log();

    console.log('🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Error testing API:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Make sure to update CREDENTIALS with your actual Otter.ai email and password');
    }
  }
}

// Alternative examples showing different ways to send credentials

async function exampleWithHeaders() {
  console.log('\n📋 Example: Using headers for credentials');
  
  try {
    const response = await axios.post(`${API_URL}/api/speeches`, {}, {
      headers: {
        'x-otter-email': CREDENTIALS.email,
        'x-otter-password': CREDENTIALS.password
      }
    });
    console.log(`✅ Success with headers: Found ${response.data.count} speeches`);
  } catch (error) {
    console.error('❌ Error with headers:', error.response?.data || error.message);
  }
}

async function exampleWithQueryAndPayload() {
  console.log('\n🔍 Example: Search with query parameter');
  
  try {
    const response = await axios.post(`${API_URL}/api/search?q=meeting`, CREDENTIALS);
    console.log(`✅ Search with query param: Found ${response.data.count} results`);
  } catch (error) {
    console.error('❌ Error with query search:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAPI();
  await exampleWithHeaders();
  await exampleWithQueryAndPayload();
}

runAllTests();
