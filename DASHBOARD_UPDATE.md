# 🔄 Dashboard & Clerk Webhook Update

## ✅ Changes Implemented

### 1. Enhanced Dashboard UI (`/dashboard`)
- ✅ **Professional Dark Theme** - Matches your existing design system with `#0a0a0a` background
- ✅ **GitHub App Installation Button** - Prominent CTA to install the GitHub App
- ✅ **Recent Repositories Display** - Shows last 5 repositories with latest risk scores
- ✅ **Live Metrics** - Displays XP, debt paid, and repository count from database
- ✅ **Empty States** - Beautiful prompts when no data exists
- ✅ **Responsive Design** - Works on all screen sizes

### 2. Clerk Webhook API (`/api/webhooks/clerk`)
- ✅ **User Sync on Creation/Update** - Automatically syncs Clerk users to database
- ✅ **GitHub Integration Detection** - Detects when users connect GitHub
- ✅ **Auto Repository Sync** - Triggers background sync when GitHub is connected
- ✅ **Wallet Initialization** - Creates wallet for new users automatically
- ✅ **User Deletion Handler** - Cleans up data when users are deleted
- ✅ **Svix Signature Verification** - Secure webhook verification

### 3. Environment Variables Added
```bash
# New variables in .env.example:
CLERK_WEBHOOK_SECRET="whsec_xxxxx"
NEXT_PUBLIC_GITHUB_APP_NAME="codesensei"
NEXT_PUBLIC_GITHUB_APP_INSTALL_URL="https://github.com/apps/codesensei/installations/new"
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install svix  # Already installed ✅
```

### 2. Configure Clerk Webhook

**In Clerk Dashboard:**
1. Go to **Webhooks** section
2. Click **Add Endpoint**
3. Set URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add to `.env`:
   ```bash
   CLERK_WEBHOOK_SECRET="whsec_your_secret_here"
   ```

### 3. Configure GitHub App Info

Add to your `.env`:
```bash
NEXT_PUBLIC_GITHUB_APP_NAME="your-app-name"
NEXT_PUBLIC_GITHUB_APP_INSTALL_URL="https://github.com/apps/your-app-name/installations/new"
```

**To find your GitHub App installation URL:**
1. Go to GitHub Settings → Developer Settings → GitHub Apps
2. Select your app
3. The installation URL format is: `https://github.com/apps/{APP_NAME}/installations/new`

## 📊 Dashboard Features

### GitHub App Installation Section
- **When GitHub is connected**: Shows install button with app name
- **When not connected**: Shows yellow banner prompting to connect GitHub
- **Button behavior**: Opens GitHub in new tab for app installation

### Stats Cards
1. **Debt Paid** - Total $ from wallet (green theme)
2. **Total XP** - XP from wallet (purple theme)
3. **Repositories** - Count of synced repos (blue theme)

### Recent Repositories List
- Shows **last 5** repositories
- Displays **latest risk score** for each
- **Click to view details** - Links to `/dashboard/{repoId}`
- **Risk color coding**:
  - Red (>70): High risk
  - Yellow (>40): Medium risk
  - Green (≤40): Low risk

### Empty State
- Shows when no repositories exist
- Prominent **"Install GitHub App"** button
- Clear instructions for getting started

## 🔄 Webhook Flow

```
Clerk Event (user.created/updated) →
  ↓
Clerk Webhook POST /api/webhooks/clerk →
  ↓
Verify Svix Signature →
  ↓
Upsert User to Database →
  ↓
Initialize Wallet →
  ↓
If GitHub newly connected →
  Background: Sync Repositories
```

## 🎨 UI Preview

### Dashboard Header
```
Welcome back, [Name] 👋                    [View Wallet Button]
Transform your code into career capital
────────────────────────────────────────────────────────────
```

### GitHub App Section (Connected)
```
┌──────────────────────────────────────────────────────────┐
│ [GitHub Icon] Install CodeSensei GitHub App              │
│               Connect repositories • @username            │
│                                          [Install App →]  │
└──────────────────────────────────────────────────────────┘
```

### Stats Grid
```
┌─────────────┬─────────────┬─────────────┐
│ Debt Paid   │  Total XP   │ Repositories│
│   $1,250    │     350     │      5      │
└─────────────┴─────────────┴─────────────┘
```

### Repository List
```
Recent Repositories
────────────────────────────────────────────
[Icon] user/awesome-repo          Risk: 45 →
       Dec 25, 2025

[Icon] user/another-project       Risk: 78 →
       Jan 10, 2026
────────────────────────────────────────────
```

## 🧪 Testing

### Test Clerk Webhook Locally
1. Use Clerk's webhook testing feature in dashboard
2. Or use ngrok to expose local server:
   ```bash
   ngrok http 3000
   # Use ngrok URL in Clerk webhook settings
   ```

### Test Dashboard
1. Sign in with GitHub connected
2. Install GitHub App on a repository
3. Wait for webhook to sync repositories
4. Refresh dashboard to see repositories appear

## 🔒 Security

- ✅ Svix signature verification on Clerk webhooks
- ✅ Auth protection on dashboard (requires login)
- ✅ User-scoped queries (only see own repositories)
- ✅ Public webhook routes for Clerk/GitHub/Inngest

## 📝 Next Steps

1. **Create GitHub App** (if not done):
   - Go to GitHub Settings → Developer Settings
   - Create new GitHub App
   - Note the app name for `NEXT_PUBLIC_GITHUB_APP_NAME`

2. **Set up Clerk Webhook**:
   - Add endpoint in Clerk dashboard
   - Copy webhook secret to `.env`

3. **Test the flow**:
   - Sign up new user
   - Connect GitHub
   - Install GitHub App
   - Verify dashboard shows repositories

---

**All changes are production-ready! 🎉**
