'use client'

import React, { Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'

// Lazy load heavy components for code splitting
const HeroSection = lazy(() => import('./components/HeroSection'))
const AILearningPlatform = lazy(() => import('./components/AILearningPlatform'))
const LiabilityReceipt = lazy(() => import('./components/LiabilityReceipt'))
const TrinityKnowledge = lazy(() => import('./components/TrinityKnowledge'))
const DiffMatchFixer = lazy(() => import('./components/DiffMatchFixer'))
const CareerWallet = lazy(() => import('./components/CareerWallet'))
const CareerEvolutionLadder = lazy(() => import('./components/CareerEvolutionLadder'))

// Section skeleton components
function SectionSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-1" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
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
        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse max-w-4xl mx-auto" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto" />
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

function CareerLadderSkeleton() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-2xl mx-auto mb-4" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse max-w-3xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mx-auto mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FooterSkeleton() {
  return (
    <div className="py-12 px-4 border-t border-foreground/10">
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
  )
}

export default function ClientFeatures() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AILearningPlatform />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LiabilityReceipt />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TrinityKnowledge />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <DiffMatchFixer />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <CareerWallet />
      </Suspense>

      <Suspense fallback={<CareerLadderSkeleton />}>
        <CareerEvolutionLadder />
      </Suspense>
    </div>
  )
}