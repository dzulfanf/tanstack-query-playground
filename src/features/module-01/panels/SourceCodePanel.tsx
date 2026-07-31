import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `// Simplified for learning — real implementation uses two queries
import { useQuery } from '@tanstack/react-query'

function PokemonGrid() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['pokemon', 'list'],  // cache key
    queryFn: () => fetchPokemonList(20, 0),
  })

  if (isPending) return <LoadingSkeleton />
  if (isError) return <ErrorState error={error} />

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.results.map((p) => (
        <PokemonCard key={p.name} name={p.name} />
      ))}
    </div>
  )
}`

export function SourceCodePanel() {
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
