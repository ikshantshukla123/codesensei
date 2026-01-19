'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { GraduationCapIcon, ShieldIcon, CheckCircleIcon, BriefcaseIcon } from './OptimizedIcons'

export default function CareerEvolutionLadder() {
  const stages = useMemo(() => [
    {
      icon: GraduationCapIcon,
      title: "Junior Dev",
      description: "Learning the basics",
      level: 1,
      color: "blue"
    },
    {
      icon: ShieldIcon,
      title: "Security Aware",
      description: "Understanding vulnerabilities",
      level: 2,
      color: "purple"
    },
    {
      icon: CheckCircleIcon,
      title: "Compliance Pro",
      description: "Mastering regulations",
      level: 3,
      color: "green"
    },
    {
      icon: BriefcaseIcon,
      title: "FinTech Architect",
      description: "Leading secure systems",
      level: 4,
      color: "gold"
    }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your <span className="gradient-text-primary">Career Evolution</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Track your journey from junior developer to FinTech security architect
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Animated Path Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-t from-green-500 to-blue-500 transform -translate-x-1/2 z-10 origin-top"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative z-20 mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${stage.color === 'blue' ? 'bg-blue-500' :
                          stage.color === 'purple' ? 'bg-purple-500' :
                            stage.color === 'green' ? 'bg-green-500' :
                              'bg-yellow-500'
                        } shadow-lg`}
                    >
                      <StageIcon className="h-10 w-10 text-white" />
                    </motion.div>

                    <h3 className="font-bold text-lg text-foreground mb-2">{stage.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>

                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-3 ${stage.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' :
                        stage.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' :
                          stage.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                            'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                      }`}>
                      Level {stage.level}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}