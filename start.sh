#!/bin/bash

# Stray DogCare - Start Script
# This script starts both the frontend and backend services

echo "🐾 Starting Stray DogCare Application..."
echo "========================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to start a service
start_service() {
    local service_name=$1
    local service_dir=$2
    local start_command=$3

    echo "🚀 Starting $service_name..."

    if [ ! -d "$service_dir" ]; then
        echo "❌ Directory $service_dir not found!"
        return 1
    fi

    cd "$service_dir"

    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found in $service_dir"
        cd ..
        return 1
    fi

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies for $service_name..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install dependencies for $service_name"
            cd ..
            return 1
        fi
    fi

    # Start the service in background
    echo "▶️  Starting $service_name server..."
    $start_command &
    local pid=$!

    # Wait a moment and check if process is still running
    sleep 3
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $service_name started successfully (PID: $pid)"
        cd ..
        return 0
    else
        echo "❌ $service_name failed to start"
        cd ..
        return 1
    fi
}

# Start backend first
start_service "Backend" "backend-node" "npm run dev"
backend_status=$?

# Start frontend
start_service "Frontend" "frontend" "npm run dev"
frontend_status=$?

echo ""
echo "========================================"

if [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo "🎉 Both services started successfully!"
    echo ""
    echo "🌐 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:5000/api"
    echo ""
    echo "📝 To stop the services, press Ctrl+C or run: pkill -f 'npm run dev'"
    echo ""
    echo "🐾 Stray DogCare is now running!"
else
    echo "❌ Some services failed to start. Check the output above for details."
    exit 1
fi

# Wait for user input to keep script running
echo "Press Ctrl+C to stop all services..."
trap 'echo ""; echo "🛑 Stopping services..."; pkill -f "npm run dev"; exit 0' INT
while true; do
    sleep 1
done