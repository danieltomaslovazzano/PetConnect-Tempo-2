/**
 * Utility functions for common operations
 */

/**
 * Formats a date for display
 */
export function formatDate(
  dateString: string,
  format: "short" | "medium" | "long" = "medium",
): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    switch (format) {
      case "short":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "long":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "medium":
      default:
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to only invoke at most once per specified period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}