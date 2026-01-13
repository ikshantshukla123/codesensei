'use client'

import dynamic from 'next/dynamic'
import { LucideIcon } from 'lucide-react'

// Optimized icon loader that only imports needed icons for home page
interface IconProps {
  name: string
  className?: string
}

// Cache for loaded icons
const iconCache = new Map()

export function OptimizedIcon({ name, className = "w-5 h-5", ...props }: IconProps) {
  if (iconCache.has(name)) {
    const CachedIcon = iconCache.get(name)
    return <CachedIcon className={className} {...props} />
  }

  const IconComponent = dynamic(
    () => import('lucide-react').then((mod) => {
      const icon = mod[name as keyof typeof mod] as LucideIcon
      iconCache.set(name, icon)
      return icon
    }),
    {
      ssr: false,
      loading: () => (
        <div
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
        />
      )
    }
  )

  return <IconComponent className={className} {...props} />
}

// Home page specific optimized icons
export const GithubIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Github })),
  { ssr: false, loading: () => <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const PlayIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Play })),
  { ssr: false, loading: () => <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const ArrowRightIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.ArrowRight })),
  { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const ShieldIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Shield })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const BotIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Bot })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const ZapIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Zap })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

export const WalletIcon = dynamic(
  () => import('lucide-react').then(mod => ({ default: mod.Wallet })),
  { ssr: false, loading: () => <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" /> }
)

// Small icons bundle for frequently used icons
export const SmallIconsBundle = {
  DollarSign: dynamic(() => import('lucide-react').then(mod => ({ default: mod.DollarSign })), { ssr: false }),
  TrendingUp: dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), { ssr: false }),
  Users: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), { ssr: false }),
  CheckCircle: dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), { ssr: false }),
  Terminal: dynamic(() => import('lucide-react').then(mod => ({ default: mod.Terminal })), { ssr: false }),
}