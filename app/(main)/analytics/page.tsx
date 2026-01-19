import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">Analytics</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Deep insights into your coding patterns and security improvements.
        </p>
        
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-foreground mb-2">Vulnerabilities Found</h3>
            <p className="text-2xl font-bold text-red-500">0</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-foreground mb-2">Issues Fixed</h3>
            <p className="text-2xl font-bold text-green-500">0</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-foreground mb-2">Security Score</h3>
            <p className="text-2xl font-bold text-blue-500">--</p>
          </div>
        </div>
      </div>
    </div>
  )
}