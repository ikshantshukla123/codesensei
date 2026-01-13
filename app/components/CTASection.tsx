'use client'

import React, { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { GithubIcon, ArrowRightIcon, SmallIconsBundle } from './HomeIcons'
import Link from 'next/link'
import HeroSignInButton from '@/components/HeroSignInButton'

const { CheckCircle } = SmallIconsBundle

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
      delayChildren: 0.2
    }
  }
}

export default function CTASection() {
  const benefits = useMemo(() => [
    "Start earning security credentials today",
    "Join 12,000+ developers already building their career capital",
    "Get instant feedback on your code's financial impact",
    "Access to exclusive FinTech security resources"
  ], [])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-full text-sm font-medium text-gray-400 dark:text-gray-300 mb-6">
              🎯 Ready to Transform Your Code?
            </div>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
          >
            Start Building Your <span className="gradient-text-primary">Security Portfolio</span> Today
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            Connect your GitHub repository and see the financial impact of your code in real-time.
            Join thousands of developers already building valuable security skills.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="space-y-4 mb-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <HeroSignInButton />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-sm text-gray-500 dark:text-gray-500"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}