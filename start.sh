#!/bin/bash

echo "🚀 Starting SAMVĀDA..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check if database exists
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  Setting up database..."
    npx prisma migrate dev --name init
    npx tsx prisma/seed.ts
fi

echo ""
echo "✅ SAMVĀDA is ready!"
echo ""
echo "📍 Opening http://localhost:3000"
echo ""
echo "⚙️  Remember to add your Groq API key in Settings"
echo "   Get it from: https://console.groq.com"
echo ""

npm run dev
