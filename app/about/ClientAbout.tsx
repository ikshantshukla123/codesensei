'use client'

import React, { Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'

// Lazy load heavy components for code splitting
const MissionHeader = lazy(() => import('./components/MissionHeader'))
const StorySection = lazy(() => import('./components/StorySection'))
const TeamSection = lazy(() => import('./components/TeamSection'))
const ValuesSection = lazy(() => import('./components/ValuesSection'))

// Section skeleton components
function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`py-20 px-4 ${className}`}>
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
  )
}

function HeroSkeleton() {
  return (
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
  )
}

export default function ClientAbout() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Suspense fallback={<HeroSkeleton />}>
        <MissionHeader />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <StorySection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton className="bg-gray-50 dark:bg-gray-900/50" />}>
        <ValuesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TeamSection />
      </Suspense>
    </div>
  )
}