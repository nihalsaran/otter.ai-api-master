const OtterApi = require('./dist/index.js').default;

async function main() {
  try {
    // Initialize the OtterApi with your credentials
    const otterApi = new OtterApi({
      email: 'your-email@example.com',     // Replace with your Otter.ai email
      password: 'your-password'            // Replace with your Otter.ai password
    });

    console.log('🔐 Logging into Otter.ai...');
    await otterApi.init(); // Performs login
    console.log('✅ Successfully logged in!');

    // Get all speeches
    console.log('\n📋 Fetching all speeches...');
    const speeches = await otterApi.getSpeeches();
    console.log(`Found ${speeches.length} speeches:`);
    
    // Display basic info about each speech
    speeches.forEach((speech, index) => {
      console.log(`\n${index + 1}. ${speech.title}`);
      console.log(`   ID: ${speech.speech_id}`);
      console.log(`   Duration: ${speech.duration} seconds`);
      console.log(`   Created: ${new Date(speech.created_at * 1000).toLocaleDateString()}`);
      if (speech.summary) {
        console.log(`   Keywords: ${speech.summary}`);
      }
    });

    // If there are speeches, get detailed info about the first one
    if (speeches.length > 0) {
      const firstSpeechId = speeches[0].speech_id;
      console.log(`\n🔍 Getting detailed info for speech: ${speeches[0].title}`);
      
      const speechDetail = await otterApi.getSpeech(firstSpeechId);
      console.log('\nDetailed speech info:');
      console.log(`Title: ${speechDetail.title}`);
      console.log(`Duration: ${speechDetail.duration} seconds`);
      console.log(`Speakers: ${speechDetail.speakers?.length || 0}`);
      
      // If there's transcript data, show a preview
      if (speechDetail.transcript && speechDetail.transcript.length > 0) {
        console.log('\nTranscript preview (first 200 characters):');
        const transcriptText = speechDetail.transcript
          .map(item => item.transcript)
          .join(' ');
        console.log(transcriptText.substring(0, 200) + '...');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Email and/or password')) {
      console.log('\n💡 Please update the email and password in this script with your actual Otter.ai credentials.');
    }
  }
}

// Run the example
main().catch(console.error);
