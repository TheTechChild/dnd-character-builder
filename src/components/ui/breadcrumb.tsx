import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Glowing stone component
const GlowingStone = ({ 
  children, 
  isActive = false,
  isLast = false,
  className 
}: { 
  children: React.ReactNode
  isActive?: boolean
  isLast?: boolean
  className?: string 
}) => (
  <div className={cn("relative group", className)}>
    {/* Stone shape with glow effect */}
    <div className={cn(
      "relative px-4 py-2",
      "bg-gradient-to-br from-gray-700 to-gray-800",
      "border border-gray-600/50",
      "rounded-irregular",
      "transition-all duration-300",
      "shadow-md",
      !isLast && "hover:shadow-magical-mystic hover:border-mystic/50",
      isActive && "shadow-magical-gold border-gold/50"
    )}>
      {/* Glowing effect for active stone */}
      {isActive && (
        <div className="absolute inset-0 rounded-irregular animate-glow-pulse">
          <div className="absolute inset-0 bg-gradient-radial from-gold-bright/20 to-transparent blur-md" />
        </div>
      )}
      
      {/* Stone texture overlay */}
      <div className="absolute inset-0 rounded-irregular opacity-20 texture-stone pointer-events-none" />
      
      {/* Content */}
      <div className={cn(
        "relative z-10 font-display text-sm font-medium",
        "transition-colors duration-300",
        isLast ? "text-gray-400" : "text-gray-200 group-hover:text-gold-bright",
        isActive && "text-gold-bright"
      )}>
        {children}
      </div>
    </div>
    
    {/* Mystical particles for active stone */}
    {isActive && (
      <>
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-gold-bright/50 rounded-full animate-float blur-sm" />
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-gold-bright/40 rounded-full animate-float animation-delay-200 blur-sm" />
        <div className="absolute top-1/2 -left-2 w-1 h-1 bg-gold-bright/30 rounded-full animate-float animation-delay-400 blur-sm" />
      </>
    )}
  </div>
)

// Path connector (magical trail between stones)
const PathConnector = () => (
  <div className="relative mx-2">
    <ChevronRight className="h-4 w-4 text-gray-600" />
    {/* Glowing dots trail */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gold-bright/30 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-gold-bright/20 rounded-full animate-pulse animation-delay-200" />
      </div>
    </div>
  </div>
)

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const location = useLocation()
  
  // Auto-generate breadcrumbs from current path if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const generatedItems: BreadcrumbItem[] = [
      { label: 'Tavern', href: '/', icon: Home }
    ]
    
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      generatedItems.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      })
    })
    
    return generatedItems
  })()
  
  if (breadcrumbItems.length <= 1) return null
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("py-4 px-4 md:px-0", className)}
    >
      <style>{`
        @keyframes animation-delay-200 {
          animation-delay: 200ms;
        }
        
        @keyframes animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
      
      <ol className="flex items-center flex-wrap gap-y-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const isActive = item.href === location.pathname
          const Icon = item.icon
          
          return (
            <li key={index} className="flex items-center">
              <GlowingStone isActive={isActive} isLast={isLast}>
                {item.href && !isLast ? (
                  <Link 
                    to={item.href} 
                    className="flex items-center gap-2 hover:no-underline"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </GlowingStone>
              
              {!isLast && <PathConnector />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb