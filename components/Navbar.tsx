import Link from 'next/link'
import { Brain, Terminal } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import ActiveNavLink from './ActiveNavLink'

// Server Component - Static navigation structure
export default function Navbar() {
  const navItems = [
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

          {/* Right side - Brain icon, Theme toggle and CTA */}
          <div className="flex items-center space-x-4">
            {/* How It Works Brain Icon */}
            <Link
              href="/how-it-works"
              className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors duration-300 border border-purple-500/20 group"
              aria-label="How It Works"
            >
              <Brain className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
            </Link>

            {/* Theme Toggle - Client Component */}
            <ThemeToggle />

            {/* CTA Button - Desktop */}
            <button className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 glow-green">
              Connect GitHub
            </button>

            {/* Mobile Menu - Client Component */}
            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </div>
    </nav>
  )
}