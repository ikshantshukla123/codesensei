import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Force static generation for optimal performance
export const revalidate = false

// SEO Metadata
export const metadata: Metadata = {
  title: 'About CodeSensei - Building the Financial Firewall',
  description: 'Empowering computer science students with economic intelligence to write secure, valuable code from day one. Learn about our mission and team.',
  keywords: ['about codesensai', 'financial firewall', 'security education', 'computer science', 'team', 'mission'],
  openGraph: {
    title: 'About CodeSensei - Our Mission',
    description: 'Building the Financial Firewall for the Next Generation of Developers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About CodeSensei - Financial Firewall',
    description: 'Empowering students with security intelligence',
  },
}

// Lazy load the client component with optimized loading
const ClientAbout = dynamic(() => import('./ClientAbout'), {
  ssr: true,
  loading: () => <AboutSkeleton />,
})

// Optimized loading skeleton
function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-gray-100 dark:bg-gray-900 animate-pulse border-b border-gray-200 dark:border-gray-800" />

      {/* Hero Skeleton */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
          <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-5xl mx-auto" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-4xl mx-auto" />
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-6 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="space-y-20 pb-20">
        {[1, 2, 3].map(i => (
          <div key={i} className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                  </div>
                </div>
                <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              </div>
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
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return <ClientAbout />
}