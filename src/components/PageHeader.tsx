import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  actions?: ReactNode
  icon?: ReactNode
  className?: string
}

// Decorative underline component
const DecorativeUnderline = () => (
  <div className="relative mt-3 mb-4">
    {/* Main decorative line */}
    <div className="h-1 bg-gradient-to-r from-transparent via-gold-bright to-transparent rounded-full" />
    
    {/* Center ornament */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-gold-bright">
        <path
          d="M 0,10 Q 10,5 20,10 Q 30,15 40,10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="20" cy="10" r="3" fill="currentColor" />
      </svg>
    </div>
    
    {/* Side ornaments */}
    <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
      <div className="w-2 h-2 bg-gold-medium rounded-full animate-pulse" />
    </div>
    <div className="absolute top-1/2 right-1/4 -translate-y-1/2">
      <div className="w-2 h-2 bg-gold-medium rounded-full animate-pulse animation-delay-200" />
    </div>
  </div>
)

export function PageHeader({ 
  title, 
  subtitle, 
  description, 
  actions, 
  icon,
  className 
}: PageHeaderProps) {
  return (
    <header className={cn(
      "relative pb-6 md:pb-8",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-gradient-radial from-gold-bright/5 to-transparent blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        {/* Title section */}
        <div className="text-center mb-4">
          {icon && (
            <div className="flex justify-center mb-4 text-gold-bright">
              {icon}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gold-gradient tracking-wide">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-2 text-lg md:text-xl font-display text-gold-medium">
              {subtitle}
            </p>
          )}
          
          <DecorativeUnderline />
          
          {description && (
            <p className="mt-4 text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Actions section */}
        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {actions}
          </div>
        )}
      </div>
      
      {/* Additional decorative elements */}
      <style>{`
        @keyframes animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </header>
  )
}

// Preset variations for common use cases
export function HeroPageHeader(props: PageHeaderProps) {
  return (
    <PageHeader 
      {...props} 
      className={cn(
        "pt-12 pb-12 md:pt-16 md:pb-16",
        props.className
      )}
    />
  )
}

export function SimplePageHeader(props: Omit<PageHeaderProps, 'description' | 'icon'>) {
  return (
    <PageHeader 
      {...props}
      className={cn(
        "pt-8 pb-6",
        props.className
      )}
    />
  )
}

export default PageHeader