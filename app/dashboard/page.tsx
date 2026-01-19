import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Github, Zap, Shield, Sparkles, ArrowRight, GitBranch, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Button } from "@/components/ui/Button";

// ----------------------------------------------------------------------
// UI Components (Inline for simplicity, typically separate files)
// ----------------------------------------------------------------------

function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function CareerWallet({ totalDebtPaid, xp }: { totalDebtPaid: number, xp: number }) {
  return (
    <div className="bg-gradient-to-r from-[#111111] to-[#0a0a0a] border border-[#262626] rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Sparkles className="w-32 h-32 text-white" />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div>
          <h2 className="text-[#737373] uppercase tracking-wider text-xs font-semibold mb-2">Career Wallet ™</h2>
          <div className="flex items-baseline gap-4">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                ${totalDebtPaid.toLocaleString()}
              </p>
              <p className="text-emerald-500 text-sm mt-1 font-mono">LIABILITY SAVED</p>
            </div>
            <div className="pl-6 border-l border-[#262626]">
              <p className="text-2xl font-bold text-white">{xp.toLocaleString()}</p>
              <p className="text-purple-500 text-sm mt-1 font-mono">TOTAL XP</p>
            </div>
          </div>
        </div>
        <Link href="/wallet">
          <Button variant="secondary" className="border border-[#404040]">
            View History
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ConnectGitHubState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-[#111111] rounded-2xl border border-[#262626] flex items-center justify-center mb-8 relative group">
        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <Github className="w-10 h-10 text-white relative z-10" />
      </div>

      <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
        Authenticate System
      </h1>
      <p className="text-[#a1a1aa] text-lg max-w-md mb-8 leading-relaxed">
        Connect your GitHub repositories to initialize the <span className="text-green-500 font-mono">CodeSensei</span> security protocol.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href={process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="primary" className="w-full h-12">
            <Zap className="w-4 h-4 mr-2" /> Grant Permission
          </Button>
        </a>
      </div>

      <p className="text-[#525252] text-xs mt-8 font-mono">
        SECURE CONNECTION • READ-ONLY ACCESS • 256-BIT ENCRYPTION
      </p>
    </div>
  )
}

// ----------------------------------------------------------------------
// Main Dashboard Component (Server)
// ----------------------------------------------------------------------

export default async function DashboardPage() {
  // 1. Auth Check (Server-Side)
  // Note: auth() returns { userId }
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // 2. Fetch or create user in Prisma
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      repositories: {
        orderBy: { createdAt: 'desc' },
        include: {
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      wallet: true
    }
  })

  // 3. Handle User Not Found - Create or update user instead of redirecting
  if (!user) {
    // Get user info from Clerk
    const clerkUser = await currentUser()
    if (!clerkUser) redirect('/sign-in')

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress || ''

    // Check if user exists by email (might have been created by webhook with different ID)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (existingUserByEmail) {
      // Update the user's Clerk ID if it changed
      user = await prisma.user.update({
        where: { email: userEmail },
        data: {
          id: userId,
          name: clerkUser.fullName || clerkUser.username || existingUserByEmail.name,
          githubUsername: clerkUser.username || existingUserByEmail.githubUsername,
        },
        include: {
          repositories: {
            orderBy: { createdAt: 'desc' },
            include: {
              analyses: {
                take: 1,
                orderBy: { createdAt: 'desc' }
              }
            }
          },
          wallet: true
        }
      })
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail,
          name: clerkUser.fullName || clerkUser.username || 'User',
          githubUsername: clerkUser.username || null,
        },
        include: {
          repositories: {
            orderBy: { createdAt: 'desc' },
            include: {
              analyses: {
                take: 1,
                orderBy: { createdAt: 'desc' }
              }
            }
          },
          wallet: true
        }
      })
    }
  }

  // 4. Logic: Is Installed? (Condition B)
  // We explicitly check if repositories exist as a proxy for installation
  // OR if we assume installing the app immediately adds repos.
  // The prompt says: "If user.installationId EXISTS". Since we don't have that field, we use repository existence.
  const isInstalled = user.repositories.length > 0;

  // --------------------------------------------------------------------
  // RENDER: CONDITION A (NOT INSTALLED)
  // --------------------------------------------------------------------
  if (!isInstalled) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] selection:bg-green-500/30">
        <ConnectGitHubState />
      </div>
    )
  }

  // --------------------------------------------------------------------
  // RENDER: CONDITION B (INSTALLED / MAIN DASHBOARD)
  // --------------------------------------------------------------------

  // Calculate specific risk metrics
  const totalRepos = user.repositories.length
  const criticalRepos = user.repositories.filter(r => {
    const score = r.analyses[0]?.riskScore || 0
    return score > 80
  }).length

  const userStatus = criticalRepos > 0 ? "WARNING" : "OPTIMAL";
  const statusColor = criticalRepos > 0 ? "text-red-500" : "text-emerald-500";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 pb-20">

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Security Command</h1>
            <p className="text-[#737373] mt-2 font-mono text-sm">
              OPERATOR: {user.name?.toUpperCase() || 'UNKNOWN'} • ID: {user.id.slice(0, 8)}
            </p>
          </div>
          <a href={process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "#"} target='_blank'>
            <Button variant="outline">
              <PlusIcon className="w-4 h-4 mr-2" /> Add Repository
            </Button>
          </a>
        </div>

        {/* FEATURE 4: THE CAREER WALLET */}
        <CareerWallet
          totalDebtPaid={user.wallet?.totalDebtPaid || 0}
          xp={user.wallet?.xp || 0}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <PremiumCard>
            <div className="flex items-center gap-3 mb-4 text-[#737373]">
              <GitBranch className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Active Repos</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalRepos}</p>
          </PremiumCard>

          <PremiumCard className={criticalRepos > 0 ? "border-red-900/30 bg-red-950/10" : ""}>
            <div className="flex items-center gap-3 mb-4 text-[#737373]">
              <AlertTriangle className={`w-5 h-5 ${criticalRepos > 0 ? "text-red-500" : ""}`} />
              <span className={`text-sm font-medium uppercase tracking-wider ${criticalRepos > 0 ? "text-red-400" : ""}`}>Critical Risks</span>
            </div>
            <p className={`text-3xl font-bold ${criticalRepos > 0 ? "text-red-500" : "text-white"}`}>{criticalRepos}</p>
          </PremiumCard>

          <PremiumCard>
            <div className="flex items-center gap-3 mb-4 text-[#737373]">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">System Status</span>
            </div>
            <p className={`text-3xl font-bold ${statusColor}`}>{userStatus}</p>
          </PremiumCard>
        </div>

        {/* REPOSITORY GRID */}
        <h2 className="text-xl font-bold text-white mb-6">Connected Repositories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.repositories.map((repo) => {
            const lastAnalysis = repo.analyses[0]
            const riskScore = lastAnalysis?.riskScore || 0

            // Determine Status Color
            let repoStatusColor = "text-emerald-500"
            let repoStatusText = "SECURE"
            if (riskScore > 80) { repoStatusColor = "text-red-500"; repoStatusText = "CRITICAL" }
            else if (riskScore > 40) { repoStatusColor = "text-yellow-500"; repoStatusText = "WARNING" }

            // CRITICAL FIX: Link to analysis ID, not repository ID
            const reportLink = lastAnalysis ? `/dashboard/scan/${lastAnalysis.id}` : '#'

            return (
              <Link key={repo.id} href={reportLink} className={`group ${!lastAnalysis ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 h-full flex flex-col justify-between">

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[#262626]">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${repoStatusColor === 'text-red-500' ? 'bg-red-950/20 border-red-900/30 text-red-500' : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-500'}`}>
                        {repoStatusText}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-500 transition-colors truncate">
                      {repo.name}
                    </h3>
                    <p className="text-[#737373] text-xs font-mono mb-6">
                      UPDATED: {new Date(repo.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#262626] flex justify-between items-center">
                    <div>
                      <p className="text-[#525252] text-xs uppercase tracking-wider font-semibold">Latest Risk</p>
                      <p className={`text-xl font-bold ${repoStatusColor}`}>{riskScore}/100</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#525252] group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
