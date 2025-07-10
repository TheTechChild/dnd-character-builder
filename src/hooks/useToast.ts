import { useUIStore } from '@/stores';

interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const { addToast } = useUIStore();

  return {
    toast: (options: Omit<ToastOptions, 'id'>) => {
      addToast(options);
    },
    success: (title: string, description?: string) => {
      addToast({
        title,
        description,
        variant: 'success'
      });
    },
    error: (title: string, description?: string) => {
      addToast({
        title,
        description,
        variant: 'error'
      });
    },
    warning: (title: string, description?: string) => {
      addToast({
        title,
        description,
        variant: 'warning'
      });
    },
    info: (title: string, description?: string) => {
      addToast({
        title,
        description,
        variant: 'info'
      });
    }
  };
};