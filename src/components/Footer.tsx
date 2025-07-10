import { Link } from 'react-router-dom'
import { Scroll, Map, Shield, Feather } from 'lucide-react'
import { cn } from '@/lib/utils'

// Notice/parchment component
const Notice = ({ 
  children, 
  className,
  pinned = false 
}: { 
  children: React.ReactNode
  className?: string
  pinned?: boolean 
}) => (
  <div className={cn(
    "relative group",
    "transform transition-all duration-300",
    "hover:scale-105 hover:rotate-1",
    className
  )}>
    {/* Parchment background */}
    <div className={cn(
      "bg-gradient-to-br from-amber-50 to-amber-100",
      "rounded-irregular p-4",
      "shadow-lg",
      "border border-amber-300/50"
    )}>
      {/* Pin/nail effect */}
      {pinned && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="w-4 h-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-lg">
            <div className="absolute inset-1 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full" />
          </div>
        </div>
      )}
      
      {/* Aged paper texture */}
      <div 
        className="absolute inset-0 rounded-irregular opacity-20 pointer-events-none"
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
      <div className="relative z-10 text-amber-900">
        {children}
      </div>
    </div>
    
    {/* Shadow for depth */}
    <div className="absolute inset-0 -z-10 rounded-irregular bg-black/20 blur-sm transform translate-y-1 group-hover:translate-y-2 transition-transform" />
  </div>
)

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="relative mt-auto">
      {/* Wooden board background */}
      <div className="relative bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 border-t-4 border-amber-800">
        {/* Wood grain texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(92, 51, 23, 0.4) 50px,
              rgba(92, 51, 23, 0.4) 51px
            ), repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              rgba(92, 51, 23, 0.2) 20px,
              rgba(92, 51, 23, 0.2) 21px
            )`
          }}
        />
        
        {/* Board frame/edges effect */}
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Main notice - Copyright */}
            <Notice pinned className="md:col-span-1">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-amber-700" />
                <h3 className="font-heading font-bold text-lg mb-1">The Tavern</h3>
                <p className="text-sm leading-relaxed">
                  Est. {currentYear}<br />
                  D&D Character Builder<br />
                  <span className="text-xs italic">All adventures welcome</span>
                </p>
              </div>
            </Notice>
            
            {/* Navigation notices */}
            <Notice className="md:col-span-1">
              <div className="text-center">
                <Map className="h-8 w-8 mx-auto mb-2 text-amber-700" />
                <h4 className="font-heading font-semibold mb-2">Quest Board</h4>
                <div className="space-y-1 text-sm">
                  <a
                    href="https://github.com/TheTechChild/dnd-character-builder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-amber-700 transition-colors"
                  >
                    ⚔️ Join the Guild (GitHub)
                  </a>
                  <Link to="/about" className="block hover:text-amber-700 transition-colors">
                    📜 Tavern History
                  </Link>
                  <Link to="/privacy" className="block hover:text-amber-700 transition-colors">
                    🛡️ Code of Conduct
                  </Link>
                </div>
              </div>
            </Notice>
            
            {/* Features/tips notice */}
            <Notice className="md:col-span-1">
              <div className="text-center">
                <Feather className="h-8 w-8 mx-auto mb-2 text-amber-700" />
                <h4 className="font-heading font-semibold mb-2">Adventurer Tips</h4>
                <ul className="space-y-1 text-sm text-left">
                  <li>• Works offline for dungeon delves</li>
                  <li>• Export heroes as JSON scrolls</li>
                  <li>• Roll dice with floating widget</li>
                  <li>• Free forever, no dragon hoards required</li>
                </ul>
              </div>
            </Notice>
          </div>
          
          {/* Bottom scroll with additional info */}
          <div className="mt-8 text-center">
            <div className="inline-block">
              <Notice>
                <p className="text-xs italic flex items-center gap-2">
                  <Scroll className="h-3 w-3" />
                  "May your rolls be high and your adventures legendary"
                  <Scroll className="h-3 w-3 scale-x-[-1]" />
                </p>
              </Notice>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer