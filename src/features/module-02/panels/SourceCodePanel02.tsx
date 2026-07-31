import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `function PokemonDetailPage({ name }) {
  const queryClient = useQueryClient()

  // useState lazy init runs synchronously on first render,
  // before useQuery fires any fetch — perfect moment to read
  // from cache and record the hit/miss verdict.
  const [cacheStatus] = useState(() => {
    const state = queryClient.getQueryState(
      ['pokemon', 'detail', name]
    )
    return state?.data !== undefined ? 'hit' : 'miss'
  })

  const { data, isPending } = useQuery({
    queryKey: ['pokemon', 'detail', name],
    queryFn: () => fetchPokemon(name),
  })

  // First visit:  cacheStatus = 'miss', isPending = true → spinner
  // Second visit: cacheStatus = 'hit',  isPending = false → instant
}`

export function SourceCodePanel02() {
  return (
    <div className="overflow-hidden rounded-2xl glass-panel">
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
