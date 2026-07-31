import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface PulseTabs {
  inspector: boolean
  activity: boolean
}

interface LearningModeContext {
  enabled: boolean
  toggle: () => void
  lastEvent: { type: string; message: string } | null
  pulseTabs: PulseTabs
}

const Ctx = createContext<LearningModeContext>({
  enabled: false,
  toggle: () => {},
  lastEvent: null,
  pulseTabs: { inspector: false, activity: false },
})

export const EVENT_EXPLANATIONS: Record<string, string> = {
  added: '🆕 Query created — TanStack Query mulai tracking data ini di cache',
  removed: '🗑️ Query removed — di-garbage collect setelah tidak ada komponen yang menggunakannya',
  observerAdded: '👁️ Observer added — sebuah komponen memanggil useQuery untuk data ini',
  observerRemoved: '👁️‍🗨️ Observer removed — tidak ada komponen yang watching query ini sekarang',
  updated: '🔄 Query updated — state data berubah (misal: loading → success, atau data di-refresh)',
}

export function LearningModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('learning-mode') === 'true')
  const [lastEvent, setLastEvent] = useState<{ type: string; message: string } | null>(null)
  const [pulseTabs, setPulseTabs] = useState<PulseTabs>({ inspector: false, activity: false })
  const queryClient = useQueryClient()
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  const pulseFor = useCallback((keys: Partial<PulseTabs>) => {
    setPulseTabs((prev) => ({ ...prev, ...keys }))
    setTimeout(() => setPulseTabs((prev) => ({ ...prev, inspector: false, activity: false })), 900)
  }, [])

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      if (!enabledRef.current) return
      const msg = EVENT_EXPLANATIONS[event.type]
      if (!msg) return
      // Defer to avoid "setState during render" warning when cache events
      // fire synchronously during component mount/unmount cycles
      setTimeout(() => {
        setLastEvent({ type: event.type, message: msg })
        pulseFor({ inspector: true, activity: true })
      }, 0)
    })
    return unsub
  }, [queryClient, pulseFor])

  const toggle = () => setEnabled((v) => {
    const next = !v
    localStorage.setItem('learning-mode', String(next))
    return next
  })

  return (
    <Ctx.Provider value={{ enabled, toggle, lastEvent, pulseTabs }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLearningMode() {
  return useContext(Ctx)
}
