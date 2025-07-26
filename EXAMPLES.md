# OtterApi Usage Examples

This folder contains example scripts demonstrating how to use the OtterApi class.

## 📋 Available Examples

### 1. `demo.js` - **Recommended starter** 
- Automatically detects config file or uses placeholders
- Clean error handling and user-friendly messages
- Shows basic usage: login and list speeches
- **Run with:** `npm run demo`

### 2. `simple-example.js` - Minimal example
- Basic usage with hardcoded credentials
- Good for quick testing
- **Run with:** `npm run simple`

### 3. `example.js` - Comprehensive example
- Detailed speech information
- Transcript preview
- Multiple API method examples
- **Run with:** `npm run example`

## 🔧 Setup

### Option 1: Use config file (Recommended)
```bash
# Copy the template
cp config.template.js config.js

# Edit config.js and add your real Otter.ai credentials
# Then run:
npm run demo
```

### Option 2: Edit credentials directly
Edit any of the example files and replace:
```javascript
const EMAIL = 'your-email@example.com';      // ← Your actual email
const PASSWORD = 'your-password';            // ← Your actual password
```

## 🚀 Available Scripts

- `npm run demo` - Run the recommended demo
- `npm run simple` - Run the simple example  
- `npm run example` - Run the comprehensive example
- `npm run watch` - Auto-rebuild when source changes
- `npm test` - Run tests

## 📝 What You'll See

When you run with valid credentials:
```
🔐 Attempting to log into Otter.ai...
✅ Successfully logged in!

📋 Fetching speeches...
Found 5 speeches in your account.

Your recent speeches:
1. "Team Meeting" - 1847s (1/15/2024)
2. "Interview Notes" - 892s (1/10/2024)
3. "Lecture Recording" - 3421s (12/20/2023)
```

## ⚠️ Troubleshooting

**"Authentication failed"** → Check your email/password
**"OtterApi is not a constructor"** → Run `npm run prepublish` to build
**"Module not found"** → Run `npm install` to install dependencies

## 🔍 API Methods Available

- `await otterApi.init()` - Login (required first)
- `await otterApi.getSpeeches()` - Get all speeches
- `await otterApi.getSpeech(speechId)` - Get detailed speech info
- `await otterApi.searchSpeeches(query)` - Search speeches
