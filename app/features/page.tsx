import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Force static generation for optimal performance
export const revalidate = false

// SEO Metadata
export const metadata: Metadata = {
  title: 'CodeSensei Ecosystem - Complete Security Training Platform',
  description: 'From Junior Dev to FinTech Security Pro in 4 Steps. Real-time liability tracking, trinity knowledge system, diff-match fixer, and career wallet.',
  keywords: ['security training', 'fintech', 'code security', 'career development', 'GDPR compliance'],
  openGraph: {
    title: 'CodeSensei Ecosystem',
    description: 'The complete security training platform for developers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeSensei Ecosystem',
    description: 'Security training reimagined for modern developers',
  },
}

// Lazy load the client component with optimized loading
const ClientFeatures = dynamic(() => import('./ClientFeatures'), {
  ssr: true, // Enable SSR for initial static generation
  loading: () => <FeaturesSkeleton />,
})

// Optimized loading skeleton
function FeaturesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-gray-100 dark:bg-gray-900 animate-pulse border-b border-gray-200 dark:border-gray-800" />

      {/* Hero Skeleton */}
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-4xl mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto" />
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="space-y-20 pb-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-1" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                </div>
                <div className="space-y-2 pt-4">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-1" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex space-x-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-md mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesPage() {
  return <ClientFeatures />
}