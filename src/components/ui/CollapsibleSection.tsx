import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
  icon,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between",
          "bg-gray-50 hover:bg-gray-100 transition-colors",
          "touch-target text-left",
          titleClassName
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-600">{icon}</span>}
          <span className="font-medium text-sm md:text-base">{title}</span>
          {badge && <span>{badge}</span>}
        </div>
        <span className="text-gray-500">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className={cn("p-4", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Mobile-first collapsible that's always open on desktop
export function ResponsiveCollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
  titleClassName,
  contentClassName,
  icon,
  badge,
  breakpoint = 'md',
}: CollapsibleSectionProps & { breakpoint?: 'sm' | 'md' | 'lg' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const breakpointClass = `${breakpoint}:hidden`;

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Mobile collapsible header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between",
          "bg-gray-50 hover:bg-gray-100 transition-colors",
          "touch-target text-left",
          breakpointClass,
          titleClassName
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-600">{icon}</span>}
          <span className="font-medium text-sm">{title}</span>
          {badge && <span>{badge}</span>}
        </div>
        <span className="text-gray-500">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Desktop always-visible header */}
      <div
        className={cn(
          "hidden",
          breakpoint === 'sm' && "sm:block",
          breakpoint === 'md' && "md:block",
          breakpoint === 'lg' && "lg:block",
          "px-4 py-3 bg-gray-50 border-b"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-600">{icon}</span>}
          <span className="font-medium">{title}</span>
          {badge && <span>{badge}</span>}
        </div>
      </div>
      
      {/* Mobile collapsible content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          breakpointClass,
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className={cn("p-4", contentClassName)}>
          {children}
        </div>
      </div>

      {/* Desktop always-visible content */}
      <div
        className={cn(
          "hidden",
          breakpoint === 'sm' && "sm:block",
          breakpoint === 'md' && "md:block",
          breakpoint === 'lg' && "lg:block"
        )}
      >
        <div className={cn("p-4", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}