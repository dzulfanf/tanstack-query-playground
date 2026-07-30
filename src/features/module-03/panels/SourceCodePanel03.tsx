import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `function SearchResults({ search }) {
  // 500ms debounce — avoids a fetch on every keystroke
  const debouncedSearch = useDebounce(search, 500)

  const { data, isPending } = useQuery({
    // Dynamic key — each unique term is its own cache entry
    queryKey: ['pokemon', 'search', debouncedSearch],
    queryFn: () => searchPokemon(debouncedSearch),
    // Only fetch when there's actual text
    enabled: debouncedSearch.trim().length > 0,
  })

  // Type 'char' → key ['pokemon','search','char'] → MISS → fetch
  // Type 'bulb' → key ['pokemon','search','bulb'] → MISS → fetch
  // Type 'char' → key ['pokemon','search','char'] → HIT ✅
}`

export function SourceCodePanel03() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">💻 Source Code</h3>
      </div>
      <SyntaxHighlighter
        language="tsx"
        style={oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: '#fafafa' }}
        wrapLines
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  )
}
