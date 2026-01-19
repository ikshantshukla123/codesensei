'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import {
  Workflow,
  ArrowRight,
  Github,
  Shield,
  CheckCircle2,
  Webhook,
  Settings,
  GitBranch,
  Bot,
  Brain,
  DollarSign,
  Terminal,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Eye,
  Edit,
  Play,
  RotateCw
} from 'lucide-react'

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

// Step data interface
interface WorkflowStep {
  stepNumber: number
  title: string
  description: string
  icon: React.ComponentType<any>
  visual: React.ReactNode
  zone: 'setup' | 'loop'
}

// Visual Components for each step

// Setup Visual: GitHub App Permissions Modal
const SetupPermissionsVisual = () => (
  <div className="bg-gray-900/90 border border-gray-700/50 rounded-xl p-6 max-w-md mx-auto">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
      <div className="p-2 bg-purple-500/20 rounded-lg">
        <Github className="h-5 w-5 text-purple-400" />
      </div>
      <div>
        <h3 className="font-semibold text-white">CodeSensei App</h3>
        <p className="text-sm text-gray-400">by CodeSensei Inc.</p>
      </div>
      <div className="ml-auto">
        <Shield className="h-5 w-5 text-green-400" />
      </div>
    </div>

    {/* Permissions List */}
    <div className="space-y-4 mb-6">
      <p className="text-sm font-medium text-gray-300 mb-3">
        This app will be able to:
      </p>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 text-sm text-gray-300"
      >
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <Eye className="h-4 w-4 text-blue-400" />
        <span>Read Access (Code Scanning)</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 text-sm text-gray-300"
      >
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        <Edit className="h-4 w-4 text-orange-400" />
        <span>Write Access (PR Comments)</span>
      </motion.div>
    </div>

    {/* Connect Button */}
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-purple"
    >
      <Webhook className="h-4 w-4" />
      Connect with GitHub
    </motion.button>

    {/* Note */}
    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
      <p className="text-xs text-yellow-400">
        💡 <strong>Note:</strong> We need Write access to post the Liability Receipt on your PRs.
        We never modify code logic.
      </p>
    </div>
  </div>
)

// Step 1 Visual: Terminal with git push and PR creation
const GitPushVisual = () => (
  <div className="space-y-4">
    {/* Terminal */}
    <div className="bg-gray-900/90 border border-gray-700/50 rounded-lg p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-3 text-green-400">
        <Terminal className="h-4 w-4" />
        <span>user@macbook ~/fintech-app</span>
      </div>
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">$</span>
          <span>git add .</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">$</span>
          <span>git commit -m "Add user authentication"</span>
        </div>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "auto" }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-blue-400">$</span>
          <span className="text-yellow-400">git push origin feature/auth</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-green-400"
          >
            ●
          </motion.span>
        </motion.div>
      </div>
    </div>

    {/* PR Creation UI */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.2 }}
      className="bg-white/5 border border-green-500/20 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">Ready to create Pull Request?</h4>
        <GitBranch className="h-4 w-4 text-green-400" />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
      >
        <Play className="h-4 w-4" />
        Create Pull Request
      </motion.button>
    </motion.div>
  </div>
)

