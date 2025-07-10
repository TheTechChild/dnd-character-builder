import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  Shield, Scroll, Dices, 
  Users, BookOpen, Sparkles, Flame,
  Map, Trophy, Coins, Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PageSection from '@/components/PageSection'
import { useDiceStore } from '@/stores/diceStore'

// Torch flame component
const TorchFlame = ({ position }: { position: 'left' | 'right' }) => {
  return (
    <div className={cn(
      "absolute top-20 hidden lg:block",
      position === 'left' ? 'left-8' : 'right-8'
    )}>
      <div className="relative">
        {/* Torch base */}
        <div className="w-8 h-24 bg-gradient-to-b from-amber-900 to-amber-950 rounded-sm shadow-lg" />
        
        {/* Flame container */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 w-16 h-16 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
            
            {/* Inner flame */}
            <Flame 
              className="relative w-12 h-12 text-orange-500 animate-flicker"
              fill="currentColor"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated particle component
const MagicalParticle = ({ delay, duration }: { delay: number; duration: number }) => {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
  
  return (
    <div 
      className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float-up"
      style={style}
    />
  )
}

// Quest notice button component
const QuestNotice = ({ 
  to, 
  title, 
  description, 
  icon: Icon,
  variant = 'primary' 
}: { 
  to: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative block p-6 rounded-parchment transition-all duration-300",
        "transform hover:scale-105 hover:rotate-1",
        "shadow-lg hover:shadow-2xl",
        variant === 'primary' 
          ? "bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300"
          : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-400"
      )}
    >
      {/* Wax seal */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-700 rounded-full shadow-lg 
                      flex items-center justify-center transform rotate-12">
        <Icon className="w-6 h-6 text-red-100" />
      </div>
      
      {/* Paper texture */}
      <div 
        className="absolute inset-0 rounded-parchment opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 2px,
            rgba(139, 69, 19, 0.1) 4px
          )`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className={cn(
          "text-2xl font-heading font-bold mb-2",
          variant === 'primary' ? "text-amber-900" : "text-gray-800"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm",
          variant === 'primary' ? "text-amber-700" : "text-gray-600"
        )}>
          {description}
        </p>
      </div>
      
      {/* Hover effect */}
      {isHovered && (
        <div className="absolute inset-0 rounded-parchment bg-gradient-to-br from-gold-bright/10 to-transparent pointer-events-none" />
      )}
    </Link>
  )
}

// Guild posting card component
const GuildPosting = ({
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  delay?: number
}) => {
  return (
    <div 
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 
                 border-2 border-gray-700 shadow-xl transform transition-all duration-300
                 hover:scale-105 hover:shadow-magical-gold group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative corner */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold-medium rounded-tl-lg" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold-medium rounded-tr-lg" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold-medium rounded-bl-lg" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold-medium rounded-br-lg" />
      
      {/* Icon with animation */}
      <div className="mb-4 relative">
        <div className="absolute inset-0 bg-gold-bright/20 rounded-full blur-xl 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative w-12 h-12 text-gold-bright group-hover:animate-pulse" />
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-heading font-bold text-gold-bright mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function Home() {
  const [scrollY, setScrollY] = useState(0)
  const { setShowFloatingWidget } = useDiceStore()
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Generate particles
  const particles = Array.from({ length: 15 }, (_, i) => (
    <MagicalParticle key={i} delay={i * 0.8} duration={10 + Math.random() * 5} />
  ))
  
  return (
    <div className="relative min-h-screen">
      {/* Custom styles */}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1) rotate(-2deg); }
          25% { opacity: 0.9; transform: scale(1.1) rotate(2deg); }
          50% { opacity: 0.95; transform: scale(0.95) rotate(-1deg); }
          75% { opacity: 0.85; transform: scale(1.05) rotate(1deg); }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        .animate-flicker {
          animation: flicker 3s ease-in-out infinite;
        }
        
        .animate-float-up {
          animation: float-up linear infinite;
        }
      `}</style>
      
      {/* Animated background with parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 -z-10"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        {/* Medieval pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255, 215, 0, 0.05) 20px,
              rgba(255, 215, 0, 0.05) 40px
            )`
          }}
        />
      </div>
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>
      
      {/* Torch flames */}
      <TorchFlame position="left" />
      <TorchFlame position="right" />
      
      {/* Hero section */}
      <PageSection spacing="xl" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glowing welcome message */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 relative">
            <span className="text-gold-gradient text-glow-gold">
              Welcome to the Tavern
            </span>
            <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-gold-bright animate-pulse" />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-display">
            Where legends are forged and adventures begin
          </p>
          
          {/* Quest notice CTAs */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <QuestNotice
              to="/character/new"
              title="Begin Your Journey"
              description="Register as a new adventurer and forge your destiny"
              icon={Shield}
              variant="primary"
            />
            
            <QuestNotice
              to="/characters"
              title="Party Roster"
              description="View your assembled heroes and their tales"
              icon={Users}
              variant="secondary"
            />
          </div>
        </div>
      </PageSection>
      
      {/* Quick actions section */}
      <PageSection variant="alternate" spacing="lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-gradient mb-4">
              The Adventurer's Guild
            </h2>
            <p className="text-lg text-gray-400 font-display">
              Choose your path, brave soul
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/character/new"
              className="group relative block"
            >
              <div className="relative p-8 bg-gradient-to-br from-amber-900/20 to-amber-950/20 
                              rounded-lg border-2 border-amber-800/50 
                              transform transition-all duration-300
                              group-hover:scale-105 group-hover:border-gold-medium
                              group-hover:shadow-magical-gold">
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-gold-bright 
                                    group-hover:animate-pulse" />
                  <h3 className="text-xl font-heading font-bold text-gold-bright mb-2">
                    Guild Registration
                  </h3>
                  <p className="text-sm text-amber-200">Create a new hero</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/characters"
              className="group relative block"
            >
              <div className="relative p-8 bg-gradient-to-br from-purple-900/20 to-purple-950/20 
                              rounded-lg border-2 border-purple-800/50 
                              transform transition-all duration-300
                              group-hover:scale-105 group-hover:border-mystic-bright
                              group-hover:shadow-magical-mystic">
                <div className="text-center">
                  <Scroll className="w-16 h-16 mx-auto mb-4 text-mystic-bright 
                                    group-hover:animate-pulse" />
                  <h3 className="text-xl font-heading font-bold text-mystic-bright mb-2">
                    Party Roster Board
                  </h3>
                  <p className="text-sm text-purple-200">View your heroes</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/reference"
              className="group relative block"
            >
              <div className="relative p-8 bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 
                              rounded-lg border-2 border-emerald-800/50 
                              transform transition-all duration-300
                              group-hover:scale-105 group-hover:border-emerald-400
                              group-hover:shadow-magical-emerald">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-emerald-400 
                                      group-hover:animate-pulse" />
                  <h3 className="text-xl font-heading font-bold text-emerald-400 mb-2">
                    Ancient Tome
                  </h3>
                  <p className="text-sm text-emerald-200">Reference guide</p>
                </div>
              </div>
            </Link>
            
            <button
              onClick={() => setShowFloatingWidget(true)}
              className="group relative block w-full text-left"
            >
              <div className="relative p-8 bg-gradient-to-br from-red-900/20 to-red-950/20 
                              rounded-lg border-2 border-red-800/50 
                              transform transition-all duration-300
                              group-hover:scale-105 group-hover:border-red-400
                              group-hover:shadow-magical-crimson">
                <div className="text-center">
                  <Dices className="w-16 h-16 mx-auto mb-4 text-red-400 
                                   group-hover:animate-pulse" />
                  <h3 className="text-xl font-heading font-bold text-red-400 mb-2">
                    Gaming Table
                  </h3>
                  <p className="text-sm text-red-200">Roll the dice</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </PageSection>
      
      {/* Feature showcase section */}
      <PageSection spacing="lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-gradient mb-4">
              Guild Services & Amenities
            </h2>
            <p className="text-lg text-gray-400 font-display">
              Everything an adventurer needs for their journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GuildPosting
              icon={Trophy}
              title="Complete Character Creation"
              description="Forge your hero with full D&D 5th Edition rules, from race and class to background and beyond"
              delay={0}
            />
            
            <GuildPosting
              icon={Sparkles}
              title="Automatic Calculations"
              description="Let our mystical arithmancy handle ability scores, modifiers, and proficiency bonuses"
              delay={100}
            />
            
            <GuildPosting
              icon={Map}
              title="Character Export"
              description="Transcribe your hero's tale to JSON scrolls, PDF tomes, or simple parchment"
              delay={200}
            />
            
            <GuildPosting
              icon={Shield}
              title="Offline Adventures"
              description="Your heroes persist even in the deepest dungeons without magical connection"
              delay={300}
            />
            
            <GuildPosting
              icon={Coins}
              title="Free Forever"
              description="No gold required - the guild serves all adventurers equally"
              delay={400}
            />
            
            <GuildPosting
              icon={Heart}
              title="Made with Passion"
              description="Crafted by adventurers, for adventurers, with love for the game"
              delay={500}
            />
          </div>
        </div>
      </PageSection>
      
      {/* Medieval border pattern at bottom */}
      <div className="relative h-16 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 10px,
              var(--color-gold-medium) 10px,
              var(--color-gold-medium) 20px
            )`
          }}
        />
      </div>
    </div>
  )
}

export default Home