import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface LearningModeContext {
  enabled: boolean
  toggle: () => void
}

const Ctx = createContext<LearningModeContext>({
  enabled: false,
  toggle: () => {},
})

const EVENT_MESSAGES: Record<string, string> = {
  added: '🆕 Query Created — TanStack Query is tracking this data',
  removed: '🗑️ Query Removed — garbage collected from cache',
  observed: '👁️ Observer Added — a component subscribed to this query',
  unobserved: '👁️‍🗨️ Observer Removed — no components watching this query',
  updated: '🔄 Query Updated — state changed',
}

export function LearningModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const queryClient = useQueryClient()
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      if (!enabledRef.current) return
      const msg = EVENT_MESSAGES[event.type]
      if (msg) toast(msg, { duration: 2000 })
    })
    return unsub
  }, [queryClient])

  return (
    <Ctx.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLearningMode() {
  return useContext(Ctx)
}
