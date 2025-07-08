import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
          Welcome to D&D Character Builder
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Create and manage your Dungeons & Dragons 5th Edition characters with ease.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Create New Character</h2>
            <p className="text-gray-600 mb-4">
              Start building your hero from scratch with our intuitive character creator.
            </p>
            <Link
              to="/character/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Characters</h2>
            <p className="text-gray-600 mb-4">
              View and manage all your created characters in one place.
            </p>
            <Link
              to="/characters"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Characters
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Complete D&D 5e character creation</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Automatic ability score calculations</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Export to JSON, PDF, or text</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Offline capability with PWA support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home