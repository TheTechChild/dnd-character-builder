import React from 'react';
import { Skeleton } from './loading';
import { cn } from '@/utils/cn';

export const CharacterCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      "bg-gradient-card rounded-parchment p-6",
      "border border-border-subtle hover:border-border-default",
      "transition-all duration-300",
      "shadow-lg hover:shadow-xl",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
      
      {/* Character details */}
      <div className="space-y-2 mb-4">
        <Skeleton variant="text" width="80%" height={14} />
        <Skeleton variant="text" width="70%" height={14} />
      </div>
      
      {/* Ability scores */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={40} className="rounded-md" />
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width="48%" height={36} className="rounded-md" />
        <Skeleton variant="rectangular" width="48%" height={36} className="rounded-md" />
      </div>
    </div>
  );
};

export const CharacterListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const CharacterFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Form header */}
      <div>
        <Skeleton variant="text" width="40%" height={32} className="mb-2" />
        <Skeleton variant="text" width="60%" height={16} />
      </div>
      
      {/* Basic info section */}
      <div className="bg-gradient-card rounded-lg p-6 border border-border-subtle">
        <Skeleton variant="text" width="30%" height={24} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton variant="text" width="40%" height={14} className="mb-2" />
              <Skeleton variant="rectangular" height={40} className="rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Ability scores section */}
      <div className="bg-gradient-card rounded-lg p-6 border border-border-subtle">
        <Skeleton variant="text" width="30%" height={24} className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton variant="text" width="80%" height={14} className="mb-2 mx-auto" />
              <Skeleton variant="rectangular" height={60} className="rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Skeleton variant="rectangular" width={100} height={40} className="rounded-md" />
        <Skeleton variant="rectangular" width={120} height={40} className="rounded-md" />
      </div>
    </div>
  );
};

export const SpellListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Skeleton variant="rectangular" height={40} className="rounded-md mb-4" />
      
      {/* Spell cards */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gradient-card rounded-lg p-4 border border-border-subtle">
          <div className="flex items-start justify-between mb-2">
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="text" width="20%" height={14} />
          </div>
          <Skeleton variant="text" width="80%" height={14} className="mb-2" />
          <Skeleton variant="text" width="100%" height={14} />
          <Skeleton variant="text" width="90%" height={14} />
        </div>
      ))}
    </div>
  );
};

export const NavigationSkeleton: React.FC = () => {
  return (
    <nav className="bg-gradient-subtle border-b border-border-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Skeleton variant="text" width={180} height={24} />
          
          {/* Nav items */}
          <div className="hidden md:flex items-center gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="text" width={80} height={16} />
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border-subtle">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border-subtle p-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} variant="text" width="80%" height={14} />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-border-subtle">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 hover:bg-gradient-card-hover transition-colors">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  width={colIndex === 0 ? "90%" : "70%"} 
                  height={16} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border-subtle">
        <div className="flex items-center gap-6">
          <Skeleton variant="circular" width={120} height={120} />
          <div className="flex-1">
            <Skeleton variant="text" width="40%" height={32} className="mb-2" />
            <Skeleton variant="text" width="60%" height={16} className="mb-4" />
            <div className="flex gap-4">
              <Skeleton variant="rectangular" width={100} height={36} className="rounded-md" />
              <Skeleton variant="rectangular" width={100} height={36} className="rounded-md" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gradient-card rounded-lg p-4 border border-border-subtle">
            <Skeleton variant="text" width="60%" height={14} className="mb-2" />
            <Skeleton variant="text" width="40%" height={24} />
          </div>
        ))}
      </div>
    </div>
  );
};