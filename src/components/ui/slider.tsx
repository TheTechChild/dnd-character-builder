import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      variant: {
        default: "h-5",
        gem: "h-6",
        rune: "h-8"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const trackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: [
          "h-2",
          "bg-gradient-to-r from-gray-800/50 to-gray-900/50",
          "border border-gray-700/50",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
        ],
        gem: [
          "h-3",
          "bg-gradient-to-r from-indigo-950/50 via-purple-950/50 to-pink-950/50",
          "border border-indigo-800/50",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
        ],
        rune: [
          "h-4",
          "bg-gradient-to-r from-gray-900/60 to-black/60",
          "border-2 border-purple-800/50",
          "shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]",
          "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InJ1bmVzIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjQiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcnVuZXMpIi8+PC9zdmc+')] before:opacity-30"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const rangeVariants = cva(
  "absolute h-full",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-amber-600 to-amber-500",
        gem: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
        rune: "bg-gradient-to-r from-purple-600 to-purple-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const thumbVariants = cva(
  "block rounded-full border-2 ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing",
  {
    variants: {
      variant: {
        default: [
          "h-5 w-5",
          "bg-gradient-to-br from-amber-400 to-amber-600",
          "border-amber-700",
          "shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_12px_rgba(251,191,36,0.4)]",
          "hover:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_20px_rgba(251,191,36,0.6)]",
          "focus-visible:ring-amber-500"
        ],
        gem: [
          "h-6 w-6",
          "bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400",
          "border-indigo-600",
          "shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.5)]",
          "hover:shadow-[0_2px_10px_rgba(0,0,0,0.5),0_0_25px_rgba(99,102,241,0.7)]",
          "focus-visible:ring-indigo-500",
          "before:absolute before:inset-[2px] before:rounded-full before:bg-gradient-to-br before:from-white/30 before:to-transparent"
        ],
        rune: [
          "h-7 w-7",
          "bg-gradient-to-br from-purple-800 to-purple-900",
          "border-purple-600",
          "shadow-[0_2px_12px_rgba(0,0,0,0.6),0_0_20px_rgba(147,51,234,0.5)]",
          "hover:shadow-[0_2px_12px_rgba(0,0,0,0.6),0_0_30px_rgba(147,51,234,0.7)]",
          "focus-visible:ring-purple-500",
          "after:absolute after:inset-0 after:rounded-full after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJMMTMuNSA3LjVMMTkgOUwxMy41IDEwLjVMMTIgMTZMMTAuNSAxMC41TDUgOUwxMC41IDcuNUwxMiAyWiIgZmlsbD0iI2E4NWJmNyIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] after:bg-center after:bg-no-repeat after:bg-contain"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {
  showTooltip?: boolean
  formatValue?: (value: number) => string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant, showTooltip = true, formatValue = (v) => v.toString(), ...props }, ref) => {
  const [showValue, setShowValue] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState(props.defaultValue?.[0] || props.value?.[0] || 0)

  return (
    <div className="relative">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(sliderVariants({ variant }), className)}
        onValueChange={(value) => {
          setCurrentValue(value[0])
          props.onValueChange?.(value)
        }}
        onPointerDown={() => setShowValue(true)}
        onPointerUp={() => setShowValue(false)}
        onPointerLeave={() => setShowValue(false)}
        {...props}
      >
        <SliderPrimitive.Track className={cn(trackVariants({ variant }))}>
          <SliderPrimitive.Range className={cn(rangeVariants({ variant }))} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(thumbVariants({ variant }))}>
          {showTooltip && showValue && (
            <div className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-semibold rounded",
              "bg-black/90 text-white",
              "before:absolute before:top-full before:left-1/2 before:-translate-x-1/2",
              "before:border-4 before:border-transparent before:border-t-black/90",
              "animate-in fade-in-0 zoom-in-95 duration-200"
            )}>
              {formatValue(currentValue)}
            </div>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      
      {/* Magical glow effect on track */}
      <div className={cn(
        "absolute inset-x-0 top-1/2 -translate-y-1/2 h-full rounded-full pointer-events-none opacity-0 transition-opacity duration-300",
        showValue && "opacity-100",
        variant === 'gem' && "h-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-md",
        variant === 'rune' && "h-8 bg-purple-500/20 blur-lg",
        variant === 'default' && "h-4 bg-amber-500/20 blur-md"
      )} />
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }