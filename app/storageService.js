// services/storageService.js

export const saveObjectToStorage = (data, storageKey) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      console.error('localStorage is not available');
    }
  };
  
  export const getObjectFromStorage = (storageKey) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedData = localStorage.getItem(storageKey);
      return storedData ? JSON.parse(storedData) : null;
    } else {
      console.error('localStorage is not available');
      return null;
    }
  };
  
  export const clearStorage = (storageKey) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(storageKey);
    } else {
      console.error('localStorage is not available');
    }
  };