import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';

export const useToast = () => {
  const toastIdRef = useRef<string | number | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    if (!toastIdRef.current || !toast.isActive(toastIdRef.current)) {
      toastIdRef.current = toast[type](message, { autoClose: 6000 });
    }
  };

  const dismissToast = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  return { showToast, dismissToast };
};

export default useToast;