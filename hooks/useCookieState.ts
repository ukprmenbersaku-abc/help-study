import { useState, Dispatch, SetStateAction } from 'react';

export function getRawCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch (e) {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
}

export function setRawCookie(name: string, value: string, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
}

export function getCookie(name: string): string | null {
  const chunksCountStr = getRawCookie(`${name}_chunks`);
  if (chunksCountStr) {
    const count = parseInt(chunksCountStr, 10);
    let fullValue = '';
    for (let j = 0; j < count; j++) {
      const chunk = getRawCookie(`${name}_${j}`);
      if (chunk !== null) {
        fullValue += chunk;
      }
    }
    return encodeURIComponent(fullValue);
  }

  const normalVal = getRawCookie(name);
  if (normalVal !== null) {
    return encodeURIComponent(normalVal);
  }
  return null;
}

export function setCookie(name: string, value: string, days = 365) {
  if (name !== 'cookie_consent') {
    const consent = getRawCookie('cookie_consent');
    if (consent !== 'true') {
      return; // Do not write data cookies if consent is not granted
    }
  }

  // Clear any existing chunk-related cookies first to prevent stale chunks
  let i = 0;
  while (true) {
    if (getRawCookie(`${name}_${i}`) !== null) {
      deleteCookie(`${name}_${i}`);
      i++;
    } else {
      break;
    }
  }
  deleteCookie(name);
  deleteCookie(`${name}_chunks`);

  const encodedValue = encodeURIComponent(value);
  const CHUNK_SIZE = 3000; // safe chunk size well below 4KB

  if (encodedValue.length <= CHUNK_SIZE) {
    setRawCookie(name, value, days);
  } else {
    const chunksCount = Math.ceil(encodedValue.length / CHUNK_SIZE);
    let start = 0;
    for (let j = 0; j < chunksCount; j++) {
      let chunkEnd = start + CHUNK_SIZE;
      if (chunkEnd < encodedValue.length) {
        // Prevent splitting inside a URL percent-encoded sequence (%XX)
        if (encodedValue.charAt(chunkEnd - 1) === '%') {
          chunkEnd -= 1;
        } else if (encodedValue.charAt(chunkEnd - 2) === '%') {
          chunkEnd -= 2;
        }
      }
      const chunk = encodedValue.substring(start, chunkEnd);
      setRawCookie(`${name}_${j}`, decodeURIComponent(chunk), days);
      start = chunkEnd;
      if (start >= encodedValue.length) {
        setRawCookie(`${name}_chunks`, String(j + 1), days);
        break;
      }
    }
  }
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
        const consent = getRawCookie('cookie_consent');
        if (consent === 'true') {
          setCookie(key, lsItem);
        }
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
      
      const consent = getRawCookie('cookie_consent');
      if (consent === 'true') {
        setCookie(key, strVal);
      }
      
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
