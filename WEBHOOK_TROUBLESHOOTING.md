# 🐛 GitHub Webhook Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: 401 Unauthorized

**Causes:**
- Missing `GITHUB_WEBHOOK_SECRET` in `.env`
- Incorrect webhook secret
- Signature verification failing

**Solutions:**

1. **Check if webhook secret is set:**
   ```bash
   # In your .env file
   GITHUB_WEBHOOK_SECRET="your_secret_here"
   ```

2. **Get the webhook secret from GitHub:**
   - Go to GitHub Settings → Developer Settings → GitHub Apps
   - Select your app
   - Scroll to "Webhook secret"
   - Copy the secret
   - Paste into `.env`

3. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test the endpoint:**
   ```bash
   # Visit in browser:
   http://localhost:3000/api/webhooks/github
   
   # Should return:
   {
     "status": "ok",
     "configured": true,
     "message": "..."
   }
   ```

### Issue 2: 404 Not Found

**Causes:**
- Route file not found
- Next.js cache issue
- Wrong URL

**Solutions:**

1. **Verify file exists:**
   ```bash
   ls -la app/api/webhooks/github/route.ts
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check URL format:**
   ```
   ✅ Correct: http://localhost:3000/api/webhooks/github
   ❌ Wrong:   http://localhost:3000/api/webhook/github
   ❌ Wrong:   http://localhost:3000/webhooks/github
   ```

### Issue 3: Webhook Secret Mismatch

**Test your webhook signature:**

Run the test script:
```bash
./test-webhook.sh
```

This will:
- Check if `GITHUB_WEBHOOK_SECRET` is set
- Test the GET endpoint (healthcheck)
- Send a test POST with proper signature
- Show detailed results

## Manual Testing

### 1. Test GET Endpoint
```bash
curl http://localhost:3000/api/webhooks/github
```

**Expected Response:**
```json
{
  "status": "ok",
  "endpoint": "GitHub Webhook Handler",
  "configured": true,
  "message": "This endpoint only accepts POST requests from GitHub webhooks"
}
```

### 2. Test Webhook Signature

```bash
# Set your secret
WEBHOOK_SECRET="your_secret_here"

# Create payload
PAYLOAD='{"action":"ping"}'

# Generate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | sed 's/^.* //')

# Send request
curl -X POST http://localhost:3000/api/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-GitHub-Delivery: test-123" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

## Testing with ngrok (for real GitHub webhooks)

### 1. Install ngrok
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com
```

### 2. Start ngrok tunnel
```bash
ngrok http 3000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### 3. Update GitHub App webhook URL
1. Go to GitHub Settings → Developer Settings → GitHub Apps
2. Select your app
3. Update webhook URL to: `https://abc123.ngrok.io/api/webhooks/github`
4. Save changes

### 4. Test with real webhook
1. Install your GitHub App on a test repository
2. Create a pull request
3. Watch your terminal for webhook logs

## Debugging Checklist

- [ ] `GITHUB_WEBHOOK_SECRET` is set in `.env`
- [ ] Dev server is running (`npm run dev`)
- [ ] Route file exists at `app/api/webhooks/github/route.ts`
- [ ] GET request returns `configured: true`
- [ ] `.env` file is in the root directory (not in `app/`)
- [ ] No `.env.local` conflicting with `.env`
- [ ] Webhook secret matches GitHub App settings
- [ ] Using HTTPS with ngrok for external testing

## Environment Variable Priority

Next.js loads env vars in this order (later overrides earlier):
1. `.env`
2. `.env.local`
3. `.env.development` or `.env.production`
4. `.env.development.local` or `.env.production.local`

**Tip:** Use `.env.local` for secrets (it's gitignored by default)

## Common Errors

### "Unauthorized" with correct secret
**Solution:** Restart dev server after changing `.env`

### "Server configuration error"
**Solution:** `GITHUB_WEBHOOK_SECRET` not found in environment

### "Missing signature"
**Solution:** Request doesn't have `X-Hub-Signature-256` header

### "Invalid signature"
**Solution:** Webhook secret doesn't match or payload was modified

## Logging

The updated webhook handler now logs:
- ✅ Webhook event received
- ✅ Signature verification status
- ✅ Secret configuration (first 10 chars only)
- ✅ Each processing step
- ❌ Detailed error messages

Check your terminal where `npm run dev` is running.

## Need More Help?

1. Run the test script: `./test-webhook.sh`
2. Check terminal logs for detailed error messages
3. Verify GitHub App settings match your `.env`
4. Use ngrok to test with real GitHub webhooks
5. Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for setup guide

---

**Quick Fix 90% of Issues:**
```bash
# 1. Verify secret is set
cat .env | grep GITHUB_WEBHOOK_SECRET

# 2. Restart server
# Press Ctrl+C to stop
npm run dev

# 3. Test endpoint
curl http://localhost:3000/api/webhooks/github
```
