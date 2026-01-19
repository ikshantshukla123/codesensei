'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { SmallIconsBundle } from './OptimizedIcons'
import { BookOpen, Brain, Award, Sparkles, TrendingUp, Lock } from 'lucide-react'

const { Clock } = SmallIconsBundle

export default function AILearningPlatform() {
  const features = useMemo(() => [
    { icon: Brain, text: 'AI Security Professor with real-world breach examples', color: 'text-purple-500' },
    { icon: Award, text: 'Earn XP and unlock career capital for every fix', color: 'text-green-500' },
    { icon: Sparkles, text: 'Interactive lessons with before/after code examples', color: 'text-blue-500' }
  ], [])

  const lessonTopics = useMemo(() => [
    { name: 'SQL Injection Defense', severity: 'CRITICAL', xp: '+50 XP', status: 'completed' },
    { name: 'XSS Prevention Tactics', severity: 'HIGH', xp: '+30 XP', status: 'unlocked' },
    { name: 'Auth Best Practices', severity: 'MEDIUM', xp: '+15 XP', status: 'locked' }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/10 dark:to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection variant="fadeInLeft" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                AI-Powered Learning Platform
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Transform every security vulnerability into a personalized learning experience.
              Our AI Security Professor generates interactive lessons with real-world breach
              examples, step-by-step fixes, and hands-on code demonstrations—all tailored to
              your exact bugs.
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

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Turn bugs into career-boosting knowledge
                </span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInRight" className="relative">
            {/* Learning Platform Preview */}
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border-2 border-white/10 rounded-2xl p-8 shadow-2xl">

              {/* Header */}
              <div className="border-b border-white/10 pb-4 mb-6">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Security Curriculum
                </h3>
                <p className="text-gray-400 text-sm mt-1">PR #42 • 3 Modules</p>
              </div>

              {/* Lesson List */}
              <div className="space-y-3">
                {lessonTopics.map((lesson, index) => {
                  const isCompleted = lesson.status === 'completed'
                  const isLocked = lesson.status === 'locked'
                  const severityColor = lesson.severity === 'CRITICAL' ? 'bg-red-500' :
                    lesson.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all ${isCompleted ? 'bg-green-500/10 border-green-500/30' :
                          isLocked ? 'bg-white/5 border-white/10 opacity-60' :
                            'bg-purple-500/10 border-purple-500/30'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${severityColor} text-black`}>
                              {lesson.severity}
                            </span>
                            {isCompleted && (
                              <Award className="h-4 w-4 text-green-500" />
                            )}
                            {isLocked && (
                              <Lock className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <h4 className="text-white text-sm font-semibold mb-1">{lesson.name}</h4>
                          <p className="text-xs text-gray-400">
                            {isCompleted ? '✓ Mastered' : isLocked ? 'Unlock to learn' : 'Ready to learn'}
                          </p>
                        </div>
                        <div className={`text-sm font-bold ${isCompleted ? 'text-green-400' :
                            isLocked ? 'text-gray-500' : 'text-purple-400'
                          }`}>
                          {lesson.xp}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* CTA Footer */}
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold">Powered by Gemini 2.5</span>
                  </div>
                  <span className="text-xs text-gray-400">Real-time generation</span>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedSection>
  )
}
