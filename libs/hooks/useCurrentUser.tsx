import { useState, useEffect } from 'react';
import { getData } from './../../libs/utils/apis/apiMethods';
import CONFIG from './../../libs/utils/helpers/config';
import { apiEndpoints } from './../../libs/utils/apis/apiEndpoints';
import { SESSION_STORAGE_KEYS } from './../../libs/utils/sessionStorage';
import { toast } from 'react-toastify';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add other relevant fields from the PROFILE endpoint
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
        if (!token) {
          toast.error('Unable to load user profile');
          return;
        }

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.data;
        setCurrentUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching user data'));
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading, error };
};