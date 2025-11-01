import { useState, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      logger.warn('Failed to load from localStorage', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.warn('Failed to set localStorage', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return [storedValue, setValue] as const;
}
