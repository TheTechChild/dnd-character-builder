import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { PWAManager } from './components/PWA/PWAManager'
import { LoadingSpinner } from './components/ui/loading'
import { ToastContainer } from './components/ui/toast'
import { PageTransition } from './components/ui/loading'
import { NotFoundPage } from './components/ui/error-states'

const Home = lazy(() => import('./pages/Home'))
const CharacterList = lazy(() => import('./pages/CharacterList'))
const CreateCharacter = lazy(() => import('./pages/CreateCharacter'))
const ViewCharacter = lazy(() => import('./pages/ViewCharacter'))
const EditCharacter = lazy(() => import('./pages/EditCharacter'))
const Settings = lazy(() => import('./pages/Settings'))
const Reference = lazy(() => import('./pages/Reference'))

const LoadingPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-mystic">
    <LoadingSpinner size="xl" variant="particles" />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <PWAManager />
      <ToastContainer />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <PageTransition>
                <Home />
              </PageTransition>
            } />
            <Route path="characters" element={
              <PageTransition>
                <CharacterList />
              </PageTransition>
            } />
            <Route path="characters">
              <Route path="new" element={
                <PageTransition>
                  <CreateCharacter />
                </PageTransition>
              } />
              <Route path=":id" element={
                <PageTransition>
                  <ViewCharacter />
                </PageTransition>
              } />
              <Route path=":id/edit" element={
                <PageTransition>
                  <EditCharacter />
                </PageTransition>
              } />
            </Route>
            <Route path="character">
              <Route path="new" element={
                <PageTransition>
                  <CreateCharacter />
                </PageTransition>
              } />
              <Route path=":id" element={
                <PageTransition>
                  <ViewCharacter />
                </PageTransition>
              } />
              <Route path=":id/edit" element={
                <PageTransition>
                  <EditCharacter />
                </PageTransition>
              } />
            </Route>
            <Route path="settings" element={
              <PageTransition>
                <Settings />
              </PageTransition>
            } />
            <Route path="reference" element={
              <PageTransition>
                <Reference />
              </PageTransition>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App