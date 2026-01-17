# 🚀 Quick Start Guide - CodeSensei

## 1️⃣ Install Dependencies (Run Now!)

```bash
npm install @google/generative-ai octokit @octokit/auth-app inngest
```

## 2️⃣ Setup Environment

```bash
cp .env.example .env
# Then edit .env with your credentials
```

## 3️⃣ Database Setup

```bash
npx prisma generate
npx prisma db push
```

## 4️⃣ Start Development

```bash
npm run dev
```

---

## 🎯 Testing the Flow

### Option A: Test with GitHub PR
1. Create a GitHub App (see `.env.example` instructions)
2. Install app on a test repository
3. Open a PR with some code
4. Watch webhook trigger analysis
5. Click the GitHub comment link
6. Follow the learning journey!

### Option B: Test Locally (Without GitHub)
1. Visit `/wallet` - See your wallet (should initialize)
2. Use Prisma Studio to create mock Analysis:
   ```bash
   npx prisma studio
   ```
3. Visit `/learning/receipt/[analysisId]`

---

## 📁 Key Files to Review

| File | Purpose |
|------|---------|
| `SUMMARY.md` | Complete implementation summary |
| `IMPLEMENTATION.md` | Detailed documentation |
| `.env.example` | Environment setup guide |
| `prisma/schema.prisma` | Database models |

---

## 🔧 Critical Environment Variables

```bash
# Required for basic functionality:
DATABASE_URL="..."                    # Neon PostgreSQL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..." # Clerk auth
CLERK_SECRET_KEY="..."                # Clerk auth

# Required for GitHub integration:
GITHUB_APP_ID="..."
GITHUB_PRIVATE_KEY="..."
GITHUB_WEBHOOK_SECRET="..."

# Required for AI features:
GEMINI_API_KEY="..."                  # Google AI
OPENROUTER_API_KEY="..."              # DeepSeek

# Required for background jobs:
INNGEST_SIGNING_KEY="..."
INNGEST_EVENT_KEY="..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🎓 Student Learning Flow

```
GitHub PR opened
  ↓
Webhook receives event (< 300ms response)
  ↓
Inngest processes in background
  ↓
AI analyzes code (Gemini + DeepSeek)
  ↓
Comment posted on PR with link
  ↓
Student clicks link → Receipt Page
  ↓
"Pay Debt" → Trinity Knowledge Deck
  ↓
Learn 3 cards per issue
  ↓
Diff Match Fixer → Compare code
  ↓
Mark as fixed → Wallet updated!
  (XP gained, badges unlocked)
```

---

## 🏆 Badge Unlock Conditions

| Badge | Unlock At | XP |
|-------|-----------|-------|
| 🎯 First Fix | Fix 1st issue | 10+ |
| 🛡️ Security Apprentice | $125 debt paid | 50+ |
| 🏹 Bug Hunter | $250 debt paid | 100+ |
| 🏆 Security Champion | Fix CRITICAL issue | 100 |

---

## 🐛 Troubleshooting

### Database Connection Fails
- Check `DATABASE_URL` in `.env`
- Run `npx prisma db push` again
- Try `npx prisma studio` to test connection

### Webhook Not Triggering
- Verify `GITHUB_WEBHOOK_SECRET` matches GitHub App
- Check webhook URL is publicly accessible (use ngrok for local dev)
- Review webhook deliveries in GitHub App settings

### AI Not Working
- Verify `GEMINI_API_KEY` is valid
- Check `OPENROUTER_API_KEY` has credits
- Review API usage limits

---

## 📞 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npx prisma studio        # View database
npx prisma db push       # Update schema

# Production
npm run build            # Build for production
npm run start            # Start production server

# Utilities
./setup.sh               # Run full setup
git status               # Check changes
```

---

## ✅ Checklist Before First PR Test

- [ ] All dependencies installed
- [ ] `.env` configured with all keys
- [ ] Database pushed (`npx prisma db push`)
- [ ] GitHub App created and installed
- [ ] Webhook URL configured (use ngrok for local)
- [ ] Inngest app created
- [ ] AI provider keys tested
- [ ] Dev server running (`npm run dev`)

---

**🎉 You're ready to launch CodeSensei!**

Visit [IMPLEMENTATION.md](./IMPLEMENTATION.md) for complete documentation.
