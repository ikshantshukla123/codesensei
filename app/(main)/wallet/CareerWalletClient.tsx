'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, Award, Shield, Zap, TrendingUp, Lock, Star, Sparkles, Target, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/Button"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

interface WalletAttributes {
  totalDebtPaid: number
  xp: number
  badges: Badge[]
}

// ----------------------------------------------------------------------
// Reusable UI Components
// ----------------------------------------------------------------------

function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-[#404040] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  accentColor = "text-emerald-500",
  className = ""
}: {
  label: string,
  value: string,
  subValue?: string,
  icon: any,
  accentColor?: string,
  className?: string
}) {
  return (
    <PremiumCard className={`relative overflow-hidden group ${className}`}>
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${accentColor}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2 text-[#737373]">
          <div className={`p-2 rounded-lg bg-[#1a1a1a] ${accentColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {subValue && <p className="text-xs text-[#525252] font-mono mt-1">{subValue}</p>}
      </div>
    </PremiumCard>
  )
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div className="group bg-[#111111] border border-[#262626] rounded-xl p-4 flex items-center gap-4 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all duration-300">
      <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg border border-[#262626] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
        {badge.icon || '🏆'}
      </div>
      <div>
        <h4 className="text-white font-medium text-sm group-hover:text-yellow-500 transition-colors">
          {badge.name}
        </h4>
        <p className="text-[#737373] text-xs mt-0.5 line-clamp-1">
          {badge.description}
        </p>
        <p className="text-[#525252] text-[10px] font-mono mt-1 uppercase">
          Earned: {new Date(badge.earnedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Loading State
// ----------------------------------------------------------------------
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 p-6 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-full" />
        <div className="h-4 w-32 bg-[#1a1a1a] rounded" />
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function CareerWalletClient() {
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletAttributes | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const res = await fetch('/api/wallet')
        if (res.ok) {
          const data = await res.json()
          setWallet(data.wallet)
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch wallet:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [])

  // Rank Calculation Logic
  const getRank = (xp: number) => {
    if (xp < 100) return { name: 'Novice Coder', icon: '🌱', color: 'text-gray-400' }
    if (xp < 500) return { name: 'Junior Audit', icon: '💻', color: 'text-blue-400' }
    if (xp < 1000) return { name: 'Security Engineer', icon: '⚡', color: 'text-purple-400' }
    if (xp < 2500) return { name: 'Senior Architect', icon: '🚀', color: 'text-orange-400' }
    return { name: 'Grandmaster', icon: '🛡️', color: 'text-yellow-400' }
  }

  const getLevel = (xp: number) => Math.floor(xp / 100) + 1
  const getNextLevelXP = (xp: number) => {
    const lvl = getLevel(xp);
    return lvl * 100;
  }
  const getLevelProgress = (xp: number) => {
    const prevLvlXp = (getLevel(xp) - 1) * 100;
    const nextLvlXp = getNextLevelXP(xp);
    const totalRequired = nextLvlXp - prevLvlXp;
    const current = xp - prevLvlXp;
    return (current / totalRequired) * 100;
  }

  if (loading) return <LoadingSkeleton />

  if (!wallet) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center text-white">
        <div>
          <Lock className="w-16 h-16 mx-auto text-[#262626] mb-4" />
          <h1 className="text-xl font-bold">Wallet Not Found</h1>
          <p className="text-[#737373] mt-2">Initialize your account on the dashboard first.</p>
          <Button className="mt-6 bg-white text-black hover:bg-gray-200" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const rank = getRank(wallet.xp)
  const level = getLevel(wallet.xp)
  const nextXP = getNextLevelXP(wallet.xp)
  const progress = getLevelProgress(wallet.xp)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 pb-20">
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Wallet</h1>
            <p className="text-[#a1a1aa] text-sm mt-2 font-mono">
              TRACKING ASSETS FOR: {user?.name?.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#111111] border border-[#262626] p-2 rounded-lg pr-6">
            <div className="w-12 h-12 bg-[#1a1a1a] rounded flex items-center justify-center text-2xl">
              {rank.icon}
            </div>
            <div>
              <p className="text-[10px] text-[#525252] uppercase font-bold tracking-wider">Current Rank</p>
              <p className={`font-bold ${rank.color}`}>{rank.name}</p>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-xs font-mono text-[#737373] mb-2 uppercase">
            <span>Level {level}</span>
            <span>{wallet.xp} / {nextXP} XP</span>
          </div>
          <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Financial Overview Grid (3 Core Metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* 1. Net Liability Saved (Green) */}
          <StatCard
            label="Net Liability Saved"
            value={`$${wallet.totalDebtPaid.toLocaleString()}`}
            subValue="ESTIMATED COST AVOIDANCE"
            icon={TrendingUp}
            accentColor="text-emerald-500"
            className="border-emerald-900/20 bg-emerald-950/5"
          />

          {/* 2. Total XP (Purple) */}
          <StatCard
            label="Experience Points"
            value={wallet.xp.toLocaleString()}
            subValue="CUMULATIVE SCORE"
            icon={Zap}
            accentColor="text-purple-500"
          />

          {/* 3. Badges (Yellow) */}
          <StatCard
            label="Decorations Earned"
            value={wallet.badges.length.toString()}
            subValue="MEDALS & CERTIFICATIONS"
            icon={Award}
            accentColor="text-yellow-500"
          />
        </div>

        {/* Badges / Assets Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-[#737373]" />
            <h2 className="text-xl font-bold text-white">Asset Inventory</h2>
          </div>

          {wallet.badges.length === 0 ? (
            <div className="border border-dashed border-[#262626] rounded-xl p-12 text-center bg-[#0a0a0a]">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#525252]" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Assets Aquired</h3>
              <p className="text-[#737373] text-sm max-w-sm mx-auto mb-6">
                Complete learning modules and fix security vulnerabilities to earn badges and increase your net worth.
              </p>
              <Button className="bg-white text-black hover:bg-gray-200" onClick={() => router.push('/dashboard')}>
                Start Auditing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wallet.badges.map((badge, idx) => (
                <BadgeCard key={badge.id || idx} badge={badge} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
