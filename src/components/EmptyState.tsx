import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">No characters yet</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Create your first D&D character to begin your adventure. You can create multiple characters and manage them all from here.
      </p>
      
      <Link to="/characters/new">
        <Button size="large">
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Character
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎲</span>
          </div>
          <h3 className="font-medium mb-1">Roll Stats</h3>
          <p className="text-sm text-gray-600">Generate ability scores with various methods</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">⚔️</span>
          </div>
          <h3 className="font-medium mb-1">Track Progress</h3>
          <p className="text-sm text-gray-600">Level up and manage your character's growth</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="font-medium mb-1">Manage Spells</h3>
          <p className="text-sm text-gray-600">Keep track of spells and abilities</p>
        </div>
      </div>
    </div>
  );
};