import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { PWAManager } from './components/PWA/PWAManager'

const Home = lazy(() => import('./pages/Home'))
const CharacterList = lazy(() => import('./pages/CharacterList'))
const CreateCharacter = lazy(() => import('./pages/CreateCharacter'))
const ViewCharacter = lazy(() => import('./pages/ViewCharacter'))
const EditCharacter = lazy(() => import('./pages/EditCharacter'))
const Settings = lazy(() => import('./pages/Settings'))
const Reference = lazy(() => import('./pages/Reference'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <PWAManager />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="characters" element={<CharacterList />} />
            <Route path="characters">
              <Route path="new" element={<CreateCharacter />} />
              <Route path=":id" element={<ViewCharacter />} />
              <Route path=":id/edit" element={<EditCharacter />} />
            </Route>
            <Route path="character">
              <Route path="new" element={<CreateCharacter />} />
              <Route path=":id" element={<ViewCharacter />} />
              <Route path=":id/edit" element={<EditCharacter />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="reference" element={<Reference />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App