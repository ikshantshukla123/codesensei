# 🎓 CodeSensei - Student Learning Platform

A complete production-ready platform for students to learn secure coding practices through interactive experiences, built with Next.js 15, Clerk, Prisma, Neon, Inngest, and AI providers.

## 🚀 Features Implemented

### ✅ Core Pipeline
- **Clerk Authentication** - GitHub OAuth login with user syncing
- **Prisma + Neon Database** - Full schema with relationships
- **GitHub App Webhooks** - Fast response (<300ms) with Inngest background processing
- **AI Providers**:
  - Gemini (Google AI) - Student-friendly explanations and PR summaries
  - DeepSeek via OpenRouter - Bug detection and security analysis
- **Inngest Background Jobs** - Asynchronous PR analysis

### 🎯 Student Learning Experience

1. **📋 Compounding Liability Receipt**
   - View all detected issues with severity levels
   - See total technical debt ($$ amount)
   - Visual breakdown by issue type
   - CTA to start learning journey

2. **🎴 Trinity Knowledge Deck**
   - Three educational cards per issue:
     - Definition (what is this issue?)
     - Compliance/Rules (security standards)
     - Real-World Impact (concrete examples)
   - AI-generated content using Gemini
   - Progressive learning flow

3. **🔧 Diff Match Fixer**
   - Side-by-side comparison of insecure vs secure code
   - Real code examples for common vulnerabilities
   - Mark issues as fixed and understood
   - Instant feedback loop

4. **💰 Career Wallet**
   - Track total debt paid ($)
   - XP progression system with levels
   - Rank system (Novice → Security Expert)
   - Achievement badges with unlock conditions
   - Visual progress indicators

## 📁 File Structure Created

```
codesensai/
├── prisma/
│   └── schema.prisma (✅ Extended with student models)
├── lib/
│   ├── prisma.ts (✅ Enhanced with retry logic)
│   ├── db-init.ts (✅ Connection warming)
│   ├── github/
│   │   ├── client.ts (✅ Octokit + repo sync)
│   │   └── utils.ts (✅ Signature verification)
│   ├── ai/
│   │   ├── orchestrator.ts (✅ Analysis coordinator)
│   │   └── providers/
│   │       ├── gemini.ts (✅ Student-friendly AI)
│   │       └── openrouter.ts (✅ Bug detection)
│   └── inngest/
│       ├── client.ts (✅ Inngest setup)
│       └── functions/
│           └── analyzePullRequest.ts (✅ Background job)
├── app/
│   ├── api/
│   │   ├── inngest/route.ts (✅ Serve Inngest functions)
│   │   ├── webhooks/github/route.ts (✅ Fast webhook handler)
│   │   ├── user/sync/route.ts (✅ Enhanced Clerk sync)
│   │   ├── wallet/route.ts (✅ Wallet API)
│   │   └── learning/
│   │       ├── analysis/[analysisId]/route.ts (✅)
│   │       ├── trinity-cards/route.ts (✅)
│   │       └── mark-fixed/route.ts (✅)
│   ├── learning/
│   │   ├── receipt/[analysisId]/page.tsx (✅)
│   │   ├── deck/[analysisId]/page.tsx (✅)
│   │   └── fixer/[analysisId]/page.tsx (✅)
│   └── wallet/
│       ├── page.tsx (✅ Server component)
│       └── CareerWalletClient.tsx (✅ Client component)
├── middleware.ts (✅ Auth protection)
└── .env.example (✅ Complete setup guide)
```

## 🗄️ Database Schema

### Core Models
- **User** - Clerk ID, email, name, avatar, githubId, githubUsername
- **Repository** - GitHub repos connected via installation
- **Analysis** - PR analysis results with risk scores
- **WebhookLog** - Idempotency tracking with deliveryId

### Student Models
- **Submission** - Student code submissions
- **Issue** - Individual bugs with trinity card content
- **Wallet** - XP, totalDebtPaid, badges

## 🔄 Complete Flow

