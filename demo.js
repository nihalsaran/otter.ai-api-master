const OtterApi = require('./dist/index.js').default;

// Try to load config file, fall back to placeholder values
let config;
try {
  config = require('./config.js');
} catch (error) {
  console.log('⚠️  No config.js found. Using placeholder credentials.');
  console.log('💡 Copy config.template.js to config.js and add your real credentials.');
  config = {
    email: '',
    password: ''
  };
}

async function runExample() {
  const otterApi = new OtterApi({
    email: config.email,
    password: config.password
  });

  try {
    console.log('🔐 Attempting to log into Otter.ai...');
    await otterApi.init();
    console.log('✅ Successfully logged in!');

    console.log('\n📋 Fetching speeches...');
    const speeches = await otterApi.getSpeeches();
    console.log(`Found ${speeches.length} speeches in your account.`);

    if (speeches.length > 0) {
      console.log('\nYour recent speeches:');
      speeches.slice(0, 5).forEach((speech, i) => {
        const date = new Date(speech.created_at * 1000).toLocaleDateString();
        console.log(`${i + 1}. "${speech.title}" - ${speech.duration}s (${date})`);
      });
    } else {
      console.log('\nNo speeches found in your account.');
    }

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('❌ Authentication failed - Invalid email or password');
      console.log('💡 Please check your credentials in config.js or update them directly in this file.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

runExample();
