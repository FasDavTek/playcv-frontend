import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useTokenExpiration = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleTokenExpired = () => {
      toast.error('Your session has expired. Please log in again.');
      navigate('/', { replace: true });
    }

    window.addEventListener('tokenExpired', handleTokenExpired)

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired)
    }
  }, [navigate])
}