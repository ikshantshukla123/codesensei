import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Mail, Calendar, ArrowLeft } from 'lucide-react'

export default async function ProfilePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Get user from database
  let dbUser = null
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: userId }
    })
  } catch (error) {
    console.error('Error fetching user from database:', error)
  }

  // Extract user information
  const email = user.emailAddresses[0]?.emailAddress
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User'
  const avatar = user.imageUrl
  const createdAt = user.createdAt
  
  // Get GitHub username if available from external accounts
  const githubAccount = user.externalAccounts.find(
    account => account.provider === 'oauth_github'
  )
  const githubUsername = githubAccount?.username

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={avatar}
                  alt={name}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-green-100 text-lg">CodeSensei Learner</p>
                {githubUsername && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Github className="h-4 w-4" />
                    <span className="text-green-100">@{githubUsername}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Account Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-foreground">{email || 'No email provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                        <p className="text-foreground">
                          {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Recently joined'}
                        </p>
                      </div>
                    </div>

                    {githubUsername && (
                      <div className="flex items-center space-x-3">
                        <Github className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">GitHub</p>
                          <a 
                            href={`https://github.com/${githubUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            @{githubUsername}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Learning Progress</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Career Value Generated</span>
                        <span className="text-2xl font-bold text-green-500">$0</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Repositories Analyzed</span>
                        <span className="text-2xl font-bold text-blue-500">0</span>
                      </div>
                      <p className="text-xs text-gray-500">Connect GitHub to start analyzing</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Security Lessons Learned</span>
                        <span className="text-2xl font-bold text-purple-500">0</span>
                      </div>
                      <p className="text-xs text-gray-500">Start coding to unlock lessons</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Sync Status */}
            {dbUser && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✅ Profile synced to database on {new Date(dbUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  Back to Dashboard
                </Link>
                {!githubUsername && (
                  <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-foreground font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                    Connect GitHub
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}