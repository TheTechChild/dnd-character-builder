import { useParams } from 'react-router-dom'

function ViewCharacter() {
  const { id } = useParams()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Character Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Viewing character with ID: {id}</p>
        </div>
      </div>
    </div>
  )
}

export default ViewCharacter