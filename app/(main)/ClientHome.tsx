'use client'

import React, { Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'

// Lazy load heavy components for code splitting
const HeroSection = lazy(() => import('../components/HeroSection'))
const FeatureGrid = lazy(() => import('../components/FeatureGrid'))
const StatsSection = lazy(() => import('../components/StatsSection'))
const CTASection = lazy(() => import('../components/CTASection'))

// Section skeleton components
function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`py-20 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-3xl mx-auto" />
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
  )
}

function HeroSkeleton() {
  return (
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
  )
}

function StatsSkeleton() {
  return (
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
  )
}

export default function ClientHome() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FeatureGrid />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton className="bg-gray-50 dark:bg-gray-900/50" />}>
        <CTASection />
      </Suspense>
    </div>
  )
}