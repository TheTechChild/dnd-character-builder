import { Info, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RulesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  rule: RuleContent;
}

export interface RuleContent {
  title: string;
  category: string;
  content: string | React.ReactNode;
  examples?: string[];
  relatedRules?: string[];
  source?: string;
}

import { rulesDatabase } from '@/constants/rulesDatabase';

export function RulesPopup({ isOpen, onClose, rule }: RulesPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {rule.title}
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Category:</span>
            <span className="text-sm">{rule.category}</span>
          </div>

          <div>
            {typeof rule.content === 'string' ? (
              <p>{rule.content}</p>
            ) : (
              rule.content
            )}
          </div>

          {rule.examples && rule.examples.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rule.examples.map((example, index) => (
                    <li key={index} className="text-sm">{example}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {rule.relatedRules && rule.relatedRules.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Related Rules:</h4>
                <div className="flex flex-wrap gap-2">
                  {rule.relatedRules.map((ruleKey) => {
                    const relatedRule = rulesDatabase[ruleKey];
                    if (!relatedRule) return null;
                    
                    return (
                      <Button
                        key={ruleKey}
                        variant="ghost"
                        size="small"
                        onClick={() => {
                          // In a real implementation, this would open the related rule
                          console.log('Open rule:', ruleKey);
                        }}
                      >
                        {relatedRule.title}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {rule.source && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Source: {rule.source}</span>
                <a
                  href="https://www.dndbeyond.com/sources/basic-rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  View official rules
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick access button for rules
interface RulesButtonProps {
  ruleKey: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function RulesButton({ ruleKey, variant = 'ghost', size = 'small', className }: RulesButtonProps) {
  const rule = rulesDatabase[ruleKey];
  
  if (!rule) return null;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        // In a real implementation, this would open the rules popup
        console.log('Open rule:', ruleKey);
      }}
    >
      <Info className="h-4 w-4 mr-1" />
      {rule.title}
    </Button>
  );
}