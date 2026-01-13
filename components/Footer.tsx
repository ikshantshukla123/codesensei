import React from 'react'
import { Terminal } from 'lucide-react'

// Server Component - No client-side logic needed
export default function Footer() {
  const footerLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' },
    { name: 'GitHub', href: 'https://github.com', external: true }
  ]

  return (
    <footer className="bg-background border-t border-foreground/10">
      {/* Philosophy Section */}
      <div className="py-12 px-4 border-t border-foreground/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Our Philosophy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We believe learning security shouldn't be about memorizing rules—it should be about understanding{' '}
              <em className="text-green-400 font-medium">Value</em>. Every bug you fix is money saved, and every risk you prevent is trust earned. We exist to turn the abstract anxiety of 'getting hacked' into a tangible, gamified path to mastery.{' '}
              <span className="text-purple-400 font-medium">Don't just code; Build with confidence.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="py-8 px-4 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 glow-green">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-primary">CodeSensei</span>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 text-sm font-medium"
                  {...(link.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  })}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-foreground/10 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>&copy; 2026 CodeSensei. Building the Financial Firewall for the Next Generation.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}