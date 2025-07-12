import { useState, useCallback, useEffect, useRef } from 'react';

// Types for the API hook
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface UseApiOptions<TData = any, TError = ApiError> {
  // Query options
  queryKey?: string[];
  queryFn?: () => Promise<TData>;
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number;
  cacheTime?: number;
  
  // Mutation options
  mutationFn?: (variables: any) => Promise<TData>;
  
  // Custom options
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: (data: TData | undefined, error: TError | null) => void;
  
  // Transform options
  transformData?: (data: any) => TData;
  transformError?: (error: any) => TError;
  
  // Retry options
  retry?: number | boolean;
  retryDelay?: number;
}

export interface UseApiReturn<TData = any, TError = ApiError> {
  // Data and state
  data: TData | undefined;
  error: TError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  
  // Actions
  refetch: () => Promise<any>;
  mutate: (variables?: any) => Promise<any>;
  reset: () => void;
  
  // Status helpers
  hasData: boolean;
  isEmpty: boolean;
  isStale: boolean;
  
  // Error helpers
  errorMessage: string;
  errorCode?: string;
  errorStatus?: number;
  
  // Loading states
  isInitialLoading: boolean;
  isRefetching: boolean;
  
  // Success helpers
  successMessage?: string;
  
  // Query info
  queryKey: string[];
  lastUpdated?: Date;
}

