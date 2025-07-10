import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "relative overflow-hidden text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: [
          "bg-card border border-border rounded-lg shadow-sm",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-50/5 before:to-transparent before:pointer-events-none",
          "after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InBhcGVyIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGFwZXIpIi8+PC9zdmc+')] after:opacity-50 after:pointer-events-none",
          "[mask-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDVjMC0yLjggMi4yLTUgNS01aDI5MGMyLjggMCA1IDIuMiA1IDV2MjkwYzAgMi44LTIuMiA1LTUgNWgtMjkwYy0yLjggMC01LTIuMi01LTV6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')]"
        ],
        parchment: [
          "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          "border-2 border-amber-200/50 dark:border-amber-900/50",
          "shadow-md hover:shadow-xl",
          "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJyb3VnaCI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuMDQiIG51bU9jdGF2ZXM9IjUiIHJlc3VsdD0ibm9pc2UiIHNlZWQ9IjEiLz48ZmVEaWZmdXNlTGlnaHRpbmcgaW49Im5vaXNlIiBsaWdodGluZy1jb2xvcj0id2hpdGUiIHN1cmZhY2VTY2FsZT0iMSI+PGZlRGlzdGFudExpZ2h0IGF6aW11dGg9IjQ1IiBlbGV2YXRpb249IjYwIi8+PC9mZURpZmZ1c2VMaWdodGluZz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI3JvdWdoKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] before:opacity-30 before:mix-blend-multiply dark:before:opacity-20 before:pointer-events-none",
          "[clip-path:polygon(0%_4px,4px_0%,calc(100%-4px)_0%,100%_4px,100%_calc(100%-4px),calc(100%-4px)_100%,4px_100%,0%_calc(100%-4px))]"
        ],
        elevated: [
          "bg-gradient-to-br from-card to-card/90 border border-border/50",
          "shadow-xl hover:shadow-2xl hover:-translate-y-1",
          "rounded-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-t before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none",
          "after:absolute after:-inset-px after:bg-gradient-to-t after:from-primary/20 after:via-primary/5 after:to-transparent after:rounded-lg after:opacity-0 hover:after:opacity-100 after:blur-xl after:transition-opacity after:duration-500 after:-z-10"
        ],
        inset: [
          "bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black",
          "border-2 border-gray-700 dark:border-gray-800",
          "shadow-inner rounded-lg",
          "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RvbmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM0NDQiIHN0cm9rZS13aWR0aD0iMC41Ii8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjgwIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDQ0IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdG9uZSkiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] before:opacity-20 before:mix-blend-overlay before:pointer-events-none",
          "after:absolute after:inset-[2px] after:rounded-lg after:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] after:pointer-events-none"
        ],
        glass: [
          "bg-white/5 dark:bg-white/5 backdrop-blur-md",
          "border border-white/10 dark:border-white/10",
          "shadow-lg rounded-lg",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none",
          "after:absolute after:inset-0 after:rounded-lg after:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] after:pointer-events-none"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }