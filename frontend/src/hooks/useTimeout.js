import { useCallback, useEffect, useRef } from 'react';

export default function useTimeout(callback, delay) {
  const timeoutRef = useRef();
  const callbackRef = useRef(callback);

  // Remember the latest callback:
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout:
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  // Clear the timeout if the component is unmounted or the delay changes:
  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  // Set up the interval:
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  // In case you want to manually clear the timeout from the consuming component...:
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}
