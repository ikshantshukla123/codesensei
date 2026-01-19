"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// EARN COINS (with transaction tracking)
// ============================================

export async function earnCoins(params: {
  amount: number;
  reason: string;
  source: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { amount, reason, source } = params;

  // Atomic update: increment coins + create transaction
  const wallet = await prisma.wallet.upsert({
    where: { userId },
    create: {
      userId,
      coins: amount,
      totalEarned: amount,
      xp: amount,
    },
    update: {
      coins: { increment: amount },
      totalEarned: { increment: amount },
      xp: { increment: amount },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      userId,
      type: "EARN",
      amount,
      reason,
      source,
    },
  });

  revalidatePath("/wallet");
  revalidatePath("/dashboard");

  return { success: true, newBalance: wallet.coins + amount };
}

// ============================================
// REDEEM SYSTEM (Spend Coins)
// ============================================

export type RedeemItem = "AI_HINT" | "PREMIUM_LESSON" | "MOCK_INTERVIEW";

const REDEEM_COSTS: Record<RedeemItem, number> = {
  AI_HINT: 50,
  PREMIUM_LESSON: 120,
  MOCK_INTERVIEW: 200,
};

const REDEEM_LABELS: Record<RedeemItem, string> = {
  AI_HINT: "AI Hint Token",
  PREMIUM_LESSON: "Premium Lesson Unlock",
  MOCK_INTERVIEW: "Mock Interview Session",
};

export async function redeemCoins(item: RedeemItem) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const cost = REDEEM_COSTS[item];

  // Get current wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (wallet.coins < cost) {
    throw new Error(`Insufficient coins. You need ${cost} coins but only have ${wallet.coins}.`);
  }

  // Atomic deduction
  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      coins: { decrement: cost },
    },
  });

  // Create SPEND transaction
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      userId,
      type: "SPEND",
      amount: cost,
      reason: `Redeemed: ${REDEEM_LABELS[item]}`,
      source: `REDEEM_${item}`,
    },
  });

  revalidatePath("/wallet");
  revalidatePath("/dashboard");

  return {
    success: true,
    newBalance: updatedWallet.coins,
    item: REDEEM_LABELS[item],
  };
}

// ============================================
// STREAK SYSTEM
// ============================================

export async function updateDailyStreak() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    // Create wallet if doesn't exist
    await prisma.wallet.create({
      data: {
        userId,
        streakCount: 1,
        lastActiveDate: new Date(),
        coins: 10,
        totalEarned: 10,
      },
    });

    await earnCoins({
      amount: 10,
      reason: "Daily login bonus",
      source: "DAILY_STREAK",
    });

    return { streakCount: 1, earnedCoins: 10 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = wallet.lastActiveDate ? new Date(wallet.lastActiveDate) : null;
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  // Already active today
  if (lastActive && lastActive.getTime() === today.getTime()) {
    return { streakCount: wallet.streakCount, earnedCoins: 0 };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = wallet.streakCount;
  let coinsEarned = 10;

  if (lastActive && lastActive.getTime() === yesterday.getTime()) {
    // Continue streak
    newStreak = wallet.streakCount + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  // Update wallet
  await prisma.wallet.update({
    where: { userId },
    data: {
      streakCount: newStreak,
      lastActiveDate: new Date(),
    },
  });

  // Award coins (only once per day)
  await earnCoins({
    amount: coinsEarned,
    reason: `Daily activity streak: Day ${newStreak}`,
    source: "DAILY_STREAK",
  });

  return { streakCount: newStreak, earnedCoins: coinsEarned };
}

// ============================================
// LEADERBOARD
// ============================================

export async function getLeaderboard() {
  const { userId } = await auth();

  // Top 10 users by total earned coins
  const topUsers = await prisma.wallet.findMany({
    take: 10,
    orderBy: [
      { totalEarned: "desc" },
      { streakCount: "desc" },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  // Get current user rank
  let currentUserRank = null;
  if (userId) {
    const userWallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (userWallet) {
      const rank = await prisma.wallet.count({
        where: {
          totalEarned: {
            gt: userWallet.totalEarned,
          },
        },
      });

      currentUserRank = {
        rank: rank + 1,
        user: await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, avatar: true },
        }),
        totalEarned: userWallet.totalEarned,
        streakCount: userWallet.streakCount,
        coins: userWallet.coins,
      };
    }
  }

  return {
    topUsers: topUsers.map((w, index) => ({
      rank: index + 1,
      user: w.user,
      totalEarned: w.totalEarned,
      streakCount: w.streakCount,
      coins: w.coins,
    })),
    currentUser: currentUserRank,
  };
}

// ============================================
// GET TRANSACTION HISTORY
// ============================================

export async function getTransactionHistory(limit = 50) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return transactions;
}

// ============================================
// GET WALLET INFO
// ============================================

export async function getWalletInfo() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!wallet) {
    return null;
  }

  return wallet;
}
