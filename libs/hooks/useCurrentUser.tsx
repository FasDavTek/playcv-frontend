import { useState, useEffect } from 'react';
import { getData } from './../../libs/utils/apis/apiMethods';
import CONFIG from './../../libs/utils/helpers/config';
import { apiEndpoints } from './../../libs/utils/apis/apiEndpoints';

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
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`);
        if (!response.isSuccess) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
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