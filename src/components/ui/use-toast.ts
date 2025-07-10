import { useUIStore } from '@/stores/uiStore';

export const useToast = () => {
  const addToast = useUIStore(state => state.addToast);
  
  const toast = ({ title, description, variant = 'default' }: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    const toastVariant = variant === 'destructive' ? 'error' : 'default';
    addToast({
      title,
      description,
      variant: toastVariant
    });
  };

  return { toast };
};