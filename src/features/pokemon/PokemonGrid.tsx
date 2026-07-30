import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import { EmptyState } from '@/features/pokemon/EmptyState'
import type { PokemonDetail } from '@/shared/types/pokemon'

interface Props {
  onSelect: (pokemon: PokemonDetail) => void
}

export function PokemonGrid({ onSelect }: Props) {
  const listQuery = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
  })

  const detailQueries = useQuery({
    queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
    queryFn: async () => {
      if (!listQuery.data) return []
      const details = await Promise.all(
        listQuery.data.results.map((p) => fetchPokemon(p.name)),
      )
      return details
    },
    enabled: !!listQuery.data,
  })

  if (listQuery.isPending || detailQueries.isPending) {
    return <LoadingSkeleton />
  }

  if (listQuery.isError) {
    return <ErrorState error={listQuery.error as Error} onRetry={() => void listQuery.refetch()} />
  }

  if (detailQueries.isError) {
    return <ErrorState error={detailQueries.error as Error} onRetry={() => void detailQueries.refetch()} />
  }

  const pokemon = detailQueries.data ?? []

  if (pokemon.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
      ))}
    </div>
  )
}
