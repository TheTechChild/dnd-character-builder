import { NavLink } from 'react-router-dom'
import { Home, UserPlus, BookOpen, Settings, Dices } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDiceStore } from '@/stores/diceStore'
import { cn } from '@/lib/utils'

// Custom SVG for tavern sign shape
const TavernSign = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative group", className)}>
    <svg 
      className="absolute inset-0 w-full h-full" 
      viewBox="0 0 200 80" 
      preserveAspectRatio="none"
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))' }}
    >
      <path
        d="M 20,5 Q 10,5 10,15 L 10,55 Q 10,65 20,65 L 180,65 Q 190,65 190,55 L 190,15 Q 190,5 180,5 L 20,5"
        fill="currentColor"
        className="text-amber-900 dark:text-amber-950"
        stroke="rgba(146, 64, 14, 0.8)"
        strokeWidth="2"
      />
      <path
        d="M 20,5 Q 10,5 10,15 L 10,55 Q 10,65 20,65 L 180,65 Q 190,65 190,55 L 190,15 Q 190,5 180,5 L 20,5"
        fill="url(#wood-grain)"
        opacity="0.3"
      />
      <defs>
        <pattern id="wood-grain" x="0" y="0" width="100" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0,5 Q 25,3 50,5 T 100,5" stroke="rgba(92, 51, 23, 0.3)" strokeWidth="0.5" fill="none" />
          <path d="M 0,8 Q 25,6 50,8 T 100,8" stroke="rgba(92, 51, 23, 0.2)" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
    </svg>
    <div className="relative z-10 px-6 py-3">
      {children}
    </div>
  </div>
)

function Navigation() {
  const { showFloatingWidget, setShowFloatingWidget } = useDiceStore()

  const navItems = [
    { to: '/', label: 'Tavern', icon: Home },
    { to: '/character/new', label: 'New Hero', icon: UserPlus },
    { to: '/reference', label: 'Codex', icon: BookOpen },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="flex items-center gap-8 nav-tavern">
      <style>{`
        @keyframes tavern-swing {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        
        @keyframes rune-glow {
          0%, 100% { opacity: 0.6; filter: blur(2px); }
          50% { opacity: 1; filter: blur(4px); }
        }
        
        .nav-tavern .tavern-sign-swing {
          animation: tavern-swing 3s ease-in-out infinite;
          transform-origin: center top;
        }
        
        .nav-tavern .tavern-sign-hover:hover {
          animation: tavern-swing 0.5s ease-in-out;
        }
        
        .nav-tavern .rune-active::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 20px;
          background: radial-gradient(ellipse at center, var(--color-gold-bright) 0%, transparent 70%);
          animation: rune-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative transform transition-all duration-300",
                "hover:scale-105 hover:-translate-y-1",
                isActive && "scale-105 -translate-y-1"
              )
            }
          >
            {({ isActive }) => (
              <TavernSign className={cn(
                "tavern-sign-hover",
                isActive && "tavern-sign-swing"
              )}>
                <div className={cn(
                  "flex items-center gap-2 font-display text-sm font-semibold",
                  "text-amber-100 dark:text-amber-50",
                  "transition-all duration-300",
                  isActive && "rune-active text-gold-bright"
                )}>
                  <Icon className="h-4 w-4" />
                  <span className="tracking-wide">{item.label}</span>
                </div>
              </TavernSign>
            )}
          </NavLink>
        )
      })}
      
      <Button
        variant="ghost"
        size="small"
        onClick={() => setShowFloatingWidget(!showFloatingWidget)}
        className={cn(
          "relative ml-4 p-3 rounded-full",
          "bg-gradient-to-br from-amber-900/50 to-amber-950/50",
          "border border-amber-800/50",
          "text-amber-100 hover:text-gold-bright",
          "hover:from-amber-800/50 hover:to-amber-900/50",
          "hover:border-gold-medium/50",
          "transition-all duration-300",
          "hover:shadow-magical-gold",
          showFloatingWidget && "shadow-magical-gold text-gold-bright"
        )}
        title={showFloatingWidget ? "Hide dice roller" : "Show dice roller"}
      >
        <Dices className={cn(
          "h-5 w-5 transition-transform duration-300",
          showFloatingWidget && "rotate-180"
        )} />
      </Button>
    </nav>
  )
}

export default Navigation