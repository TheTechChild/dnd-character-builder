import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'alternate' | 'highlight'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  showDivider?: boolean
  title?: string
  subtitle?: string
}

// Decorative divider component
export const SectionDivider = ({ className }: { className?: string }) => (
  <div className={cn(
    "relative py-8 md:py-12",
    className
  )}>
    <div className="container mx-auto px-4">
      <div className="relative">
        {/* Main divider line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
        
        {/* Center ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-subtle px-6">
          <svg width="60" height="30" viewBox="0 0 60 30" className="text-amber-700/70">
            {/* Left flourish */}
            <path
              d="M 5,15 Q 15,10 20,15 Q 25,20 30,15"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Center diamond */}
            <rect
              x="27" y="12" width="6" height="6"
              transform="rotate(45 30 15)"
              fill="currentColor"
            />
            {/* Right flourish */}
            <path
              d="M 30,15 Q 35,10 40,15 Q 45,20 55,15"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        
        {/* Side decorations */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
          <div className="w-1.5 h-1.5 bg-amber-700/50 rounded-full" />
        </div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2">
          <div className="w-1.5 h-1.5 bg-amber-700/50 rounded-full" />
        </div>
      </div>
    </div>
  </div>
)

export function PageSection({
  children,
  className,
  variant = 'default',
  spacing = 'md',
  showDivider = false,
  title,
  subtitle
}: PageSectionProps) {
  const spacingClasses = {
    sm: 'py-6 md:py-8',
    md: 'py-8 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-20'
  }
  
  const variantClasses = {
    default: '',
    alternate: 'bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50',
    highlight: 'bg-gradient-to-br from-amber-900/10 via-amber-800/5 to-amber-900/10'
  }
  
  return (
    <>
      {showDivider && <SectionDivider />}
      
      <section className={cn(
        "relative",
        spacingClasses[spacing],
        variantClasses[variant],
        className
      )}>
        {/* Subtle background pattern for alternate sections */}
        {variant === 'alternate' && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(255, 215, 0, 0.03) 20px,
                  rgba(255, 215, 0, 0.03) 40px
                )`
              }}
            />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          {(title || subtitle) && (
            <div className="text-center mb-8 md:mb-12">
              {title && (
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-gradient mb-3">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg text-gray-400 font-display max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
              
              {/* Simple decorative underline */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-medium" />
                <div className="w-2 h-2 bg-gold-bright rounded-full" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-medium" />
              </div>
            </div>
          )}
          
          {/* Section content */}
          {children}
        </div>
      </section>
    </>
  )
}

// Preset variations
export function HeroSection({ children, ...props }: Omit<PageSectionProps, 'spacing'>) {
  return (
    <PageSection spacing="xl" {...props}>
      {children}
    </PageSection>
  )
}

export function ContentSection({ children, ...props }: PageSectionProps) {
  return (
    <PageSection {...props}>
      <div className="prose prose-invert prose-gold max-w-none">
        {children}
      </div>
    </PageSection>
  )
}

export function GridSection({ children, columns = 3, ...props }: PageSectionProps & { columns?: number }) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <PageSection {...props}>
      <div className={cn(
        "grid gap-6 md:gap-8",
        gridClasses[columns as keyof typeof gridClasses] || gridClasses[3]
      )}>
        {children}
      </div>
    </PageSection>
  )
}

export default PageSection