'use client'

import React, { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { SmallIconsBundle } from './HomeIcons'

const { DollarSign, TrendingUp, Users } = SmallIconsBundle

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
}

export default function StatsSection() {
  const stats = useMemo(() => [
    {
      icon: DollarSign,
      number: "$2.4M+",
      label: "Security Debt Prevented",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      number: "87%",
      label: "Career Value Increase",
      color: "text-blue-500"
    },
    {
      icon: Users,
      number: "12,000+",
      label: "Developers Trained",
      color: "text-purple-500"
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
          className="grid md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-foreground/10 mb-4 group-hover:shadow-lg transition-all duration-300"
                >
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="text-4xl md:text-5xl font-bold text-foreground mb-2"
                >
                  {stat.number}
                </motion.div>

                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}