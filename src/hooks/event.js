import { useCallback } from 'react';
import { useAppStore } from '../store/app';

/**
 * Returns event handler to toggle Dark/Light modes
 */
export function useEventSwitchDarkMode() {
  const [state, dispatch] = useAppStore();

  return useCallback(() => {
    dispatch({
      type: 'DARK_MODE',
      payload: !state.darkMode,
    });
  }, [state, dispatch]);
}
