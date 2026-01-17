import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get wallet data
    const wallet = await prisma.wallet.findUnique({
      where: { userId }
    })

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        avatar: true,
        githubUsername: true
      }
    })

    // If wallet doesn't exist, create it
    if (!wallet) {
      const newWallet = await prisma.wallet.create({
        data: {
          userId,
          totalDebtPaid: 0,
          xp: 0,
          badges: []
        }
      })

      return NextResponse.json({
        wallet: newWallet,
        user
      })
    }

    return NextResponse.json({
      wallet,
      user
    })
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
