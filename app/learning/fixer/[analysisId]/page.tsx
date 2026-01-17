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

export default function DiffMatchFixerPage({ params }: { params: { analysisId: string } }) {
  const router = useRouter()
  const [bugs, setBugs] = useState<Bug[]>([])
  const [currentBugIndex, setCurrentBugIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState(false)
  const [fixed, setFixed] = useState<Set<number>>(new Set())

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

  const handleMarkAsFixed = async () => {
    setFixing(true)
    try {
      const res = await fetch('/api/learning/mark-fixed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId: params.analysisId,
          bugIndex: currentBugIndex
        })
      })

      if (res.ok) {
        const newFixed = new Set(fixed)
        newFixed.add(currentBugIndex)
        setFixed(newFixed)

        // Move to next bug or complete
        if (currentBugIndex < bugs.length - 1) {
          setTimeout(() => {
            setCurrentBugIndex(currentBugIndex + 1)
          }, 500)
        } else {
          // All bugs fixed - go to wallet
          setTimeout(() => {
            router.push('/wallet')
          }, 1500)
        }
      }
    } catch (error) {
      console.error('Failed to mark as fixed:', error)
    } finally {
      setFixing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Diff Match Fixer...</p>
        </div>
      </div>
    )
  }

  if (bugs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No issues to fix</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your code is already secure!</p>
        </div>
      </div>
    )
  }

  const currentBug = bugs[currentBugIndex]
  const progress = ((fixed.size) / bugs.length) * 100
  const isCurrentFixed = fixed.has(currentBugIndex)

  // Create mock insecure and secure code snippets
  const getInsecureCode = (bug: Bug) => {
    if (bug.type.includes('SQL')) {
      return `// ❌ Insecure: Direct string concatenation
const query = "SELECT * FROM users WHERE id = " + userId;
db.execute(query);

// This allows SQL injection attacks!`
    } else if (bug.type.includes('XSS')) {
      return `// ❌ Insecure: Unescaped user input
element.innerHTML = userInput;

// This allows XSS attacks!`
    } else {
      return `// ❌ Insecure code detected
// ${bug.description}

// Needs security improvements`
    }
  }

  const getSecureCode = (bug: Bug) => {
    if (bug.type.includes('SQL')) {
      return `// ✅ Secure: Use parameterized queries
const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userId]);

// Or use an ORM like Prisma:
const user = await prisma.user.findUnique({
  where: { id: userId }
});`
    } else if (bug.type.includes('XSS')) {
      return `// ✅ Secure: Sanitize and escape user input
element.textContent = userInput; // Safe
// Or use a library like DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);`
    } else {
      return `// ✅ Secure code recommendation:
// ${bug.recommendation || 'Follow security best practices'}

// Always validate and sanitize input
// Use proper error handling
// Keep dependencies updated`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🔧 Diff Match Fixer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare insecure vs secure code patterns
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Issue {currentBugIndex + 1} of {bugs.length}</span>
            <span>{fixed.size} Fixed • {bugs.length - fixed.size} Remaining</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Issue Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentBug.type}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{currentBug.description}</p>
              {currentBug.file && (
                <p className="text-sm text-gray-500">📁 {currentBug.file}{currentBug.line ? `:${currentBug.line}` : ''}</p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${currentBug.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                currentBug.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  currentBug.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
              {currentBug.severity}
            </div>
          </div>
        </div>

        {/* Code Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Insecure Code */}
          <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">❌</span>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Insecure Pattern</h3>
            </div>
            <pre className="bg-white dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">{getInsecureCode(currentBug)}</code>
            </pre>
          </div>

          {/* Secure Code */}
          <div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Secure Pattern</h3>
            </div>
            <pre className="bg-white dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-800 dark:text-gray-200">{getSecureCode(currentBug)}</code>
            </pre>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {isCurrentFixed ? (
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-lg font-semibold">
              <span>✓</span>
              <span>Fixed & Understood!</span>
            </div>
          ) : (
            <button
              onClick={handleMarkAsFixed}
              disabled={fixing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fixing ? 'Processing...' : '✓ I Understand & Fixed It'}
            </button>
          )}

          {currentBugIndex < bugs.length - 1 && isCurrentFixed && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Moving to next issue...
            </p>
          )}

          {currentBugIndex === bugs.length - 1 && isCurrentFixed && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              🎉 All issues fixed! Redirecting to your wallet...
            </p>
          )}
        </div>

        {/* Learning Tip */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Learning Tip</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                {currentBug.recommendation || 'Always validate user input, use parameterized queries, and keep your dependencies up to date.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
