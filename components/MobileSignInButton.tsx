'use client'

import { useClerk } from '@clerk/nextjs'

interface MobileSignInButtonProps {
  onClick?: () => void
}

export default function MobileSignInButton({ onClick }: MobileSignInButtonProps) {
  const { openSignIn } = useClerk()

  const handleSignIn = () => {
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
    onClick?.()
  }

  return (
    <button
      onClick={handleSignIn}
      className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
    >
      Sign In
    </button>
  )
}