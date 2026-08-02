import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `const queryClient = useQueryClient()

// On hover: prefetch silently into cache
async function handleMouseEnter(name: string) {
  await queryClient.prefetchQuery({
    queryKey: ['m06', 'detail', name],   // same key as detail component
    queryFn: () => fetchPokemon(name),
    staleTime: 60_000,                   // skip if already fresh
  })
}

// On click: open detail — data may already be in cache
function handleClick(pokemon: PokemonDetail) {
  setSelected(pokemon)
}

// In JSX:
<div onMouseEnter={() => handleMouseEnter(p.name)}>
  <PokemonCard pokemon={p} onClick={handleClick} />
</div>

// Detail component — instant if prefetched, loading if not:
function PokemonDetailPanel({ name }: { name: string }) {
  const { data, isPending } = useQuery({
    queryKey: ['m06', 'detail', name],   // same key — cache hit!
    queryFn: () => fetchPokemon(name),
  })

  if (isPending) return <Spinner />      // only shows if NOT prefetched
  return <PokemonCard pokemon={data} />
}`

export function SourceCodePanel06() {
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
