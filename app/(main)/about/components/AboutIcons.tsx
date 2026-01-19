'use client'

import dynamic from 'next/dynamic'

// About page specific optimized icons
export const ShieldIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Shield })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const DollarSignIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.DollarSign })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const BrainIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Brain })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const UsersIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Users })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const TargetIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Target })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const AwardIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Award })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const CodeIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Code })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const TrendingUpIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.TrendingUp })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const GlobeIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Globe })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const ZapIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Zap })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)