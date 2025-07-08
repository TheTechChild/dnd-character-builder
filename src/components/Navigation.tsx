import { NavLink } from 'react-router-dom'

function Navigation() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
    }`

  return (
    <nav className="flex space-x-4">
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>
      <NavLink to="/character/new" className={navLinkClass}>
        Create Character
      </NavLink>
      <NavLink to="/settings" className={navLinkClass}>
        Settings
      </NavLink>
    </nav>
  )
}

export default Navigation