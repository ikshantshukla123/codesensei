#!/bin/bash

# GitHub Webhook Test Script
# Use this to test your webhook endpoint locally

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing GitHub Webhook Endpoint"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file with GITHUB_WEBHOOK_SECRET"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if webhook secret is set
if [ -z "$GITHUB_WEBHOOK_SECRET" ]; then
    echo -e "${RED}❌ GITHUB_WEBHOOK_SECRET not set in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GITHUB_WEBHOOK_SECRET found${NC}"
echo ""

# Test 1: Health Check (GET request)
echo "Test 1: Health Check (GET)"
echo "─────────────────────────────"
RESPONSE=$(curl -s http://localhost:3000/api/webhooks/github)
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: Create test payload
echo "Test 2: Webhook Signature Test"
echo "─────────────────────────────────"

# Create a simple test payload
PAYLOAD='{"action":"ping","repository":{"id":123,"full_name":"test/repo"}}'

# Generate signature using OpenSSL
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$GITHUB_WEBHOOK_SECRET" | sed 's/^.* //')

echo "Payload: $PAYLOAD"
echo "Signature (sha256): sha256=$SIGNATURE"
echo ""

# Send test webhook
echo "Sending test POST request..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-GitHub-Delivery: test-$(date +%s)" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD" \
  http://localhost:3000/api/webhooks/github)

echo ""
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Webhook test successful (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Webhook test failed (HTTP $HTTP_CODE)${NC}"
    echo "Expected: 200"
    echo "Received: $HTTP_CODE"
fi

echo ""
echo "─────────────────────────────────"
echo "Check your terminal logs for detailed output"
echo ""
echo "💡 Tips:"
echo "  - Make sure npm run dev is running"
echo "  - Check GITHUB_WEBHOOK_SECRET matches your GitHub App settings"
echo "  - Use ngrok to test with real GitHub webhooks: ngrok http 3000"
