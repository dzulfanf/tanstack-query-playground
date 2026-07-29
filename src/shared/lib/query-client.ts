import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — data stays fresh for 5 min
      gcTime: 1000 * 60 * 10, // 10 minutes — cache survives 10 min unused
      retry: 1,
      refetchOnWindowFocus: false, // off by default for clearer learning demos
    },
  },
})
