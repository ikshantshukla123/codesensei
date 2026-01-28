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
        <div className="absolute top-full left-0 right-0 md:hidden bg-background border-t border-foreground/20 z-50 shadow-2xl backdrop-blur-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('#') && pathname === '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                    ? 'text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg'
                    : 'text-foreground hover:text-green-500 hover:bg-foreground/5'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}

            {/* Authentication section */}
            <div className="px-2 py-3 border-t border-foreground/10 mt-4 pt-6">
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