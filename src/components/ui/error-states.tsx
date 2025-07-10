import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { AlertTriangle, Ghost, ShieldOff, Scroll, Dices } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'quest' | 'critical' | 'magical';
  className?: string;
}

const errorMessages = {
  default: {
    title: "By the Nine Hells!",
    message: "Something has gone awry in your adventure. Perhaps the fates are not in your favor today."
  },
  quest: {
    title: "Quest Not Found",
    message: "The path you seek has vanished like a ghost in the mist. Perhaps you should return to the tavern and consult your map."
  },
  critical: {
    title: "Critical Failure!",
    message: "You rolled a natural 1. The dice gods have forsaken you. But fear not, brave adventurer - every hero faces setbacks."
  },
  magical: {
    title: "Magic Disrupted",
    message: "A wild surge of magic has interfered with your spell. The weave is unstable here."
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  action,
  variant = 'default',
  className
}) => {
  const defaultContent = errorMessages[variant];
  const Icon = variant === 'quest' ? Ghost : 
               variant === 'critical' ? Dices :
               variant === 'magical' ? ShieldOff : AlertTriangle;
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] text-center p-8",
      className
    )}>
      <div className="relative mb-6">
        <Icon className="w-24 h-24 text-red-500 opacity-50" />
        <div className="absolute inset-0 animate-pulse">
          <Icon className="w-24 h-24 text-red-400 blur-xl" />
        </div>
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-red-400 mb-4">
        {title || defaultContent.title}
      </h2>
      
      <p className="text-lg text-gray-400 max-w-md mb-8 font-body">
        {message || defaultContent.message}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant="primary"
          size="large"
          leftIcon={<Scroll className="w-5 h-5" />}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-mystic flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-card rounded-parchment p-8 md:p-12 border-2 border-gold shadow-magical-gold">
          {/* 404 Display */}
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-heading font-black text-gold-gradient mb-4">
              404
            </h1>
            <div className="flex justify-center gap-4 mb-6">
              <Dices className="w-8 h-8 text-yellow-600 animate-dice-bounce" />
              <Ghost className="w-8 h-8 text-purple-400 animate-float" />
              <ShieldOff className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
          </div>
          
          {/* Error Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-yellow-200 mb-4">
              Quest Not Found
            </h2>
            <p className="text-lg text-gray-300 font-body leading-relaxed mb-6">
              Alas, brave adventurer! The path you seek has been lost to the mists of time. 
              Perhaps you took a wrong turn at the last crossroads, or maybe a mischievous 
              sprite has led you astray.
            </p>
            <p className="text-base text-gray-400 font-body italic">
              "Not all those who wander are lost... but you might be."
            </p>
          </div>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent flex-1" />
            <Scroll className="w-6 h-6 text-yellow-600" />
            <div className="h-px bg-gradient-to-l from-transparent via-yellow-600 to-transparent flex-1" />
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              size="large"
              leftIcon={<span className="transform rotate-180">➜</span>}
            >
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="primary"
              size="large"
              rightIcon={<span>⚔️</span>}
            >
              Return to Tavern
            </Button>
          </div>
          
          {/* Fun tip */}
          <div className="mt-8 p-4 bg-black/20 rounded-lg border border-yellow-600/20">
            <p className="text-sm text-gray-400 text-center font-body">
              <span className="text-yellow-600 font-semibold">Tip:</span> While you're here, 
              roll a d20. On a natural 20, make a wish - it might just come true!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorState
          variant="critical"
          title="Critical System Failure"
          message="The application has encountered a catastrophic error. Our wizards are working on it."
          action={{
            label: "Reload the Page",
            onClick: () => window.location.reload()
          }}
        />
      );
    }

    return this.props.children;
  }
}

export const LoadingError: React.FC<{ 
  onRetry?: () => void;
  resource?: string;
}> = ({ onRetry, resource }) => {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        Failed to Load {resource || 'Resource'}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        The ancient scrolls could not be retrieved. Check your connection to the arcane network.
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="small"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}> = ({ title, message, action, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
      {icon && (
        <div className="mb-6 opacity-50">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-heading font-semibold text-gray-300 mb-2">
        {title}
      </h3>
      
      <p className="text-base text-gray-500 max-w-md mb-6">
        {message}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant="primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};