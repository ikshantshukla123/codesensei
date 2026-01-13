import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
    
    // Get GitHub username if available from external accounts
    const githubAccount = user.externalAccounts.find(
      account => account.provider === 'oauth_github'
    )
    const githubUsername = githubAccount?.username || null

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 })
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
      },
      create: {
        id: userId,
        email,
        name,
        avatar,
        githubUsername,
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: dbUser 
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
      where: { id: userId }
    })

    return NextResponse.json({ 
      synced: !!dbUser,
      user: dbUser 
    })
    
  } catch (error) {
    console.error('Error checking sync status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}