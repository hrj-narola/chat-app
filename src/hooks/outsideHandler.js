import { useEffect } from 'react';

export function useOutsideHandler(ref, work) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        work();
      }
    }
    // Bind the event listener
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      window.document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, work]);
}
