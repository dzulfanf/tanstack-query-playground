import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Query, QueryObserverOptions } from '@tanstack/react-query'
import { useLearningMode } from '@/shared/hooks/use-learning-mode'

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

const FIELD_TIPS: Record<string, string> = {
  Status: 'Status data di cache: pending = sedang loading, success = data tersedia, error = gagal fetch',
  'Fetch Status': 'Status network request: fetching = sedang request ke server, idle = tidak ada request aktif',
  Stale: 'Apakah data sudah "basi"? Jika Yes, TanStack Query akan re-fetch di background saat komponen mount',
  Observers: 'Jumlah komponen yang sedang menggunakan data ini via useQuery()',
  'Updated At': 'Waktu terakhir data berhasil di-fetch dari server',
  staleTime: 'Berapa lama data dianggap segar. Selama periode ini, tidak ada re-fetch otomatis',
  gcTime: 'Berapa lama data disimpan di cache setelah semua observer pergi. Setelah ini, data dihapus',
}

interface Props {
  queryKey?: unknown[]
}

interface FieldProps {
  label: string
  showTip: boolean
  children: React.ReactNode
}

function TooltipIcon({ tip }: { tip: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  return (
    <span ref={ref} className="relative group">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-yellow-200 text-yellow-700 text-[9px] font-bold cursor-help leading-none"
        aria-label="Tampilkan penjelasan"
      >
        ?
      </button>
      <span
        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-52 rounded-lg bg-gray-900/90 text-white text-[11px] leading-snug p-2.5 pointer-events-none transition-opacity z-50 shadow-lg ${
          open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {tip}
      </span>
    </span>
  )
}

function Field({ label, showTip, children }: FieldProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {showTip && FIELD_TIPS[label] && <TooltipIcon tip={FIELD_TIPS[label]} />}
      </div>
      <span className="text-xs font-semibold text-gray-800">{children}</span>
    </div>
  )
}

export function QueryInspector({ queryKey }: Props) {
  const queryClient = useQueryClient()
  const [queryState, setQueryState] = useState<Query | null>(null)
  const { enabled } = useLearningMode()

  useEffect(() => {
    const cache = queryClient.getQueryCache()

    const refresh = () => {
      setTimeout(() => {
        if (!queryKey) {
          const all = cache.getAll()
          setQueryState(all[all.length - 1] ?? null)
          return
        }
        const q = cache.find({ queryKey })
        setQueryState(q ?? null)
      }, 0)
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
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-900">Query Inspector</h3>
        {enabled && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            🎓 ketuk ? untuk penjelasan
          </span>
        )}
      </div>

      <div className="mb-3 rounded-lg bg-white/30 px-2 py-1">
        <p className="truncate font-mono text-xs text-gray-500">
          {JSON.stringify(queryState.queryKey)}
        </p>
      </div>

      <Field label="Status" showTip={enabled}>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[state.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {state.status}
        </span>
      </Field>

      <Field label="Fetch Status" showTip={enabled}>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FETCH_STATUS_COLORS[state.fetchStatus] ?? 'bg-gray-100 text-gray-600'}`}>
          {state.fetchStatus}
        </span>
      </Field>

      <Field label="Stale" showTip={enabled}>{isStale ? 'Yes' : 'No'}</Field>
      <Field label="Observers" showTip={enabled}>{observerCount}</Field>
      <Field label="Updated At" showTip={enabled}>{updatedAt}</Field>
      <Field label="staleTime" showTip={enabled}>
        {staleTime === 'static' ? 'static' : staleTime === Infinity ? 'Infinity' : `${staleTime / 1000}s`}
      </Field>
      <Field label="gcTime" showTip={enabled}>{`${gcTime / 1000}s`}</Field>
    </div>
  )
}
