'use client'

import { useState } from 'react'

/** @Component.A11y.SkipLink */
export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      (mainContent as HTMLElement).focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        fixed top-4 left-4 z-[9999] px-4 py-2 
        bg-primary text-primary-foreground font-bold rounded-lg
        transform -translate-y-[150%] transition-transform duration-200
        focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${isFocused ? 'translate-y-0' : ''}
      `}
    >
      Skip to main content
    </a>
  )
}
