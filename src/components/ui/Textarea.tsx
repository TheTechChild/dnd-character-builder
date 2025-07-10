import * as React from 'react'
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { Feather } from 'lucide-react'

const textareaVariants = cva(
  "flex w-full text-sm transition-all duration-300 resize-none",
  {
    variants: {
      variant: {
        default: [
          "min-h-[100px] px-4 py-3",
          "bg-gradient-to-b from-gray-900/50 to-gray-950/50 dark:from-gray-950/70 dark:to-black/70",
          "border-2 border-gray-700/50 dark:border-gray-800/50",
          "rounded-lg",
          "text-white placeholder:text-gray-400",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:bg-gradient-to-b focus:from-gray-800/50 focus:to-gray-900/50",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ],
        parchment: [
          "min-h-[120px] px-6 py-4",
          "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          "border-2 border-amber-200/50 dark:border-amber-900/50",
          "rounded-md",
          "text-gray-900 dark:text-amber-100 placeholder:text-gray-600 dark:placeholder:text-amber-200/50",
          "shadow-sm",
          "focus:border-amber-500 focus:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "font-serif text-base leading-relaxed",
          "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJwYXJjaG1lbnQiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAyIiBudW1PY3RhdmVzPSI0IiByZXN1bHQ9Im5vaXNlIiBzZWVkPSIzIi8+PGZlRGlmZnVzZUxpZ2h0aW5nIGluPSJub2lzZSIgbGlnaHRpbmctY29sb3I9IndoaXRlIiBzdXJmYWNlU2NhbGU9IjEiPjxmZURpc3RhbnRMaWdodCBhemltdXRoPSI0NSIgZWxldmF0aW9uPSI2MCIvPjwvZmVEaWZmdXNlTGlnaHRpbmc+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNwYXJjaG1lbnQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] bg-[length:200px_200px]"
        ],
        scroll: [
          "min-h-[150px] px-8 py-6",
          "bg-gradient-to-b from-amber-900/10 to-orange-900/10 dark:from-amber-950/30 dark:to-orange-950/30",
          "border-4 border-double border-amber-700/50 dark:border-amber-800/50",
          "rounded-lg",
          "text-amber-950 dark:text-amber-100 placeholder:text-amber-700/50 dark:placeholder:text-amber-300/30",
          "shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]",
          "focus:border-amber-600 focus:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_8px_rgba(0,0,0,0.2)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "font-serif text-lg leading-loose tracking-wide"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  showQuill?: boolean
  autoResize?: boolean
  maxHeight?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, showQuill = false, autoResize = false, maxHeight = 400, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement)

    // Auto-resize functionality
    React.useEffect(() => {
      const textarea = internalRef.current
      if (!textarea || !autoResize) return

      const handleResize = () => {
        textarea.style.height = 'auto'
        const newHeight = Math.min(textarea.scrollHeight, maxHeight)
        textarea.style.height = `${newHeight}px`
      }

      handleResize()
      textarea.addEventListener('input', handleResize)
      
      return () => textarea.removeEventListener('input', handleResize)
    }, [autoResize, maxHeight, props.value])

    return (
      <div className="relative">
        <textarea
          className={cn(
            textareaVariants({ variant }),
            autoResize && "overflow-y-auto",
            className
          )}
          ref={internalRef}
          {...props}
        />
        
        {/* Quill icon for parchment/scroll variants */}
        {showQuill && (variant === 'parchment' || variant === 'scroll') && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <Feather className={cn(
              "h-6 w-6 opacity-20",
              variant === 'parchment' && "text-amber-700 dark:text-amber-400",
              variant === 'scroll' && "text-amber-800 dark:text-amber-300"
            )} />
          </div>
        )}
        
        {/* Magical writing effect */}
        {(variant === 'parchment' || variant === 'scroll') && (
          <div className="absolute inset-0 rounded-md pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className={cn(
              "absolute inset-0 rounded-md",
              "bg-gradient-to-t from-amber-500/5 via-transparent to-transparent"
            )} />
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }