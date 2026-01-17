import { inngest } from "../client";
import { analyzePullRequest } from "@/lib/ai/orchestrator";
import { prisma } from "@/lib/prisma";

export const processAnalyzePullRequest = inngest.createFunction(
  {
    id: "analyze-pull-request",
    name: "Analyze Student Pull Request",
  },
  { event: "github/pull_request.received" },
  async ({ event, step }) => {
    const { owner, repo, prNumber, installationId, diffUrl, deliveryId } = event.data;

    console.log(`🎓 Processing PR analysis for student: #${prNumber} (${owner}/${repo})`);

    try {
      // Step 1: Run AI Analysis
      await step.run("run-ai-analysis", async () => {
        await analyzePullRequest({
          owner,
          repo,
          prNumber,
          installationId,
          diffUrl,
        });
      });

      // Step 2: Mark webhook as processed
      await step.run("mark-webhook-processed", async () => {
        if (deliveryId) {
          await prisma.webhookLog.update({
            where: { deliveryId },
            data: {
              processed: true,
              processedAt: new Date(),
            },
          });
        }
      });

      console.log(`✅ Student PR analysis completed: #${prNumber}`);
      return { success: true, prNumber };

    } catch (error) {
      console.error(`❌ Student PR analysis failed:`, error);

      // Mark webhook as failed
      if (deliveryId) {
        await prisma.webhookLog.update({
          where: { deliveryId },
          data: {
            processed: false,
            processedAt: new Date(),
            error: error instanceof Error ? error.message : String(error),
          },
        }).catch(console.error);
      }

      throw error;
    }
  }
);
