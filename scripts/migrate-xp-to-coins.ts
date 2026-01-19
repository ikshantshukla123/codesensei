// One-time migration script to transfer existing XP to new coins system
// Run this once after deploying the new wallet system

import { prisma } from "@/lib/prisma";

async function migrateXpToCoins() {
  console.log("🔄 Starting XP to Coins migration...");

  // Find all wallets with XP but no coins
  const wallets = await prisma.wallet.findMany({
    where: {
      xp: {
        gt: 0,
      },
    },
  });

  console.log(`Found ${wallets.length} wallets to migrate`);

  let migratedCount = 0;

  for (const wallet of wallets) {
    // Only migrate if coins haven't been set yet
    if (wallet.coins === 0 && wallet.totalEarned === 0) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          coins: wallet.xp, // Transfer XP to current coin balance
          totalEarned: wallet.xp, // Set total earned for leaderboard
        },
      });

      console.log(`✅ Migrated user ${wallet.userId}: ${wallet.xp} XP → ${wallet.xp} coins`);
      migratedCount++;
    }
  }

  console.log(`✨ Migration complete! Migrated ${migratedCount} wallets.`);
}

migrateXpToCoins()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
