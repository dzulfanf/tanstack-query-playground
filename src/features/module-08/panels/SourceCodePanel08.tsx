import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `const queryClient = useQueryClient()

// Read: standard useQuery
const teamQuery = useQuery({
  queryKey: ['m08', 'team'],
  queryFn: () => getTeamFromServer(),
})

// Write: useMutation
const addMutation = useMutation({
  mutationFn: async (name: string) => {
    await delay(800)               // simulate network latency
    addToTeam(name)                // write to "server"
  },
  onSuccess: () => {
    // Bridge between write and read:
    queryClient.invalidateQueries({ queryKey: ['m08', 'team'] })
  },
  // onError is called automatically if mutationFn throws
})

// Trigger the mutation:
<button
  onClick={() => addMutation.mutate(pokemon.name)}
  disabled={addMutation.isPending}
>
  {addMutation.isPending ? 'Adding…' : 'Add to Team'}
</button>`

export function SourceCodePanel08() {
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
