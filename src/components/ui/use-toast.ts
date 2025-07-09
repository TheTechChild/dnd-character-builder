import { useUIStore } from '@/stores/uiStore';

export const useToast = () => {
  const addToast = useUIStore(state => state.addToast);
  
  const toast = ({ title, description, variant = 'default' }: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    const type = variant === 'destructive' ? 'error' : 'info';
    addToast({
      type,
      title,
      message: description
    });
  };

  return { toast };
};