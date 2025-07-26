#!/bin/bash

echo "🚀 Deploying Otter.ai API to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - OTTER_EMAIL: your-email@example.com"
echo "   - OTTER_PASSWORD: your-password"
echo ""
echo "2. Test your API:"
echo "   curl https://your-project-name.vercel.app/health"
echo ""
echo "📖 For detailed instructions, see VERCEL_DEPLOY.md"
