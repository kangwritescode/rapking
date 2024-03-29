import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...funcArgs: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), delay);
  };
}

export function debouncePromise<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delay: number
): (...args: T) => Promise<R> {
  let timeoutID: ReturnType<typeof setTimeout>;

  return function (...args: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (timeoutID !== undefined) {
        clearTimeout(timeoutID);
      }

      timeoutID = setTimeout(() => {
        fn(...args)
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  };
}

export function isValidUrl(url: string) {
  try {
    new URL(url);

    return true;
  } catch (_) {
    return false;
  }
}

export function getOrdinalSuffix(number: number): string {
  if (10 <= number % 100 && number % 100 <= 20) {
    return 'th';
  } else {
    const lastDigit = number % 10;
    if (lastDigit === 1) {
      return 'st';
    } else if (lastDigit === 2) {
      return 'nd';
    } else if (lastDigit === 3) {
      return 'rd';
    } else {
      return 'th';
    }
  }
}

export function formatRapCardDate(dateObj: Date) {
  const date = dayjs(dateObj);
  const currentYear = dayjs().year();

  if (date.year() === currentYear) {
    return date.format('MMM D');
  } else {
    return date.format('MMM D, YYYY');
  }
}

export function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
