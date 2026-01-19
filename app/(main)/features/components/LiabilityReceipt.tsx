'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './AnimatedSection'
import { ReceiptIcon, SmallIconsBundle } from './OptimizedIcons'

const { Clock, TrendingUp } = SmallIconsBundle
const AlertTriangleIcon = SmallIconsBundle.Clock // Reuse Clock icon as placeholder

export default function LiabilityReceipt() {
  const currentDate = useMemo(() => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    return `${day}/${month}/${year}`
  }, [])

  const vulnerabilities = useMemo(() => [
    { name: 'SQL Injection (CRITICAL)', amount: '$65,000.00' },
    { name: 'XSS Vulnerability', amount: '$25,000.00' },
    { name: 'Auth Bypass', amount: '$45,000.00' }
  ], [])

  const features = useMemo(() => [
    { icon: Clock, text: 'Real-time risk calculations', color: 'text-yellow-500' },
    { icon: TrendingUp, text: 'Compound interest on security debt', color: 'text-red-500' },
    { icon: AlertTriangleIcon, text: 'Market-aware penalty tracking', color: 'text-orange-500' }
  ], [])

  return (
    <AnimatedSection className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection variant="fadeInLeft" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <ReceiptIcon className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The 'Compounding' Liability Receipt
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Urgency built-in. We calculate the real-time cost of your code delays.
              Every vulnerability comes with its projected financial impact, updating
              in real-time as market conditions and regulatory fines change.
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
            {/* Digital Receipt */}
            <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 font-mono text-sm shadow-2xl">
              <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">SECURITY LIABILITY RECEIPT</h3>
                <p className="text-gray-500 dark:text-gray-400">Issue #SQ-2026-0011</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Generated: {currentDate}</p>
              </div>

              <div className="space-y-3">
                {vulnerabilities.map((vuln, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{vuln.name}</span>
                    <span className="text-red-500 font-bold">{vuln.amount}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-4">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800 dark:text-gray-200">TOTAL LIABILITY:</span>
                    <span className="text-red-500 text-lg">$135,000.00</span>
                  </div>
                </div>
              </div>

              {/* Animated ticker */}
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span className="text-xs font-semibold">⚠️ Risk Interest: +$50/hr</span>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedSection>
  )
}