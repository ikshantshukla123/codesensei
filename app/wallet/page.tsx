import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function WalletPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">My Wallet</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your career capital and financial impact from secure coding.
        </p>
        
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4">Career Value</h3>
            <p className="text-3xl font-bold text-green-500">$0</p>
            <p className="text-sm text-gray-500 mt-2">Generated from secure coding practices</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4">Liability Saved</h3>
            <p className="text-3xl font-bold text-blue-500">$0</p>
            <p className="text-sm text-gray-500 mt-2">Prevented through early detection</p>
          </div>
        </div>
      </div>
    </div>
  )
}