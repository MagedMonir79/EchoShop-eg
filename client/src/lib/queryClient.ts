import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Types for API request
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestOptions = {
  withCredentials?: boolean;
  on401?: "error" | "returnNull";
};

// Method to get a query function
export function getQueryFn(options: RequestOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [url] = queryKey;
    try {
      const response = await apiRequest("GET", url, undefined, options);
      
      if (response.status === 401 && options.on401 === "returnNull") {
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && options.on401 === "returnNull") {
        return null;
      }
      throw error;
    }
  };
}

// Method to make API requests
export async function apiRequest(
  method: Method,
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: options.withCredentials ? "include" : "same-origin",
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  return fetch(url, config);
}

// Utility to handle mutations
export function createMutation(method: Method, url: string) {
  return async (data?: any) => {
    const response = await apiRequest(method, url, data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.status !== 204 ? await response.json() : undefined;
  };
}