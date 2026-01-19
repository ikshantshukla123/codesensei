'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { GlobeIcon } from './AboutIcons'

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

export default function TeamSection() {

  return (
    <section className="py-20 px-4">
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
              🌍 Global Impact
            </div>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
          >
            Join the <span className="gradient-text-primary">Movement</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            We're a distributed team of security experts, educators, and engineers
            working together to revolutionize how security is taught and valued.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <GlobeIcon className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-foreground">Our Team Stats</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">12+</div>
                <div className="text-gray-600 dark:text-gray-400">Countries Represented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-400">Years Combined Security Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">100K+</div>
                <div className="text-gray-600 dark:text-gray-400">Students Impacted</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Want to be part of building the future of security education?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Join Our Team
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}