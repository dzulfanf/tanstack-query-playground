import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `import { useInfiniteQuery } from '@tanstack/react-query'

function PokemonInfiniteGrid() {
  const query = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    queryFn: async ({ pageParam }) => {
      const list = await fetchPokemonList(20, pageParam)
      const details = await Promise.all(
        list.results.map((p) => fetchPokemon(p.name))
      )
      return { details, hasMore: !!list.next }
    },
    initialPageParam: 0,                         // required in v5
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore
        ? allPages.length * 20                   // next offset
        : undefined,                             // no more pages
  })

  // Flatten all pages into a single array for the grid
  const pokemon = query.data?.pages.flatMap((p) => p.details) ?? []

  if (query.isPending) return <LoadingSkeleton />
  if (query.isError)   return <ErrorState />

  return (
    <div>
      <PokemonGrid pokemon={pokemon} />

      {query.hasNextPage && (
        <button
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}   // prevent double-fetch
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
        </button>
      )}

      {!query.hasNextPage && pokemon.length > 0 && (
        <p>All {pokemon.length} Pokémon loaded</p>
      )}
    </div>
  )
}`

export function SourceCodePanel05() {
  return (
    <div className="rounded-2xl glass-panel overflow-hidden">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">💻 Source Code</h3>
      </div>
      <SyntaxHighlighter
        language="tsx"
        style={oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: 'rgba(255,255,255,0.3)' }}
        wrapLines
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  )
}
