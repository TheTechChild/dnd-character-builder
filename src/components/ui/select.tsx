import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between text-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "h-12 px-4 py-3",
          "bg-gradient-to-b from-gray-900/50 to-gray-950/50 dark:from-gray-950/70 dark:to-black/70",
          "border-2 border-gray-700/50 dark:border-gray-800/50",
          "rounded-lg",
          "text-white",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.2),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "focus:outline-none focus:border-amber-500/50 focus:shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "data-[state=open]:border-amber-500 data-[state=open]:shadow-[0_0_25px_rgba(251,191,36,0.4),inset_0_2px_4px_rgba(0,0,0,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ],
        scroll: [
          "h-12 px-4 py-3",
          "bg-gradient-to-br from-amber-950/30 to-orange-950/30 dark:from-amber-950/40 dark:to-orange-950/40",
          "border-2 border-amber-700/50 dark:border-amber-800/50",
          "rounded-md",
          "text-amber-100",
          "shadow-sm",
          "hover:border-amber-600/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
          "focus:outline-none focus:border-amber-500 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
          "data-[state=open]:border-amber-500 data-[state=open]:shadow-[0_0_25px_rgba(251,191,36,0.4)]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface SelectTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild className="transition-transform duration-200 data-[state=open]:rotate-180">
      <ChevronDown className="h-4 w-4 text-amber-500/70" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden',
        'bg-gradient-to-b from-gray-900/95 to-gray-950/95 dark:from-gray-950/98 dark:to-black/98',
        'backdrop-blur-md',
        'border-2 border-amber-700/50 dark:border-amber-800/50',
        'rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(251,191,36,0.2)]',
        'text-white',
        'before:absolute before:inset-0 before:bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic2Nyb2xsIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY0IiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY2NCIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjc2Nyb2xsKSIvPjwvc3ZnPg==\')] before:opacity-30 before:pointer-events-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=open]:animate-unfurl',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUp className="h-4 w-4 text-amber-500/70" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          'p-2 space-y-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDown className="h-4 w-4 text-amber-500/70" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'py-1.5 pl-8 pr-2 text-sm font-semibold',
      'text-amber-400/70 uppercase tracking-wider',
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-md px-8 py-2 text-sm outline-none transition-all duration-200',
      'text-gray-300 hover:text-white',
      'hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-transparent',
      'focus:bg-gradient-to-r focus:from-amber-500/30 focus:to-transparent focus:text-white',
      'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500/20 data-[state=checked]:to-transparent data-[state=checked]:text-amber-200',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-amber-500 before:scale-y-0 before:transition-transform before:duration-200',
      'hover:before:scale-y-100 focus:before:scale-y-100 data-[state=checked]:before:scale-y-100',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7.5L9.5 12 7 9.5l1.41-1.41L9.5 9.17l2.09-2.08L13 8.5z" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-1 my-2 h-px',
      'bg-gradient-to-r from-transparent via-amber-700/50 to-transparent',
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};