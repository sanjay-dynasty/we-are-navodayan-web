import { useSyncExternalStore } from 'react';

function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);

    mediaQuery.addEventListener('change', callback);

    return () => {
      mediaQuery.removeEventListener('change', callback);
    };
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
