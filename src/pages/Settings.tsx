import { DicePreferences } from '@/components/dice/DicePreferences';

function Settings() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="space-y-6">
          <DicePreferences />
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Theme Preferences</h2>
              <p className="text-gray-600">Theme settings will be implemented here.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Export Options</h2>
              <p className="text-gray-600">Configure default export settings.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Data Management</h2>
              <p className="text-gray-600">Manage your local character data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings