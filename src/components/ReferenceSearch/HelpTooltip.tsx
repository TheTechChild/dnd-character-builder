import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
}

export function HelpTooltip({
  content,
  side = 'top',
  align = 'center',
  className,
  iconClassName = 'h-4 w-4',
}: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="small"
            className={`h-auto p-0.5 hover:bg-transparent ${className}`}
          >
            <HelpCircle className={`text-gray-400 hover:text-gray-600 ${iconClassName}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { gameTerms } from '@/constants/gameTerms';

interface GameTermTooltipProps {
  term: keyof typeof gameTerms;
  children: React.ReactNode;
  className?: string;
}

export function GameTermTooltip({ term, children, className }: GameTermTooltipProps) {
  const explanation = gameTerms[term];
  
  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`border-b border-dotted border-gray-400 cursor-help ${className}`}>
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}