import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
 // Check if we have user data in localStorage but not in Redux
    if (!user && !isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Found stored user, restoring to Redux:', userData);
          dispatch(setUser(userData));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
   }
  }, [dispatch]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user && isAuthenticated) {
      console.log('Saving user to localStorage:', user);
      localStorage.setItem('user', JSON.stringify(user));
    } else if (!user && !isAuthenticated) {
      console.log('Clearing user from localStorage');
      localStorage.removeItem('user');
    }
  }, [user, isAuthenticated]);

  return { user, isAuthenticated };
}; 