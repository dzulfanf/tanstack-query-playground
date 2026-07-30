import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Query } from '@tanstack/react-query'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function VisualDiagram03() {
  const queryClient = useQueryClient()
  const [searchQueries, setSearchQueries] = useState<Query[]>([])

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const refresh = () => {
      setSearchQueries(
        cache.getAll().filter(
          (q) =>
            Array.isArray(q.queryKey) &&
            q.queryKey[0] === 'pokemon' &&
            q.queryKey[1] === 'search',
        ),
      )
    }
    refresh()
    const unsub = cache.subscribe(refresh)
    return unsub
  }, [queryClient])

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
        <p className="mt-0.5 text-xs text-gray-400">
          Each unique search term = a separate cache entry
        </p>
      </div>
      <div className="p-4">
        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 font-mono text-xs text-blue-700">
          {`['pokemon', 'search', `}
          <span className="font-bold text-blue-900">term</span>
          {`]`}
        </div>
        {searchQueries.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">
            No search queries yet — type something above
          </p>
        ) : (
          <div className="space-y-2">
            {searchQueries.map((q) => {
              const term = (q.queryKey as unknown[])[2] as string
              const isSuccess = q.state.status === 'success'
              const isPending = q.state.status === 'pending'
              return (
                <div
                  key={term}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                >
                  <div>
                    <code className="text-xs text-blue-600">"{term}"</code>
                    {isSuccess && (
                      <p className="text-xs text-gray-400">
                        {(q.state.data as PokemonDetail[])?.length ?? 0} results
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isSuccess
                        ? 'text-green-600'
                        : isPending
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {isSuccess ? '✅ cached' : isPending ? '⏳ loading' : '❌ error'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
