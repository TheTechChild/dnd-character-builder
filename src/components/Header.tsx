import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import { SyncStatus } from './PWA/SyncStatus'

function Header() {
  return (
    <header className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            D&D Character Builder
          </Link>
          <div className="flex items-center gap-4">
            <SyncStatus />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header