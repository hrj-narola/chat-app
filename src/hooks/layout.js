import { useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to detect onMobile vs. onDesktop using "resize" event listener
 */
export function useOnMobileByTrackingWindowsResize() {
  const theme = useTheme();
  const [onMobile, setOnMobile] = useState(false);

  const handleResize = useCallback(() => {
    setOnMobile(window.innerWidth < theme.breakpoints.values.sm); // sx, sm are "onMobile"
  }, [theme.breakpoints.values.sm]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return onMobile;
}

/**
 * Hook to detect onMobile vs. onDesktop using Media Query
 */
export function useOnMobileByMediaQuery() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}

// export const useOnMobile = useOnMobileByTrackingWindowsResize;
export const useOnMobile = useOnMobileByMediaQuery;

/**
 * Hook to detect Wide Screen (lg, xl) using Media Query
 */
export function useOnWideScreen() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'));
}
