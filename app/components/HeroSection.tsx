'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { GithubIcon, PlayIcon, ArrowRightIcon, SmallIconsBundle } from './HomeIcons'
import Link from 'next/link'
import HeroSignInButton from '@/components/HeroSignInButton'

const { Terminal } = SmallIconsBundle

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export default function HeroSection() {

  return (
    <section className="pt-32 pb-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="animate-float mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-full text-sm font-medium text-gray-400 dark:text-gray-300 mb-6">
              🚀 Now in Beta • Connect your first GitHub repo
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
          >
            Turn Technical Debt into{' '}
            <span className="gradient-text-primary">Career Capital</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            The world's first AI platform that teaches you the dollar cost of every bug you write.
            Master FinTech security before you graduate.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <HeroSignInButton />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-8 py-4 border border-foreground/20 text-foreground font-semibold rounded-lg hover:bg-foreground/5 transition-all duration-300 backdrop-blur-sm"
            >
              <PlayIcon className="mr-2 h-5 w-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Demo Dashboard Preview */}
          <motion.div
            variants={fadeInUp}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-8 border border-foreground/10">
              <div className="flex items-center gap-4 mb-6">
                <Terminal className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold text-foreground">Live Security Analysis</h3>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 text-green-400">
                  <span className="animate-pulse">●</span>
                  <span>Analyzing repository: your-fintech-app</span>
                </div>

                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>🔍 SQL Injection vulnerability detected</span>
                    <span className="text-red-400 font-bold">-$65,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>⚡ Fixed: Parameterized queries implemented</span>
                    <span className="text-green-400 font-bold">+$65,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🎯 GDPR compliance achieved</span>
                    <span className="text-blue-400 font-bold">Career +15%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center text-green-400 font-bold">
                    <span>Net Career Value:</span>
                    <span>+$65,000</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}