'use client'

import dynamic from 'next/dynamic'
import { LucideIcon } from 'lucide-react'

// Optimized icon loader that only imports needed icons
interface IconProps {
  name: string
  className?: string
  size?: number
}

// Cache for loaded icons to prevent re-importing
const iconCache = new Map()

export function OptimizedIcon({ name, className = "w-5 h-5", ...props }: IconProps) {
  // Check cache first
  if (iconCache.has(name)) {
    const CachedIcon = iconCache.get(name)
    return <CachedIcon className={className} {...props} />
  }

  // Dynamic import with loading state
  const IconComponent = dynamic(
    () => import('lucide-react').then((mod) => {
      const icon = mod[name as keyof typeof mod] as LucideIcon
      iconCache.set(name, icon) // Cache the icon
      return icon
    }),
    {
      ssr: false,
      loading: () => (
        <div
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
          style={{ width: '1.25rem', height: '1.25rem' }}
        />
      )
    }
  )

  return <IconComponent className={className} {...props} />
}

// Pre-defined optimized icons for common use cases
export const ReceiptIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Receipt })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const WalletIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Wallet })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const ShieldIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Shield })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const GraduationCapIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.GraduationCap })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const CheckCircleIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.CheckCircle })),
  { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" /> }
)

export const AlertTriangleIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.AlertTriangle })),
  { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const CodeIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Code })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const BookOpenIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.BookOpen })),
  { ssr: false, loading: () => <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const BriefcaseIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Briefcase })),
  { ssr: false, loading: () => <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const BotIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Bot })),
  { ssr: false, loading: () => <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

// Small icons bundle for frequently used icons
export const SmallIconsBundle = {
  Clock: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), { ssr: false }),
  TrendingUp: dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false }),
  DollarSign: dynamic(() => import('lucide-react').then(mod => ({ default: mod.DollarSign })), { ssr: false }),
  Trophy: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Trophy })), { ssr: false }),
  Target: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), { ssr: false }),
  Brain: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), { ssr: false }),
  FileText: dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), { ssr: false }),
  ArrowUp: dynamic(() => import('lucide-react').then(mod => ({ default: mod.ArrowUp })), { ssr: false }),
}