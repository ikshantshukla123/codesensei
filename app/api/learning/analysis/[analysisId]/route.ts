import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const { userId } = await auth()
    const { analysisId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        repository: {
          select: {
            name: true,
            userId: true
          }
        }
      }
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    // Check if user owns this analysis
    if (analysis.repository.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
