import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Force static generation for optimal performance
export const revalidate = false

// SEO Metadata
export const metadata: Metadata = {
  title: 'How It Works - CodeSensei | Transform Your Coding Workflow',
  description: 'Discover how CodeSensei transforms your development workflow into continuous learning. Get started with our platform, push code, learn from AI-powered debt analysis, and build career equity.',
  keywords: ['how it works', 'github integration', 'technical debt analysis', 'code learning', 'security training', 'career development', 'workflow automation'],
  openGraph: {
    title: 'How CodeSensei Works - Security Learning Made Simple',
    description: 'Connect. Code. Learn. Earn. Transform your development workflow into career growth.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How CodeSensei Works - Security Learning Made Simple',
    description: 'Connect. Code. Learn. Earn. Transform your development workflow into career growth.',
  },
}

// Lazy load the client component with optimized loading
const ClientHowItWorks = dynamic(() => import('./ClientHowItWorks'), {
  ssr: true,
  loading: () => <HowItWorksSkeleton />,
})

// Optimized loading skeleton
function HowItWorksSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-gray-100 dark:bg-gray-900 animate-pulse border-b border-gray-200 dark:border-gray-800" />

      {/* Hero Skeleton */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-5xl mx-auto" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Setup Section Skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-md mx-auto" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-8 items-start">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-md" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl" />
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HowItWorksPage() {
  return <ClientHowItWorks />
}