// Step 2 Visual: GitHub comment with liability receipt
const LiabilityReceiptVisual = () => (
  <div className="bg-white/5 border border-orange-500/20 rounded-lg p-4">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div>
        <div className="font-medium text-white mb-1">CodeSensei Bot</div>
        <div className="text-xs text-gray-400">Just now</div>
      </div>
    </div>

    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <span className="font-bold text-red-400">⚠️ CodeSensei: Financial Liability Detected</span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between items-center text-gray-300">
          <span>• SQL Injection Risk</span>
          <span className="text-red-400 font-mono">$25,000</span>
        </div>
        <div className="flex justify-between items-center text-gray-300">
          <span>• Weak Password Hash</span>
          <span className="text-red-400 font-mono">$40,000</span>
        </div>
        <div className="border-t border-red-500/30 pt-2 mt-3">
          <div className="flex justify-between items-center font-bold">
            <span className="text-red-400">Potential Fine:</span>
            <motion.span
              className="text-red-400 font-mono text-lg"
              animate={{ color: ['#f87171', '#dc2626', '#f87171'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              $65,000
            </motion.span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-md flex items-center justify-center gap-2"
      >
        <Brain className="h-4 w-4" />
        [Pay Debt] → Learn & Fix
      </motion.button>
    </div>
  </div>
)

// Step 3 Visual: Knowledge deck with 3 horizontal cards
const KnowledgeDeckVisual = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="text-center">
      <h4 className="text-lg font-bold text-white mb-2">Interactive Learning Cards</h4>
      <p className="text-sm text-gray-400">Review all 3 flashcards to master the concept</p>
    </div>

    {/* Horizontal Cards Layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1 - The Concept */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm p-4 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-green-400">The Concept</span>
        </div>
        <h4 className="text-base font-bold text-white mb-2">Input Validation</h4>
        <p className="text-sm text-gray-400 mb-4">Secure patterns to sanitize user data and prevent injection attacks...</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <RotateCw className="h-3 w-3 text-green-400" />
            <span className="text-xs text-green-400">Interactive</span>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Card 2 - The Law */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm p-4 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">The Law</span>
        </div>
        <h4 className="text-base font-bold text-white mb-2">GDPR/PCI Compliance</h4>
        <p className="text-sm text-gray-400 mb-4">Legal requirements and regulatory standards for data security...</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <RotateCw className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-blue-400">Interactive</span>
          </div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Card 3 - Real-World Hack */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm p-4 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-sm font-medium text-red-400">Real-World Hack</span>
        </div>
        <h4 className="text-base font-bold text-white mb-2">Equifax Breach</h4>
        <p className="text-sm text-gray-400 mb-4">How this vulnerability cost $700M and affected 147 million people...</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <RotateCw className="h-3 w-3 text-red-400" />
            <span className="text-xs text-red-400">Interactive</span>
          </div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>

    {/* Bottom Flow Indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8 }}
      className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4"
    >
      <span className="text-green-400">Concept</span>
      <ArrowRight className="h-3 w-3" />
      <span className="text-blue-400">Law</span>
      <ArrowRight className="h-3 w-3" />
      <span className="text-red-400">Reality</span>
    </motion.div>
  </div>
)

// Step 4 Visual: Debt conversion animation
const DebtConversionVisual = () => (
  <div className="bg-gray-900/90 border border-gray-700/50 rounded-lg p-6">
    <div className="text-center mb-6">
      <h4 className="text-lg font-bold text-white mb-2">Career Equity Wallet</h4>
      <p className="text-sm text-gray-400">Watch debt transform into career capital</p>
    </div>

    <div className="space-y-4">
      {/* Before State */}
      <motion.div
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-red-400" />
          <span className="text-red-400 font-medium">Technical Debt</span>
        </div>
        <span className="text-red-400 font-mono text-lg font-bold">-$65,000</span>
      </motion.div>

      {/* Transformation Arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="text-center"
      >
        <TrendingUp className="h-6 w-6 text-purple-400 mx-auto animate-bounce" />
        <span className="text-xs text-purple-400 block mt-1">Converting...</span>
      </motion.div>

      {/* After State */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2, duration: 0.8 }}
        className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-medium">Career Equity</span>
        </div>
        <motion.span
          className="text-green-400 font-mono text-lg font-bold"
          animate={{ color: ['#22c55e', '#16a34a', '#22c55e'] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          +$65,000
        </motion.span>
      </motion.div>

      {/* Skills Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2.5 }}
        className="text-center pt-3 border-t border-gray-700/50"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          <span>Security Skills Mastered</span>
        </div>
      </motion.div>
    </div>
  </div>
)

// Workflow steps data
const STEPS: WorkflowStep[] = [
  // ZONE A: Setup
  {
    stepNumber: 0,
    title: "Connect & Forget",
    description: "You only do this once. Click 'Connect', authorize the CodeSensei GitHub App, and you are ready.",
    icon: Settings,
    visual: <SetupPermissionsVisual />,
    zone: 'setup'
  },
  // ZONE B: Daily Loop
  {
    stepNumber: 1,
    title: "Push & Open PR",
    description: "Work on your existing projects. Push your code to GitHub, then Create a Pull Request to trigger the system.",
    icon: GitBranch,
    visual: <GitPushVisual />,
    zone: 'loop'
  },
  {
    stepNumber: 2,
    title: "The Audit (The Trigger)",
    description: "Our Webhook detects the new PR instantly. The Bot calculates the 'Financial Debt' of your bugs and comments on the PR.",
    icon: Bot,
    visual: <LiabilityReceiptVisual />,
    zone: 'loop'
  },
  {
    stepNumber: 3,
    title: "The Knowledge Deck",
    description: "Click the receipt link to open the Dashboard. Review 3 Flashcards: The Concept, The Law (GDPR/PCI), and The Real-World Hack.",
    icon: Brain,
    visual: <KnowledgeDeckVisual />,
    zone: 'loop'
  },
  {
    stepNumber: 4,
    title: "Fix & Earn",
    description: "Select the secure pattern to fix the bug. The 'Red Debt' converts to 'Green Equity' in your Career Wallet.",
    icon: DollarSign,
    visual: <DebtConversionVisual />,
    zone: 'loop'
  }
]

// Hero Section Component
const HowItWorksHero = () => (
  <section className="pt-32 pb-20 px-4">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-7xl mx-auto text-center"
    >
      {/* Floating Badge */}
      <motion.div variants={fadeInUp} className="animate-float mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-full text-sm font-medium text-gray-400 dark:text-gray-300 mb-6">
          <Workflow className="mr-2 h-4 w-4" />
          Simple 5-Step Process
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        variants={fadeInUp}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
      >
        How <span className="gradient-text-primary">CodeSensei</span>{' '}
        <br className="hidden sm:block" />
        Transforms Your{' '}
        <span className="gradient-text-secondary">Workflow</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeInUp}
        className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-5xl mx-auto leading-relaxed"
      >
        Connect once, code normally, learn continuously.
        Turn every Pull Request into a career advancement opportunity.
      </motion.p>

      {/* Flow Indicator */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400"
      >
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
          Setup
        </span>
        <ArrowRight className="h-4 w-4 hidden sm:block" />
        <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
          Push
        </span>
        <ArrowRight className="h-4 w-4 hidden sm:block" />
        <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400">
          Learn
        </span>
        <ArrowRight className="h-4 w-4 hidden sm:block" />
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
          Earn
        </span>
      </motion.div>
    </motion.div>
  </section>
)

// Timeline Step Component
interface TimelineStepProps {
  step: WorkflowStep
  index: number
  isLast?: boolean
}

const TimelineStep = ({ step, index, isLast }: TimelineStepProps) => {
  const isSetup = step.zone === 'setup'
  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="relative flex flex-col lg:flex-row gap-8 items-start"
    >
      {/* Connecting Line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-0.5 h-full hidden lg:block z-0">
          {isSetup ? (
            <motion.div
              className="w-full h-32 border-l-2 border-dashed border-purple-500/50"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.15 + 0.5 }}
              style={{ originY: 0 }}
            />
          ) : (
            <motion.div
              className="w-full bg-gradient-to-b from-green-500/50 to-emerald-500/50"
              style={{
                height: step.stepNumber === 1 ? '120px' : '100%',
                originY: 0
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: index * 0.15 + 0.5 }}
            />
          )}
        </div>
      )}

      {/* Step Number Circle */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
        className="relative z-10 flex-shrink-0"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${isSetup
          ? 'bg-gradient-to-br from-purple-500 to-purple-600 glow-purple'
          : 'bg-gradient-to-br from-green-500 to-emerald-500 glow-green'
          }`}>
          {step.stepNumber}
        </div>
        {/* Icon Overlay */}
        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${isSetup ? 'bg-purple-700' : 'bg-green-700'
          }`}>
          <Icon className="h-3 w-3 text-white" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Zone Header for Step 0 */}
        {isSetup && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
              <Settings className="mr-2 h-4 w-4" />
              ZONE A: One-Time Setup
            </div>
          </motion.div>
        )}

        {/* Zone Header for Step 1 */}
        {step.stepNumber === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-4">
              <Workflow className="mr-2 h-4 w-4" />
              ZONE B: Daily Learning Loop
            </div>
          </motion.div>
        )}

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
          className="mb-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Step {step.stepNumber}: {step.title}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            {step.description}
          </p>
        </motion.div>

        {/* Visual Mock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.6 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden"
        >
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 pointer-events-none ${isSetup
            ? 'bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5'
            : 'bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5'
            }`} />

          {/* Visual Content */}
          <div className="relative z-10">
            {step.visual}
          </div>

          {/* Floating Elements */}
          <div className={`absolute top-2 right-2 w-8 h-8 rounded-full blur-md animate-pulse ${isSetup
            ? 'bg-gradient-to-br from-purple-400/20 to-purple-400/20'
            : 'bg-gradient-to-br from-green-400/20 to-green-400/20'
            }`} />
          <div className={`absolute bottom-2 left-2 w-10 h-10 rounded-full blur-md animate-pulse delay-1000 ${isSetup
            ? 'bg-gradient-to-br from-purple-400/20 to-purple-400/20'
            : 'bg-gradient-to-br from-green-400/20 to-green-400/20'
            }`} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main Client Component
export default function ClientHowItWorks() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HowItWorksHero />

      {/* Timeline Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Steps */}
            <div className="space-y-16 md:space-y-20">
              {STEPS.map((step, index) => (
                <TimelineStep
                  key={step.stepNumber}
                  step={step}
                  index={index}
                  isLast={index === STEPS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-20 pt-12 border-t border-foreground/10"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your <span className="gradient-text-primary">Coding Journey</span>?
            </h3>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who are turning their daily work into career advancement opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 glow-green text-lg"
            >
              Start Your Learning Journey
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}