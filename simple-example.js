const OtterApi = require('./dist/index.js').default;

// Simple example - replace with your actual credentials
const EMAIL = 'your-email@example.com';
const PASSWORD = 'your-password';

async function simpleExample() {
  const otterApi = new OtterApi({
    email: EMAIL,
    password: PASSWORD
  });

  try {
    // Login
    await otterApi.init();
    console.log('Logged in successfully!');

    // Get all speeches
    const speeches = await otterApi.getSpeeches();
    console.log(`You have ${speeches.length} speeches`);

    // Show titles of first 5 speeches
    speeches.slice(0, 5).forEach((speech, i) => {
      console.log(`${i + 1}. ${speech.title} (${speech.duration}s)`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

simpleExample();
