import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden touch-target-responsive transition-all duration-300',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-b from-red-800 to-red-900',
          'text-yellow-200 font-bold',
          'border-2 border-yellow-600/50',
          'shadow-lg shadow-red-900/50',
          // Desktop hover effects
          'hover:hover:from-red-700 hover:hover:to-red-800',
          'hover:hover:border-yellow-500',
          'hover:hover:shadow-xl hover:hover:shadow-red-800/60',
          'hover:hover:text-yellow-100',
          'hover:hover:scale-105',
          // Touch feedback
          'active:scale-95',
          'active:shadow-inner',
          'touch-feedback',
          'focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
          'after:content-[""] after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:to-white/10 after:opacity-0 hover:hover:after:opacity-100 after:transition-opacity',
        ].join(' '),
        
        secondary: [
          'bg-gradient-to-b from-purple-800 to-purple-900',
          'text-purple-200',
          'border-2 border-purple-400/30',
          'shadow-lg shadow-purple-900/50',
          // Desktop hover effects
          'hover:hover:from-purple-700 hover:hover:to-purple-800',
          'hover:hover:border-purple-300/50',
          'hover:hover:shadow-xl hover:hover:shadow-purple-800/60',
          'hover:hover:text-purple-100',
          'hover:hover:scale-105',
          // Touch feedback
          'active:scale-95',
          'active:shadow-inner',
          'touch-feedback',
          'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        ].join(' '),
        
        ghost: [
          'bg-transparent',
          'text-gray-300',
          'border border-transparent',
          // Desktop hover effects
          'hover:hover:bg-white/5',
          'hover:hover:border-white/20',
          'hover:hover:text-white',
          'hover:hover:shadow-lg hover:hover:shadow-white/10',
          // Touch feedback
          'active:bg-white/10',
          'touch-feedback',
          'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        ].join(' '),
        
        danger: [
          'bg-gradient-to-b from-red-600 to-red-800',
          'text-red-100',
          'border-2 border-red-400/50',
          'shadow-lg shadow-red-900/50',
          // Desktop hover effects
          'hover:hover:from-red-500 hover:hover:to-red-700',
          'hover:hover:border-red-300',
          'hover:hover:shadow-xl hover:hover:shadow-red-800/60',
          'hover:hover:animate-pulse',
          // Touch feedback
          'active:scale-95',
          'active:shadow-inner',
          'touch-feedback',
          'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
        ].join(' '),
        
        success: [
          'bg-gradient-to-b from-emerald-700 to-emerald-800',
          'text-emerald-100',
          'border-2 border-emerald-400/40',
          'shadow-lg shadow-emerald-900/50',
          // Desktop hover effects
          'hover:hover:from-emerald-600 hover:hover:to-emerald-700',
          'hover:hover:border-emerald-300/60',
          'hover:hover:shadow-xl hover:hover:shadow-emerald-800/60',
          'hover:hover:scale-105',
          // Touch feedback
          'active:scale-95',
          'active:shadow-inner',
          'touch-feedback',
          'focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
          'before:content-[""] before:absolute before:inset-0 before:bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 10 Q25 15 20 20 Q15 15 20 10" fill="none" stroke="%2310b981" stroke-width="0.5" opacity="0.1"/%3E%3C/svg%3E")] before:opacity-30',
        ].join(' '),
      },
      size: {
        small: 'min-h-[44px] sm:h-9 px-4 sm:px-3 text-sm rounded-md gap-1.5',
        medium: 'min-h-[48px] sm:h-11 px-5 text-base rounded-lg gap-2',
        large: 'min-h-[56px] sm:h-14 px-6 sm:px-8 text-lg rounded-xl gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading, 
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && 'cursor-wait',
          disabled && 'cursor-not-allowed relative overflow-hidden',
          disabled && !isLoading && 'after:content-[""] after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-gray-900/80 after:to-transparent after:backdrop-blur-[1px]',
          disabled && !isLoading && 'before:content-[""] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_11px)]'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <D20Spinner className="animate-spin" />
            <span className="ml-2">Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
        
        {/* Ripple effect container */}
        <span className="absolute inset-0 pointer-events-none">
          <span className="ripple" />
        </span>
      </button>
    );
  }
);
Button.displayName = 'Button';

// D20 Spinner Component
const D20Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("w-5 h-5", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 8V16L12 22L22 16V8L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2L12 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 8L12 14L22 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 16L12 14L22 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export { Button };