'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

interface Wallet {
  totalDebtPaid: number
  xp: number
  badges: Badge[]
}

export default function CareerWalletClient() {
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
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

  const getLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1
  }

  const getNextLevelXP = (xp: number) => {
    const currentLevel = getLevel(xp)
    return currentLevel * 100
  }

  const getLevelProgress = (xp: number) => {
    const currentLevelXP = (getLevel(xp) - 1) * 100
    const nextLevelXP = getNextLevelXP(xp)
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  }

  const getRank = (xp: number) => {
    if (xp < 100) return { name: 'Novice Coder', icon: '🌱', color: 'from-gray-400 to-gray-600' }
    if (xp < 500) return { name: 'Junior Developer', icon: '💻', color: 'from-blue-400 to-blue-600' }
    if (xp < 1000) return { name: 'Software Engineer', icon: '⚡', color: 'from-purple-400 to-purple-600' }
    if (xp < 2500) return { name: 'Senior Engineer', icon: '🚀', color: 'from-orange-400 to-orange-600' }
    return { name: 'Security Expert', icon: '🛡️', color: 'from-yellow-400 to-yellow-600' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your wallet...</p>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please sync your account first.</p>
        </div>
      </div>
    )
  }

  const rank = getRank(wallet.xp)
  const level = getLevel(wallet.xp)
  const progress = getLevelProgress(wallet.xp)
  const nextLevelXP = getNextLevelXP(wallet.xp)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            💰 Career Wallet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your learning progress and achievements
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${rank.color} p-8 text-white`}>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl">
                {rank.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{user?.name || 'Student'}</h2>
                <p className="text-xl opacity-90">{rank.name}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-sm opacity-75">Level</span>
                    <p className="text-2xl font-bold">{level}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-sm opacity-75">XP</span>
                    <p className="text-2xl font-bold">{wallet.xp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* XP Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress to Level {level + 1}</span>
                <span>{wallet.xp} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${rank.color} h-4 rounded-full transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-4xl mb-2">💳</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">${wallet.totalDebtPaid.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Debt Paid</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <p className="text-4xl mb-2">⭐</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{wallet.xp}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total XP</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-4xl mb-2">🏆</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{wallet.badges.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Badges Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>🏅</span>
            <span>Achievements & Badges</span>
          </h2>

          {wallet.badges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🎯</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No badges yet</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start fixing issues to earn your first badge!
              </p>
              <button
                onClick={() => router.push('/learning')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
              >
                Start Learning
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallet.badges.map((badge: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 hover:scale-105 transition-transform">
                  <div className="text-center">
                    <p className="text-5xl mb-3">{badge.icon || '🏆'}</p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{badge.name || 'Achievement'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {badge.description || 'Badge earned!'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Recently earned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all text-left"
          >
            <p className="text-3xl mb-2">📊</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">View Dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See all your code analyses</p>
          </button>

          <button
            onClick={() => router.push('/learning')}
            className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-all text-left"
          >
            <p className="text-3xl mb-2">🚀</p>
            <h3 className="text-xl font-bold mb-1">Continue Learning</h3>
            <p className="text-sm opacity-90">Start a new learning session</p>
          </button>
        </div>
      </div>
    </div>
  )
}
