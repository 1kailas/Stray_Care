#!/bin/bash

# Stray Dog Care Backend - Endpoint Testing Script
# This script tests all major API endpoints

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "  Stray Dog Care Backend API Tests"
echo "======================================"
echo ""

# Test health check
echo -e "${YELLOW}Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s "${BASE_URL}/health")
if [[ $HEALTH_RESPONSE == *"UP"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test actuator health
echo -e "${YELLOW}Testing Actuator Health...${NC}"
ACTUATOR_RESPONSE=$(curl -s "${BASE_URL}/actuator/health")
if [[ $ACTUATOR_RESPONSE == *"UP"* ]]; then
    echo -e "${GREEN}✓ Actuator health check passed${NC}"
else
    echo -e "${RED}✗ Actuator health check failed${NC}"
fi
echo ""

# Register a test user
echo -e "${YELLOW}Testing User Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "phone": "1234567890"
  }')

if [[ $REGISTER_RESPONSE == *"token"* ]] || [[ $REGISTER_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✓ User registration passed${NC}"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ User registration failed${NC}"
    echo "Response: $REGISTER_RESPONSE"
fi
echo ""

# Login with test credentials
echo -e "${YELLOW}Testing User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@straydog.com",
    "password": "admin123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ User login passed${NC}"
    ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Admin Token: ${ADMIN_TOKEN:0:50}..."
else
    echo -e "${YELLOW}⚠ Admin login failed (user may not exist yet)${NC}"
    ADMIN_TOKEN=$TOKEN
fi
echo ""

# Test protected route
if [ ! -z "$ADMIN_TOKEN" ]; then
    echo -e "${YELLOW}Testing Protected Route (Get Profile)...${NC}"
    PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/auth/me" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if [[ $PROFILE_RESPONSE == *"email"* ]]; then
        echo -e "${GREEN}✓ Protected route access passed${NC}"
    else
        echo -e "${RED}✗ Protected route access failed${NC}"
    fi
    echo ""
fi

# Test dog reports endpoint
echo -e "${YELLOW}Testing Dog Reports Endpoint...${NC}"
DOG_REPORTS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/dog-reports")
if [[ $DOG_REPORTS_RESPONSE == *"results"* ]] || [[ $DOG_REPORTS_RESPONSE == *"[]"* ]]; then
    echo -e "${GREEN}✓ Dog reports endpoint passed${NC}"
else
    echo -e "${RED}✗ Dog reports endpoint failed${NC}"
fi
echo ""

# Test adoption dogs endpoint
echo -e "${YELLOW}Testing Adoption Dogs Endpoint...${NC}"
ADOPTION_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/adoption-dogs")
if [[ $ADOPTION_RESPONSE == *"results"* ]] || [[ $ADOPTION_RESPONSE == *"[]"* ]]; then
    echo -e "${GREEN}✓ Adoption dogs endpoint passed${NC}"
else
    echo -e "${RED}✗ Adoption dogs endpoint failed${NC}"
fi
echo ""

# Test donations endpoint
echo -e "${YELLOW}Testing Donations Endpoint...${NC}"
DONATIONS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/donations")
if [[ $DONATIONS_RESPONSE == *"results"* ]] || [[ $DONATIONS_RESPONSE == *"[]"* ]]; then
    echo -e "${GREEN}✓ Donations endpoint passed${NC}"
else
    echo -e "${RED}✗ Donations endpoint failed${NC}"
fi
echo ""

# Test dashboard stats endpoint
echo -e "${YELLOW}Testing Dashboard Stats Endpoint...${NC}"
STATS_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/dashboard/stats")
if [[ $STATS_RESPONSE == *"totalReports"* ]] || [[ $STATS_RESPONSE == *"stats"* ]]; then
    echo -e "${GREEN}✓ Dashboard stats endpoint passed${NC}"
else
    echo -e "${RED}✗ Dashboard stats endpoint failed${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}  API Testing Complete!${NC}"
echo "======================================"
