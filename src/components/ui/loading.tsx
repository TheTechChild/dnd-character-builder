import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  message?: string;
  variant?: 'default' | 'minimal' | 'particles';
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const loadingMessages = [
  "Rolling for initiative...",
  "Consulting the arcane...",
  "Gathering your party...",
  "Preparing the adventure...",
  "Rolling the dice...",
  "Calculating modifiers...",
  "Summoning your character...",
  "Loading spell components...",
  "Polishing your armor...",
  "Sharpening your blade..."
];

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  message,
  variant = 'default'
}) => {
  const randomMessage = message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* D20 Spinner */}
        <svg
          className={cn(
            sizeMap[size],
            "animate-spin text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
          )}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="d20Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* D20 shape */}
          <path
            d="M12 2L2 8V16L12 22L22 16V8L12 2Z"
            stroke="url(#d20Gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          <path
            d="M12 2L12 22"
            stroke="url(#d20Gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M2 8L12 14L22 8"
            stroke="url(#d20Gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M2 16L12 14L22 16"
            stroke="url(#d20Gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          
          {/* Center number "20" */}
          <text
            x="12"
            y="15"
            textAnchor="middle"
            fontSize="6"
            fill="currentColor"
            className="font-bold"
          >
            20
          </text>
        </svg>
        
        {/* Particle effects */}
        {variant === 'particles' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
                style={{
                  top: '50%',
                  left: '50%',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + i * 0.3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {(variant === 'default' || message) && (
        <p className="text-sm text-gray-400 animate-pulse font-medieval">
          {randomMessage}
        </p>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'shimmer';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  variant = 'text',
  width,
  height,
  animation = 'shimmer'
}) => {
  const baseClasses = "relative overflow-hidden bg-gray-800/50 rounded";
  
  const variantClasses = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl"
  };
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-wave",
    shimmer: "after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-gray-700/20 after:to-transparent"
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: boolean;
  blur?: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  children, 
  spinner = true,
  blur = true,
  message
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 z-50 flex items-center justify-center",
          "bg-gray-900/60 backdrop-blur-sm",
          "transition-all duration-300 ease-in-out",
          blur && "backdrop-blur-md"
        )}>
          {spinner && <LoadingSpinner size="lg" variant="particles" message={message} />}
        </div>
      )}
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "animate-fadeIn",
      className
    )}>
      {children}
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'potion';
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  variant = 'default',
  className,
  showLabel = false
}) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  if (variant === 'potion') {
    return (
      <div className={cn("relative h-8 w-48", className)}>
        {/* Potion bottle shape */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {/* Bottle outline */}
          <path
            d="M 35 20 L 35 10 L 65 10 L 65 20 L 60 30 L 60 80 Q 60 90 50 90 Q 40 90 40 80 L 40 30 Z"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Liquid fill */}
          <defs>
            <clipPath id="bottleClip">
              <path d="M 35 20 L 35 10 L 65 10 L 65 20 L 60 30 L 60 80 Q 60 90 50 90 Q 40 90 40 80 L 40 30 Z" />
            </clipPath>
            <linearGradient id="potionGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          <rect
            x="30"
            y={90 - (percentage * 0.8)}
            width="40"
            height={percentage * 0.8}
            fill="url(#potionGradient)"
            clipPath="url(#bottleClip)"
            className="transition-all duration-300 ease-out"
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Bubbles */}
          {percentage > 20 && (
            <>
              <circle r="2" fill="#fff" opacity="0.3">
                <animate
                  attributeName="cy"
                  values={`${90 - percentage * 0.8 + 10};${90 - percentage * 0.8 - 10}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  values="45;55;45"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="1.5" fill="#fff" opacity="0.3">
                <animate
                  attributeName="cy"
                  values={`${90 - percentage * 0.8 + 5};${90 - percentage * 0.8 - 15}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cx"
                  values="55;45;55"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
        </svg>
        
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn("relative h-2 bg-gray-800 rounded-full overflow-hidden", className)}>
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
      </div>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-md">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};