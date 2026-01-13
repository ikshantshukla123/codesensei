'use client'

import React, { useMemo } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { CodeIcon, CheckCircleIcon, SmallIconsBundle } from './OptimizedIcons'

const { Target } = SmallIconsBundle
const AlertTriangleIcon = Target // Reuse to reduce bundle

export default function DiffMatchFixer() {
  const features = useMemo(() => [
    { icon: CodeIcon, text: 'Side-by-side code comparison', color: 'text-blue-500' },
    { icon: Target, text: 'Pattern recognition training', color: 'text-green-500' },
    { icon: CheckCircleIcon, text: 'Interactive fix selection', color: 'text-purple-500' }
  ], [])

  const codeOptions = useMemo(() => [
    {
      title: 'Option A: Parameterized Query',
      code: "db.query('SELECT * FROM users WHERE id = ?', [userInput])"
    },
    {
      title: 'Option B: Input Validation',
      code: 'validateInput(userInput) && execute(query)'
    }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection variant="fadeInLeft" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <CodeIcon className="h-8 w-8 text-blue-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The 'Diff-Match' Fixer
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Active Learning. Don't write from scratch—identify the secure pattern to fix the breach.
              Our interactive code comparison teaches you to recognize vulnerable patterns and
              choose the right security fix.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${feature.color}`} />
                    <span className="text-gray-600 dark:text-gray-300">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInRight" className="relative">
            {/* Split Code Editor */}
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
              {/* Editor Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-300 text-sm font-mono">security-fix.js</span>
              </div>

              <div className="grid md:grid-cols-2">
                {/* Left: Bad Code */}
                <div className="bg-red-900/20 border-r border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangleIcon className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 text-sm font-semibold">Vulnerable Code</span>
                  </div>
                  <div className="font-mono text-sm text-gray-300 space-y-1">
                    <div>1 <span className="text-purple-400">const</span> <span className="text-blue-400">query</span> = </div>
                    <div>2   <span className="text-orange-300">`SELECT * FROM users`</span></div>
                    <div>3   <span className="text-orange-300">+ <span className="text-red-400 bg-red-900/50">userInput</span></span></div>
                  </div>
                </div>

                {/* Right: Fix Options */}
                <div className="bg-green-900/20 p-4">
                  <div className="text-green-400 text-sm font-semibold mb-3">Choose the Fix:</div>
                  <div className="space-y-3">
                    {codeOptions.map((option, index) => (
                      <button key={index} className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 hover:border-green-500">
                        <div className="text-sm font-semibold text-green-400 mb-1">{option.title}</div>
                        <div className="font-mono text-xs text-gray-300">{option.code}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedSection>
  )
}