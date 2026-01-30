'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force dark theme only
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [])

  // Prevent hydration mismatch - show consistent SSR state
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 border border-foreground/10 cursor-not-allowed opacity-75"
        aria-label="Dark theme (fixed)"
        disabled
      >
        <Moon className="h-5 w-5 text-blue-600" />
      </button>
    )
  }

  return (
    <button
      className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 border border-foreground/10 cursor-not-allowed opacity-75"
      aria-label="Dark theme (fixed)"
      disabled
    >
      <Moon className="h-5 w-5 text-blue-600" />
    </button>
  )
}