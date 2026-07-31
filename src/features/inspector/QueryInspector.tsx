import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Query, QueryObserverOptions } from '@tanstack/react-query'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
}

const FETCH_STATUS_COLORS: Record<string, string> = {
  fetching: 'bg-blue-100 text-blue-700',
  paused: 'bg-orange-100 text-orange-700',
  idle: 'bg-gray-100 text-gray-600',
}

interface Props {
  queryKey?: unknown[]
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-gray-800">{children}</span>
    </div>
  )
}

export function QueryInspector({ queryKey }: Props) {
  const queryClient = useQueryClient()
  const [queryState, setQueryState] = useState<Query | null>(null)

  useEffect(() => {
    const cache = queryClient.getQueryCache()

    const refresh = () => {
      if (!queryKey) {
        const all = cache.getAll()
        setQueryState(all[all.length - 1] ?? null)
        return
      }
      const q = cache.find({ queryKey })
      setQueryState(q ?? null)
    }

    refresh()
    const unsub = cache.subscribe(refresh)
    return unsub
  }, [queryClient, queryKey])

  if (!queryState) {
    return (
      <div className="rounded-xl bg-white/30 p-4 text-center text-xs text-gray-500">
        No query to inspect yet
      </div>
    )
  }

  const { state } = queryState
  const observerOptions = queryState.options as QueryObserverOptions
  const rawStaleTime = observerOptions.staleTime
  const staleTime = typeof rawStaleTime === 'function'
    ? rawStaleTime(queryState as Query)
    : (rawStaleTime ?? 0)
  const gcTime = (queryState.options.gcTime) ?? 300_000
  const isStale = queryState.isStale()
  const observerCount = queryState.observers.length
  const updatedAt = state.dataUpdatedAt
    ? new Date(state.dataUpdatedAt).toLocaleTimeString('en-US', { hour12: false })
    : '—'

  return (
    <div className="rounded-2xl glass-panel p-4">
      <h3 className="mb-3 text-sm font-bold text-gray-900">Query Inspector</h3>

      <div className="mb-3 rounded-lg bg-white/30 px-2 py-1">
        <p className="truncate font-mono text-xs text-gray-500">
          {JSON.stringify(queryState.queryKey)}
        </p>
      </div>

      <Field label="Status">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[state.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {state.status}
        </span>
      </Field>

      <Field label="Fetch Status">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FETCH_STATUS_COLORS[state.fetchStatus] ?? 'bg-gray-100 text-gray-600'}`}>
          {state.fetchStatus}
        </span>
      </Field>

      <Field label="Stale">{isStale ? 'Yes' : 'No'}</Field>
      <Field label="Observers">{observerCount}</Field>
      <Field label="Updated At">{updatedAt}</Field>
      <Field label="staleTime">
        {staleTime === 'static' ? 'static' : staleTime === Infinity ? 'Infinity' : `${staleTime / 1000}s`}
      </Field>
      <Field label="gcTime">{`${gcTime / 1000}s`}</Field>
    </div>
  )
}
