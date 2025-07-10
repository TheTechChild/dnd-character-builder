import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import MobileNavigation from './MobileNavigation'
import { SyncStatus } from './PWA/SyncStatus'
import { Shield, Swords } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCharacters } from '@/stores/hooks'

// Ornate frame for logo
const OrnateFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <svg 
      className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]" 
      viewBox="0 0 300 100" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-bright)" />
          <stop offset="50%" stopColor="var(--color-gold-medium)" />
          <stop offset="100%" stopColor="var(--color-gold-dark)" />
        </linearGradient>
      </defs>
      <path
        d="M 40,10 L 260,10 Q 280,10 280,30 L 280,70 Q 280,90 260,90 L 40,90 Q 20,90 20,70 L 20,30 Q 20,10 40,10"
        fill="none"
        stroke="url(#gold-gradient)"
        strokeWidth="2"
        opacity="0.8"
      />
      <circle cx="20" cy="50" r="8" fill="url(#gold-gradient)" opacity="0.6" />
      <circle cx="280" cy="50" r="8" fill="url(#gold-gradient)" opacity="0.6" />
    </svg>
    <div className="relative z-10">
      {children}
    </div>
  </div>
)

function Header() {
  const [scrollY, setScrollY] = useState(0)
  const characters = useCharacters()
  
  // Get total XP/level across all characters for display
  const totalLevel = characters.reduce((sum, char) => sum + (char.level || 1), 0)
  const characterCount = characters.length

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "relative safe-top overflow-hidden",
      "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
      "border-b-4 border-amber-900/50",
      "shadow-2xl"
    )}>
      {/* Stone texture overlay */}
      <div 
        className="absolute inset-0 texture-stone opacity-20"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Mystic glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-amber-900/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo with ornate frame */}
          <Link to="/" className="group">
            <OrnateFrame>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-gold-bright group-hover:text-gold-medium transition-colors" />
                <div>
                  <h1 className="text-xl md:text-2xl font-heading font-bold text-gold-gradient tracking-wide">
                    D&D Character Builder
                  </h1>
                  {characterCount > 0 && (
                    <p className="text-xs text-amber-200/70 font-display">
                      {characterCount} Heroes • Level {totalLevel} Total
                    </p>
                  )}
                </div>
                <Swords className="h-8 w-8 text-gold-bright group-hover:text-gold-medium transition-colors" />
              </div>
            </OrnateFrame>
          </Link>
          
          {/* Navigation area */}
          <div className="flex items-center gap-2 md:gap-6">
            <SyncStatus />
            <div className="hidden lg:block">
              <Navigation />
            </div>
            <MobileNavigation />
          </div>
        </div>
      </div>
      
      {/* Bottom border decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-bright to-transparent opacity-50" />
    </header>
  )
}

export default Header