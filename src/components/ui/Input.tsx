import * as React from 'react'
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  "peer w-full transition-all duration-300 text-sm",
  {
    variants: {
      variant: {
        default: [
          "h-12 px-4 pt-5 pb-1",
          "bg-gradient-to-b from-gray-900/50 to-gray-950/50 dark:from-gray-950/70 dark:to-black/70",
          "border-2 border-gray-700/50 dark:border-gray-800/50",
          "rounded-lg",
          "text-white placeholder:text-transparent",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:bg-gradient-to-b focus:from-gray-800/50 focus:to-gray-900/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        ],
        parchment: [
          "h-12 px-4 pt-5 pb-1",
          "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          "border-2 border-amber-200/50 dark:border-amber-900/50",
          "rounded-md",
          "text-gray-900 dark:text-amber-100 placeholder:text-transparent",
          "shadow-sm",
          "focus:border-amber-500 focus:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ],
        minimal: [
          "h-10 px-3 py-2",
          "bg-transparent",
          "border-b-2 border-gray-700/50 dark:border-gray-800/50",
          "rounded-none",
          "text-white placeholder:text-muted-foreground",
          "focus:border-amber-500 focus:shadow-[0_2px_0_0_rgba(251,191,36,0.5)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const floatingLabelVariants = cva(
  "absolute left-4 transition-all duration-300 pointer-events-none select-none",
  {
    variants: {
      variant: {
        default: "text-gray-400 peer-focus:text-amber-400",
        parchment: "text-gray-600 dark:text-amber-200/70 peer-focus:text-amber-600 dark:peer-focus:text-amber-400",
        minimal: "left-3 text-gray-400 peer-focus:text-amber-400"
      },
      floating: {
        true: "top-1.5 text-xs",
        false: "top-1/2 -translate-y-1/2 text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:-translate-y-0"
      }
    },
    defaultVariants: {
      variant: "default",
      floating: false
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  showErrorIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, label, error, helperText, showErrorIcon = true, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = value !== undefined && value !== null && value !== ''
    const isFloating = isFocused || hasValue || type === 'date' || type === 'time'

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            inputVariants({ variant }),
            error && [
              "border-red-500/50 dark:border-red-500/50",
              "focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
              "animate-shake"
            ],
            className
          )}
          ref={ref}
          placeholder=" "
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              floatingLabelVariants({ variant, floating: isFloating }),
              error && "text-red-400 peer-focus:text-red-400"
            )}
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Magical focus indicator */}
        <div className={cn(
          "absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-amber-500/10 to-transparent",
          isFocused && "opacity-100 animate-pulse"
        )} />

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-1 mt-1.5">
            {showErrorIcon && (
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p id={`${props.id}-error`} className="text-xs text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }