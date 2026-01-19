'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { WalletIcon, CheckCircleIcon, SmallIconsBundle } from './OptimizedIcons'

const { DollarSign, Trophy, ArrowUp } = SmallIconsBundle
const ShieldIcon = Trophy // Reuse to reduce bundle

export default function CareerWallet() {
  const skills = useMemo(() => ['GDPR Compliance', 'Secure Coding', 'Risk Assessment', 'Audit Ready'], [])

  const features = useMemo(() => [
    { icon: DollarSign, text: 'Real-time value calculation', color: 'text-green-500' },
    { icon: Trophy, text: 'Achievement tracking', color: 'text-yellow-500' },
    { icon: ShieldIcon, text: 'Verified skill credentials', color: 'text-blue-500' }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection variant="fadeInRight" className="relative lg:order-2">
            {/* Career Wallet Dashboard */}
            <div className="glass-card p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <WalletIcon className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-bold text-foreground">Career Wallet</h3>
              </div>

              <div className="space-y-6">
                {/* Red Debt Section */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-600 dark:text-red-400 font-semibold">Security Debt</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">-$65,000</span>
                  </div>
                  <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: "100%" }}
                      whileInView={{ width: "20%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="bg-red-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Arrow Transformation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center"
                >
                  <ArrowUp className="h-8 w-8 text-green-500" />
                </motion.div>

                {/* Green Equity Section */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600 dark:text-green-400 font-semibold">Career Equity</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="text-green-600 dark:text-green-400 font-bold"
                    >
                      +$125,000
                    </motion.span>
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 2 }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Skills Unlocked */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 + index * 0.1 }}
                      className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInLeft" className="space-y-6 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <WalletIcon className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Career Wallet
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Gamified Compliance. Turn Liability into Verified Career Capital.
              Watch your security debt transform into marketable skills and track
              your progress toward becoming a FinTech security professional.
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