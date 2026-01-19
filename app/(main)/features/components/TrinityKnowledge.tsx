'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { BookOpenIcon, SmallIconsBundle } from './OptimizedIcons'

const { Brain, FileText, Target } = SmallIconsBundle
// Fallback to Brain for AlertTriangle to reduce bundle size
const AlertTriangleIcon = Brain

export default function TrinityKnowledge() {
  const cards = useMemo(() => [
    {
      title: "Concept (EL5)",
      icon: Brain,
      color: "blue",
      description: "Simplified explanations that any developer can understand"
    },
    {
      title: "The Law (GDPR)",
      icon: FileText,
      color: "purple",
      description: "Legal context and regulatory implications"
    },
    {
      title: "Reality (Uber Breach)",
      icon: AlertTriangleIcon,
      color: "red",
      description: "Real-world case studies and actual losses"
    }
  ], [])

  const features = useMemo(() => [
    { icon: Brain, text: 'ELI5 technical explanations', color: 'text-blue-500' },
    { icon: FileText, text: 'Legal framework understanding', color: 'text-purple-500' },
    { icon: Target, text: 'Real breach case studies', color: 'text-red-500' }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection variant="fadeInRight" className="relative lg:order-2">
            {/* Stack of Cards */}
            <div className="relative">
              {cards.map((card, index) => {
                const CardIcon = card.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, rotate: -5 }}
                    whileInView={{
                      opacity: 1,
                      y: index * -15,
                      rotate: index * 3 - 3,
                      transition: { delay: index * 0.1, duration: 0.4 }
                    }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    className={`absolute glass-card p-6 w-80 cursor-pointer transition-all duration-200 ${index === 0 ? 'top-0 left-0' :
                        index === 1 ? 'top-4 left-4' : 'top-8 left-8'
                      }`}
                    style={{ zIndex: cards.length - index }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${card.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20' :
                          card.color === 'purple' ? 'bg-purple-500/10 border border-purple-500/20' :
                            'bg-red-500/10 border border-red-500/20'
                        }`}>
                        <CardIcon className={`h-6 w-6 ${card.color === 'blue' ? 'text-blue-500' :
                            card.color === 'purple' ? 'text-purple-500' :
                              'text-red-500'
                          }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-2">{card.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInLeft" className="space-y-6 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <BookOpenIcon className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The 'Trinity' Knowledge Deck
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Don't just fix it. Understand the Law, the Concept, and the Real-World Loss.
              Our three-tiered approach ensures you grasp not just what to fix, but why it matters
              and what happens when companies get it wrong.
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
        </div>
      </div>
    </AnimatedSection>
  )
}