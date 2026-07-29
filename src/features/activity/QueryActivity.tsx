import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { QueryCacheNotifyEvent } from '@tanstack/react-query'
import { formatTime, formatQueryKey } from '@/shared/lib/query-events'

interface LogEntry {
  id: number
  timestamp: number
  type: QueryCacheNotifyEvent['type']
  queryKey: unknown[]
  detail?: string
}

const EVENT_STYLES: Record<string, { icon: string; color: string }> = {
  added: { icon: '➕', color: 'text-green-600' },
  removed: { icon: '🗑️', color: 'text-red-500' },
  updated: { icon: '🔄', color: 'text-blue-600' },
  observed: { icon: '👁️', color: 'text-purple-600' },
  unobserved: { icon: '👁️‍🗨️', color: 'text-gray-400' },
}

export function QueryActivity() {
  const queryClient = useQueryClient()
  const [events, setEvents] = useState<LogEntry[]>([])
  const counterRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const unsub = cache.subscribe((event) => {
      setEvents((prev) => {
        const entry: LogEntry = {
          id: ++counterRef.current,
          timestamp: Date.now(),
          type: event.type,
          queryKey: event.query.queryKey as unknown[],
          detail: event.type === 'updated' ? event.query.state.status : undefined,
        }
        const next = [...prev, entry]
        return next.length > 50 ? next.slice(-50) : next
      })
    })
    return unsub
  }, [queryClient])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">📊 Query Activity</h3>
        <button
          onClick={() => setEvents([])}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="h-48 overflow-y-auto p-3 font-mono">
        {events.length === 0 ? (
          <p className="text-center text-xs text-gray-400 pt-8">
            Events will appear here when queries run
          </p>
        ) : (
          <div className="space-y-1">
            {events.map((entry) => {
              const style = EVENT_STYLES[entry.type] ?? { icon: '•', color: 'text-gray-500' }
              return (
                <div key={entry.id} className="flex items-start gap-2">
                  <span className="shrink-0 text-gray-400 text-xs">{formatTime(entry.timestamp)}</span>
                  <span className="shrink-0">{style.icon}</span>
                  <span className={`text-xs ${style.color}`}>
                    {entry.type}
                    {entry.detail ? ` → ${entry.detail}` : ''}
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    {formatQueryKey(entry.queryKey)}
                  </span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  )
}
