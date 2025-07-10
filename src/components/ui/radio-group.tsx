import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from 'class-variance-authority'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioItemVariants = cva(
  "aspect-square relative cursor-pointer transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "h-5 w-5 rounded-full",
          "bg-gradient-to-b from-gray-900/50 to-gray-950/50 dark:from-gray-950/70 dark:to-black/70",
          "border-2 border-gray-700/50 dark:border-gray-800/50",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.2),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:outline-none focus-visible:border-amber-500/50 focus-visible:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "data-[state=checked]:border-amber-500 data-[state=checked]:shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ],
        gem: [
          "h-6 w-6 rounded-full",
          "bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 dark:from-indigo-950/70 dark:via-purple-950/70 dark:to-pink-950/70",
          "border-2 border-indigo-700/50 dark:border-indigo-800/50",
          "shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
          "hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3),inset_0_2px_6px_rgba(0,0,0,0.4)]",
          "focus:outline-none focus-visible:border-indigo-500 focus-visible:shadow-[0_0_25px_rgba(99,102,241,0.4),inset_0_2px_6px_rgba(0,0,0,0.4)]",
          "data-[state=checked]:from-indigo-600/80 data-[state=checked]:via-purple-600/80 data-[state=checked]:to-pink-600/80",
          "data-[state=checked]:border-indigo-400 data-[state=checked]:shadow-[0_0_30px_rgba(99,102,241,0.5),inset_0_2px_6px_rgba(0,0,0,0.4)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface RadioGroupItemProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  VariantProps<typeof radioItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ variant }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {variant === 'gem' ? (
          <div className="relative">
            <svg className="h-3 w-3 text-indigo-200 animate-in zoom-in-50 duration-200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div className="absolute inset-0 animate-pulse">
              <svg className="h-3 w-3 text-indigo-300/50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-in zoom-in-50 duration-200" />
        )}
      </RadioGroupPrimitive.Indicator>
      {/* Magical ring effect */}
      <div className={cn(
        "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none",
        "before:absolute before:inset-[-4px] before:rounded-full before:border-2",
        variant === 'gem' 
          ? "before:border-indigo-400/30" 
          : "before:border-amber-400/30",
        "data-[state=checked]:opacity-100"
      )} 
      data-state={props.checked || props.defaultChecked ? "checked" : "unchecked"} />
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }