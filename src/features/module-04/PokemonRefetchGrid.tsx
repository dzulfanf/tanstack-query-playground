import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import type { PokemonDetail } from '@/shared/types/pokemon'

const STALE_OPTIONS = [
  { label: 'Always Stale (0s)', value: 0 },
  { label: '30s Fresh', value: 30_000 },
  { label: 'Forever Fresh', value: Infinity },
] as const

interface Props {
  onSelect: (pokemon: PokemonDetail) => void
}

export function PokemonRefetchGrid({ onSelect }: Props) {
  const [staleTimeMs, setStaleTimeMs] = useState<number>(0)

  const listQuery = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
    staleTime: staleTimeMs,
  })

  const detailQueries = useQuery({
    queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
    queryFn: async () => {
      const details = await Promise.all(
        listQuery.data!.results.map((p) => fetchPokemon(p.name)),
      )
      return details
    },
    enabled: !!listQuery.data,
    staleTime: staleTimeMs,
  })

  const isBackgroundFetching = listQuery.isFetching && !listQuery.isPending

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600">staleTime:</span>
        {STALE_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setStaleTimeMs(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              staleTimeMs === opt.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => void listQuery.refetch()}
          className="ml-auto rounded-full bg-white/40 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white/60 transition"
        >
          Refetch Now
        </button>
      </div>

      {isBackgroundFetching && (
        <div className="rounded-xl bg-yellow-50/80 border border-yellow-200/60 px-4 py-2 text-sm text-yellow-800">
          🔄 Background fetching…
        </div>
      )}

      {listQuery.isFetching || detailQueries.isPending ? (
        <LoadingSkeleton />
      ) : listQuery.isError ? (
        <ErrorState
          error={listQuery.error as Error}
          onRetry={() => void listQuery.refetch()}
        />
      ) : detailQueries.isError ? (
        <ErrorState
          error={detailQueries.error as Error}
          onRetry={() => void detailQueries.refetch()}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(detailQueries.data ?? []).map((p) => (
            <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
