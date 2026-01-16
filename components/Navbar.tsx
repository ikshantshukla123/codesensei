import Link from 'next/link'
import { Brain, Terminal, Github } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import ActiveNavLink from './ActiveNavLink'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import SignInButton from './SignInButton'

// Server Component - Static navigation structure
export default async function Navbar() {
  const { userId } = await auth()

  // Different nav items based on authentication status
  const navItems = userId ? [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Wallet', href: '/wallet' },
    { name: 'My Learning', href: '/learning' },
    { name: 'Analytics', href: '/analytics' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 glow-green group-hover:scale-105 transition-transform duration-300">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-primary">
              CodeSensei
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <ActiveNavLink key={item.name} name={item.name} href={item.href} />
            ))}
          </div>

          {/* Right side - Brain icon, GitHub icon, Theme toggle and CTA */}
          <div className="flex items-center space-x-4">
            {/* How It Works Brain Icon */}
            <Link
              href="/how-it-works"
              className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors duration-300 border border-purple-500/20 group"
              aria-label="How It Works"
            >
              <Brain className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
            </Link>

            {/* GitHub Learning Icon - Only show for authenticated users */}
            {userId && (
              <Link
                href="/learn/github"
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-300 border border-blue-500/20 group"
                aria-label="Learn GitHub"
              >
                <Github className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
              </Link>
            )}

            {/* Theme Toggle - Client Component */}
            <ThemeToggle />

            {/* Authentication - Show different buttons based on auth state */}
            {userId ? (
              <div className="hidden md:flex items-center space-x-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton />
            )}

            {/* Mobile Menu - Client Component */}
            <MobileMenu navItems={navItems} isAuthenticated={!!userId} />
          </div>
        </div>
      </div>
    </nav>
  )
}