import { NavLink } from 'react-router-dom'
import { Dices } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDiceStore } from '@/stores/diceStore'

function Navigation() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
    }`

  const { showFloatingWidget, setShowFloatingWidget } = useDiceStore();

  return (
    <nav className="flex items-center space-x-4">
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/character/new" className={navLinkClass}>
        Create Character
      </NavLink>
      <NavLink to="/reference" className={navLinkClass}>
        Reference
      </NavLink>
      <NavLink to="/settings" className={navLinkClass}>
        Settings
      </NavLink>
      <Button
        variant="ghost"
        size="small"
        onClick={() => setShowFloatingWidget(!showFloatingWidget)}
        className="text-indigo-100 hover:bg-indigo-500 hover:text-white"
        title={showFloatingWidget ? "Hide dice roller" : "Show dice roller"}
      >
        <Dices className="h-4 w-4" />
      </Button>
    </nav>
  )
}

export default Navigation