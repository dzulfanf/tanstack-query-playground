import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLearningMode, EVENT_EXPLANATIONS } from '@/shared/hooks/use-learning-mode'

export function LearningEventStrip() {
  const { enabled } = useLearningMode()
  const queryClient = useQueryClient()
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const enabledRef = useRef(enabled)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  enabledRef.current = enabled

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      if (!enabledRef.current) return
      const msg = EVENT_EXPLANATIONS[event.type]
      if (!msg) return
      if (timerRef.current) clearTimeout(timerRef.current)
      // Defer to avoid "setState during render" when cache events fire during component mount
      setTimeout(() => {
        setMessage(msg)
        setVisible(true)
        timerRef.current = setTimeout(() => setVisible(false), 4000)
      }, 0)
    })
    return () => {
      unsub()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [queryClient])

  if (!enabled && !visible) return null

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${visible && enabled ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className="bg-yellow-50/90 backdrop-blur border-b border-yellow-200/60 px-4 py-2 text-center text-xs text-yellow-800 font-medium">
        {message}
      </div>
    </div>
  )
}
