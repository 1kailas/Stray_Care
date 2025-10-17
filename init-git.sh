#!/bin/bash

# Quick Git Initialization Script
# This script helps you quickly set up Git and push to GitHub

echo "🚀 Stray DogCare - Git Initialization"
echo "====================================="
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   sudo dnf install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if already initialized
if [ -d .git ]; then
    echo "⚠️  Git repository already initialized"
    echo ""
    git status
    exit 0
fi

# Initialize Git
echo "📦 Initializing Git repository..."
git init

# Configure Git (if not already configured)
if [ -z "$(git config --global user.name)" ]; then
    echo ""
    read -p "Enter your name: " git_name
    git config --global user.name "$git_name"
fi

if [ -z "$(git config --global user.email)" ]; then
    echo ""
    read -p "Enter your email: " git_email
    git config --global user.email "$git_email"
fi

echo ""
echo "✅ Git configured:"
echo "   Name:  $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
echo ""

# Add all files
echo "📁 Adding files to Git..."
git add .

# Show status
echo ""
echo "📊 Git Status:"
git status --short

# Count files
file_count=$(git ls-files | wc -l)
echo ""
echo "✅ $file_count files staged for commit"
echo ""

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Stray DogCare Full Stack Application

Features:
- React 18 + TypeScript frontend with Vite
- Spring Boot 3 backend with MongoDB
- JWT authentication with role-based access
- Admin dashboard with comprehensive management
- Dog report system with map integration
- Adoption management workflow
- Volunteer task assignment system
- Donation tracking with real-time statistics
- AI chatbot for user assistance
- Community forum and vaccination tracking
- Real-time notifications
- Comprehensive user roles (User, Volunteer, Admin)

Tech Stack:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- Backend: Spring Boot 3, Java 21, MongoDB
- State: Zustand, TanStack Query
- Maps: Leaflet, React-Leaflet
- AI: Groq API

Version: 2.0.0
Status: Production Ready
"

echo ""
echo "✅ Initial commit created!"
echo ""

# Instructions for GitHub
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Repository Settings:"
echo "   - Name: stray-dogcare (or your choice)"
echo "   - Description: Full Stack Dog Rescue Management Platform"
echo "   - Public or Private (your choice)"
echo "   - DON'T initialize with README"
echo ""
echo "3. After creating the repository, run these commands:"
echo ""
echo "   # Replace YOUR_USERNAME and YOUR_REPO with your values"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "   # OR if using SSH:"
echo "   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📖 For detailed instructions, see GITHUB_SETUP.md"
echo ""
echo "✨ Your project is ready for GitHub!"
