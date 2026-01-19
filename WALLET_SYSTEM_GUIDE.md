# Career Wallet System - Database Migration Guide

## ✅ What Was Implemented

### 1. Database Schema Updates (`prisma/schema.prisma`)
- Added `coins`, `totalEarned`, `streakCount`, `lastActiveDate` to `Wallet` model
- Created new `Transaction` model for coin history tracking

### 2. Server Actions (`lib/wallet/actions.ts`)
- `earnCoins()` - Award coins with transaction tracking
- `redeemCoins()` - Spend coins on rewards
- `updateDailyStreak()` - Track daily activity streaks
- `getLeaderboard()` - Fetch top users and current user rank
- `getTransactionHistory()` - Get user's coin history
- `getWalletInfo()` - Fetch complete wallet data

### 3. UI Components
- `components/CareerWalletClient.tsx` - Full wallet UI with redeem store
- `app/(main)/wallet/page.tsx` - Wallet page (updated)
- `app/dashboard/leaderboard/page.tsx` - Leaderboard page

### 4. Integration
- Updated `app/dashboard/scan/[id]/page.tsx` to use transaction system
- Integrated streak tracking on bug fixes

## 🚀 How to Deploy

### Step 1: Run Database Migration
```bash
cd /Users/ikshantshukla/dev/sensaii/codesensai
npx prisma db push
```

This will:
- Add new columns to `wallets` table
- Create new `transactions` table
- Preserve existing data

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## 📊 New Database Schema

### Wallet Model (Updated)
```prisma
model Wallet {
  id             String        @id @default(cuid())
  userId         String        @unique
  totalDebtPaid  Float         @default(0)
  xp             Int           @default(0)
  coins          Int           @default(0)        // NEW
  totalEarned    Int           @default(0)        // NEW
  streakCount    Int           @default(0)        // NEW
  lastActiveDate DateTime?                         // NEW
  badges         Json          @default("[]")
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  user           User          @relation(...)
  transactions   Transaction[] // NEW relation
}
```

### Transaction Model (New)
```prisma
model Transaction {
  id        String   @id @default(cuid())
  walletId  String
  userId    String
  type      String   // "EARN" | "SPEND"
  amount    Int
  reason    String
  source    String   // "BUG_FIX", "LESSON_COMPLETION", "DAILY_STREAK", etc.
  createdAt DateTime @default(now())
  wallet    Wallet   @relation(...)
}
```

## 🎮 Features Overview

### 1. Earn Coins
- Fix bugs: 5-50 coins (based on severity)
- Complete lessons: tracked automatically
- Daily activity: +10 coins/day

### 2. Spend Coins (Redeem Store)
- AI Hint Token: 50 coins
- Premium Lesson Unlock: 120 coins
- Mock Interview Session: 200 coins

### 3. Streak System
- +1 streak for daily activity
- Resets if user misses 1 day
- Bonus coins for consistency

### 4. Leaderboard
- Ranked by total coins earned
- Shows top 10 users
- Displays your current rank

## 📍 New Routes

1. `/wallet` - Full wallet management page
2. `/dashboard/leaderboard` - Global leaderboard

## 🔗 Integration Points

### Where Coins Are Earned:
1. **Bug Fixes** - `app/dashboard/scan/[id]/page.tsx`
   - Uses `earnCoins()` and `updateDailyStreak()`

2. **Future Integration Points** (ready to use):
   ```typescript
   import { earnCoins, updateDailyStreak } from "@/lib/wallet/actions";
   
   // Earn coins for any activity
   await earnCoins({
     amount: 30,
     reason: "Completed advanced lesson",
     source: "LESSON_COMPLETION"
   });
   
   // Update streak (once per day)
   await updateDailyStreak();
   ```

### Where Coins Are Spent:
- `/wallet` page - Redeem store UI

## ⚠️ Important Notes

1. **Atomic Operations**: All coin transactions are atomic (no race conditions)
2. **Negative Balance Prevention**: Built-in validation prevents negative balances
3. **Transaction History**: Every coin movement is logged
4. **Streak Logic**: Only updates once per day automatically

## 🧪 Testing Checklist

- [ ] Run `npx prisma db push` successfully
- [ ] Visit `/wallet` page
- [ ] Fix a bug and verify coins are added
- [ ] Check transaction history appears
- [ ] Try redeeming with insufficient coins (should fail)
- [ ] Redeem with sufficient coins (should work)
- [ ] Visit `/dashboard/leaderboard`
- [ ] Check streak increments daily

## 🎯 Next Steps (Optional Enhancements)

1. Add WebSocket for real-time leaderboard updates
2. Add badges/achievements system
3. Create coin purchase flow (monetization)
4. Add referral bonuses
5. Implement seasonal leaderboards

---

**Status**: ✅ Ready for deployment
**Estimated Migration Time**: 2-3 minutes
**Risk Level**: Low (only additive changes, preserves existing data)
