import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Github, ExternalLink, Zap, Shield, TrendingUp, Code2, Sparkles, ArrowRight, Calendar } from 'lucide-react'
import UserSyncComponent from '@/components/UserSyncComponent'
import { prisma } from '@/lib/prisma'

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

  // Fetch user data and recent repositories from database
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      repositories: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  // Calculate metrics
  const totalRepos = dbUser?.repositories.length || 0
  const walletXP = dbUser?.wallet?.xp || 0
  const debtPaid = dbUser?.wallet?.totalDebtPaid || 0

  // GitHub App installation URL
  const githubAppInstallUrl = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ||
    `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME || 'codesensei'}/installations/new`

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <UserSyncComponent />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-[#262626] pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user.firstName || 'Developer'} 👋
              </h1>
              <p className="text-[#a1a1aa] text-lg">
                Transform your code into career capital
              </p>
            </div>
            <Link
              href="/wallet"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              View Wallet
            </Link>
          </div>
        </div>

        {/* GitHub App Installation */}
        {hasGitHub && (
          <div className="mb-8 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Install CodeSensei GitHub App
                  </h3>
                  <p className="text-sm text-[#a1a1aa]">
                    Connect repositories to enable AI-powered PR analysis • @{githubAccount?.username}
                  </p>
                </div>
              </div>
              <a
                href={githubAppInstallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 group"
              >
                <Zap className="w-5 h-5" />
                Install App
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        )}

        {!hasGitHub && (
          <div className="mb-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Github className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Connect Your GitHub Account
                  </h3>
                  <p className="text-sm text-[#a1a1aa]">
                    Link your GitHub to start analyzing repositories and earning XP
                  </p>
                </div>
              </div>
              <Link
                href="/profile"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                Connect Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-[#a1a1aa] mb-1">Debt Paid</p>
            <p className="text-3xl font-bold text-white">${debtPaid.toFixed(0)}</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-sm text-[#a1a1aa] mb-1">Total XP</p>
            <p className="text-3xl font-bold text-white">{walletXP}</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-[#a1a1aa] mb-1">Repositories</p>
            <p className="text-3xl font-bold text-white">{totalRepos}</p>
          </div>
        </div>

        {/* Recent Repositories */}
        {dbUser?.repositories && dbUser.repositories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Recent Repositories</h2>
            </div>
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl overflow-hidden">
              <div className="divide-y divide-[#262626]">
                {dbUser.repositories.map((repo) => {
                  const latestAnalysis = repo.analyses[0]
                  const riskScore = latestAnalysis?.riskScore || 0
                  const riskColor = riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-yellow-400' : 'text-green-400'

                  return (
                    <Link
                      key={repo.id}
                      href={`/dashboard/${repo.id}`}
                      className="block p-6 hover:bg-[#262626]/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center group-hover:bg-[#333333] transition-colors">
                            <Code2 className="w-5 h-5 text-[#a1a1aa]" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                              {repo.name}
                            </h3>
                            <p className="text-sm text-[#a1a1aa] flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(repo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {latestAnalysis && (
                            <div className="text-right">
                              <p className="text-sm text-[#a1a1aa] mb-1">Latest Risk Score</p>
                              <p className={`text-2xl font-bold ${riskColor}`}>{riskScore}</p>
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-[#a1a1aa] group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!dbUser?.repositories || dbUser.repositories.length === 0) && hasGitHub && (
          <div className="bg-[#1a1a1a] border border-dashed border-[#262626] rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#a1a1aa]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Repositories Yet</h3>
            <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
              Install the GitHub App on your repositories to start receiving AI-powered PR analysis
            </p>
            <a
              href={githubAppInstallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              <Zap className="w-5 h-5" />
              Install GitHub App
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}   