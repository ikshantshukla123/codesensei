import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [repos, totalReposCount, analysisStats] = await Promise.all([
      // 1. Get recent repositories
      prisma.repository.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          userId: true,
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              riskScore: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),

      // 2. Count total repos
      prisma.repository.count({
        where: { userId }
      }),

      // 3. Get analysis stats
      prisma.analysis.aggregate({
        where: {
          repository: { userId }
        },
        _avg: {
          riskScore: true
        },
        _count: {
          _all: true
        }
      })
    ]);

    // Calculate critical issues (risk score > 80)
    const highRiskCount = await prisma.analysis.count({
      where: {
        repository: { userId },
        riskScore: { gt: 80 }
      }
    });

    const avgRiskScore = Math.round(analysisStats._avg.riskScore || 0);

    return NextResponse.json({
      repositories: repos.map(repo => ({
        ...repo,
        updatedAt: repo.createdAt // Fallback since updatedAt might be missing in select
      })),
      stats: {
        totalRepos: totalReposCount,
        avgRiskScore,
        highRisk: highRiskCount,
        totalAnalyses: analysisStats._count._all
      }
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
