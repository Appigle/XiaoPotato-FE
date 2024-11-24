import { useEffect, useRef } from 'react';
import { dismissAllToast } from '../toastUtils';

/**
 * Hook to dynamically add text to a target DOM element
 * @param selector - CSS selector for target element
 * @param text - Text to be inserted
 */
export const useAddDynamicTextToDom = (
  selector: string,
  text: string,
  title: string = '',
): void => {
  // Ref to track if text element is already added
  const textElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Find target element
    const targetElement = document.querySelector(selector);

    if (!targetElement) {
      console.warn(`Element with selector "${selector}" not found`);
      return;
    }

    // Create text element if it doesn't exist
    if (!textElementRef.current) {
      const textElement = document.createElement('div');
      textElement.addEventListener('click', dismissAllToast);
      !!title && (textElement.title = title);
      textElement.className =
        'dynamic-text-element absolute top-[4px] cursor-pointer right-6 z-[10001] dark:text-gray-300 rounded-lg text-gray-900 text-[10px] dark:bg-gray-300/30 dark:hover:text-blue-gray-900/90 dark:hover:bg-gray-200 hover:bg-gray-300 px-2';
      textElement.textContent = text;

      // Add custom styles to handle visibility
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Hide the dynamic text when there are no other elements */
        ${selector}:not(:has(*:not(.dynamic-text-element))) .dynamic-text-element {
          display: none;
        }
      `;

      // Insert style and text elements
      document.head.appendChild(styleElement);
      targetElement.appendChild(textElement);

      // Store reference
      textElementRef.current = textElement;
    }

    // Cleanup function
    return () => {
      if (textElementRef.current) {
        textElementRef.current.removeEventListener('click', dismissAllToast);
        textElementRef.current.remove();
        textElementRef.current = null;
      }
    };
  }, [selector, text, title]);
};
