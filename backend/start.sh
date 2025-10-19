#!/bin/bash

# Stray DogCare Application Startup Script
# This script starts both the backend and frontend services

echo "🐾 Stray DogCare Application Startup"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to stop existing processes
stop_existing_services() {
    echo "🔍 Checking for existing services..."
    
    # Check and stop backend
    if lsof -ti:5000 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Backend is already running on port 5000${NC}"
        echo "   Stopping existing backend..."
        fuser -k 5000/tcp 2>/dev/null || lsof -ti:5000 | xargs kill -9 2>/dev/null
        sleep 2
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
    
    # Check and stop frontend
    if lsof -ti:5173 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Frontend is already running on port 5173${NC}"
        echo "   Stopping existing frontend..."
        fuser -k 5173/tcp 2>/dev/null || lsof -ti:5173 | xargs kill -9 2>/dev/null
        sleep 2
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
    
    # Kill any remaining Spring Boot processes
    if pgrep -f "spring-boot:run" > /dev/null; then
        echo "   Cleaning up Spring Boot processes..."
        pkill -f "spring-boot:run" 2>/dev/null
        sleep 1
    fi
    
    # Kill any remaining Vite processes
    if pgrep -f "vite" > /dev/null; then
        echo "   Cleaning up Vite processes..."
        pkill -f "vite" 2>/dev/null
        sleep 1
    fi
    
    echo ""
}

# Stop existing services first
stop_existing_services

# Check MongoDB configuration
echo "📊 Checking MongoDB configuration..."
if grep -q "mongodb+srv://" backend/.env 2>/dev/null || grep -q "mongodb+srv://" backend/src/main/resources/application.yml 2>/dev/null; then
    echo -e "${GREEN}✓ Using MongoDB Atlas (Cloud Database)${NC}"
    echo "   No local MongoDB needed!"
elif pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ Local MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running locally.${NC}"
    echo "   Attempting to start local MongoDB..."
    sudo systemctl start mongod 2>/dev/null || sudo service mongod start 2>/dev/null || {
        echo -e "${YELLOW}💡 Tip: If you're using MongoDB Atlas, this is fine!${NC}"
        echo -e "${YELLOW}   Just make sure MONGODB_URI is set in backend/src/main/resources/application.yml${NC}"
    }
fi

echo ""

# Start Backend
echo "🚀 Starting Backend (Spring Boot)..."
cd backend
if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
else
    mvn spring-boot:run > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
fi
cd ..

echo -e "${GREEN}✓ Backend starting on http://localhost:5000${NC}"
echo "   PID: $BACKEND_PID"
echo "   Logs: /tmp/backend.log"
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
for i in {1..60}; do
    if curl -s http://localhost:5000/api/auth/login > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}✗ Backend failed to start within 60 seconds${NC}"
        echo "   Check logs: tail -f /tmp/backend.log"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
    if [ $((i % 10)) -eq 0 ]; then
        echo -n " ${i}s"
    else
        echo -n "."
    fi
done

echo ""
echo ""

# Start Frontend
echo "🎨 Starting Frontend (Vite + React)..."
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✓ Frontend starting on http://localhost:5173${NC}"
echo "   PID: $FRONTEND_PID"
echo "   Logs: /tmp/frontend.log"
echo ""

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠ Frontend is starting (may take a moment)${NC}"
        break
    fi
    sleep 1
    if [ $((i % 5)) -eq 0 ]; then
        echo -n " ${i}s"
    else
        echo -n "."
    fi
done

echo ""
echo ""

# Display status
echo "===================================="
echo -e "${GREEN}✅ Both services are running!${NC}"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
if grep -q "mongodb+srv://" backend/src/main/resources/application.yml 2>/dev/null; then
    echo "💾 MongoDB:  Atlas (Cloud)"
else
    echo "💾 MongoDB:  localhost:27017"
fi
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🔑 Login credentials:"
echo "   Email:    admin@straydogcare.com"
echo "   Password: admin123"
echo ""
echo "💡 Tip: Clear browser cache if you have login issues:"
echo "   Press F12 > Console > Run: localStorage.clear(); location.reload();"
echo ""
echo "Press Ctrl+C to stop all services"
echo "===================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    
    # Stop backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    fuser -k 5000/tcp 2>/dev/null || true
    pkill -f "spring-boot:run" 2>/dev/null || true
    
    # Stop frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    fuser -k 5173/tcp 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    sleep 1
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
echo ""
echo "Services are running in the background."
echo "Monitoring processes... (Ctrl+C to stop)"
echo ""

# Wait for processes and monitor
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}✗ Backend process died unexpectedly${NC}"
        echo "   Check logs: tail /tmp/backend.log"
        cleanup
    fi
    
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}✗ Frontend process died unexpectedly${NC}"
        echo "   Check logs: tail /tmp/frontend.log"
        cleanup
    fi
    
    sleep 5
done