```
Student opens PR → GitHub Webhook
  ↓
Webhook Route (Fast Response <300ms)
  ├─ Verify signature
  ├─ Check idempotency
  ├─ Create WebhookLog
  └─ Enqueue Inngest job → Return 200 OK
        ↓
Inngest Background Job
  ├─ Fetch diff from GitHub
  ├─ DeepSeek bug detection
  ├─ Gemini summary generation
  ├─ Calculate risk score
  ├─ Save Analysis to DB
  └─ Post comment with learning dashboard link
        ↓
Student clicks link → Receipt Page
  ↓
Pay Debt → Trinity Knowledge Deck
  ↓
Learn Concepts → Diff Match Fixer
  ↓
Mark as Fixed → Wallet Updated
  ├─ XP gained
  ├─ Debt paid tracked
  └─ Badges unlocked
```

## 🎨 UI/UX Highlights

- **Consistent Design System** - Purple/blue gradients matching your existing app
- **Dark Mode Support** - All components support dark theme
- **Responsive Layout** - Mobile-friendly grids and cards
- **Loading States** - Smooth spinners and skeleton screens
- **Progress Indicators** - Visual progress bars and completion tracking
- **Gamification** - Levels, XP, badges, ranks

## 🔒 Security Features

- **Webhook Signature Verification** - HMAC SHA-256
- **Idempotency** - Duplicate delivery prevention
- **Auth Middleware** - Clerk-protected routes
- **Database Retry Logic** - Exponential backoff for resilience
- **Input Validation** - Sanitized bug data before DB storage

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install @google/generative-ai octokit @octokit/auth-app inngest
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in all variables:
- Neon Database URLs
- Clerk keys
- GitHub App credentials
- Gemini API key
- OpenRouter API key
- Inngest keys

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. GitHub App Configuration
- Create GitHub App with webhooks
- Set webhook URL: `https://your-domain.com/api/webhooks/github`
- Permissions: Contents (read), Pull Requests (read/write)
- Events: `pull_request`, `installation`, `installation_repositories`

### 5. Inngest Setup
- Create Inngest app
- Configure webhook: `https://your-domain.com/api/inngest`
- Deploy and sync functions

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/github` | POST | GitHub webhook handler |
| `/api/inngest` | GET/POST/PUT | Inngest function serving |
| `/api/user/sync` | POST/GET | Clerk user syncing |
| `/api/wallet` | GET | Fetch wallet data |
| `/api/learning/analysis/:id` | GET | Get analysis details |
| `/api/learning/trinity-cards` | POST | Generate trinity cards |
| `/api/learning/mark-fixed` | POST | Mark bug as fixed, update wallet |

## 🎯 Badge System

| Badge | Condition | XP | Icon |
|-------|-----------|----|----|
| First Fix | Fix 1st issue | 10 | 🎯 |
| Security Apprentice | $125 debt paid | 50+ | 🛡️ |
| Bug Hunter | $250 debt paid | 100+ | 🏹 |
| Security Champion | Fix critical issue | 100 | 🏆 |

## 🔧 XP & Debt Calculation

| Severity | Debt Amount | XP Gained |
|----------|-------------|-----------|
| CRITICAL | $500 | 100 XP |
| HIGH | $200 | 50 XP |
| MEDIUM | $75 | 25 XP |
| LOW | $25 | 10 XP |

## 📝 Student-Friendly Messaging

All prompts and UI text use encouraging, educational language:
- ❌ "FAIL" → ✅ "Needs Review"
- ❌ "Vulnerability" → ✅ "Learning Opportunity"
- ❌ "Fix Now" → ✅ "Start Learning Journey"

## 🎓 Next Steps

1. Run `npm run dev` and test the flow
2. Create a test PR to trigger webhook
3. Follow the learning journey through all pages
4. Check wallet for XP and badges
5. Deploy to production (Vercel recommended)

## 📚 Additional Resources

- [Clerk Docs](https://clerk.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Inngest Docs](https://www.inngest.com/docs)
- [GitHub Apps](https://docs.github.com/en/apps)
- [Gemini AI](https://ai.google.dev/docs)

---

Built with ❤️ for students learning secure coding
