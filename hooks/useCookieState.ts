import { useState, Dispatch, SetStateAction } from 'react';

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function setCookie(name: string, value: string, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

function useCookieState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getCookie(key);
      if (item) {
        return JSON.parse(decodeURIComponent(item)) as T;
      }
    } catch (e) {
      console.error("Error reading cookie key:", key, e);
    }
    
    // Fallback to local storage
    try {
      const lsItem = window.localStorage.getItem(key);
      if (lsItem) {
        const parsed = JSON.parse(lsItem) as T;
        setCookie(key, lsItem);
        return parsed;
      }
    } catch (lsErr) {
      console.error(lsErr);
    }

    return initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const strVal = JSON.stringify(valueToStore);
      setCookie(key, strVal);
      try {
        window.localStorage.setItem(key, strVal);
      } catch (e) {
        console.error(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useCookieState;
