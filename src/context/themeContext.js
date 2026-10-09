import { createContext, useContext } from 'react';
import useMediaQuery from '../../utils/useMediaQuery';

const ThemeContext = createContext({});

const gutters = {
  gorizontal: { xs: 10, sm: 10, md: 15, lg: 20, xl: 20, xxl: 30 },
  vertical: { xs: 10, sm: 10, md: 15, lg: 20, xl: 20, xxl: 30 },
};

/** Layout settings per viewport width, smallest first. */
const BREAKPOINTS = [
  {
    id: 'xs',
    query: '(max-width:575px)',
    size: 'middle',
    elementHeight: 32,
    isDesktop: false,
    appContainerPadding: 0,
  },
  {
    id: 'sm',
    query: '(min-width: 576px) and (max-width: 767px)',
    size: 'middle',
    elementHeight: 32,
    isDesktop: false,
    appContainerPadding: 0,
  },
  {
    id: 'md',
    query: '(min-width: 768px) and (max-width: 991px)',
    size: 'middle',
    elementHeight: 32,
    isDesktop: true,
    appContainerPadding: 20,
  },
  {
    id: 'lg',
    query: '(min-width: 992px) and (max-width: 1200px)',
    size: 'middle',
    elementHeight: 32,
    isDesktop: true,
    appContainerPadding: 30,
  },
  {
    id: 'xl',
    query: '(min-width: 1201px) and (max-width: 1600px)',
    size: 'large',
    elementHeight: 40,
    isDesktop: true,
    appContainerPadding: 50,
  },
  {
    id: 'xxl',
    query: '(min-width: 1601px)',
    size: 'large',
    elementHeight: 40,
    isDesktop: true,
    appContainerPadding: 50,
  },
];

/** Used before the browser reports its width (server rendering, first paint). */
const FALLBACK = BREAKPOINTS[4];

/**
 * The current breakpoint and the sizes that go with it: `id`, `size` (antd
 * control size), `elementHeight`, `isDesktop`, `appContainerPadding` and
 * `gutters`. Reference data is not kept here; see src/hooks/useReference.js.
 */
export function ThemeProvider({ children }) {
  // Hooks cannot run in a loop of unknown length, but this list is fixed.
  const matches = [
    useMediaQuery(BREAKPOINTS[0].query),
    useMediaQuery(BREAKPOINTS[1].query),
    useMediaQuery(BREAKPOINTS[2].query),
    useMediaQuery(BREAKPOINTS[3].query),
    useMediaQuery(BREAKPOINTS[4].query),
    useMediaQuery(BREAKPOINTS[5].query),
  ];
  const index = matches.lastIndexOf(true);
  const { query, ...current } = index >= 0 ? BREAKPOINTS[index] : FALLBACK;

  return <ThemeContext.Provider value={{ ...current, gutters }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
