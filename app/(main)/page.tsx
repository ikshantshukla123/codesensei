import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Force static generation for optimal performance
export const revalidate = false

// SEO Metadata
export const metadata: Metadata = {
  title: 'CodeSensei - Turn Technical Debt into Career Capital',
  description: 'The world\'s first AI platform that teaches you the dollar cost of every bug you write. Master FinTech security before you graduate.',
  keywords: ['security training', 'technical debt', 'career capital', 'fintech security', 'code education', 'AI platform'],
  openGraph: {
    title: 'CodeSensei - Security Training Reimagined',
    description: 'Transform your coding skills with real-time financial impact analysis',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeSensei - Turn Technical Debt into Career Capital',
    description: 'Master FinTech security with AI-powered training',
  },
}

// Lazy load the client component with optimized loading
const ClientHome = dynamic(() => import('./ClientHome'), {
  ssr: true,
  loading: () => <HomeSkeleton />,
})

// Optimized loading skeleton
function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-gray-100 dark:bg-gray-900 animate-pulse border-b border-gray-200 dark:border-gray-800" />

      {/* Hero Skeleton */}
      <div className="pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-5xl mx-auto" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-4xl mx-auto" />
          </div>
          <div className="flex justify-center gap-4">
            <div className="h-14 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-14 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse max-w-5xl mx-auto" />
        </div>
      </div>

      {/* Features Grid Skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-3xl mx-auto" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center space-y-3">
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-32 mx-auto" />
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4">
            <div className="flex items-center space-x-2">
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

export default async function HomePage() {

   const { userId } = await auth();

  // ✅ If user logged in, block landing page
  if (userId) {
    redirect("/dashboard");
  }
  return <ClientHome />
}
