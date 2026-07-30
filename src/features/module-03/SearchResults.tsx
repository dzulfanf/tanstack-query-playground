import { useQuery } from '@tanstack/react-query'
import { searchPokemon } from '@/shared/services/pokemon-api'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import type { PokemonDetail } from '@/shared/types/pokemon'

interface Props {
  search: string
  onSelect?: (pokemon: PokemonDetail) => void
}

export function SearchResults({ search, onSelect }: Props) {
  const debouncedSearch = useDebounce(search, 500)

  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['pokemon', 'search', debouncedSearch],
    queryFn: () => searchPokemon(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0,
  })

  if (!debouncedSearch.trim()) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">
        Type a Pokémon name to search
      </div>
    )
  }

  if (isPending || isFetching) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <Skeleton className="mb-2 h-20 w-full rounded-xl" />
            <Skeleton className="mx-auto mb-1 h-3 w-10" />
            <Skeleton className="mx-auto h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (isError && error) {
    return <ErrorState error={error as Error} onRetry={refetch} />
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">
        No Pokémon found matching "{debouncedSearch}"
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {data.map((p) => (
        <PokemonCard key={p.name} pokemon={p} onClick={() => onSelect?.(p)} />
      ))}
    </div>
  )
}
