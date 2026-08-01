import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'

export function PokemonInfiniteGrid() {
  const query = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const list = await fetchPokemonList(20, pageParam)
      const details = await Promise.all(
        list.results.map((p) => fetchPokemon(p.name)),
      )
      return { details, hasMore: !!list.next }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * 20 : undefined,
  })

  const pokemon = query.data?.pages.flatMap((p) => p.details) ?? []

  if (query.isPending) {
    return <LoadingSkeleton />
  }

  if (query.isError) {
    return (
      <ErrorState
        error={query.error as Error}
        onRetry={() => void query.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {query.hasNextPage && (
          <button
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
          </button>
        )}
        {!query.hasNextPage && pokemon.length > 0 && (
          <p className="text-sm text-gray-400">All {pokemon.length} Pokémon loaded</p>
        )}
      </div>
    </div>
  )
}
