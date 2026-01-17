'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Issue {
  id: string
  type: string
  severity: string
  description: string
  file?: string
  line?: number
  exposureAmount: number
}

interface Analysis {
  id: string
  riskScore: number
  status: string
  issuesFound: number
  bugs: any[]
  createdAt: string
  repository: {
    name: string
  }
}

export default function ReceiptPage({ params }: { params: { analysisId: string } }) {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/learning/analysis/${params.analysisId}`)
        if (res.ok) {
          const data = await res.json()
          setAnalysis(data)
        }
      } catch (error) {
        console.error('Failed to fetch analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [params.analysisId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your learning receipt...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The requested analysis could not be found.</p>
        </div>
      </div>
    )
  }

  const totalDebt = analysis.bugs.reduce((sum: number, bug: any) => {
    const severity = bug.severity || 'LOW'
    const amount = severity === 'CRITICAL' ? 500 : severity === 'HIGH' ? 200 : severity === 'MEDIUM' ? 75 : 25
    return sum + amount
  }, 0)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'HIGH': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    }
  }

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return '🚨'
      case 'HIGH': return '🔴'
      case 'MEDIUM': return '🟡'
      default: return '🔵'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Compounding Liability Receipt
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your Technical Debt Assessment
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Repository</p>
                <p className="text-xl font-bold">{analysis.repository.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Analysis Date</p>
                <p className="text-lg font-semibold">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.issuesFound}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Issues Found</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analysis.riskScore}/100</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Risk Score</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalDebt}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Debt</p>
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Opportunities</h3>
              {analysis.bugs.map((bug: any, index: number) => {
                const severity = bug.severity || 'LOW'
                const amount = severity === 'CRITICAL' ? 500 : severity === 'HIGH' ? 200 : severity === 'MEDIUM' ? 75 : 25

                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{getSeverityEmoji(severity)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(severity)}`}>
                            {severity}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{bug.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{bug.description}</p>
                        {bug.file && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            📁 {bug.file}{bug.line ? `:${bug.line}` : ''}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">${amount}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">Total Technical Debt</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">${totalDebt}</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push(`/learning/deck/${params.analysisId}`)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              💳 Pay Your Debt - Start Learning →
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Complete the Trinity Knowledge Deck to clear your technical debt and earn XP!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
