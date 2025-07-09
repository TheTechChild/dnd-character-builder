import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import MobileNavigation from './MobileNavigation'
import { SyncStatus } from './PWA/SyncStatus'

function Header() {
  return (
    <header className="bg-indigo-600 text-white safe-top">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none">
            D&D Character Builder
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <SyncStatus />
            <div className="hidden lg:block">
              <Navigation />
            </div>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header