'use client'

import React, { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { ShieldIcon, BotIcon, ZapIcon, WalletIcon } from './HomeIcons'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

export default function FeatureGrid() {
  const features = useMemo(() => [
    {
      icon: ShieldIcon,
      title: "Real-time Security Analysis",
      description: "AI-powered vulnerability detection with instant financial impact calculations"
    },
    {
      icon: BotIcon,
      title: "AI Security Mentor",
      description: "Personal AI assistant that teaches you secure coding patterns and best practices"
    },
    {
      icon: ZapIcon,
      title: "Instant Code Fixes",
      description: "Get immediate suggestions to fix security vulnerabilities with explanations"
    },
    {
      icon: WalletIcon,
      title: "Career Value Tracking",
      description: "Transform your security knowledge into measurable career capital and credentials"
    }
  ], [])

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Why Choose <span className="gradient-text-primary">CodeSensei</span>?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            The first platform to combine security education with real financial impact analysis
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-xl text-center group transition-all duration-300"
              >
                <div className="mb-4 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}