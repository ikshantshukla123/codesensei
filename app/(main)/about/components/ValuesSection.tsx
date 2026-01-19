'use client'

import React, { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { TargetIcon, UsersIcon, AwardIcon, ZapIcon } from './AboutIcons'

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

export default function ValuesSection() {
  const values = useMemo(() => [
    {
      icon: TargetIcon,
      title: "Precision",
      description: "Every vulnerability calculation is backed by real market data and regulatory frameworks."
    },
    {
      icon: UsersIcon,
      title: "Accessibility",
      description: "Complex security concepts explained in simple terms that any student can understand."
    },
    {
      icon: AwardIcon,
      title: "Excellence",
      description: "Building the highest quality security education platform for the next generation."
    },
    {
      icon: ZapIcon,
      title: "Innovation",
      description: "Pioneering the intersection of security education and economic intelligence."
    }
  ], [])

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
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
            Our <span className="gradient-text-primary">Core Values</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            The principles that guide everything we build and teach
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map((value, index) => {
            const IconComponent = value.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-xl text-center group transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}