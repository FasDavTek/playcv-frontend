import { useState, useEffect } from 'react';

export const useFirstLogin = (userId?: string) => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [shouldShowFirstLoginNotice, setShouldShowFirstLoginNotice] = useState(false);

  // Initialize first login status
  useEffect(() => {
    if (!userId) return;

    const firstLoginKey = `first_login_${userId}`;
    const firstLoginTimeKey = `first_login_time_${userId}`;
    const hasLoggedInBefore = localStorage.getItem(firstLoginKey) === 'false';
    const firstLoginData = localStorage.getItem(firstLoginTimeKey);

    if (!hasLoggedInBefore && !firstLoginData) {
      // This is a first login
      const loginTime = new Date().toISOString();
      localStorage.setItem(firstLoginTimeKey, loginTime);
      localStorage.setItem(firstLoginKey, 'false');
      setIsFirstLogin(true);
      setShouldShowFirstLoginNotice(true);
    } else if (firstLoginData) {
      // Check if within 8-day window
      try {
        const firstLoginDate = new Date(firstLoginData);
        const eightDaysLater = new Date(firstLoginDate);
        eightDaysLater.setUTCDate(eightDaysLater.getUTCDate() + 8);
        const isWithinEightDays = new Date() <= eightDaysLater;
        
        setIsFirstLogin(false);
        setShouldShowFirstLoginNotice(isWithinEightDays);
      } catch (error) {
        console.error('Error parsing first login date:', error);
        // Fallback - assume not first login
        setIsFirstLogin(false);
        setShouldShowFirstLoginNotice(false);
      }
    }
  }, [userId]);

  /**
   * Mark that the user has completed their first login process
   * (Useful if you want to manually mark completion before 8 days)
   */
  const completeFirstLogin = () => {
    if (!userId) return;
    setIsFirstLogin(false);
    setShouldShowFirstLoginNotice(false);
  };

  return {
    isFirstLogin,
    shouldShowFirstLoginNotice,
    completeFirstLogin
  };
};