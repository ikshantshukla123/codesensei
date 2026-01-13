'use client'

import { useClerk } from '@clerk/nextjs'
import { Github, ArrowRight } from 'lucide-react'

export default function GitHubConnectButton() {
  const { openSignIn } = useClerk()

  const handleGitHubConnect = () => {
    openSignIn({
      appearance: {
        baseTheme: 'light',
        elements: {
          card: 'bg-white border border-gray-300 shadow-2xl rounded-lg',
          headerTitle: 'text-gray-900 text-xl font-bold',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 
            'bg-gray-900 border-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors',
          socialButtonsBlockButtonText: 'font-semibold text-white',
          socialButtonsIconBox: 'text-white',
          footerActionLink: 'text-green-600 hover:text-green-700 font-medium',
          formFieldInput: 'hidden !important',
          formFieldLabel: 'hidden !important',
          formFieldRow: 'hidden !important',
          dividerLine: 'hidden !important',
          dividerText: 'hidden !important',
          form: 'hidden !important',
          formButtonPrimary: 'hidden !important',
          footer: 'border-t border-gray-200 pt-4',
          footerAction: 'text-center',
          modalContent: 'bg-white',
          modalCloseButton: 'text-gray-500 hover:text-gray-700'
        },
        layout: {
          socialButtonsPlacement: 'top',
          showOptionalFields: false,
        },
        variables: {
          colorPrimary: '#059669',
          colorBackground: '#ffffff',
          colorInputBackground: '#f9fafb',
          colorInputText: '#111827',
          colorText: '#111827',
          colorTextSecondary: '#6b7280',
          borderRadius: '0.5rem'
        }
      },
      afterSignInUrl: '/dashboard',
      forceRedirectUrl: '/dashboard'
    })
  }

  return (
    <button
      onClick={handleGitHubConnect}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
    >
      <Github className="h-5 w-5" />
      <span>Connect with GitHub</span>
      <ArrowRight className="h-4 w-4 ml-auto" />
    </button>
  )
}