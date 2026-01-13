'use client'

import React from 'react'
import { AnimatedSection, FadeInContainer, FadeInItem } from './AnimatedSection'
import { CheckCircleIcon } from './OptimizedIcons'

export default function HeroSection() {
  const features = ['Real-time Analysis', 'Legal Context', 'Active Learning', 'Career Growth']

  return (
    <AnimatedSection className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <FadeInContainer className="space-y-6">
          <FadeInItem>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-full text-sm font-medium text-gray-400 dark:text-gray-300 mb-6">
              🚀 The Complete Ecosystem
            </div>
          </FadeInItem>

          <FadeInItem>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground">
              The <span className="gradient-text-primary">CodeSensei</span> Ecosystem
            </h1>
          </FadeInItem>

          <FadeInItem>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              From Junior Dev to FinTech Security Pro in 4 Steps.
            </p>
          </FadeInItem>

          <FadeInItem>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {features.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </FadeInItem>
        </FadeInContainer>
      </div>
    </AnimatedSection>
  )
}