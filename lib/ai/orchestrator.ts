import { findBugsWithOpenRouter } from './providers/openrouter';
import { explainImpactWithGemini, generateTrinityCards } from './providers/gemini';
import { getDiffContent, postComment } from '@/lib/github/client';
import { prisma, retryDatabaseOperation } from '../prisma';
import '../db-init'; // Initialize database connection

interface PullRequestData {
  owner: string;
  repo: string;
  prNumber: number;
  installationId: number;
  diffUrl: string;
}

export async function analyzePullRequest(data: PullRequestData) {
  console.log(`🚀 Starting Student Code Analysis for PR #${data.prNumber} (${data.owner}/${data.repo})...`);

  try {
    // 1. Fetch Diff
    const diff = await getDiffContent(data.diffUrl, data.installationId);

    // 2. Run AI Bug Detection (DeepSeek via OpenRouter)
    const bugReport = await findBugsWithOpenRouter(diff);

    console.log(`🔍 Found ${bugReport.bugs.length} learning opportunities`);

    // 3. Generate Student-Friendly Summary (Gemini)
    let finalReport = await explainImpactWithGemini(bugReport, diff);

    // 4. Calculate Learning Score (inverse of risk - higher is better)
    const criticalIssues = bugReport.bugs.filter(b => b.severity === "CRITICAL" || b.severity === "HIGH").length;
    const totalIssues = bugReport.bugs.length;

    let riskScore = Math.min(
      (totalIssues * 10) + (criticalIssues * 20),
      100
    );

    const status = riskScore > 70 ? "CRITICAL_ISSUES" : riskScore > 40 ? "NEEDS_REVIEW" : "GREAT_START";

    // 5. Find Repository in DB
    console.log(`🔍 Looking for repo "${data.owner}/${data.repo}" in DB...`);

    const repository = await retryDatabaseOperation(async () => {
      return await prisma.repository.findFirst({
        where: {
          name: {
            equals: `${data.owner}/${data.repo}`,
            mode: 'insensitive'
          }
        }
      });
    });

    if (!repository) {
      console.error(`❌ CRITICAL: Repo "${data.owner}/${data.repo}" NOT found in DB.`);
      console.error("💡 HINT: Student needs to connect their GitHub repository first.");
      return;
    }

    // Self-Heal: Update Installation ID if it changed
    if (repository.installationId !== data.installationId) {
      console.log(`🔄 Updating Installation ID from ${repository.installationId} to ${data.installationId}...`);
      await prisma.repository.update({
        where: { id: repository.id },
        data: { installationId: data.installationId }
      });
    }

    // 6. Save Analysis to Database
    console.log(`💾 Saving Analysis (Learning Score: ${100 - riskScore}, Issues: ${totalIssues})...`);

    const cleanBugs = bugReport.bugs.map((b: any) => ({
      type: b.type || "Issue",
      severity: b.severity || "LOW",
      description: b.description || "No description provided",
      file: b.file || "unknown",
      line: b.line || 0,
      recommendation: b.recommendation || "Review the code carefully"
    }));

    try {
      const analysis = await retryDatabaseOperation(async () => {
        return await prisma.analysis.create({
          data: {
            repositoryId: repository.id,
            prNumber: data.prNumber,
            riskScore: riskScore,
            status: status,
            issuesFound: cleanBugs.length,
            bugs: cleanBugs as any,
          }
        });
      });

      console.log(`✅ SUCCESS: Analysis saved with ID: ${analysis.id}`);

      // 7. Post to GitHub with Learning Dashboard Link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
      const dashboardUrl = `${cleanBaseUrl}/learning/receipt/${analysis.id}`;

      console.log(`📊 Learning Dashboard URL: ${dashboardUrl}`);
      const reportWithLink = `${finalReport}\n\n---\n[📚 Start Learning Journey](${dashboardUrl}) | [💰 View Your Wallet](${cleanBaseUrl}/wallet)`;

      await postComment(data.owner, data.repo, data.prNumber, reportWithLink, data.installationId);

    } catch (dbError) {
      console.error("❌ CRITICAL DATABASE ERROR:", dbError);
      console.error("⚠️ Payload that failed:", JSON.stringify({ riskScore, bugs: cleanBugs }));

      // Fallback: Post comment without link
      await postComment(data.owner, data.repo, data.prNumber, finalReport, data.installationId);
    }

  } catch (error) {
    console.error("🔥 Orchestrator Failed:", error);
  }
}

// Helper to create Trinity Knowledge Cards for student learning
export async function createTrinityCardsForIssue(issueId: string) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId }
    });

    if (!issue) {
      throw new Error('Issue not found');
    }

    // Generate trinity cards using Gemini
    const cards = await generateTrinityCards({
      type: issue.type,
      description: issue.description,
      severity: issue.severity as any,
    });

    // Update issue with trinity card content
    await prisma.issue.update({
      where: { id: issueId },
      data: {
        definition: cards.definition,
        compliance: cards.compliance,
        impact: cards.impact,
      }
    });

    return cards;
  } catch (error) {
    console.error('Error creating trinity cards:', error);
    throw error;
  }
}
