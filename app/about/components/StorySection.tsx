'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { CodeIcon, TrendingUpIcon } from './AboutIcons'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
}

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
}

export default function StorySection() {

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeInLeft}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <CodeIcon className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Story
              </h2>
            </div>

            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Born from the frustration of watching brilliant computer science students
                graduate without understanding the economic impact of their code decisions.
              </p>
              <p>
                In 2024, we witnessed another massive security breach cost a company
                $2.4 billion. The vulnerability? A simple SQL injection that could have
                been prevented with proper education.
              </p>
              <p>
                That's when we realized: <strong className="text-foreground">Security isn't just a technical problem—it's an economic education problem.</strong>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={fadeInRight}
            className="relative"
          >
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUpIcon className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-bold text-foreground">The Problem</h3>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="text-red-600 dark:text-red-400 font-semibold mb-2">Current State</div>
                  <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                    <li>• 78% of CS grads can't price security vulnerabilities</li>
                    <li>• $6 trillion in annual cybersecurity damage</li>
                    <li>• 3.5 million unfilled security jobs</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-semibold mb-2">Our Solution</div>
                  <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                    <li>• Real-time financial impact education</li>
                    <li>• Gamified security learning</li>
                    <li>• Career capital tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}