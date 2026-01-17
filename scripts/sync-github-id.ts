import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

async function syncGithubId() {
  try {
    console.log('🔄 Syncing GitHub IDs for all users...\n');

    // Get all users from database
    const dbUsers = await prisma.user.findMany();
    console.log(`Found ${dbUsers.length} users in database\n`);

    for (const dbUser of dbUsers) {
      try {
        // Get user from Clerk
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(dbUser.id);

        // Find GitHub account
        const githubAccount = clerkUser.externalAccounts.find(
          acc => acc.provider === 'oauth_github'
        );

        if ((githubAccount as any)?.providerUserId || (githubAccount as any)?.externalId) {
          const githubId = parseInt((githubAccount as any)?.providerUserId || (githubAccount as any)?.externalId);

          // Update database
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              githubId: githubId,
              githubUsername: githubAccount?.username || null
            }
          });

          console.log(`✅ Updated user ${dbUser.email}:`);
          console.log(`   GitHub ID: ${githubId}`);
          console.log(`   GitHub Username: ${githubAccount?.username}\n`);
        } else {
          console.log(`⚠️  User ${dbUser.email} has no GitHub account connected\n`);
        }
      } catch (error) {
        console.error(`❌ Error syncing user ${dbUser.email}:`, error);
      }
    }

    console.log('✅ Sync complete!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncGithubId();
