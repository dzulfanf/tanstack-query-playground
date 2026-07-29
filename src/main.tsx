import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient } from '@/shared/lib/query-client'
import { router } from '@/app/router'
import { LearningModeProvider } from '@/shared/hooks/use-learning-mode'
import { Toaster } from '@/components/ui/sonner'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LearningModeProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </LearningModeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
