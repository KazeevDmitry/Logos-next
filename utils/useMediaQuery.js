import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether the viewport matches a CSS media query, kept current as the
 * window changes. False during server rendering and the first paint.
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
