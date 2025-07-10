import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const checkboxVariants = cva(
  "peer shrink-0 relative cursor-pointer transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "h-5 w-5 rounded-md",
          "bg-gradient-to-b from-gray-900/50 to-gray-950/50 dark:from-gray-950/70 dark:to-black/70",
          "border-2 border-gray-700/50 dark:border-gray-800/50",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.2),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus-visible:outline-none focus-visible:border-amber-500/50 focus-visible:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-amber-600/80 data-[state=checked]:to-amber-700/80",
          "data-[state=checked]:border-amber-500 data-[state=checked]:shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ],
        rune: [
          "h-6 w-6 rounded-full",
          "bg-gradient-to-b from-gray-800/50 to-gray-900/50 dark:from-gray-900/70 dark:to-black/70",
          "border-2 border-purple-700/50 dark:border-purple-800/50",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]",
          "hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3),inset_0_2px_4px_rgba(0,0,0,0.4)]",
          "focus-visible:outline-none focus-visible:border-purple-500 focus-visible:shadow-[0_0_20px_rgba(168,85,247,0.4),inset_0_2px_4px_rgba(0,0,0,0.4)]",
          "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-purple-600/80 data-[state=checked]:to-purple-700/80",
          "data-[state=checked]:border-purple-400 data-[state=checked]:shadow-[0_0_25px_rgba(168,85,247,0.5),inset_0_2px_4px_rgba(0,0,0,0.4)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface CheckboxProps 
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      {variant === 'rune' ? (
        <svg className="h-4 w-4 text-purple-200 animate-in zoom-in-50 duration-200" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z" />
          <path d="M7 4L7.7 6.3L10 7L7.7 7.7L7 10L6.3 7.7L4 7L6.3 6.3L7 4Z" opacity="0.6" />
          <path d="M17 14L17.7 16.3L20 17L17.7 17.7L17 20L16.3 17.7L14 17L16.3 16.3L17 14Z" opacity="0.6" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-amber-200 animate-in zoom-in-50 duration-200" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </CheckboxPrimitive.Indicator>
    {/* Magical glow effect */}
    <div className={cn(
      "absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none",
      "data-[state=checked]:opacity-100",
      variant === 'rune' ? "rounded-full" : "rounded-md"
    )} 
    data-state={props.checked || props.defaultChecked ? "checked" : "unchecked"}>
      <div className={cn(
        "absolute inset-0 animate-pulse",
        variant === 'rune' 
          ? "bg-gradient-to-r from-purple-500/20 via-purple-400/30 to-purple-500/20 rounded-full" 
          : "bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 rounded-md"
      )} />
    </div>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };