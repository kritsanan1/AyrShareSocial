
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useApi<T = any>(
  endpoint: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => apiRequest(endpoint),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}

export function useApiMutation<T = any>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST') {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data?: any) => 
      apiRequest(endpoint, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
}
