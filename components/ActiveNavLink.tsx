'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ActiveNavLinkProps {
  name: string
  href: string
}

export default function ActiveNavLink({ name, href }: ActiveNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href.startsWith('#') && pathname === '/')

  return (
    <Link
      href={href}
      className={`font-medium relative group transition-colors duration-300 ${isActive
        ? 'text-green-500 dark:text-green-400'
        : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-white'
        }`}
    >
      {name}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}></span>
    </Link>
  )
}