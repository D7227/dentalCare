// Redux Persist Debug Utilities

export const debugReduxPersist = () => {
  console.log('=== Redux Persist Debug ===');
  
  // Check localStorage
  const persistKey = 'persist:root';
  const storedData = localStorage.getItem(persistKey);
  console.log('Stored data in localStorage:', storedData);
  
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      console.log('Parsed stored data:', parsedData);
      
      if (parsedData.auth) {
        const authData = JSON.parse(parsedData.auth);
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
  } else {
  }
  
  // Check all localStorage keys
  
  // Check if there are any other persist keys
  const allKeys = Object.keys(localStorage);
  const persistKeys = allKeys.filter(key => key.startsWith('persist:'));
  console.log('All persist keys:', persistKeys);
};

export const clearReduxPersist = () => {
  console.log('Clearing Redux Persist data...');
  localStorage.removeItem('persist:root');
  console.log('Redux Persist data cleared');
};

export const forceRehydrate = (store: any) => {
  console.log('Force rehydrating Redux store...');
  store.dispatch({ type: 'persist/REHYDRATE' });
};

export const manuallySetUser = (userData: any) => {
  console.log('Manually setting user data in localStorage...');
  const persistKey = 'persist:root';
  const currentData = localStorage.getItem(persistKey);
  
  let parsedData: any = {};
  if (currentData) {
    try {
      parsedData = JSON.parse(currentData);
    } catch (error) {
      console.error('Error parsing current data:', error);
    }
  }
  
  // Create auth data
  const authData = {
    user: userData,
    isAuthenticated: true,
    isLoading: false,
    error: null
  };
  
  // Update the data
  parsedData.auth = JSON.stringify(authData);
  
  // Save back to localStorage
  localStorage.setItem(persistKey, JSON.stringify(parsedData));
  console.log('User data manually set:', authData);
}; 