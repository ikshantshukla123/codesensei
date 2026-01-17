import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { analysisId, bugIndex } = await req.json()

    // Fetch the analysis
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        repository: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    // Check ownership
    if (analysis.repository.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the bug details
    const bugs = analysis.bugs as any[]
    const bug = bugs[bugIndex]

    if (!bug) {
      return NextResponse.json({ error: 'Bug not found' }, { status: 404 })
    }

    // Calculate XP and debt amount based on severity
    const severity = bug.severity || 'LOW'
    const debtAmount = severity === 'CRITICAL' ? 500 : severity === 'HIGH' ? 200 : severity === 'MEDIUM' ? 75 : 25
    const xpGained = severity === 'CRITICAL' ? 100 : severity === 'HIGH' ? 50 : severity === 'MEDIUM' ? 25 : 10

    // Update wallet
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      update: {
        totalDebtPaid: {
          increment: debtAmount
        },
        xp: {
          increment: xpGained
        }
      },
      create: {
        userId,
        totalDebtPaid: debtAmount,
        xp: xpGained,
        badges: []
      }
    })

    // Check for badge unlocks
    const badges = wallet.badges as any[]
    const newBadges = []

    // First Fix Badge
    if (wallet.xp >= 10 && !badges.some(b => b.id === 'first-fix')) {
      newBadges.push({
        id: 'first-fix',
        name: 'First Fix',
        description: 'Fixed your first security issue',
        icon: '🎯',
        earnedAt: new Date().toISOString()
      })
    }

    // Security Apprentice (5 fixes)
    if (wallet.totalDebtPaid >= 125 && !badges.some(b => b.id === 'apprentice')) {
      newBadges.push({
        id: 'apprentice',
        name: 'Security Apprentice',
        description: 'Fixed 5+ security issues',
        icon: '🛡️',
        earnedAt: new Date().toISOString()
      })
    }

    // Bug Hunter (10 fixes)
    if (wallet.totalDebtPaid >= 250 && !badges.some(b => b.id === 'bug-hunter')) {
      newBadges.push({
        id: 'bug-hunter',
        name: 'Bug Hunter',
        description: 'Fixed 10+ security issues',
        icon: '🏹',
        earnedAt: new Date().toISOString()
      })
    }

    // Security Champion (Critical issue fixed)
    if (severity === 'CRITICAL' && !badges.some(b => b.id === 'champion')) {
      newBadges.push({
        id: 'champion',
        name: 'Security Champion',
        description: 'Fixed a critical security vulnerability',
        icon: '🏆',
        earnedAt: new Date().toISOString()
      })
    }

    // Update wallet with new badges
    if (newBadges.length > 0) {
      await prisma.wallet.update({
        where: { userId },
        data: {
          badges: [...badges, ...newBadges]
        }
      })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        ...wallet,
        badges: [...badges, ...newBadges]
      },
      newBadges,
      xpGained,
      debtPaid: debtAmount
    })
  } catch (error) {
    console.error('Error marking bug as fixed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
