'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import MobileSignInButton from './MobileSignInButton'

interface MobileMenuProps {
  navItems: Array<{ name: string; href: string }>
  isAuthenticated: boolean
}

export default function MobileMenu({ navItems, isAuthenticated }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden glass-card border-t border-foreground/10 bg-background/95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('#') && pathname === '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors duration-300 ${isActive
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* Authentication section */}
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-center">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10"
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <MobileSignInButton onClick={() => setIsMobileMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}