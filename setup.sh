#!/bin/bash

# CodeSensei Setup Script
# This script installs all required dependencies for the student learning platform

echo "🎓 Setting up CodeSensei - Student Learning Platform"
echo "=================================================="
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

echo "📦 Installing required dependencies..."
echo ""

# Install AI and GitHub integrations
npm install @google/generative-ai octokit @octokit/auth-app inngest

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Copy .env.example to .env:"
echo "   cp .env.example .env"
echo ""
echo "2. Fill in your environment variables in .env file"
echo ""
echo "3. Generate Prisma client:"
echo "   npx prisma generate"
echo ""
echo "4. Push database schema to Neon:"
echo "   npx prisma db push"
echo ""
echo "5. Start development server:"
echo "   npm run dev"
echo ""
echo "📚 See IMPLEMENTATION.md for complete setup instructions"
echo "=================================================="
