import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `function PokemonEvolutionChain({ selected }: { selected: string }) {
  // Query 1: fetch species — always enabled
  const speciesQuery = useQuery({
    queryKey: ['m07', 'species', selected],
    queryFn: () => fetchPokemonSpecies(selected),
  })

  // Derive the dependency from Query 1's data
  const evolutionUrl = speciesQuery.data?.evolution_chain.url

  // Query 2: only fires when evolutionUrl is defined
  const evolutionQuery = useQuery({
    queryKey: ['m07', 'evolution', evolutionUrl],
    queryFn: () => fetchEvolutionChain(evolutionUrl!),
    enabled: !!evolutionUrl,          // the gate
  })

  // evolutionQuery.fetchStatus === 'idle' while dormant
  // evolutionQuery.status === 'pending' while dormant (no data yet)
  // Once enabled becomes true, TanStack Query fires the fetch automatically
}`

export function SourceCodePanel07() {
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
