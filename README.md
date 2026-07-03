# CodeSensei

> Turn every pull request into a security lesson.

CodeSensei is an AI-powered learning platform that reviews students' GitHub pull requests, finds security vulnerabilities in their real code, and turns each one into a short, personalized lesson — complete with a real-world breach example and a corrected version of the code. Progress is gamified with coins, streaks, and a leaderboard to keep people coming back.

The idea started from a simple observation: most students learn about SQL injection or weak password hashing from slides, then never recognize the same bug in their own projects. CodeSensei closes that gap by teaching security *inside the workflow developers already use*.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-teal?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-purple?style=flat-square&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Live demo:** [codesensai.vercel.app](https://codesensai.vercel.app) · **Walkthrough:** [YouTube](https://youtu.be/KcyJXRaWTvA)

---

## How it works

```mermaid
graph LR
    A[Student opens PR] -->|webhook| B[Next.js API route]
    B -->|enqueue, returns instantly| C[Inngest background job]
    C --> D[Fetch diff via GitHub API]
    D --> E[AI bug detection]
    E --> F[Impact summary - Gemini]
    F --> G[(PostgreSQL)]
    G --> H[Comment posted on PR]
    H -->|student clicks| I[Dashboard lesson]
    I --> J[Fix + earn coins]
    J --> K[Leaderboard]
```

1. A student opens or updates a pull request in a repo where the CodeSensei GitHub App is installed.
2. The webhook responds immediately and offloads the heavy work to a background queue (Inngest), so GitHub never hits its 10-second webhook timeout.
3. The background job pulls the diff, runs AI vulnerability detection, and generates a plain-English impact summary.
4. Results are saved and posted back as a comment on the PR with a link to the dashboard.
5. On the dashboard, each finding can be expanded into a full lesson. Fixing bugs and completing lessons earns coins, builds streaks, and moves the student up the leaderboard.

---

## Features

**AI Professor Mode.** Every vulnerability can be turned into a structured lesson: the concept explained with a plain-language analogy, a line-by-line breakdown of *why* the code is unsafe, a real historical breach that started the same way (Equifax, TalkTalk, etc.), and the corrected code. Lessons are generated with Gemini 2.5 Flash and cached in the database.

**Automatic PR analysis.** The GitHub App watches for new and updated pull requests, scores each one for risk, and posts a security summary as a comment — no manual review needed.

**Career Wallet.** A gamified coin system. Students earn coins for fixing bugs (weighted by severity) and maintaining daily streaks, and spend them on things like AI hints and mock-interview sessions. Every coin movement is recorded as an immutable transaction, so balances are auditable and free of race conditions.

**Leaderboard.** Global rankings by total coins earned, with streaks as a tiebreaker and the current user's position highlighted.

**Interactive lessons.** A scroll-spy sidebar (inspired by the Stripe and Vercel docs) tracks which section you're reading and lets you jump between modules, with syntax-highlighted before/after code.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Server Components + Server Actions in one codebase |
| Language | TypeScript 5 | End-to-end type safety with Prisma |
| Styling | Tailwind CSS 4 + Framer Motion | Fast iteration, smooth animations |
| Auth | Clerk | Social login + GitHub OAuth out of the box |
| Database | PostgreSQL (Neon) | Serverless Postgres that scales to zero |
| ORM | Prisma | Type-safe schema and queries |
| Background jobs | Inngest | Event-driven queue with retries and a job dashboard |
| AI | Google Gemini 2.5 Flash | Lesson generation and impact summaries |
| GitHub | Octokit + GitHub App | Webhooks and PR comments |

### A few decisions worth calling out

- **Background queue over synchronous webhooks.** AI analysis takes 20–30 seconds, well past GitHub's webhook timeout. Moving the work to Inngest lets the webhook return instantly and gives automatic retries if a job fails.
- **Atomic coin transactions.** Rather than mutating a balance directly, every earn/spend writes a transaction row and updates the wallet in a single operation — no lost updates, and a full audit trail for free.
- **Resilient AI calls.** Gemini requests retry with exponential backoff and fall back to a friendly message, so a transient 503 during peak hours doesn't break a lesson.

---

## Project structure

```
app/
├── (main)/          # Public marketing pages (navbar + footer)
├── dashboard/       # Authenticated area: scans, lessons, leaderboard
└── api/
    ├── webhooks/    # GitHub PR events + Clerk user sync
    └── inngest/     # Background job endpoint

lib/
├── ai/              # AI orchestration + providers
├── github/          # Octokit client + webhook signature verification
├── wallet/          # Coin earning/spending logic
├── inngest/         # Queue client + analyzePullRequest job
└── prisma.ts        # Database client

prisma/schema.prisma # Data models
```

### Core data model

```prisma
model User {
  id           String @id        // Clerk ID
  githubUsername String?
  repositories Repository[]
  wallet       Wallet?
}

model Analysis {
  id        String @id @default(cuid())
  prNumber  Int
  riskScore Int                  // 0–100
  bugs      Json                 // detected vulnerabilities
  status    String               // "PASS" | "FAIL"
}

model Wallet {
  coins        Int @default(0)
  totalEarned  Int @default(0)   // drives the leaderboard
  streakCount  Int @default(0)
  transactions Transaction[]
}

model Transaction {
  type   String                  // "EARN" | "SPEND"
  amount Int
  reason String
  source String                  // "BUG_FIX", "DAILY_STREAK", ...
}
```

---

## Running locally

**Prerequisites:** Node.js 20+, a PostgreSQL database (Neon works well), a GitHub App, and API keys for Clerk, Gemini, and Inngest.

```bash
git clone https://github.com/ikshantshukla123/codesensai.git
cd codesensai
npm install
```

Create a `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db?sslmode=require"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# GitHub App
GITHUB_APP_ID="123456"
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_CLIENT_ID="Iv1...."
GITHUB_CLIENT_SECRET="..."
GITHUB_WEBHOOK_SECRET="..."
NEXT_PUBLIC_GITHUB_APP_INSTALL_URL="https://github.com/apps/your-app/installations/new"

# AI
GEMINI_API_KEY="AIza..."

# Inngest
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="signkey-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Set up the database and start the app:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

For background jobs, run the Inngest dev server in a second terminal, and use ngrok to tunnel GitHub webhooks to your machine:

```bash
npx inngest-cli@latest dev      # job dashboard at http://localhost:8288
ngrok http 3000                 # point your GitHub App webhook at this URL
```

When creating the GitHub App, grant **Contents: Read-only** and **Pull requests: Read & Write**, and subscribe to the `pull_request`, `installation`, and `installation_repositories` events.

---

## Screenshots

| AI Professor Mode | Career Wallet |
|---|---|
| ![Lesson page](./public/lesson.png) | ![Wallet](./public/wallet.png) |

| Leaderboard | Dashboard |
|---|---|
| ![Leaderboard](./public/leaderboard.png) | ![Dashboard](./public/dashboard.png) |

---

## Status

Working today: GitHub PR analysis, AI lesson generation, the Career Wallet and transaction system, and the leaderboard. The redeem flow has its UI and server action built and is being wired up to reward delivery. Planned next: team learning mode, achievement badges, and a VS Code extension for in-editor hints.

---

## License

MIT — see [LICENSE](LICENSE).
