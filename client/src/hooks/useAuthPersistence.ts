import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/userDataSlice';

export const useAuthPersistence = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.userData);
  useEffect(() => {
 // Check if we have user data in localStorage but not in Redux
    if (!userData) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userDataObj = JSON.parse(storedUser);
          console.log('Found stored user, restoring to Redux:', userDataObj);
          dispatch(setUser(userDataObj));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
   }
  }, [dispatch, userData]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      console.log('Saving user to localStorage:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.log('Clearing user from localStorage');
      localStorage.removeItem('user');
    }
  }, [userData]);

  return { user: userData, isAuthenticated: !!userData };
}; 