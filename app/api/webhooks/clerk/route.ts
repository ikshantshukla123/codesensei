import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { syncRepositoriesForUser } from '@/lib/github/client'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('❌ Missing CLERK_WEBHOOK_SECRET in .env')
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify the payload
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  // Handle the Event
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url, external_accounts } = evt.data;

    // 1. Get the best possible name
    const primaryName = first_name
      ? `${first_name} ${last_name || ''}`.trim()
      : username;

    // 2. Extract GitHub ID safely - Webhook payload uses snake_case (provider_user_id)
    const githubAccount = external_accounts?.find((acc: any) => acc.provider === 'oauth_github');
    const githubUsername = githubAccount?.username || null;
    // Try both snake_case (webhook) and camelCase (just in case)
    const rawGithubId = githubAccount?.provider_user_id || githubAccount?.providerUserId;
    const githubId = rawGithubId ? parseInt(rawGithubId) : null;

    try {
      // 3. Check for existing user to determine if this is a new GitHub connection
      const existingUser = await prisma.user.findUnique({ where: { id: id } });
      const isNewGithubConnection = !existingUser?.githubId && githubId !== null;

      // Check for duplicate email with different user ID
      const userWithEmail = await prisma.user.findUnique({
        where: { email: email_addresses[0].email_address }
      });

      // If email exists with different ID, clean up the old user
      if (userWithEmail && userWithEmail.id !== id) {
        console.log(`⚠️  Cleaning up duplicate user with email ${email_addresses[0].email_address}`);
        await prisma.user.delete({ where: { id: userWithEmail.id } }).catch(e => {
          console.error('Error deleting duplicate user:', e);
        });
      }

      // 4. UPSERT user
      await prisma.user.upsert({
        where: { id: id },
        update: {
          email: email_addresses[0].email_address,
          name: primaryName,
          avatar: image_url,
          githubUsername,
          githubId
        },
        create: {
          id: id,
          email: email_addresses[0].email_address,
          name: primaryName || 'Unknown User',
          avatar: image_url,
          githubUsername,
          githubId
        }
      });
      console.log(`✅ Synced User: ${primaryName} (GitHub ID: ${githubId}, Username: ${githubUsername})`);

      // 5. Initialize wallet
      await prisma.wallet.upsert({
        where: { userId: id },
        update: {},
        create: {
          userId: id,
          totalDebtPaid: 0,
          xp: 0,
          badges: []
        }
      });

      // 6. If this is a new GitHub connection, sync repositories in background
      if (isNewGithubConnection && githubId !== null) {
        console.log(`🔄 New GitHub connection detected, syncing repositories...`);
        syncRepositoriesForUser(id, githubId).catch(error => {
          console.error('❌ Background repository sync failed:', error);
        });
      }

    } catch (dbError) {
      console.error('❌ Database Sync Error:', dbError);
      console.error('Error details:', dbError);
      return new Response(JSON.stringify({
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await prisma.user.delete({
        where: { id: id || '' }
      });
      console.log(`✅ Deleted user: ${id}`);
    } catch (dbError) {
      console.error('❌ User deletion error:', dbError);
      return new Response('Database error', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 })
}
