#!/bin/bash

echo "=========================================="
echo "  AI Studio Test Generator"
echo "  GitHub Push Script"
echo "=========================================="
echo ""

# Check if remote URL is provided
if [ -z "$1" ]; then
    echo "❌ ERROR: Please provide your GitHub repository URL"
    echo ""
    echo "📋 USAGE:"
    echo "   bash PUSH_TO_GITHUB.sh https://github.com/YOUR-USERNAME/AI-studio-test-generator.git"
    echo ""
    echo "💡 STEPS:"
    echo "   1. Create a new repository on GitHub: https://github.com/new"
    echo "   2. Name it: AI-studio-test-generator"
    echo "   3. Copy the repository URL (ends with .git)"
    echo "   4. Run this script with that URL"
    echo ""
    exit 1
fi

REPO_URL=$1

echo "🔗 Repository URL: $REPO_URL"
echo ""
echo "🚀 Pushing to GitHub..."
echo ""

# Add remote origin
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "🌐 View your repository:"
    echo "   ${REPO_URL%.git}"
    echo ""
    echo "📚 Your testing framework is now live!"
    echo ""
else
    echo ""
    echo "❌ Push failed. You might need to authenticate."
    echo ""
    echo "💡 TIP: GitHub will ask for your username and password."
    echo "   Username: your GitHub username"
    echo "   Password: use Personal Access Token (NOT your GitHub password)"
    echo ""
    echo "🔑 Create token here: https://github.com/settings/tokens/new"
    echo "   - Give it a name (e.g., 'AI Studio Test Generator')"
    echo "   - Select 'repo' permission"
    echo "   - Click 'Generate token'"
    echo "   - Copy the token and use it as password"
    echo ""
fi
