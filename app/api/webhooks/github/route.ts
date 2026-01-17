import { headers } from 'next/headers';
import { verifySignature } from '@/lib/github/utils';
import { prisma } from '@/lib/prisma';
import { inngest } from '@/lib/inngest/client';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();

    const signature = headersList.get('x-hub-signature-256');
    const event = headersList.get('x-github-event');
    const deliveryId = headersList.get('x-github-delivery');

    console.log(`📥 GitHub Webhook received: ${event} (Delivery: ${deliveryId})`);

    // Check if webhook secret is configured
    if (!process.env.GITHUB_WEBHOOK_SECRET) {
      console.error('❌ GITHUB_WEBHOOK_SECRET not configured in environment variables');
      return new Response('Server configuration error', { status: 500 });
    }

    // 1. VERIFY SIGNATURE FIRST
    if (!signature) {
      console.warn('🚨 No signature header found in webhook request');
      return new Response('Missing signature', { status: 401 });
    }

    const isValid = await verifySignature(process.env.GITHUB_WEBHOOK_SECRET, body, signature);
    if (!isValid) {
      console.warn('🚨 Webhook signature verification failed');
      console.warn(`   Expected secret (first 10 chars): ${process.env.GITHUB_WEBHOOK_SECRET?.substring(0, 10)}...`);
      console.warn(`   Signature received: ${signature?.substring(0, 20)}...`);
      return new Response('Invalid signature', { status: 401 });
    }

    console.log(`✅ Signature verified for ${event}`);

    // 2. IDEMPOTENCY CHECK: Prevent duplicate processing
    if (deliveryId) {
      const existingLog = await prisma.webhookLog.findUnique({
        where: { deliveryId }
      });

      if (existingLog) {
        console.log(`🔄 Duplicate webhook delivery ${deliveryId} - returning 200 OK`);
        return new Response('Already processed', { status: 200 });
      }

      // Create log entry BEFORE processing to block future duplicates
      await prisma.webhookLog.create({
        data: {
          deliveryId,
          event: event || 'unknown',
          meta: { timestamp: new Date().toISOString() } // Store minimal metadata only
        }
      });
    }

    const payload = JSON.parse(body);

    // 3. HANDLE INSTALLATION (Connect Repos to DB)
    if (event === 'installation' || event === 'installation_repositories') {
      const action = payload.action;

      if (action === 'created' || action === 'added') {
        const repositories = payload.repositories || payload.repositories_added;
        const installationId = payload.installation.id;
        const senderGithubId = payload.sender.id;

        console.log(`🔌 Installation ${installationId}: Processing ${repositories.length} repos for GitHub User ${senderGithubId}`);

        // Find the user by GitHub ID
        const user = await prisma.user.findFirst({ where: { githubId: senderGithubId } });

        if (!user) {
          console.error(`❌ User not found for GitHub ID ${senderGithubId}. Student needs to connect GitHub account first.`);
          return new Response('User not found - will sync when GitHub account is connected', { status: 200 });
        }

        // Sync all repositories
        for (const repo of repositories) {
          try {
            await prisma.repository.upsert({
              where: {
                githubRepoId_userId: {
                  githubRepoId: repo.id,
                  userId: user.id
                }
              },
              update: {
                installationId: installationId,
                name: repo.full_name
              },
              create: {
                githubRepoId: repo.id,
                name: repo.full_name,
                installationId: installationId,
                userId: user.id
              }
            });
            console.log(`✅ Synced repository: ${repo.full_name} for student ${user.id}`);
          } catch (error) {
            console.error(`❌ Error syncing repository ${repo.full_name}:`, error);
          }
        }
        return new Response('Repositories Synced', { status: 200 });
      }
    }

    // 4. HANDLE PULL REQUEST (Enqueue for background processing)
    if (event === 'pull_request') {
      if (payload.action === 'opened' || payload.action === 'synchronize') {
        const prData = {
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          prNumber: payload.number,
          installationId: payload.installation.id,
          diffUrl: payload.pull_request.diff_url,
          deliveryId
        };

        try {
          // Enqueue background job with Inngest (FAST RESPONSE)
          await inngest.send({
            name: "github/pull_request.received",
            data: prData
          });

          console.log(`🚀 Student PR analysis job enqueued for #${prData.prNumber} (${prData.owner}/${prData.repo})`);
          return new Response('Analysis job enqueued', { status: 200 });
        } catch (error) {
          console.error('❌ Failed to enqueue PR analysis job:', error);

          // Mark webhook as failed
          if (deliveryId) {
            await prisma.webhookLog.update({
              where: { deliveryId },
              data: {
                processed: false,
                processedAt: new Date(),
                error: error instanceof Error ? error.message : String(error)
              }
            }).catch(console.error);
          }

          return new Response('Failed to enqueue job', { status: 500 });
        }
      }
    }

    return new Response('Event ignored', { status: 200 });

  } catch (error: any) {
    console.error('❌ Webhook processing failed:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
// GET endpoint for testing/healthcheck
export async function GET() {
  return new Response(JSON.stringify({
    status: 'ok',
    endpoint: 'GitHub Webhook Handler',
    configured: !!process.env.GITHUB_WEBHOOK_SECRET,
    message: 'This endpoint only accepts POST requests from GitHub webhooks'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}