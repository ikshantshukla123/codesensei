import { Variants } from 'framer-motion'

// Optimized animation variants with reduced complexity and better performance
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 }, // Reduced from 60px for better performance
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Reduced from 0.6s
      ease: "easeOut" // Simpler easing for better performance
    }
  }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 }, // Reduced from 60px
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 }, // Reduced from 60px
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Reduced from 0.2s
      delayChildren: 0.05  // Reduced from 0.1s
    }
  }
}

// Scale animation for interactive elements
export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  }
}

// Optimized slide animation
export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.3 }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}