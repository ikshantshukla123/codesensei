'use client'

import React from 'react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Pricing Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Simple, <span className="gradient-text-primary">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Start learning security for free. Upgrade when you're ready to accelerate your career.
          </p>

          {/* Pricing cards would go here */}
          <div className="glass-card p-12 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 gradient-text-secondary">Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're finalizing our pricing plans to give you the best value.
              Join our beta to get early access!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}