// Default API client with error handling
const apiClient = {
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: errorData.code || `HTTP_${response.status}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.status) {
        // This is already our formatted error
        throw error;
      }
      
      // Network or other errors
      throw {
        message: error.message || 'Network error occurred',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    }
  },

  get: <T>(url: string, options?: RequestInit) => 
    apiClient.request<T>(url, { ...options, method: 'GET' }),
    
  post: <T>(url: string, data?: any, options?: RequestInit) =>
    apiClient.request<T>(url, { 
      ...options, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  put: <T>(url: string, data?: any, options?: RequestInit) =>
    apiClient.request<T>(url, { 
      ...options, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  patch: <T>(url: string, data?: any, options?: RequestInit) =>
    apiClient.request<T>(url, { 
      ...options, 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  delete: <T>(url: string, options?: RequestInit) =>
    apiClient.request<T>(url, { ...options, method: 'DELETE' }),
};

// Main hook for GET requests (queries)
export function useApiQuery<TData = any, TError = ApiError>(
  options: UseApiOptions<TData, TError>
): UseApiReturn<TData, TError> {
  const {
    queryKey = [],
    queryFn,
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    cacheTime = 10 * 60 * 1000, // 10 minutes default
    onSuccess,
    onError,
    onSettled,
    transformData,
    transformError,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<{
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isFetching: boolean;
    isStale: boolean;
    lastUpdated?: Date;
  }>({
    data: undefined,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isFetching: false,
    isStale: false,
  });

  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastFetchRef = useRef<Date>();

  const executeQuery = useCallback(async (isRefetch = false) => {
    if (!queryFn || !enabled) return;

    setState(prev => ({
      ...prev,
      isLoading: !isRefetch,
      isFetching: true,
      isError: false,
      error: null,
    }));

    try {
      const data = await queryFn();
      const transformedData = transformData ? transformData(data) : data;
      
      setState(prev => ({
        ...prev,
        data: transformedData,
        error: null,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        isStale: false,
        lastUpdated: new Date(),
      }));

      lastFetchRef.current = new Date();
      retryCountRef.current = 0;
      
      onSuccess?.(transformedData);
      onSettled?.(transformedData, null);
      
      return transformedData;
    } catch (error: any) {
      const transformedError = transformError ? transformError(error) : error;
      
      if (retryCountRef.current < (typeof retry === 'number' ? retry : 3)) {
        retryCountRef.current++;
        setTimeout(() => executeQuery(isRefetch), retryDelay);
        return;
      }

      setState(prev => ({
        ...prev,
        error: transformedError,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
      }));

      onError?.(transformedError);
      onSettled?.(undefined, transformedError);
      
      throw transformedError;
    }
  }, [queryFn, enabled, transformData, transformError, onSuccess, onError, onSettled, retry, retryDelay]);

  // Initial fetch
  useEffect(() => {
    if (enabled && refetchOnMount) {
      executeQuery();
    }
  }, [enabled, refetchOnMount]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        executeQuery(true);
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled]);

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (lastFetchRef.current && staleTime) {
        const timeSinceLastFetch = Date.now() - lastFetchRef.current.getTime();
        if (timeSinceLastFetch > staleTime) {
          executeQuery(true);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, staleTime]);

  // Stale time check
  useEffect(() => {
    if (lastFetchRef.current && staleTime) {
      const checkStale = () => {
        const timeSinceLastFetch = Date.now() - lastFetchRef.current!.getTime();
        setState(prev => ({
          ...prev,
          isStale: timeSinceLastFetch > staleTime,
        }));
      };

      const staleInterval = setInterval(checkStale, 1000);
      return () => clearInterval(staleInterval);
    }
  }, [staleTime]);

  const refetch = useCallback(() => executeQuery(true), [executeQuery]);
  
  const reset = useCallback(() => {
    setState({
      data: undefined,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isFetching: false,
      isStale: false,
    });
    retryCountRef.current = 0;
    lastFetchRef.current = undefined;
  }, []);

  const hasData = Boolean(state.data);
  const isEmpty = state.data !== undefined && 
    (Array.isArray(state.data) ? state.data.length === 0 : !state.data);
  const errorMessage = (state.error as ApiError)?.message || '';
  const errorCode = (state.error as ApiError)?.code;
  const errorStatus = (state.error as ApiError)?.status;

  return {
    // Data and state
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    isError: state.isError,
    isFetching: state.isFetching,
    
    // Actions
    refetch,
    mutate: () => Promise.reject(new Error('mutate not available for queries')),
    reset,
    
    // Status helpers
    hasData,
    isEmpty,
    isStale: state.isStale,
    
    // Error helpers
    errorMessage,
    errorCode,
    errorStatus,
    
    // Loading states
    isInitialLoading: state.isLoading,
    isRefetching: state.isFetching && !state.isLoading,
    
    // Success helpers
    successMessage: state.isSuccess ? 'Data fetched successfully' : undefined,
    
    // Query info
    queryKey,
    lastUpdated: state.lastUpdated,
  };
}

// Hook for POST/PUT/PATCH/DELETE requests (mutations)
export function useApiMutation<TData = any, TError = ApiError, TVariables = any>(
  options: UseApiOptions<TData, TError>
): UseApiReturn<TData, TError> & { mutate: (variables: TVariables) => Promise<any> } {
  const {
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    transformData,
    transformError,
    retry = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<{
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isFetching: boolean;
    lastUpdated?: Date;
  }>({
    data: undefined,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isFetching: false,
  });

  const retryCountRef = useRef(0);

  const mutate = useCallback(async (variables: TVariables) => {
    if (!mutationFn) {
      throw new Error('No mutationFn provided');
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      isFetching: true,
      isError: false,
      error: null,
    }));

    try {
      const data = await mutationFn(variables);
      const transformedData = transformData ? transformData(data) : data;
      
      setState(prev => ({
        ...prev,
        data: transformedData,
        error: null,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        lastUpdated: new Date(),
      }));

      retryCountRef.current = 0;
      
      onSuccess?.(transformedData);
      onSettled?.(transformedData, null);
      
      return transformedData;
    } catch (error: any) {
      const transformedError = transformError ? transformError(error) : error;
      
      if (retryCountRef.current < (typeof retry === 'number' ? retry : 0)) {
        retryCountRef.current++;
        setTimeout(() => mutate(variables), retryDelay);
        return;
      }

      setState(prev => ({
        ...prev,
        error: transformedError,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
      }));

      onError?.(transformedError);
      onSettled?.(undefined, transformedError);
      
      throw transformedError;
    }
  }, [mutationFn, transformData, transformError, onSuccess, onError, onSettled, retry, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: undefined,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isFetching: false,
    });
    retryCountRef.current = 0;
  }, []);

  const hasData = Boolean(state.data);
  const isEmpty = false; // Mutations don't have empty state like queries
  const isStale = false; // Mutations don't have stale state
  const errorMessage = (state.error as ApiError)?.message || '';
  const errorCode = (state.error as ApiError)?.code;
  const errorStatus = (state.error as ApiError)?.status;

  return {
    // Data and state
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    isError: state.isError,
    isFetching: state.isFetching,
    
    // Actions
    refetch: () => Promise.reject(new Error('refetch not available for mutations')),
    mutate,
    reset,
    
    // Status helpers
    hasData,
    isEmpty,
    isStale,
    
    // Error helpers
    errorMessage,
    errorCode,
    errorStatus,
    
    // Loading states
    isInitialLoading: state.isLoading,
    isRefetching: false, // Mutations don't refetch
    
    // Success helpers
    successMessage: state.isSuccess ? 'Operation completed successfully' : undefined,
    
    // Query info
    queryKey: [],
    lastUpdated: state.lastUpdated,
  };
}

// Convenience hooks for common HTTP methods
export function useApiGet<TData = any, TError = ApiError>(
  url: string,
  options: Omit<UseApiOptions<TData, TError>, 'queryFn'> = {}
): UseApiReturn<TData, TError> {
  return useApiQuery({
    ...options,
    queryFn: () => apiClient.get<TData>(url),
  });
}

export function useApiPost<TData = any, TError = ApiError, TVariables = any>(
  url: string,
  options: Omit<UseApiOptions<TData, TError>, 'mutationFn'> = {}
): UseApiReturn<TData, TError> & { mutate: (variables: TVariables) => Promise<any> } {
  return useApiMutation({
    ...options,
    mutationFn: (variables: TVariables) => apiClient.post<TData>(url, variables),
  });
}

export function useApiPut<TData = any, TError = ApiError, TVariables = any>(
  url: string,
  options: Omit<UseApiOptions<TData, TError>, 'mutationFn'> = {}
): UseApiReturn<TData, TError> & { mutate: (variables: TVariables) => Promise<any> } {
  return useApiMutation({
    ...options,
    mutationFn: (variables: TVariables) => apiClient.put<TData>(url, variables),
  });
}

export function useApiPatch<TData = any, TError = ApiError, TVariables = any>(
  url: string,
  options: Omit<UseApiOptions<TData, TError>, 'mutationFn'> = {}
): UseApiReturn<TData, TError> & { mutate: (variables: TVariables) => Promise<any> } {
  return useApiMutation({
    ...options,
    mutationFn: (variables: TVariables) => apiClient.patch<TData>(url, variables),
  });
}

export function useApiDelete<TData = any, TError = ApiError>(
  url: string,
  options: Omit<UseApiOptions<TData, TError>, 'mutationFn'> = {}
): UseApiReturn<TData, TError> & { mutate: () => Promise<any> } {
  return useApiMutation({
    ...options,
    mutationFn: () => apiClient.delete<TData>(url),
  });
}

// Hook for manual API calls (not tied to React Query)
export function useManualApi<TData = any, TError = ApiError>() {
  const [state, setState] = useState<{
    data: TData | undefined;
    error: TError | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  }>({
    data: undefined,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(async (
    url: string, 
    options: RequestInit = {},
    transformData?: (data: any) => TData,
    transformError?: (error: any) => TError
  ) => {
    setState(prev => ({ ...prev, isLoading: true, isSuccess: false, isError: false, error: null }));

    try {
      const data = await apiClient.request(url, options);
      const transformedData = transformData ? transformData(data) : data as TData;
      
      setState({
        data: transformedData,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      return transformedData;
    } catch (error: any) {
      const transformedError = transformError ? transformError(error) : error;
      
      setState({
        data: undefined,
        error: transformedError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      throw transformedError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: undefined,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    hasData: Boolean(state.data),
    isEmpty: state.data !== undefined && 
      (Array.isArray(state.data) ? state.data.length === 0 : !state.data),
    errorMessage: (state.error as ApiError)?.message || '',
    errorCode: (state.error as ApiError)?.code,
    errorStatus: (state.error as ApiError)?.status,
  };
}

// Export the API client for direct use
export { apiClient };

// Default export for backward compatibility
export default useApiQuery; 