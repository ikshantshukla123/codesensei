import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Github, User, Settings, BookOpen, TrendingUp, Code } from 'lucide-react'
import UserSyncComponent from '@/components/UserSyncComponent'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Check if user has GitHub connected
  const githubAccount = user.externalAccounts.find(
    account => account.provider === 'oauth_github'
  )
  const hasGitHub = !!githubAccount

  // Sync user data to database (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/sync`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).catch(err => console.error('Failed to sync user:', err))

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <UserSyncComponent />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName || 'Developer'}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your learning dashboard is ready to transform your code into career capital.
          </p>
        </div>

        {/* GitHub Connection Status */}
        <div className="mb-8">
          <div className={`p-6 rounded-lg border ${
            hasGitHub 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Github className={`h-8 w-8 ${
                  hasGitHub ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {hasGitHub ? 'GitHub Connected ✅' : 'Connect Your GitHub'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasGitHub 
                      ? `Your account is connected via GitHub (@${githubAccount?.username})`
                      : 'Connect your GitHub account to start analyzing your repositories'
                    }
                  </p>
                </div>
              </div>
              {!hasGitHub && (
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                  Connect GitHub
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Career Value</h3>
                <p className="text-2xl font-bold text-green-500">$0</p>
                <p className="text-sm text-gray-500">Start coding to see your impact!</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Code className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Repositories</h3>
                <p className="text-2xl font-bold text-blue-500">0</p>
                <p className="text-sm text-gray-500">No repositories analyzed yet</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Lessons</h3>
                <p className="text-2xl font-bold text-purple-500">0</p>
                <p className="text-sm text-gray-500">Ready to learn from your code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/profile"
            className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-green-600 transition-colors">
                  View Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-75">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Repository Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coming soon - Analyze your code for learning opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        {!hasGitHub && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4">🚀 Getting Started</h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-green-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">1</span>
                <span>Connect your GitHub account to get started</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 text-sm rounded-full flex items-center justify-center font-semibold">2</span>
                <span>Select repositories for analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 text-sm rounded-full flex items-center justify-center font-semibold">3</span>
                <span>Start learning from your code's financial impact</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}   