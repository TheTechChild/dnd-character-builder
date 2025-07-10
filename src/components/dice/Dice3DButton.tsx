import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Dice3DButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
  isRolling?: boolean;
}

const diceConfig = {
  d4: {
    faces: 4,
    color: 'from-purple-600 via-purple-500 to-purple-700',
    highlight: 'from-purple-400 via-purple-300 to-purple-500',
    shadow: 'shadow-purple',
    size: 'h-12 w-12',
    font: 'text-lg'
  },
  d6: {
    faces: 6,
    color: 'from-blue-600 via-blue-500 to-blue-700',
    highlight: 'from-blue-400 via-blue-300 to-blue-500',
    shadow: 'shadow-info',
    size: 'h-12 w-12',
    font: 'text-lg'
  },
  d8: {
    faces: 8,
    color: 'from-emerald-600 via-emerald-500 to-emerald-700',
    highlight: 'from-emerald-400 via-emerald-300 to-emerald-500',
    shadow: 'shadow-emerald',
    size: 'h-12 w-12',
    font: 'text-lg'
  },
  d10: {
    faces: 10,
    color: 'from-amber-600 via-amber-500 to-amber-700',
    highlight: 'from-amber-400 via-amber-300 to-amber-500',
    shadow: 'shadow-gold',
    size: 'h-12 w-12',
    font: 'text-lg'
  },
  d12: {
    faces: 12,
    color: 'from-rose-600 via-rose-500 to-rose-700',
    highlight: 'from-rose-400 via-rose-300 to-rose-500',
    shadow: 'shadow-crimson',
    size: 'h-14 w-14',
    font: 'text-xl'
  },
  d20: {
    faces: 20,
    color: 'from-red-600 via-red-500 to-red-700',
    highlight: 'from-red-400 via-red-300 to-red-500',
    shadow: 'shadow-crimson',
    size: 'h-16 w-16',
    font: 'text-2xl'
  },
  d100: {
    faces: 100,
    color: 'from-slate-600 via-slate-500 to-slate-700',
    highlight: 'from-slate-400 via-slate-300 to-slate-500',
    shadow: 'shadow-deep',
    size: 'h-14 w-14',
    font: 'text-lg'
  }
};

export const Dice3DButton = forwardRef<HTMLButtonElement, Dice3DButtonProps>(
  ({ diceType, isRolling = false, className, disabled, children, onClick, ...props }, ref) => {
    const config = diceConfig[diceType];
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative rounded-lg',
          config.size,
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isRolling && 'animate-dice-roll',
          className
        )}
        disabled={disabled || isRolling}
        onClick={onClick}
        {...props}
      >
        {/* Main dice body with 3D effect */}
        <div className={cn(
          'absolute inset-0 rounded-lg',
          'bg-gradient-to-br',
          config.color,
          'transform-gpu'
        )}>
          {/* Top face - lighter gradient for 3D effect */}
          <div className={cn(
            'absolute inset-0 rounded-lg',
            'bg-gradient-to-br',
            config.highlight,
            'opacity-50',
            'clip-path-polygon-dice-top'
          )} />
          
          {/* Side shadows for depth */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-transparent to-black/30" />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent via-transparent to-black/40" />
          
          {/* Inner bevel */}
          <div className="absolute inset-[2px] rounded-md bg-gradient-to-br from-white/20 via-transparent to-black/20" />
        </div>
        
        {/* Dice face content */}
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <span className={cn(
            'font-bold text-white drop-shadow-lg',
            config.font,
            'select-none'
          )}>
            {String(children || diceType)}
          </span>
        </div>
        
        {/* Glossy overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        
        {/* Shadow */}
        <div className={cn(
          'absolute -inset-1 rounded-lg blur-md opacity-50 -z-10',
          config.shadow
        )} />
      </motion.button>
    );
  }
);

Dice3DButton.displayName = 'Dice3DButton';