import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

function PokemonRefetchGrid() {
  const [staleTimeMs, setStaleTimeMs] = useState(0)

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
    staleTime: staleTimeMs,   // 0 = always stale, Infinity = never stale
  })

  // isFetching && !isPending = background refresh (data already exists)
  const isBackgroundFetching = isFetching && !isPending

  if (isPending) return <LoadingSkeleton />  // first load only
  if (isError)   return <ErrorState />

  return (
    <div>
      {/* staleTime toggle buttons */}
      <button onClick={() => setStaleTimeMs(0)}>Always Stale</button>
      <button onClick={() => setStaleTimeMs(30_000)}>30s Fresh</button>
      <button onClick={() => setStaleTimeMs(Infinity)}>Forever Fresh</button>

      {/* Manual trigger */}
      <button onClick={() => refetch()}>Refetch Now</button>

      {/* Subtle background indicator — never a skeleton */}
      {isBackgroundFetching && <div>🔄 Background fetching…</div>}

      <PokemonGrid pokemon={data} />
    </div>
  )
}`

export function SourceCodePanel04() {
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
