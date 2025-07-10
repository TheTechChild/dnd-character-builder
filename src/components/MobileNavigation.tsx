import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Dices, Home, UserPlus, BookOpen, Settings, Scroll } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDiceStore } from '@/stores/diceStore'
import { cn } from '@/lib/utils'
import { useCharacters } from '@/stores/hooks'

interface MobileNavigationProps {
  className?: string
}

// Wax seal component for close button
const WaxSeal = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="relative w-12 h-12 group touch-target"
    aria-label="Close menu"
  >
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="wax-gradient">
          <stop offset="0%" stopColor="#8B0000" />
          <stop offset="50%" stopColor="#DC143C" />
          <stop offset="100%" stopColor="#8B0000" />
        </radialGradient>
      </defs>
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="url(#wax-gradient)"
        filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        fill="none"
        stroke="#660000"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
    <X className="absolute inset-0 m-auto h-6 w-6 text-red-200 group-hover:text-white transition-colors" />
  </button>
)

function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  
  const { showFloatingWidget, setShowFloatingWidget } = useDiceStore()
  const characters = useCharacters()
  const characterCount = characters.length

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { to: '/', label: 'The Tavern', icon: Home },
    { to: '/character/new', label: 'Forge New Hero', icon: UserPlus },
    { to: '/reference', label: 'Ancient Codex', icon: BookOpen },
    { to: '/settings', label: 'Arcane Settings', icon: Settings },
  ]

  // Gesture handling for swipe to close
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!isDragging && isOpen) {
        setStartX(e.touches[0].clientX)
        setIsDragging(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && isOpen) {
        const x = e.touches[0].clientX
        const diff = x - startX
        if (diff > 0) {
          setCurrentX(diff)
          if (drawerRef.current) {
            drawerRef.current.style.transform = `translateX(${diff}px)`
          }
        }
      }
    }

    const handleTouchEnd = () => {
      if (isDragging && currentX > 100) {
        closeMenu()
      }
      if (drawerRef.current) {
        drawerRef.current.style.transform = ''
      }
      setIsDragging(false)
      setCurrentX(0)
    }

    if (isOpen) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true })
      document.addEventListener('touchmove', handleTouchMove, { passive: true })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, isDragging, startX, currentX])

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Mobile menu button styled as a scroll */}
      <Button
        variant="ghost"
        size="small"
        onClick={toggleMenu}
        className={cn(
          "touch-target relative p-2",
          "bg-gradient-to-br from-amber-900/70 to-amber-950/70",
          "border-2 border-amber-800/50",
          "rounded-md",
          "text-amber-100 hover:text-gold-bright",
          "hover:from-amber-800/70 hover:to-amber-900/70",
          "hover:border-gold-medium/50",
          "transition-all duration-300",
          "hover:shadow-magical-gold"
        )}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <Scroll className="h-6 w-6 rotate-180" /> : <Scroll className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel - parchment style */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out",
          "texture-parchment shadow-2xl",
          "border-l-4 border-amber-900/50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          background: 'linear-gradient(135deg, #F4E8D0 0%, #D4C5A0 100%)',
        }}
      >
        <div className="flex flex-col h-full relative">
          {/* Parchment texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(139, 69, 19, 0.05) 10px,
                rgba(139, 69, 19, 0.05) 20px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 10px,
                rgba(139, 69, 19, 0.05) 10px,
                rgba(139, 69, 19, 0.05) 20px
              )`
            }} />
          </div>
          
          {/* Header with wax seal close button */}
          <div className="flex items-center justify-between p-6 relative">
            <div>
              <h2 className="text-2xl font-heading font-bold text-amber-900">Quest Menu</h2>
              {characterCount > 0 && (
                <p className="text-sm text-amber-700 font-display mt-1">
                  {characterCount} Heroes in Party
                </p>
              )}
            </div>
            <WaxSeal onClick={closeMenu} />
          </div>
          
          {/* Decorative divider */}
          <div className="px-6 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          </div>

          {/* Navigation items as scroll entries */}
          <nav className="flex-1 overflow-y-auto px-6 py-2">
            <ul className="space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.to} style={{ animationDelay: `${index * 50}ms` }}>
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-4 px-4 py-3 rounded-parchment",
                          "text-base font-display font-semibold",
                          "transition-all duration-300 touch-target",
                          "relative overflow-hidden",
                          isActive
                            ? "bg-amber-800/20 text-amber-900 shadow-inner"
                            : "text-amber-800 hover:bg-amber-700/10"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Background decoration for active state */}
                          {isActive && (
                            <div className="absolute inset-0 opacity-30">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />
                            </div>
                          )}
                          
                          {/* Decorative bullet point */}
                          <div className={cn(
                            "relative flex items-center justify-center",
                            "w-8 h-8 rounded-full",
                            "border-2 transition-all duration-300",
                            isActive 
                              ? "border-amber-700 bg-amber-600/20" 
                              : "border-amber-600/50 group-hover:border-amber-700"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          {/* Menu text with quill style */}
                          <span className="relative">
                            {item.label}
                            {isActive && (
                              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
                            )}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom actions with parchment style */}
          <div className="relative p-6">
            {/* Decorative divider */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
            
            <Button
              variant="ghost"
              onClick={() => {
                setShowFloatingWidget(!showFloatingWidget)
                closeMenu()
              }}
              className={cn(
                "w-full touch-target py-3",
                "bg-amber-700/20 hover:bg-amber-700/30",
                "border-2 border-amber-700/50 hover:border-amber-700",
                "rounded-parchment",
                "text-amber-900 font-display font-semibold",
                "transition-all duration-300",
                "group"
              )}
            >
              <Dices className={cn(
                "h-5 w-5 mr-3 transition-transform duration-300",
                "group-hover:rotate-180",
                showFloatingWidget && "rotate-180"
              )} />
              {showFloatingWidget ? "Sheathe Dice" : "Draw Dice"}
            </Button>
            
            {/* Parchment bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path 
                  d="M0,0 Q10,5 20,0 T40,0 T60,0 T80,0 T100,0 L100,20 L0,20 Z" 
                  fill="rgba(139, 69, 19, 0.1)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation