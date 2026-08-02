import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'

interface Props {
  onSelect: (name: string) => void
}

export function PokemonPrefetchGrid({ onSelect }: Props) {
  const queryClient = useQueryClient()
  const [prefetched, setPrefetched] = useState<Set<string>>(new Set())

  const listQuery = useQuery({
    queryKey: ['m06', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
  })

  const detailsQuery = useQuery({
    queryKey: ['m06', 'details'],
    queryFn: async () => {
      if (!listQuery.data) return []
      return Promise.all(listQuery.data.results.map((p) => fetchPokemon(p.name)))
    },
    enabled: !!listQuery.data,
  })

  async function handleMouseEnter(name: string) {
    if (prefetched.has(name)) return
    await queryClient.prefetchQuery({
      queryKey: ['m06', 'detail', name],
      queryFn: () => fetchPokemon(name),
      staleTime: 60_000,
    })
    setPrefetched((prev) => new Set(prev).add(name))
  }

  if (listQuery.isPending || detailsQuery.isPending) return <LoadingSkeleton />
  if (listQuery.isError) {
    return <ErrorState error={listQuery.error as Error} onRetry={() => void listQuery.refetch()} />
  }
  if (detailsQuery.isError) {
    return (
      <ErrorState
        error={detailsQuery.error as Error}
        onRetry={() => void detailsQuery.refetch()}
      />
    )
  }

  const pokemon = detailsQuery.data ?? []

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {pokemon.map((p) => (
        <div
          key={p.id}
          className="relative"
          onMouseEnter={() => void handleMouseEnter(p.name)}
        >
          {prefetched.has(p.name) && (
            <span className="absolute -top-1.5 -right-1.5 z-10 rounded-full bg-green-400 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              ⚡ cached
            </span>
          )}
          <PokemonCard pokemon={p} onClick={() => onSelect(p.name)} />
        </div>
      ))}
    </div>
  )
}
