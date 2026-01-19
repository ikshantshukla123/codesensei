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

// Helper function to generate compact GitHub comment table
function generateCompactTable(bugs: any[], dashboardUrl: string) {
  // Take top 3 most critical bugs
  const topBugs = bugs
    .sort((a, b) => (a.severity === 'CRITICAL' ? -1 : 1))
    .slice(0, 3);

  const rows = topBugs.map((bug) => {
    const icon = bug.severity === 'CRITICAL' || bug.severity === 'HIGH' ? '🔴' : '⚠️';
    // Truncate description to keep table tidy
    const desc = bug.description.length > 50 ? bug.description.substring(0, 47) + '...' : bug.description;
    return `| ${icon} **${bug.severity}** | \`${bug.file}\`:${bug.line} | ${desc} |`;
  }).join('\n');

  return `
## 🛡️ CodeSensei Security Report
**${bugs.length} Issues Found** | [View Full Lesson & Fixes](${dashboardUrl})

| Risk | File | Issue |
| :--- | :--- | :--- |
${rows}

> 💡 **Learning Opportunity:** We've generated a personalized lesson for this code.
> [**👉 Click here to Earn XP & Fix these issues**](${dashboardUrl})
`;
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
      // Add an ID to each bug so we can track if it's "learned" later
      id: Math.random().toString(36).substr(2, 9),
      type: b.type || "Issue",
      severity: b.severity || "LOW",
      description: b.description || "No description provided",
      file: b.file || "unknown",
      line: b.line || 0,
      recommendation: b.recommendation || "Review the code carefully",
      // These will be filled by the Dashboard when the user clicks "Learn"
      lessonContent: null,
      claimed: false
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

      // 7. Post Compact Comment to GitHub
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
      const dashboardUrl = `${cleanBaseUrl}/dashboard/scan/${analysis.id}`;

      console.log(`📊 Learning Dashboard URL: ${dashboardUrl}`);

      // Use the new compact generator
      const compactComment = generateCompactTable(cleanBugs, dashboardUrl);

      console.log(`📊 Posting compact comment...`);
      await postComment(data.owner, data.repo, data.prNumber, compactComment, data.installationId);

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
