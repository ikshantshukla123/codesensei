'use client'

import React, { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { ShieldIcon, DollarSignIcon, BrainIcon } from './AboutIcons'

export default function MissionHeader() {
  const pillars = useMemo(() => [
    {
      icon: ShieldIcon,
      title: "Security-First",
      description: "Every vulnerability has a price tag",
      color: "text-blue-400"
    },
    {
      icon: DollarSignIcon,
      title: "Financial Impact",
      description: "Learn the true cost of bad code",
      color: "text-green-400"
    },
    {
      icon: BrainIcon,
      title: "Career Intelligence",
      description: "Transform knowledge into market value",
      color: "text-purple-400"
    }
  ], [])

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

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.div variants={fadeInUp} className="animate-float mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-gray-400 dark:text-gray-300 mb-6">
              💡 Our Mission
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
          >
            We are building the{' '}
            <span className="gradient-text-secondary">Financial Firewall</span>{' '}
            for the Next Generation
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Empowering computer science students with the economic intelligence to write
            secure, valuable code from day one.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {pillars.map((pillar, index) => {
              const IconComponent = pillar.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-xl text-center group transition-all duration-300"
                >
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${pillar.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{pillar.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{pillar.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}