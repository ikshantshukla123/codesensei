'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Bug {
  type: string
  severity: string
  description: string
  file?: string
  line?: number
  recommendation?: string
}

interface TrinityCard {
  definition: string
  compliance: string
  impact: string
}

export default function TrinityDeckPage({ params }: { params: { analysisId: string } }) {
  const router = useRouter()
  const [bugs, setBugs] = useState<Bug[]>([])
  const [currentBugIndex, setCurrentBugIndex] = useState(0)
  const [currentCard, setCurrentCard] = useState<'definition' | 'compliance' | 'impact'>('definition')
  const [trinityCards, setTrinityCards] = useState<TrinityCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/learning/analysis/${params.analysisId}`)
        if (res.ok) {
          const data = await res.json()
          setBugs(data.bugs || [])
        }
      } catch (error) {
        console.error('Failed to fetch analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [params.analysisId])

  useEffect(() => {
    if (bugs.length > 0 && currentBugIndex < bugs.length) {
      generateTrinityCards(bugs[currentBugIndex])
    }
  }, [currentBugIndex, bugs])

  async function generateTrinityCards(bug: Bug) {
    setGenerating(true)
    try {
      const res = await fetch('/api/learning/trinity-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bug })
      })

      if (res.ok) {
        const data = await res.json()
        setTrinityCards(data)
      }
    } catch (error) {
      console.error('Failed to generate trinity cards:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleNextCard = () => {
    if (currentCard === 'definition') {
      setCurrentCard('compliance')
    } else if (currentCard === 'compliance') {
      setCurrentCard('impact')
    } else {
      // Move to next bug
      if (currentBugIndex < bugs.length - 1) {
        setCurrentBugIndex(currentBugIndex + 1)
        setCurrentCard('definition')
      } else {
        // All done - go to fixer
        router.push(`/learning/fixer/${params.analysisId}`)
      }
    }
  }

  const getCardContent = () => {
    if (!trinityCards) return ''
    switch (currentCard) {
      case 'definition': return trinityCards.definition
      case 'compliance': return trinityCards.compliance
      case 'impact': return trinityCards.impact
    }
  }

  const getCardTitle = () => {
    switch (currentCard) {
      case 'definition': return '📚 Definition'
      case 'compliance': return '⚖️ Compliance & Rules'
      case 'impact': return '💥 Real-World Impact'
    }
  }

  const getCardColor = () => {
    switch (currentCard) {
      case 'definition': return 'from-blue-500 to-cyan-500'
      case 'compliance': return 'from-purple-500 to-pink-500'
      case 'impact': return 'from-orange-500 to-red-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Trinity Knowledge Deck...</p>
        </div>
      </div>
    )
  }

  if (bugs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No issues found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Great job! Your code looks clean.</p>
        </div>
      </div>
    )
  }

  const currentBug = bugs[currentBugIndex]
  const progress = ((currentBugIndex * 3 + (currentCard === 'definition' ? 1 : currentCard === 'compliance' ? 2 : 3)) / (bugs.length * 3)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎴 Trinity Knowledge Deck
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Master the concepts behind secure coding
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Issue {currentBugIndex + 1} of {bugs.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card Container */}
        <div className="perspective-1000">
          <div className={`bg-gradient-to-br ${getCardColor()} rounded-2xl shadow-2xl p-8 text-white min-h-[400px] transform transition-all duration-500 hover:scale-105`}>
            {/* Card Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{getCardTitle()}</h2>
              <div className="h-1 w-24 bg-white/50 rounded"></div>
            </div>

            {/* Issue Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
              <p className="text-sm opacity-90 mb-1">Current Issue</p>
              <p className="text-xl font-bold">{currentBug.type}</p>
              {currentBug.file && (
                <p className="text-sm opacity-75 mt-2">📁 {currentBug.file}</p>
              )}
            </div>

            {/* Card Content */}
            {generating ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                <p className="text-lg leading-relaxed">{getCardContent()}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${currentCard === 'definition' ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentCard === 'compliance' ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`w-3 h-3 rounded-full ${currentCard === 'impact' ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
              <button
                onClick={handleNextCard}
                disabled={generating}
                className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentCard === 'impact' && currentBugIndex === bugs.length - 1
                  ? 'Continue to Fixer →'
                  : 'Next Card →'}
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Read through all three cards to understand this security concept deeply
        </p>
      </div>
    </div>
  )
}
