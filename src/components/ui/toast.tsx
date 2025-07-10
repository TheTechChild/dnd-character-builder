import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Scroll } from 'lucide-react';
import { useUIStore } from '@/stores';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantConfig = {
  default: {
    icon: Scroll,
    className: 'bg-gradient-card border-border-gold text-yellow-200',
    iconColor: 'text-yellow-500'
  },
  success: {
    icon: CheckCircle,
    className: 'bg-emerald-900/90 border-emerald-600 text-emerald-100',
    iconColor: 'text-emerald-400'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-900/90 border-red-600 text-red-100',
    iconColor: 'text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-900/90 border-amber-600 text-amber-100',
    iconColor: 'text-amber-400'
  },
  info: {
    icon: Info,
    className: 'bg-blue-900/90 border-blue-600 text-blue-100',
    iconColor: 'text-blue-400'
  }
};

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { removeToast } = useUIStore();
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(id);
    }, 300);
  }, [id, removeToast]);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg shadow-magical-gold",
        "border-2 backdrop-blur-md",
        "min-w-[320px] max-w-md",
        "transition-all duration-300 ease-out",
        config.className,
        isVisible && !isLeaving ? 'animate-unfurl translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0Q50 5 100 0L100 100Q50 95 0 100Z' fill='%23000' fill-opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: '100% 100%'
      }}
    >
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-yellow-900/20 to-transparent" />
      </div>

      <div className="relative p-4">
        <div className="flex gap-3">
          {/* Icon */}
          <div className={cn("flex-shrink-0 mt-0.5", config.iconColor)}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold font-display tracking-wide">
              {title}
            </p>
            {description && (
              <p className="mt-1 text-sm opacity-90 font-body">
                {description}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium underline hover:no-underline transition-all"
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-md p-1 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore(state => state.toasts);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

// Add shrink animation to CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;
  document.head.appendChild(style);
}