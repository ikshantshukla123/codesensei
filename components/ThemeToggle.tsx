'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }

  // Prevent hydration mismatch - show consistent SSR state
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 border border-foreground/10"
        aria-label="Toggle theme"
        disabled
      >
        <Moon className="h-5 w-5 text-blue-600" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 border border-foreground/10"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600" />
      )}
    </button>
  )
}