#!/bin/bash
echo "🔍 Webhook Configuration Check"
echo "=============================="
echo ""
echo "1. Endpoint Status:"
curl -s http://localhost:3000/api/webhooks/github | jq '.' 2>/dev/null || echo "Endpoint not accessible"
echo ""
echo "2. Environment Variables:"
if grep -q "GITHUB_WEBHOOK_SECRET" .env; then
  echo "✅ GITHUB_WEBHOOK_SECRET is set in .env"
  SECRET_LENGTH=$(grep "GITHUB_WEBHOOK_SECRET" .env | cut -d'=' -f2 | tr -d '"' | wc -c)
  echo "   Secret length: $SECRET_LENGTH characters"
else
  echo "❌ GITHUB_WEBHOOK_SECRET not found in .env"
fi
echo ""
echo "3. Common Issues:"
echo "   - If getting 401: GitHub App webhook secret doesn't match .env"
echo "   - If getting 404: Server not running or wrong URL"
echo ""
echo "📝 Next Steps:"
echo "   1. Go to: https://github.com/settings/apps"
echo "   2. Click your app → Webhook"
echo "   3. Click 'Edit' on webhook secret"
echo "   4. Copy the secret"
echo "   5. Update GITHUB_WEBHOOK_SECRET in .env"
echo "   6. Restart: npm run dev"
