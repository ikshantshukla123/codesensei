'use client'

import React, { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeInUp } from './animations'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight'
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  variant = 'fadeInUp'
}: AnimatedSectionProps) {
  const ref = useRef(null)

  // Memoize viewport options for performance
  const viewportOptions = useMemo(() => ({
    once: true,
    rootMargin: "-10%",
    threshold: 0.2 // Trigger when 20% is visible
  }), [])

  const isInView = useInView(ref, viewportOptions)

  // Memoize animation variants based on variant prop
  const animationVariant = useMemo(() => {
    const variants = {
      fadeInUp: {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay }
        }
      },
      fadeInLeft: {
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, delay }
        }
      },
      fadeInRight: {
        hidden: { opacity: 0, x: 20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, delay }
        }
      }
    }
    return variants[variant]
  }, [variant, delay])

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animationVariant}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Specialized components for different animation needs
export function FadeInContainer({
  children,
  className = "",
  stagger = 0.1
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const ref = useRef(null)
  const viewportOptions = useMemo(() => ({ once: true, rootMargin: "-10%" }), [])
  const isInView = useInView(ref, viewportOptions)

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.1
      }
    }
  }), [stagger])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeInItem({ children }: { children: React.ReactNode }) {
  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }), [])

  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}