import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LearningPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">My Learning</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your personalized security learning journey based on your code.
        </p>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4">Current Lessons</h3>
            <p className="text-gray-600 dark:text-gray-400">No active lessons yet. Connect a repository to start learning!</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4">Completed</h3>
            <p className="text-gray-600 dark:text-gray-400">You haven't completed any lessons yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}