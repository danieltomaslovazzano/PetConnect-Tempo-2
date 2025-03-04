/**
 * Utility functions for API operations
 */

import { debounce, throttle, formatDate } from "@/utils/utilityModule";

/**
 * Builds a query string from filter parameters
 */
export function buildQueryString(filters: Record<string, any>): string {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  return queryParams.toString() ? `?${queryParams.toString()}` : "";
}


/**
 * Handles API errors consistently
 */
export async function handleApiError(response: Response): Promise<any> {
  let errorData: any = { error: "Unknown error", status: response.status };

  try {
    errorData = await response.json();
  } catch (e) {
    errorData.error = response.statusText || "Unknown error";
  }

  return errorData;
}

