
import { useRef, useCallback } from 'react';

export const useScrollToElement = () => {
    const elementRef = useRef(null);

    const scrollIntoView = useCallback((options = {}) => {
        const {
            setFocus = true,
            block = 'start',
            behavior = 'smooth',
            delay = 100
        } = options;

        if (!elementRef.current) return;

        // Wait for any state updates or renders to complete
        setTimeout(() => {
            // Scroll the element into view
            elementRef.current.scrollIntoView({
                behavior,
                block
            });

            // Set focus for accessibility if requested
            if (setFocus) {
                // First try to find and focus the first form element
                const focusableElement = elementRef.current.querySelector(
                    'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElement) {
                    focusableElement.focus();
                } else {
                    // If no focusable element is found, set tabindex temporarily to focus the container
                    elementRef.current.setAttribute('tabindex', '-1');
                    elementRef.current.focus();
                    elementRef.current.removeAttribute('tabindex');
                }
            }
        }, delay);
    }, []);

    return {
        elementRef,
        scrollIntoView
    };
};

export default useScrollToElement;
