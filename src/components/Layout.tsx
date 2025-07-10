import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { FloatingDiceWidget } from './dice/FloatingDiceWidget'
import { cn } from '@/lib/utils'

// Magical particle component
const MagicalParticle = ({ delay }: { delay: number }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${15 + Math.random() * 10}s`
  }
  
  return (
    <div 
      className="particle absolute w-1 h-1 bg-gold-bright/30 rounded-full"
      style={style}
    />
  )
}

// Corner decoration component
const CornerDecoration = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 rotate-90',
    bl: 'bottom-0 left-0 -rotate-90',
    br: 'bottom-0 right-0 rotate-180'
  }
  
  return (
    <div className={cn(
      "absolute w-24 h-24 md:w-32 md:h-32 pointer-events-none",
      positionClasses[position]
    )}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`corner-gradient-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-bright)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-gold-dark)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0,0 L 0,40 Q 0,50 10,50 L 50,50 Q 60,50 60,40 L 60,10 Q 60,0 50,0 Z"
          fill={`url(#corner-gradient-${position})`}
        />
        <path
          d="M 0,0 L 0,40 Q 0,50 10,50 L 50,50 Q 60,50 60,40 L 60,10 Q 60,0 50,0 Z"
          fill="none"
          stroke="var(--color-gold-medium)"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

function Layout() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  
  // Page transition effect
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])
  
  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <MagicalParticle key={i} delay={i * 0.5} />
  ))
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-subtle">
      {/* Global styles for scrollbar */}
      <style>{`
        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--color-bg-dark);
          border-radius: 6px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--color-gold-dark), var(--color-gold-medium));
          border-radius: 6px;
          border: 2px solid var(--color-bg-dark);
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, var(--color-gold-medium), var(--color-gold-bright));
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--color-gold-medium) var(--color-bg-dark);
        }
        
        /* Particle animation */
        @keyframes float-up {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) translateX(-10px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(10vh) translateX(10px) scale(1);
          }
          100% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
        }
        
        .particle {
          animation: float-up linear infinite;
          filter: blur(1px);
          box-shadow: 0 0 6px currentColor;
        }
        
        /* Page transition */
        .page-transition {
          animation: pageEnter 0.3s ease-out;
        }
        
        .page-transition-exit {
          animation: pageExit 0.3s ease-in;
        }
        
        @keyframes pageEnter {
          from {
            opacity: 0;
            filter: blur(4px);
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }
        
        @keyframes pageExit {
          from {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
          to {
            opacity: 0;
            filter: blur(4px);
            transform: translateY(-10px);
          }
        }
      `}</style>
      
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {particles}
      </div>
      
      {/* Corner decorations */}
      <CornerDecoration position="tl" />
      <CornerDecoration position="tr" />
      <CornerDecoration position="bl" />
      <CornerDecoration position="br" />
      
      {/* Main layout structure */}
      <Header />
      <main 
        ref={mainRef}
        className={cn(
          "flex-1 relative z-10",
          isTransitioning ? "page-transition-exit" : "page-transition"
        )}
      >
        <Outlet />
      </main>
      <Footer />
      <FloatingDiceWidget />
    </div>
  )
}

export default Layout