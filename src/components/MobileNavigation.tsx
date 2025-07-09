import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Dices, Home, UserPlus, BookOpen, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDiceStore } from '@/stores/diceStore'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  className?: string
}

function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { showFloatingWidget, setShowFloatingWidget } = useDiceStore()

  const toggleMenu = () => setIsOpen(!isOpen)
  
  const closeMenu = () => setIsOpen(false)

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/character/new', label: 'Create Character', icon: UserPlus },
    { to: '/reference', label: 'Reference', icon: BookOpen },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className={cn("lg:hidden", className)}>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="touch-target text-white hover:bg-indigo-700"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              className="touch-target"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors touch-target",
                          isActive
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowFloatingWidget(!showFloatingWidget)
                closeMenu()
              }}
              className="w-full touch-target"
            >
              <Dices className="h-4 w-4 mr-2" />
              {showFloatingWidget ? "Hide Dice Roller" : "Show Dice Roller"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation