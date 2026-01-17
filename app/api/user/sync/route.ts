import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { syncRepositoriesForUser } from '@/lib/github/client'

export async function POST() {
  try {
    // Check if user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user data from Clerk
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Extract user information
    const email = user.emailAddresses[0]?.emailAddress
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || null
    const avatar = user.imageUrl

    // Get GitHub account info if available
    const githubAccount = user.externalAccounts.find(
      account => account.provider === 'oauth_github'
    )

    // DEBUG: Log keys to see what is actually available
    if (githubAccount) {
      console.log('🔍 Debug: GitHub Account Keys:', Object.keys(githubAccount));
      console.log('🔍 Debug: GitHub Account values (partial):', JSON.stringify({
        ...githubAccount,
        verification: 'omitted'
      }, null, 2));
    } else {
      console.log('❌ Debug: No GitHub account found in externalAccounts');
    }

    const githubUsername = githubAccount?.username || null

    // Check for provider user ID (handle both camelCase and snake_case just in case)
    // IMPORTANT FIX: Clerk's `currentUser` object uses `externalId` for the provider's user ID (GitHub ID)
    const rawGithubId = (githubAccount as any)?.providerUserId || (githubAccount as any)?.provider_user_id || (githubAccount as any)?.externalId;
    console.log(`🔍 Debug: rawGithubId found: ${rawGithubId}`);

    const githubId = rawGithubId ? parseInt(rawGithubId) : null;

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 })
    }

    // Check if email is already used by a different user
    const userWithEmail = await prisma.user.findUnique({ where: { email } });
    if (userWithEmail && userWithEmail.id !== userId) {
      console.log(`⚠️  Email ${email} exists with different ID, cleaning up...`);
      await prisma.user.delete({ where: { id: userWithEmail.id } });
    }

    // Upsert user in database
    const dbUser = await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {
        email,
        name,
        avatar,
        githubUsername,
        githubId,
      },
      create: {
        id: userId,
        email,
        name,
        avatar,
        githubUsername,
        githubId,
      },
    })

    // If GitHub is connected and we have a GitHub ID, sync repositories
    if (githubId) {
      console.log(`🔄 Syncing repositories for student ${userId} (GitHub ID: ${githubId})`);
      // Run sync in background - don't block the response
      syncRepositoriesForUser(userId, githubId).catch(error => {
        console.error('Background repository sync failed:', error);
      });
    }

    // Initialize wallet if it doesn't exist (handle race conditions gracefully)
    try {
      await prisma.wallet.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          totalDebtPaid: 0,
          xp: 0,
          badges: [],
        },
      });
    } catch (e) {
      // Ignore unique constraint violation if wallet was created by webhook logic
      if ((e as any).code !== 'P2002') {
        console.error('Wallet creation error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      user: dbUser,
      githubConnected: !!githubId
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for checking sync status
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        repositories: true,
      }
    })

    return NextResponse.json({
      synced: !!dbUser,
      user: dbUser,
      githubConnected: !!dbUser?.githubId,
      repositoryCount: dbUser?.repositories.length || 0
    })

  } catch (error) {
    console.error('Error checking sync status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}